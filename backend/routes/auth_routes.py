from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
from models import Owner
from schemas.schemas import LoginRequest, TokenResponse
from auth import verify_password, get_password_hash, create_access_token

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login", response_model=TokenResponse)
def login(request: LoginRequest, db: Session = Depends(get_db)):
    owner = db.query(Owner).filter(Owner.username == request.username).first()
    if not owner or not verify_password(request.password, owner.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password"
        )
    token = create_access_token({"sub": owner.username})
    return {"access_token": token, "token_type": "bearer"}


@router.post("/setup")
def setup_owner(request: LoginRequest, db: Session = Depends(get_db)):
    """One-time setup to create the owner account."""
    existing = db.query(Owner).first()
    if existing:
        raise HTTPException(status_code=400, detail="Owner already exists")
    hashed = get_password_hash(request.password)
    owner = Owner(username=request.username, password_hash=hashed)
    db.add(owner)
    db.commit()
    return {"message": "Owner account created successfully"}
