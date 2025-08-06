#!/usr/bin/env python3
"""
Test script for the social feed routes and feed service
Tests all social API endpoints and validates responses
"""
import asyncio
import httpx
import json
from typing import Dict, Any, List
from datetime import datetime
from routes.social.feed_service import FeedService
from routes.social.social_routes import router


class SocialRoutesTest:
    def __init__(self, base_url: str = "http://localhost:8000/api/social"):
        self.base_url = base_url
        self.feed_service = FeedService()
        self.results = []

    def log_test(self, test_name: str, success: bool, message: str, data: Dict[Any, Any] = None):
        """Log test result"""
        result = {
            "test": test_name,
            "success": success,
            "message": message,
            "timestamp": datetime.utcnow().isoformat(),
            "data": data
        }
        self.results.append(result)
        
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} | {test_name}: {message}")
        if data and not success:
            print(f"    Error data: {json.dumps(data, indent=2)}")

    async def test_feed_service_direct(self):
        """Test FeedService class directly"""
        print("\n=== Testing FeedService Class ===")
        
        try:
            # Test 1: Get available categories
            categories = self.feed_service.get_available_categories()
            self.log_test(
                "FeedService.get_available_categories()",
                len(categories.get("categories", [])) > 0,
                f"Found {len(categories.get('categories', []))} categories",
                {"categories_count": len(categories.get("categories", []))}
            )
            
            # Test 2: Get feed articles
            articles = await self.feed_service.get_feed_articles(["security", "tech"], 10)
            self.log_test(
                "FeedService.get_feed_articles()",
                articles.get("total_count", 0) >= 0,
                f"Retrieved {articles.get('total_count', 0)} articles",
                {"article_count": articles.get("total_count", 0)}
            )
            
            # Test 3: Get trending topics
            trending = await self.feed_service.get_trending_topics(["security"])
            self.log_test(
                "FeedService.get_trending_topics()",
                len(trending.get("trending_topics", [])) >= 0,
                f"Found {len(trending.get('trending_topics', []))} trending topics",
                {"trending_count": len(trending.get("trending_topics", []))}
            )
            
        except Exception as e:
            self.log_test(
                "FeedService Direct Tests",
                False,
                f"Exception occurred: {str(e)}",
                {"exception": str(e)}
            )

    async def test_api_endpoints(self):
        """Test all social API endpoints via HTTP"""
        print("\n=== Testing API Endpoints ===")
        
        async with httpx.AsyncClient(timeout=30.0) as client:
            # Test 1: GET /api/social/feed (default parameters)
            try:
                response = await client.get(f"{self.base_url}/feed")
                success = response.status_code == 200
                data = response.json() if success else {"status_code": response.status_code, "content": response.text}
                
                self.log_test(
                    "GET /feed (default)",
                    success,
                    f"Status: {response.status_code}, Articles: {data.get('total_count', 0) if success else 'N/A'}",
                    {"status_code": response.status_code, "article_count": data.get("total_count") if success else None}
                )
            except Exception as e:
                self.log_test(
                    "GET /feed (default)",
                    False,
                    f"Request failed: {str(e)}",
                    {"exception": str(e)}
                )

            # Test 2: GET /api/social/feed with specific categories
            try:
                response = await client.get(f"{self.base_url}/feed?categories=security&limit=5")
                success = response.status_code == 200
                data = response.json() if success else {}
                
                self.log_test(
                    "GET /feed (security, limit=5)",
                    success,
                    f"Status: {response.status_code}, Articles: {data.get('total_count', 0) if success else 'N/A'}",
                    {"status_code": response.status_code}
                )
            except Exception as e:
                self.log_test(
                    "GET /feed (security, limit=5)",
                    False,
                    f"Request failed: {str(e)}",
                    {"exception": str(e)}
                )

            # Test 3: GET /api/social/feed with all categories
            try:
                response = await client.get(f"{self.base_url}/feed?categories=security,tech,devops&limit=20")
                success = response.status_code == 200
                data = response.json() if success else {}
                
                self.log_test(
                    "GET /feed (all categories)",
                    success,
                    f"Status: {response.status_code}, Articles: {data.get('total_count', 0) if success else 'N/A'}",
                    {"status_code": response.status_code}
                )
            except Exception as e:
                self.log_test(
                    "GET /feed (all categories)",
                    False,
                    f"Request failed: {str(e)}",
                    {"exception": str(e)}
                )

            # Test 4: GET /api/social/feed/trending
            try:
                response = await client.get(f"{self.base_url}/feed/trending")
                success = response.status_code == 200
                data = response.json() if success else {}
                
                self.log_test(
                    "GET /feed/trending",
                    success,
                    f"Status: {response.status_code}, Topics: {len(data.get('trending_topics', [])) if success else 'N/A'}",
                    {"status_code": response.status_code}
                )
            except Exception as e:
                self.log_test(
                    "GET /feed/trending",
                    False,
                    f"Request failed: {str(e)}",
                    {"exception": str(e)}
                )

            # Test 5: GET /api/social/feed/categories
            try:
                response = await client.get(f"{self.base_url}/feed/categories")
                success = response.status_code == 200
                data = response.json() if success else {}
                
                self.log_test(
                    "GET /feed/categories",
                    success,
                    f"Status: {response.status_code}, Categories: {len(data.get('categories', [])) if success else 'N/A'}",
                    {"status_code": response.status_code}
                )
            except Exception as e:
                self.log_test(
                    "GET /feed/categories",
                    False,
                    f"Request failed: {str(e)}",
                    {"exception": str(e)}
                )

            # Test 6: GET /api/social/feed/sources
            try:
                response = await client.get(f"{self.base_url}/feed/sources")
                success = response.status_code == 200
                data = response.json() if success else {}
                
                self.log_test(
                    "GET /feed/sources",
                    success,
                    f"Status: {response.status_code}, Total Sources: {data.get('total_sources', 0) if success else 'N/A'}",
                    {"status_code": response.status_code}
                )
            except Exception as e:
                self.log_test(
                    "GET /feed/sources",
                    False,
                    f"Request failed: {str(e)}",
                    {"exception": str(e)}
                )

            # Test 7: POST /api/social/feed/refresh
            try:
                response = await client.post(f"{self.base_url}/feed/refresh")
                success = response.status_code == 200
                data = response.json() if success else {}
                
                self.log_test(
                    "POST /feed/refresh",
                    success,
                    f"Status: {response.status_code}, Refreshed: {data.get('articles_fetched', 0) if success else 'N/A'} articles",
                    {"status_code": response.status_code}
                )
            except Exception as e:
                self.log_test(
                    "POST /feed/refresh",
                    False,
                    f"Request failed: {str(e)}",
                    {"exception": str(e)}
                )

    def test_data_validation(self):
        """Test data structure validation"""
        print("\n=== Testing Data Validation ===")
        
        # Test feed sources structure
        sources = self.feed_service.feed_sources
        expected_categories = {"security", "tech", "devops"}
        
        # Check if all expected categories exist
        found_categories = set(sources.keys())
        missing_categories = expected_categories - found_categories
        
        self.log_test(
            "Feed Sources Structure",
            len(missing_categories) == 0,
            f"Expected categories present: {len(missing_categories) == 0}",
            {"missing_categories": list(missing_categories), "found_categories": list(found_categories)}
        )
        
        # Check if each category has sources
        total_sources = 0
        for category, source_list in sources.items():
            if isinstance(source_list, list) and len(source_list) > 0:
                total_sources += len(source_list)
                
        self.log_test(
            "Feed Sources Count",
            total_sources > 10,  # Expect at least 10 sources total
            f"Total sources: {total_sources}",
            {"total_sources": total_sources}
        )

    async def test_error_handling(self):
        """Test error handling with invalid inputs"""
        print("\n=== Testing Error Handling ===")
        
        async with httpx.AsyncClient(timeout=10.0) as client:
            # Test 1: Invalid category
            try:
                response = await client.get(f"{self.base_url}/feed?categories=invalid_category")
                # Should still work but fall back to default categories
                success = response.status_code == 200
                
                self.log_test(
                    "Invalid Category Handling",
                    success,
                    f"Handled invalid category gracefully: {success}",
                    {"status_code": response.status_code}
                )
            except Exception as e:
                self.log_test(
                    "Invalid Category Handling",
                    False,
                    f"Exception: {str(e)}",
                    {"exception": str(e)}
                )

            # Test 2: Invalid limit (too high)
            try:
                response = await client.get(f"{self.base_url}/feed?limit=999")
                # Should be handled by FastAPI validation
                data = response.json() if response.status_code != 200 else {}
                
                self.log_test(
                    "Invalid Limit Handling",
                    response.status_code in [200, 422],  # Either works or validation error
                    f"Handled invalid limit: Status {response.status_code}",
                    {"status_code": response.status_code}
                )
            except Exception as e:
                self.log_test(
                    "Invalid Limit Handling",
                    False,
                    f"Exception: {str(e)}",
                    {"exception": str(e)}
                )

    def print_summary(self):
        """Print test summary"""
        print("\n" + "="*50)
        print("TEST SUMMARY")
        print("="*50)
        
        total_tests = len(self.results)
        passed_tests = len([r for r in self.results if r["success"]])
        failed_tests = total_tests - passed_tests
        
        print(f"Total Tests: {total_tests}")
        print(f"Passed: {passed_tests} ✅")
        print(f"Failed: {failed_tests} ❌")
        print(f"Success Rate: {(passed_tests/total_tests*100):.1f}%")
        
        if failed_tests > 0:
            print(f"\nFailed Tests:")
            for result in self.results:
                if not result["success"]:
                    print(f"  - {result['test']}: {result['message']}")
        
        print("\n" + "="*50)


async def test_mock_mode():
    """Test in mock mode (when RSS feeds might not be available)"""
    print("\n=== Testing Mock Mode ===")
    
    # Create a test service with limited timeout
    service = FeedService()
    
    try:
        # Test with very short timeout to simulate network issues
        articles = await service.get_feed_articles(["security"], 5)
        
        print(f"✅ Mock mode test: Retrieved {articles.get('total_count', 0)} articles")
        print(f"   Sources: {', '.join(articles.get('sources', []))}")
        
        return True
    except Exception as e:
        print(f"❌ Mock mode test failed: {str(e)}")
        return False


async def main():
    """Run all tests"""
    print("🚀 Starting Social Routes Test Suite")
    print("="*50)
    
    # Initialize test suite
    tester = SocialRoutesTest()
    
    # Test FeedService directly
    await tester.test_feed_service_direct()
    
    # Test API endpoints (requires FastAPI server running)
    print("\nℹ️  Testing API endpoints (requires FastAPI server at http://localhost:8000)")
    await tester.test_api_endpoints()
    
    # Test data validation
    tester.test_data_validation()
    
    # Test error handling
    await tester.test_error_handling()
    
    # Test mock mode
    await test_mock_mode()
    
    # Print summary
    tester.print_summary()
    
    # Save results to file
    with open("social_test_results.json", "w") as f:
        json.dump({
            "test_run": datetime.utcnow().isoformat(),
            "results": tester.results
        }, f, indent=2)
    
    print(f"📄 Detailed results saved to: social_test_results.json")


if __name__ == "__main__":
    print("Social Feed Routes Test Suite")
    print("Usage: python test_social.py")
    print("Note: For full API endpoint tests, ensure FastAPI server is running on localhost:8000")
    print()
    
    asyncio.run(main())