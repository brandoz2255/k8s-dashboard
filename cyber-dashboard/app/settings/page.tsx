"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Sidebar } from "@/components/sidebar"
import { Save, Moon, Sun, Monitor, Bell, Shield, Key, Globe, Cpu } from "lucide-react"

export default function SettingsPage() {
  const [theme, setTheme] = useState<"dark" | "light" | "system">("dark")
  const [refreshInterval, setRefreshInterval] = useState("30")
  const [notifications, setNotifications] = useState(true)
  const [apiEndpoint, setApiEndpoint] = useState("http://localhost:8080")

  return (
    <div className="flex h-screen bg-black text-foreground overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-auto p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto space-y-8"
        >
          <div>
            <h1 className="text-2xl font-bold text-cyan-400">Settings</h1>
            <p className="text-gray-400 mt-1">Configure your dashboard preferences</p>
          </div>

          <div className="space-y-6">
            {/* Appearance Section */}
            <SettingsSection title="Appearance" icon={Moon} description="Customize how the dashboard looks">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-400 block mb-2">Theme</label>
                  <div className="flex space-x-2">
                    <ThemeButton icon={Moon} label="Dark" active={theme === "dark"} onClick={() => setTheme("dark")} />
                    <ThemeButton
                      icon={Sun}
                      label="Light"
                      active={theme === "light"}
                      onClick={() => setTheme("light")}
                    />
                    <ThemeButton
                      icon={Monitor}
                      label="System"
                      active={theme === "system"}
                      onClick={() => setTheme("system")}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-400 block mb-2">Accent Color</label>
                  <div className="flex space-x-3">
                    <ColorSwatch color="#06b6d4" active />
                    <ColorSwatch color="#8b5cf6" />
                    <ColorSwatch color="#ec4899" />
                    <ColorSwatch color="#10b981" />
                    <ColorSwatch color="#f59e0b" />
                  </div>
                </div>
              </div>
            </SettingsSection>

            {/* Notifications Section */}
            <SettingsSection title="Notifications" icon={Bell} description="Configure notification preferences">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium">Enable Notifications</h4>
                    <p className="text-xs text-gray-400">Receive alerts for container status changes</p>
                  </div>
                  <div
                    className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer ${notifications ? "bg-cyan-500" : "bg-gray-700"
                      }`}
                    onClick={() => setNotifications(!notifications)}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${notifications ? "translate-x-5" : ""
                        }`}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-400 block mb-2">Notification Types</label>
                  <div className="space-y-2">
                    <Checkbox label="Container status changes" defaultChecked />
                    <Checkbox label="Resource usage warnings" defaultChecked />
                    <Checkbox label="Security alerts" defaultChecked />
                    <Checkbox label="System updates" />
                  </div>
                </div>
              </div>
            </SettingsSection>

            {/* Security Section */}
            <SettingsSection title="Security" icon={Shield} description="Configure security settings">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-400 block mb-2">API Key</label>
                  <div className="flex">
                    <input
                      type="password"
                      value="••••••••••••••••••••••••••••••"
                      readOnly
                      className="flex-1 bg-cyan-950/20 border border-cyan-950 rounded-l-md px-3 py-2 text-sm"
                    />
                    <button className="bg-cyan-950 hover:bg-cyan-900 text-cyan-400 px-3 py-2 rounded-r-md transition-colors">
                      <Key className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Used for authenticating with the backend API</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-400 block mb-2">Session Timeout</label>
                  <select className="w-full bg-cyan-950/20 border border-cyan-950 rounded-md px-3 py-2 text-sm">
                    <option value="15">15 minutes</option>
                    <option value="30">30 minutes</option>
                    <option value="60">1 hour</option>
                    <option value="120">2 hours</option>
                    <option value="0">Never</option>
                  </select>
                </div>
              </div>
            </SettingsSection>

            {/* API Configuration Section */}
            <SettingsSection title="API Configuration" icon={Globe} description="Configure backend API settings">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-400 block mb-2">API Endpoint</label>
                  <input
                    type="text"
                    value={apiEndpoint}
                    onChange={(e) => setApiEndpoint(e.target.value)}
                    className="w-full bg-cyan-950/20 border border-cyan-950 rounded-md px-3 py-2 text-sm"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-400 block mb-2">Refresh Interval</label>
                  <div className="flex items-center">
                    <input
                      type="range"
                      min="5"
                      max="60"
                      step="5"
                      value={refreshInterval}
                      onChange={(e) => setRefreshInterval(e.target.value)}
                      className="flex-1 mr-3 accent-cyan-500"
                    />
                    <div className="bg-cyan-950/30 text-cyan-400 text-xs px-2 py-1 rounded w-16 text-center">
                      {refreshInterval}s
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">How often to refresh container data</p>
                </div>
              </div>
            </SettingsSection>

            {/* System Resources Section */}
            <SettingsSection title="System Resources" icon={Cpu} description="Configure resource monitoring">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-400 block mb-2">Resource Warning Thresholds</label>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-xs text-gray-400">CPU Usage</span>
                        <span className="text-xs text-cyan-400">80%</span>
                      </div>
                      <input
                        type="range"
                        min="50"
                        max="95"
                        step="5"
                        defaultValue="80"
                        className="w-full accent-cyan-500"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-xs text-gray-400">Memory Usage</span>
                        <span className="text-xs text-cyan-400">85%</span>
                      </div>
                      <input
                        type="range"
                        min="50"
                        max="95"
                        step="5"
                        defaultValue="85"
                        className="w-full accent-cyan-500"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-xs text-gray-400">Disk Usage</span>
                        <span className="text-xs text-cyan-400">90%</span>
                      </div>
                      <input
                        type="range"
                        min="50"
                        max="95"
                        step="5"
                        defaultValue="90"
                        className="w-full accent-cyan-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </SettingsSection>
          </div>

          <div className="flex justify-end pt-4 border-t border-cyan-950">
            <button className="bg-cyan-500 hover:bg-cyan-600 text-black font-medium px-4 py-2 rounded-md text-sm flex items-center transition-colors">
              <Save className="h-4 w-4 mr-2" />
              Save Settings
            </button>
          </div>
        </motion.div>
      </main>
    </div>
  )
}

interface SettingsSectionProps {
  title: string
  icon: React.ElementType
  description: string
  children: React.ReactNode
}

function SettingsSection({ title, icon: Icon, description, children }: SettingsSectionProps) {
  return (
    <div className="bg-black border border-cyan-950 rounded-lg overflow-hidden">
      <div className="p-4 border-b border-cyan-950 flex items-center">
        <Icon className="h-5 w-5 text-cyan-500 mr-2" />
        <div>
          <h2 className="text-lg font-medium text-cyan-400">{title}</h2>
          <p className="text-xs text-gray-400">{description}</p>
        </div>
      </div>
      <div className="p-4">{children}</div>
    </div>
  )
}

interface ThemeButtonProps {
  icon: React.ElementType
  label: string
  active: boolean
  onClick: () => void
}

function ThemeButton({ icon: Icon, label, active, onClick }: ThemeButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center p-3 rounded-md transition-colors ${active
        ? "bg-cyan-950 text-cyan-400 border border-cyan-800"
        : "bg-cyan-950/20 border border-cyan-950 hover:bg-cyan-950/40"
        }`}
    >
      <Icon className="h-5 w-5 mb-1" />
      <span className="text-xs">{label}</span>
    </button>
  )
}

interface ColorSwatchProps {
  color: string
  active?: boolean
}

function ColorSwatch({ color, active = false }: ColorSwatchProps) {
  return (
    <button
      className={`w-6 h-6 rounded-full ${active ? "ring-2 ring-white" : ""}`}
      style={{ backgroundColor: color }}
    />
  )
}

interface CheckboxProps {
  label: string
  defaultChecked?: boolean
}

function Checkbox({ label, defaultChecked = false }: CheckboxProps) {
  const [checked, setChecked] = useState(defaultChecked)

  return (
    <label className="flex items-center cursor-pointer">
      <div
        className={`w-4 h-4 rounded border mr-2 flex items-center justify-center ${checked ? "bg-cyan-500 border-cyan-500" : "border-cyan-950"
          }`}
        onClick={() => setChecked(!checked)}
      >
        {checked && (
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M8.5 2.5L3.5 7.5L1.5 5.5"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>
      <span className="text-sm">{label}</span>
    </label>
  )
}


