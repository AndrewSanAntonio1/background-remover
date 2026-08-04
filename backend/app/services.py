"""
Business logic for background removal.
"""
from io import BytesIO
from PIL import Image
from rembg import remove


def remove_background(image_data: bytes) -> bytes:
    """
    Remove background from an image using rembg.
    
    Args:
        image_data: Raw image bytes (JPG, PNG, or WEBP)
    
    Returns:
        Processed image as PNG bytes with transparent background
    
    Raises:
        ValueError: If image cannot be processed
        Exception: For unexpected processing errors
    """
    try:
        # Open the image
        input_image = Image.open(BytesIO(image_data))
        
        # Convert to RGB if necessary (for JPG compatibility)
        if input_image.mode not in ('RGB', 'RGBA'):
            input_image = input_image.convert('RGB')
        
        # Remove background using rembg
        output_image = remove(input_image)
        
        # Convert to PNG bytes
        output_buffer = BytesIO()
        output_image.save(output_buffer, format='PNG')
        output_buffer.seek(0)
        
        return output_buffer.read()
    
    except Exception as e:
        # Log the error in production (add proper logging here)
        raise ValueError(f"Failed to process image: {str(e)}")
