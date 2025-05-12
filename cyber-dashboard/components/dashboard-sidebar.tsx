"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Shield, Server, Terminal, Home, Settings, User } from "lucide-react"
import { motion } from "framer-motion"

export function DashboardSidebar() {
  return (
    <>
      <Sidebar variant="floating" className="border border-neonBlue bg-dark">
        <SidebarHeader className="flex justify-center items-center py-6">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex flex-col items-center"
          >
            <Shield className="h-10 w-10 text-neonBlue" />
            <h1 className="text-lg font-bold mt-2 text-neonBlue">CYBER COMMAND</h1>
          </motion.div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {sidebarItems.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 * (index + 1) }}
              >
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip={item.name}>
                    <a href={item.href} className="group flex items-center gap-2">
                      <item.icon className="text-neonBlue group-hover:text-neonPink transition-colors" />
                      <span className="text-light">{item.name}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </motion.div>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="py-4">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <a href="#settings" className="flex items-center gap-2">
                  <Settings className="text-neonBlue" />
                  <span className="text-light">Settings</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <a href="#profile" className="flex items-center gap-2">
                  <User className="text-neonBlue" />
                  <span className="text-light">Profile</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <div className="fixed top-4 left-4 z-50 md:hidden">
        <SidebarTrigger className="bg-[hsla(var(--color-darkBlue),0.8)] backdrop-blur-sm border border-neonBlue text-neonBlue hover:bg-[hsla(var(--color-neonBlue),0.2)]" />
      </div>
    </>
  )
}

const sidebarItems = [
  {
    name: "Dashboard",
    href: "/",
    icon: Home,
  },
  {
    name: "Containers",
    href: "#containers",
    icon: Server,
  },
  {
    name: "Terminal",
    href: "#terminal",
    icon: Terminal,
  },
]

