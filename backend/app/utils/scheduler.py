from apscheduler.schedulers.background import BackgroundScheduler
from app.scraper.news_feed_scraper import NewsFeedScraper
from app.config.settings import SCRAPE_INTERVAL
import logging

logger = logging.getLogger(__name__)

def start_scheduler():
    """
    Start the background scheduler for periodic scraping
    """
    scraper = NewsFeedScraper()
    scheduler = BackgroundScheduler()
    
    # Add job to run every SCRAPE_INTERVAL seconds
    scheduler.add_job(scraper.scrape_and_store, 'interval', seconds=SCRAPE_INTERVAL, 
                     id='scrape_job', replace_existing=True)
    
    # Start the scheduler
    scheduler.start()
    logger.info(f"Scheduler started. Scraping every {SCRAPE_INTERVAL} seconds")
    
    return scheduler
