from app.scraper.news_feed_scraper import NewsFeedScraper

print("Starting scraper...")
scraper = NewsFeedScraper()
scraper.scrape_and_store()
print("Done!")
