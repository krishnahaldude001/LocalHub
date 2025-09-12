'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ShoppingCart, ExternalLink } from 'lucide-react'

interface ClickTrackerProps {
  dealId: string
  affiliateUrl: string
  platformName: string
  children?: React.ReactNode
  className?: string
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

export default function ClickTracker({ 
  dealId, 
  affiliateUrl, 
  platformName, 
  children,
  className = "w-full",
  variant = "default",
  size = "default"
}: ClickTrackerProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleClick = async () => {
    setIsLoading(true)
    try {
      // Track the click
      await fetch('/api/click', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ dealId }),
      })
      
      // Redirect to affiliate URL
      window.open(affiliateUrl, '_blank', 'rel=sponsored nofollow')
    } catch (error) {
      console.error('Error tracking click:', error)
      // Fallback: redirect directly
      window.open(affiliateUrl, '_blank', 'rel=sponsored nofollow')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      onClick={handleClick}
      disabled={isLoading}
      className={className}
      variant={variant}
      size={size}
    >
      {isLoading ? (
        'Opening...'
      ) : (
        children || (
          <>
            <ShoppingCart className="h-4 w-4 mr-2" />
            Open on {platformName}
          </>
        )
      )}
    </Button>
  )
}
