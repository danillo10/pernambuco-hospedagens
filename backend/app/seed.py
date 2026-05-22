import json

from sqlalchemy.orm import Session

from app.models import Listing, PropertyType, User


def seed_database(db: Session):
    if db.query(Listing).count() > 0:
        return

    host = User(
        email="anfitriao@pernambucohospedagens.com.br",
        name="Anfitrião Pernambuco",
        is_host=True,
        google_id="seed-host",
    )
    db.add(host)
    db.commit()
    db.refresh(host)

    samples = [
        {
            "title": "Pousada Beira-Mar — Porto de Galinhas",
            "description": "Pousada charmosa a poucos metros da praia, com café da manhã regional e piscina.",
            "property_type": PropertyType.POUSADA,
            "city": "Ipojuca",
            "neighborhood": "Porto de Galinhas",
            "price_per_night": 320,
            "max_guests": 4,
            "bedrooms": 2,
            "bathrooms": 1,
            "featured": True,
            "image_url": "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800",
        },
        {
            "title": "Hotel Colonial — Recife Antigo",
            "description": "Hotel no coração do Recife Antigo, perto do Marco Zero e da cultura frevo.",
            "property_type": PropertyType.HOTEL,
            "city": "Recife",
            "neighborhood": "Recife Antigo",
            "price_per_night": 450,
            "max_guests": 2,
            "bedrooms": 1,
            "bathrooms": 1,
            "featured": True,
            "image_url": "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
        },
        {
            "title": "Apartamento Vista Rio — Olinda",
            "description": "Apartamento com vista para o Alto da Sé e o mar. Ideal para carnaval e festas.",
            "property_type": PropertyType.APARTAMENTO,
            "city": "Olinda",
            "neighborhood": "Alto da Sé",
            "price_per_night": 280,
            "max_guests": 3,
            "bedrooms": 1,
            "bathrooms": 1,
            "featured": True,
            "image_url": "https://images.unsplash.com/photo-1502672260266-1c1ef9370201?w=800",
        },
        {
            "title": "Quarto Aconchego — Caruaru",
            "description": "Quarto confortável perto do Parque 18 de Maio e feira de artesanato.",
            "property_type": PropertyType.QUARTO,
            "city": "Caruaru",
            "neighborhood": "Centro",
            "price_per_night": 120,
            "max_guests": 2,
            "bedrooms": 1,
            "bathrooms": 1,
            "featured": False,
            "image_url": "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800",
        },
        {
            "title": "Casa de Praia — Tamandaré",
            "description": "Casa ampla com varanda, churrasqueira e acesso à Praia dos Carneiros.",
            "property_type": PropertyType.CASA,
            "city": "Tamandaré",
            "neighborhood": "Praia dos Carneiros",
            "price_per_night": 550,
            "max_guests": 8,
            "bedrooms": 3,
            "bathrooms": 2,
            "featured": True,
            "image_url": "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
        },
        {
            "title": "Pousada Frevo — Garanhuns",
            "description": "Pousada na Serra dos Ventos com clima fresco e gastronomia local.",
            "property_type": PropertyType.POUSADA,
            "city": "Garanhuns",
            "neighborhood": "Centro",
            "price_per_night": 190,
            "max_guests": 4,
            "bedrooms": 2,
            "bathrooms": 1,
            "featured": False,
            "image_url": "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800",
        },
    ]

    for s in samples:
        listing = Listing(
            host_id=host.id,
            amenities=json.dumps(["Wi-Fi", "Ar-condicionado", "Café da manhã"]),
            **s,
        )
        db.add(listing)
    db.commit()
