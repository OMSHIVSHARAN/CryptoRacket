from flask import Flask, jsonify, request
from flask_cors import CORS  # ✅ Import CORS
import joblib
import numpy as np
import os

app = Flask(__name__)
CORS(app)  # ✅ Enable CORS

BINANCE_API_URL = "https://api.binance.com/api/v3/klines"

print("🔥 Flask API Starting...")

# Function to load a trained model and make predictions
def predict_price(symbol, days_ahead=30):
    model_path = f"models/{symbol}_lstm.h5"  
    scaler_path = f"models/{symbol}_scaler.pkl"
    
    print(f"🔍 Checking model path: {model_path}")
    
    if not os.path.exists(model_path):
        print(f"❌ Model file not found: {model_path}")
        return None

    try:
        model = joblib.load(model_path)
        future_days = np.array([[days_ahead]])
        predicted_price = model.predict(future_days)[0]

        print(f"✅ Prediction for {symbol}: {predicted_price}")
        return predicted_price
    except Exception as e:
        print(f"❌ Error in prediction: {e}")
        return None

# Home route
@app.route("/")
def home():
    return jsonify({"message": "Crypto Racket API Running!"})

# Prediction endpoint
@app.route('/predict', methods=['GET'])
def predict():
    symbol = request.args.get("symbol", "BTCUSDT")
    days_ahead = int(request.args.get("days", 30))

    print(f"🔄 Received request: symbol={symbol}, days={days_ahead}")

    predicted_price = predict_price(symbol, days_ahead)
    if predicted_price is not None:
        return jsonify({"symbol": symbol, "predicted_price": predicted_price})
    else:
        return jsonify({"error": "Model not found or prediction failed"}), 404

if __name__ == "__main__":
    print("🚀 Flask Server Running on http://127.0.0.1:5000")
    app.run(debug=True, port=5000)  # ✅ Changed port to 5000
