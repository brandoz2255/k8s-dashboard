"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sidebar } from "@/components/sidebar"
import {
  Database,
  Shield,
  Lock,
  Server,
  Play,
  Square,
  RotateCw,
  Clock,
  Terminal,
  Download,
  Trash2,
  Archive,
  RefreshCw,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronRight,
  Maximize2,
  Filter,
  Search,
  PlusCircle,
  Zap,
  Clipboard,
  Eye,
  Boxes,
  Send,
  Info,
  Layers,
  Bot,
  User,
  Settings,
  AlertTriangle,
  Cpu,
  HardDrive,
  MemoryStickIcon as Memory,
  Network,
  Cloud,
  HardDriveDownload,
  Plus,
} from "lucide-react"

// Container type definition
interface Container {
  id: string
  name: string
  description: string
  icon: React.ElementType
  status: "running" | "stopped" | "restarting" | "exited" | "created"
  image: string
  created: string
  ports: string[]
  cpu: number
  memory: number
  storage: number
  url: string
}

// Chat message type definition
interface ChatMessage {
  id: string
  sender: "user" | "bot"
  content: string
  timestamp: string
  code?: string
  status?: "success" | "error" | "info"
}

// Node resource allocation type
interface NodeResources {
  id: string
  name: string
  cpu: {
    total: number
    allocated: number
    available: number
  }
  memory: {
    total: number
    allocated: number
    available: number
  }
  storage: {
    total: number
    allocated: number
    available: number
  }
}

// Mock data - would be fetched from your Go API
const containers: Container[] = [
  {
    id: "grafana",
    name: "Grafana",
    description: "Monitoring and observability platform",
    icon: Database,
    status: "running",
    image: "grafana/grafana:latest",
    created: "2023-04-15T10:30:00Z",
    ports: ["3000:3000"],
    cpu: 2.4,
    memory: 256,
    storage: 512,
    url: "http://localhost:3000/grafana",
  },
  {
    id: "wireguard",
    name: "Wireguard",
    description: "VPN server for secure connections",
    icon: Shield,
    status: "running",
    image: "linuxserver/wireguard:latest",
    created: "2023-04-15T10:35:00Z",
    ports: ["51820:51820/udp"],
    cpu: 1.2,
    memory: 128,
    storage: 256,
    url: "http://localhost:3000/wireguard",
  },
  {
    id: "bitwarden",
    name: "Bitwarden",
    description: "Password manager",
    icon: Lock,
    status: "running",
    image: "vaultwarden/server:latest",
    created: "2023-04-15T10:40:00Z",
    ports: ["8080:80"],
    cpu: 1.8,
    memory: 192,
    storage: 384,
    url: "http://localhost:3000/bitwarden",
  },
  {
    id: "minecraft",
    name: "Minecraft Server",
    description: "Game server",
    icon: Server,
    status: "stopped",
    image: "itzg/minecraft-server:latest",
    created: "2023-04-15T10:45:00Z",
    ports: ["25565:25565"],
    cpu: 0,
    memory: 0,
    storage: 2048,
    url: "http://localhost:3000/minecraft",
  },
  {
    id: "postgres",
    name: "PostgreSQL",
    description: "Database server",
    icon: Database,
    status: "exited",
    image: "postgres:14-alpine",
    created: "2023-04-16T08:30:00Z",
    ports: ["5432:5432"],
    cpu: 0,
    memory: 0,
    storage: 1024,
    url: "",
  },
  {
    id: "redis",
    name: "Redis",
    description: "In-memory data store",
    icon: Database,
    status: "created",
    image: "redis:alpine",
    created: "2023-04-16T09:15:00Z",
    ports: ["6379:6379"],
    cpu: 0,
    memory: 0,
    storage: 128,
    url: "",
  },
]

// Mock data for node resources
const nodeResourcesData: NodeResources[] = [
  {
    id: "master-node",
    name: "Master Node",
    cpu: {
      total: 16,
      allocated: 8,
      available: 8,
    },
    memory: {
      total: 64,
      allocated: 32,
      available: 32,
    },
    storage: {
      total: 1024,
      allocated: 512,
      available: 512,
    },
  },
  {
    id: "worker-node-1",
    name: "Worker Node 1",
    cpu: {
      total: 32,
      allocated: 24,
      available: 8,
    },
    memory: {
      total: 128,
      allocated: 96,
      available: 32,
    },
    storage: {
      total: 2048,
      allocated: 1536,
      available: 512,
    },
  },
  {
    id: "worker-node-2",
    name: "Worker Node 2",
    cpu: {
      total: 32,
      allocated: 16,
      available: 16,
    },
    memory: {
      total: 128,
      allocated: 64,
      available: 64,
    },
    storage: {
      total: 2048,
      allocated: 1024,
      available: 1024,
    },
  },
]

// Predefined system scripts/macros
const systemScripts = [
  {
    id: "restart-all",
    name: "Restart All Containers",
    description: "Restart all running containers",
    icon: RefreshCw,
    category: "system",
  },
  {
    id: "update-images",
    name: "Update All Images",
    description: "Pull latest versions of all container images",
    icon: Download,
    category: "system",
  },
  {
    id: "backup-volumes",
    name: "Backup All Volumes",
    description: "Create backups of all container volumes",
    icon: Archive,
    category: "system",
  },
  {
    id: "prune-system",
    name: "Prune System",
    description: "Remove unused containers, networks, and images",
    icon: Trash2,
    category: "system",
  },
  {
    id: "start-web-stack",
    name: "Start Web Stack",
    description: "Start all web-related containers",
    icon: Play,
    category: "group",
  },
  {
    id: "stop-web-stack",
    name: "Stop Web Stack",
    description: "Stop all web-related containers",
    icon: Square,
    category: "group",
  },
  {
    id: "start-db-stack",
    name: "Start Database Stack",
    description: "Start all database-related containers",
    icon: Play,
    category: "group",
  },
  {
    id: "stop-db-stack",
    name: "Stop Database Stack",
    description: "Stop all database-related containers",
    icon: Square,
    category: "group",
  },
]

// Kubernetes components for installation
const k8sComponents = [
  {
    id: "calico",
    name: "Calico",
    description: "Network policy engine for Kubernetes",
    type: "cni",
    installed: true,
    icon: Network,
  },
  {
    id: "flannel",
    name: "Flannel",
    description: "Simple overlay network for Kubernetes",
    type: "cni",
    installed: false,
    icon: Network,
  },
  {
    id: "weave",
    name: "Weave Net",
    description: "Networking for container-based applications",
    type: "cni",
    installed: false,
    icon: Network,
  },
  {
    id: "longhorn",
    name: "Longhorn",
    description: "Distributed block storage system for Kubernetes",
    type: "storage",
    installed: true,
    icon: HardDrive,
  },
  {
    id: "rook-ceph",
    name: "Rook-Ceph",
    description: "Storage orchestration for Kubernetes",
    type: "storage",
    installed: false,
    icon: HardDrive,
  },
  {
    id: "openebs",
    name: "OpenEBS",
    description: "Container attached storage for Kubernetes",
    type: "storage",
    installed: false,
    icon: HardDrive,
  },
  {
    id: "metallb",
    name: "MetalLB",
    description: "Load-balancer implementation for bare metal Kubernetes clusters",
    type: "controller",
    installed: true,
    icon: Cloud,
  },
  {
    id: "ingress-nginx",
    name: "NGINX Ingress",
    description: "Ingress controller for Kubernetes using NGINX",
    type: "controller",
    installed: true,
    icon: Cloud,
  },
  {
    id: "cert-manager",
    name: "Cert Manager",
    description: "Certificate management for Kubernetes",
    type: "controller",
    installed: false,
    icon: Shield,
  },
]

// Initial chat messages
const initialChatMessages: ChatMessage[] = [
  {
    id: "1",
    sender: "bot",
    content: "Hello! I'm Mr Docker, your container management assistant. How can I help you today?",
    timestamp: "10:30 AM",
  },
  {
    id: "2",
    sender: "user",
    content: "I need to restart the Grafana container. Can you help me with that?",
    timestamp: "10:31 AM",
  },
  {
    id: "3",
    sender: "bot",
    content: "To restart the Grafana container, you can use the following command:",
    timestamp: "10:32 AM",
    code: "docker restart grafana",
  },
  {
    id: "4",
    sender: "bot",
    content:
      "Or you can use the restart button directly from the Containers dashboard. Would you like me to restart it for you now?",
    timestamp: "10:32 AM",
  },
  {
    id: "5",
    sender: "user",
    content: "Yes, please restart the Grafana container for me.",
    timestamp: "10:33 AM",
  },
  {
    id: "6",
    sender: "bot",
    content: "I've sent the restart command for the Grafana container.",
    timestamp: "10:34 AM",
    code: "$ docker restart grafana\ngrafana\nContainer restarted successfully",
    status: "success",
  },
  {
    id: "7",
    sender: "bot",
    content: "The Grafana container has been restarted successfully. It should be up and running in a few seconds.",
    timestamp: "10:34 AM",
  },
]

// TabButton component
interface TabButtonProps {
  active: boolean
  onClick: () => void
  icon: React.ElementType
  label: string
}

const TabButton: React.FC<TabButtonProps> = ({ active, onClick, icon: Icon, label }) => (
  <button
    className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${active ? "bg-cyan-900 text-cyan-200" : "hover:bg-cyan-950 text-gray-400"
      }`}
    onClick={onClick}
  >
    <Icon className="h-4 w-4" />
    <span>{label}</span>
  </button>
)

interface ContainerRowProps {
  container: Container
  index: number
  selected: boolean
  onSelect: () => void
  onAction: (action: string) => void
}

const ContainerRow: React.FC<ContainerRowProps> = ({ container, index, selected, onSelect, onAction }) => {
  const statusColor =
    container.status === "running"
      ? "text-emerald-500"
      : container.status === "stopped"
        ? "text-red-500"
        : container.status === "restarting"
          ? "text-yellow-500"
          : "text-gray-500"

  return (
    <motion.tr
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className={`transition-colors ${index % 2 === 0 ? "bg-cyan-950/5" : ""
        } ${selected ? "bg-cyan-900" : "hover:bg-cyan-950/20"}`}
    >
      <td className="p-3 text-sm text-gray-300 font-medium">
        <div className="flex items-center">
          <container.icon className="h-5 w-5 mr-2 text-cyan-400" />
          {container.name}
        </div>
      </td>
      <td className={`p-3 text-sm ${statusColor} font-medium`}>{container.status}</td>
      <td className="p-3 text-sm text-gray-400">{container.image}</td>
      <td className="p-3 text-sm text-gray-500">{container.created}</td>
      <td className="p-3 text-sm text-gray-400">{container.ports.join(", ")}</td>
      <td className="p-3 text-sm text-gray-400">
        CPU: {container.cpu.toFixed(1)}%, Memory: {container.memory}MB, Storage: {container.storage}MB
      </td>
      <td className="p-3">
        <div className="flex space-x-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={onSelect}
            className="bg-cyan-950 hover:bg-cyan-900 text-cyan-400 px-2 py-1 rounded text-xs transition-colors"
          >
            <Maximize2 className="h-3 w-3" />
          </motion.button>
          {selected && (
            <AnimatePresence>
              <motion.div
                key="action-buttons"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex space-x-2"
              >
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onAction("logs")}
                  className="bg-cyan-950 hover:bg-cyan-900 text-cyan-400 px-2 py-1 rounded text-xs transition-colors"
                >
                  <Clock className="h-3 w-3" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onAction("exec")}
                  className="bg-cyan-950 hover:bg-cyan-900 text-cyan-400 px-2 py-1 rounded text-xs transition-colors"
                >
                  <Terminal className="h-3 w-3" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onAction("inspect")}
                  className="bg-cyan-950 hover:bg-cyan-900 text-cyan-400 px-2 py-1 rounded text-xs transition-colors"
                >
                  <Eye className="h-3 w-3" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onAction("rebuild")}
                  className="bg-cyan-950 hover:bg-cyan-900 text-cyan-400 px-2 py-1 rounded text-xs transition-colors"
                >
                  <RefreshCw className="h-3 w-3" />
                </motion.button>
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </td>
    </motion.tr>
  )
}

interface CommandCardProps {
  title: string
  description: string
  icon: React.ElementType
  onExecute: () => void
}

const CommandCard: React.FC<CommandCardProps> = ({ title, description, icon: Icon, onExecute }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    whileHover={{ y: -5, transition: { duration: 0.2 } }}
    className="bg-black border border-cyan-950 rounded-lg overflow-hidden hover-card-glow transition-all"
  >
    <div className="p-3 flex items-start justify-between">
      <div className="flex items-center">
        <div className="bg-cyan-950/30 p-2 rounded-md mr-3">
          <Icon className="h-5 w-5 text-cyan-400" />
        </div>
        <div>
          <h3 className="text-sm font-medium text-cyan-400">{title}</h3>
          <p className="text-xs text-gray-400">{description}</p>
        </div>
      </div>
    </div>
    <div className="px-3 pb-3 flex justify-end items-center">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onExecute}
        className="bg-cyan-950 hover:bg-cyan-900 text-cyan-400 px-2 py-1 rounded text-xs flex items-center transition-colors"
      >
        <Zap className="h-3 w-3 mr-1" />
        Execute
      </motion.button>
    </div>
  </motion.div>
)

export default function ContainersPage() {
  // Add state for resource allocation
  const [selectedNodeResource, setSelectedNodeResource] = useState("node-1")
  const [cpuAllocation, setCpuAllocation] = useState(2) // Default 2 cores
  const [memoryAllocation, setMemoryAllocation] = useState(4) // Default 4GB
  const [diskAllocation, setDiskAllocation] = useState(20) // Default 20GB
  const [showNetworkingOptions, setShowNetworkingOptions] = useState(false)

  // Sample nodes - in production, you would fetch this from your API
  const nodes = [
    { id: "node-1", name: "Primary Node" },
    { id: "node-2", name: "Secondary Node" },
    { id: "node-3", name: "Backup Node" },
    { id: "node-4", name: "Edge Node" },
  ]

  // Sample networking options
  const networkingOptions = [
    { id: "calico", name: "Calico" },
    { id: "flannel", name: "Flannel" },
    { id: "cilium", name: "Cilium" },
    { id: "weave", name: "Weave Net" },
  ]

  // Sample storage provisioners
  const storageOptions = [
    { id: "local-path", name: "Local Path Provisioner" },
    { id: "nfs", name: "NFS Subdir External Provisioner" },
    { id: "ceph", name: "Ceph RBD" },
    { id: "longhorn", name: "Longhorn" },
  ]

  // Function to handle resource allocation
  const handleAllocateResources = () => {
    // In production, you would call your API to allocate resources
    // Example: POST /api/nodes/{selectedNode}/resources
    console.log("Allocating resources:", {
      node: selectedNodeResource,
      cpu: cpuAllocation,
      memory: memoryAllocation,
      disk: diskAllocation,
    })

    // Show success message or handle errors
    alert(
      `Resources allocated to ${selectedNodeResource}: ${cpuAllocation} CPU cores, ${memoryAllocation}GB RAM, ${diskAllocation}GB disk`,
    )

    /* 
    // Backend integration would look something like this:
    fetch(`/api/nodes/${selectedNode}/resources`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        cpu: cpuAllocation,
        memory: memoryAllocation,
        disk: diskAllocation
      }),
    })
    .then(response => response.json())
    .then(data => {
      // Handle success
    })
    .catch(error => {
      // Handle error
    });
    */
  }

  // Function to handle networking installation
  const handleInstallNetworking = (networkingOption, storageOption) => {
    // In production, you would call your API to install networking
    // Example: POST /api/nodes/{selectedNode}/networking
    console.log("Installing networking:", {
      node: selectedNodeResource,
      networking: networkingOption,
      storage: storageOption,
    })

    // Show success message or handle errors
    alert(`Installing ${networkingOption} networking and ${storageOption} storage on ${selectedNodeResource}`)

    /* 
    // Backend integration would look something like this:
    fetch(`/api/nodes/${selectedNode}/networking`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        networking: networkingOption,
        storage: storageOption
      }),
    })
    .then(response => response.json())
    .then(data => {
      // Handle success
    })
    .catch(error => {
      // Handle error
    });
    */
  }

  const [activeTab, setActiveTab] = useState<"k8sboard" | "terminal" | "ssh">("k8sboard")
  const [selectedContainer, setSelectedContainer] = useState<string | null>(null)
  const [expandedScriptResult, setExpandedScriptResult] = useState<string | null>(null)
  const [showContainerLogs, setShowContainerLogs] = useState(false)
  const [terminalOutput, setTerminalOutput] = useState<string[]>([
    "$ docker ps",
    "CONTAINER ID   IMAGE                    COMMAND                  CREATED          STATUS          PORTS                    NAMES",
    '3a2e5f7d8b9c   grafana/grafana:latest   "/run.sh"                10 hours ago     Up 10 hours     0.0.0.0:3000->3000/tcp   grafana',
    '1d2e3f4g5h6i   linuxserver/wireguard    "/init"                  10 hours ago     Up 10 hours     0.0.0.0:51820->51820/udp wireguard',
    '7j8k9l0m1n2o   vaultwarden/server       "/start.sh"              10 hours ago     Up 10 hours     0.0.0.0:8080->80/tcp     bitwarden',
    "$ _",
  ])
  const [scriptResults, setScriptResults] = useState<{ [key: string]: { status: string; logs: string[] } }>(
    systemScripts.reduce(
      (acc, script) => ({
        ...acc,
        [script.id]: {
          status: "idle", // idle, running, success, error
          logs: [],
        },
      }),
      {},
    ),
  )
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(initialChatMessages)
  const [newMessage, setNewMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)

  // State for resource allocation
  const [nodeResources, setNodeResources] = useState<NodeResources[]>(nodeResourcesData)
  const [selectedNode, setSelectedNode] = useState<string>("master-node")
  const [showResourceForm, setShowResourceForm] = useState(false)
  const [resourceAllocation, setResourceAllocation] = useState({
    cpu: 1,
    memory: 1,
    storage: 1,
  })

  // State for K8s components
  const [k8sComponentsList, setK8sComponentsList] = useState(k8sComponents)
  const [installInProgress, setInstallInProgress] = useState(false)
  const [installationLogs, setInstallationLogs] = useState<string[]>([])

  // Auto-scroll to bottom of chat when new messages arrive
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [chatMessages])

  // Function to run a system script (mock implementation)
  const runSystemScript = (scriptId: string) => {
    // Update script status to running
    setScriptResults((prev) => ({
      ...prev,
      [scriptId]: {
        ...prev[scriptId],
        status: "running",
        logs: ["Initializing script..."],
      },
    }))

    // Mock API call and response
    setTimeout(() => {
      // This would be replaced with actual API call
      /*
      API INTEGRATION POINT:
      
      const runScript = async (scriptId) => {
        try {
          // Start SSE connection for real-time logs
          const eventSource = new EventSource(`/api/scripts/${scriptId}/run`);
          
          eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setScriptResults(prev => ({
              ...prev,
              [scriptId]: {
                status: data.status,
                logs: [...prev[scriptId].logs, data.log]
              }
            }));
            
            if (data.status === 'success' || data.status === 'error') {
              eventSource.close();
            }
          };
          
          eventSource.onerror = () => {
            eventSource.close();
            setScriptResults(prev => ({
              ...prev[scriptId],
              status: "error",
              logs: [...prev[scriptId].logs, "Connection error"]
            }));
          };
        } catch (error) {
          console.error("Error running script:", error);
          setScriptResults(prev => ({
            ...prev[scriptId],
            status: "error",
            logs: [...prev[scriptId].logs, "Error: " + error.message]
          }));
        }
      };
      */

      // Mock successful execution
      const mockLogs = {
        "restart-all": [
          "Restarting container: grafana...",
          "Container grafana restarted successfully",
          "Restarting container: wireguard...",
          "Container wireguard restarted successfully",
          "Restarting container: bitwarden...",
          "Container bitwarden restarted successfully",
          "All containers restarted successfully",
        ],
        "update-images": [
          "Pulling latest image for: grafana/grafana",
          "grafana/grafana:latest - Image up to date",
          "Pulling latest image for: linuxserver/wireguard",
          "linuxserver/wireguard:latest - Downloaded newer image",
          "Pulling latest image for: vaultwarden/server",
          "vaultwarden/server:latest - Image up to date",
          "All images updated successfully",
        ],
        "backup-volumes": [
          "Creating backup directory...",
          "Backing up volume: grafana-data",
          "Backup completed: grafana-data.tar.gz",
          "Backing up volume: wireguard-data",
          "Backup completed: wireguard-data.tar.gz",
          "Backing up volume: bitwarden-data",
          "Backup completed: bitwarden-data.tar.gz",
          "All volumes backed up successfully",
        ],
        "prune-system": [
          "Removing unused containers...",
          "Removed 3 containers",
          "Removing unused networks...",
          "Removed 1 network",
          "Removing unused images...",
          "Removed 5 images",
          "System pruned successfully",
        ],
        "start-web-stack": [
          "Starting container: grafana...",
          "Container grafana started",
          "Starting container: bitwarden...",
          "Container bitwarden started",
          "Web stack started successfully",
        ],
        "stop-web-stack": [
          "Stopping container: grafana...",
          "Container grafana stopped",
          "Stopping container: bitwarden...",
          "Container bitwarden stopped",
          "Web stack stopped successfully",
        ],
        "start-db-stack": [
          "Starting container: postgres...",
          "Container postgres started",
          "Starting container: redis...",
          "Container redis started",
          "Database stack started successfully",
        ],
        "stop-db-stack": [
          "Stopping container: postgres...",
          "Container postgres stopped",
          "Stopping container: redis...",
          "Container redis stopped",
          "Database stack stopped successfully",
        ],
      }

      setScriptResults((prev) => ({
        ...prev,
        [scriptId]: {
          status: "success",
          logs: mockLogs[scriptId as keyof typeof mockLogs] || ["Script executed successfully"],
        },
      }))

      // Expand the result automatically
      setExpandedScriptResult(scriptId)
    }, 2000)
  }

  // Function to execute container action (mock implementation)
  const executeContainerAction = (containerId: string, action: string) => {
    // This would be replaced with actual API call
    /*
    API INTEGRATION POINT:
    
    const executeAction = async (containerId, action) => {
      try {
        const response = await fetch(`/api/containers/${containerId}/${action}`, {
          method: 'POST'
        });
        
        if (!response.ok) {
          throw new Error(`Failed to execute ${action} on container ${containerId}`);
        }
        
        // Handle response based on action
        if (action === 'logs') {
          const logs = await response.text();
          setTerminalOutput(logs.split('\n'));
          setActiveTab('terminal');
        } else if (action === 'exec') {
          // Redirect to terminal with exec session
          setActiveTab('terminal');
          // Setup WebSocket connection for interactive terminal
          setupTerminalWebSocket(containerId);
        } else {
          // For other actions, just refresh container list
          fetchContainers();
        }
      } catch (error) {
        console.error(`Error executing ${action}:`, error);
        // Show error notification
      }
    };
    */

    // Mock implementation
    console.log(`Executing ${action} on container ${containerId}`)

    // Update UI based on action
    if (action === "logs") {
      setTerminalOutput([
        `$ docker logs ${containerId}`,
        `[2023-04-15 10:30:00] Starting ${containerId} container...`,
        `[2023-04-15 10:30:05] ${containerId} initialized`,
        `[2023-04-15 10:30:10] ${containerId} ready to accept connections`,
        `[2023-04-15 11:15:20] Client connected from 192.168.1.105`,
        `[2023-04-15 12:45:33] Processing request: GET /api/v1/dashboard`,
        `[2023-04-15 13:22:17] Memory usage: 256MB`,
        `[2023-04-15 14:10:05] CPU usage spike detected: 75%`,
        `[2023-04-15 14:10:15] CPU usage normalized: 25%`,
        `[2023-04-15 15:30:00] Scheduled backup completed successfully`,
        `$ _`,
      ])
      // Show logs in dashboard instead of switching to terminal tab
      setSelectedContainer(containerId)
      setShowContainerLogs(true)
    } else if (action === "exec") {
      setTerminalOutput([
        `$ docker exec -it ${containerId} /bin/bash`,
        `root@${containerId}:/# ls -la`,
        `total 72`,
        `drwxr-xr-x   1 root root 4096 Apr 15 10:30 .`,
        `drwxr-xr-x   1 root root 4096 Apr 15 10:30 ..`,
        `drwxr-xr-x   2 root root 4096 Apr 15 10:30 bin`,
        `drwxr-xr-x   2 root root 4096 Apr 15 10:30 etc`,
        `drwxr-xr-x   2 root root 4096 Apr 15 10:30 lib`,
        `drwxr-xr-x   2 root root 4096 Apr 15 10:30 usr`,
        `drwxr-xr-x   2 root root 4096 Apr 15 10:30 var`,
        `root@${containerId}:/# _`,
      ])
      setActiveTab("terminal")
    } else if (action === "inspect") {
      setTerminalOutput([
        `$ docker inspect ${containerId}`,
        `[`,
        `    {`,
        `        "Id": "3a2e5f7d8b9c...",`,
        `        "Created": "2023-04-15T10:30:00Z",`,
        `        "Path": "/run.sh",`,
        `        "Args": [],`,
        `        "State": {`,
        `            "Status": "running",`,
        `            "Running": true,`,
        `            "Paused": false,`,
        `            "Restarting": false`,
        `        },`,
        `        "Image": "grafana/grafana:latest",`,
        `        "NetworkSettings": {`,
        `            "Ports": {`,
        `                "3000/tcp": [`,
        `                    {`,
        `                        "HostIp": "0.0.0.0",`,
        `                        "HostPort": "3000"`,
        `                    }`,
        `                ]`,
        `            },`,
        `        },`,
        `        "Mounts": [`,
        `            {`,
        `                "Type": "volume",`,
        `                "Name": "grafana-data",`,
        `                "Source": "/var/lib/docker/volumes/grafana-data/_data",`,
        `                "Destination": "/var/lib/grafana"`,
        `            }`,
        `        ]`,
        `    }`,
        `]`,
        `$ _`,
      ])
      setActiveTab("terminal")
    } else if (action === "rebuild") {
      setTerminalOutput([
        `$ docker-compose up -d --no-deps --build ${containerId}`,
        `Rebuilding ${containerId}...`,
        `Step 1/10 : FROM grafana/grafana:latest`,
        `latest: Pulling from grafana/grafana`,
        `Digest: sha256:a1b2c3d4e5f6...`,
        `Status: Downloaded newer image for grafana/grafana:latest`,
        `Step 2/10 : COPY ./config/grafana.ini /etc/grafana/grafana.ini`,
        `Step 3/10 : COPY ./dashboards /var/lib/grafana/dashboards`,
        `Step 4/10 : COPY ./provisioning /etc/grafana/provisioning`,
        `Step 5/10 : ENV GF_SECURITY_ADMIN_PASSWORD=admin`,
        `Step 6/10 : ENV GF_USERS_ALLOW_SIGN_UP=false`,
        `Step 7/10 : EXPOSE 3000`,
        `Step 8/10 : VOLUME /var/lib/grafana`,
        `Step 9/10 : USER grafana`,
        `Step 10/10 : ENTRYPOINT ["/run.sh"]`,
        `Successfully rebuilt ${containerId}`,
        `Starting ${containerId}...`,
        `${containerId} started successfully`,
        `$ _`,
      ])
      setActiveTab("terminal")
    }
  }

  // Function to handle sending a new chat message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    // Add user message
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      content: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }

    setChatMessages((prev) => [...prev, userMessage])
    setNewMessage("")

    // Simulate bot typing
    setIsTyping(true)

    // Simulate bot response after a delay
    setTimeout(() => {
      setIsTyping(false)

      // Generate a mock response based on the user's message
      let botResponse: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: "bot",
        content: "I'm processing your request...",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }

      // Simple keyword matching for demo purposes
      const lowerCaseMessage = newMessage.toLowerCase()

      if (lowerCaseMessage.includes("restart") && lowerCaseMessage.includes("container")) {
        const containerName = lowerCaseMessage.includes("grafana")
          ? "grafana"
          : lowerCaseMessage.includes("wireguard")
            ? "wireguard"
            : lowerCaseMessage.includes("bitwarden")
              ? "bitwarden"
              : "container"

        botResponse = {
          id: `bot-${Date.now()}`,
          sender: "bot",
          content: `I'll restart the ${containerName} container for you.`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        }

        setChatMessages((prev) => [...prev, botResponse])

        // Add a follow-up message with the command execution
        setTimeout(() => {
          const executionMessage: ChatMessage = {
            id: `bot-${Date.now() + 1}`,
            sender: "bot",
            content: `The ${containerName} container has been restarted successfully.`,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            code: `$ docker restart ${containerName}\n${containerName}\nContainer restarted successfully`,
            status: "success",
          }

          setChatMessages((prev) => [...prev, executionMessage])
        }, 1000)
      } else if (lowerCaseMessage.includes("list") && lowerCaseMessage.includes("container")) {
        botResponse = {
          id: `bot-${Date.now()}`,
          sender: "bot",
          content: "Here's a list of all containers:",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          code: '$ docker ps -a\nCONTAINER ID   IMAGE                    COMMAND                  CREATED          STATUS          PORTS                    NAMES\n3a2e5f7d8b9c   grafana/grafana:latest   "/run.sh"                10 hours ago     Up 10 hours     0.0.0.0:3000->3000/tcp   grafana\n1d2e3f4g5h6i   linuxserver/wireguard    "/init"                  10 hours ago     Up 10 hours     0.0.0.0:51820->51820/udp wireguard\n7j8k9l0m1n2o   vaultwarden/server       "/start.sh"              10 hours ago     Up 10 hours     0.0.0.0:8080->80/tcp     bitwarden',
        }

        setChatMessages((prev) => [...prev, botResponse])
      } else if (lowerCaseMessage.includes("help")) {
        botResponse = {
          id: `bot-${Date.now()}`,
          sender: "bot",
          content: "Here are some things you can ask me to do:",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        }

        setChatMessages((prev) => [...prev, botResponse])

        setTimeout(() => {
          const helpList: ChatMessage = {
            id: `bot-${Date.now() + 1}`,
            sender: "bot",
            content:
              "• List containers\n• Restart a container\n• Show container logs\n• Inspect a container\n• Pull new images\n• Prune unused resources\n• Start/stop container groups",
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          }

          setChatMessages((prev) => [...prev, helpList])
        }, 800)
      } else {
        botResponse = {
          id: `bot-${Date.now()}`,
          sender: "bot",
          content:
            "I'm not sure how to help with that specific request. Would you like me to show you a list of available containers or common commands?",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        }

        setChatMessages((prev) => [...prev, botResponse])
      }
    }, 1500)
  }

  // Function to allocate resources to a node
  const allocateResources = () => {
    // This would be replaced with actual API call
    /*
    API INTEGRATION POINT:
    
    const allocateNodeResources = async () => {
      try {
        const response = await fetch(`/api/nodes/${selectedNode}/resources`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            cpu: resourceAllocation.cpu,
            memory: resourceAllocation.memory,
            storage: resourceAllocation.storage
          }),
        });
        
        if (!response.ok) {
          throw new Error(`Failed to allocate resources to node ${selectedNode}`);
        }
        
        const data = await response.json();
        
        // Update the node resources with the new allocation
        setNodeResources(prev => 
          prev.map(node => 
            node.id === selectedNode 
              ? {
                  ...node,
                  cpu: {
                    ...node.cpu,
                    allocated: node.cpu.allocated + resourceAllocation.cpu,
                    available: node.cpu.total - (node.cpu.allocated + resourceAllocation.cpu)
                  },
                  memory: {
                    ...node.memory,
                    allocated: node.memory.allocated + resourceAllocation.memory,
                    available: node.memory.total - (node.memory.allocated + resourceAllocation.memory)
                  },
                  storage: {
                    ...node.storage,
                    allocated: node.storage.allocated + resourceAllocation.storage,
                    available: node.storage.total - (node.storage.allocated + resourceAllocation.storage)
                  }
                }
              : node
          )
        );
        
        // Reset the form
        setResourceAllocation({
          cpu: 1,
          memory: 1,
          storage: 1
        });
        setShowResourceForm(false);
        
      } catch (error) {
        console.error('Error allocating resources:', error);
        // Show error notification
      }
    };
    */

    // Mock implementation
    setNodeResources((prev) =>
      prev.map((node) =>
        node.id === selectedNode
          ? {
            ...node,
            cpu: {
              ...node.cpu,
              allocated: node.cpu.allocated + resourceAllocation.cpu,
              available: node.cpu.total - (node.cpu.allocated + resourceAllocation.cpu),
            },
            memory: {
              ...node.memory,
              allocated: node.memory.allocated + resourceAllocation.memory,
              available: node.memory.total - (node.memory.allocated + resourceAllocation.memory),
            },
            storage: {
              ...node.storage,
              allocated: node.storage.allocated + resourceAllocation.storage,
              available: node.storage.total - (node.storage.allocated + resourceAllocation.storage),
            },
          }
          : node,
      ),
    )

    // Reset the form
    setResourceAllocation({
      cpu: 1,
      memory: 1,
      storage: 1,
    })
    setShowResourceForm(false)
  }

  // Function to install K8s component
  const installComponent = (componentId: string) => {
    // This would be replaced with actual API call
    /*
    API INTEGRATION POINT:
    
    const installK8sComponent = async (componentId) => {
      try {
        setInstallInProgress(true);
        
        // Start SSE connection for real-time installation logs
        const eventSource = new EventSource(`/api/k8s/components/${componentId}/install`);
        
        eventSource.onmessage = (event) => {
          const data = JSON.parse(event.data);
          
          setInstallationLogs(prev => [...prev, data.log]);
          
          if (data.status === 'completed') {
            // Update the component status
            setK8sComponentsList(prev => 
              prev.map(comp => 
                comp.id === componentId 
                  ? { ...comp, installed: true }
                  : comp
              )
            );
            
            eventSource.close();
            setInstallInProgress(false);
          }
        };
        
        eventSource.onerror = () => {
          eventSource.close();
          setInstallationLogs(prev => [...prev, "Installation failed. Check logs for details."]);
          setInstallInProgress(false);
        };
        
      } catch (error) {
        console.error('Error installing component:', error);
        setInstallationLogs(prev => [...prev, `Error: ${error.message}`]);
        setInstallInProgress(false);
      }
    };
    */

    // Mock implementation
    setInstallInProgress(true)
    setInstallationLogs([`Starting installation of ${componentId}...`])

    // Simulate installation process
    const mockInstallationSteps = [
      `Checking dependencies...`,
      `Downloading ${componentId} manifests...`,
      `Creating Kubernetes resources...`,
      `Waiting for pods to be ready...`,
      `Configuring ${componentId}...`,
      `Installation completed successfully!`,
    ]

    let stepIndex = 0

    const installInterval = setInterval(() => {
      if (stepIndex < mockInstallationSteps.length) {
        setInstallationLogs((prev) => [...prev, mockInstallationSteps[stepIndex]])
        stepIndex++
      } else {
        clearInterval(installInterval)

        // Update the component status
        setK8sComponentsList((prev) =>
          prev.map((comp) => (comp.id === componentId ? { ...comp, installed: true } : comp)),
        )

        setInstallInProgress(false)
      }
    }, 1000)
  }

  return (
    <div className="flex h-screen bg-black text-foreground overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-hidden flex flex-col">
        {/* Tabs */}
        <div className="bg-black border-b border-cyan-950 px-6 py-2">
          <div className="flex space-x-1">
            <TabButton
              active={activeTab === "k8sboard"}
              onClick={() => setActiveTab("k8sboard")}
              icon={Boxes}
              label="K8s Board"
            />
            <TabButton
              active={activeTab === "terminal"}
              onClick={() => setActiveTab("terminal")}
              icon={Terminal}
              label="Terminal"
            />
            <TabButton active={activeTab === "ssh"} onClick={() => setActiveTab("ssh")} icon={Server} label="SSH" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {activeTab === "k8sboard" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="max-w-7xl mx-auto space-y-8"
            >
              {/* Resource Allocation Panel */}
              <div className="bg-black border border-cyan-950 rounded-lg overflow-hidden">
                <div className="p-4 border-b border-cyan-950 flex justify-between items-center">
                  <h2 className="text-lg font-medium text-cyan-400">Node Resource Allocation</h2>
                  <div className="flex space-x-2">
                    <select
                      value={selectedNode}
                      onChange={(e) => setSelectedNode(e.target.value)}
                      className="bg-cyan-950/20 border border-cyan-950 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500"
                    >
                      {nodeResources.map((node) => (
                        <option key={node.id} value={node.id}>
                          {node.name}
                        </option>
                      ))}
                    </select>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowResourceForm(!showResourceForm)}
                      className="bg-cyan-950 hover:bg-cyan-900 text-cyan-400 px-3 py-1 rounded text-sm flex items-center transition-colors"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Allocate Resources
                    </motion.button>
                  </div>
                </div>

                <div className="p-4">
                  {/* Resource metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    {/* CPU Resources */}
                    <div className="bg-black border border-cyan-950 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <Cpu className="h-5 w-5 text-cyan-400 mr-2" />
                        <h3 className="text-sm font-medium text-cyan-400">CPU Resources</h3>
                      </div>
                      <div className="flex justify-between mb-1">
                        <span className="text-xs text-gray-400">Total</span>
                        <span className="text-xs font-medium">
                          {nodeResources.find((n) => n.id === selectedNode)?.cpu.total} cores
                        </span>
                      </div>
                      <div className="flex justify-between mb-1">
                        <span className="text-xs text-gray-400">Allocated</span>
                        <span className="text-xs font-medium">
                          {nodeResources.find((n) => n.id === selectedNode)?.cpu.allocated} cores
                        </span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span className="text-xs text-gray-400">Available</span>
                        <span className="text-xs font-medium">
                          {nodeResources.find((n) => n.id === selectedNode)?.cpu.available} cores
                        </span>
                      </div>
                      <div className="h-2 bg-cyan-950/30 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-cyan-500 rounded-full"
                          style={{
                            width: `${((nodeResources.find((n) => n.id === selectedNode)?.cpu.allocated || 0) /
                              (nodeResources.find((n) => n.id === selectedNode)?.cpu.total || 1)) *
                              100
                              }%`,
                          }}
                        ></div>
                      </div>
                    </div>

                    {/* Memory Resources */}
                    <div className="bg-black border border-cyan-950 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <Memory className="h-5 w-5 text-pink-400 mr-2" />
                        <h3 className="text-sm font-medium text-pink-400">Memory Resources</h3>
                      </div>
                      <div className="flex justify-between mb-1">
                        <span className="text-xs text-gray-400">Total</span>
                        <span className="text-xs font-medium">
                          {nodeResources.find((n) => n.id === selectedNode)?.memory.total} GB
                        </span>
                      </div>
                      <div className="flex justify-between mb-1">
                        <span className="text-xs text-gray-400">Allocated</span>
                        <span className="text-xs font-medium">
                          {nodeResources.find((n) => n.id === selectedNode)?.memory.allocated} GB
                        </span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span className="text-xs text-gray-400">Available</span>
                        <span className="text-xs font-medium">
                          {nodeResources.find((n) => n.id === selectedNode)?.memory.available} GB
                        </span>
                      </div>
                      <div className="h-2 bg-pink-950/30 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-pink-500 rounded-full"
                          style={{
                            width: `${((nodeResources.find((n) => n.id === selectedNode)?.memory.allocated || 0) /
                              (nodeResources.find((n) => n.id === selectedNode)?.memory.total || 1)) *
                              100
                              }%`,
                          }}
                        ></div>
                      </div>
                    </div>

                    {/* Storage Resources */}
                    <div className="bg-black border border-cyan-950 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <HardDrive className="h-5 w-5 text-emerald-400 mr-2" />
                        <h3 className="text-sm font-medium text-emerald-400">Storage Resources</h3>
                      </div>
                      <div className="flex justify-between mb-1">
                        <span className="text-xs text-gray-400">Total</span>
                        <span className="text-xs font-medium">
                          {nodeResources.find((n) => n.id === selectedNode)?.storage.total} GB
                        </span>
                      </div>
                      <div className="flex justify-between mb-1">
                        <span className="text-xs text-gray-400">Allocated</span>
                        <span className="text-xs font-medium">
                          {nodeResources.find((n) => n.id === selectedNode)?.storage.allocated} GB
                        </span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span className="text-xs text-gray-400">Available</span>
                        <span className="text-xs font-medium">
                          {nodeResources.find((n) => n.id === selectedNode)?.storage.available} GB
                        </span>
                      </div>
                      <div className="h-2 bg-emerald-950/30 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full"
                          style={{
                            width: `${((nodeResources.find((n) => n.id === selectedNode)?.storage.allocated || 0) /
                              (nodeResources.find((n) => n.id === selectedNode)?.storage.total || 1)) *
                              100
                              }%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Resource allocation form */}
                  <AnimatePresence>
                    {showResourceForm && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-cyan-950/20 border border-cyan-950 rounded-lg p-4 mt-4"
                      >
                        <h3 className="text-sm font-medium text-cyan-400 mb-3">
                          Allocate Resources to {nodeResources.find((n) => n.id === selectedNode)?.name}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="text-xs text-gray-400 block mb-1">CPU Cores</label>
                            <div className="flex items-center">
                              <input
                                type="range"
                                min="1"
                                max={nodeResources.find((n) => n.id === selectedNode)?.cpu.available || 1}
                                value={resourceAllocation.cpu}
                                onChange={(e) =>
                                  setResourceAllocation({ ...resourceAllocation, cpu: Number.parseInt(e.target.value) })
                                }
                                className="flex-1 mr-2 accent-cyan-500"
                              />
                              <div className="w-12 text-center bg-cyan-950/30 text-cyan-400 text-xs px-2 py-1 rounded">
                                {resourceAllocation.cpu}
                              </div>
                            </div>
                          </div>
                          <div>
                            <label className="text-xs text-gray-400 block mb-1">Memory (GB)</label>
                            <div className="flex items-center">
                              <input
                                type="range"
                                min="1"
                                max={nodeResources.find((n) => n.id === selectedNode)?.memory.available || 1}
                                value={resourceAllocation.memory}
                                onChange={(e) =>
                                  setResourceAllocation({
                                    ...resourceAllocation,
                                    memory: Number.parseInt(e.target.value),
                                  })
                                }
                                className="flex-1 mr-2 accent-pink-500"
                              />
                              <div className="w-12 text-center bg-pink-950/30 text-pink-400 text-xs px-2 py-1 rounded">
                                {resourceAllocation.memory}
                              </div>
                            </div>
                          </div>
                          <div>
                            <label className="text-xs text-gray-400 block mb-1">Storage (GB)</label>
                            <div className="flex items-center">
                              <input
                                type="range"
                                min="1"
                                max={nodeResources.find((n) => n.id === selectedNode)?.storage.available || 1}
                                value={resourceAllocation.storage}
                                onChange={(e) =>
                                  setResourceAllocation({
                                    ...resourceAllocation,
                                    storage: Number.parseInt(e.target.value),
                                  })
                                }
                                className="flex-1 mr-2 accent-emerald-500"
                              />
                              <div className="w-12 text-center bg-emerald-950/30 text-emerald-400 text-xs px-2 py-1 rounded">
                                {resourceAllocation.storage}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-end mt-4 space-x-2">
                          <button
                            onClick={() => setShowResourceForm(false)}
                            className="bg-cyan-950/50 hover:bg-cyan-900 text-cyan-400 px-3 py-1 rounded text-sm transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={allocateResources}
                            className="bg-cyan-500 hover:bg-cyan-600 text-black px-3 py-1 rounded text-sm transition-colors"
                          >
                            Allocate
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* K8s Components Installation Panel */}
              <div className="bg-black border border-cyan-950 rounded-lg overflow-hidden">
                <div className="p-4 border-b border-cyan-950 flex justify-between items-center">
                  <h2 className="text-lg font-medium text-cyan-400">Kubernetes Components</h2>
                  <div className="flex items-center">
                    <span className="text-xs text-gray-400 mr-2">Filter:</span>
                    <select
                      className="bg-cyan-950/20 border border-cyan-950 rounded-md px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-cyan-500"
                      defaultValue="all"
                    >
                      <option value="all">All Components</option>
                      <option value="cni">Networking (CNI)</option>
                      <option value="storage">Storage Provisioners</option>
                      <option value="controller">Controllers</option>
                    </select>
                  </div>
                </div>

                <div className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {k8sComponentsList.map((component) => (
                      <div
                        key={component.id}
                        className="bg-black border border-cyan-950 rounded-lg p-4 hover-card-glow"
                      >
                        <div className="flex items-center mb-3">
                          <div className="bg-cyan-950/30 p-2 rounded-md mr-3">
                            <component.icon className="h-5 w-5 text-cyan-400 card-icon" />
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-cyan-400 card-title">{component.name}</h3>
                            <p className="text-xs text-gray-400">{component.description}</p>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${component.type === "cni"
                              ? "bg-cyan-950/30 text-cyan-400"
                              : component.type === "storage"
                                ? "bg-emerald-950/30 text-emerald-400"
                                : "bg-pink-950/30 text-pink-400"
                              }`}
                          >
                            {component.type === "cni"
                              ? "Networking"
                              : component.type === "storage"
                                ? "Storage"
                                : "Controller"}
                          </span>
                          {component.installed ? (
                            <span className="bg-emerald-950/30 text-emerald-400 text-xs px-2 py-1 rounded-full flex items-center">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Installed
                            </span>
                          ) : (
                            <button
                              onClick={() => installComponent(component.id)}
                              disabled={installInProgress}
                              className="bg-cyan-950 hover:bg-cyan-900 text-cyan-400 px-2 py-1 rounded text-xs flex items-center transition-colors disabled:opacity-50"
                            >
                              <HardDriveDownload className="h-3 w-3 mr-1" />
                              Install
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Installation logs */}
                  <AnimatePresence>
                    {installationLogs.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 bg-black border border-cyan-950 rounded-lg p-4"
                      >
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="text-sm font-medium text-cyan-400">Installation Logs</h3>
                          <button onClick={() => setInstallationLogs([])} className="text-gray-400 hover:text-cyan-400">
                            <XCircle className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="bg-cyan-950/20 p-3 rounded-md font-mono text-xs max-h-40 overflow-auto">
                          {installationLogs.map((log, index) => (
                            <div key={index} className="text-gray-300">
                              {log}
                            </div>
                          ))}
                          {installInProgress && <div className="text-cyan-400 animate-pulse">_</div>}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Quick Actions Panel */}
              <div className="bg-black border border-cyan-950 rounded-lg overflow-hidden">
                <div className="p-4 border-b border-cyan-950 flex justify-between items-center">
                  <h2 className="text-lg font-medium text-cyan-400">System Actions</h2>
                  <div className="flex space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-cyan-950 hover:bg-cyan-900 text-cyan-400 px-3 py-1 rounded text-sm flex items-center transition-colors"
                    >
                      <PlusCircle className="h-3 w-3 mr-1" />
                      New Script
                    </motion.button>
                  </div>
                </div>

                <div className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {systemScripts.map((script, index) => (
                      <motion.div
                        key={script.id}
                        className="space-y-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.05 }}
                      >
                        <div className="bg-black border border-cyan-950 rounded-lg overflow-hidden hover-card-glow transition-all">
                          <div className="p-3 flex items-start justify-between">
                            <div className="flex items-center">
                              <div className="bg-cyan-950/30 p-2 rounded-md mr-3">
                                <script.icon className="h-5 w-5 text-cyan-400" />
                              </div>
                              <div>
                                <h3 className="text-sm font-medium text-cyan-400">{script.name}</h3>
                                <p className="text-xs text-gray-400">{script.description}</p>
                              </div>
                            </div>
                          </div>

                          <div className="px-3 pb-3 flex justify-between items-center">
                            <span className="text-xs text-gray-500">
                              {script.category === "system" ? "System" : "Group"} Action
                            </span>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => runSystemScript(script.id)}
                              disabled={scriptResults[script.id].status === "running"}
                              className="bg-cyan-950 hover:bg-cyan-900 text-cyan-400 px-2 py-1 rounded text-xs flex items-center transition-colors disabled:opacity-50"
                            >
                              {scriptResults[script.id].status === "running" ? (
                                <>
                                  <RotateCw className="h-3 w-3 mr-1 animate-spin" />
                                  Running...
                                </>
                              ) : (
                                <>
                                  <Zap className="h-3 w-3 mr-1" />
                                  Run
                                </>
                              )}
                            </motion.button>
                          </div>

                          {/* Script Result Collapsible */}
                          {scriptResults[script.id].logs.length > 0 && (
                            <div className="border-t border-cyan-950">
                              <button
                                onClick={() =>
                                  setExpandedScriptResult(expandedScriptResult === script.id ? null : script.id)
                                }
                                className="w-full p-2 flex items-center justify-between text-xs text-gray-400 hover:bg-cyan-950/10"
                              >
                                <span className="flex items-center">
                                  {scriptResults[script.id].status === "running" && (
                                    <RotateCw className="h-3 w-3 mr-1 text-cyan-400 animate-spin" />
                                  )}
                                  {scriptResults[script.id].status === "success" && (
                                    <CheckCircle className="h-3 w-3 mr-1 text-emerald-500" />
                                  )}
                                  {scriptResults[script.id].status === "error" && (
                                    <XCircle className="h-3 w-3 mr-1 text-red-500" />
                                  )}
                                  {scriptResults[script.id].status === "running" ? "Running..." : "Result"}
                                </span>
                                {expandedScriptResult === script.id ? (
                                  <ChevronDown className="h-3 w-3" />
                                ) : (
                                  <ChevronRight className="h-3 w-3" />
                                )}
                              </button>

                              <AnimatePresence>
                                {expandedScriptResult === script.id && (
                                  <motion.div
                                    key={`script-result-${script.id}`}
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="bg-black border-t border-cyan-950 p-2 overflow-hidden"
                                  >
                                    <div className="bg-cyan-950/20 rounded-md p-2 font-mono text-xs max-h-32 overflow-auto">
                                      {scriptResults[script.id].logs.map((log, index) => (
                                        <div key={index} className="text-gray-400">
                                          {log}
                                        </div>
                                      ))}
                                      {scriptResults[script.id].status === "running" && (
                                        <div className="text-cyan-400 animate-pulse">_</div>
                                      )}
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Container Dashboard */}
              <div className="bg-black border border-cyan-950 rounded-lg overflow-hidden">
                <div className="p-4 border-b border-cyan-950 flex justify-between items-center">
                  <h2 className="text-lg font-medium text-cyan-400">Containers</h2>
                  <div className="flex space-x-2">
                    <div className="relative">
                      <Search className="h-4 w-4 absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500" />
                      <input
                        type="text"
                        placeholder="Search containers..."
                        className="bg-cyan-950/20 border border-cyan-950 rounded-md pl-8 pr-3 py-1 text-sm w-48 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                      />
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-cyan-950 hover:bg-cyan-900 text-cyan-400 px-3 py-1 rounded text-sm flex items-center transition-colors"
                    >
                      <Filter className="h-3 w-3 mr-1" />
                      Filter
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-cyan-950 hover:bg-cyan-900 text-cyan-400 px-3 py-1 rounded text-sm flex items-center transition-colors"
                    >
                      <RefreshCw className="h-3 w-3 mr-1" />
                      Refresh
                    </motion.button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-cyan-950/30 text-left">
                        <th className="p-3 text-xs font-medium text-cyan-400 uppercase tracking-wider">Name</th>
                        <th className="p-3 text-xs font-medium text-cyan-400 uppercase tracking-wider">Status</th>
                        <th className="p-3 text-xs font-medium text-cyan-400 uppercase tracking-wider">Image</th>
                        <th className="p-3 text-xs font-medium text-cyan-400 uppercase tracking-wider">Created</th>
                        <th className="p-3 text-xs font-medium text-cyan-400 uppercase tracking-wider">Ports</th>
                        <th className="p-3 text-xs font-medium text-cyan-400 uppercase tracking-wider">Resources</th>
                        <th className="p-3 text-xs font-medium text-cyan-400 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-cyan-950">
                      {containers.map((container, index) => (
                        <ContainerRow
                          key={container.id}
                          container={container}
                          index={index}
                          selected={selectedContainer === container.id}
                          onSelect={() =>
                            setSelectedContainer(selectedContainer === container.id ? null : container.id)
                          }
                          onAction={(action) => executeContainerAction(container.id, action)}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Real-time Container Logs Panel - Directly under containers table */}
              <div className="bg-black border border-cyan-950 rounded-lg overflow-hidden mt-4">
                <div className="p-4 border-b border-cyan-950 flex justify-between items-center">
                  <div className="flex items-center">
                    <h2 className="text-lg font-medium text-cyan-400">
                      {selectedContainer
                        ? `Container Logs: ${containers.find((c) => c.id === selectedContainer)?.name}`
                        : "Container Logs"}
                    </h2>
                    {selectedContainer && showContainerLogs && (
                      <motion.span
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="ml-2 bg-cyan-950/30 text-cyan-400 text-xs px-2 py-1 rounded"
                      >
                        Live
                      </motion.span>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-cyan-950 hover:bg-cyan-900 text-cyan-400 px-3 py-1 rounded text-sm flex items-center transition-colors"
                    >
                      <Clipboard className="h-3 w-3 mr-1" />
                      Copy
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-cyan-950 hover:bg-cyan-900 text-cyan-400 px-3 py-1 rounded text-sm flex items-center transition-colors"
                    >
                      <RefreshCw className="h-3 w-3 mr-1" />
                      Refresh
                    </motion.button>
                  </div>
                </div>

                <div className="p-4 bg-black h-64 overflow-auto">
                  {selectedContainer && showContainerLogs ? (
                    <div className="font-mono text-xs text-gray-300">
                      {/* This would be replaced with actual real-time logs */}
                      {/* 
                      API INTEGRATION POINT:
                      
                      const setupLogStream = (containerId) => {
                        // Close any existing connection
                        if (logEventSource) {
                          logEventSource.close();
                        }
                        
                        // Create a new SSE connection for real-time logs
                        const eventSource = new EventSource(`/api/containers/${containerId}/logs/stream`);
                        
                        eventSource.onmessage = (event) => {
                          const logLine = JSON.parse(event.data);
                          setContainerLogs(prev => [...prev, logLine]);
                          
                          // Auto-scroll to bottom
                          const logContainer = document.getElementById('log-container');
                          if (logContainer) {
                            logContainer.scrollTop = logContainer.scrollHeight;
                          }
                        };
                        
                        eventSource.onerror = (event) => {
                          console.error('Log stream connection error');
                          eventSource.close();
                        };
                        
                        setLogEventSource(eventSource);
                        
                        // Clean up on unmount
                        return () => {
                          eventSource.close();
                        };
                      };
                      */}
                      {terminalOutput.map((line, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.03 }}
                          className={
                            line.includes("Error") || line.includes("error")
                              ? "text-red-400"
                              : line.includes("Warning") || line.includes("warning")
                                ? "text-yellow-400"
                                : line.includes("Success") || line.includes("success") || line.includes("successfully")
                                  ? "text-emerald-400"
                                  : line.startsWith("$")
                                    ? "text-cyan-400"
                                    : "text-gray-300"
                          }
                        >
                          {line}
                        </motion.div>
                      ))}
                      <div className="text-cyan-400 animate-pulse">_</div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500">
                      <Terminal className="h-8 w-8 mb-2 opacity-30" />
                      <p className="text-sm">Select a container and click "Show logs" to view real-time logs</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
          {activeTab === "terminal" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="max-w-7xl mx-auto space-y-6"
            >
              {/* AI Chatbot Section */}
              <div className="bg-black border border-cyan-950 rounded-lg overflow-hidden h-[calc(100vh-24rem)]">
                <div className="p-4 border-b border-cyan-950 flex justify-between items-center">
                  <div className="flex items-center">
                    <Bot className="h-5 w-5 text-cyan-400 mr-2" />
                    <h2 className="text-lg font-medium text-cyan-400">Mr Docker AI Assistant</h2>
                    <motion.span
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="ml-2 bg-cyan-950/30 text-cyan-400 text-xs px-2 py-1 rounded"
                    >
                      Powered by Ollama
                    </motion.span>
                  </div>
                  <div className="flex space-x-2">
                    <select
                      className="bg-cyan-950/20 border border-cyan-950 rounded text-sm text-cyan-400 px-2 py-1"
                      defaultValue="mr-docker"
                    >
                      <option value="mr-docker">Mr Docker (Custom)</option>
                      <option value="llama3">Llama 3</option>
                      <option value="mistral">Mistral</option>
                      <option value="codellama">CodeLlama</option>
                    </select>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-cyan-950 hover:bg-cyan-900 text-cyan-400 px-3 py-1 rounded text-sm flex items-center transition-colors"
                    >
                      <RefreshCw className="h-3 w-3 mr-1" />
                      Clear Chat
                    </motion.button>
                  </div>
                </div>

                {/* Chat Messages Area */}
                <div className="p-4 bg-black h-[calc(100%-8rem)] overflow-auto">
                  <div className="space-y-4">
                    {chatMessages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="flex items-start"
                      >
                        {message.sender === "bot" ? (
                          <>
                            <div className="bg-cyan-950/30 p-2 rounded-full mr-3">
                              <Bot className="h-5 w-5 text-cyan-400" />
                            </div>
                            <div className="bg-cyan-950/20 rounded-lg p-3 max-w-[80%]">
                              <p className="text-sm text-gray-300">{message.content}</p>

                              {message.code && (
                                <motion.div
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ delay: 0.2 }}
                                  className={`bg-black/50 p-2 rounded mt-2 font-mono text-xs ${message.status === "success"
                                    ? "text-emerald-400"
                                    : message.status === "error"
                                      ? "text-red-400"
                                      : "text-cyan-400"
                                    }`}
                                >
                                  {message.code.split("\n").map((line, i) => (
                                    <div key={i}>{line}</div>
                                  ))}
                                </motion.div>
                              )}

                              <span className="text-xs text-gray-500 mt-1 block">{message.timestamp}</span>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="flex-1 flex justify-end">
                              <div className="bg-pink-950/20 rounded-lg p-3 max-w-[80%]">
                                <p className="text-sm text-gray-300">{message.content}</p>
                                <span className="text-xs text-gray-500 mt-1 block">{message.timestamp}</span>
                              </div>
                            </div>
                            <div className="bg-pink-950/30 p-2 rounded-full ml-3">
                              <User className="h-5 w-5 text-pink-400" />
                            </div>
                          </>
                        )}
                      </motion.div>
                    ))}

                    {/* Typing indicator */}
                    {isTyping && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-start">
                        <div className="bg-cyan-950/30 p-2 rounded-full mr-3">
                          <Bot className="h-5 w-5 text-cyan-400" />
                        </div>
                        <div className="bg-cyan-950/20 rounded-lg p-3">
                          <div className="flex space-x-1">
                            <motion.div
                              animate={{ y: [0, -5, 0] }}
                              transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1, delay: 0 }}
                              className="w-2 h-2 bg-cyan-400 rounded-full"
                            />
                            <motion.div
                              animate={{ y: [0, -5, 0] }}
                              transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1, delay: 0.2 }}
                              className="w-2 h-2 bg-cyan-400 rounded-full"
                            />
                            <motion.div
                              animate={{ y: [0, -5, 0] }}
                              transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1, delay: 0.4 }}
                              className="w-2 h-2 bg-cyan-400 rounded-full"
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Reference for auto-scrolling */}
                    <div ref={chatEndRef} />
                  </div>
                </div>

                {/* Chat Input Area */}
                <div className="p-4 border-t border-cyan-950">
                  <form className="flex items-center space-x-2" onSubmit={handleSendMessage}>
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Ask me about container management..."
                      className="flex-1 bg-cyan-950/20 border border-cyan-950 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500"
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="submit"
                      className="bg-cyan-500 hover:bg-cyan-600 text-black px-4 py-2 rounded-md text-sm flex items-center transition-colors"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Send
                    </motion.button>
                  </form>
                  <div className="mt-2 text-xs text-gray-500 flex items-center">
                    <Info className="h-3 w-3 mr-1" />
                    Try asking about container commands, troubleshooting, or best practices
                  </div>
                </div>
              </div>

              {/* Command Cards Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <CommandCard
                  title="Exec into bash"
                  description="Open an interactive shell in a container"
                  icon={Terminal}
                  onExecute={() => executeContainerAction("grafana", "exec")}
                />
                <CommandCard
                  title="Inspect Container"
                  description="View detailed container information"
                  icon={Eye}
                  onExecute={() => executeContainerAction("grafana", "inspect")}
                />
                <CommandCard
                  title="Show Logs"
                  description="View last 50 lines of container logs"
                  icon={Clock}
                  onExecute={() => executeContainerAction("grafana", "logs")}
                />
                <CommandCard
                  title="Rebuild Container"
                  description="Rebuild and restart a container"
                  icon={RefreshCw}
                  onExecute={() => executeContainerAction("grafana", "rebuild")}
                />
                <CommandCard
                  title="K9s Terminal"
                  description="Interactive K9s-like terminal for container management"
                  icon={Layers}
                  onExecute={() => {
                    setTerminalOutput([
                      "$ k9s",
                      "K9s 0.25.18 - Powerful Kubernetes CLI",
                      "┌─────────────────────────────────────────────────────────────────────┐",
                      "│ CONTEXT   CLUSTER    NAMESPACE   USER                               │",
                      "│ default   docker-desktop   default   docker-desktop-user            │",
                      "└─────────────────────────────────────────────────────────────────────┘",
                      "Press <ctrl-c> to exit...",
                      "$ _",
                    ])
                  }}
                />
                <CommandCard
                  title="Custom Command"
                  description="Run a custom Docker command"
                  icon={Zap}
                  onExecute={() => {
                    setTerminalOutput([
                      "$ docker ps -a",
                      "CONTAINER ID   IMAGE                    COMMAND                  CREATED          STATUS          PORTS                    NAMES",
                      '3a2e5f7d8b9c   grafana/grafana:latest   "/run.sh"                10 hours ago     Up 10 hours     0.0.0.0:3000->3000/tcp   grafana',
                      '1d2e3f4g5h6i   linuxserver/wireguard    "/init"                  10 hours ago     Up 10 hours     0.0.0.0:51820->51820/udp wireguard',
                      '7j8k9l0m1n2o   vaultwarden/server       "/start.sh"              10 hours ago     Up 10 hours     0.0.0.0:8080->80/tcp     bitwarden',
                      "$ _",
                    ])
                  }}
                />
              </div>
            </motion.div>
          )}
          {activeTab === "ssh" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="max-w-7xl mx-auto space-y-6"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-cyan-400">Node SSH Connections</h2>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-cyan-950 hover:bg-cyan-900 text-cyan-400 px-3 py-1 rounded text-sm flex items-center transition-colors"
                >
                  <PlusCircle className="h-3 w-3 mr-1" />
                  Add Node
                </motion.button>
              </div>

              {/* SSH Node Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 
                  NODE ADDITION POINT:
                  To add a new SSH node, copy one of these card elements and update:
                  1. The node name, IP, and description
                  2. Any specific SSH parameters needed
                  3. Ensure you add corresponding backend API endpoint
                */}

                {/* Node 1 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className="bg-black border border-cyan-950 rounded-lg overflow-hidden hover-card-glow transition-all"
                >
                  <div className="p-4 border-b border-cyan-950 flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="bg-cyan-950/30 p-2 rounded-md mr-3">
                        <Server className="h-5 w-5 text-cyan-400 card-icon" />
                      </div>
                      <div>
                        <h3 className="text-md font-medium text-cyan-400 card-title">Production Node 1</h3>
                        <p className="text-xs text-gray-400">192.168.1.101</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className="bg-emerald-950/30 text-emerald-400 text-xs px-2 py-1 rounded-full flex items-center mr-2">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Online
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">Status:</span>
                        <span className="text-emerald-400">Connected (3 days)</span>
                      </div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">SSH Port:</span>
                        <span>22</span>
                      </div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">Auth Method:</span>
                        <span>SSH Key</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Last Login:</span>
                        <span>2023-04-18 14:30</span>
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2">
                      {/* 
                        API INTEGRATION POINT:
                        The SSH connect button should trigger an API call to your backend:
                        
                        const connectSSH = async (nodeId, params) => {
                          try {
                            const response = await fetch('/api/ssh/connect', {
                              method: 'POST',
                              headers: {
                                'Content-Type': 'application/json',
                              },
                              body: JSON.stringify({
                                nodeId,
                                ...params
                              }),
                            });
                            
                            if (!response.ok) {
                              throw new Error('Failed to establish SSH connection');
                            }
                            
                            const data = await response.json();
                            
                            // Handle successful connection
                            // This could be opening a WebSocket for terminal communication
                            // or redirecting to a terminal interface
                            
                            return data;
                          } catch (error) {
                            console.error('SSH connection error:', error);
                            // Handle error state
                          }
                        };
                      */}
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-cyan-950 hover:bg-cyan-900 text-cyan-400 px-3 py-1 rounded text-sm flex items-center transition-colors card-button"
                      >
                        <Terminal className="h-3 w-3 mr-1" />
                        Connect
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-cyan-950/50 hover:bg-cyan-900 text-cyan-400 px-3 py-1 rounded text-sm flex items-center transition-colors"
                      >
                        <Settings className="h-3 w-3 mr-1" />
                        Config
                      </motion.button>
                    </div>
                  </div>
                </motion.div>

                {/* Node 2 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  className="bg-black border border-cyan-950 rounded-lg overflow-hidden hover-card-glow transition-all"
                >
                  <div className="p-4 border-b border-cyan-950 flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="bg-cyan-950/30 p-2 rounded-md mr-3">
                        <Server className="h-5 w-5 text-cyan-400 card-icon" />
                      </div>
                      <div>
                        <h3 className="text-md font-medium text-cyan-400 card-title">Production Node 2</h3>
                        <p className="text-xs text-gray-400">192.168.1.102</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className="bg-emerald-950/30 text-emerald-400 text-xs px-2 py-1 rounded-full flex items-center mr-2">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Online
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">Status:</span>
                        <span className="text-emerald-400">Connected (5 days)</span>
                      </div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">SSH Port:</span>
                        <span>22</span>
                      </div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">Auth Method:</span>
                        <span>SSH Key</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Last Login:</span>
                        <span>2023-04-17 09:15</span>
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-cyan-950 hover:bg-cyan-900 text-cyan-400 px-3 py-1 rounded text-sm flex items-center transition-colors card-button"
                      >
                        <Terminal className="h-3 w-3 mr-1" />
                        Connect
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-cyan-950/50 hover:bg-cyan-900 text-cyan-400 px-3 py-1 rounded text-sm flex items-center transition-colors"
                      >
                        <Settings className="h-3 w-3 mr-1" />
                        Config
                      </motion.button>
                    </div>
                  </div>
                </motion.div>

                {/* Node 3 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                  className="bg-black border border-cyan-950 rounded-lg overflow-hidden hover-card-glow transition-all"
                >
                  <div className="p-4 border-b border-cyan-950 flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="bg-cyan-950/30 p-2 rounded-md mr-3">
                        <Server className="h-5 w-5 text-cyan-400 card-icon" />
                      </div>
                      <div>
                        <h3 className="text-md font-medium text-cyan-400 card-title">Development Node</h3>
                        <p className="text-xs text-gray-400">192.168.1.103</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className="bg-yellow-950/30 text-yellow-400 text-xs px-2 py-1 rounded-full flex items-center mr-2">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        High Load
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">Status:</span>
                        <span className="text-yellow-400">Connected (CPU: 92%)</span>
                      </div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">SSH Port:</span>
                        <span>2222</span>
                      </div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">Auth Method:</span>
                        <span>Password</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Last Login:</span>
                        <span>2023-04-18 11:45</span>
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-cyan-950 hover:bg-cyan-900 text-cyan-400 px-3 py-1 rounded text-sm flex items-center transition-colors card-button"
                      >
                        <Terminal className="h-3 w-3 mr-1" />
                        Connect
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-cyan-950/50 hover:bg-cyan-900 text-cyan-400 px-3 py-1 rounded text-sm flex items-center transition-colors"
                      >
                        <Settings className="h-3 w-3 mr-1" />
                        Config
                      </motion.button>
                    </div>
                  </div>
                </motion.div>

                {/* Node 4 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                  className="bg-black border border-cyan-950 rounded-lg overflow-hidden hover-card-glow transition-all"
                >
                  <div className="p-4 border-b border-cyan-950 flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="bg-cyan-950/30 p-2 rounded-md mr-3">
                        <Server className="h-5 w-5 text-cyan-400 card-icon" />
                      </div>
                      <div>
                        <h3 className="text-md font-medium text-cyan-400 card-title">Backup Node</h3>
                        <p className="text-xs text-gray-400">192.168.1.104</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className="bg-red-950/30 text-red-400 text-xs px-2 py-1 rounded-full flex items-center mr-2">
                        <XCircle className="h-3 w-3 mr-1" />
                        Offline
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">Status:</span>
                        <span className="text-red-400">Disconnected (2 hours)</span>
                      </div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">SSH Port:</span>
                        <span>22</span>
                      </div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">Auth Method:</span>
                        <span>SSH Key</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Last Login:</span>
                        <span>2023-04-18 08:20</span>
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-cyan-950 hover:bg-cyan-900 text-cyan-400 px-3 py-1 rounded text-sm flex items-center transition-colors card-button"
                      >
                        <RefreshCw className="h-3 w-3 mr-1" />
                        Retry
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-cyan-950/50 hover:bg-cyan-900 text-cyan-400 px-3 py-1 rounded text-sm flex items-center transition-colors"
                      >
                        <Settings className="h-3 w-3 mr-1" />
                        Config
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* SSH Connection History */}
              <div className="bg-black border border-cyan-950 rounded-lg overflow-hidden">
                <div className="p-4 border-b border-cyan-950">
                  <h3 className="text-md font-medium text-cyan-400">Recent Connections</h3>
                </div>
                <div className="p-4">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-xs text-gray-400 border-b border-cyan-950">
                        <th className="pb-2">Node</th>
                        <th className="pb-2">User</th>
                        <th className="pb-2">Connected At</th>
                        <th className="pb-2">Duration</th>
                        <th className="pb-2">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* 
                        API INTEGRATION POINT:
                        Fetch connection history from your backend:
                        
                        const fetchSSHHistory = async () => {
                          try {
                            const response = await fetch('/api/ssh/history');
                            if (!response.ok) {
                              throw new Error('Failed to fetch SSH history');
                            }
                            const data = await response.json();
                            setConnectionHistory(data);
                          } catch (error) {
                            console.error('Error fetching SSH history:', error);
                          }
                        };
                      */}
                      <tr className="border-b border-cyan-950/30">
                        <td className="py-2">Production Node 1</td>
                        <td className="py-2">admin</td>
                        <td className="py-2">2023-04-18 14:30</td>
                        <td className="py-2">45m 12s</td>
                        <td className="py-2 text-emerald-400">Completed</td>
                      </tr>
                      <tr className="border-b border-cyan-950/30">
                        <td className="py-2">Development Node</td>
                        <td className="py-2">developer</td>
                        <td className="py-2">2023-04-18 11:45</td>
                        <td className="py-2">2h 30m</td>
                        <td className="py-2 text-emerald-400">Completed</td>
                      </tr>
                      <tr className="border-b border-cyan-950/30">
                        <td className="py-2">Production Node 2</td>
                        <td className="py-2">admin</td>
                        <td className="py-2">2023-04-17 09:15</td>
                        <td className="py-2">20m 05s</td>
                        <td className="py-2 text-emerald-400">Completed</td>
                      </tr>
                      <tr>
                        <td className="py-2">Backup Node</td>
                        <td className="py-2">system</td>
                        <td className="py-2">2023-04-18 08:20</td>
                        <td className="py-2">0m 12s</td>
                        <td className="py-2 text-red-400">Connection Failed</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  )
}

