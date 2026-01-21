import os

from fastapi import APIRouter

from app.db.prisma import prisma

router = APIRouter(tags=["health"])


@router.get("/health")
async def health() -> dict:
    """Health check endpoint with database connectivity test"""
    try:
        # Test database connectivity
        is_connected = prisma.is_connected()
        
        if not is_connected:
            return {
                "status": "degraded",
                "message": "Database not connected",
                "database": "disconnected"
            }
        
        # Try a simple query to verify database is responsive
        await prisma.sport.count()
        
        return {"status": "ok", "database": "connected"}
    except Exception as e:
        log_level = (os.getenv("LOG_LEVEL") or "").lower()
        is_debug = log_level == "debug"
        return {
            "status": "error",
            "message": str(e) if is_debug else "unavailable",
            "database": "error"
        }
