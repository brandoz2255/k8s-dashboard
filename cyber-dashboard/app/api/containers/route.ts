import { NextResponse } from "next/server"

export async function GET() {
  // Mock data - replace with actual API call to your Go backend
  const containers = [
    {
      id: "grafana",
      name: "Grafana",
      description: "Monitoring and observability platform",
      status: "running",
      image: "grafana/grafana:latest",
      created: "2023-04-15T10:30:00Z",
      ports: ["3000:3000"],
      url: "http://localhost:3000/grafana",
    },
    {
      id: "wireguard",
      name: "Wireguard",
      description: "VPN server for secure connections",
      status: "running",
      image: "linuxserver/wireguard:latest",
      created: "2023-04-15T10:35:00Z",
      ports: ["51820:51820/udp"],
      url: "http://localhost:3000/wireguard",
    },
    {
      id: "bitwarden",
      name: "Bitwarden",
      description: "Password manager",
      status: "running",
      image: "vaultwarden/server:latest",
      created: "2023-04-15T10:40:00Z",
      ports: ["8080:80"],
      url: "http://localhost:3000/bitwarden",
    },
    {
      id: "minecraft",
      name: "Minecraft Server",
      description: "Game server",
      status: "running",
      image: "itzg/minecraft-server:latest",
      created: "2023-04-15T10:45:00Z",
      ports: ["25565:25565"],
      url: "http://localhost:3000/minecraft",
    },
  ]

  return NextResponse.json(containers)
}

/* 
  GO API INTEGRATION:
  
  Replace the mock data with actual API calls to your Go backend.
  Your Go API should provide endpoints for container management.
  
  Example:
  
  export async function GET() {
    try {
      const response = await fetch('http://your-go-api-url/api/containers');
      const data = await response.json();
      return NextResponse.json(data);
    } catch (error) {
      console.error('Error fetching containers:', error);
      return NextResponse.json(
        { error: 'Failed to fetch containers' },
        { status: 500 }
      );
    }
  }
*/

