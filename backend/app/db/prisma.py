from __future__ import annotations

import asyncio
import logging

from .prisma_client import Prisma

logger = logging.getLogger(__name__)

prisma = Prisma()


async def connect_prisma(max_retries: int = 3) -> None:
    """Connect to database with retry logic"""
    if prisma.is_connected():
        logger.info("Prisma already connected")
        return
    
    for attempt in range(1, max_retries + 1):
        try:
            logger.info(f"Attempting to connect to database (attempt {attempt}/{max_retries})...")
            await prisma.connect()
            logger.info("✅ Successfully connected to database")
            return
        except Exception as e:
            logger.error(f"❌ Database connection failed (attempt {attempt}/{max_retries}): {e}")
            if attempt < max_retries:
                wait_time = attempt * 2  # Exponential backoff
                logger.info(f"Retrying in {wait_time} seconds...")
                await asyncio.sleep(wait_time)
            else:
                logger.error("Failed to connect to database after all retries")
                raise


async def disconnect_prisma() -> None:
    """Disconnect from database"""
    if prisma.is_connected():
        try:
            await prisma.disconnect()
            logger.info("Database connection closed")
        except Exception as e:
            logger.error(f"Error disconnecting from database: {e}")
