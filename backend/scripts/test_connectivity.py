"""
Test database and API connectivity
Run with: python -m backend.scripts.test_connectivity
"""
import asyncio
import sys
from pathlib import Path

# Add backend to path
backend_root = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(backend_root))

from app.db.prisma import prisma


async def test_database_connection():
    """Test database connectivity"""
    print("🔌 Testing Database Connection...")
    
    is_standalone = not prisma.is_connected()
    
    if is_standalone:
        try:
            await prisma.connect()
            print("  ✅ Successfully connected to database")
        except Exception as e:
            print(f"  ❌ Failed to connect to database: {e}")
            return False
    
    try:
        # Test query - count sports
        sports_count = await prisma.sport.count()
        print(f"  ✅ Database query successful - Found {sports_count} sports")
        
        # Test query - count users
        users_count = await prisma.user.count()
        print(f"  ✅ Found {users_count} users in database")
        
        # Test query - count matches
        matches_count = await prisma.match.count()
        print(f"  ✅ Found {matches_count} matches in database")
        
        return True
    except Exception as e:
        print(f"  ❌ Database query failed: {e}")
        return False
    finally:
        if is_standalone:
            await prisma.disconnect()
            print("  ✅ Database connection closed")


async def main():
    """Run all connectivity tests"""
    print("\n" + "="*50)
    print("GHS Carnival Connectivity Tests")
    print("="*50 + "\n")
    
    # Test database
    db_ok = await test_database_connection()
    
    print("\n" + "="*50)
    if db_ok:
        print("✅ All connectivity tests passed!")
    else:
        print("❌ Some tests failed - check configuration")
    print("="*50 + "\n")


if __name__ == "__main__":
    asyncio.run(main())
