# Admin Authentication Documentation

## ✅ Authentication Implemented

The GHS Carnival backend now has full JWT-based authentication for admin users.

## Features

### 🔐 Password Hashing
- Uses bcrypt for secure password hashing
- Passwords are salted automatically
- Never stores plain text passwords

### 🎫 JWT Tokens
- 7-day expiration by default
- Secure token generation and validation
- Stateless authentication

### 👥 User Roles
- **SUPER_ADMIN**: Can manage all sports
- **SPORT_ADMIN**: Can only manage their assigned sport

## API Endpoints

### POST /auth/login
Login endpoint for admin users.

**Request:**
```json
{
  "email": "superadmin@ghscarnival.com",
  "password": "admin123"
}
```

**Response:**
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "token_type": "bearer",
  "user": {
    "id": "super_admin_1",
    "email": "superadmin@ghscarnival.com",
    "username": "superadmin",
    "role": "SUPER_ADMIN",
    "sportId": null
  }
}
```

### GET /auth/me
Get current authenticated user information.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "user": {
    "id": "super_admin_1",
    "email": "superadmin@ghscarnival.com",
    "username": "superadmin",
    "role": "SUPER_ADMIN",
    "sportId": null
  }
}
```

### POST /auth/verify-token
Verify if a token is valid.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "valid": true,
  "user": {
    "id": "super_admin_1",
    "email": "superadmin@ghscarnival.com",
    "role": "SUPER_ADMIN"
  }
}
```

## Admin Credentials

### Super Admin
- **Email:** `superadmin@ghscarnival.com`
- **Username:** `superadmin`
- **Password:** `admin123`
- **Access:** All sports

### Sport Admins
All sport admins use password: `admin123`

| Sport | Email | Username |
|-------|-------|----------|
| Box Cricket | cricket.admin@ghscarnival.com | cricket_admin |
| Futsal | futsal.admin@ghscarnival.com | futsal_admin |
| Basketball | basketball.admin@ghscarnival.com | basketball_admin |
| Volleyball | volleyball.admin@ghscarnival.com | volleyball_admin |
| Table Tennis | tabletennis.admin@ghscarnival.com | tabletennis_admin |
| Power Lifting | powerlifting.admin@ghscarnival.com | powerlifting_admin |
| Pool | pool.admin@ghscarnival.com | pool_admin |
| Badminton | badminton.admin@ghscarnival.com | badminton_admin |
| Squash | squash.admin@ghscarnival.com | squash_admin |
| Tug of War | tugofwar.admin@ghscarnival.com | tugofwar_admin |
| Chess | chess.admin@ghscarnival.com | chess_admin |

⚠️ **IMPORTANT:** Change all passwords in production!

## Protected Endpoints

All admin endpoints now require authentication:

### Requires Any Admin Role
- `POST /admin/matches` - Create match
- `PATCH /admin/matches/{id}` - Update match
- `DELETE /admin/matches/{id}` - Delete match
- `POST /admin/announcements` - Create announcement
- `PATCH /admin/announcements/{id}` - Update announcement
- `DELETE /admin/announcements/{id}` - Delete announcement

### Requires Super Admin Role
- (Reserved for future super admin-only operations)

## Permission Logic

### Sport Admin Restrictions
Sport admins can only manage matches for their assigned sport:

```python
# Sport admin trying to create a match
if current_admin.role != "SUPER_ADMIN":
    if current_admin.sportId != sport.id:
        raise HTTPException(403, "You do not have permission")
```

### Super Admin Access
Super admins have unrestricted access to all sports.

## Testing with Postman/cURL

### 1. Login
```bash
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "superadmin@ghscarnival.com", "password": "admin123"}'
```

### 2. Use Token
```bash
curl -X GET http://localhost:8000/auth/me \
  -H "Authorization: Bearer <YOUR_TOKEN_HERE>"
```

### 3. Create Match (Protected)
```bash
curl -X POST http://localhost:8000/admin/matches \
  -H "Authorization: Bearer <YOUR_TOKEN_HERE>" \
  -H "Content-Type: application/json" \
  -d '{
    "sportSlug": "box-cricket",
    "teamA": "Block A1",
    "teamB": "Block A2",
    "status": "UPCOMING",
    "venue": "Main Ground"
  }'
```

## Environment Configuration

Add to your `backend/.env`:

```env
# JWT Secret Key for authentication
# Generate with: openssl rand -hex 32
JWT_SECRET_KEY=your-secret-key-here
```

**Generate a secure key:**
```powershell
# PowerShell
[System.Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes((1..32 | ForEach-Object { [char](Get-Random -Minimum 33 -Maximum 126) }) -join ''))

# Or use online tool
# https://randomkeygen.com/
```

## Security Best Practices

1. **Change Default Passwords:** Never use `admin123` in production
2. **Secure JWT Secret:** Use a strong random key (32+ characters)
3. **HTTPS Only:** Always use HTTPS in production
4. **Token Storage:** Store tokens securely in frontend (httpOnly cookies recommended)
5. **Rotate Secrets:** Periodically change JWT secret keys
6. **Password Policy:** Enforce strong passwords in production

## Implementation Details

### Files Modified
- [backend/prisma/schema.prisma](../backend/prisma/schema.prisma) - Added `passwordHash` field
- [backend/app/api/utils/security.py](../backend/app/api/utils/security.py) - Auth utilities
- [backend/app/api/routers/auth.py](../backend/app/api/routers/auth.py) - Auth endpoints
- [backend/scripts/seed_admin_users.py](../backend/scripts/seed_admin_users.py) - Seeds with passwords
- [backend/requirements.txt](../backend/requirements.txt) - Added bcrypt

### Dependencies Added
- `bcrypt` - Password hashing
- `pyjwt` - JWT token generation/validation

## Next Steps

1. **Frontend Integration:**
   - Create login page
   - Store JWT token
   - Add auth interceptor to API client
   - Implement protected routes

2. **Password Management:**
   - Add change password endpoint
   - Add forgot password flow
   - Add password strength validation

3. **Admin Panel:**
   - Build admin dashboard UI
   - Sport-specific match management
   - Real-time score updates

## Troubleshooting

### "Invalid token" error
- Token may have expired (7-day default)
- JWT_SECRET_KEY may have changed
- Token format incorrect (should be "Bearer <token>")

### "Invalid email or password"
- Check credentials are correct
- Ensure database has been seeded with admin users
- Verify password hasn't been changed

### Permission denied (403)
- Sport admin trying to access another sport
- Use super admin account for cross-sport operations
