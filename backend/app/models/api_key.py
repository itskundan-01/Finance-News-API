from datetime import datetime
from typing import Dict, List, Optional
from pydantic import BaseModel, Field
import secrets
import string

def generate_api_key(length=32) -> str:
    """Generate a secure random API key."""
    alphabet = string.ascii_letters + string.digits
    return ''.join(secrets.choice(alphabet) for _ in range(length))

class RateLimitTier(BaseModel):
    name: str
    requests_per_day: int
    requests_per_minute: int
    max_results_per_request: int

class ApiKey(BaseModel):
    key: str = Field(default_factory=lambda: generate_api_key())
    user_email: str
    user_name: str
    created_at: datetime = Field(default_factory=datetime.now)
    last_used: Optional[datetime] = None
    is_active: bool = True
    tier: str = "free"  # free, basic, premium, etc.
    
    # Usage tracking
    total_requests: int = 0
    daily_requests: Dict[str, int] = {}  # Format: {"YYYY-MM-DD": count}
    
    def update_usage(self):
        """Update API key usage statistics."""
        today = datetime.now().strftime("%Y-%m-%d")
        self.last_used = datetime.now()
        self.total_requests += 1
        
        if today in self.daily_requests:
            self.daily_requests[today] += 1
        else:
            self.daily_requests[today] = 1
    
    def reset_daily_usage(self):
        """Reset daily usage count."""
        today = datetime.now().strftime("%Y-%m-%d")
        self.daily_requests[today] = 0
