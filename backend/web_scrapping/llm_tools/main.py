from fastapi import FastAPI
from routes import llm
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI() 
app.include_router(llm.router)  # Incluir el router desde routes/llm.py

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Hello fast"}
