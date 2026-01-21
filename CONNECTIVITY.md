# Connectivity & Configuration Guide

## Overview
This guide covers all connectivity aspects between Frontend, Backend, and Database.

## Architecture

```
Frontend (React + Vite) → Backend (FastAPI) → Database (PostgreSQL/Supabase)
     Port 5173              Port 8000           Cloud/Network
```

## 1. Database Connection

### Configuration Files
- **Backend:** `backend/.env`
  - `DATABASE_URL`: Pooled connection (PgBouncer) for runtime
  - `DIRECT_URL`: Direct connection for Prisma migrations

### Verify Database Connection
```bash
cd backend
python -m scripts.test_connectivity
```

### Troubleshooting
- **Error:** "Database not connected"
  - Check `DATABASE_URL` and `DIRECT_URL` in `.env`
  - Verify Supabase project is active
  - Check network/firewall settings

- **Error:** "Connection timeout"
  - Verify database credentials
  - Check if IP is whitelisted in Supabase (if applicable)
  - Test direct connection: `psql <DATABASE_URL>`

### Prisma Client
```bash
# Regenerate Prisma client after schema changes
prisma generate

# Run migrations
prisma migrate dev --name <migration_name>

# View database
prisma studio
```

## 2. Backend API

### Configuration
- **Port:** 8000 (default)
- **CORS:** Configured in `backend/.env`
  - `CORS_ORIGINS=http://localhost:5173`

### Environment Variables
```bash
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...
JWT_SECRET_KEY=your-secret-key
CORS_ORIGINS=http://localhost:5173
```

### Start Backend
```bash
cd backend
.\.venv\Scripts\Activate.ps1  # Windows PowerShell
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

### Health Check
```bash
curl http://localhost:8000/health
# Should return: {"status":"ok","database":"connected"}
```

### Verify Setup
```bash
cd backend
python -m scripts.verify_setup
```

## 3. Frontend Connection

### Configuration
- **Port:** 5173 (Vite default)
- **Proxy:** `/api` → `http://127.0.0.1:8000`
- **Config File:** `frontend/vite.config.ts`

### Environment Variables
```bash
VITE_SITE_MODE=live  # or 'coming-soon'
```

### Start Frontend
```bash
cd frontend
npm run dev
```

### API Base URL
Frontend uses `/api` prefix which Vite proxies to backend:
- Frontend request: `fetch('/api/public/sports')`
- Proxied to: `http://127.0.0.1:8000/public/sports`

## 4. API Endpoints

### Public Endpoints (No Auth)
- `GET /health` - Health check
- `GET /public/sports` - List sports
- `GET /public/matches` - List matches
- `GET /public/announcements` - List announcements
- `GET /public/live-stream` - SSE stream for live updates

### Auth Endpoints
- `POST /auth/login` - Admin login
- `GET /auth/me` - Get current user

### Admin Endpoints (Auth Required)
- `POST /admin/matches` - Create match
- `GET /admin/matches` - List matches (filtered by sport)
- `PATCH /admin/matches/{id}` - Update match
- `DELETE /admin/matches/{id}` - Delete match

## 5. Authentication Flow

### Login Process
1. User submits credentials to `/api/auth/login`
2. Backend validates credentials
3. Backend generates JWT token
4. Frontend stores token in `localStorage`
   - Key: `admin_token`
   - Key: `admin_user` (user object)

### Protected Requests
All admin endpoints require:
```
Authorization: Bearer <token>
```

Frontend automatically adds this header via `api.admin.*` methods.

## 6. Common Issues

### Frontend Can't Connect to Backend
**Symptoms:** Network errors, CORS errors, 404 on API calls

**Solutions:**
1. Verify backend is running: `curl http://localhost:8000/health`
2. Check Vite proxy config in `vite.config.ts`
3. Verify CORS_ORIGINS in backend `.env`
4. Check browser console for errors
5. Restart both servers

### Backend Can't Connect to Database
**Symptoms:** "Database not connected", Prisma errors

**Solutions:**
1. Verify `.env` has correct DATABASE_URL and DIRECT_URL
2. Run `python -m scripts.test_connectivity`
3. Check Supabase dashboard for project status
4. Regenerate Prisma client: `prisma generate`

### Authentication Failures
**Symptoms:** 401 Unauthorized, token invalid

**Solutions:**
1. Check JWT_SECRET_KEY is set in backend `.env`
2. Verify token in localStorage is not expired
3. Check Authorization header is being sent
4. Re-login to get fresh token

### CORS Errors
**Symptoms:** "CORS policy blocked", OPTIONS request fails

**Solutions:**
1. Add frontend URL to CORS_ORIGINS: `http://localhost:5173`
2. Restart backend after .env changes
3. Check browser is making requests to correct URL
4. Verify `allow_credentials: true` in CORS config

## 7. Port Configuration

### Default Ports
- Frontend: `5173`
- Backend: `8000`
- Database: `5432` (direct) / `6543` (pooled)

### Change Ports

**Backend:**
```bash
uvicorn app.main:app --reload --port 8001
```

**Frontend:**
Update `vite.config.ts`:
```typescript
server: {
  port: 3000,
  proxy: {
    '/api': {
      target: 'http://127.0.0.1:8001',  // Update if backend port changed
      ...
    }
  }
}
```

## 8. Production Deployment

### Environment Variables
- Use strong JWT_SECRET_KEY (generate with `openssl rand -hex 32`)
- Update CORS_ORIGINS to production domain
- Use production database credentials
- Set `VITE_SITE_MODE=live` in frontend

### HTTPS
- Backend should run behind reverse proxy (nginx, Caddy)
- Frontend served as static files
- Update API_BASE in frontend if backend on different domain

### Database
- Use connection pooling (PgBouncer)
- Set appropriate connection limits
- Monitor query performance

## 9. Debugging Tools

### Backend Logs
```bash
# Run with debug logging
LOG_LEVEL=debug uvicorn app.main:app --reload
```

### Frontend Network Tab
- Open browser DevTools → Network
- Filter by "Fetch/XHR"
- Check request/response headers and payloads

### Database Queries
```bash
# Interactive Prisma Studio
prisma studio

# Direct database query
psql $DATABASE_URL
```

### Health Checks
```bash
# Backend health
curl http://localhost:8000/health

# Database connectivity
python -m backend.scripts.test_connectivity

# Full verification
python -m backend.scripts.verify_setup
```

## 10. Quick Start Checklist

- [ ] PostgreSQL/Supabase database created
- [ ] Backend `.env` configured (DATABASE_URL, DIRECT_URL, JWT_SECRET_KEY, CORS_ORIGINS)
- [ ] Frontend `.env` configured (VITE_SITE_MODE)
- [ ] Prisma client generated: `prisma generate`
- [ ] Database migrated: `prisma migrate dev`
- [ ] Database seeded: `python -m scripts.seed_all`
- [ ] Backend running: `uvicorn app.main:app --reload`
- [ ] Frontend running: `npm run dev`
- [ ] Health check passes: `curl http://localhost:8000/health`
- [ ] Can access frontend: `http://localhost:5173`
- [ ] Admin login works: `http://localhost:5173/admin/login`

## Support

For issues:
1. Run verification: `python -m backend.scripts.verify_setup`
2. Check logs in terminal
3. Verify `.env` files are correct
4. Restart both servers
5. Clear browser cache and localStorage
