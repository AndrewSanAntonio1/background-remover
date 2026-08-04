"""
API endpoints for background removal.
"""
from fastapi import APIRouter, File, UploadFile, HTTPException
from fastapi.responses import Response

from app.services import remove_background
from app.utils import validate_uploaded_file

router = APIRouter()


@router.post(
    "/remove-background",
    response_class=Response,
    responses={
        200: {
            "content": {"image/png": {}},
            "description": "Processed image with transparent background"
        },
        400: {"description": "Invalid file format or size"},
        413: {"description": "File too large"},
        415: {"description": "Unsupported media type"},
        500: {"description": "Processing error"}
    }
)
async def remove_background_endpoint(
    image: UploadFile = File(..., description="Image file to process")
):
    """
    Remove background from uploaded image.
    
    Accepts JPG, JPEG, PNG, or WEBP images up to 10MB.
    Returns a PNG image with transparent background.
    """
    # Validate the uploaded file
    try:
        validate_uploaded_file(image)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=415,
            detail="Unsupported format. Please upload a PNG, JPG, or WEBP image."
        )
    
    # Read the image data
    try:
        image_data = await image.read()
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail="Failed to read image file. Please try again."
        )
    
    # Check file size (10MB limit)
    if len(image_data) > 10 * 1024 * 1024:
        raise HTTPException(
            status_code=413,
            detail="That image is too large for the server. Try one under 10 MB."
        )
    
    if len(image_data) == 0:
        raise HTTPException(
            status_code=400,
            detail="That file appears to be empty. Try a different image."
        )
    
    # Process the image
    try:
        processed_image = remove_background(image_data)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail="Our service hit a snag while processing your image. Please try again."
        )
    
    # Return the processed image as PNG
    return Response(
        content=processed_image,
        media_type="image/png",
        headers={
            "Content-Disposition": f'inline; filename="removed_background.png"'
        }
    )
