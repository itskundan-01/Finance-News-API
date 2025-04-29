import logging
import uvicorn
from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, HTMLResponse
from app.api import news, auth
from app.utils.scheduler import start_scheduler
from app.config.settings import API_PREFIX, CORS_ORIGINS
from app.db.mongodb import MongoDB
from app.scraper.news_feed_scraper import NewsFeedScraper

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup logic
    logger.info("Starting up application...")
    # Create database indexes
    db = MongoDB()
    db.create_indexes()
    logger.info("Database indexes created")
    
    # Start background scheduler
    scheduler = start_scheduler()
    app.state.scheduler = scheduler
    
    # Initial scrape to populate the database
    scraper = NewsFeedScraper()
    scraper.scrape_and_store()
    
    yield  # This is where the app runs
    
    # Shutdown logic
    logger.info("Shutting down application...")
    # Shut down the scheduler if it's running
    if hasattr(app.state, "scheduler"):
        app.state.scheduler.shutdown()
        logger.info("Scheduler shut down")

# Create FastAPI app
app = FastAPI(
    title="Finance News API",
    description="A minimal API to fetch the latest finance news articles.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url=None,
    lifespan=lifespan
)

# Add CORS middleware
origins = CORS_ORIGINS

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Use the list above
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routers
app.include_router(news.router, prefix=API_PREFIX)
app.include_router(auth.router, prefix=f"{API_PREFIX}/auth")

@app.get("/", include_in_schema=False)
async def root():
    return JSONResponse({"status": "Finance News API is running.", "docs": "/docs"})

@app.get("/manifest.json")
async def manifest():
    # You can customize this manifest as needed for your frontend
    return JSONResponse({
        "name": "Finance News",
        "short_name": "FinanceNews",
        "start_url": "/",
        "display": "standalone",
        "background_color": "#ffffff",
        "description": "Finance news app",
        "icons": []
    })

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
