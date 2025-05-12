import { NextResponse } from "next/server"

export async function GET() {
  // Mock data - replace with actual API call to your Go backend
  const metrics = {
    cpu: {
      usage: 32,
      cores: 8,
      temperature: 45,
    },
    memory: {
      used: 8.2,
      total: 16,
      usage: 45,
    },
    disk: {
      used: 230,
      total: 512,
      usage: 28,
    },
    containers: {
      active: 8,
      total: 10,
      status: [
        { id: "grafana", status: "running" },
        { id: "wireguard", status: "running" },
        { id: "bitwarden", status: "running" },
        { id: "minecraft", status: "running" },
        // Add more container statuses as needed
      ],
    },
  }

  return NextResponse.json(metrics)
}

/* 
  GO API INTEGRATION NOTES:
  
  To integrate with your Go backend API:
  
  1. Create a Go API that exposes endpoints for:
     - /api/metrics - System metrics (CPU, memory, disk)
     - /api/containers - Container status and info
     - /api/containers/:id/logs - Container logs
     - /api/containers/:id/start - Start container
     - /api/containers/:id/stop - Stop container
     - /api/containers/:id/restart - Restart container
  
  2. Replace the mock data in this file with actual fetch calls to your Go API:
  
  Example:
  
  export async function GET() {
    try {
      const response = await fetch('http://your-go-api-url/api/metrics');
      const data = await response.json();
      return NextResponse.json(data);
    } catch (error) {
      console.error('Error fetching metrics:', error);
      return NextResponse.json(
        { error: 'Failed to fetch metrics' },
        { status: 500 }
      );
    }
  }
*/

