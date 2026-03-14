<<<<<<< HEAD
# AI Health Companion 🏥

AI-powered healthcare assistant with symptom analysis & diabetes risk prediction using ML model.

## Features
- 🔍 **Symptom Checker** - Rule-based risk assessment
- 🩸 **Diabetes Risk Calculator** - Scikit-learn model (6 features: age, BP, cholesterol, glucose, smoker, BMI)
- 📊 **Health Records** - SQLite persistence
- ✨ **React Frontend** - Responsive UI
- 🚀 **FastAPI Backend** - Auto API docs at `/docs`

## Quick Start

### 1. Backend (API)
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```
🌐 **API**: http://localhost:8000/docs

### 2. Web Frontend
```bash
cd web
npm install
npm start
```
🌐 **App**: http://localhost:3000

### 3. Test
1. Fill diabetes form → Get ML prediction + DB save
2. Check records → View history
3. Symptom checker → Instant analysis

## Architecture
```
data/ ── csv ──> notebooks/ ── train ──> models/
                    ↑
web/ ── React ──> backend/app/ ── FastAPI/SQLite ── health.db
```

## API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/ai-check` | Symptom analysis |
| `POST` | `/api/disease-predict` | ML diabetes risk |
| `GET`  | `/api/health-records/{id}` | User records |
| `POST` | `/api/health-records/` | Manual record |

## ML Model
- **Trained**: `notebooks/model_training.ipynb`
- **Features**: age, blood_pressure, cholesterol, glucose, smoker, bmi
- **Deployed**: `app/models/disease_model.pkl`
- **Accuracy**: View `notebooks/feature_importance.png`

## Troubleshooting
- **JSON Error**: Fixed with robust parsing (web/src/App.js)
- **CORS**: Expanded origins in main.py
- **Model Missing**: Run `notebooks/model_training.ipynb`
- **DB**: SQLite `./backend/health.db` auto-creates

## Development
```
# Backend hot reload
cd backend && uvicorn app.main:app --reload

# Frontend hot reload  
cd web && npm start

# Train new model
cd notebooks && jupyter notebook model_training.ipynb
```

## Files Structure
```
ds/
├── backend/          # FastAPI + SQLite
├── web/              # React frontend
├── notebooks/        # ML training
├── data/             # Datasets
├── frontend/         # React Native (bonus)
└── README.md         # This file
```

## GitHub Setup
```
git init
git add .
git commit -m \"AI Health Companion v1.0 - ML diabetes predictor\"
gh repo create aswinsyam/ai-health-companion --public --push
```

**Enjoy AI Health Companion! 🚀**
**Repo**: https://github.com/aswinsyam/ai-health-companion
=======
# Ai-Health-Companion
AI Health Backend is a machine learning–powered healthcare system that analyzes user symptoms and predicts diabetes risk using trained ML models. The backend provides intelligent health insights and recommendations through API services.
>>>>>>> e397f2e2364ea4a2c7c4ef07eead9e893230a997
