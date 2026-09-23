from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from groq import Groq
import os
import json

router = APIRouter(prefix="/api", tags=["Prediction"])

class PredictionRequest(BaseModel):
    symptoms: list[str]

@router.post("/predict")
async def predict_disease(request: PredictionRequest):
    if not request.symptoms:
        return {"error": "No symptoms provided"}

    api_key = os.environ.get("GROQ_API_KEY")
    if not api_key:
        symptoms_str = ", ".join(request.symptoms)
        return {
            "disease": "Unknown",
            "confidence": "0%",
            "severity": "Moderate",
            "advice": f"Backend GROQ_API_KEY is not configured. Symptoms received: {symptoms_str}. Configure GROQ_API_KEY and retry."
        }

    try:
        client = Groq(api_key=api_key)
        symptoms_str = ", ".join(request.symptoms)
        response = client.chat.completions.create(
            model=os.getenv("GROQ_MODEL", "openai/gpt-oss-20b"),
            messages=[
                {
                    "role": "system",
                    "content": """You are a clinical diagnostic AI. Based on the symptoms provided, predict the most likely condition.
Return a JSON object with:
- disease: [The likely condition name]
- confidence: [Percentage string e.g. "85%"]
- severity: [Mild/Moderate/Severe]
- advice: [Concise clinical advice for the patient]
Accuracy and professional tone are critical."""
                },
                {"role": "user", "content": f"Symptoms: {symptoms_str}"}
            ],
            response_format={"type": "json_object"}
        )
        
        prediction = json.loads(response.choices[0].message.content)
        return prediction

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Diagnostic analysis failed: {str(e)}")
