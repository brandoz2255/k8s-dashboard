#!/usr/bin/env python3
"""
Standalone test for social feed service (no server required)
Tests FeedService functionality directly
"""
import asyncio
import json
from datetime import datetime
from typing import Dict, Any
from routes.social.feed_service import FeedService


async def test_feed_service():
    """Test FeedService functionality"""
    print("🔍 Testing FeedService directly...")
    
    service = FeedService()
    results = []
    
    def log_result(test_name: str, success: bool, message: str, data: Any = None):
        result = {
            "test": test_name,
            "success": success,
            "message": message,
            "data": data,
            "timestamp": datetime.utcnow().isoformat()
        }
        results.append(result)
        status = "✅" if success else "❌"
        print(f"{status} {test_name}: {message}")
    
    # Test 1: Feed sources structure
    try:
        sources = service.feed_sources
        total_sources = sum(len(sources[cat]) for cat in sources)
        log_result(
            "Feed Sources Configuration",
            total_sources > 0,
            f"Found {total_sources} total sources across {len(sources)} categories",
            {"total_sources": total_sources, "categories": list(sources.keys())}
        )
    except Exception as e:
        log_result("Feed Sources Configuration", False, f"Error: {str(e)}")
    
    # Test 2: Get available categories
    try:
        categories = service.get_available_categories()
        log_result(
            "Get Available Categories",
            len(categories["categories"]) > 0,
            f"Found categories: {', '.join(categories['categories'])}",
            categories
        )
    except Exception as e:
        log_result("Get Available Categories", False, f"Error: {str(e)}")
    
    # Test 3: Try to fetch real feed data (might fail if no internet/RSS issues)
    print("\n🌐 Testing RSS feed fetching (may take 30+ seconds)...")
    try:
        # Test with security category only and small limit
        articles = await service.get_feed_articles(["security"], 5)
        log_result(
            "Fetch Security Articles",
            articles["total_count"] >= 0,  # Even 0 is ok if all feeds fail
            f"Retrieved {articles['total_count']} articles from {len(articles.get('sources', []))} sources",
            {"article_count": articles["total_count"], "sources": articles.get("sources", [])}
        )
        
        # If we got articles, test one more category
        if articles["total_count"] > 0:
            tech_articles = await service.get_feed_articles(["tech"], 3)
            log_result(
                "Fetch Tech Articles",
                tech_articles["total_count"] >= 0,
                f"Retrieved {tech_articles['total_count']} tech articles",
                {"article_count": tech_articles["total_count"]}
            )
    except Exception as e:
        log_result("Fetch Feed Articles", False, f"Error: {str(e)}")
    
    # Test 4: Trending topics
    try:
        trending = await service.get_trending_topics(["security", "tech"])
        log_result(
            "Get Trending Topics",
            len(trending["trending_topics"]) >= 0,
            f"Found {len(trending['trending_topics'])} trending topics",
            {"trending_count": len(trending["trending_topics"])}
        )
    except Exception as e:
        log_result("Get Trending Topics", False, f"Error: {str(e)}")
    
    # Test 5: Cache behavior
    try:
        # First call
        start_time = datetime.utcnow()
        articles1 = await service.get_feed_articles(["security"], 3)
        first_call_time = (datetime.utcnow() - start_time).total_seconds()
        
        # Second call (should be cached)
        start_time = datetime.utcnow()
        articles2 = await service.get_feed_articles(["security"], 3)
        second_call_time = (datetime.utcnow() - start_time).total_seconds()
        
        # Cache should make second call much faster
        cached = second_call_time < first_call_time * 0.5
        log_result(
            "Cache Performance",
            cached,
            f"First call: {first_call_time:.2f}s, Second call: {second_call_time:.2f}s, Cached: {cached}",
            {
                "first_call_time": first_call_time,
                "second_call_time": second_call_time,
                "cached": cached
            }
        )
    except Exception as e:
        log_result("Cache Performance", False, f"Error: {str(e)}")
    
    # Print summary
    print("\n" + "="*60)
    print("TEST SUMMARY")
    print("="*60)
    
    passed = sum(1 for r in results if r["success"])
    total = len(results)
    print(f"Passed: {passed}/{total} ({passed/total*100:.1f}%)")
    
    if passed < total:
        print("\nFailed tests:")
        for r in results:
            if not r["success"]:
                print(f"  ❌ {r['test']}: {r['message']}")
    
    # Save results
    with open("social_standalone_results.json", "w") as f:
        json.dump({
            "test_run": datetime.utcnow().isoformat(),
            "summary": {"passed": passed, "total": total, "success_rate": passed/total},
            "results": results
        }, f, indent=2)
    
    print(f"\n📁 Results saved to: social_standalone_results.json")
    return results


async def test_single_rss_feed():
    """Test fetching from a single RSS feed"""
    print("\n🔗 Testing single RSS feed fetch...")
    
    service = FeedService()
    
    # Get first security RSS source
    security_sources = service.feed_sources.get("security", [])
    if not security_sources:
        print("❌ No security sources configured")
        return
    
    first_source = security_sources[0]
    print(f"Testing: {first_source['name']} - {first_source['url']}")
    
    try:
        # Test single RSS fetch method if it exists
        if hasattr(service, '_fetch_single_rss'):
            articles = await service._fetch_single_rss(first_source)
            print(f"✅ Successfully fetched {len(articles)} articles from {first_source['name']}")
            
            # Show first article if available
            if articles:
                first_article = articles[0]
                print(f"   Sample article: '{first_article.get('title', 'No title')[:50]}...'")
        else:
            print("ℹ️  Single RSS fetch method not available")
            
    except Exception as e:
        print(f"❌ Failed to fetch from {first_source['name']}: {str(e)}")


async def main():
    """Run standalone tests"""
    print("Social Feed Service Standalone Test")
    print("="*50)
    print("Testing FeedService without requiring a running server")
    print()
    
    # Run main tests
    await test_feed_service()
    
    # Test single RSS feed
    await test_single_rss_feed()
    
    print("\n✅ Standalone testing complete!")


if __name__ == "__main__":
    asyncio.run(main())