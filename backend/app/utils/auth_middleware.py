from fastapi import Request, HTTPException, Depends
from fastapi.security import APIKeyHeader
from starlette.status import HTTP_403_FORBIDDEN, HTTP_429_TOO_MANY_REQUESTS
from app.db.api_key_manager import ApiKeyManager
from datetime import datetime, timedelta
from typing import Dict, Optional
import time
import asyncio

# Define API key header
API_KEY_HEADER = APIKeyHeader(name="X-API-Key", auto_error=False)

# Rate limiting cache (in-memory)
# Format: {"api_key": {"count": 0, "reset_at": timestamp}}
request_counts: Dict[str, Dict[str, any]] = {}

# Rate limit configurations for different tiers
RATE_LIMITS = {
    "free": {
        "requests_per_day": 100,
        "requests_per_minute": 10,
        "max_results_per_request": 20
    },
    "basic": {
        "requests_per_day": 1000,
        "requests_per_minute": 30,
        "max_results_per_request": 50
    },
    "premium": {
        "requests_per_day": 10000,
        "requests_per_minute": 60,
        "max_results_per_request": 100
    }
}

def get_api_key_or_error(api_key: str = Depends(API_KEY_HEADER)):
    """Validate API key and return it or raise an error."""
    if not api_key:
        raise HTTPException(
            status_code=HTTP_403_FORBIDDEN,
            detail="API key is missing. Add X-API-Key header to your request.",
        )
    
    api_key_manager = ApiKeyManager()
    if not api_key_manager.validate_api_key(api_key):
        raise HTTPException(
            status_code=HTTP_403_FORBIDDEN,
            detail="Invalid or inactive API key",
        )
    
    return api_key

def check_rate_limit(api_key: str):
    """Check if request is within rate limits."""
    api_key_manager = ApiKeyManager()
    key_data = api_key_manager.get_api_key(api_key)
    
    if not key_data:
        raise HTTPException(
            status_code=HTTP_403_FORBIDDEN,
            detail="Invalid API key",
        )
    
    # Get rate limits for this tier
    tier = key_data.tier
    rate_limit = RATE_LIMITS.get(tier, RATE_LIMITS["free"])
    
    # Check daily limit
    today = datetime.now().strftime("%Y-%m-%d")
    daily_requests = key_data.daily_requests.get(today, 0)
    
    if daily_requests >= rate_limit["requests_per_day"]:
        raise HTTPException(
            status_code=HTTP_429_TOO_MANY_REQUESTS,
            detail=f"Daily rate limit exceeded. Maximum {rate_limit['requests_per_day']} requests per day.",
            headers={"Retry-After": "86400"}  # Retry after 24 hours
        )
    
    # Check per-minute limit
    current_minute = int(time.time() / 60)
    minute_key = f"{api_key}:{current_minute}"
    
    if minute_key in request_counts:
        if request_counts[minute_key]["count"] >= rate_limit["requests_per_minute"]:
            raise HTTPException(
                status_code=HTTP_429_TOO_MANY_REQUESTS,
                detail=f"Rate limit exceeded. Maximum {rate_limit['requests_per_minute']} requests per minute.",
                headers={"Retry-After": "60"}
            )
        request_counts[minute_key]["count"] += 1
    else:
        # Clean up old entries
        for key in list(request_counts.keys()):
            if ":" in key and int(key.split(":")[1]) < current_minute:
                del request_counts[key]
        
        request_counts[minute_key] = {"count": 1}
    
    # Update API key usage
    api_key_manager.update_key_usage(api_key)
    
    # Return max results allowed for this tier
    return rate_limit["max_results_per_request"]

async def rate_limit_middleware(request: Request, api_key: str = Depends(get_api_key_or_error)):
    """Middleware for API key validation and rate limiting."""
    max_results = check_rate_limit(api_key)
    request.state.max_results = max_results
    request.state.api_key = api_key
    return api_key
