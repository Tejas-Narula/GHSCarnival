"""
Verify all configuration and connectivity before starting servers
Run with: python -m backend.scripts.verify_setup
"""
import os
import sys
from pathlib import Path
import asyncio

# Add backend to path
backend_root = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(backend_root))

from dotenv import load_dotenv

load_dotenv()


def check_env_variable(name: str, required: bool = True) -> bool:
    """Check if environment variable is set"""
    value = os.getenv(name)
    if value:
        # Mask sensitive values
        if 'SECRET' in name.upper() or 'PASSWORD' in name.upper():
            display_value = value[:8] + "..." if len(value) > 8 else "***"
        else:
            display_value = value[:50] + "..." if len(value) > 50 else value
        print(f"  ✅ {name} = {display_value}")
        return True
    else:
        status = "❌" if required else "⚠️"
        print(f"  {status} {name} is not set")
        return not required


def check_environment():
    """Check all required environment variables"""
    print("\n🔧 Environment Variables Check:")
    
    all_ok = True
    
    # Required variables
    all_ok &= check_env_variable("DATABASE_URL", required=True)
    all_ok &= check_env_variable("DIRECT_URL", required=True)
    all_ok &= check_env_variable("JWT_SECRET_KEY", required=True)
    all_ok &= check_env_variable("CORS_ORIGINS", required=True)
    
    # Optional variables
    check_env_variable("LOG_LEVEL", required=False)
    
    return all_ok


async def check_database():
    """Check database connectivity"""
    print("\n🗄️  Database Connection Check:")
    
    try:
        from app.db.prisma import prisma
        
        await prisma.connect()
        print("  ✅ Successfully connected to database")
        
        # Test queries
        sports_count = await prisma.sport.count()
        users_count = await prisma.user.count()
        matches_count = await prisma.match.count()
        
        print(f"  ✅ Found {sports_count} sports")
        print(f"  ✅ Found {users_count} users")
        print(f"  ✅ Found {matches_count} matches")
        
        await prisma.disconnect()
        print("  ✅ Database connection closed successfully")
        
        return True
    except Exception as e:
        print(f"  ❌ Database connection failed: {e}")
        return False


def check_prisma_client():
    """Check if Prisma client is generated"""
    print("\n⚙️  Prisma Client Check:")
    
    prisma_client_path = backend_root / "app" / "db" / "prisma_client"
    
    if prisma_client_path.exists():
        print(f"  ✅ Prisma client found at {prisma_client_path}")
        
        # Check for key files
        key_files = ["__init__.py", "client.py", "models.py"]
        for file in key_files:
            if (prisma_client_path / file).exists():
                print(f"  ✅ {file} exists")
            else:
                print(f"  ⚠️  {file} not found")
        
        return True
    else:
        print(f"  ❌ Prisma client not found at {prisma_client_path}")
        print("  💡 Run: prisma generate")
        return False


def check_frontend_config():
    """Check frontend configuration"""
    print("\n🎨 Frontend Configuration Check:")
    
    frontend_root = backend_root.parent / "frontend"
    
    # Check if frontend exists
    if not frontend_root.exists():
        print(f"  ❌ Frontend directory not found at {frontend_root}")
        return False
    
    print(f"  ✅ Frontend directory found")
    
    # Check for key files
    key_files = ["package.json", "vite.config.ts", "tsconfig.json"]
    for file in key_files:
        if (frontend_root / file).exists():
            print(f"  ✅ {file} exists")
        else:
            print(f"  ❌ {file} not found")
    
    # Check .env file
    env_file = frontend_root / ".env"
    if env_file.exists():
        print(f"  ✅ .env file exists")
    else:
        print(f"  ⚠️  .env file not found (will use defaults)")
    
    return True


async def main():
    """Run all verification checks"""
    print("\n" + "="*60)
    print("GHS Carnival Setup Verification")
    print("="*60)
    
    checks = {
        "Environment Variables": check_environment(),
        "Prisma Client": check_prisma_client(),
        "Frontend Config": check_frontend_config(),
    }
    
    # Database check (async)
    checks["Database Connection"] = await check_database()
    
    print("\n" + "="*60)
    print("Summary:")
    print("-"*60)
    
    for check_name, result in checks.items():
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{check_name:.<40} {status}")
    
    print("="*60)
    
    if all(checks.values()):
        print("\n🎉 All checks passed! You're ready to start the servers.")
        print("\nTo start:")
        print("  Backend:  cd backend && uvicorn app.main:app --reload")
        print("  Frontend: cd frontend && npm run dev")
    else:
        print("\n⚠️  Some checks failed. Please fix the issues above.")
        sys.exit(1)
    
    print()


if __name__ == "__main__":
    asyncio.run(main())
