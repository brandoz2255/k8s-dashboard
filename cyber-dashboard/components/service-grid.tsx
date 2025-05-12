"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  ExternalLink,
  Database,
  Shield,
  Lock,
  Server,
  Github,
  GitMerge,
  Youtube,
  MessageSquare,
  Bot,
  Globe,
  Mail,
} from "lucide-react"

// Service type definition
interface Service {
  id: string
  name: string
  description: string
  icon: React.ElementType
  url: string
  type: "container" | "external"
  isPihole?: boolean
  highlight?: boolean
}

// This would typically come from your Go API
const services: Service[] = [
  {
    id: "pi-hole",
    name: "Pi-hole",
    description: "Network-wide ad blocking",
    icon: Shield,
    url: "https://pihole.dulc3.tech/admin/",
    type: "external",
    isPihole: true,
  },
  {
    id: "grafana",
    name: "Grafana",
    description: "Monitoring and observability platform",
    icon: Database,
    url: "https://grafana.dulc3.tech",
    type: "container",
    highlight: true,
  },
  {
    id: "pgadmin",
    name: "PgAdmin",
    description: "Web UI for my  databases",
    icon: Database,
    url: "https://pgadmin.dulc3.tech",
    type: "container",
  },

  {
    id: "wireguard",
    name: "Wireguard",
    description: "VPN server for secure connections",
    icon: Shield,
    url: "http://localhost:3000/wireguard",
    type: "container",
  },
  {
    id: "bitwarden",
    name: "Bitwarden",
    description: "Password manager",
    icon: Lock,
    url: "http://localhost:3000/bitwarden",
    type: "container",
  },
  {
    id: "minecraft",
    name: "Minecraft Server",
    description: "Game server",
    icon: Server,
    url: "http://localhost:3000/minecraft",
    type: "container",
  },
  {
    id: "github",
    name: "GitHub",
    description: "Code repository",
    icon: Github,
    url: "https://github.com",
    type: "external",
  },
  {
    id: "gitlab",
    name: "GitLab",
    description: "Code repository",
    icon: GitMerge,
    url: "https://gitlab.com",
    type: "external",
  },
  {
    id: "youtube",
    name: "YouTube",
    description: "Video platform",
    icon: Youtube,
    url: "https://youtube.com",
    type: "external",
  },
  {
    id: "chatgpt",
    name: "ChatGPT",
    description: "AI assistant",
    icon: MessageSquare,
    url: "https://chat.openai.com",
    type: "external",
  },
  {
    id: "v0",
    name: "v0",
    description: "Vercel AI assistant",
    icon: Bot,
    url: "https://v0.dev",
    type: "external",
  },
  {
    id: "nightride.fm",
    name: "Nigthride.FM",
    description: "Web Radio station",
    icon: Globe, // Import the icon from lucide-react
    url: "https://nightride.fm",
    type: "external",
  },
  {
    id: "perplexity",
    name: "Perplexity",
    description: "AI search engine",
    icon: Bot, // Import the icon from lucide-react
    url: "https://www.perplexity.ai/",
    type: "external",
  },
  {
    id: "gmail",
    name: "Gmail",
    description: "Email service",
    icon: Mail,
    url: "https://mail.google.com/mail/u/0/#inbox",
    type: "external",
  },
  {
    id: "mycoyote",
    name: "MyCoyote",
    description: "School student portal",
    icon: Globe,
    url: "https://mycoyote.csusb.edu",
    type: "external",
  },
  // You can add more services here
  /* 
  To add a new service, copy and paste one of the objects above and modify it.
  Example:
  {
    id: "unique-id",
    name: "Service Name",
    description: "Service description",
    icon: IconComponent, // Import the icon from lucide-react
    url: "https://service-url.com",
    type: "container" or "external",
  }
  */
]

export function ServiceGrid() {
  const [filter, setFilter] = useState<"all" | "container" | "external">("all")
  // Mock Pi-hole stats - would be fetched from your Go API
  const [piholeStats, setPiholeStats] = useState({
    domainsBlocked: 125463,
    queriesTotal: 28945,
    queriesBlocked: 12458,
    blockingPercentage: 43.04,
    clientsEverSeen: 18,
    uniqueClients: 8,
    dnsQueriesToday: 28945,
    adsBlockedToday: 12458,
    status: "enabled" as "enabled" | "disabled",
  })

  const filteredServices = services.filter((service) => filter === "all" || service.type === filter)

  // Separate Pi-hole from other services
  const piholeService = filteredServices.find((service) => service.isPihole)
  const otherServices = filteredServices.filter((service) => !service.isPihole)

  // Function to fetch Pi-hole stats
  const fetchPiholeStats = () => {
    // This would be replaced with actual API call to your Go backend
    /*
    API INTEGRATION POINT:
    
    const fetchPiholeData = async () => {
      try {
        const response = await fetch('/api/pihole/stats');
        if (!response.ok) {
          throw new Error('Failed to fetch Pi-hole stats');
        }
        const data = await response.json();
        setPiholeStats(data);
      } catch (error) {
        console.error('Error fetching Pi-hole stats:', error);
      }
    };
    
    fetchPiholeData();
    */

    // For now, we'll just use the mock data
    console.log("Fetching Pi-hole stats...")
  }

  // Fetch Pi-hole stats on component mount
  useEffect(() => {
    fetchPiholeStats()

    // Set up interval to refresh stats (every 30 seconds)
    const interval = setInterval(fetchPiholeStats, 30000)

    // Clean up interval on component unmount
    return () => clearInterval(interval)
  }, [])

  return (
    <section>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-cyan-400">Services</h2>
        <div className="bg-black border border-cyan-950 rounded-md flex overflow-hidden">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1 text-sm ${filter === "all" ? "bg-cyan-950 text-cyan-400" : "text-gray-400 hover:text-cyan-400"}`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("container")}
            className={`px-3 py-1 text-sm ${filter === "container" ? "bg-cyan-950 text-cyan-400" : "text-gray-400 hover:text-cyan-400"}`}
          >
            Containers
          </button>
          <button
            onClick={() => setFilter("external")}
            className={`px-3 py-1 text-sm ${filter === "external" ? "bg-cyan-950 text-cyan-400" : "text-gray-400 hover:text-cyan-400"}`}
          >
            External
          </button>
        </div>
      </div>

      <div className="services-grid">
        {/* Render Pi-hole card if it exists in filtered services */}
        {piholeService && (
          <motion.div
            className="md:col-span-2"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
          >
            <div className="service-card hover-card-glow">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="service-card-title card-title">
                    <piholeService.icon className="h-5 w-5 mr-2 service-card-icon card-icon" />
                    {piholeService.name}
                  </h3>
                  <p className="service-card-description">{piholeService.description}</p>
                </div>
                <div
                  className={`px-2 py-1 rounded-full text-xs ${piholeStats.status === "enabled" ? "bg-emerald-950/30 text-emerald-400" : "bg-red-950/30 text-red-400"}`}
                >
                  {piholeStats.status === "enabled" ? "Enabled" : "Disabled"}
                </div>
              </div>

              {/* Pi-hole mini metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
                <div className="bg-cyan-950/20 p-2 rounded-md">
                  <div className="text-xs text-gray-400 mb-1">Domains Blocked</div>
                  <div className="text-sm font-medium text-cyan-400">{piholeStats.domainsBlocked.toLocaleString()}</div>
                </div>
                <div className="bg-cyan-950/20 p-2 rounded-md">
                  <div className="text-xs text-gray-400 mb-1">Ads Blocked Today</div>
                  <div className="text-sm font-medium text-cyan-400">
                    {piholeStats.adsBlockedToday.toLocaleString()}
                  </div>
                </div>
                <div className="bg-cyan-950/20 p-2 rounded-md">
                  <div className="text-xs text-gray-400 mb-1">Blocking</div>
                  <div className="text-sm font-medium text-cyan-400">{piholeStats.blockingPercentage.toFixed(1)}%</div>
                </div>
                <div className="bg-cyan-950/20 p-2 rounded-md">
                  <div className="text-xs text-gray-400 mb-1">Clients</div>
                  <div className="text-sm font-medium text-cyan-400">
                    {piholeStats.uniqueClients} / {piholeStats.clientsEverSeen}
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="service-card-type">Network-wide Ad Blocking</span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      // This would be replaced with actual API call to your Go backend
                      /*
                      API INTEGRATION POINT:
                      
                      const togglePihole = async () => {
                        try {
                          const newStatus = piholeStats.status === "enabled" ? "disable" : "enable";
                          const response = await fetch(`/api/pihole/${newStatus}`, {
                            method: 'POST'
                          });
                          
                          if (!response.ok) {
                            throw new Error(`Failed to ${newStatus} Pi-hole`);
                          }
                          
                          // Update local state
                          setPiholeStats(prev => ({
                            ...prev,
                            status: newStatus === "enable" ? "enabled" : "disabled"
                          }));
                          
                        } catch (error) {
                          console.error('Error toggling Pi-hole:', error);
                        }
                      };
                      */

                      // For now, just toggle the mock state
                      setPiholeStats((prev) => ({
                        ...prev,
                        status: prev.status === "enabled" ? "disabled" : "enabled",
                      }))
                    }}
                    className={`px-2 py-1 rounded text-xs flex items-center transition-colors ${piholeStats.status === "enabled"
                      ? "bg-red-950/30 text-red-400 hover:bg-red-900/50"
                      : "bg-emerald-950/30 text-emerald-400 hover:bg-emerald-900/50"
                      }`}
                  >
                    {piholeStats.status === "enabled" ? "Disable" : "Enable"}
                  </button>
                  <a
                    href={piholeService.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="service-card-button card-button"
                  >
                    Open <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Render other services */}
        {otherServices.map((service, index) => (
          <ServiceCard key={service.id} service={service} delay={0.1 + (index + (piholeService ? 1 : 0)) * 0.05} />
        ))}
      </div>
    </section>
  )
}

interface ServiceCardProps {
  service: Service
  delay: number
}

function ServiceCard({ service, delay }: ServiceCardProps) {
  const Icon = service.icon

  return (
    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay, duration: 0.4 }}>
      <div className="service-card hover-card-glow">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="service-card-title card-title">
              <Icon className="h-5 w-5 mr-2 service-card-icon card-icon" />
              {service.name}
            </h3>
            <p className="service-card-description">{service.description}</p>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="service-card-type">{service.type === "container" ? "Containerized" : "External Link"}</span>
          <a
            href={service.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`service-card-button card-button ${service.highlight ? "relative group" : ""}`}
          >
            {service.highlight && (
              <span className="absolute inset-0 rounded-md bg-pink-500/0 group-hover:bg-pink-500/20 group-hover:shadow-[0_0_8px_2px_rgba(236,72,153,0.3)] transition-all duration-300"></span>
            )}
            Open <ExternalLink className="ml-1 h-3 w-3" />
          </a>
        </div>
      </div>
    </motion.div>
  )
}

