from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime
from .feed_service import FeedService


router = APIRouter()
feed_service = FeedService()


class FeedArticle(BaseModel):
    title: str
    description: str
    url: str
    source: str
    category: str
    published: str
    domain: str


class FeedResponse(BaseModel):
    articles: List[FeedArticle]
    total_count: int
    categories: List[str]
    last_updated: str
    sources: List[Dict[str, str]]


class TrendingTopic(BaseModel):
    keyword: str
    count: int


class TrendingResponse(BaseModel):
    trending_topics: List[TrendingTopic]
    analysis_period: str
    last_updated: str


class CategoriesResponse(BaseModel):
    categories: List[str]
    sources_count: Dict[str, int]
    total_sources: int


@router.get("/feed", response_model=FeedResponse)
async def get_social_feed(
    categories: Optional[str] = Query(
        default="security,tech",
        description="Comma-separated list of categories (security, tech, devops)"
    ),
    limit: int = Query(
        default=30,
        ge=1,
        le=100,
        description="Maximum number of articles to return (1-100)"
    )
):
    """
    Get aggregated social feed from security and tech news sources
    
    - **categories**: Comma-separated categories (security, tech, devops)
    - **limit**: Maximum number of articles (default: 30, max: 100)
    
    Returns latest articles from RSS feeds with links and descriptions.
    """
    try:
        # Parse categories
        category_list = [cat.strip() for cat in categories.split(",") if cat.strip()]
        
        # Validate categories
        valid_categories = {"security", "tech", "devops"}
        category_list = [cat for cat in category_list if cat in valid_categories]
        
        if not category_list:
            category_list = ["security", "tech"]  # Default fallback
        
        # Fetch feed data
        feed_data = await feed_service.get_feed_articles(category_list, limit)
        
        return FeedResponse(**feed_data)
        
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Failed to fetch social feed: {str(e)}"
        )


@router.get("/feed/trending", response_model=TrendingResponse)
async def get_trending_topics(
    categories: Optional[str] = Query(
        default="security,tech",
        description="Comma-separated list of categories to analyze"
    )
):
    """
    Get trending topics from recent articles
    
    - **categories**: Categories to analyze for trends
    
    Analyzes recent articles and extracts trending keywords and topics.
    """
    try:
        # Parse categories
        category_list = [cat.strip() for cat in categories.split(",") if cat.strip()]
        
        # Validate categories
        valid_categories = {"security", "tech", "devops"}
        category_list = [cat for cat in category_list if cat in valid_categories]
        
        if not category_list:
            category_list = ["security", "tech"]
        
        # Get trending analysis
        trending_data = await feed_service.get_trending_topics(category_list)
        
        return TrendingResponse(**trending_data)
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to get trending topics: {str(e)}"
        )


@router.get("/feed/categories", response_model=CategoriesResponse)
async def get_available_categories():
    """
    Get list of available feed categories and sources
    
    Returns information about available categories and the number of sources for each.
    """
    try:
        categories_data = feed_service.get_available_categories()
        return CategoriesResponse(**categories_data)
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to get categories: {str(e)}"
        )


@router.get("/feed/sources")
async def get_feed_sources():
    """
    Get detailed information about all RSS feed sources
    
    Returns the complete list of RSS sources being monitored.
    """
    try:
        return {
            "sources": feed_service.feed_sources,
            "total_categories": len(feed_service.feed_sources),
            "total_sources": sum(
                len(sources) for sources in feed_service.feed_sources.values()
            ),
            "last_updated": datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to get feed sources: {str(e)}"
        )


@router.post("/feed/refresh")
async def refresh_feed_cache():
    """
    Manually refresh the feed cache
    
    Forces a refresh of all cached feed data. Useful for testing or immediate updates.
    """
    try:
        # Clear cache
        feed_service._cache.clear()
        
        # Fetch fresh data
        fresh_data = await feed_service.get_feed_articles(["security", "tech", "devops"], 50)
        
        return {
            "message": "Feed cache refreshed successfully",
            "articles_fetched": fresh_data["total_count"],
            "categories": fresh_data["categories"],
            "refresh_time": datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to refresh feed cache: {str(e)}"
        )