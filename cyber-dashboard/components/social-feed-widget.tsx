"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  Twitter,
  MessageCircle,
  Heart,
  Repeat2,
  Github,
  Globe,
  Youtube,
  ExternalLink,
  RefreshCw,
  Settings,
} from "lucide-react"

// Social media post type definition
interface SocialPost {
  id: string
  platform: "twitter" | "github" | "youtube" | "blog"
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

// Mock social media posts
const mockPosts: SocialPost[] = [
  {
    id: "tw1",
    platform: "twitter",
    author: {
      name: "Cyber Security News",
      handle: "@CyberSecNews",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content:
      "New vulnerability discovered in Docker containers. Update to the latest version immediately to patch CVE-2023-1234.",
    timestamp: "10m ago",
    stats: {
      likes: 42,
      comments: 7,
      shares: 23,
    },
    link: "https://twitter.com",
  },
  {
    id: "gh1",
    platform: "github",
    author: {
      name: "docker/docker",
      handle: "docker",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content: "Release v24.0.5: Fixed critical security vulnerability in container runtime. All users should update.",
    timestamp: "2h ago",
    stats: {
      likes: 128,
      comments: 14,
      shares: 56,
    },
    link: "https://github.com",
  },
  {
    id: "yt1",
    platform: "youtube",
    author: {
      name: "Container Tech",
      handle: "ContainerTech",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content:
      "New video: 'Hardening Docker Containers for Production' - Learn the best practices for securing your containers.",
    timestamp: "4h ago",
    stats: {
      likes: 312,
      comments: 28,
      shares: 45,
    },
    link: "https://youtube.com",
  },
  {
    id: "tw2",
    platform: "twitter",
    author: {
      name: "Kubernetes",
      handle: "@kubernetesio",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content: "Kubernetes v1.28 is now available! Check out the new features and improvements in our latest release.",
    timestamp: "1h ago",
    stats: {
      likes: 215,
      comments: 32,
      shares: 87,
    },
    link: "https://twitter.com",
  },
  {
    id: "blog1",
    platform: "blog",
    author: {
      name: "Security Weekly",
      handle: "secweekly",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content: "Top 10 Container Security Best Practices for 2023 - Our latest guide is now available on the blog.",
    timestamp: "6h ago",
    stats: {
      likes: 76,
      comments: 12,
      shares: 34,
    },
    link: "https://securityweekly.com",
  },
  {
    id: "gh2",
    platform: "github",
    author: {
      name: "kubernetes/kubernetes",
      handle: "kubernetes",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content:
      "PR #12345: Fixed critical security issue in API server authentication. Backported to all supported versions.",
    timestamp: "5h ago",
    stats: {
      likes: 98,
      comments: 23,
      shares: 41,
    },
    link: "https://github.com",
  },
]

export function SocialFeedWidget() {
  const [filter, setFilter] = useState<"all" | "twitter" | "github" | "youtube" | "blog">("all")
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Filter posts based on selected platform
  const filteredPosts = filter === "all" ? mockPosts : mockPosts.filter((post) => post.platform === filter)

  // Function to refresh feed
  const refreshFeed = () => {
    setIsRefreshing(true)

    // Simulate API call
    setTimeout(() => {
      setIsRefreshing(false)
    }, 1000)
  }

  // Function to get platform icon
  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "twitter":
        return <Twitter className="h-4 w-4 text-cyan-400" />
      case "github":
        return <Github className="h-4 w-4 text-cyan-400" />
      case "youtube":
        return <Youtube className="h-4 w-4 text-cyan-400" />
      case "blog":
        return <Globe className="h-4 w-4 text-cyan-400" />
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
            onChange={(e) => setFilter(e.target.value as any)}
            className="bg-cyan-950/20 border border-cyan-950 rounded-md px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-cyan-500 appearance-none"
          >
            <option value="all">All</option>
            <option value="twitter">Twitter</option>
            <option value="github">GitHub</option>
            <option value="youtube">YouTube</option>
            <option value="blog">Blogs</option>
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
        <span className="text-xs text-gray-400">Latest updates from your feeds</span>
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

