import requests
import pandas as pd
import numpy as np
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout
from sklearn.preprocessing import MinMaxScaler
import joblib
import os

# Ensure models directory exists
os.makedirs("models", exist_ok=True)

# Top 15 cryptocurrencies
TOP_15_COINS = ["BTCUSDT", "ETHUSDT", "BNBUSDT", "XRPUSDT", "ADAUSDT",
                "DOGEUSDT", "SOLUSDT", "DOTUSDT", "MATICUSDT", "LTCUSDT",
                "BCHUSDT", "LINKUSDT", "ATOMUSDT", "XLMUSDT", "TRXUSDT"]

# Function to fetch historical data from Binance
def fetch_binance_data(symbol, interval="1d", limit=1000):
    url = f"https://api.binance.com/api/v3/klines?symbol={symbol}&interval={interval}&limit={limit}"
    response = requests.get(url)
    data = response.json()

    if "code" in data:  # Check for API errors
        print(f"Error fetching data for {symbol}: {data}")
        return None

    # Convert data to DataFrame
    df = pd.DataFrame(data, columns=[
        "timestamp", "open", "high", "low", "close", "volume",
        "close_time", "quote_asset_volume", "trades", "taker_buy_base",
        "taker_buy_quote", "ignore"
    ])
    df["close"] = df["close"].astype(float)  # Convert close price to float
    df["timestamp"] = pd.to_datetime(df["timestamp"], unit='ms')  # Convert timestamp
    return df[["timestamp", "close"]]

# Function to create dataset for LSTM
def create_sequences(data, time_steps=30):
    X, y = [], []
    for i in range(len(data) - time_steps):
        X.append(data[i:i + time_steps])
        y.append(data[i + time_steps])
    return np.array(X), np.array(y)

# Function to train and save LSTM model
def train_lstm_model(symbol):
    df = fetch_binance_data(symbol)
    if df is None:
        return

    # Normalize data
    scaler = MinMaxScaler(feature_range=(0, 1))
    df["close_scaled"] = scaler.fit_transform(df[["close"]])

    # Prepare data for LSTM
    time_steps = 30  # Using last 30 days to predict next price
    X, y = create_sequences(df["close_scaled"].values, time_steps)

    # Split data into train & test
    train_size = int(len(X) * 0.8)
    X_train, X_test = X[:train_size], X[train_size:]
    y_train, y_test = y[:train_size], y[train_size:]

    # Reshape for LSTM
    X_train = X_train.reshape(-1, time_steps, 1)
    X_test = X_test.reshape(-1, time_steps, 1)

    # Build LSTM Model
    model = Sequential([
        LSTM(50, return_sequences=True, input_shape=(time_steps, 1)),
        Dropout(0.2),
        LSTM(50, return_sequences=False),
        Dropout(0.2),
        Dense(25),
        Dense(1)
    ])

    # Compile model
    model.compile(optimizer="adam", loss="mean_squared_error")

    # Train model
    model.fit(X_train, y_train, epochs=50, batch_size=16, validation_data=(X_test, y_test))

    #Save model & scaler
    model.save(f"models/{symbol}_lstm.h5")
    joblib.dump(scaler, f"models/{symbol}_scaler.pkl")
    print(f"LSTM Model saved for {symbol}")

# Train models for top 15 coins
for coin in TOP_15_COINS:
    train_lstm_model(coin)

