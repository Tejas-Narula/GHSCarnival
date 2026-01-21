# Backend Utility Scripts

## Overview
Utility scripts for verifying the GHS Carnival platform setup and connectivity.

## Available Scripts

### Setup Verification
```powershell
# From backend directory with venv activated
python -m scripts.verify_setup
```

Checks:
- Database connectivity
- Environment variables
- Prisma client generation
- Admin user existence
- Overall deployment readiness

### Connectivity Testing
```powershell
python -m scripts.test_connectivity
```

Tests:
- Database connection
- Query performance
- Connection pooling

## Usage Notes

These scripts are useful for:
- Initial deployment verification
- Troubleshooting connection issues
- Pre-production checks

Run with the virtual environment activated from the `backend/` directory.

## Troubleshooting

### "Module not found" error
Make sure you're running from the `backend/` directory with the virtual environment activated:
```powershell
cd backend
.\.venv\Scripts\Activate.ps1
python -m scripts.verify_setup
```

### "Database connection failed"
Check your `.env` file has correct `DATABASE_URL` and `DIRECT_URL` values.

## Prisma Studio

View and edit database data:
```powershell
prisma studio
```

Opens a web UI at http://localhost:5555 to browse the database.
