from fastapi import APIRouter, Depends
from app.presentation.dependencies.auth_dependency import get_current_user

router = APIRouter()

@router.get("/test")
def test(user = Depends(get_current_user)):
    return {"message": "Test successful", "user": user}