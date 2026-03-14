from sqlalchemy import Column, Integer, Float, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base
from app.models.user import User

class HealthRecord(Base):
    __tablename__ = "health_records"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    age = Column(Integer)
    blood_pressure = Column(Integer)
    cholesterol = Column(Integer)
    glucose = Column(Float)
    smoker = Column(Integer)  # 0/1
    bmi = Column(Float)
    risk_level = Column(String(20))  # High/Medium/Low
    confidence = Column(Float)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationship
    user = relationship("User", back_populates="health_records")



