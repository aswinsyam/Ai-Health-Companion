from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from app.database import get_db, engine, Base
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import and_
from app.database import get_db, engine, Base
from app.models.user import User
from app.models.health_record import HealthRecord
from app.services.ai_service import analyze_symptoms, predict_disease_risk
from pydantic import BaseModel
from typing import List
from fastapi import Request
from datetime import datetime

# Create Tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="AI Health Companion API")

# Add CORS Middleware (add web dev server)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

class SymptomInput(BaseModel):
    user_id: int
    symptoms: str

class DiseasePredictionInput(BaseModel):
    user_id: int
    age: int
    blood_pressure: int
    cholesterol: int
    glucose: int
    smoker: int  # 0=No, 1=Yes
    bmi: float

class HealthRecordInput(BaseModel):
    user_id: int
    age: int
    blood_pressure: int
    cholesterol: int
    glucose: int
    smoker: int
    bmi: float
    risk_level: str
    confidence: float

@app.post("/api/ai-check")
def check_symptoms(data: SymptomInput, db: Session = Depends(get_db)):
    result = analyze_symptoms(data.symptoms)
    return {"user_id": data.user_id, "analysis": result}

@app.post("/api/disease-predict")
async def predict_disease(request: Request, data: DiseasePredictionInput, db: Session = Depends(get_db)):
    print("=== DEBUG: Raw request body ===")
    try:
        raw_body = await request.body()
        print(f"Body length: {len(raw_body)}, content: {raw_body[:200]}")
    except:
        print("Could not read body")
    print("=== END DEBUG ===")
    """Predict disease risk and save record"""
    # Predict
    prediction_result = predict_disease_risk(
        age=data.age,
        blood_pressure=data.blood_pressure,
        cholesterol=data.cholesterol,
        glucose=data.glucose,
        smoker=data.smoker,
        bmi=data.bmi
    )
    
    # Save to DB
    record = HealthRecord(
        **data.dict(),
        risk_level=prediction_result["risk"],
        confidence=float(prediction_result["confidence"].replace("%", ""))
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    
    return {"user_id": data.user_id, "prediction": prediction_result, "record_id": record.id}

@app.get("/api/health-records/{user_id}", response_model=List[dict])
def get_records(user_id: int, db: Session = Depends(get_db)):
    """Get health records for user"""
    records = db.query(HealthRecord).filter(HealthRecord.user_id == user_id).order_by(HealthRecord.created_at.desc()).all()
    return [{"id": r.id, "risk_level": r.risk_level, "confidence": r.confidence, "bmi": r.bmi, "created_at": r.created_at} for r in records]

@app.post("/api/health-records/", status_code=status.HTTP_201_CREATED)
async def create_record(record_in: HealthRecordInput, db: Session = Depends(get_db)):
    """Manually create health record"""
    # Verify user exists (create if not)
    user = db.query(User).filter(User.id == record_in.user_id).first()
    if not user:
        user = User(id=record_in.user_id, email=f"user{record_in.user_id}@example.com", password_hash="hash")
        db.add(user)
        db.commit()
        db.refresh(user)
    
    record = HealthRecord(**record_in.dict())
    db.add(record)
    db.commit()
    db.refresh(record)
    return {"id": record.id, "message": "Record created"}

@app.get("/")
def root():
    return {"message": "HealthAI API is running!"}