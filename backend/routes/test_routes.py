from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models import Test
from schemas.schemas import TestCreate, TestUpdate, TestOut
from auth import verify_token

router = APIRouter(prefix="/tests", tags=["tests"])


@router.get("/", response_model=List[TestOut])
def get_tests(db: Session = Depends(get_db)):
    return db.query(Test).all()


@router.get("/{test_id}", response_model=TestOut)
def get_test(test_id: int, db: Session = Depends(get_db)):
    test = db.query(Test).filter(Test.id == test_id).first()
    if not test:
        raise HTTPException(status_code=404, detail="Test not found")
    return test


@router.post("/", response_model=TestOut)
def create_test(test: TestCreate, db: Session = Depends(get_db), _=Depends(verify_token)):
    db_test = Test(**test.dict())
    db.add(db_test)
    db.commit()
    db.refresh(db_test)
    return db_test


@router.put("/{test_id}", response_model=TestOut)
def update_test(test_id: int, test: TestUpdate, db: Session = Depends(get_db), _=Depends(verify_token)):
    db_test = db.query(Test).filter(Test.id == test_id).first()
    if not db_test:
        raise HTTPException(status_code=404, detail="Test not found")
    for key, value in test.dict().items():
        setattr(db_test, key, value)
    db.commit()
    db.refresh(db_test)
    return db_test


@router.delete("/{test_id}")
def delete_test(test_id: int, db: Session = Depends(get_db), _=Depends(verify_token)):
    db_test = db.query(Test).filter(Test.id == test_id).first()
    if not db_test:
        raise HTTPException(status_code=404, detail="Test not found")
    db.delete(db_test)
    db.commit()
    return {"message": "Test deleted successfully"}
