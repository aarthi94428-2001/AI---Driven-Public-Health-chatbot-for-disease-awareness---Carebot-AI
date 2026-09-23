from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import json
import os
from datetime import datetime
import uuid

router = APIRouter(prefix="/api/feedback", tags=["feedback"])

BASE_DIR = os.path.dirname(os.path.dirname(__file__))
FEEDBACK_FILE = os.path.join(BASE_DIR, "feedback.json")

class FeedbackRequest(BaseModel):
    name: str
    email: str
    message: str

def load_feedback():
    if not os.path.exists(FEEDBACK_FILE):
        return []
    try:
        with open(FEEDBACK_FILE, "r") as f:
            return json.load(f)
    except:
        return []

def save_feedback(feedback_list):
    with open(FEEDBACK_FILE, "w") as f:
        json.dump(feedback_list, f, indent=4)

@router.post("/")
async def submit_feedback(request: FeedbackRequest):
    feedback_list = load_feedback()
    new_feedback = {
        "id": str(uuid.uuid4()),
        "timestamp": datetime.now().isoformat(),
        "name": request.name,
        "email": request.email,
        "message": request.message
    }
    feedback_list.insert(0, new_feedback)
    save_feedback(feedback_list)
    return {"message": "Feedback submitted successfully", "id": new_feedback["id"]}

@router.get("/")
async def get_all_feedback():
    return load_feedback()
