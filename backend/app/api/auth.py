from fastapi import APIRouter, Depends, HTTPException, Body, status, Header
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from pydantic import BaseModel, EmailStr
from starlette.status import HTTP_201_CREATED, HTTP_401_UNAUTHORIZED
from app.db.api_key_manager import ApiKeyManager
from app.models.user import UserCreate, UserLogin, UserResponse
from app.db.mongodb import MongoDB
from jose import jwt, JWTError
from datetime import datetime, timedelta
import secrets
import os

router = APIRouter()
security = HTTPBasic()

ADMIN_USERNAME = os.getenv("ADMIN_USERNAME", "admin")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "password")
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "supersecretkey")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24

class KeyRequest(BaseModel):
    user_email: EmailStr
    user_name: str
    tier: str = "free"

class KeyResponse(BaseModel):
    key: str
    message: str

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def get_current_user(authorization: str = Header(...)):
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authorization header.")
    token = authorization.split(" ", 1)[1]
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        if not email:
            raise HTTPException(status_code=401, detail="Invalid token.")
        return email
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token.")

@router.post("/user/register", status_code=201)
def user_register(user: UserCreate):
    db = MongoDB()
    if db.get_user_by_email(user.email):
        raise HTTPException(status_code=400, detail="Email already registered.")
    db.create_user(user)
    return {"message": "User registered successfully."}

@router.post("/user/login")
def user_login(user: UserLogin):
    db = MongoDB()
    user_in_db = db.get_user_by_email(user.email)
    if not user_in_db or not db.verify_password(user.password, user_in_db["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password.")
    access_token = create_access_token({"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/user/me", response_model=UserResponse)
def read_users_me(current_user_email: str = Depends(get_current_user)):
    """
    Get current logged-in user's details.
    """
    db = MongoDB()
    user_in_db = db.get_user_by_email(current_user_email)
    if not user_in_db:
        raise HTTPException(status_code=404, detail="User not found")
    # Return user details excluding the password
    return UserResponse(
        email=user_in_db["email"],
        name=user_in_db["name"],
        created_at=user_in_db["created_at"]
    )

# Minimal endpoint for user self-service API key generation (free tier)
@router.post("/register", response_model=KeyResponse, status_code=HTTP_201_CREATED, include_in_schema=True)
def register_key(request: KeyRequest):
    """
    Register and get a free API key (one per email, free tier)
    """
    api_key_manager = ApiKeyManager()
    # Check if user already has a key
    existing_keys = api_key_manager.get_user_keys(request.user_email)
    if existing_keys:
        return {
            "key": existing_keys[0].key,
            "message": f"API key already exists for {request.user_email}."
        }
    key = api_key_manager.create_api_key(
        user_email=request.user_email,
        user_name=request.user_name,
        tier="free"
    )
    return {
        "key": key,
        "message": f"API key created successfully for {request.user_name}. Tier: free"
    }

# Hide admin endpoints from docs
@router.post("/keys", response_model=KeyResponse, status_code=HTTP_201_CREATED, include_in_schema=False)
def create_key(request: KeyRequest, credentials: HTTPBasicCredentials = Depends(security)):
    api_key_manager = ApiKeyManager()
    key = api_key_manager.create_api_key(
        user_email=request.user_email,
        user_name=request.user_name,
        tier=request.tier
    )
    return {
        "key": key,
        "message": f"API key created successfully for {request.user_name}. Tier: {request.tier}"
    }

@router.get("/keys/{email}", include_in_schema=False)
def get_user_keys(email: str, credentials: HTTPBasicCredentials = Depends(security)):
    api_key_manager = ApiKeyManager()
    keys = api_key_manager.get_user_keys(email)
    return {
        "email": email,
        "keys": [
            {
                "key": key.key,
                "tier": key.tier,
                "is_active": key.is_active,
                "created_at": key.created_at,
                "last_used": key.last_used,
                "total_requests": key.total_requests
            }
            for key in keys
        ]
    }

@router.delete("/keys/{key}", include_in_schema=False)
def revoke_key(key: str, credentials: HTTPBasicCredentials = Depends(security)):
    api_key_manager = ApiKeyManager()
    if not api_key_manager.validate_api_key(key):
        raise HTTPException(status_code=404, detail="API key not found")
    api_key_manager.deactivate_api_key(key)
    return {"message": "API key revoked successfully"}

@router.get("/user/api-keys")
def get_user_api_keys(current_user: str = Depends(get_current_user)):
    api_key_manager = ApiKeyManager()
    keys = api_key_manager.get_user_keys(current_user)
    return {
        "email": current_user,
        "keys": [
            {
                "key": key.key,
                "tier": key.tier,
                "is_active": key.is_active,
                "created_at": key.created_at,
                "last_used": key.last_used,
                "total_requests": key.total_requests
            }
            for key in keys
        ]
    }

@router.post("/user/api-keys/regenerate")
def regenerate_api_key(current_user: str = Depends(get_current_user)):
    api_key_manager = ApiKeyManager()
    # Deactivate all old keys for this user
    for key in api_key_manager.get_user_keys(current_user):
        api_key_manager.deactivate_api_key(key.key)
    # Create a new key
    new_key = api_key_manager.create_api_key(user_email=current_user, user_name=current_user, tier="free")
    return {"key": new_key, "message": "API key regenerated successfully."}

@router.post("/user/api-keys/revoke")
def revoke_api_key(key: str, current_user: str = Depends(get_current_user)):
    api_key_manager = ApiKeyManager()
    # Only allow revoking keys belonging to the current user
    user_keys = [k.key for k in api_key_manager.get_user_keys(current_user)]
    if key not in user_keys:
        raise HTTPException(status_code=403, detail="You can only revoke your own API keys.")
    api_key_manager.deactivate_api_key(key)
    return {"message": "API key revoked successfully."}
