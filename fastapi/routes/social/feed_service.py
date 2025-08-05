import httpx
import feedparser
from bs4 import BeautifulSoup
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
import asyncio
import re
import logging

logger = logging.getLogger(__name__)


class FeedService:
    def __init__(self):
        self._cache = {}
        self._cache_duration = timedelta(minutes=15)  # Cache for 15 minutes
        
        # Security and tech news RSS feeds
        self.feed_sources = {
            "security": [
                {
                    "name": "Krebs on Security",
                    "url": "https://krebsonsecurity.com/feed/",
                    "category": "security",
                    "type": "rss"
                },
                {
                    "name": "The Hacker News",
                    "url": "https://feeds.feedburner.com/TheHackersNews",
                    "category": "security", 
                    "type": "rss"
                },
                {
                    "name": "Bleeping Computer",
                    "url": "https://www.bleepingcomputer.com/feed/",
                    "category": "security",
                    "type": "rss"
                },
                {
                    "name": "SANS Internet Storm Center",
                    "url": "https://isc.sans.edu/rssfeed.xml",
                    "category": "security",
                    "type": "rss"
                },
                {
                    "name": "Dark Reading",
                    "url": "https://www.darkreading.com/rss.xml",
                    "category": "security",
                    "type": "rss"
                }
            ],
            "tech": [
                {
                    "name": "Ars Technica",
                    "url": "https://feeds.arstechnica.com/arstechnica/index",
                    "category": "tech",
                    "type": "rss"
                },
                {
                    "name": "TechCrunch",
                    "url": "https://techcrunch.com/feed/",
                    "category": "tech",
                    "type": "rss"
                },
                {
                    "name": "Hacker News",
                    "url": "https://hnrss.org/frontpage",
                    "category": "tech",
                    "type": "rss"
                },
                {
                    "name": "The Verge",
                    "url": "https://www.theverge.com/rss/index.xml",
                    "category": "tech",
                    "type": "rss"
                }
            ],
            "devops": [
                {
                    "name": "Kubernetes Blog",
                    "url": "https://kubernetes.io/feed.xml",
                    "category": "devops",
                    "type": "rss"
                },
                {
                    "name": "Docker Blog",
                    "url": "https://www.docker.com/blog/feed/",
                    "category": "devops",
                    "type": "rss"
                },
                {
                    "name": "DevOps.com",
                    "url": "https://devops.com/feed/",
                    "category": "devops",
                    "type": "rss"
                }
            ]
        }
    
    def _is_cache_valid(self, cache_key: str) -> bool:
        """Check if cached data is still valid"""
        if cache_key not in self._cache:
            return False
        
        cached_time = self._cache[cache_key].get("timestamp")
        if not cached_time:
            return False
            
        return datetime.utcnow() - cached_time < self._cache_duration
    
    async def _fetch_rss_feed(self, source: Dict[str, str]) -> List[Dict[str, Any]]:
        """Fetch and parse RSS feed"""
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(source["url"])
                response.raise_for_status()
                
                # Parse RSS feed
                feed = feedparser.parse(response.content)
                
                articles = []
                for entry in feed.entries[:10]:  # Limit to 10 articles per source
                    # Extract and clean description
                    description = ""
                    if hasattr(entry, 'description'):
                        soup = BeautifulSoup(entry.description, 'html.parser')
                        description = soup.get_text().strip()[:200] + "..."
                    elif hasattr(entry, 'summary'):
                        soup = BeautifulSoup(entry.summary, 'html.parser')
                        description = soup.get_text().strip()[:200] + "..."
                    
                    # Parse published date
                    published = datetime.utcnow()
                    if hasattr(entry, 'published_parsed') and entry.published_parsed:
                        try:
                            published = datetime(*entry.published_parsed[:6])
                        except (TypeError, ValueError):
                            pass
                    
                    articles.append({
                        "title": entry.title if hasattr(entry, 'title') else "No Title",
                        "description": description,
                        "url": entry.link if hasattr(entry, 'link') else "",
                        "source": source["name"],
                        "category": source["category"],
                        "published": published.isoformat(),
                        "domain": self._extract_domain(entry.link if hasattr(entry, 'link') else "")
                    })
                
                return articles
                
        except httpx.HTTPError as e:
            logger.error(f"HTTP error fetching RSS from {source['name']}: {e}")
            return []
        except Exception as e:
            logger.error(f"Error parsing RSS from {source['name']}: {e}")
            return []
    
    def _extract_domain(self, url: str) -> str:
        """Extract domain from URL"""
        try:
            import re
            match = re.search(r'https?://([^/]+)', url)
            return match.group(1) if match else ""
        except:
            return ""
    
    async def get_feed_articles(self, categories: List[str] = None, limit: int = 50) -> Dict[str, Any]:
        """
        Get articles from RSS feeds
        
        Args:
            categories: List of categories to fetch ('security', 'tech', 'devops')
            limit: Maximum number of articles to return
        """
        if categories is None:
            categories = ['security', 'tech', 'devops']
        
        cache_key = f"feed_articles_{','.join(sorted(categories))}"
        
        # Return cached data if valid
        if self._is_cache_valid(cache_key):
            return self._cache[cache_key]["data"]
        
        all_articles = []
        
        # Fetch from each category
        for category in categories:
            if category not in self.feed_sources:
                continue
                
            # Fetch all sources in this category concurrently
            tasks = []
            for source in self.feed_sources[category]:
                tasks.append(self._fetch_rss_feed(source))
            
            try:
                results = await asyncio.gather(*tasks, return_exceptions=True)
                for result in results:
                    if isinstance(result, list):
                        all_articles.extend(result)
                    elif isinstance(result, Exception):
                        logger.error(f"Task failed: {result}")
            except Exception as e:
                logger.error(f"Error gathering feed results for {category}: {e}")
        
        # Sort articles by published date (newest first)
        all_articles.sort(key=lambda x: x['published'], reverse=True)
        
        # Limit results
        limited_articles = all_articles[:limit]
        
        # Prepare response
        response_data = {
            "articles": limited_articles,
            "total_count": len(limited_articles),
            "categories": categories,
            "last_updated": datetime.utcnow().isoformat(),
            "sources": self._get_source_summary(categories)
        }
        
        # Cache the result
        self._cache[cache_key] = {
            "data": response_data,
            "timestamp": datetime.utcnow()
        }
        
        return response_data
    
    def _get_source_summary(self, categories: List[str]) -> List[Dict[str, str]]:
        """Get summary of sources being used"""
        sources = []
        for category in categories:
            if category in self.feed_sources:
                for source in self.feed_sources[category]:
                    sources.append({
                        "name": source["name"],
                        "category": source["category"],
                        "type": source["type"]
                    })
        return sources
    
    async def get_trending_topics(self, categories: List[str] = None) -> Dict[str, Any]:
        """
        Analyze articles and extract trending topics/keywords
        """
        cache_key = f"trending_topics_{','.join(sorted(categories or []))}"
        
        if self._is_cache_valid(cache_key):
            return self._cache[cache_key]["data"]
        
        # Get recent articles
        feed_data = await self.get_feed_articles(categories, limit=100)
        articles = feed_data["articles"]
        
        # Simple keyword extraction from titles
        word_counts = {}
        tech_keywords = set(['security', 'vulnerability', 'malware', 'breach', 'hack', 'attack', 
                           'kubernetes', 'docker', 'cloud', 'ai', 'ml', 'devops', 'api', 
                           'zero-day', 'ransomware', 'phishing', 'exploit'])
        
        for article in articles:
            title_words = re.findall(r'\b[a-zA-Z]{4,}\b', article['title'].lower())
            for word in title_words:
                if word in tech_keywords:
                    word_counts[word] = word_counts.get(word, 0) + 1
        
        # Get top trending topics
        trending = sorted(word_counts.items(), key=lambda x: x[1], reverse=True)[:10]
        
        response_data = {
            "trending_topics": [{"keyword": word, "count": count} for word, count in trending],
            "analysis_period": "last_100_articles",
            "last_updated": datetime.utcnow().isoformat()
        }
        
        # Cache the result
        self._cache[cache_key] = {
            "data": response_data,
            "timestamp": datetime.utcnow()
        }
        
        return response_data
    
    def get_available_categories(self) -> Dict[str, Any]:
        """Get list of available feed categories"""
        return {
            "categories": list(self.feed_sources.keys()),
            "sources_count": {
                category: len(sources) 
                for category, sources in self.feed_sources.items()
            },
            "total_sources": sum(len(sources) for sources in self.feed_sources.values())
        }