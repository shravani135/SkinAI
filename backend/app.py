from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from database import init_db, db
from models import User
import pickle
import pandas as pd
import numpy as np
import os
from datetime import datetime
import json

created_at = datetime.now() 

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})  # Allow requests from React

# ==================== Database Initialization ====================
init_db(app)
with app.app_context():
    db.create_all()
    print("✅ Database initialized and tables created.")

# ==================== File Paths ====================
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Skin Type Model
SKIN_MODEL_FILE = os.path.join(BASE_DIR, "modelsoutput", "skin_type_model.pkl")
SKIN_ENCODERS_FILE = os.path.join(BASE_DIR, "modelsoutput", "label_encoders.pkl")
SKIN_FEATURES_FILE = os.path.join(BASE_DIR, "modelsoutput", "feature_columns.pkl")

# Skincare Routine Model
ROUTINE_MODEL_FILE = os.path.join(BASE_DIR, "modelsoutput", "skincare_lgb_model.pkl")

# KNN Product Recommender
KNN_MODEL_FILE = os.path.join(BASE_DIR, "modelsoutput", "knn_recommender_model.pkl")
PRODUCT_DATA_PATH = os.path.join(BASE_DIR, "model_csv", "dataset.csv")

# ==================== Load Models ====================
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

try:
    with open(ROUTINE_MODEL_FILE, "rb") as f:
        loaded = pickle.load(f)
        if isinstance(loaded, tuple):
            routine_model = loaded[0]
            routine_features_cols = loaded[1]
        else:
            routine_model = loaded
            routine_features_cols = None
    print("✅ Skincare routine model loaded")
except FileNotFoundError:
    routine_model = None
    routine_features_cols = None
    print(f"❌ Skincare routine model not found at {ROUTINE_MODEL_FILE}")

try:
    with open(KNN_MODEL_FILE, "rb") as f:
        knn_model = pickle.load(f)
    print("✅ KNN Model loaded successfully")
except FileNotFoundError:
    knn_model = None
    print(f"❌ KNN Model not found at {KNN_MODEL_FILE}")

# ==================== Load Products CSV ====================
if os.path.exists(PRODUCT_DATA_PATH):
    products_df = pd.read_csv(PRODUCT_DATA_PATH)
    products_df.columns = products_df.columns.str.strip()  # Remove whitespace
else:
    products_df = pd.DataFrame([
        {"Brand": "Mamaearth", "Product Type": "Cleanser", "Product Name": "Chia Calming Face Cleanser", "ProductLink": "https://mamaearth.in/product/mamaearth-chia-calming-face-cleanser", "Ingredients": ["Chia Seed", "Ceramides"], "Image": ""},
        {"Brand": "Dot & Key", "Product Type": "Eye Cream", "Product Name": "Watermelon Hydrogel Under-eye Patches", "ProductLink": "https://www.dotandkey.com/products/watermelon-cooling-hydrogel-eye-patches", "Ingredients": ["Watermelon"], "Image": ""}
    ])
    print("⚠️ Product CSV not found, using fallback data")

# ==================== Helper Functions ====================
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

# ==================== Helper Function ====================
def filter_safe_products(product_list, product_allergies):
    """
    Filter out products that contain any of the specified allergies.
    Checks both ingredient lists and specific allergy columns in CSV.
    """
    safe_products = []
    for product in product_list:
        is_safe = True
        # Check Ingredients list if present
        ingredients = product.get("Ingredients", [])
        if any(allergen.lower() in [str(i).lower() for i in ingredients] for allergen in product_allergies):
            is_safe = False
        # Also check allergy columns like Niacinamide, Paraben, etc.
        for allergen in product_allergies:
            col_name = allergen.replace(" ", "").replace("/", "").replace("-", "").capitalize()
            if col_name in product and str(product[col_name]) == "1":
                is_safe = False
                break
        if is_safe:
            safe_products.append(product)
    return safe_products


# ==================== User Routes ====================
import json
from datetime import datetime

@app.route("/api/register", methods=["POST"])
def register():
    data = request.get_json()
    
    username = data.get("username")
    password = data.get("password")
    name = data.get("name")
    age = data.get("age")
    gender = data.get("gender")
    location = data.get("location")
    skin_tone = data.get("skin_tone")
    allergies = data.get("allergies", [])  # This is a list

    # Convert list to JSON string before saving
    allergies_str = json.dumps(allergies)  

    # Hash password
    hashed_password = generate_password_hash(password)

    # Create user
    user = User(
        username=username,
        password=hashed_password,
        name=name,
        age=age,
        gender=gender,
        location=location,
        skin_tone=skin_tone,
        allergies=allergies_str,
        created_at=datetime.now()
    )
    db.session.add(user)
    db.session.commit()

    return jsonify({"status": "success", "message": "User registered successfully", "user": {"username": username}})


@app.route("/api/login", methods=["POST"])
def login():
    data = request.get_json(force=True)  # <- force=True ensures JSON is parsed
    username = data.get("username")
    password = data.get("password")
    
    if not username or not password:
        return jsonify({"status": "error", "message": "Username and password required"}), 400
    
    user = User.query.filter_by(username=username).first()
    if not user or not check_password_hash(user.password, password):
        return jsonify({"status": "error", "message": "Invalid credentials"}), 401
    
    return jsonify({
        "status": "success",
        "message": "Login successful",
        "username": user.username,
        "user": user.to_dict() if hasattr(user, "to_dict") else {"id": user.id, "username": user.username}
    }), 200



@app.route("/api/profile/<username>", methods=["GET"])
def profile(username):
    user = User.query.filter_by(username=username).first()
    if not user:
        return jsonify({"error": "User not found"}), 404
    return jsonify({"status": "success", "user": user.to_dict()}), 200

# ==================== Skin Type Prediction ====================
@app.route("/predict", methods=["POST"])
def predict_skin():
    if skin_model is None:
        return jsonify({"error": "Skin type model not loaded"}), 500
    try:
        data = request.json or {}
        row = []
        defaults = {"Age":25,"Gender":"Female","Humidity":50,"Temperature":25,"Hydration_Level":"Medium","Oil_Level":"Medium","Sensitivity":"Medium"}
        for col in skin_features:
            val = data.get(col, defaults.get(col,0))
            row.append(safe_transform(col,val) if col in label_encoders else float(val))
        X = pd.DataFrame([row], columns=skin_features)
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

def predict_skin_internal(data):
    try:
        row = []
        defaults = {"Age":25,"Gender":"Female","Humidity":50,"Temperature":25,"Hydration_Level":"Medium","Oil_Level":"Medium","Sensitivity":"Medium"}
        for col in skin_features:
            val = data.get(col, defaults.get(col,0))
            row.append(safe_transform(col,val) if col in label_encoders else float(val))
        X = pd.DataFrame([row], columns=skin_features)
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
        return {"prediction":0, "skin_type":"Normal"}

# ==================== Skincare Routine Analysis ====================
@app.route("/api/predict_routine_analysis", methods=["POST"])
def predict_routine_analysis():
    if routine_model is None:
        return jsonify({"error": "Skincare routine model not loaded"}), 500
    try:
        data = request.json or {}
        if "Skin_Type" not in data or not data["Skin_Type"]:
            skin_response = predict_skin_internal(data)
            data["Skin_Type"] = skin_response.get("skin_type", "Normal")
        input_df = pd.DataFrame([data])
        input_encoded = pd.get_dummies(input_df)
        if routine_features_cols is not None:
            input_encoded = input_encoded.reindex(columns=routine_features_cols, fill_value=0)
        pred_array = routine_model.predict(input_encoded)[0]
        routine_cols = ["morning_cleanser","morning_toner","morning_serum","morning_moisturizer","morning_sunscreen","morning_exfoliator","morning_mask","night_cleanser","night_toner","night_serum","night_moisturizer","night_exfoliator","night_mask"]
        morning_routine=[]
        night_routine=[]
        for i,col in enumerate(routine_cols):
            if int(pred_array[i]):
                if "morning_" in col:
                    morning_routine.append(col.replace("morning_",""))
                else:
                    night_routine.append(col.replace("night_",""))
        concern_treatments = {
            "wrinkles":"Gentle Hydrating Cleanser AM, Vitamin C Serum AM, Hyaluronic Moisturizer AM, SPF 30 AM, Retinol Serum PM, Peptide Night Cream PM",
            "acne":"Oil-Free Salicylic Acid Cleanser AM, Niacinamide Serum AM, Lightweight Gel Moisturizer AM, SPF 30 AM, Benzoyl Peroxide Spot PM, Adapalene PM",
            "dark_circles":"Gentle Hydrating Cleanser AM, Caffeine Eye Cream AM, Lightweight Moisturizer AM, SPF 30 AM, Niacinamide Eye Cream PM, Lightweight Gel PM",
            "dark_spots":"Gentle Hydrating Cleanser AM, Vitamin C Serum AM, Kojic Acid/Niacinamide/Alpha Arbutin PM, SPF 30 AM",
            "none":"Gentle Cleanser AM, Hydrating Serum AM, Moisturizer AM, SPF 30 AM, Night Serum PM, Night Cream PM"
        }
        concern = data.get("Common_Concern","none").lower()
        treatment_recommendation = concern_treatments.get(concern,concern_treatments["none"])
        formatted_response={"Morning_Routine":morning_routine,"Night_Routine":night_routine,"Treatment_Recommendation":treatment_recommendation}
        return jsonify(formatted_response)
    except Exception as e:
        print("Routine analysis prediction error:", e)
        return jsonify({"error":str(e)}),400

# ==================== KNN Product Recommendation ====================
@app.route("/api/recommend", methods=["POST"])
def recommend_products():
    if knn_model is None:
        return jsonify({"error": "KNN model not loaded"}), 500

    data = request.get_json() or {}
    product_allergies = [a.lower() for a in data.get("product_allergies", [])]
    selected_products = data.get("selected_products", [])
    brand_preference = data.get("brand_preference", "").lower()

    recommendations = []
    unavailable = []

    for product_type in selected_products:
        filtered = products_df[products_df["Product Type"].str.lower() == product_type.lower()]

        # Filter for allergy-safe products
        safe_products = filter_safe_products(filtered.to_dict(orient="records"), product_allergies)

        if brand_preference:
            # Check preferred brand first
            preferred_brand_safe = [p for p in safe_products if p["Brand"].lower() == brand_preference]
            if preferred_brand_safe:
                recommendations.append({
                    "Brand": preferred_brand_safe[0]["Brand"],
                    "ProductType": preferred_brand_safe[0]["Product Type"],
                    "ProductName": preferred_brand_safe[0]["Product Name"],
                    "ProductLink": preferred_brand_safe[0].get("Product Link") or preferred_brand_safe[0].get("ProductLink") or ""
                })
                continue  # Next product_type

            # No safe product in preferred brand
            if safe_products:
                alt_brands = list(set([p["Brand"] for p in safe_products]))
                unavailable.append({
                    "ProductType": product_type,
                    "Brand": brand_preference,
                    "Msg": f"No safe {product_type} found for selected brand (contains allergies).",
                    "AlternativeBrands": alt_brands
                })
                # Pick first safe product from another brand
                recommendations.append({
                    "Brand": safe_products[0]["Brand"],
                    "ProductType": safe_products[0]["Product Type"],
                    "ProductName": safe_products[0]["Product Name"],
                    "ProductLink": safe_products[0].get("Product Link") or safe_products[0].get("ProductLink") or ""
                })
                continue

            # No safe product at all
            unavailable.append({
                "ProductType": product_type,
                "Brand": brand_preference,
                "Msg": f"No safe {product_type} found in any brand!",
                "AlternativeBrands": []
            })
        else:
            # No brand preference
            if safe_products:
                recommendations.append({
                    "Brand": safe_products[0]["Brand"],
                    "ProductType": safe_products[0]["Product Type"],
                    "ProductName": safe_products[0]["Product Name"],
                    "ProductLink": safe_products[0].get("Product Link") or safe_products[0].get("ProductLink") or ""
                })
            else:
                unavailable.append({
                    "ProductType": product_type,
                    "Brand": "",
                    "Msg": f"No safe {product_type} found in any brand!",
                    "AlternativeBrands": []
                })

    return jsonify({
        "recommendations": recommendations,
        "unavailable": unavailable
    })



# ==================== Home Route ====================
@app.route("/")
def home_page():
    return "🚀 API is running!"

# ==================== Run Server ====================
if __name__ == "__main__":
    print("🚀 Flask server running at http://127.0.0.1:5000")
    app.run(host="0.0.0.0", port=5000, debug=True)  