from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.auth import create_access_token, get_current_user
from app.database import get_db
from app.google_auth import verify_google_token
from app.models import User
from app.schemas import GoogleAuthRequest, TokenResponse, UserResponse

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/google", response_model=TokenResponse)
def google_login(body: GoogleAuthRequest, db: Session = Depends(get_db)):
    try:
        info = verify_google_token(body.credential)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Falha na autenticação Google: {e}")

    user = db.query(User).filter(User.google_id == info["google_id"]).first()
    if not user:
        user = db.query(User).filter(User.email == info["email"]).first()
    if not user:
        user = User(
            email=info["email"],
            name=info["name"],
            avatar_url=info.get("avatar_url"),
            google_id=info["google_id"],
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    else:
        user.name = info["name"]
        user.avatar_url = info.get("avatar_url")
        user.google_id = info["google_id"]
        db.commit()
        db.refresh(user)

    token = create_access_token({"sub": str(user.id)})
    return TokenResponse(
        access_token=token,
        user=UserResponse.model_validate(user),
    )


@router.get("/me", response_model=UserResponse)
def me(user: User = Depends(get_current_user)):
    return UserResponse.model_validate(user)


@router.post("/become-host", response_model=UserResponse)
def become_host(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    user.is_host = True
    db.commit()
    db.refresh(user)
    return UserResponse.model_validate(user)
