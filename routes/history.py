from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import json
import os
from datetime import datetime
import uuid

router = APIRouter(prefix="/api/history", tags=["history"])

BASE_DIR = os.path.dirname(os.path.dirname(__file__))
HISTORY_FILE = os.path.join(BASE_DIR, "history.json")

class HistoryItem(BaseModel):
    id: str
    timestamp: str
    date: Optional[str] = None
    day: Optional[str] = None
    time: Optional[str] = None
    user_query: str
    bot_response: dict
    topic: Optional[str] = None
    severity: Optional[str] = None

def load_history():
    if not os.path.exists(HISTORY_FILE):
        return []
    try:
        with open(HISTORY_FILE, "r") as f:
            items = json.load(f)
            if not isinstance(items, list):
                return []

            for item in items:
                if not isinstance(item, dict):
                    continue
                ts = item.get("timestamp")
                if ts and (not item.get("date") or not item.get("day") or not item.get("time")):
                    try:
                        dt = datetime.fromisoformat(ts.replace("Z", "+00:00"))
                        item.setdefault("date", dt.strftime("%d/%m/%Y"))
                        item.setdefault("day", dt.strftime("%A"))
                        item.setdefault("time", dt.strftime("%I:%M %p"))
                    except Exception:
                        item.setdefault("date", item.get("date"))
                        item.setdefault("day", item.get("day"))
                        item.setdefault("time", item.get("time"))

            return items
    except:
        return []

def save_history(history):
    with open(HISTORY_FILE, "w") as f:
        json.dump(history, f, indent=4)

@router.get("/", response_model=List[HistoryItem])
async def get_history():
    return load_history()

@router.get("/chat-history", response_model=List[HistoryItem])
async def get_chat_history():
    return load_history()

@router.delete("/{item_id}")
async def delete_history_item(item_id: str):
    history = load_history()
    new_history = [item for item in history if item["id"] != item_id]
    if len(new_history) == len(history):
        raise HTTPException(status_code=404, detail="History item not found")
    save_history(new_history)
    return {"message": "Item deleted"}

@router.delete("/clear/all")
async def clear_all_history():
    save_history([])
    return {"message": "All history cleared"}

def add_to_history(user_query: str, bot_response: dict):
    history = load_history()
    
    now = datetime.now()
    # Extract topic and severity if available in bot_response
    topic = bot_response.get("topic")
    severity = bot_response.get("severity")
    
    new_item = {
        "id": str(uuid.uuid4()),
        "timestamp": now.isoformat(),
        "date": now.strftime("%d/%m/%Y"),
        "day": now.strftime("%A"),
        "time": now.strftime("%I:%M %p"),
        "user_query": user_query,
        "bot_response": bot_response,
        "topic": topic,
        "severity": severity
    }
    history.insert(0, new_item)  # Newest first
    save_history(history)
    return new_item
