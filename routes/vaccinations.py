from fastapi import APIRouter, Query
from typing import List, Optional
from pydantic import BaseModel
import os
import json

router = APIRouter(prefix="/api/vaccinations", tags=["vaccinations"])

BASE_DIR = os.path.dirname(os.path.dirname(__file__))
VACCINATION_STATUS_FILE = os.path.join(BASE_DIR, "vaccination_status.json")

class Vaccine(BaseModel):
    id: str
    name: str
    purpose: str
    dosage: str
    sideEffects: str
    benefits: str
    ageGroup: str # child, adult, senior
    dueDate: Optional[str] = None
    status: str = "Pending" # Pending, Completed

class VaccinationStatusUpdate(BaseModel):
    vaccineId: str
    status: str

class PreventionTip(BaseModel):
    title: str
    description: str
    icon: str

def load_status():
    if not os.path.exists(VACCINATION_STATUS_FILE):
        return {}
    try:
        with open(VACCINATION_STATUS_FILE, "r") as f:
            return json.load(f)
    except:
        return {}

def save_status(status):
    with open(VACCINATION_STATUS_FILE, "w") as f:
        json.dump(status, f, indent=4)

@router.get("/", response_model=List[Vaccine])
async def get_vaccines(age: int = Query(...)):
    # Define vaccine master list
    all_vaccines = [
        {"id": "v1", "name": "BCG", "purpose": "Tuberculosis", "dosage": "Single dose at birth", "sideEffects": "Mild swelling", "benefits": "Prevents severe TB in children", "ageGroup": "child"},
        {"id": "v2", "name": "Hepatitis B", "purpose": "Liver infection", "dosage": "3 doses", "sideEffects": "Soreness", "benefits": "Lifetime protection against Hep B", "ageGroup": "child"},
        {"id": "v3", "name": "Flu Vaccine", "purpose": "Influenza", "dosage": "Annual", "sideEffects": "Body ache", "benefits": "Reduces flu severity", "ageGroup": "adult"},
        {"id": "v4", "name": "Pneumococcal", "purpose": "Pneumonia", "dosage": "1-2 doses", "sideEffects": "Fever", "benefits": "Prevents lung infections", "ageGroup": "senior"},
    ]
    
    # Filter by age group
    age_group = "child" if age < 18 else "adult" if age < 60 else "senior"
    filtered = [v for v in all_vaccines if v["ageGroup"] == age_group]
    
    # Merge with user status
    user_status = load_status()
    for v in filtered:
        v["status"] = user_status.get(v["id"], "Pending")
        # Mock due date
        v["dueDate"] = "Soon" if v["status"] == "Pending" else "N/A"
        
    return filtered

@router.post("/status")
async def update_status(update: VaccinationStatusUpdate):
    status = load_status()
    status[update.vaccineId] = update.status
    save_status(status)
    return {"message": "Status updated"}

@router.get("/prevention", response_model=List[PreventionTip])
async def get_prevention_tips():
    return [
        { "title": 'Clinical Hand Hygiene', "description": 'Wash hands for 20+ seconds with clinical-grade sanitizer.', "icon": '🧼' },
        { "title": 'Balanced Nutrition', "description": 'Maintain a diet rich in essential micronutrients and vitamins.', "icon": '🥗' },
        { "title": 'Physical Activity', "description": 'Engage in 150 minutes of moderate aerobic activity weekly.', "icon": '🏃' },
        { "title": 'Sleep Hygiene', "description": 'Ensure 7-9 hours of restorative sleep for optimal recovery.', "icon": '😴' },
        { "title": 'Hydration Protocol', "description": 'Consume adequate water to maintain cellular homeostasis.', "icon": '💧' },
        { "title": 'Regular Screenings', "description": 'Schedule periodic clinical checkups for early detection.', "icon": '🩺' },
    ]
