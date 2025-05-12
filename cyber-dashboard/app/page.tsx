"use client"

import { useEffect, useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sidebar } from "@/components/sidebar"
import { SystemMetrics } from "@/components/system-metrics"
import { ServiceGrid } from "@/components/service-grid"
import { WeatherWidget } from "@/components/weather-widget"
// Import the TimeWidget component
import { TimeWidget } from "@/components/time-widget"
import { SocialFeedWidget } from "@/components/social-feed-widget"

// Update the layout to include the TimeWidget
export default function Home() {
  const [isBooting, setIsBooting] = useState(true)
  const [isIdle, setIsIdle] = useState(false)
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null)
  const lastActivityRef = useRef(Date.now())

  useEffect(() => {
    // Simulate boot sequence
    const timer = setTimeout(() => {
      setIsBooting(false)
    }, 2500)

    return () => clearTimeout(timer)
  }, [])

  // Idle animation detection
  useEffect(() => {
    // Function to reset idle timer
    const resetIdleTimer = () => {
      lastActivityRef.current = Date.now()

      if (isIdle) {
        setIsIdle(false)
      }

      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current)
      }

      // Set new idle timer (2 minutes)
      idleTimerRef.current = setTimeout(
        () => {
          const now = Date.now()
          const timeSinceLastActivity = now - lastActivityRef.current

          // If more than 2 minutes have passed
          if (timeSinceLastActivity >= 2 * 60 * 1000) {
            setIsIdle(true)
          }
        },
        2 * 60 * 1000,
      ) // 2 minutes
    }

    // Set up event listeners for user activity
    const activityEvents = ["mousedown", "mousemove", "keydown", "scroll", "touchstart"]

    activityEvents.forEach((event) => {
      window.addEventListener(event, resetIdleTimer)
    })

    // Initial setup
    resetIdleTimer()

    // Cleanup
    return () => {
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current)
      }

      activityEvents.forEach((event) => {
        window.removeEventListener(event, resetIdleTimer)
      })
    }
  }, [isIdle])

  if (isBooting) {
    return <BootSequence />
  }

  return (
    <div className="flex h-screen bg-black text-foreground overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-auto p-6">
        <AnimatePresence>
          {isIdle && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center"
            >
              <div className="relative w-full h-full">
                {/* Floating cyber elements */}
                <motion.div
                  className="absolute"
                  animate={{
                    x: [0, window.innerWidth * 0.8, 0],
                    y: [0, window.innerHeight * 0.8, 0],
                  }}
                  transition={{
                    duration: 20,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                  }}
                >
                  <div className="w-16 h-16 rounded-full bg-cyan-500/20 border border-cyan-500/50 flex items-center justify-center text-cyan-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                    </svg>
                  </div>
                </motion.div>

                <motion.div
                  className="absolute"
                  animate={{
                    x: [window.innerWidth * 0.2, window.innerWidth * 0.5, window.innerWidth * 0.2],
                    y: [window.innerHeight * 0.3, window.innerHeight * 0.7, window.innerHeight * 0.3],
                  }}
                  transition={{
                    duration: 15,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                  }}
                >
                  <div className="w-12 h-12 rounded-full bg-pink-500/20 border border-pink-500/50 flex items-center justify-center text-pink-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                    </svg>
                  </div>
                </motion.div>

                <motion.div
                  className="absolute"
                  animate={{
                    x: [window.innerWidth * 0.7, window.innerWidth * 0.3, window.innerWidth * 0.7],
                    y: [window.innerHeight * 0.1, window.innerHeight * 0.5, window.innerHeight * 0.1],
                  }}
                  transition={{
                    duration: 18,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                  }}
                >
                  <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path>
                    </svg>
                  </div>
                </motion.div>

                {/* Center message */}
                <motion.div
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center"
                  animate={{
                    scale: [1, 1.05, 1],
                    opacity: [0.8, 1, 0.8],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                  }}
                >
                  <div className="bg-black/70 backdrop-blur-sm p-6 rounded-lg border border-cyan-900">
                    <h2 className="text-2xl font-bold text-cyan-400 mb-2">System Idle</h2>
                    <p className="text-gray-300">Move your mouse or press any key to continue</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-7xl mx-auto space-y-8"
        >
          {/* Top row with System Metrics and Time Widget */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <div className="md:col-span-4">
              <SystemMetrics />
            </div>
            <div className="md:col-span-1">
              <TimeWidget />
            </div>
          </div>

          {/* Middle row with Social Feed and Weather side by side */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-3">
              <SocialFeedWidget />
            </div>
            <div className="md:col-span-1">
              <WeatherWidget />
            </div>
          </div>

          {/* Bottom row with Services */}
          <ServiceGrid />
        </motion.div>
      </main>
    </div>
  )
}

function BootSequence() {
  return (
    <div className="flex items-center justify-center h-screen bg-black">
      <div className="flex flex-col items-center">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <svg
            width="80"
            height="80"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-cyan-500"
          >
            <motion.path
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="text-2xl font-bold text-cyan-500 mb-4"
        >
          CYBER COMMAND
        </motion.h1>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: 200 }}
          transition={{ delay: 1, duration: 1 }}
          className="h-1 bg-cyan-500 rounded-full"
        />
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.5 }}
          className="mt-4 text-cyan-400 text-sm"
        >
          Initializing system...
        </motion.p>
      </div>
    </div>
  )
}

