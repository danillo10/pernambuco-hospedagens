from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.auth import get_current_user
from app.database import get_db
from app.models import Booking, Listing, User
from app.schemas import BookingCreate, BookingResponse

router = APIRouter(prefix="/bookings", tags=["bookings"])


@router.post("", response_model=BookingResponse)
def create_booking(
    data: BookingCreate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    listing = db.query(Listing).filter(Listing.id == data.listing_id, Listing.active == True).first()
    if not listing:
        raise HTTPException(404, "Hospedagem não disponível")
    if data.check_out <= data.check_in:
        raise HTTPException(400, "Data de saída deve ser após a entrada")
    nights = (data.check_out - data.check_in).days
    if nights < 1:
        raise HTTPException(400, "Reserva mínima de 1 noite")
    total = listing.price_per_night * nights
    booking = Booking(
        listing_id=listing.id,
        guest_id=user.id,
        check_in=data.check_in,
        check_out=data.check_out,
        guests=data.guests,
        total_price=total,
        status="confirmed",
    )
    db.add(booking)
    db.commit()
    db.refresh(booking)
    return BookingResponse(
        id=booking.id,
        listing_id=listing.id,
        listing_title=listing.title,
        check_in=booking.check_in,
        check_out=booking.check_out,
        guests=booking.guests,
        total_price=booking.total_price,
        status=booking.status,
    )


@router.get("/mine", response_model=list[BookingResponse])
def my_bookings(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    bookings = db.query(Booking).filter(Booking.guest_id == user.id).order_by(Booking.created_at.desc()).all()
    result = []
    for b in bookings:
        listing = db.query(Listing).filter(Listing.id == b.listing_id).first()
        result.append(
            BookingResponse(
                id=b.id,
                listing_id=b.listing_id,
                listing_title=listing.title if listing else "",
                check_in=b.check_in,
                check_out=b.check_out,
                guests=b.guests,
                total_price=b.total_price,
                status=b.status,
            )
        )
    return result
