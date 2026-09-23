from fastapi import APIRouter, UploadFile, File

router = APIRouter()

@router.post("/analyze-image")
async def analyze_image(file: UploadFile = File(...)):
    # Mock response for image analysis
    return {
        "result": "Possible skin infection",
        "confidence": "80%"
from fastapi import APIRouter, UploadFile, File, HTTPException, status
from pydantic import BaseModel
import os
import io
from PIL import Image
import google.generativeai as genai
from dotenv import load_dotenv
import json # Added json import

# Load environment variables
load_dotenv()

router = APIRouter()

# Configure Google Gemini API
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# Initialize Gemini Vision model
vision_model = genai.GenerativeModel('gemini-pro-vision')

class ImageAnalysisResponse(BaseModel):
    disease_name: str = "Unknown"
    confidence_score: str = "N/A"
    symptoms: list[str] = []
    precautions: list[str] = []
    remedies: list[str] = []
    when_to_seek_medical_attention: str = "Consult a doctor for accurate diagnosis and treatment."
    error: str | None = None

@router.post("/analyze-image", response_model=ImageAnalysisResponse)
async def analyze_image(file: UploadFile = File(...)):
    """
    Analyzes an uploaded image for disease identification using AI Vision API.
    Accepts JPG, PNG, JPEG images, validates size, and returns structured analysis.
    """
    if not file.content_type or file.content_type not in ["image/jpeg", "image/png", "image/jpg"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid image format. Only JPG, PNG, JPEG are allowed."
        )

    # Limit image size to 10MB
    MAX_FILE_SIZE_MB = 10
    contents = await file.read()
    if len(contents) > MAX_FILE_SIZE_MB * 1024 * 1024:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"Image file size exceeds the limit of {MAX_FILE_SIZE_MB}MB."
        )

    try:
        # Open the image using PIL
        img = Image.open(io.BytesIO(contents))

        # Prepare the prompt for the vision model
        prompt = """Analyze this image for any visible skin conditions or diseases.
        Provide a concise analysis in a JSON format with the following keys:
        - disease_name: (string, e.g., 'Acne', 'Eczema', 'Psoriasis', 'Unknown' if not identifiable)
        - confidence_score: (string, e.g., 'High', 'Medium', 'Low', 'N/A' if unknown)
        - symptoms: (list of strings, common symptoms associated with the identified condition)
        - precautions: (list of strings, general advice or preventive measures)
        - remedies: (list of strings, general home remedies or over-the-counter suggestions)
        - when_to_seek_medical_attention: (string, specific advice on when to consult a doctor)
        If no specific disease is identifiable, state 'Unknown' for disease_name and provide general skin care advice.
        """

        # Generate content using the vision model
        response = vision_model.generate_content([prompt, img])
        
        # Extract the JSON string from the response
        response_text = response.text.strip()
        
        # Attempt to parse the JSON response
        analysis_data = json.loads(response_text)

        return ImageAnalysisResponse(**analysis_data)

    except json.JSONDecodeError:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="AI response could not be parsed.")
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to analyze image: {str(e)}"
        )
    }
