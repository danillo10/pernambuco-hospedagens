from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr, Field

from app.models import PropertyType


class UserBase(BaseModel):
    email: EmailStr
    name: str
    avatar_url: Optional[str] = None


class UserResponse(UserBase):
    id: int
    is_host: bool
    created_at: datetime

    class Config:
        from_attributes = True


class GoogleAuthRequest(BaseModel):
    credential: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


class ListingCreate(BaseModel):
    title: str = Field(min_length=3, max_length=255)
    description: str = Field(min_length=10)
    property_type: PropertyType
    city: str
    neighborhood: Optional[str] = None
    address: Optional[str] = None
    price_per_night: float = Field(gt=0)
    max_guests: int = Field(ge=1, le=50)
    bedrooms: int = Field(ge=0, le=20)
    bathrooms: int = Field(ge=0, le=20)
    amenities: list[str] = []
    image_url: str = ""


class ListingUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    price_per_night: Optional[float] = None
    max_guests: Optional[int] = None
    amenities: Optional[list[str]] = None
    image_url: Optional[str] = None
    active: Optional[bool] = None


class ListingResponse(BaseModel):
    id: int
    host_id: int
    host_name: str
    title: str
    description: str
    property_type: PropertyType
    city: str
    neighborhood: Optional[str]
    address: Optional[str]
    price_per_night: float
    max_guests: int
    bedrooms: int
    bathrooms: int
    amenities: list[str]
    image_url: str
    featured: bool
    active: bool
    created_at: datetime

    class Config:
        from_attributes = True


class BookingCreate(BaseModel):
    listing_id: int
    check_in: datetime
    check_out: datetime
    guests: int = Field(ge=1, le=50)


class BookingResponse(BaseModel):
    id: int
    listing_id: int
    listing_title: str
    check_in: datetime
    check_out: datetime
    guests: int
    total_price: float
    status: str

    class Config:
        from_attributes = True
