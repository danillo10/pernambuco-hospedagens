from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "Pernambuco Hospedagens API"
    secret_key: str = "change-me-in-production-pernambuco-2026"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60 * 24 * 7
    database_url: str = "sqlite:///./pernambuco.db"
    google_client_id: str = ""  # env: GOOGLE_CLIENT_ID
    frontend_url: str = "http://localhost:4200"
    cors_origins: str = "http://localhost:4200,https://*.vercel.app"

    class Config:
        env_file = ".env"


settings = Settings()
