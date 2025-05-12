"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import { ArrowRight, Activity, Cpu, Server, Database } from "lucide-react"

// This would be replaced with actual API calls to your Go backend
// For now, we're using mock data
const mockMetrics = {
  cpuUsage: 32,
  memoryUsage: 45,
  diskUsage: 28,
  containers: {
    running: 8,
    total: 10,
  },
}

export function MetricsPanel() {
  // In a real implementation, you would fetch metrics from your Go API
  // Example:
  // const [metrics, setMetrics] = useState(null);
  // useEffect(() => {
  //   async function fetchMetrics() {
  //     const response = await fetch('/api/metrics');
  //     const data = await response.json();
  //     setMetrics(data);
  //   }
  //   fetchMetrics();
  //   const interval = setInterval(fetchMetrics, 30000);
  //   return () => clearInterval(interval);
  // }, []);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-neonBlue">System Metrics</h2>
        <a
          href="https://grafana.dulc3.tech"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-neonBlue hover:text-neonPink transition-colors"
        >
          Open Grafana <ArrowRight className="h-4 w-4" />
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="CPU Usage" value={`${mockMetrics.cpuUsage}%`} icon={Cpu} color="text-neonBlue" delay={0.1} />
        <MetricCard
          title="Memory Usage"
          value={`${mockMetrics.memoryUsage}%`}
          icon={Activity}
          color="text-neonPink"
          delay={0.2}
        />
        <MetricCard
          title="Disk Usage"
          value={`${mockMetrics.diskUsage}%`}
          icon={Database}
          color="text-neonGreen"
          delay={0.3}
        />
        <MetricCard
          title="Containers"
          value={`${mockMetrics.containers.running}/${mockMetrics.containers.total}`}
          icon={Server}
          color="text-neonPurple"
          delay={0.4}
        />
      </div>
    </div>
  )
}

function MetricCard({
  title,
  value,
  icon: Icon,
  color,
  delay = 0,
}: {
  title: string
  value: string
  icon: React.ElementType
  color: string
  delay?: number
}) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}>
      <Card className="border border-neonBlueDim hover:border-neonBlue transition-colors bg-dark text-light">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-400">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold text-light">{value}</div>
            <Icon className={`h-8 w-8 ${color}`} />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

