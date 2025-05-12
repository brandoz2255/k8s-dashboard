"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Cpu, MemoryStickIcon as Memory, HardDrive, Boxes, ExternalLink, Server, ChevronDown } from "lucide-react"

export function SystemMetrics() {
  // State for selected node
  const [selectedNode, setSelectedNode] = useState<string>("master-node")
  const [showNodeSelector, setShowNodeSelector] = useState(false)

  // Mock data for different nodes - would be fetched from your Go API
  const nodeMetrics = {
    "master-node": {
      cpu: 32,
      memory: 45,
      disk: 28,
      containers: {
        active: 8,
        total: 10,
      },
      status: "healthy",
    },
    "worker-node-1": {
      cpu: 65,
      memory: 72,
      disk: 42,
      containers: {
        active: 12,
        total: 15,
      },
      status: "healthy",
    },
    "worker-node-2": {
      cpu: 28,
      memory: 36,
      disk: 51,
      containers: {
        active: 6,
        total: 8,
      },
      status: "healthy",
    },
    "edge-node-1": {
      cpu: 18,
      memory: 25,
      disk: 15,
      containers: {
        active: 4,
        total: 5,
      },
      status: "warning",
    },
  }

  // List of available nodes
  const availableNodes = [
    { id: "master-node", name: "Master Node", type: "control-plane" },
    { id: "worker-node-1", name: "Worker Node 1", type: "worker" },
    { id: "worker-node-2", name: "Worker Node 2", type: "worker" },
    { id: "edge-node-1", name: "Edge Node 1", type: "edge" },
  ]

  // Get metrics for the selected node
  const metrics = nodeMetrics[selectedNode as keyof typeof nodeMetrics]

  // Function to fetch node metrics
  const fetchNodeMetrics = (nodeId: string) => {
    // This would be replaced with actual API call to your Go backend
    /*
    API INTEGRATION POINT:
    
    const fetchNodeData = async (nodeId) => {
      try {
        const response = await fetch(`/api/nodes/${nodeId}/metrics`);
        if (!response.ok) {
          throw new Error(`Failed to fetch metrics for node ${nodeId}`);
        }
        const data = await response.json();
        
        // Update state with the fetched metrics
        // You would need to transform the API response to match your UI structure
        // Example:
        // setNodeMetrics(prev => ({
        //   ...prev,
        //   [nodeId]: {
        //     cpu: data.cpuUsagePercentage,
        //     memory: data.memoryUsagePercentage,
        //     disk: data.diskUsagePercentage,
        //     containers: {
        //       active: data.activeContainers,
        //       total: data.totalContainers,
        //     },
        //     status: data.status,
        //   }
        // }));
        
      } catch (error) {
        console.error(`Error fetching metrics for node ${nodeId}:`, error);
      }
    };
    
    fetchNodeData(nodeId);
    */

    console.log(`Fetching metrics for node: ${nodeId}`)
    // For now, we'll just use the mock data
  }

  // Fetch metrics for the selected node on component mount and when node changes
  useEffect(() => {
    fetchNodeMetrics(selectedNode)

    // Set up interval to refresh metrics (every 30 seconds)
    const interval = setInterval(() => fetchNodeMetrics(selectedNode), 30000)

    // Clean up interval on component unmount or when node changes
    return () => clearInterval(interval)
  }, [selectedNode])

  return (
    <section>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <h2 className="text-xl font-semibold text-cyan-400">System Metrics</h2>
          <div className="relative ml-4">
            <button
              onClick={() => setShowNodeSelector(!showNodeSelector)}
              className="flex items-center bg-cyan-950/30 hover:bg-cyan-950/50 text-cyan-400 px-3 py-1 rounded-md text-sm transition-colors"
            >
              <Server className="h-4 w-4 mr-2" />
              {availableNodes.find((node) => node.id === selectedNode)?.name || "Select Node"}
              <ChevronDown className="h-4 w-4 ml-2" />
            </button>

            {showNodeSelector && (
              <div className="absolute z-10 mt-1 w-56 bg-black border border-cyan-950 rounded-md shadow-lg">
                <ul className="py-1">
                  {availableNodes.map((node) => (
                    <li key={node.id}>
                      <button
                        onClick={() => {
                          setSelectedNode(node.id)
                          setShowNodeSelector(false)
                        }}
                        className={`flex items-center w-full px-4 py-2 text-sm text-left hover:bg-cyan-950/50 ${selectedNode === node.id ? "bg-cyan-950/30 text-cyan-400" : "text-gray-300"
                          }`}
                      >
                        <Server className="h-4 w-4 mr-2" />
                        <div>
                          <div>{node.name}</div>
                          <div className="text-xs text-gray-500">{node.type}</div>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
        <a
          href="/grafana"
          target="_blank"
          className="flex items-center text-sm text-cyan-400 hover:text-pink-400 transition-colors relative group"
          rel="noreferrer"
        >
          <span className="absolute inset-0 rounded-md bg-pink-500/0 group-hover:bg-pink-500/10 group-hover:shadow-[0_0_8px_2px_rgba(236,72,153,0.3)] transition-all duration-300"></span>
          Open Grafana <ExternalLink className="ml-1 h-4 w-4 group-hover:text-pink-400" />
        </a>
      </div>

      <div className="metrics-grid">
        <MetricCard title="CPU Usage" value={metrics.cpu} icon={Cpu} color="cyan" delay={0.1} />
        <MetricCard title="Memory Usage" value={metrics.memory} icon={Memory} color="fuchsia" delay={0.2} />
        <MetricCard title="Disk Usage" value={metrics.disk} icon={HardDrive} color="emerald" delay={0.3} />
        <MetricCard
          title="Containers"
          value={metrics.containers.active}
          max={metrics.containers.total}
          icon={Boxes}
          color="violet"
          delay={0.4}
        />
      </div>

      {/* Node status indicator */}
      <div className="mt-4 flex justify-end">
        <div
          className={`flex items-center px-3 py-1 rounded-full text-xs ${metrics.status === "healthy"
            ? "bg-emerald-950/30 text-emerald-400"
            : metrics.status === "warning"
              ? "bg-yellow-950/30 text-yellow-400"
              : "bg-red-950/30 text-red-400"
            }`}
        >
          <div
            className={`w-2 h-2 rounded-full mr-2 ${metrics.status === "healthy"
              ? "bg-emerald-400"
              : metrics.status === "warning"
                ? "bg-yellow-400"
                : "bg-red-400"
              }`}
          ></div>
          {metrics.status === "healthy" ? "Node Healthy" : metrics.status === "warning" ? "Node Warning" : "Node Error"}
        </div>
      </div>
    </section>
  )
}

interface MetricCardProps {
  title: string
  value: number
  max?: number
  icon: React.ElementType
  color: "cyan" | "fuchsia" | "emerald" | "violet"
  delay: number
}

function MetricCard({ title, value, max, icon: Icon, color, delay }: MetricCardProps) {
  const percentage = max ? (value / max) * 100 : value

  const iconColorMap = {
    cyan: "text-cyan-500",
    fuchsia: "text-pink-500",
    emerald: "text-emerald-500",
    violet: "text-violet-500",
  }

  return (
    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay, duration: 0.4 }}>
      <div className="metric-card hover-card-glow">
        <div className="flex justify-between items-center mb-4">
          <h3 className="metric-title card-title">{title}</h3>
          <Icon className={`h-5 w-5 ${iconColorMap[color]} card-icon`} />
        </div>

        <div className="flex items-end">
          <span className="metric-value">{max ? `${value}/${max}` : `${value}%`}</span>
        </div>

        {!max && (
          <div className="metric-progress">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ delay: delay + 0.2, duration: 0.8 }}
              className={`metric-progress-bar ${color}`}
            />
          </div>
        )}
      </div>
    </motion.div>
  )
}

