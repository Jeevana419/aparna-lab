from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models import MedicineRequest, Medicine
from schemas.schemas import MedicineRequestCreate, MedicineRequestOut, MedicineRequestStatusUpdate
from auth import verify_token

router = APIRouter(prefix="/medicine-requests", tags=["medicine-requests"])


@router.post("/", response_model=MedicineRequestOut)
def create_request(request: MedicineRequestCreate, db: Session = Depends(get_db)):
    med = db.query(Medicine).filter(Medicine.id == request.medicine_id).first()
    if not med:
        raise HTTPException(status_code=404, detail="Medicine not found")
    db_request = MedicineRequest(**request.dict())
    db.add(db_request)
    db.commit()
    db.refresh(db_request)
    return db_request


@router.get("/", response_model=List[MedicineRequestOut])
def get_requests(db: Session = Depends(get_db), _=Depends(verify_token)):
    return db.query(MedicineRequest).order_by(MedicineRequest.created_at.desc()).all()


@router.get("/by-contact/{contact}", response_model=List[MedicineRequestOut])
def get_requests_by_contact(contact: str, db: Session = Depends(get_db)):
    return db.query(MedicineRequest).filter(MedicineRequest.contact == contact).order_by(MedicineRequest.created_at.desc()).all()


@router.put("/{request_id}/status", response_model=MedicineRequestOut)
def update_request_status(request_id: int, status_update: MedicineRequestStatusUpdate, db: Session = Depends(get_db), _=Depends(verify_token)):
    req = db.query(MedicineRequest).filter(MedicineRequest.id == request_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Request not found")
    if status_update.status not in ["pending", "approved", "rejected"]:
        raise HTTPException(status_code=400, detail="Invalid status")
    req.status = status_update.status
    db.commit()
    db.refresh(req)
    return req


@router.delete("/{request_id}")
def delete_request(request_id: int, db: Session = Depends(get_db), _=Depends(verify_token)):
    req = db.query(MedicineRequest).filter(MedicineRequest.id == request_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Request not found")
    db.delete(req)
    db.commit()
    return {"message": "Request deleted"}
