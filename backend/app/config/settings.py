import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# MongoDB Configuration
MONGODB_URI = os.getenv("MONGODB_URI")
DB_NAME = os.getenv("DB_NAME", "finance_news")
COLLECTION_NAME = os.getenv("COLLECTION_NAME", "news_articles")

# Scraping Configuration
SCRAPE_INTERVAL = int(os.getenv("SCRAPE_INTERVAL", 60))  # in seconds

# News Feed URL (generic, not mentioning Zerodha)
NEWS_FEED_URL = os.getenv("NEWS_FEED_URL")
NEWS_FEED_USER_AGENT = os.getenv("NEWS_FEED_USER_AGENT", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36")

# API Configuration
API_PREFIX = "/api/v1"

# API Authentication Configuration
ADMIN_USERNAME = os.getenv("ADMIN_USERNAME", "admin")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "change_this_password_immediately")

# CORS Configuration
CORS_ORIGINS = os.getenv("CORS_ORIGINS")
if not CORS_ORIGINS:
    raise ValueError("CORS_ORIGINS environment variable is required.")
CORS_ORIGINS = CORS_ORIGINS.split(",")

# Google Search URL
GOOGLE_SEARCH_URL = os.getenv("GOOGLE_SEARCH_URL")
if not GOOGLE_SEARCH_URL:
    raise ValueError("GOOGLE_SEARCH_URL environment variable is required.")
