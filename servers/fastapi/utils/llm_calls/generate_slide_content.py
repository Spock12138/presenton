from datetime import datetime
from typing import Optional
from models.llm_message import LLMSystemMessage, LLMUserMessage
from models.presentation_layout import SlideLayoutModel
from models.presentation_outline_model import SlideOutlineModel
from services.llm_client import LLMClient
from utils.llm_client_error_handler import handle_llm_client_exceptions
from utils.llm_provider import get_model
from utils.schema_utils import (
    add_field_in_schema,
    remove_defaults_from_schema,
    remove_fields_from_schema,
    clean_llm_response,
)


def get_system_prompt(
    tone: Optional[str] = None,
    verbosity: Optional[str] = None,
    instructions: Optional[str] = None,
):
    return f"""
        Generate structured slide content based on the provided outline.

        {"# User Instructions:" if instructions else ""}
        {instructions or ""}

        {"# Tone:" if tone else ""}
        {tone or ""}

        {"# Verbosity:" if verbosity else ""}
        {verbosity or ""}

        # CRITICAL RULES
        1. **STRICTLY FOLLOW THE OUTLINE**: You must generate content EXACTLY as described in the outline. Do not hallucinate new topics. Do not change the meaning.
        2. **LANGUAGE**: All visible text (titles, paragraphs, lists, speaker notes) MUST be in the target language (Chinese). Only "prompts" and "queries" (keys starting with __) should be in English.
        3. **IMAGES & ICONS**:
           - If the schema has `backgroundImage` or `image` or `heroImage`, you MUST return an object: `{{ "__image_prompt__": "Description of the image in English or Chinese" }}`.
           - If the schema has `icon` (or similar), you MUST return an object: `{{ "__icon_query__": "English search term", "__icon_url__": "/static/icons/placeholder.svg" }}`.
           - **DO NOT** return a string URL for `backgroundImage` or `image` or `icon` unless you are absolutely sure it is a valid public URL (e.g. placeholder). Better to just provide the prompt.
           - **DO NOT** invent new fields. Use ONLY the fields defined in the schema.

        # Notes
        - Slide body should not use words like "This slide", "This presentation".
        - Rephrase the slide body to make it flow naturally.
        - Only use markdown to highlight important points.
        - Speaker note should be normal text, not markdown.
        - Strictly follow the max and min character limit.
        - Metrics should be abbreviated.
        - Do not add emojis.

        - IMPORTANT: Provide output in JSON format and **don't include <parameters> tags**.
        - IMPORTANT: The output must strictly follow the provided JSON schema. Do not wrap the response in a "slide" object.
    """


def get_user_prompt(outline: str, language: str):
    return f"""
        ## Current Date and Time
        {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}

        ## Target Language
        {language} (All visible content must be in this language)

        ## Image/Icon Prompt Language
        - Image Prompts: Chinese (if target language is Chinese) or English.
        - Icon Search Queries: English (Always).

        ## Slide Outline (STRICTLY FOLLOW THIS)
        {outline}
    """


def get_messages(
    outline: str,
    language: str,
    tone: Optional[str] = None,
    verbosity: Optional[str] = None,
    instructions: Optional[str] = None,
):

    return [
        LLMSystemMessage(
            content=get_system_prompt(tone, verbosity, instructions),
        ),
        LLMUserMessage(
            content=get_user_prompt(outline, language),
        ),
    ]


async def get_slide_content_from_type_and_outline(
    slide_layout: SlideLayoutModel,
    outline: SlideOutlineModel,
    language: str,
    tone: Optional[str] = None,
    verbosity: Optional[str] = None,
    instructions: Optional[str] = None,
):
    client = LLMClient()
    model = get_model()

    response_schema = remove_fields_from_schema(
        slide_layout.json_schema, ["__image_url__", "__icon_url__"]
    )
    response_schema = remove_defaults_from_schema(response_schema)
    response_schema = add_field_in_schema(
        response_schema,
        {
            "__speaker_note__": {
                "type": "string",
                "minLength": 100,
                "maxLength": 250,
                "description": "Speaker note for the slide",
            }
        },
        True,
    )

    # Force all fields to be required to prevent LLM from skipping them
    if "properties" in response_schema:
        if "required" not in response_schema:
            response_schema["required"] = []
        
        for key in response_schema["properties"]:
            if key not in response_schema["required"]:
                response_schema["required"].append(key)
    
    # Also recursively enforce required for nested objects (like backgroundImage)
    def make_all_fields_required(schema):
        if not isinstance(schema, dict):
            return
        
        if "properties" in schema:
            if "required" not in schema:
                schema["required"] = []
            
            for key in schema["properties"]:
                if key not in schema["required"]:
                    schema["required"].append(key)
                # Recurse
                make_all_fields_required(schema["properties"][key])
    
    make_all_fields_required(response_schema)

    try:
        response = await client.generate_structured(
            model=model,
            messages=get_messages(
                outline.content,
                language,
                tone,
                verbosity,
                instructions,
            ),
            response_format=response_schema,
            strict=False,
        )

        # Fix: Unwrap "slide" object if LLM wraps the response
        if isinstance(response, dict) and "slide" in response and isinstance(response["slide"], dict):
            slide_content = response.pop("slide")
            # Preserve speaker note if it's at the root
            if "__speaker_note__" in response:
                slide_content["__speaker_note__"] = response["__speaker_note__"]
            # If speaker note is inside slide, it will be preserved naturally
            response = slide_content
        
        return response

    except Exception as e:
        # Fallback to standard error handling
        return handle_llm_client_exceptions(e)
