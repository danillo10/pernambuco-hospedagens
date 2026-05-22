# Pernambuco Maravilha

Plataforma estilo Airbnb para hotéis, pousadas, apartamentos e quartos em Pernambuco, com identidade visual da bandeira do estado, história, cultura e cadastro fácil de anúncios.

## Stack

- **Frontend:** Angular 19 (Vercel)
- **Backend:** FastAPI + Python (Railway)
- **Auth:** Google Sign-In (OAuth 2.0)

## Ambientes (dev vs prod)

| Onde roda | Frontend API | Arquivo Angular |
|-----------|--------------|-----------------|
| **Local** (`npm start` / `ng serve`) | `http://localhost:8000/api` | `environment.ts` |
| **Produção** (`ng build`) | Railway (URL em `environment.prod.ts`) | `environment.prod.ts` |

O `angular.json` já troca os arquivos automaticamente: `ng serve` = dev local; `ng build` = prod.

## Desenvolvimento local (tudo de uma vez)

```bash
# Na raiz do projeto (primeira vez)
npm install
npm run install:all

# Sobe Postgres (Docker) + API (8000) + site (4200)
npm run dev
```

Ou separado:

```bash
# Terminal 1 — banco (Postgres)
docker compose up -d postgres

# Terminal 2 — API
cd backend && source venv/bin/activate && uvicorn main:app --reload --port 8000

# Terminal 3 — site
cd frontend && npm start
```

Abra **http://localhost:4200** - a API fica em **http://localhost:8000/docs**.

### Google Login (opcional no local)

1. Crie um Client ID OAuth no [Google Cloud Console](https://console.cloud.google.com/).
2. Origens autorizadas: `http://localhost:4200`
3. Coloque o ID em `backend/.env` (`GOOGLE_CLIENT_ID`) e em `frontend/src/environments/environment.ts` (`googleClientId`).

## Variáveis de ambiente

| Variável | Onde | Descrição |
|----------|------|-----------|
| `GOOGLE_CLIENT_ID` | Backend + Frontend | Client ID OAuth Google |
| `SECRET_KEY` | Backend | Chave JWT |
| `DATABASE_URL` | Local + Railway | PostgreSQL |
| `FRONTEND_URL` | Backend | URL do site Vercel |
| `CORS_ORIGINS` | Backend | Origens permitidas |

## Deploy

- **GitHub:** repositório `pernambuco-hospedagens` (renomeável para `pernambuco-maravilha`)
- **Vercel:** pasta `frontend`
- **Railway:** pasta `backend`

## SEO e Google Ads

O `index.html` inclui meta tags (`description`, `keywords`, Open Graph) e placeholder `google-adsense-account` para vincular sua conta AdSense.
