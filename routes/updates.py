from fastapi import APIRouter
from typing import List
from pydantic import BaseModel

router = APIRouter(prefix="/api/updates", tags=["updates"])

class PublicUpdate(BaseModel):
    title: str
    date: str
    type: str
    desc: str

@router.get("/", response_model=List[PublicUpdate])
async def get_public_updates():
    return [
        { 
            "title": 'New Protocol: Real-time Symptom Analysis v4.2', 
            "date": '2024-10-26', 
            "type": 'info', 
            "desc": 'Enhanced LLM processing for more accurate condition assessment.' 
        },
        { 
            "title": 'Clinical Alert: High System Latency', 
            "date": '2024-10-25', 
            "type": 'alert', 
            "desc": 'Our engineering team is addressing increased processing times.' 
        },
        { 
            "title": 'Preventative Health: Seasonal Flu Advisory', 
            "date": '2024-10-24', 
            "type": 'tip', 
            "desc": 'Stay updated with local vaccination centers for the upcoming season.' 
        },
        { 
            "title": 'System Maintenance: HIPAA Compliance Patch', 
            "date": '2024-10-23', 
            "type": 'info', 
            "desc": 'Scheduled security updates for encrypted medical data storage.' 
        },
    ]
