from fastapi import APIRouter
from pydantic import BaseModel
from groq import Groq
import os
import json
from routes.history import add_to_history

router = APIRouter(prefix="/api", tags=["Chatbot"])

class ChatRequest(BaseModel):
    message: str

system_prompt = """
You are a professional healthcare assistant.

Return a single JSON object only.

If the user is asking about a disease/health issue, use this schema:
{
  "disease_name": "string",
  "description": "string",
  "causes": ["string"],
  "symptoms": ["string"],
  "prevention": ["string"],
  "home_remedies": ["string"],
  "medical_treatments": ["string"],
  "when_to_consult_doctor": "string",
  "emergency_warning_signs": ["string"],
  "severity": "Mild|Moderate|Serious",
  "emergency": true|false
}

If the user is not asking a medical question, use:
{ "reply": "string" }

Keep content concise, safe, and always recommend consulting a licensed clinician for medical advice.
"""

@router.post("/chat")
async def chat(request: ChatRequest):
    user_message = request.message
    api_key = os.environ.get("GROQ_API_KEY")
    if not api_key:
        payload = {"reply": "Backend GROQ_API_KEY is not configured. Add GROQ_API_KEY to Backend/.env and restart the backend."}
        try:
            add_to_history(user_query=user_message, bot_response=payload)
        except Exception:
            pass
        return {"response": payload}
    try:
        client = Groq(api_key=api_key)
        response = client.chat.completions.create(
            model=os.getenv("GROQ_MODEL", "openai/gpt-oss-20b"),
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message}
            ],
            response_format={"type": "json_object"}
        )

        content = response.choices[0].message.content
        try:
            payload = json.loads(content)
        except Exception:
            payload = {"reply": content}

        try:
            add_to_history(user_query=user_message, bot_response=payload)
        except Exception:
            pass

        return {"response": payload}
    except Exception as e:
        return {"response": {"reply": f"Error: {str(e)}"}}
