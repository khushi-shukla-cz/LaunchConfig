# Deployment Guide

## Option 1 — Docker Compose (Self-hosted, recommended)

Runs everything (PostgreSQL + backend + frontend) in containers.

```bash
# 1. Clone and configure
git clone https://github.com/YOUR_USERNAME/configruntime-platform
cd configruntime-platform
cp .env.example .env
# Edit .env — set JWT_SECRET at minimum

# 2. Build and start
docker compose up --build -d

# 3. Check status
docker compose ps
docker compose logs backend --tail=50
```

**Services:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:4000
- Database: localhost:5432

---

## Option 2 — Render.com (Free tier, zero config)

Render can deploy everything from `render.yaml` in one click.

```bash
# 1. Push to GitHub
git push origin main

# 2. Go to https://render.com/deploy
# 3. Connect your repo — Render detects render.yaml automatically
# 4. Set environment variables:
#    - JWT_SECRET (generate a random 32+ char string)
#    - Any SMTP_* vars for email
# 5. Deploy
```

Backend URL: `https://configruntime-backend.onrender.com`
Frontend URL: `https://configruntime-frontend.onrender.com`

Set `NEXT_PUBLIC_API_URL` = backend URL in frontend service env vars.

---

## Option 3 — Railway (Backend) + Vercel (Frontend)

### Backend on Railway

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway link   # or: railway init
railway up

# Set environment variables in Railway dashboard:
# DATABASE_URL (Railway can provision PostgreSQL automatically)
# JWT_SECRET
# FRONTEND_URL=https://your-vercel-app.vercel.app
# NODE_ENV=production
```

### Frontend on Vercel

```bash
# Install Vercel CLI
npm install -g vercel

cd frontend
vercel deploy --prod

# Set environment variable in Vercel dashboard:
# NEXT_PUBLIC_API_URL=https://your-railway-backend.up.railway.app
```

---

## Option 4 — Fly.io (Backend)

```bash
# Install flyctl
curl -L https://fly.io/install.sh | sh

cd configruntime  # repo root
fly auth login
fly launch --config fly.toml

# Create PostgreSQL database
fly postgres create --name configruntime-db
fly postgres attach configruntime-db

# Set secrets
fly secrets set JWT_SECRET="your-random-secret"
fly secrets set FRONTEND_URL="https://your-frontend.vercel.app"
fly secrets set NODE_ENV="production"

# Deploy
fly deploy
```

---

## Option 5 — Manual VPS (Ubuntu/Debian)

```bash
# 1. Install dependencies
apt update && apt install -y nodejs npm postgresql nginx

# 2. Setup PostgreSQL
sudo -u postgres createdb configruntime
sudo -u postgres createuser configruntime_user

# 3. Clone and setup
git clone https://github.com/YOUR_USERNAME/configruntime-platform
cd configruntime-platform
cp .env.example .env
# Edit .env with real DATABASE_URL, JWT_SECRET

# 4. Install and build
npm install
npm run db:generate
npm run db:migrate
npm run build

# 5. Start with PM2
npm install -g pm2
cd backend && pm2 start dist/index.js --name configruntime-backend
cd ../frontend && pm2 start npm --name configruntime-frontend -- start

# 6. Nginx config
cp nginx.conf /etc/nginx/conf.d/configruntime.conf
nginx -t && systemctl reload nginx
```

---

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `JWT_SECRET` | ✅ | Random 32+ char secret for JWT signing |
| `PORT` | Backend | HTTP port (default: 4000) |
| `FRONTEND_URL` | Backend | Frontend origin for CORS |
| `NEXT_PUBLIC_API_URL` | Frontend | Backend API base URL |
| `CONFIG_PATH` | Backend | Path to app.config.json |
| `SMTP_HOST` | Optional | SMTP server (Ethereal used if empty) |
| `SMTP_PORT` | Optional | SMTP port (default: 587) |
| `SMTP_USER` | Optional | SMTP username |
| `SMTP_PASS` | Optional | SMTP password |
| `SMTP_FROM` | Optional | From email address |
| `LOG_LEVEL` | Optional | debug/info/warn/error (default: info) |
| `NODE_ENV` | Optional | development/production |

---

## Post-Deploy Checklist

1. ✅ Visit `https://your-frontend/` — loads login page
2. ✅ Register first user at `/auth/login`
3. ✅ Update user role to `admin` in database (one-time setup):
   ```sql
   UPDATE users SET role = 'admin' WHERE email = 'your@email.com';
   ```
4. ✅ Visit `/admin/config` to verify config loaded correctly
5. ✅ Test CSV import via any resource list page
6. ✅ Visit `/admin/export` to download project ZIP
7. ✅ Check `/admin/logs` for any config warnings

---

## Health Check

```bash
curl https://your-backend.com/health
# Expected: {"status":"ok","db":"ok","config":{"version":1,"resources":3,"features":3},"uptime":...}
```
