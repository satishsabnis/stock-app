from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.engine import calculate_eod_prediction

app = FastAPI()

# FORCE OPEN SECURITY GATEWAYS (CORS) FOR LOCAL DEVELOPMENT
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows any local server port (like 3000) to connect
    allow_credentials=True,
    allow_methods=["*"],  # Allows all connection types (GET, POST, etc.)
    allow_headers=["*"],  # Allows all data headers
)

@app.get("/api/predict/{ticker}")
def get_prediction(ticker: str):
    return calculate_eod_prediction(ticker)