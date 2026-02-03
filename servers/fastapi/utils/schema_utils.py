from copy import deepcopy
from typing import Any, List

from openai import NOT_GIVEN

from utils.dict_utils import (
    get_dict_paths_with_key,
    get_dict_at_path,
    has_more_than_n_keys,
)

supported_string_formats = [
    "date-time",
    "time",
    "date",
    "duration",
    "email",
    "hostname",
    "ipv4",
    "ipv6",
    "uuid",
]


def remove_fields_from_schema(schema: dict, fields_to_remove: List[str]):
    schema = deepcopy(schema)
    properties_paths = get_dict_paths_with_key(schema, "properties")
    for path in properties_paths:
        parent_obj = get_dict_at_path(schema, path)
        if "properties" in parent_obj and isinstance(parent_obj["properties"], dict):
            for field in fields_to_remove:
                if field in parent_obj["properties"]:
                    del parent_obj["properties"][field]

    required_paths = get_dict_paths_with_key(schema, "required")
    for path in required_paths:
        parent_obj = get_dict_at_path(schema, path)
        if "required" in parent_obj and isinstance(parent_obj["required"], list):
            parent_obj["required"] = [
                field
                for field in parent_obj["required"]
                if field not in fields_to_remove
            ]

    return schema


def add_field_in_schema(schema: dict, field: dict, required: bool = False) -> dict:

    if not isinstance(field, dict) or len(field) != 1:
        raise ValueError(
            "`field` must be a dict with exactly one entry: {name: schema_dict}"
        )

    field_name, field_schema = next(iter(field.items()))
    if not isinstance(field_name, str):
        raise TypeError("Field name must be a string")
    if not isinstance(field_schema, dict):
        raise TypeError("Field schema must be a dictionary")

    updated_schema: dict = deepcopy(schema)

    root_properties = updated_schema.get("properties")
    if not isinstance(root_properties, dict):
        updated_schema["properties"] = {}
        root_properties = updated_schema["properties"]

    root_properties[field_name] = field_schema

    # Update root-level required based on the flag
    existing_required = updated_schema.get("required")
    if not isinstance(existing_required, list):
        existing_required = []

    if required:
        if field_name not in existing_required:
            existing_required.append(field_name)
    else:
        if field_name in existing_required:
            existing_required = [name for name in existing_required if name != field_name]

    if existing_required:
        updated_schema["required"] = existing_required
    else:
        updated_schema.pop("required", None)

    return updated_schema


def remove_defaults_from_schema(schema: dict):
    """
    Recursively remove 'default' keys from a JSON schema.
    """
    if not isinstance(schema, dict):
        return schema
    
    # Remove 'default' key if present
    if "default" in schema:
        del schema["default"]
        
    # Recursively process dictionary values
    for key, value in schema.items():
        if isinstance(value, dict):
            remove_defaults_from_schema(value)
        elif isinstance(value, list):
            for item in value:
                if isinstance(item, dict):
                    remove_defaults_from_schema(item)
                    
    return schema


def clean_llm_response(response: Any, schema: dict) -> Any:
    """
    Cleans the LLM response to match the schema.
    Specifically fixes cases where the LLM returns an object {text, icon} 
    but the schema expects a string.
    """
    if not isinstance(schema, dict):
        return response

    schema_type = schema.get("type")

    # CASE 1: Schema expects string, but got dict
    if schema_type == "string":
        if isinstance(response, dict):
            # Prioritize 'text', then 'content', then 'title'
            for key in ['text', 'content', 'title', 'value']:
                if key in response and isinstance(response[key], str):
                    return response[key]
            
            # If we can't find a text field, just return the string representation
            # This handles edge cases but hopefully the above covers most
            return str(response)
        return response

    # CASE 2: Schema expects object, recurse
    if schema_type == "object" and isinstance(response, dict):
        properties = schema.get("properties", {})
        cleaned_response = {}
        for key, value in response.items():
            if key in properties:
                cleaned_response[key] = clean_llm_response(value, properties[key])
            else:
                cleaned_response[key] = value
        return cleaned_response

    # CASE 3: Schema expects array, recurse
    if schema_type == "array" and isinstance(response, list):
        items_schema = schema.get("items", {})
        return [clean_llm_response(item, items_schema) for item in response]

    return response


# From OpenAI
def ensure_strict_json_schema(
    json_schema: object,
    *,
    path: tuple[str, ...],
    root: dict[str, object],
) -> dict[str, Any]:
    """Mutates the given JSON schema to ensure it conforms to the `strict` standard
    that the API expects.
    """
    if not isinstance(json_schema, dict):
        raise TypeError(f"Expected {json_schema} to be a dictionary; path={path}")

    defs = json_schema.get("$defs")
    if isinstance(defs, dict):
        for def_name, def_schema in defs.items():
            ensure_strict_json_schema(
                def_schema, path=(*path, "$defs", def_name), root=root
            )

    definitions = json_schema.get("definitions")
    if isinstance(definitions, dict):
        for definition_name, definition_schema in definitions.items():
            ensure_strict_json_schema(
                definition_schema,
                path=(*path, "definitions", definition_name),
                root=root,
            )

    typ = json_schema.get("type")
    if typ == "object" and "additionalProperties" not in json_schema:
        json_schema["additionalProperties"] = False

    # object types
    # { 'type': 'object', 'properties': { 'a':  {...} } }
    properties = json_schema.get("properties")
    if isinstance(properties, dict):
        json_schema["required"] = [prop for prop in properties.keys()]
        json_schema["properties"] = {
            key: ensure_strict_json_schema(
                prop_schema, path=(*path, "properties", key), root=root
            )
            for key, prop_schema in properties.items()
        }

    # arrays
    # { 'type': 'array', 'items': {...} }
    items = json_schema.get("items")
    if isinstance(items, dict):
        json_schema["items"] = ensure_strict_json_schema(
            items, path=(*path, "items"), root=root
        )

    # unions
    any_of = json_schema.get("anyOf")
    if isinstance(any_of, list):
        json_schema["anyOf"] = [
            ensure_strict_json_schema(variant, path=(*path, "anyOf", str(i)), root=root)
            for i, variant in enumerate(any_of)
        ]

    # intersections
    all_of = json_schema.get("allOf")
    if isinstance(all_of, list):
        if len(all_of) == 1:
            json_schema.update(
                ensure_strict_json_schema(
                    all_of[0], path=(*path, "allOf", "0"), root=root
                )
            )
            json_schema.pop("allOf")
        else:
            json_schema["allOf"] = [
                ensure_strict_json_schema(
                    entry, path=(*path, "allOf", str(i)), root=root
                )
                for i, entry in enumerate(all_of)
            ]

    # string
    if typ == "string":
        if "format" in json_schema:
            if json_schema["format"] not in supported_string_formats:
                del json_schema["format"]

    # strip `None` defaults as there's no meaningful distinction here
    # the schema will still be `nullable` and the model will default
    # to using `None` anyway


def remove_titles_from_schema(schema: dict):
    if not isinstance(schema, dict):
        return schema
    if "title" in schema:
        del schema["title"]
    for key, value in schema.items():
        if isinstance(value, dict):
            remove_titles_from_schema(value)
        elif isinstance(value, list):
            for item in value:
                if isinstance(item, dict):
                    remove_titles_from_schema(item)
    return schema


def flatten_json_schema(schema: dict):
    """
    Resolves $defs in the schema.
    """
    schema = deepcopy(schema)
    defs = schema.pop("$defs", {}) or schema.pop("definitions", {})
    
    def resolve_refs(node):
        if isinstance(node, dict):
            if "$ref" in node:
                ref = node["$ref"]
                # Assume ref is like "#/$defs/Name" or "#/definitions/Name"
                name = ref.split("/")[-1]
                if name in defs:
                    # Merge definition into node
                    definition = deepcopy(defs[name])
                    # Recursive resolve in definition
                    definition = resolve_refs(definition)
                    return definition
            
            for k, v in node.items():
                node[k] = resolve_refs(v)
        elif isinstance(node, list):
            for i, item in enumerate(node):
                node[i] = resolve_refs(item)
        return node

    return resolve_refs(schema)
