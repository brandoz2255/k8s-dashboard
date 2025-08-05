"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import {
  Shield,
  MessageCircle,
  Heart,
  Repeat2,
  Cpu,
  Globe,
  Container,
  ExternalLink,
  RefreshCw,
  Settings,
  Clock,
} from "lucide-react"

// Feed article type from FastAPI backend
interface FeedArticle {
  title: string
  description: string
  url: string
  source: string
  category: string
  published: string
  domain: string
}

// Component display format
interface SocialPost {
  id: string
  platform: "security" | "tech" | "devops"
  author: {
    name: string
    handle: string
    avatar: string
  }
  content: string
  timestamp: string
  stats: {
    likes: number
    comments: number
    shares: number
  }
  link: string
}

// Transform API data to component format
const transformFeedData = (articles: FeedArticle[]): SocialPost[] => {
  return articles.map((article, index) => ({
    id: `feed_${index}`,
    platform: article.category as "security" | "tech" | "devops",
    author: {
      name: article.source,
      handle: article.domain,
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content: `${article.title} - ${article.description}`,
    timestamp: formatTimestamp(article.published),
    stats: {
      likes: Math.floor(Math.random() * 100) + 10,
      comments: Math.floor(Math.random() * 20) + 1,
      shares: Math.floor(Math.random() * 50) + 5,
    },
    link: article.url,
  }))
}

// Format timestamp to relative time
const formatTimestamp = (published: string): string => {
  try {
    const now = new Date()
    const publishedDate = new Date(published)
    const diffMs = now.getTime() - publishedDate.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffMinutes = Math.floor(diffMs / (1000 * 60))

    if (diffMinutes < 60) {
      return `${diffMinutes}m ago`
    } else if (diffHours < 24) {
      return `${diffHours}h ago`
    } else {
      const diffDays = Math.floor(diffHours / 24)
      return `${diffDays}d ago`
    }
  } catch {
    return "recently"
  }
}

// Mock fallback data
const mockPosts: SocialPost[] = [
  {
    id: "mock1",
    platform: "security",
    author: {
      name: "Security News",
      handle: "security.local",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content: "Latest security updates and vulnerability reports - Stay protected with our security feed.",
    timestamp: "10m ago",
    stats: { likes: 42, comments: 7, shares: 23 },
    link: "#",
  },
  {
    id: "mock2", 
    platform: "tech",
    author: {
      name: "Tech Updates",
      handle: "tech.local",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content: "Latest technology news and developments - Keep up with the tech world.",
    timestamp: "2h ago",
    stats: { likes: 128, comments: 14, shares: 56 },
    link: "#",
  },
]

export function SocialFeedWidget() {
  const [filter, setFilter] = useState<"all" | "security" | "tech" | "devops">("all")
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [posts, setPosts] = useState<SocialPost[]>(mockPosts)
  const [lastUpdated, setLastUpdated] = useState<string>("")

  // Filter posts based on selected category
  const filteredPosts = filter === "all" ? posts : posts.filter((post) => post.platform === filter)

  // Function to fetch feed data from FastAPI
  const fetchFeedData = useCallback(async () => {
    setIsRefreshing(true)

    try {
      const fastApiUrl = process.env.NODE_ENV === 'production' 
        ? 'https://api.command.dulc3.tech'
        : 'http://localhost:8000'
      
      const categories = filter === "all" ? "security,tech,devops" : filter
      const response = await fetch(`${fastApiUrl}/api/social/feed?categories=${categories}&limit=20`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(15000), // 15 second timeout
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const feedData = await response.json()
      
      // Transform API data to component format
      const transformedPosts = transformFeedData(feedData.articles)
      setPosts(transformedPosts)
      setLastUpdated(new Date(feedData.last_updated).toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      }))
      
      console.log('Social feed data fetched successfully:', feedData.total_count, 'articles')
      
    } catch (error) {
      console.error('Error fetching social feed data:', error)
      
      // Fallback to mock data if API fails
      setPosts(mockPosts)
      setLastUpdated("offline")
      console.log('Using fallback mock social feed data')
      
    } finally {
      setIsRefreshing(false)
    }
  }, [filter])

  // Function to refresh feed
  const refreshFeed = () => {
    fetchFeedData()
  }

  // Fetch feed data on component mount and when filter changes
  useEffect(() => {
    fetchFeedData()
    
    // Set up interval to refresh feed data (every 15 minutes)
    const interval = setInterval(fetchFeedData, 15 * 60 * 1000)
    
    return () => clearInterval(interval)
  }, [fetchFeedData])

  // Function to get platform icon
  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "security":
        return <Shield className="h-4 w-4 text-red-400" />
      case "tech":
        return <Cpu className="h-4 w-4 text-blue-400" />
      case "devops":
        return <Container className="h-4 w-4 text-green-400" />
      default:
        return <Globe className="h-4 w-4 text-cyan-400" />
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-black border border-cyan-950 rounded-lg overflow-hidden hover-card-glow flex flex-col h-full"
    >
      <div className="p-3 border-b border-cyan-950 flex justify-between items-center">
        <h2 className="text-lg font-medium text-cyan-400">Social Feed</h2>
        <div className="flex space-x-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as "all" | "security" | "tech" | "devops")}
            className="bg-cyan-950/20 border border-cyan-950 rounded-md px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-cyan-500 appearance-none"
          >
            <option value="all">All</option>
            <option value="security">Security</option>
            <option value="tech">Tech</option>
            <option value="devops">DevOps</option>
          </select>
          <button
            onClick={refreshFeed}
            disabled={isRefreshing}
            className="bg-cyan-950 hover:bg-cyan-900 text-cyan-400 p-1 rounded text-xs flex items-center transition-colors"
          >
            <RefreshCw className={`h-3 w-3 ${isRefreshing ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      <div className="divide-y divide-cyan-950/50 overflow-auto flex-grow">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <div key={post.id} className="p-3 hover:bg-cyan-950/10 transition-colors">
              <div className="flex">
                <div className="flex-shrink-0 mr-2">
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-cyan-950 flex items-center justify-center">
                    {getPlatformIcon(post.platform)}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="font-medium text-white text-xs truncate">{post.author.name}</span>
                      <span className="ml-1 text-gray-500 text-xs">@{post.author.handle}</span>
                    </div>
                    <span className="text-xs text-gray-500">{post.timestamp}</span>
                  </div>
                  <p className="mt-1 text-xs text-gray-300 line-clamp-2">{post.content}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex space-x-3">
                      <button className="flex items-center text-gray-500 hover:text-pink-400">
                        <Heart className="h-3 w-3 mr-1" />
                        <span className="text-xs">{post.stats.likes}</span>
                      </button>
                      <button className="flex items-center text-gray-500 hover:text-cyan-400">
                        <MessageCircle className="h-3 w-3 mr-1" />
                        <span className="text-xs">{post.stats.comments}</span>
                      </button>
                      <button className="flex items-center text-gray-500 hover:text-emerald-400">
                        <Repeat2 className="h-3 w-3 mr-1" />
                        <span className="text-xs">{post.stats.shares}</span>
                      </button>
                    </div>
                    <a
                      href={post.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-400 hover:text-pink-400 text-xs flex items-center"
                    >
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-4 text-center text-gray-500">
            <Globe className="h-6 w-6 mx-auto mb-2 opacity-50" />
            <p className="text-xs">No posts found.</p>
          </div>
        )}
      </div>

      <div className="p-3 border-t border-cyan-950 flex justify-between items-center bg-cyan-950/10 mt-auto">
        <div className="flex items-center text-xs text-gray-400">
          <Clock className="h-3 w-3 mr-1" />
          Last updated: {lastUpdated || "Loading..."}
        </div>
        <button
          onClick={() => window.open("/feed-manager", "_blank")}
          className="relative bg-cyan-950 hover:bg-pink-900 text-cyan-400 hover:text-pink-400 px-2 py-1 rounded text-xs flex items-center transition-colors group"
        >
          <span className="absolute inset-0 rounded-md bg-pink-500/0 group-hover:bg-pink-500/20 group-hover:shadow-[0_0_8px_2px_rgba(236,72,153,0.3)] transition-all duration-300"></span>
          <Settings className="h-3 w-3 mr-1" />
          Manage
        </button>
      </div>
    </motion.div>
  )
}

