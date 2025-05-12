"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { LayoutDashboard, Boxes, Settings, User, Shield, Search, LogOut, Calendar } from "lucide-react"

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const navItems = [
    { icon: Search, label: "Search", href: "https://google.com", external: true },
    { icon: LayoutDashboard, label: "Dashboard", href: "/" },
    { icon: Boxes, label: "Containers", href: "/containers" },
    { icon: Shield, label: "Security", href: "/security" },
    { icon: Calendar, label: "Calendar", href: "/calendar" },
    { icon: Settings, label: "Settings", href: "/settings" },
    { icon: User, label: "Profile", href: "/profile" },
  ]

  // Mock logout function
  const handleLogout = () => {
    // Clear authentication data
    if (typeof window !== "undefined") {
      // Clear session storage
      sessionStorage.removeItem("isLoggedIn")
      sessionStorage.removeItem("user")

      // Clear the auth cookie
      document.cookie = "auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
    }

    console.log("Logging out...")
    router.push("/login")
  }

  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="sidebar flex flex-col"
    >
      <div className="flex flex-col items-center mb-12">
        <Shield className="h-10 w-10 text-cyan-500 mb-2" />
        <h1 className="text-xs font-bold text-cyan-500 text-center">CYBER COMMAND</h1>
      </div>

      <nav className="flex flex-col items-center space-y-8 flex-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          if (item.external) {
            return (
              <a key={item.href} href={item.href} target="_blank" rel="noopener noreferrer" className="sidebar-link">
                <div className="sidebar-icon-container">
                  <Icon className="h-5 w-5" />
                </div>
                <span className="sidebar-label">{item.label}</span>
              </a>
            )
          }

          return (
            <Link key={item.href} href={item.href} className={`sidebar-link ${isActive ? "active" : ""}`}>
              <div className={`sidebar-icon-container ${isActive ? "bg-cyan-950" : ""}`}>
                <Icon className="h-5 w-5" />
              </div>
              <span className="sidebar-label">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Logout button at the bottom */}
      <div className="mt-auto mb-6">
        <button onClick={handleLogout} className="sidebar-link text-gray-500 hover:text-pink-500 transition-colors">
          <div className="sidebar-icon-container">
            <LogOut className="h-5 w-5" />
          </div>
          <span className="sidebar-label">Logout</span>
        </button>
      </div>
    </motion.div>
  )
}

