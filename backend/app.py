from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from database import init_db, db
from models import User
import pickle
import pandas as pd
import numpy as np
import os

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})  # Allow requests from React

# ===== Database Initialization =====
init_db(app)
with app.app_context():
    db.create_all()
    print("✅ Database initialized and tables created.")

# ===== File paths =====
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Skin Type Model
SKIN_MODEL_FILE = os.path.join(BASE_DIR, "modelsoutput", "skin_type_model.pkl")
SKIN_ENCODERS_FILE = os.path.join(BASE_DIR, "modelsoutput", "label_encoders.pkl")
SKIN_FEATURES_FILE = os.path.join(BASE_DIR, "modelsoutput", "feature_columns.pkl")

# Skincare Routine Model
ROUTINE_MODEL_FILE = r"D:\sem 7 project\backend\modelsoutput\skincare_lgb_model.pkl"

# ===== Load Skin Type Model =====
try:
    with open(SKIN_MODEL_FILE, "rb") as f:
        skin_model = pickle.load(f)
    print("✅ Skin type model loaded")
except FileNotFoundError:
    skin_model = None
    print(f"❌ Skin type model not found at {SKIN_MODEL_FILE}")

try:
    with open(SKIN_ENCODERS_FILE, "rb") as f:
        label_encoders = pickle.load(f)
    print("✅ Skin label encoders loaded")
except FileNotFoundError:
    label_encoders = {}
    print("⚠️ Skin label encoders not found")

try:
    with open(SKIN_FEATURES_FILE, "rb") as f:
        skin_features = pickle.load(f)
    print("✅ Skin feature columns loaded")
except FileNotFoundError:
    skin_features = ["Age", "Gender", "Humidity", "Hydration_Level", "Oil_Level", "Sensitivity", "Temperature"]
    print("⚠️ Skin feature columns not found, using fallback")

# ===== Load Skincare Routine Model =====
try:
    with open(ROUTINE_MODEL_FILE, "rb") as f:
        loaded = pickle.load(f)
        if isinstance(loaded, tuple):
            routine_model = loaded[0]           # actual model
            routine_features_cols = loaded[1]   # feature columns used in training
        else:
            routine_model = loaded
            routine_features_cols = None
    print("✅ Skincare routine model loaded")
except FileNotFoundError:
    routine_model = None
    routine_features_cols = None
    print(f"❌ Skincare routine model not found at {ROUTINE_MODEL_FILE}")

# ===== Helper function =====
def safe_transform(col, value):
    if col not in label_encoders:
        return value
    le = label_encoders[col]
    try:
        return int(le.transform([value])[0])
    except:
        try:
            return int(value)
        except:
            return 0

# ======================== USER ROUTES =========================
@app.route("/api/register", methods=["POST"])
def register():
    data = request.json
    username = data.get("username")
    password = data.get("password")
    if not username or not password:
        return jsonify({"status": "error", "message": "Username and password required"}), 400
    if User.query.filter_by(username=username).first():
        return jsonify({"status": "error", "message": "User already exists"}), 400
    hashed_pw = generate_password_hash(password)
    user = User(
        username=username,
        password=hashed_pw,
        name=data.get("name"),
        age=data.get("age"),
        gender=data.get("gender"),
        location=data.get("location"),
        skin_tone=data.get("skin_tone"),
        allergies=data.get("allergies"),
    )
    db.session.add(user)
    db.session.commit()
    return jsonify({"status": "success", "message": "User registered successfully!"}), 201

@app.route("/api/login", methods=["POST"])
def login():
    data = request.json
    username = data.get("username")
    password = data.get("password")
    user = User.query.filter_by(username=username).first()
    if not user or not check_password_hash(user.password, password):
        return jsonify({"status": "error", "message": "Invalid credentials"}), 401
    return jsonify({
        "status": "success",
        "message": "Login successful",
        "username": user.username,
        "user": user.to_dict()
    })

# ======================== SKIN TYPE PREDICTION =========================
@app.route("/predict", methods=["POST"])
def predict_skin():
    if skin_model is None:
        return jsonify({"error": "Skin type model not loaded"}), 500
    try:
        data = request.json or {}
        row = []
        defaults = {
            "Age": 25, "Gender": "Female", "Humidity": 50, "Temperature": 25,
            "Hydration_Level": "Medium", "Oil_Level": "Medium", "Sensitivity": "Medium",
        }
        for col in skin_features:
            val = data.get(col, defaults.get(col, 0))
            row.append(safe_transform(col, val) if col in label_encoders else float(val))
        X = np.array([row])
        pred_code = int(skin_model.predict(X)[0])
        skin_type_name = str(pred_code)
        if "Skin_Type" in label_encoders:
            try:
                skin_type_name = label_encoders["Skin_Type"].inverse_transform([pred_code])[0]
            except:
                pass
        return jsonify({"prediction": pred_code, "skin_type": skin_type_name})
    except Exception as e:
        print("Skin type prediction error:", e)
        return jsonify({"error": str(e)}), 400

# ======================== SKINCARE ROUTINE ANALYSIS =========================
@app.route("/api/predict_routine_analysis", methods=["POST"])
def predict_routine_analysis():
    if routine_model is None:
        return jsonify({"error": "Skincare routine model not loaded"}), 500
    try:
        data = request.json or {}

        # Predict skin type if not provided
        if "Skin_Type" not in data or not data["Skin_Type"]:
            skin_response = predict_skin_internal(data)
            data["Skin_Type"] = skin_response.get("skin_type", "Normal")

        # Convert input to DataFrame
        input_df = pd.DataFrame([data])

        # One-hot encode categorical features like training
        input_encoded = pd.get_dummies(input_df)

        # Reindex to ensure same features as training
        if routine_features_cols is not None:
            input_encoded = input_encoded.reindex(columns=routine_features_cols, fill_value=0)

        # Predict routine
        pred_array = routine_model.predict(input_encoded)[0]

        # Map predictions to routine columns
        routine_cols = [
            "morning_cleanser","morning_toner","morning_serum","morning_moisturizer",
            "morning_sunscreen","morning_exfoliator","morning_mask",
            "night_cleanser","night_toner","night_serum","night_moisturizer",
            "night_exfoliator","night_mask"
        ]

        morning_routine = []
        night_routine = []
        for i, col in enumerate(routine_cols):
            if int(pred_array[i]):
                if "morning_" in col:
                    morning_routine.append(col.replace("morning_", ""))
                else:
                    night_routine.append(col.replace("night_", ""))

        # ===== Dynamic treatment recommendation based on concern =====
        concern_treatments = {
            "wrinkles": "Gentle Hydrating Cleanser AM, Vitamin C Serum AM, Hyaluronic Moisturizer AM, SPF 30 AM, Retinol Serum PM, Peptide Night Cream PM",
            "acne": "Oil-Free Salicylic Acid Cleanser AM, Niacinamide Serum AM, Lightweight Gel Moisturizer AM, SPF 30 AM, Benzoyl Peroxide Spot PM, Adapalene PM",
            "dark_circles": "Gentle Hydrating Cleanser AM, Caffeine Eye Cream AM, Lightweight Moisturizer AM, SPF 30 AM, Niacinamide Eye Cream PM, Lightweight Gel PM",
            "dark_spots": "Gentle Hydrating Cleanser AM, Vitamin C Serum AM, Kojic Acid/Niacinamide/Alpha Arbutin PM, SPF 30 AM",
            "none": "Gentle Cleanser AM, Hydrating Serum AM, Moisturizer AM, SPF 30 AM, Night Serum PM, Night Cream PM"
        }

        concern = data.get("Common_Concern", "none").lower()
        treatment_recommendation = concern_treatments.get(concern, concern_treatments["none"])

        formatted_response = {
            "Morning_Routine": morning_routine,
            "Night_Routine": night_routine,
            "Treatment_Recommendation": treatment_recommendation
        }

        return jsonify(formatted_response)
    except Exception as e:
        print("Routine analysis prediction error:", e)
        return jsonify({"error": str(e)}), 400

# ===== Internal function to predict skin type for routine analysis =====
def predict_skin_internal(data):
    try:
        row = []
        defaults = {
            "Age": 25, "Gender": "Female", "Humidity": 50, "Temperature": 25,
            "Hydration_Level": "Medium", "Oil_Level": "Medium", "Sensitivity": "Medium",
        }
        for col in skin_features:
            val = data.get(col, defaults.get(col, 0))
            row.append(safe_transform(col, val) if col in label_encoders else float(val))
        X = np.array([row])
        pred_code = int(skin_model.predict(X)[0])
        skin_type_name = str(pred_code)
        if "Skin_Type" in label_encoders:
            try:
                skin_type_name = label_encoders["Skin_Type"].inverse_transform([pred_code])[0]
            except:
                skin_type_name = str(pred_code)
        return {"prediction": pred_code, "skin_type": skin_type_name}
    except Exception as e:
        print("Internal skin prediction error:", e)
        return {"prediction": 0, "skin_type": "Normal"}

# ======================== HOME =========================
@app.route("/")
def home():
    return "🚀 API is running!"

# ======================== RUN SERVER =========================
if __name__ == "__main__":
    print("🚀 Flask server running at http://127.0.0.1:5000")
    app.run(host="0.0.0.0", port=5000, debug=True)
