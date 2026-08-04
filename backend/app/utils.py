"""
Helper utilities for file validation.
"""
from fastapi import UploadFile


# Supported file types
ACCEPTED_TYPES = [
    "image/png",
    "image/jpeg",
    "image/webp"
]

# Common file extensions
ACCEPTED_EXTENSIONS = [".png", ".jpg", ".jpeg", ".webp"]

# Maximum file size in bytes (10MB)
MAX_FILE_SIZE = 10 * 1024 * 1024


def validate_uploaded_file(file: UploadFile) -> None:
    """
    Validate uploaded file type and basic properties.
    
    Args:
        file: The uploaded file from FastAPI
    
    Raises:
        ValueError: If validation fails with a user-friendly message
    """
    if not file:
        raise ValueError("No file selected. Choose an image to continue.")
    
    # Check content type
    if file.content_type not in ACCEPTED_TYPES:
        raise ValueError(
            "Unsupported format. Please upload a PNG, JPG, or WEBP image."
        )
    
    # Check file extension as an additional safeguard
    if file.filename:
        extension = "." + file.filename.split(".")[-1].lower() if "." in file.filename else ""
        if extension not in ACCEPTED_EXTENSIONS:
            raise ValueError(
                "Unsupported file extension. Please upload a PNG, JPG, or WEBP image."
            )
