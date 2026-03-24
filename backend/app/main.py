from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.presentation.routes import test_routes

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(test_routes.router)

@app.get("/ping")
def ping():
    return {"ping": "pong"}

@app.get("/")
def read_root():
    return {"Hello": "World"}