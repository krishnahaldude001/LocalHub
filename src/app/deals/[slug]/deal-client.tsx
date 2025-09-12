"use client"

import ClickTracker from '@/components/click-tracker'

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
  return (
    <ClickTracker
      dealId={deal.id}
      affiliateUrl={deal.affiliateUrl}
      platformName={deal.platform.name}
      className="w-full h-12 text-lg"
      size="lg"
    />
  )
}
