from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models import Booking, Test
from schemas.schemas import BookingCreate, BookingOut, BookingStatusUpdate
from auth import verify_token

router = APIRouter(prefix="/bookings", tags=["bookings"])


@router.post("/", response_model=BookingOut)
def create_booking(booking: BookingCreate, db: Session = Depends(get_db)):
    test = db.query(Test).filter(Test.id == booking.test_id).first()
    if not test:
        raise HTTPException(status_code=404, detail="Test not found")
    db_booking = Booking(**booking.dict())
    db.add(db_booking)
    db.commit()
    db.refresh(db_booking)
    return db_booking


@router.get("/", response_model=List[BookingOut])
def get_bookings(db: Session = Depends(get_db), _=Depends(verify_token)):
    return db.query(Booking).order_by(Booking.created_at.desc()).all()


@router.get("/by-contact/{contact}", response_model=List[BookingOut])
def get_bookings_by_contact(contact: str, db: Session = Depends(get_db)):
    return db.query(Booking).filter(Booking.contact == contact).order_by(Booking.created_at.desc()).all()


@router.put("/{booking_id}/status", response_model=BookingOut)
def update_booking_status(booking_id: int, status_update: BookingStatusUpdate, db: Session = Depends(get_db), _=Depends(verify_token)):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    if status_update.status not in ["pending", "approved", "rejected"]:
        raise HTTPException(status_code=400, detail="Invalid status")
    booking.status = status_update.status
    db.commit()
    db.refresh(booking)
    return booking


@router.delete("/{booking_id}")
def delete_booking(booking_id: int, db: Session = Depends(get_db), _=Depends(verify_token)):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    db.delete(booking)
    db.commit()
    return {"message": "Booking deleted"}
