import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from handlers.balance import relay_transaction, get_transaction_history, get_balance

# Initialize the FastAPI app
app = FastAPI()

# Load environment variables
from dotenv import load_dotenv
load_dotenv()

# Middleware for CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
@app.post("/relay")
async def relay(request: dict):
    try:
        return await relay_transaction(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")

@app.get("/history")
async def history():
    try:
        return await get_transaction_history()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")

@app.get("/balance")
async def balance(address: str):
    try:
        return await get_balance(address)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")

# Main entry point
if __name__ == "__main__":
    import uvicorn

    port = os.getenv("PORT", "8080")  # Default to 8080 if PORT is not set
    print(f"Server running on port {port}")
    uvicorn.run(app, host="0.0.0.0", port=int(port))
