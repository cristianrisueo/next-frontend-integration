"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"

interface FloatingNotificationProps {
  message: string | null
  type?: 'success' | 'error' | 'info'
  duration?: number
  onClose?: () => void
}

export default function FloatingNotification({ 
  message, 
  type = 'success', 
  duration = 4000,
  onClose 
}: FloatingNotificationProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (message) {
      setIsVisible(true)
      setIsAnimating(true)
      
      // Auto-hide after duration
      const timer = setTimeout(() => {
        handleClose()
      }, duration)

      return () => clearTimeout(timer)
    } else {
      setIsVisible(false)
      setIsAnimating(false)
    }
  }, [message, duration])

  const handleClose = () => {
    setIsAnimating(false)
    
    // Wait for exit animation to complete before hiding
    setTimeout(() => {
      setIsVisible(false)
      onClose?.()
    }, 300) // Match the transition duration
  }

  if (!isVisible || !message) {
    return null
  }

  const getNotificationStyles = () => {
    switch (type) {
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800'
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800'
      case 'success':
      default:
        return 'bg-green-50 border-green-200 text-green-800'
    }
  }

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      {/* Notification positioned at top of viewport */}
      <div className="flex justify-center pt-4 px-4">
        <div
          className={`
            max-w-md w-full pointer-events-auto
            p-3 border rounded-lg shadow-lg
            transform transition-all duration-300 ease-out
            ${getNotificationStyles()}
            ${isAnimating 
              ? 'translate-y-0 opacity-100 scale-100' 
              : '-translate-y-8 opacity-0 scale-95'
            }
          `}
        >
          <div className="flex items-center justify-between">
            <span className="font-medium text-sm flex-1 pr-2">
              {message}
            </span>
            <button
              onClick={handleClose}
              className="flex-shrink-0 ml-2 hover:opacity-70 transition-opacity"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}