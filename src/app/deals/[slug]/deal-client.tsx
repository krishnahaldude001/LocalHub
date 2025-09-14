"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ShoppingCart, ExternalLink, CreditCard, Eye } from 'lucide-react'
import Link from 'next/link'
import ClickTracker from '@/components/click-tracker'
import CODOrderForm from '@/components/cod-order-form'

interface DealClientProps {
  deal: {
    id: string
    title: string
    salePrice: number
    price: number
    affiliateUrl: string | null
    platform: {
      name: string
    } | null
    shop: {
      name: string
      slug: string
      phone?: string
      whatsapp?: string
    } | null
    cod: boolean
  }
}

export default function DealClient({ deal }: DealClientProps) {
  const [isLoading, setIsLoading] = useState(false)

  // If it's an affiliate deal with a valid URL
  if (deal.platform && deal.affiliateUrl) {
    return (
      <ClickTracker
        dealId={deal.id}
        affiliateUrl={deal.affiliateUrl}
        platformName={deal.platform?.name || deal.shop?.name || 'Local Shop'}
        className="w-full h-12 text-lg"
        size="lg"
      />
    )
  }

  // If it's a local shop deal
  if (deal.shop) {
    return (
      <div className="space-y-3">
        {/* Shop Page Button */}
        <Link href={`/shop/${deal.shop.slug}`}>
          <Button className="w-full h-12 text-lg bg-blue-600 hover:bg-blue-700">
            <ExternalLink className="h-4 w-4 mr-2" />
            View All Deals from {deal.shop.name}
          </Button>
        </Link>
        
        {/* COD Button */}
        {deal.cod && deal.shop && (
          <CODOrderForm deal={deal as any} />
        )}
      </div>
    )
  }

  // Fallback
  return (
    <Button className="w-full h-12 text-lg" disabled>
      <ShoppingCart className="h-4 w-4 mr-2" />
      Deal Unavailable
    </Button>
  )
}
