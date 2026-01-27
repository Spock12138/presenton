from pptx.enum.shapes import MSO_AUTO_SHAPE_TYPE

try:
    print(f"RECTANGLE: {MSO_AUTO_SHAPE_TYPE.RECTANGLE} = {MSO_AUTO_SHAPE_TYPE.RECTANGLE.value}")
    print(f"ROUNDED_RECTANGLE: {MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE} = {MSO_AUTO_SHAPE_TYPE.ROUNDED_RECTANGLE.value}")
except AttributeError as e:
    print(f"Error: {e}")
