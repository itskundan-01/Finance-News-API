import datetime
from pymongo import MongoClient
from app.config.settings import MONGODB_URI, DB_NAME, COLLECTION_NAME
from passlib.context import CryptContext
from app.models.user import UserCreate, UserInDB

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class MongoDB:
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(MongoDB, cls).__new__(cls)
            cls._instance.client = MongoClient(MONGODB_URI)
            cls._instance.db = cls._instance.client[DB_NAME]
            cls._instance.collection = cls._instance.db[COLLECTION_NAME]
        return cls._instance
    
    def insert_news(self, news_data):
        """
        Insert news data into MongoDB
        """
        if isinstance(news_data, list):
            # Check for duplicates by title and avoid inserting them
            for article in news_data:
                existing = self.collection.find_one({"title": article["title"]})
                if not existing:
                    self.collection.insert_one(article)
        elif isinstance(news_data, dict):
            existing = self.collection.find_one({"title": news_data["title"]})
            if not existing:
                self.collection.insert_one(news_data)
    
    def get_all_news(self, limit=100, skip=0, sort_by="timestamp_iso", sort_order=-1):
        """
        Get all news articles with pagination
        """
        cursor = self.collection.find({}).sort(sort_by, sort_order).skip(skip).limit(limit)
        return list(cursor)
    
    def get_news_by_id(self, news_id):
        """
        Get a news article by ID
        """
        return self.collection.find_one({"_id": news_id})
    
    def get_news_by_category(self, category, limit=100, skip=0):
        """
        Get news articles by category
        """
        cursor = self.collection.find({"categories": category}).sort("timestamp_iso", -1).skip(skip).limit(limit)
        return list(cursor)
    
    def search_news(self, query, limit=100, skip=0):
        """
        Search news articles by query
        """
        # Text-based search using the text index
        cursor = self.collection.find(
            {"$text": {"$search": query}}
        ).sort("timestamp_iso", -1).skip(skip).limit(limit)
        return list(cursor)

    def create_indexes(self):
        """
        Create indexes for faster querying
        """
        # Create text index for search
        self.collection.create_index([("title", "text"), ("content", "text")])
        # Create index for timestamp for faster sorting
        self.collection.create_index("timestamp_iso")
        # Create index for category for faster filtering
        self.collection.create_index("categories")
        # Create index for source for filtering by source
        self.collection.create_index("source")

    def get_user_collection(self):
        return self.db["users"]

    def create_user(self, user: UserCreate):
        user_collection = self.get_user_collection()
        hashed_password = pwd_context.hash(user.password)
        user_in_db = {
            "email": user.email,
            "name": user.name,
            "hashed_password": hashed_password,
            "created_at": datetime.datetime.utcnow()
        }
        user_collection.insert_one(user_in_db)
        return user_in_db

    def get_user_by_email(self, email: str):
        user_collection = self.get_user_collection()
        user = user_collection.find_one({"email": email})
        return user

    def verify_password(self, plain_password, hashed_password):
        return pwd_context.verify(plain_password, hashed_password)
