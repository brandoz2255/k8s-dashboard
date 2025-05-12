"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Clock } from "lucide-react"

export function TimeWidget() {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    // Update time every second
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    // Clean up interval on unmount
    return () => clearInterval(interval)
  }, [])

  // Format time as HH:MM:SS
  const formattedTime = currentTime.toLocaleTimeString()

  // Format date as Day, Month Date, Year
  const formattedDate = currentTime.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-black border border-cyan-950 rounded-lg p-4 hover-card-glow"
    >
      <div className="flex items-center mb-3">
        <div className="bg-cyan-950/30 p-2 rounded-md mr-3">
          <Clock className="h-5 w-5 text-cyan-400" />
        </div>
        <h3 className="text-sm font-medium text-cyan-400">Current Time</h3>
      </div>

      <div className="text-center">
        <div className="text-3xl font-bold text-white mb-1">{formattedTime}</div>
        <div className="text-sm text-gray-400">{formattedDate}</div>
      </div>
    </motion.div>
  )
}

