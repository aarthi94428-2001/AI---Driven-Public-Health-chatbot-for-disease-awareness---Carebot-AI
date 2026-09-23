from fastapi import FastAPI
import json
from pydantic import BaseModel
from groq import Groq
import os
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from routes import chat, predict, hospitals, image, history, vaccinations, feedback, updates # Ensure all your route files are here

app = FastAPI()
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), ".env")) # Load environment variables

# CORS FIX
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat.router, tags=["Chatbot"])
app.include_router(image.router, tags=["Image Analysis"])
app.include_router(predict.router, tags=["Prediction"])
app.include_router(hospitals.router, tags=["Hospitals"])
app.include_router(history.router, tags=["History"])
app.include_router(vaccinations.router, tags=["Vaccinations"])
app.include_router(feedback.router, tags=["Feedback"])
app.include_router(updates.router, tags=["Updates"])
