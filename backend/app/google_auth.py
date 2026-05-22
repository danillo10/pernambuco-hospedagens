from google.auth.transport import requests
from google.oauth2 import id_token

from app.config import settings


def verify_google_token(credential: str) -> dict:
    if not settings.google_client_id:
        raise ValueError("GOOGLE_CLIENT_ID não configurado no servidor")
    idinfo = id_token.verify_oauth2_token(
        credential, requests.Request(), settings.google_client_id
    )
    if idinfo["iss"] not in ["accounts.google.com", "https://accounts.google.com"]:
        raise ValueError("Emissor do token inválido")
    return {
        "google_id": idinfo["sub"],
        "email": idinfo.get("email", ""),
        "name": idinfo.get("name", "Usuário"),
        "avatar_url": idinfo.get("picture"),
    }
