from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models import Medicine
from schemas.schemas import MedicineCreate, MedicineUpdate, MedicineOut
from auth import verify_token

router = APIRouter(prefix="/medicines", tags=["medicines"])


@router.get("/", response_model=List[MedicineOut])
def get_medicines(db: Session = Depends(get_db)):
    return db.query(Medicine).all()


@router.get("/{medicine_id}", response_model=MedicineOut)
def get_medicine(medicine_id: int, db: Session = Depends(get_db)):
    med = db.query(Medicine).filter(Medicine.id == medicine_id).first()
    if not med:
        raise HTTPException(status_code=404, detail="Medicine not found")
    return med


@router.post("/", response_model=MedicineOut)
def create_medicine(medicine: MedicineCreate, db: Session = Depends(get_db), _=Depends(verify_token)):
    db_med = Medicine(**medicine.dict())
    db.add(db_med)
    db.commit()
    db.refresh(db_med)
    return db_med


@router.put("/{medicine_id}", response_model=MedicineOut)
def update_medicine(medicine_id: int, medicine: MedicineUpdate, db: Session = Depends(get_db), _=Depends(verify_token)):
    db_med = db.query(Medicine).filter(Medicine.id == medicine_id).first()
    if not db_med:
        raise HTTPException(status_code=404, detail="Medicine not found")
    for key, value in medicine.dict().items():
        setattr(db_med, key, value)
    db.commit()
    db.refresh(db_med)
    return db_med


@router.delete("/{medicine_id}")
def delete_medicine(medicine_id: int, db: Session = Depends(get_db), _=Depends(verify_token)):
    db_med = db.query(Medicine).filter(Medicine.id == medicine_id).first()
    if not db_med:
        raise HTTPException(status_code=404, detail="Medicine not found")
    db.delete(db_med)
    db.commit()
    return {"message": "Medicine deleted successfully"}
