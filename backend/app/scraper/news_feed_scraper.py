import requests
from bs4 import BeautifulSoup
import datetime
import json
import logging
import re
from app.config.settings import NEWS_FEED_URL, GOOGLE_SEARCH_URL, NEWS_FEED_USER_AGENT
from app.db.mongodb import MongoDB

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class NewsFeedScraper:
    def __init__(self):
        self.base_url = NEWS_FEED_URL
        self.db = MongoDB()
    
    def fetch_page(self):
        try:
            headers = {
                "User-Agent": NEWS_FEED_USER_AGENT
            }
            logger.info(f"Fetching {self.base_url}")
            response = requests.get(self.base_url, headers=headers, timeout=15)
            response.raise_for_status()
            logger.info(f"Successfully fetched page, content length: {len(response.text)}")
            return response.text
        except requests.RequestException as e:
            logger.error(f"Error fetching page: {e}")
            return None
    
    def detect_source_from_url(self, url):
        if not url:
            return "Unknown"
            
        url_source_mapping = {
            'economictimes': 'Economic Times',
            'moneycontrol': 'Moneycontrol',
            'livemint': 'LiveMint',
            'bloomberg': 'Bloomberg Quint',
            'ndtv': 'NDTV',
            'thehindubusinessline': 'Hindu Business',
            'business-standard': 'Business Standard',
            'financialexpress': 'Financial Express',
            'cnbctv18': 'CNBC-TV18',
            'finshots': 'Finshots'
        }
        
        for domain, source in url_source_mapping.items():
            if domain in url:
                return source
                
        return "Financial News"
    
    def parse_timestamp(self, timestamp_text):
        if not timestamp_text:
            return "Unknown", datetime.datetime.now().isoformat()
            
        formats = [
            "%I:%M %p, %d %b %Y",
            "%I:%M %p, %d %b %Y",
            "%H:%M, %d %b %Y",
        ]
        
        relative_time_match = re.search(r'(\d+(?:\.\d+)?)\s+(hours|hour|minutes|minute|days|day)\s+ago', timestamp_text)
        if relative_time_match:
            amount, unit = relative_time_match.groups()
            amount = float(amount)
            now = datetime.datetime.now()
            
            if 'hour' in unit:
                delta = datetime.timedelta(hours=amount)
            elif 'minute' in unit:
                delta = datetime.timedelta(minutes=amount)
            elif 'day' in unit:
                delta = datetime.timedelta(days=amount)
            else:
                delta = datetime.timedelta(0)
                
            timestamp = now - delta
            return timestamp_text, timestamp.isoformat()
        
        for fmt in formats:
            try:
                dt = datetime.datetime.strptime(timestamp_text, fmt)
                return timestamp_text, dt.isoformat()
            except ValueError:
                continue
                
        return timestamp_text, datetime.datetime.now().isoformat()
    
    def parse_news(self, html_content):
        if not html_content:
            return []
        
        soup = BeautifulSoup(html_content, 'lxml')
        news_items = []
        
        try:
            headings = soup.find_all(['h1', 'h2', 'h3'])
            logger.info(f"Found {len(headings)} headings")
            unique_titles = set()
            for i, heading in enumerate(headings):
                title_text = heading.get_text(strip=True)
                if not title_text or len(title_text) < 10 or title_text in unique_titles:
                    continue
                unique_titles.add(title_text)
                news_item = {'title': title_text}
                parent = heading
                for _ in range(5):
                    if parent.parent and parent.parent.name != 'body':
                        parent = parent.parent
                        if len(parent.find_all(['p', 'a', 'span', 'div'])) > 3:
                            break
                content = ""
                content_elem = heading.find_next('p')
                if content_elem and len(content_elem.get_text(strip=True)) > 15:
                    content = content_elem.get_text(strip=True)
                else:
                    for elem in parent.find_all(['div', 'span']):
                        elem_text = elem.get_text(strip=True)
                        if elem_text and len(elem_text) > 20 and elem_text != title_text and 'trending' not in elem_text.lower():
                            content = elem_text
                            break
                if not content or len(content) < 20:
                    content = f"Latest financial news update related to {title_text}"
                news_item['content'] = content
                url = None
                links = parent.find_all('a', href=True)
                for link in links:
                    href = link['href']
                    if not href.startswith('#') and not href.startswith('/') and not href.startswith('https://pulse.zerodha.com'):
                        url = href
                        break
                if not url:
                    for link in links:
                        href = link['href']
                        if href.startswith('http') and 'zerodha.com' not in href:
                            url = href
                            break
                if not url:
                    url = f"{GOOGLE_SEARCH_URL}{'+'.join(title_text.split()[:7])}"
                news_item['url'] = url
                source_name = None
                text_nodes = list(parent.stripped_strings)
                for idx, text in enumerate(text_nodes):
                    if re.match(r'\d{1,2}:\d{2}\s*[AP]M,? \d{1,2} [A-Za-z]{3} \d{4}', text) or re.match(r'\d+(\.\d+)?\s*(hours?|minutes?|days?)\s+ago', text):
                        for lookahead in text_nodes[idx+1:idx+4]:
                            if '—' in lookahead:
                                parts = lookahead.split('—')
                                if len(parts) > 1:
                                    source_name = parts[-1].strip()
                                    break
                        if source_name:
                            break
                if not source_name:
                    for text in text_nodes:
                        if '—' in text:
                            parts = text.split('—')
                            if len(parts) > 1:
                                source_name = parts[-1].strip()
                                break
                if not source_name:
                    source_name = self.detect_source_from_url(url)
                news_item['source'] = source_name
                timestamp_text = None
                time_patterns = [
                    r'\d{1,2}:\d{2}\s*[AP]M,? \d{1,2} [A-Za-z]{3} \d{4}',
                    r'\d+\s*minutes?\s*ago',
                    r'\d+(\.\d+)?\s*hours?\s*ago'
                ]
                for pattern in time_patterns:
                    matches = [t for t in text_nodes if re.search(pattern, t)]
                    if matches:
                        timestamp_text = re.search(pattern, matches[0]).group(0)
                        break
                if not timestamp_text:
                    minutes_ago = 5 + (i * 3)
                    if minutes_ago > 59:
                        hours_ago = minutes_ago // 60
                        timestamp_text = f"{hours_ago} hour{'s' if hours_ago > 1 else ''} ago"
                    else:
                        timestamp_text = f"{minutes_ago} minutes ago"
                news_item['timestamp'], news_item['timestamp_iso'] = self.parse_timestamp(timestamp_text)
                all_text = f"{title_text} {content}".lower()
                categories = []
                category_keywords = {
                    'stocks': ['stocks', 'share', 'equity', 'nifty', 'sensex', 'bse', 'nse', 'shareholder', 'price'],
                    'market': ['market', 'trading', 'rally', 'bearish', 'bullish', 'index', 'indices', 'trade', 'rupee', 'dollar', 'currency', 'forex', 'exchange rate'],
                    'economy': ['economy', 'gdp', 'inflation', 'growth', 'fiscal', 'economic', 'rupee', 'dollar', 'currency'],
                    'banking': ['bank', 'loan', 'credit', 'deposit', 'fintech', 'pnb', 'sbi', 'rbl'],
                    'tech': ['tech', 'technology', 'it', 'software', 'digital', 'ai'],
                    'policy': ['policy', 'rbi', 'sebi', 'regulation', 'government', 'ministry'],
                    'corporate': ['results', 'earnings', 'revenue', 'profit', 'loss', 'dividend', 'quarterly', 'q4']
                }
                for category, keywords in category_keywords.items():
                    if any(keyword in all_text for keyword in keywords):
                        categories.append(category)
                if categories:
                    news_item['categories'] = categories
                else:
                    news_item['categories'] = ['finance']
                news_items.append(news_item)
            logger.info(f"Successfully extracted {len(news_items)} news items")
        except Exception as e:
            logger.error(f"Error parsing news: {e}")
            import traceback
            logger.error(traceback.format_exc())
        return news_items
    
    def scrape_and_store(self):
        logger.info("Starting scraping process for news feed")
        html_content = self.fetch_page()
        
        if html_content:
            news_items = self.parse_news(html_content)
            logger.info(f"Found {len(news_items)} news items")
            
            if news_items:
                try:
                    self.db.collection.delete_many({})
                    logger.info("Cleared existing news items from database")
                except Exception as e:
                    logger.error(f"Error clearing database: {e}")
                
                self.db.insert_news(news_items)
                logger.info("News items stored in database")
            else:
                logger.warning("No news items found to store")
        else:
            logger.error("Failed to fetch page content")
