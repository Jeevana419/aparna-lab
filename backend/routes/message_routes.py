from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models import Message
from schemas.schemas import MessageCreate, MessageReply, MessageOut
from auth import verify_token

router = APIRouter(prefix="/messages", tags=["messages"])


@router.post("/", response_model=MessageOut)
def send_message(msg: MessageCreate, db: Session = Depends(get_db)):
    db_msg = Message(**msg.dict())
    db.add(db_msg)
    db.commit()
    db.refresh(db_msg)
    return db_msg


@router.get("/", response_model=List[MessageOut])
def get_messages(db: Session = Depends(get_db), _=Depends(verify_token)):
    return db.query(Message).order_by(Message.created_at.desc()).all()


@router.put("/{message_id}/reply", response_model=MessageOut)
def reply_to_message(message_id: int, reply: MessageReply, db: Session = Depends(get_db), _=Depends(verify_token)):
    msg = db.query(Message).filter(Message.id == message_id).first()
    if not msg:
        raise HTTPException(status_code=404, detail="Message not found")
    msg.reply = reply.reply
    db.commit()
    db.refresh(msg)
    return msg


@router.delete("/{message_id}")
def delete_message(message_id: int, db: Session = Depends(get_db), _=Depends(verify_token)):
    msg = db.query(Message).filter(Message.id == message_id).first()
    if not msg:
        raise HTTPException(status_code=404, detail="Message not found")
    db.delete(msg)
    db.commit()
    return {"message": "Message deleted"}
