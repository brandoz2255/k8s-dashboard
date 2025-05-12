"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Shield } from "lucide-react"

type BootSequenceProps = {
  onComplete: () => void
}

export function BootSequence({ onComplete }: BootSequenceProps) {
  const [bootStage, setBootStage] = useState(0)
  const bootMessages = [
    "Initializing system...",
    "Loading security protocols...",
    "Establishing secure connection...",
    "Scanning for threats...",
    "System ready.",
  ]

  useEffect(() => {
    if (bootStage < bootMessages.length - 1) {
      const timer = setTimeout(() => {
        setBootStage((prev) => prev + 1)
      }, 700)
      return () => clearTimeout(timer)
    } else {
      const timer = setTimeout(() => {
        onComplete()
      }, 700)
      return () => clearTimeout(timer)
    }
  }, [bootStage, bootMessages.length, onComplete])

  return (
    <motion.div
      className="fixed inset-0 bg-darkBlue flex flex-col items-center justify-center z-50"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
        className="mb-8"
      >
        <Shield className="h-24 w-24 text-neonBlue" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-2xl font-bold mb-8 text-neonBlue"
      >
        CYBER COMMAND CENTER
      </motion.div>

      <div className="space-y-2 w-80">
        {bootMessages.slice(0, bootStage + 1).map((message, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center"
          >
            <div className="w-4 h-4 rounded-full bg-neonBlue mr-3"></div>
            <div className="text-neonBlue font-mono">{message}</div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: bootStage / (bootMessages.length - 1) }}
        transition={{ type: "spring", stiffness: 100 }}
        className="h-1 bg-neonBlue mt-8 w-80 origin-left"
      />
    </motion.div>
  )
}

