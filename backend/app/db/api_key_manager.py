from pymongo import MongoClient, ASCENDING
from datetime import datetime
from app.config.settings import MONGODB_URI, DB_NAME
from app.models.api_key import ApiKey, generate_api_key

class ApiKeyManager:
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(ApiKeyManager, cls).__new__(cls)
            cls._instance.client = MongoClient(MONGODB_URI)
            cls._instance.db = cls._instance.client[DB_NAME]
            cls._instance.collection = cls._instance.db["api_keys"]
            cls._instance.create_indexes()
        return cls._instance
    
    def create_indexes(self):
        """Create indexes for API keys collection."""
        self.collection.create_index([("key", ASCENDING)], unique=True)
        self.collection.create_index([("user_email", ASCENDING)])
    
    def create_api_key(self, user_email: str, user_name: str, tier: str = "free") -> str:
        """Create a new API key for a user."""
        api_key = ApiKey(
            user_email=user_email,
            user_name=user_name,
            tier=tier
        )
        
        self.collection.insert_one(api_key.dict())
        return api_key.key
    
    def get_api_key(self, key: str) -> ApiKey:
        """Get API key details by key."""
        result = self.collection.find_one({"key": key})
        if result:
            return ApiKey(**result)
        return None
    
    def validate_api_key(self, key: str) -> bool:
        """Validate if API key exists and is active."""
        result = self.collection.find_one({"key": key, "is_active": True})
        return bool(result)
    
    def update_key_usage(self, key: str):
        """Update the usage statistics for an API key."""
        today = datetime.now().strftime("%Y-%m-%d")
        
        self.collection.update_one(
            {"key": key},
            {
                "$inc": {
                    "total_requests": 1,
                    f"daily_requests.{today}": 1
                },
                "$set": {
                    "last_used": datetime.now()
                }
            }
        )
    
    def deactivate_api_key(self, key: str):
        """Deactivate an API key."""
        self.collection.update_one(
            {"key": key},
            {"$set": {"is_active": False}}
        )
    
    def get_user_keys(self, user_email: str):
        """Get all API keys for a specific user."""
        keys = self.collection.find({"user_email": user_email})
        return [ApiKey(**key) for key in keys]
