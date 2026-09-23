from fastapi import APIRouter, UploadFile, File

router = APIRouter(prefix="/api", tags=["Image Analysis"])

@router.post("/analyze-image")
async def analyze_image(file: UploadFile = File(...)):
    # Mock response for image analysis
    return {
        "result": "Possible skin infection",
        "confidence": "80%"
    }
