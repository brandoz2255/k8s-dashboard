"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Sidebar } from "@/components/sidebar"
import {
  Shield,
  Search,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Lock,
  FileSearch,
  WormIcon as Virus,
  ShieldAlert,
  ShieldCheck,
  Zap,
  RotateCw,
  Layers,
  Network,
  Key,
  FileWarning,
  Fingerprint,
} from "lucide-react"

// Security scan types
type ScanType = "lynis" | "clamav" | "dockle" | "trivy" | "falco" | "audit"
type ScanStatus = "idle" | "running" | "completed" | "failed"
type HardeningAction = "fail2ban" | "firewall" | "selinux" | "apparmor" | "seccomp" | "rootkit" | "ssh"

interface ScanResult {
  id: string
  type: ScanType
  lastRun: string | null
  status: ScanStatus
  vulnerabilities: number
  malware: number
  misconfigurations: number
  criticalIssues: number
  duration: number | null
}

interface HardeningActionState {
  id: HardeningAction
  name: string
  description: string
  enabled: boolean
  lastToggled: string | null
  status: "active" | "inactive" | "pending" | "error"
  icon: React.ElementType
}

// Mock data for security scans
const initialScanResults: ScanResult[] = [
  {
    id: "lynis-scan",
    type: "lynis",
    lastRun: "2023-04-18T14:30:00Z",
    status: "completed",
    vulnerabilities: 3,
    malware: 0,
    misconfigurations: 7,
    criticalIssues: 1,
    duration: 45,
  },
  {
    id: "clamav-scan",
    type: "clamav",
    lastRun: "2023-04-17T10:15:00Z",
    status: "completed",
    vulnerabilities: 0,
    malware: 2,
    misconfigurations: 0,
    criticalIssues: 0,
    duration: 120,
  },
  {
    id: "dockle-scan",
    type: "dockle",
    lastRun: "2023-04-16T08:45:00Z",
    status: "completed",
    vulnerabilities: 5,
    malware: 0,
    misconfigurations: 12,
    criticalIssues: 2,
    duration: 60,
  },
  {
    id: "trivy-scan",
    type: "trivy",
    lastRun: "2023-04-15T16:20:00Z",
    status: "completed",
    vulnerabilities: 8,
    malware: 0,
    misconfigurations: 3,
    criticalIssues: 3,
    duration: 90,
  },
  {
    id: "falco-scan",
    type: "falco",
    lastRun: null,
    status: "idle",
    vulnerabilities: 0,
    malware: 0,
    misconfigurations: 0,
    criticalIssues: 0,
    duration: null,
  },
  {
    id: "audit-scan",
    type: "audit",
    lastRun: "2023-04-14T11:10:00Z",
    status: "failed",
    vulnerabilities: 0,
    malware: 0,
    misconfigurations: 0,
    criticalIssues: 0,
    duration: null,
  },
]

// Mock data for hardening actions
const initialHardeningActions: HardeningActionState[] = [
  {
    id: "fail2ban",
    name: "Fail2Ban",
    description: "Intrusion prevention system that protects against brute-force attacks",
    enabled: true,
    lastToggled: "2023-04-18T09:30:00Z",
    status: "active",
    icon: Shield,
  },
  {
    id: "firewall",
    name: "Firewall Rules",
    description: "Network security system that monitors and controls incoming and outgoing traffic",
    enabled: true,
    lastToggled: "2023-04-17T14:45:00Z",
    status: "active",
    icon: Network,
  },
  {
    id: "selinux",
    name: "SELinux",
    description: "Security-Enhanced Linux kernel security module",
    enabled: false,
    lastToggled: "2023-04-16T11:20:00Z",
    status: "inactive",
    icon: Lock,
  },
  {
    id: "apparmor",
    name: "AppArmor",
    description: "Application security system that restricts program capabilities",
    enabled: true,
    lastToggled: "2023-04-15T16:10:00Z",
    status: "active",
    icon: ShieldCheck,
  },
  {
    id: "seccomp",
    name: "Seccomp",
    description: "Secure computing mode that restricts system calls",
    enabled: true,
    lastToggled: "2023-04-14T10:05:00Z",
    status: "active",
    icon: Layers,
  },
  {
    id: "rootkit",
    name: "Rootkit Scanner",
    description: "Detects and removes rootkits and other malware",
    enabled: false,
    lastToggled: "2023-04-13T13:40:00Z",
    status: "inactive",
    icon: Virus,
  },
  {
    id: "ssh",
    name: "SSH Hardening",
    description: "Secure Shell configuration hardening",
    enabled: true,
    lastToggled: "2023-04-12T15:30:00Z",
    status: "active",
    icon: Key,
  },
]

// Scan tool information
const scanTools = {
  lynis: {
    name: "Lynis",
    description: "Security auditing tool for Unix/Linux systems",
    icon: FileSearch,
  },
  clamav: {
    name: "ClamAV",
    description: "Antivirus engine for detecting trojans, viruses, malware & other threats",
    icon: Virus,
  },
  dockle: {
    name: "Dockle",
    description: "Container image linter for security, helping build best-practice Docker images",
    icon: Layers,
  },
  trivy: {
    name: "Trivy",
    description: "Comprehensive vulnerability scanner for containers and other artifacts",
    icon: ShieldAlert,
  },
  falco: {
    name: "Falco",
    description: "Cloud-native runtime security tool designed to detect anomalous activity",
    icon: AlertTriangle,
  },
  audit: {
    name: "System Audit",
    description: "Comprehensive system security audit and compliance check",
    icon: FileWarning,
  },
}

export default function SecurityPage() {
  const [scanResults, setScanResults] = useState<ScanResult[]>(initialScanResults)
  const [hardeningActions, setHardeningActions] = useState<HardeningActionState[]>(initialHardeningActions)
  const [activeScan, setActiveScan] = useState<string | null>(null)

  // Function to run a security scan
  const runScan = (scanId: string) => {
    // Update scan status to running
    setScanResults((prev) =>
      prev.map((scan) => (scan.id === scanId ? { ...scan, status: "running" as ScanStatus } : scan)),
    )

    // Set as active scan
    setActiveScan(scanId)

    // Mock API call and response
    setTimeout(() => {
      // This would be replaced with actual API call
      /*
      API Integration:
      
      const executeScan = async (scanId) => {
        try {
          // Start SSE connection for real-time scan updates
          const eventSource = new EventSource(`/api/security/scans/${scanId}/run`);
          
          eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data);
            
            if (data.status === 'completed' || data.status === 'failed') {
              setScanResults(prev => 
                prev.map(scan => 
                  scan.id === scanId 
                    ? { 
                        ...scan, 
                        status: data.status, 
                        lastRun: new Date().toISOString(),
                        vulnerabilities: data.results.vulnerabilities || 0,
                        malware: data.results.malware || 0,
                        misconfigurations: data.results.misconfigurations || 0,
                        criticalIssues: data.results.criticalIssues || 0,
                        duration: data.duration
                      } 
                    : scan
                )
              );
              eventSource.close();
              setActiveScan(null);
            }
          };
          
          eventSource.onerror = () => {
            eventSource.close();
            setScanResults(prev => 
              prev.map(scan => 
                scan.id === scanId 
                  ? { 
                      ...scan, 
                      status: "failed", 
                      lastRun: new Date().toISOString()
                    } 
                  : scan
              )
            );
            setActiveScan(null);
          };
        } catch (error) {
          console.error("Error running scan:", error);
          setScanResults(prev => 
            prev.map(scan => 
              scan.id === scanId 
                ? { 
                    ...scan, 
                    status: "failed", 
                    lastRun: new Date().toISOString()
                  } 
                : scan
            )
          );
          setActiveScan(null);
        }
      };
      */

      // Mock successful scan completion
      setScanResults((prev) =>
        prev.map((scan) => {
          if (scan.id === scanId) {
            // Generate random results for the mock
            const vulnerabilities = Math.floor(Math.random() * 10)
            const malware = Math.floor(Math.random() * 3)
            const misconfigurations = Math.floor(Math.random() * 15)
            const criticalIssues = Math.floor(Math.random() * 4)
            const duration = Math.floor(Math.random() * 120) + 30

            return {
              ...scan,
              status: "completed" as ScanStatus,
              lastRun: new Date().toISOString(),
              vulnerabilities,
              malware,
              misconfigurations,
              criticalIssues,
              duration,
            }
          }
          return scan
        }),
      )

      // Clear active scan
      setActiveScan(null)
    }, 3000)
  }

  // Function to toggle a hardening action
  const toggleHardeningAction = (actionId: HardeningAction) => {
    // This would be replaced with actual API call
    /*
    API Integration:
    
    const toggleAction = async (actionId) => {
      try {
        const action = hardeningActions.find(a => a.id === actionId);
        const newState = !action.enabled;
        
        const response = await fetch(`/api/security/hardening/${actionId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ enabled: newState }),
        });
        
        if (!response.ok) {
          throw new Error(`Failed to toggle ${actionId}`);
        }
        
        const result = await response.json();
        
        setHardeningActions(prev => 
          prev.map(action => 
            action.id === actionId 
              ? { 
                  ...action, 
                  enabled: newState,
                  status: newState ? 'active' : 'inactive',
                  lastToggled: new Date().toISOString()
                } 
              : action
          )
        );
      } catch (error) {
        console.error(`Error toggling ${actionId}:`, error);
        // Show error notification
      }
    };
    */

    // Mock implementation
    setHardeningActions((prev) =>
      prev.map((action) => {
        if (action.id === actionId) {
          const newEnabled = !action.enabled
          return {
            ...action,
            enabled: newEnabled,
            status: newEnabled ? "active" : "inactive",
            lastToggled: new Date().toISOString(),
          }
        }
        return action
      }),
    )
  }

  // Format date for display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never"
    const date = new Date(dateString)
    return date.toLocaleString()
  }

  return (
    <div className="flex h-screen bg-black text-foreground overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-auto p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-7xl mx-auto space-y-8"
        >
          <div>
            <h1 className="text-2xl font-bold text-cyan-400">Security Automation</h1>
            <p className="text-gray-400 mt-1">Monitor and automate security for your containers and system</p>
          </div>

          {/* Security Scans Section */}
          <div className="bg-black border border-cyan-950 rounded-lg overflow-hidden">
            <div className="p-4 border-b border-cyan-950 flex justify-between items-center">
              <h2 className="text-lg font-medium text-cyan-400">Security Scans</h2>
              <div className="flex space-x-2">
                <button className="bg-cyan-950 hover:bg-cyan-900 text-cyan-400 px-3 py-1 rounded text-sm flex items-center transition-colors">
                  <Search className="h-3 w-3 mr-1" />
                  Scan All
                </button>
              </div>
            </div>

            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {scanResults.map((scan) => {
                  const tool = scanTools[scan.type]
                  const Icon = tool.icon
                  const isRunning = scan.status === "running"
                  const hasIssues = scan.vulnerabilities > 0 || scan.malware > 0 || scan.criticalIssues > 0

                  return (
                    <div key={scan.id} className="security-card hover-card-glow">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center">
                          <div className="bg-cyan-950/30 p-2 rounded-md mr-3">
                            <Icon className="h-5 w-5 text-cyan-400 card-icon" />
                          </div>
                          <div>
                            <h3 className="security-card-title card-title">{tool.name}</h3>
                            <p className="text-xs text-gray-400">{tool.description}</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3 mb-4">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-400">Last Scan:</span>
                          <span className="flex items-center">
                            <Clock className="h-3 w-3 mr-1 text-cyan-400" />
                            {formatDate(scan.lastRun)}
                          </span>
                        </div>

                        {scan.status === "completed" && (
                          <>
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-gray-400">Duration:</span>
                              <span>{scan.duration ? `${scan.duration}s` : "N/A"}</span>
                            </div>

                            <div className="grid grid-cols-2 gap-2 mt-2">
                              <div
                                className={`bg-cyan-950/20 p-2 rounded-md text-center ${scan.vulnerabilities > 0 ? "text-red-400" : "text-emerald-400"
                                  }`}
                              >
                                <div className="text-xs font-medium mb-1">Vulnerabilities</div>
                                <div className="text-lg font-bold">{scan.vulnerabilities}</div>
                              </div>
                              <div
                                className={`bg-cyan-950/20 p-2 rounded-md text-center ${scan.malware > 0 ? "text-red-400" : "text-emerald-400"
                                  }`}
                              >
                                <div className="text-xs font-medium mb-1">Malware</div>
                                <div className="text-lg font-bold">{scan.malware}</div>
                              </div>
                              <div
                                className={`bg-cyan-950/20 p-2 rounded-md text-center ${scan.misconfigurations > 0 ? "text-yellow-400" : "text-emerald-400"
                                  }`}
                              >
                                <div className="text-xs font-medium mb-1">Misconfigs</div>
                                <div className="text-lg font-bold">{scan.misconfigurations}</div>
                              </div>
                              <div
                                className={`bg-cyan-950/20 p-2 rounded-md text-center ${scan.criticalIssues > 0 ? "text-red-400" : "text-emerald-400"
                                  }`}
                              >
                                <div className="text-xs font-medium mb-1">Critical</div>
                                <div className="text-lg font-bold">{scan.criticalIssues}</div>
                              </div>
                            </div>
                          </>
                        )}

                        {scan.status === "failed" && (
                          <div className="bg-red-950/20 border border-red-900 p-2 rounded-md text-center text-red-400">
                            <XCircle className="h-4 w-4 mx-auto mb-1" />
                            <div className="text-sm">Scan failed. Check logs for details.</div>
                          </div>
                        )}

                        {scan.status === "idle" && !scan.lastRun && (
                          <div className="bg-cyan-950/20 p-2 rounded-md text-center text-cyan-400">
                            <div className="text-sm">No scans have been run yet.</div>
                          </div>
                        )}
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          {scan.status === "completed" && hasIssues && (
                            <span className="bg-red-950/30 text-red-400 text-xs px-2 py-1 rounded-full flex items-center">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              Issues Found
                            </span>
                          )}
                          {scan.status === "completed" && !hasIssues && (
                            <span className="bg-emerald-950/30 text-emerald-400 text-xs px-2 py-1 rounded-full flex items-center">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Secure
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => runScan(scan.id)}
                          disabled={isRunning || activeScan !== null}
                          className="bg-cyan-950 text-cyan-400 px-3 py-1 rounded text-sm flex items-center transition-colors card-button disabled:opacity-50"
                        >
                          {isRunning ? (
                            <>
                              <RotateCw className="h-3 w-3 mr-1 animate-spin" />
                              Scanning...
                            </>
                          ) : (
                            <>
                              <Zap className="h-3 w-3 mr-1" />
                              Run Scan
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Hardening Actions Section */}
          <div className="bg-black border border-cyan-950 rounded-lg overflow-hidden">
            <div className="p-4 border-b border-cyan-950 flex justify-between items-center">
              <h2 className="text-lg font-medium text-cyan-400">Hardening Actions</h2>
              <div className="flex space-x-2">
                <button className="bg-cyan-950 hover:bg-cyan-900 text-cyan-400 px-3 py-1 rounded text-sm flex items-center transition-colors">
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Refresh Status
                </button>
              </div>
            </div>

            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {hardeningActions.map((action) => {
                  const Icon = action.icon

                  return (
                    <div key={action.id} className="security-card hover-card-glow">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center">
                          <div className="bg-cyan-950/30 p-2 rounded-md mr-3">
                            <Icon className="h-5 w-5 text-cyan-400 card-icon" />
                          </div>
                          <div>
                            <h3 className="security-card-title card-title">{action.name}</h3>
                            <p className="text-xs text-gray-400">{action.description}</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3 mb-4">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-400">Status:</span>
                          <span
                            className={`flex items-center ${action.status === "active"
                              ? "text-emerald-400"
                              : action.status === "inactive"
                                ? "text-gray-400"
                                : action.status === "pending"
                                  ? "text-yellow-400"
                                  : "text-red-400"
                              }`}
                          >
                            {action.status === "active" && <CheckCircle className="h-3 w-3 mr-1" />}
                            {action.status === "inactive" && <XCircle className="h-3 w-3 mr-1" />}
                            {action.status === "pending" && <Clock className="h-3 w-3 mr-1" />}
                            {action.status === "error" && <AlertTriangle className="h-3 w-3 mr-1" />}
                            {action.status.charAt(0).toUpperCase() + action.status.slice(1)}
                          </span>
                        </div>

                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-400">Last Changed:</span>
                          <span className="flex items-center">
                            <Clock className="h-3 w-3 mr-1 text-cyan-400" />
                            {formatDate(action.lastToggled)}
                          </span>
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <button
                          onClick={() => toggleHardeningAction(action.id)}
                          className={`px-3 py-1 rounded text-sm flex items-center transition-colors ${action.enabled
                            ? "bg-emerald-950/30 text-emerald-400 hover:bg-pink-900 hover:text-pink-300"
                            : "bg-gray-800 text-gray-400 hover:bg-pink-900 hover:text-pink-300"
                            }`}
                        >
                          {action.enabled ? (
                            <>
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Enabled
                            </>
                          ) : (
                            <>
                              <XCircle className="h-3 w-3 mr-1" />
                              Disabled
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Security Overview Section */}
          <div className="bg-black border border-cyan-950 rounded-lg overflow-hidden">
            <div className="p-4 border-b border-cyan-950">
              <h2 className="text-lg font-medium text-cyan-400">Security Overview</h2>
            </div>

            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-black border border-cyan-950 rounded-lg p-4 hover-card-glow">
                  <div className="flex items-center mb-2">
                    <ShieldAlert className="h-5 w-5 text-cyan-400 mr-2 card-icon" />
                    <h3 className="text-sm font-medium text-cyan-400">Vulnerabilities</h3>
                  </div>
                  <div className="text-2xl font-bold text-red-400">16</div>
                  <div className="text-xs text-gray-400 mt-1">Across all containers</div>
                </div>

                <div className="bg-black border border-cyan-950 rounded-lg p-4 hover-card-glow">
                  <div className="flex items-center mb-2">
                    <Virus className="h-5 w-5 text-cyan-400 mr-2 card-icon" />
                    <h3 className="text-sm font-medium text-cyan-400">Malware Threats</h3>
                  </div>
                  <div className="text-2xl font-bold text-emerald-400">0</div>
                  <div className="text-xs text-gray-400 mt-1">System is clean</div>
                </div>

                <div className="bg-black border border-cyan-950 rounded-lg p-4 hover-card-glow">
                  <div className="flex items-center mb-2">
                    <FileWarning className="h-5 w-5 text-cyan-400 mr-2 card-icon" />
                    <h3 className="text-sm font-medium text-cyan-400">Misconfigurations</h3>
                  </div>
                  <div className="text-2xl font-bold text-yellow-400">22</div>
                  <div className="text-xs text-gray-400 mt-1">Potential security issues</div>
                </div>

                <div className="bg-black border border-cyan-950 rounded-lg p-4 hover-card-glow">
                  <div className="flex items-center mb-2">
                    <Fingerprint className="h-5 w-5 text-cyan-400 mr-2 card-icon" />
                    <h3 className="text-sm font-medium text-cyan-400">Security Score</h3>
                  </div>
                  <div className="text-2xl font-bold text-cyan-400">78/100</div>
                  <div className="text-xs text-gray-400 mt-1">Based on latest scans</div>
                </div>
              </div>

              <div className="mt-6 bg-cyan-950/20 border border-cyan-950 rounded-lg p-4">
                <div className="flex items-start">
                  <AlertTriangle className="h-5 w-5 text-yellow-400 mr-2 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium text-cyan-400">Security Recommendations</h3>
                    <ul className="mt-2 space-y-2 text-sm text-gray-400">
                      <li className="flex items-start">
                        <div className="bg-red-950/30 text-red-400 rounded-full h-4 w-4 flex items-center justify-center text-xs mr-2 mt-0.5">
                          !
                        </div>
                        <span>Update container images to patch 3 critical vulnerabilities in Grafana</span>
                      </li>
                      <li className="flex items-start">
                        <div className="bg-yellow-950/30 text-yellow-400 rounded-full h-4 w-4 flex items-center justify-center text-xs mr-2 mt-0.5">
                          !
                        </div>
                        <span>Enable AppArmor profiles for 4 containers with elevated privileges</span>
                      </li>
                      <li className="flex items-start">
                        <div className="bg-yellow-950/30 text-yellow-400 rounded-full h-4 w-4 flex items-center justify-center text-xs mr-2 mt-0.5">
                          !
                        </div>
                        <span>Fix 7 misconfigurations in Docker container settings</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  )
}


