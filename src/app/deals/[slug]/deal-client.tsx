"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ShoppingCart } from 'lucide-react'

interface DealClientProps {
  deal: {
    id: string
    affiliateUrl: string
    platform: {
      name: string
    }
  }
}

export default function DealClient({ deal }: DealClientProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleAffiliateClick = async () => {
    setIsLoading(true)
    try {
      // Track the click
      await fetch('/api/click', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ dealId: deal.id }),
      })
      
      // Redirect to affiliate URL
      window.open(deal.affiliateUrl, '_blank', 'rel=sponsored nofollow')
    } catch (error) {
      console.error('Error tracking click:', error)
      // Fallback: redirect directly
      window.open(deal.affiliateUrl, '_blank', 'rel=sponsored nofollow')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      onClick={handleAffiliateClick}
      disabled={isLoading}
      className="w-full h-12 text-lg"
      size="lg"
    >
      {isLoading ? (
        'Opening...'
      ) : (
        <>
          <ShoppingCart className="h-5 w-5 mr-2" />
          Open on {deal.platform.name}
        </>
      )}
    </Button>
  )
}
