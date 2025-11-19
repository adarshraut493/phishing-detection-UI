from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import joblib
import numpy as np
from url_features import extract_url_features

app = FastAPI()

# CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load ML Model
model = joblib.load("phishing_model.pkl")
print("MODEL LOADED SUCCESSFULLY")


# ------------------------------------------------
# PURE ML PREDICTION (NO RULE ENGINE)
# ------------------------------------------------
@app.get("/predict-url")
def predict_url(url: str):

    # Extract 48 ML features
    features = extract_url_features(url)

    if len(features) != 48:
        return {"error": f"Feature mismatch: Received {len(features)} instead of 48"}

    arr = np.array(features).reshape(1, -1)

    # ML probability
    try:
        proba = float(model.predict_proba(arr)[0][1])  # probability of phishing (class 1)
    except:
        proba = 0.0

    # ML decision using threshold (0.30)
    if proba >= 0.45:
        ml_pred = 1
        final = "Phishing"
    else:
        ml_pred = 0
        final = "Legitimate"

    return {
        "url": url,
        "final_prediction": final,
        "ml_prediction": ml_pred,
        "ml_probability": proba,
        "features_used": features
    }
