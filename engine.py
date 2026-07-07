import yfinance as yf
import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression

def calculate_eod_prediction(ticker: str):
    try:
        # 1. Fetch the last 60 days of historical closing prices
        stock = yf.Ticker(ticker)
        df = stock.history(period="60d")
        
        if df.empty or len(df) < 15:
            return {"error": f"Insufficient historical data available for ticker {ticker}"}
        
        # 2. Extract closing coordinates and create sequential feature indices
        df = df.reset_index()
        df['Day_Index'] = np.arange(len(df))
        
        X = df[['Day_Index']].values
        y = df['Close'].values
        
        # 3. Train the Linear Regression Model
        model = LinearRegression()
        model.fit(X, y)
        
        # Predict the coordinate for the next consecutive trading session
        next_day_index = len(df)
        predicted_close = float(model.predict([[next_day_index]])[0])
        
        # 4. Calculate volatility boundaries (Historical Root Mean Squared Error)
        historical_predictions = model.predict(X)
        residuals = y - historical_predictions
        rmse = float(np.sqrt(np.mean(residuals**2)))
        
        # 5. Formulate defensive risk boundaries
        lower_bound = predicted_close - (1.5 * rmse)
        upper_bound = predicted_close + (1.5 * rmse)
        
        # Calculate trailing 30-day directional direction metrics
        recent_trend = "Bullish" if predicted_close > float(y[-1]) else "Bearish"
        
        # ==========================================
        # ADVANCED QUANT ALGORITHMS INSERTION POINT
        # ==========================================
        
        # A. Fibonacci Retracement Levels Calculation (Using 60-day historical extremes)
        swing_high = float(df['Close'].max())
        swing_low = float(df['Close'].min())
        price_range = swing_high - swing_low
        
        fib_382 = swing_high - (price_range * 0.382)
        fib_500 = swing_high - (price_range * 0.500)
        fib_618 = swing_high - (price_range * 0.618)
        
        # B. 14-Day Relative Strength Index (RSI) Calculation
        delta = df['Close'].diff()
        gain = delta.where(delta > 0, 0.0)
        loss = -delta.where(delta < 0, 0.0)
        
        avg_gain = gain.rolling(window=14).mean()
        avg_loss = loss.rolling(window=14).mean()
        
        # Safe relative strength calculation to prevent division-by-zero errors
        last_avg_gain = avg_gain.iloc[-1]
        last_avg_loss = avg_loss.iloc[-1]
        
        if last_avg_loss == 0:
            rsi_score = 100.0 if last_avg_gain > 0 else 50.0
        else:
            rs = last_avg_gain / last_avg_loss
            rsi_score = 100.0 - (100.0 / (1.0 + rs))
            
        # ==========================================
        
        return {
            "ticker": ticker.upper(),
            "last_close": float(y[-1]),
            "predicted_target": round(predicted_close, 2),
            "risk_range_lower": round(lower_bound, 2),
            "risk_range_upper": round(upper_bound, 2),
            "direction_trend": recent_trend,
            "model_confidence_score": round(max(0, 100 - (rmse / float(y[-1]) * 100)), 1),
            
            # Appending our new algorithmic indicators into the payload response
            "fibonacci": {
                "level_382": round(fib_382, 2),
                "level_500": round(fib_500, 2),
                "level_618": round(fib_618, 2)
            },
            "momentum_rsi": round(float(rsi_score), 1)
        }
        
    except Exception as e:
        return {"error": f"Backend computation failed: {str(e)}"}