from fastapi import APIRouter
import json
from pydantic import BaseModel
import os
from groq import Groq
from fastapi.middleware.cors import CORSMiddleware # Not strictly needed here, but good practice if this file were standalone
from dotenv import load_dotenv

router = APIRouter()

# Load environment variables
load_dotenv()

# Placeholder for history module - assuming it has an add_to_history method
class HistoryMock:
    def add_to_history(self, user_message, bot_response):
        print(f"Saving to history: User: {user_message}, Bot: {bot_response}")
history = HistoryMock()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

class ChatRequest(BaseModel):
    message: str

system_prompt = """You are an advanced AI healthcare assistant named CareBot. Your primary function is to provide professional, clear, and safe health-related information. You MUST adhere to the following rules:

1.  **Health-Related Queries Only**: If the user asks a non-health-related question, you MUST respond with: `{\"reply\": \"⚠️ I am a healthcare assistant. Please ask health-related questions only.\", \"severity\": \"info\"}`.
2.  **Structured Response**: For all valid health queries, you MUST return a JSON object with the following structure. Ensure all fields are present, even if empty or "N/A":
    `{
      \"disease_name\": \"[Disease Name/Topic]\",
      \"description\": \"[Clear and simple definition. ALWAYS end this field with the sentence: (Disclaimer: This is not a substitute for professional medical advice. Always consult a doctor.)]\",
      \"causes\": \"[Bulleted or numbered list of common causes]\",
      \"symptoms\": \"[Bulleted or numbered list of common symptoms]\",
      \"prevention\": \"[Actionable prevention tips]\",
      \"home_remedies\": \"[Bulleted or numbered list of safe home remedies, if applicable. If none, state 'N/A']\",
      \"medical_treatments\": \"[Bulleted or numbered list of basic, safe medical treatment advice]\",
      \"when_to_consult_doctor\": \"[Specific advice on when to seek professional medical attention, e.g., 'Consult a doctor if symptoms worsen or persist for more than X days.']\",
      \"emergency_warning_signs\": \"[Bulleted or numbered list of critical symptoms indicating an emergency. If none, state 'None identified'.]\",
      \"severity\": \"[Mild/Moderate/Severe]\",
      \"emergency\": [true/false]
    }`
3.  **Severity and Emergency**:
    -   If the condition is potentially life-threatening or requires immediate attention (e.g., heart attack, stroke), set `\"severity\": \"Severe\"` and `\"emergency\": true`.
    -   For less critical but serious conditions (e.g., high fever, persistent vomiting), set `\"severity\": \"Moderate\"` and `\"emergency\": false`.
    -   For minor issues (e.g., common cold), set `\"severity\": \"Mild\"` and `\"emergency\": false`.
4.  **Disclaimer**: ALWAYS end your `description` field with the sentence: `(Disclaimer: This is not a substitute for professional medical advice. Always consult a doctor.)`
5.  **Formatting**: Use clear headings, bullet points, and emojis where appropriate within the string values of the JSON fields to make the response user-friendly.
Do not deviate from this JSON format. The frontend application depends on this exact structure."""

@router.post("/") # Changed to "/" since main.py will include this router at "/chat" prefix
async def chat(request: ChatRequest):
    user_message = request.message
    try:
        response = client.chat.completions.create(
            model="llama3-8b-8192", # Using a smaller model for faster responses, can be changed to 70b
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message}
            ]
        )

        reply = response.choices[0].message.content

        # Attempt to parse the JSON response from the AI
        bot_response_json = json.loads(reply)
        history.add_to_history(request.message, bot_response_json)
        return {"response": bot_response_json}
    except Exception as e:
        print(f"Error in Groq API call or JSON parsing: {e}")
        return {"response": {"reply": f"Sorry, I couldn't process that request. Error: {str(e)}", "severity": "error"}}
