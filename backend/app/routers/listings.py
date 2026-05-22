import json

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.auth import get_current_user, get_optional_user
from app.database import get_db
from app.models import Listing, PropertyType, User
from app.schemas import ListingCreate, ListingResponse, ListingUpdate

router = APIRouter(prefix="/listings", tags=["listings"])


def _to_response(listing: Listing) -> ListingResponse:
    amenities = json.loads(listing.amenities) if listing.amenities else []
    return ListingResponse(
        id=listing.id,
        host_id=listing.host_id,
        host_name=listing.host.name if listing.host else "Anfitrião",
        title=listing.title,
        description=listing.description,
        property_type=listing.property_type,
        city=listing.city,
        neighborhood=listing.neighborhood,
        address=listing.address,
        price_per_night=listing.price_per_night,
        max_guests=listing.max_guests,
        bedrooms=listing.bedrooms,
        bathrooms=listing.bathrooms,
        amenities=amenities,
        image_url=listing.image_url,
        featured=listing.featured,
        active=listing.active,
        created_at=listing.created_at,
    )


@router.get("", response_model=list[ListingResponse])
def list_listings(
    city: str | None = None,
    property_type: PropertyType | None = None,
    min_price: float | None = None,
    max_price: float | None = None,
    guests: int | None = Query(None, ge=1),
    q: str | None = None,
    db: Session = Depends(get_db),
):
    query = db.query(Listing).filter(Listing.active == True)
    if city:
        query = query.filter(Listing.city.ilike(f"%{city}%"))
    if property_type:
        query = query.filter(Listing.property_type == property_type)
    if min_price is not None:
        query = query.filter(Listing.price_per_night >= min_price)
    if max_price is not None:
        query = query.filter(Listing.price_per_night <= max_price)
    if guests:
        query = query.filter(Listing.max_guests >= guests)
    if q:
        query = query.filter(
            (Listing.title.ilike(f"%{q}%")) | (Listing.description.ilike(f"%{q}%"))
        )
    listings = query.order_by(Listing.featured.desc(), Listing.created_at.desc()).all()
    return [_to_response(l) for l in listings]


@router.get("/featured", response_model=list[ListingResponse])
def featured(db: Session = Depends(get_db)):
    listings = (
        db.query(Listing)
        .filter(Listing.active == True, Listing.featured == True)
        .limit(8)
        .all()
    )
    return [_to_response(l) for l in listings]


@router.get("/{listing_id}", response_model=ListingResponse)
def get_listing(listing_id: int, db: Session = Depends(get_db)):
    listing = db.query(Listing).filter(Listing.id == listing_id).first()
    if not listing:
        raise HTTPException(404, "Hospedagem não encontrada")
    return _to_response(listing)


@router.post("", response_model=ListingResponse)
def create_listing(
    data: ListingCreate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if not user.is_host:
        user.is_host = True
    listing = Listing(
        host_id=user.id,
        title=data.title,
        description=data.description,
        property_type=data.property_type,
        city=data.city,
        neighborhood=data.neighborhood,
        address=data.address,
        price_per_night=data.price_per_night,
        max_guests=data.max_guests,
        bedrooms=data.bedrooms,
        bathrooms=data.bathrooms,
        amenities=json.dumps(data.amenities),
        image_url=data.image_url or _default_image(data.property_type),
    )
    db.add(listing)
    db.commit()
    db.refresh(listing)
    return _to_response(listing)


@router.patch("/{listing_id}", response_model=ListingResponse)
def update_listing(
    listing_id: int,
    data: ListingUpdate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    listing = db.query(Listing).filter(Listing.id == listing_id, Listing.host_id == user.id).first()
    if not listing:
        raise HTTPException(404, "Hospedagem não encontrada ou sem permissão")
    for field, value in data.model_dump(exclude_unset=True).items():
        if field == "amenities" and value is not None:
            setattr(listing, field, json.dumps(value))
        else:
            setattr(listing, field, value)
    db.commit()
    db.refresh(listing)
    return _to_response(listing)


@router.delete("/{listing_id}")
def delete_listing(
    listing_id: int,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    listing = db.query(Listing).filter(Listing.id == listing_id, Listing.host_id == user.id).first()
    if not listing:
        raise HTTPException(404, "Hospedagem não encontrada")
    listing.active = False
    db.commit()
    return {"ok": True}


@router.get("/mine/all", response_model=list[ListingResponse])
def my_listings(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    listings = db.query(Listing).filter(Listing.host_id == user.id).all()
    return [_to_response(l) for l in listings]


def _default_image(pt: PropertyType) -> str:
    images = {
        PropertyType.HOTEL: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
        PropertyType.POUSADA: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800",
        PropertyType.APARTAMENTO: "https://images.unsplash.com/photo-1502672260266-1c1ef9370201?w=800",
        PropertyType.QUARTO: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800",
        PropertyType.CASA: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
    }
    return images.get(pt, images[PropertyType.POUSADA])
