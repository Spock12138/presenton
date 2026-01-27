from models.pptx_models import PptxPresentationModel
from pptx.enum.shapes import MSO_AUTO_SHAPE_TYPE
from pydantic import ValidationError

# Mock payload similar to what frontend sends
payload = {
    "slides": [
        {
            "shapes": [
                {
                    "shape_type": "textbox",
                    "position": {"left": 0, "top": 0, "width": 100, "height": 100},
                    "paragraphs": [
                        {
                            "text": "Hello World",
                            "alignment": 1,  # LEFT
                            "font": {
                                "name": "Inter",
                                "size": 16,
                                "color": "000000",
                                "font_weight": 400,
                                "italic": False
                            }
                        }
                    ],
                    "text_wrap": True
                },
                {
                    "shape_type": "autoshape",
                    "type": 1, # RECTANGLE
                    "position": {"left": 100, "top": 100, "width": 100, "height": 100},
                    "fill": {"color": "FF0000", "opacity": 1.0},
                    "text_wrap": True
                },
                {
                    "shape_type": "picture",
                    "position": {"left": 200, "top": 200, "width": 100, "height": 100},
                    "picture": {
                        "is_network": False,
                        "path": "/some/path.jpg"
                    },
                    "clip": True,
                    "invert": False,
                    "shape": "rectangle",
                    "object_fit": {"fit": "contain"}
                }
            ]
        }
    ]
}

try:
    m = PptxPresentationModel(**payload)
    print("Validation Success!")
except ValidationError as e:
    print(f"Validation Failed: {e}")
