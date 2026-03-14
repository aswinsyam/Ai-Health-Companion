import os
import joblib

# ==============================
# Model Loading
# ==============================

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))

MODEL_PATH = os.path.join(BASE_DIR, "app", "models", "disease_model.pkl")
FEATURE_NAMES_PATH = os.path.join(BASE_DIR, "app", "models", "feature_names.txt")

MODEL_LOADED = False
model = None
feature_names = []

try:
    model = joblib.load(MODEL_PATH)

    with open(FEATURE_NAMES_PATH, "r") as f:
        feature_names = [line.strip() for line in f.readlines()]

    MODEL_LOADED = True
    print("✅ AI model loaded successfully")

except Exception as e:
    print(f"⚠️ Warning: Could not load AI model: {e}")


# ==============================
# Symptom Analysis (Rule-based)
# ==============================

def analyze_symptoms(symptoms: str) -> dict:
    """
    Simple rule-based symptom analyzer
    """

    symptoms_lower = symptoms.lower()

    risk = "Low"
    recommendation = "Monitor your health and maintain hydration."

    # High risk conditions
    if "chest pain" in symptoms_lower or "shortness of breath" in symptoms_lower:
        risk = "High"
        recommendation = "Seek emergency medical attention immediately."

    elif "high fever" in symptoms_lower:
        risk = "High"
        recommendation = "Consult a doctor immediately."

    # Medium risk
    elif "fever" in symptoms_lower and "cough" in symptoms_lower:
        risk = "Medium"
        recommendation = "Possible infection. Rest and consult a doctor if symptoms persist."

    elif "headache" in symptoms_lower and "nausea" in symptoms_lower:
        risk = "Medium"
        recommendation = "Could be migraine or infection. Consider medical consultation."

    # Low risk
    elif "fatigue" in symptoms_lower or "tired" in symptoms_lower:
        risk = "Low"
        recommendation = "Ensure adequate rest, hydration, and balanced diet."

    return {
        "risk": risk,
        "recommendation": recommendation
    }


# ==============================
# Diabetes Risk Prediction
# ==============================

def predict_disease_risk(
    age: int,
    blood_pressure: int,
    cholesterol: int,
    glucose: int,
    smoker: int,
    bmi: float
) -> dict:
    """
    Predict diabetes risk using trained ML model (6 features matching notebook)
    """
    if not MODEL_LOADED:
        return {
            "risk": "Unknown",
            "confidence": "0%",
            "error": "AI model not loaded. Train the model first."
        }

    try:
        # Create input dictionary matching feature_names order
        input_dict = {
            "age": age,
            "blood_pressure": blood_pressure,
            "cholesterol": cholesterol,
            "glucose": glucose,
            "smoker": smoker,
            "bmi": bmi
        }

        # Ensure correct feature order
        input_data = [[input_dict[f] for f in feature_names]]

        # Model prediction
        prediction = model.predict(input_data)[0]
        probabilities = model.predict_proba(input_data)[0]

        risk_level = "High" if prediction == 1 else "Low"
        confidence = max(probabilities) * 100

        return {
            "risk": risk_level,
            "confidence": f"{confidence:.2f}%",
            "probability": {
                "No Diabetes": float(probabilities[0]),
                "Diabetes": float(probabilities[1])
            }
        }

    except Exception as e:
        return {
            "risk": "Unknown",
            "confidence": "0%",
            "error": str(e)
        }