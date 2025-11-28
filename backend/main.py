# backend/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import json
import os

app = FastAPI(title="Morocco Crop Insight API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load data once at startup
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
regional = json.load(open(os.path.join(BASE_DIR, "data/processed/regional_cereals_2023.json")))
fao = pd.read_csv(os.path.join(BASE_DIR, "data/processed/fao_national_clean.csv"))

@app.get("/")
def home():
    return {"message": "Morocco Crop Insight API - Live"}

@app.get("/regional")
def get_regional():
    return regional

@app.get("/national")
def get_national(crop: str = None, year: int = None):
    df = fao.copy()
    if crop:
        df = df[df['crop_en'] == crop]
    if year:
        df = df[df['year'] == year]
    return df[['year', 'crop_en', 'crop_fr', 'production_kt', 'area_ha', 'yield_tha']].to_dict(orient="records")

@app.get("/crops")
def get_crops():
    return [
        {"en": "Wheat", "fr": "Blé"},
        {"en": "Barley", "fr": "Orge"},
        {"en": "Olives", "fr": "Olives"},
        {"en": "Tomatoes", "fr": "Tomates"}
    ]
