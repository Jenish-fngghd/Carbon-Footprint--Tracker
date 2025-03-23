from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Enable CORS to allow the frontend to access the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Update this to your frontend URL in production (e.g., "http://localhost:3000")
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Model for sensor data
class SensorData(BaseModel):
    temperature: float
    humidity: float
    co2: float

# Store the latest sensor readings in memory
latest_readings = {
    "temperature": 0.0,
    "humidity": 0.0,
    "co2": 0.0
}

# POST endpoint to receive data from ESP32
@app.post("/update")
async def update_sensor_data(data: SensorData):
    global latest_readings
    latest_readings["temperature"] = data.temperature
    latest_readings["humidity"] = data.humidity
    latest_readings["co2"] = data.co2
    return {"status": "success", "message": "Data updated"}

# GET endpoint for the frontend to fetch the latest data
@app.get("/readings")
async def get_readings():
    return latest_readings
