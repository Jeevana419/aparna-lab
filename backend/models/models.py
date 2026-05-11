from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Text
from sqlalchemy.sql import func
from database import Base


class Owner(Base):
    __tablename__ = "owners"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)


class Test(Base):
    __tablename__ = "tests"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(Text)
    price = Column(Float, nullable=False)


class Medicine(Base):
    __tablename__ = "medicines"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(Text)
    price = Column(Float, nullable=False)
    stock = Column(Integer, default=0)


class Booking(Base):
    __tablename__ = "bookings"
    id = Column(Integer, primary_key=True, index=True)
    user_name = Column(String, nullable=False)
    contact = Column(String, nullable=False)
    test_id = Column(Integer, ForeignKey("tests.id"))
    status = Column(String, default="pending")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    notes = Column(Text, nullable=True)


class MedicineRequest(Base):
    __tablename__ = "medicine_requests"
    id = Column(Integer, primary_key=True, index=True)
    user_name = Column(String, nullable=False)
    contact = Column(String, nullable=False)
    medicine_id = Column(Integer, ForeignKey("medicines.id"))
    quantity = Column(Integer, default=1)
    status = Column(String, default="pending")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    notes = Column(Text, nullable=True)


class Message(Base):
    __tablename__ = "messages"
    id = Column(Integer, primary_key=True, index=True)
    sender_name = Column(String, nullable=False)
    contact = Column(String, nullable=False)
    message = Column(Text, nullable=False)
    reply = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
