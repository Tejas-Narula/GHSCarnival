# LiveScoresPage Backend Integration Guide

## Overview
The LiveScoresPage is now connected to the FastAPI backend with real-time match data from PostgreSQL via Prisma.

## Architecture
- **Frontend**: React + TypeScript, fetches data via REST API
- **Backend**: FastAPI with Prisma ORM
- **Database**: PostgreSQL (Supabase)
- **API Proxy**: Vite dev server proxies `/api/*` to `http://127.0.0.1:8000`

## Setup Instructions

### 1. Backend Setup

```powershell
# Navigate to backend directory
cd backend

# Activate virtual environment
.\.venv\Scripts\Activate.ps1

# Install dependencies (if not already installed)
pip install -r requirements.txt

# Configure environment
# Copy .env.example to .env and fill in your Supabase credentials
cp .env.example .env

# Run migrations
prisma migrate dev

# Generate Prisma client
prisma generate

# Seed sports data
python -m scripts.seed_sports

# (Optional) Seed sample matches for testing
python -m scripts.seed_matches

# Start the backend server
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

### 2. Frontend Setup

```powershell
# Navigate to frontend directory
cd frontend

# Install dependencies (if not already installed)
npm install

# (Optional) Create .env file for custom API URL
# The default /api proxy works out of the box
cp .env.example .env

# Start the frontend dev server
npm run dev
```

### 3. Verify Integration

1. **Backend running**: http://127.0.0.1:8000/docs (FastAPI Swagger UI)
2. **Frontend running**: http://localhost:5173
3. **Test API**: http://localhost:5173/api/public/sports (should return sports list)

## API Endpoints Used

### Public Endpoints (No Auth Required)

- `GET /public/sports` - List all sports
- `GET /public/sports/{slug}` - Get single sport
- `GET /public/matches?sport_slug={slug}&status={status}` - List matches with filters
- `GET /public/matches/{match_id}` - Get single match
- `GET /public/announcements?limit={limit}` - List announcements

### Live Streaming (Server-Sent Events)

- `GET /public/live-stream?sport_slug={slug}&interval={seconds}` - Stream all live/upcoming matches
- `GET /public/live-stream/match/{match_id}?interval={seconds}` - Stream single match updates

## Data Model

### Match Score Structure
The `score` field in the Match model uses flexible JSON to support different sports:

```typescript
// Box Cricket
{
  teamA: { score: "127/9", detail: "60 balls" },
  teamB: { score: "24/2", "detail": "18 balls" }
}

// Football/Futsal
{
  teamA: { score: "2", detail: "HT" },
  teamB: { score: "1", detail: "HT" }
}

// Basketball
{
  teamA: { score: "48", detail: "Q3 02:12" },
  teamB: { score: "39", detail: "Q3 02:12" }
}
```

## Frontend Components

### API Client (`src/api/client.ts`)
- Type-safe API wrapper
- Handles request/response formatting
- Supports SSE for live updates

### LiveScoresPage (`src/pages/LiveScoresPage.tsx`)
- Fetches sports list on mount
- Loads matches when sport is selected
- Displays live match with real-time scores
- Shows upcoming matches with time/venue

## Development Workflow

### Adding New Sports
1. Add sport to database via seed script or admin panel
2. Frontend automatically picks up new sports
3. Map sport icon in `SPORT_ICONS` constant in LiveScoresPage.tsx

### Creating Matches
Use the admin API (requires auth - not yet implemented):

```bash
POST /admin/matches
{
  "sportSlug": "box-cricket",
  "teamA": "Block A1",
  "teamB": "Block A2",
  "status": "UPCOMING",
  "venue": "Main Ground",
  "startTime": "2026-01-15T10:00:00Z"
}
```

### Updating Match Scores
```bash
PATCH /admin/matches/{match_id}
{
  "status": "LIVE",
  "score": {
    "teamA": { "score": "45", "detail": "30 balls" },
    "teamB": { "score": "0", "detail": "0 balls" }
  }
}
```

## Troubleshooting

### "Failed to load sports"
- Ensure backend is running on port 8000
- Check browser console for CORS errors
- Verify DATABASE_URL in backend/.env

### "No sports available yet"
- Run the seed script: `python -m scripts.seed_sports`
- Check database has sports: `prisma studio`

### Vite proxy not working
- Verify vite.config.ts has proxy configuration
- Restart Vite dev server after config changes
- Check backend is on http://127.0.0.1:8000 (not localhost)

## Next Steps

1. **Authentication**: Implement JWT auth for admin endpoints
2. **Real-time Updates**: Add SSE connection for auto-refreshing live scores
3. **Match Details**: Create dedicated page for individual match view
4. **Notifications**: Push notifications for match start/score updates
5. **Admin Panel**: Build UI for creating/updating matches
