'use client'

import { useEffect } from 'react'

interface ViewTrackerProps {
  type: 'deal' | 'post' | 'election'
  contentId: string
}

export default function ViewTracker({ type, contentId }: ViewTrackerProps) {
  useEffect(() => {
    const trackView = async () => {
      try {
        await fetch('/api/views', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type,
            contentId,
            userAgent: navigator.userAgent,
            referrer: document.referrer || null,
          }),
        })
      } catch (error) {
        console.error('Error tracking view:', error)
      }
    }

    // Track view after a short delay to ensure it's a real view
    const timer = setTimeout(trackView, 1000)
    
    return () => clearTimeout(timer)
  }, [type, contentId])

  return null // This component doesn't render anything
}
