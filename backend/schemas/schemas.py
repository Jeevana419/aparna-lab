from pydantic import BaseModel
from typing import Optional
from datetime import datetime


# Auth
class LoginRequest(BaseModel):
    username: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str


# Test Schemas
class TestBase(BaseModel):
    name: str
    description: Optional[str] = None
    price: float


class TestCreate(TestBase):
    pass


class TestUpdate(TestBase):
    pass


class TestOut(TestBase):
    id: int

    class Config:
        from_attributes = True


# Medicine Schemas
class MedicineBase(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    stock: int


class MedicineCreate(MedicineBase):
    pass


class MedicineUpdate(MedicineBase):
    pass


class MedicineOut(MedicineBase):
    id: int

    class Config:
        from_attributes = True


# Booking Schemas
class BookingCreate(BaseModel):
    user_name: str
    contact: str
    test_id: int
    notes: Optional[str] = None


class BookingOut(BaseModel):
    id: int
    user_name: str
    contact: str
    test_id: int
    status: str
    created_at: Optional[datetime]
    notes: Optional[str]

    class Config:
        from_attributes = True


class BookingStatusUpdate(BaseModel):
    status: str


# Medicine Request Schemas
class MedicineRequestCreate(BaseModel):
    user_name: str
    contact: str
    medicine_id: int
    quantity: int = 1
    notes: Optional[str] = None


class MedicineRequestOut(BaseModel):
    id: int
    user_name: str
    contact: str
    medicine_id: int
    quantity: int
    status: str
    created_at: Optional[datetime]
    notes: Optional[str]

    class Config:
        from_attributes = True


class MedicineRequestStatusUpdate(BaseModel):
    status: str


# Message Schemas
class MessageCreate(BaseModel):
    sender_name: str
    contact: str
    message: str


class MessageReply(BaseModel):
    reply: str


class MessageOut(BaseModel):
    id: int
    sender_name: str
    contact: str
    message: str
    reply: Optional[str]
    created_at: Optional[datetime]

    class Config:
        from_attributes = True
