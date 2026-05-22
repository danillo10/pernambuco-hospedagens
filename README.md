# Pernambuco Hospedagens

Plataforma estilo Airbnb para hotéis, pousadas, apartamentos e quartos em Pernambuco — com identidade visual da bandeira do estado, história, cultura e cadastro fácil de anúncios.

## Stack

- **Frontend:** Angular 19 (Vercel)
- **Backend:** FastAPI + Python (Railway)
- **Auth:** Google Sign-In (OAuth 2.0)

## Desenvolvimento local

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
# Configure GOOGLE_CLIENT_ID e SECRET_KEY
uvicorn main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install
# Edite src/environments/environment.ts com apiUrl e googleClientId
npm start
```

## Variáveis de ambiente

| Variável | Onde | Descrição |
|----------|------|-----------|
| `GOOGLE_CLIENT_ID` | Backend + Frontend | Client ID OAuth Google |
| `SECRET_KEY` | Backend | Chave JWT |
| `DATABASE_URL` | Railway | PostgreSQL (opcional) |
| `FRONTEND_URL` | Backend | URL do site Vercel |
| `CORS_ORIGINS` | Backend | Origens permitidas |

## Deploy

- **GitHub:** repositório `pernambuco-hospedagens`
- **Vercel:** pasta `frontend`
- **Railway:** pasta `backend`

## SEO e Google Ads

O `index.html` inclui meta tags (`description`, `keywords`, Open Graph) e placeholder `google-adsense-account` para vincular sua conta AdSense.
