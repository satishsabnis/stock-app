from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import yfinance as yf
import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression

# Vercel natively looks for the "app" variable to route serverless requests
app = FastAPI()

# Enable CORS so your Vercel frontend can talk to your Vercel backend securely
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/predict/{ticker}")
def predict_stock(ticker: str):
    try:
        # Fetch the historical market data (last 6 months)
        stock = yf.Ticker(ticker)
        df = stock.history(period="6m")
        
        if df.empty:
            raise HTTPException(status_code=404, detail=f"Ticker {ticker} not found or has no data.")
        
        # Calculate standard 20-day and 50-day moving averages using Pandas
        df['MA20'] = df['Close'].rolling(window=20).mean()
        df['MA50'] = df['Close'].rolling(window=50).mean()
        
        # Prepare tracking arrays for linear regression forecasting
        df = df.dropna()
        if len(df) < 10:
            raise HTTPException(status_code=400, detail="Insufficient data points for calculation.")
            
        df['Time_Index'] = np.arange(len(df))
        
        X = df[['Time_Index']].values
        y = df['Close'].values
        
        # Initialize and fit the Scikit-Learn linear regression engine
        model = LinearRegression()
        model.fit(X, y)
        
        # Predict the next market closing trajectory step
        next_index = len(df)
        predicted_price = float(model.predict([[next_index]])[0])
        
        # Calculate standard deviations for market boundaries
        current_price = float(df['Close'].iloc[-1])
        std_dev = float(df['Close'].std())
        
        return {
            "ticker": ticker.upper(),
            "currentPrice": round(current_price, 2),
            "predictedPrice": round(predicted_price, 2),
            "upperBoundary": round(predicted_price + (1.5 * std_dev), 2),
            "lowerBoundary": round(predicted_price - (1.5 * std_dev), 2),
            "ma20": round(float(df['MA20'].iloc[-1]), 2),
            "ma50": round(float(df['MA50'].iloc[-1]), 2),
            "status": "Success"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))