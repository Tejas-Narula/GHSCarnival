from __future__ import annotations

import asyncio
import json
from datetime import datetime

from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import StreamingResponse

from app.db.prisma import prisma

router = APIRouter(prefix="/public", tags=["public"])


@router.get("/sports")
async def list_sports() -> dict:
    """List all available sports"""
    sports = await prisma.sport.find_many(order={"name": "asc"})
    return {"items": sports}


@router.get("/sports/{sport_slug}")
async def get_sport(sport_slug: str) -> dict:
    """Get a single sport by slug"""
    sport = await prisma.sport.find_unique(where={"slug": sport_slug})
    if sport is None:
        raise HTTPException(status_code=404, detail="Sport not found")
    return {"item": sport}


@router.get("/matches")
async def list_matches(
    sport_slug: str | None = Query(None, description="Filter by sport slug"),
    status: str | None = Query(None, description="Filter by status: UPCOMING, LIVE, COMPLETED"),
    limit: int = Query(50, le=100, description="Maximum number of matches to return")
) -> dict:
    """List matches with optional filters"""
    where_clause = {}
    
    # Filter by sport if provided
    if sport_slug:
        sport = await prisma.sport.find_unique(where={"slug": sport_slug})
        if sport:
            where_clause["sportId"] = sport.id
    
    # Filter by status if provided
    if status:
        where_clause["status"] = status
    
    matches = await prisma.match.find_many(
        where=where_clause,
        include={"sport": True},
        order={"updatedAt": "desc"},
        take=limit
    )
    return {"items": matches}


@router.get("/matches/{match_id}")
async def get_match(match_id: str) -> dict:
    """Get a single match by ID"""
    match = await prisma.match.find_unique(
        where={"id": match_id},
        include={"sport": True}
    )
    if match is None:
        raise HTTPException(status_code=404, detail="Match not found")
    return {"item": match}


@router.get("/announcements")
async def list_announcements(
    limit: int = Query(20, le=50, description="Maximum number of announcements to return")
) -> dict:
    """List recent announcements (pinned first)"""
    items = await prisma.announcement.find_many(
        order=[{"pinned": "desc"}, {"updatedAt": "desc"}],
        take=limit
    )
    return {"items": items}


@router.get("/live-stream")
async def live_stream(
    sport_slug: str | None = Query(None, description="Filter by sport slug"),
    interval: int = Query(5, ge=2, le=30, description="Update interval in seconds")
):
    """
    Server-Sent Events stream for live match updates.
    Pushes live and upcoming matches to frontend at regular intervals.
    """
    async def event_generator():
        last_update_time = None
        
        while True:
            try:
                # Build query for live and upcoming matches
                where_clause = {"status": {"in": ["LIVE", "UPCOMING"]}}
                
                if sport_slug:
                    sport = await prisma.sport.find_unique(where={"slug": sport_slug})
                    if sport:
                        where_clause["sportId"] = sport.id
                
                # Fetch matches
                matches = await prisma.match.find_many(
                    where=where_clause,
                    include={"sport": True},
                    order=[{"status": "asc"}, {"updatedAt": "desc"}]
                )
                
                # Fetch pinned announcements
                announcements = await prisma.announcement.find_many(
                    where={"pinned": True},
                    order={"updatedAt": "desc"},
                    take=3
                )
                
                # Convert Prisma models to dict for JSON serialization
                matches_data = [match.model_dump(mode='json') for match in matches]
                announcements_data = [ann.model_dump(mode='json') for ann in announcements]
                
                # Prepare data payload - separate live and upcoming matches
                live_matches = [m for m in matches_data if m["status"] == "LIVE"]
                upcoming_matches = [m for m in matches_data if m["status"] == "UPCOMING"]
                
                data = {
                    "live": live_matches[0] if live_matches else None,
                    "upcoming": upcoming_matches,
                    "announcements": announcements_data,
                    "timestamp": datetime.utcnow().isoformat()
                }
                
                # Send SSE event
                yield f"data: {json.dumps(data)}\n\n"
                
                # Wait for next interval
                await asyncio.sleep(interval)
                
            except Exception as e:
                # Send error event
                error_data = {
                    "error": str(e),
                    "timestamp": datetime.utcnow().isoformat()
                }
                yield f"event: error\ndata: {json.dumps(error_data)}\n\n"
                await asyncio.sleep(interval)
    
    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no"  # Disable buffering for nginx
        }
    )


@router.get("/live-stream/match/{match_id}")
async def live_stream_single_match(
    match_id: str,
    interval: int = Query(3, ge=1, le=15, description="Update interval in seconds")
):
    """
    Server-Sent Events stream for a single match.
    Useful for dedicated match detail pages.
    """
    async def event_generator():
        while True:
            try:
                # Fetch the specific match
                match = await prisma.match.find_unique(
                    where={"id": match_id},
                    include={"sport": True}
                )
                
                if match is None:
                    yield f"event: error\ndata: {json.dumps({'error': 'Match not found'})}\n\n"
                    break
                
                # If match is completed, send final update and close
                if match.status == "COMPLETED":
                    data = {
                        "match": match.model_dump(mode='json'),
                        "timestamp": datetime.utcnow().isoformat(),
                        "final": True
                    }
                    yield f"data: {json.dumps(data)}\n\n"
                    break
                
                # Send current match data
                data = {
                    "match": match.model_dump(mode='json'),
                    "timestamp": datetime.utcnow().isoformat(),
                    "final": False
                }
                yield f"data: {json.dumps(data)}\n\n"
                
                await asyncio.sleep(interval)
                
            except Exception as e:
                error_data = {
                    "error": str(e),
                    "timestamp": datetime.utcnow().isoformat()
                }
                yield f"event: error\ndata: {json.dumps(error_data)}\n\n"
                await asyncio.sleep(interval)
    
    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no"
        }
    )
