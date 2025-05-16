import requests
from PIL import Image, ImageDraw
from io import BytesIO

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}
DESIGN_MAX_SIZE_PERCENT = 0.8 
DESIGN_PLACEMENT_BOX = (200, 200, 400, 400)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def fetch_image_from_url(image_url):
    try:
        response = requests.get(image_url, stream=True)
        response.raise_for_status()
        return Image.open(BytesIO(response.content))
    except requests.exceptions.RequestException as e:
        print(f"Error fetching image from URL {image_url}: {e}")
        return None
    except IOError:
        print(f"Error opening image from URL {image_url}. Is it a valid image format?")
        return None
    
def overlay_images(shirt_image, design_image, placement_box):
    try:
        shirt_image = shirt_image.convert("RGBA")
        design_image = design_image.convert("RGBA")

        box_width = placement_box[2] - placement_box[0]
        box_height = placement_box[3] - placement_box[1]

        original_design_width, original_design_height = design_image.size

        ratio = 1.0 
        if original_design_width > 0 and original_design_height > 0:
            ratio = min(box_width / original_design_width, box_height / original_design_height)
        
        ratio = min(ratio, DESIGN_MAX_SIZE_PERCENT)


        new_design_width = int(original_design_width * ratio)
        new_design_height = int(original_design_height * ratio)

        if original_design_width > 0 and new_design_width == 0: new_design_width = 1
        if original_design_height > 0 and new_design_height == 0: new_design_height = 1

        if new_design_width == 0 or new_design_height == 0:
            print("Warning: Resized design has zero width or height.")
            
        resized_design = design_image.resize((new_design_width, new_design_height), Image.Resampling.LANCZOS)

        paste_x = placement_box[0] + (box_width - new_design_width) // 2
        paste_y = placement_box[1] + (box_height - new_design_height) // 2

        temp_shirt_overlay = Image.new('RGBA', shirt_image.size, (0, 0, 0, 0))
        temp_shirt_overlay.paste(resized_design, (paste_x, paste_y), resized_design)

        combined_image = Image.alpha_composite(shirt_image, temp_shirt_overlay)

        return combined_image.convert("RGBA")

    except Exception as e:
        print(f"Error during image overlay: {e}")
        return None