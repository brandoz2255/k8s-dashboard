"use client"

import type React from "react"

import { motion } from "framer-motion"
import { Sidebar } from "@/components/sidebar"
import { User, Mail, Calendar, MapPin, Link, Shield, Terminal, Code, Cpu, Server, Github, Twitter } from "lucide-react"

export default function ProfilePage() {
  return (
    <div className="flex h-screen bg-black text-foreground overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-auto p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto space-y-8"
        >
          <div className="bg-black border border-cyan-950 rounded-lg overflow-hidden">
            <div className="h-32 bg-gradient-to-r from-cyan-950 to-cyan-900"></div>
            <div className="p-6">
              <div className="flex flex-col md:flex-row">
                <div className="flex-shrink-0 -mt-16 mb-4 md:mb-0 md:mr-6">
                  <div className="relative">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.2, duration: 0.5 }}
                      className="w-24 h-24 rounded-full bg-black border-4 border-black overflow-hidden"
                    >
                      <div className="w-full h-full bg-cyan-950 flex items-center justify-center">
                        <User className="h-12 w-12 text-cyan-400" />
                      </div>
                    </motion.div>
                    <div className="absolute bottom-0 right-0 bg-cyan-500 rounded-full p-1 border-2 border-black">
                      <Shield className="h-4 w-4 text-black" />
                    </div>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div>
                      <motion.h1
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        className="text-2xl font-bold text-cyan-400"
                      >
                        Dulc3
                      </motion.h1>
                      <motion.p
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                        className="text-gray-400"
                      >
                        Security Specialist
                      </motion.p>
                    </div>
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.5, duration: 0.5 }}
                      className="mt-4 md:mt-0"
                    >
                      <div className="bg-cyan-950/30 text-cyan-400 text-xs px-3 py-1 rounded-full border border-cyan-950">
                        Administrator
                      </div>
                    </motion.div>
                  </div>

                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                    className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4"
                  >
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 text-cyan-500 mr-2" />
                      <span className="text-sm">dulc3@cybercommand.sec</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-cyan-500 mr-2" />
                      <span className="text-sm">Joined March 2023</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 text-cyan-500 mr-2" />
                      <span className="text-sm">Cyber Operations Center</span>
                    </div>
                    <div className="flex items-center">
                      <Link className="h-4 w-4 text-cyan-500 mr-2" />
                      <span className="text-sm">secure.cybercommand.sec</span>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="md:col-span-2"
            >
              <div className="bg-black border border-cyan-950 rounded-lg overflow-hidden">
                <div className="p-4 border-b border-cyan-950">
                  <h2 className="text-lg font-medium text-cyan-400">About</h2>
                </div>
                <div className="p-4">
                  <p className="text-sm text-gray-400 leading-relaxed">
                    Cybersecurity specialist with expertise in network security, penetration testing, and containerized
                    application security. Responsible for maintaining the security infrastructure of the Cyber Command
                    dashboard and ensuring all systems are protected against potential threats. Experienced in
                    vulnerability assessment, incident response, and security automation.
                  </p>

                  <div className="mt-6">
                    <h3 className="text-sm font-medium text-cyan-400 mb-3">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      <Skill icon={Shield} label="Security Analysis" />
                      <Skill icon={Terminal} label="Penetration Testing" />
                      <Skill icon={Code} label="Security Automation" />
                      <Skill icon={Cpu} label="System Hardening" />
                      <Skill icon={Server} label="Container Security" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              <div className="bg-black border border-cyan-950 rounded-lg overflow-hidden">
                <div className="p-4 border-b border-cyan-950">
                  <h2 className="text-lg font-medium text-cyan-400">Stats</h2>
                </div>
                <div className="p-4">
                  <div className="space-y-4">
                    <StatItem label="Containers Managed" value="10" />
                    <StatItem label="Security Incidents Resolved" value="24" />
                    <StatItem label="Uptime" value="99.9%" />
                    <StatItem label="Vulnerabilities Patched" value="47" />
                  </div>

                  <div className="mt-6">
                    <h3 className="text-sm font-medium text-cyan-400 mb-3">Connect</h3>
                    <div className="flex space-x-3">
                      <a
                        href="#"
                        className="bg-cyan-950/30 hover:bg-cyan-950 text-cyan-400 p-2 rounded-full transition-colors"
                      >
                        <Github className="h-5 w-5" />
                      </a>
                      <a
                        href="#"
                        className="bg-cyan-950/30 hover:bg-cyan-950 text-cyan-400 p-2 rounded-full transition-colors"
                      >
                        <Twitter className="h-5 w-5" />
                      </a>
                      <a
                        href="#"
                        className="bg-cyan-950/30 hover:bg-cyan-950 text-cyan-400 p-2 rounded-full transition-colors"
                      >
                        <Terminal className="h-5 w-5" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.5 }}
          >
            <div className="bg-black border border-cyan-950 rounded-lg overflow-hidden">
              <div className="p-4 border-b border-cyan-950">
                <h2 className="text-lg font-medium text-cyan-400">Recent Activity</h2>
              </div>
              <div className="p-4">
                <div className="space-y-4">
                  <ActivityItem
                    icon={Shield}
                    title="Security Scan Completed"
                    description="Performed a full system security scan"
                    time="2 hours ago"
                  />
                  <ActivityItem
                    icon={Server}
                    title="Container Updated"
                    description="Updated Wireguard container to latest version"
                    time="Yesterday"
                  />
                  <ActivityItem
                    icon={Terminal}
                    title="Firewall Rules Modified"
                    description="Updated firewall rules for enhanced security"
                    time="3 days ago"
                  />
                  <ActivityItem
                    icon={Code}
                    title="Security Script Deployed"
                    description="Deployed new intrusion detection script"
                    time="1 week ago"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  )
}

interface SkillProps {
  icon: React.ElementType
  label: string
}

function Skill({ icon: Icon, label }: SkillProps) {
  return (
    <div className="bg-cyan-950/20 text-cyan-400 text-xs px-3 py-1 rounded-full border border-cyan-950 flex items-center">
      <Icon className="h-3 w-3 mr-1" />
      {label}
    </div>
  )
}

interface StatItemProps {
  label: string
  value: string
}

function StatItem({ label, value }: StatItemProps) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-sm text-gray-400">{label}</span>
      <span className="text-sm font-medium text-cyan-400">{value}</span>
    </div>
  )
}

interface ActivityItemProps {
  icon: React.ElementType
  title: string
  description: string
  time: string
}

function ActivityItem({ icon: Icon, title, description, time }: ActivityItemProps) {
  return (
    <div className="flex">
      <div className="flex-shrink-0 mr-3">
        <div className="bg-cyan-950/30 p-2 rounded-full">
          <Icon className="h-4 w-4 text-cyan-400" />
        </div>
      </div>
      <div className="flex-1">
        <h4 className="text-sm font-medium text-cyan-400">{title}</h4>
        <p className="text-xs text-gray-400">{description}</p>
        <span className="text-xs text-gray-500 mt-1">{time}</span>
      </div>
    </div>
  )
}


