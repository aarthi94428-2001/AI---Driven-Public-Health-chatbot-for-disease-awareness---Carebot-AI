from fastapi import FastAPI
import json
from pydantic import BaseModel
import os
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from routes import chat, predict, hospitals, image, history, vaccinations, feedback, updates # Ensure all your route files are here

app = FastAPI()
load_dotenv() # Load environment variables

# CORS FIX
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat.router, prefix="/chat", tags=["Chatbot"])
app.include_router(image.router, prefix="/image", tags=["Image Analysis"])
app.include_router(predict.router, prefix="/predict", tags=["Prediction"])
app.include_router(hospitals.router, prefix="/hospitals", tags=["Hospitals"])
app.include_router(history.router, prefix="/history", tags=["History"])
app.include_router(vaccinations.router, prefix="/vaccinations", tags=["Vaccinations"])
app.include_router(feedback.router, prefix="/feedback", tags=["Feedback"])
app.include_router(updates.router, prefix="/updates", tags=["Updates"])