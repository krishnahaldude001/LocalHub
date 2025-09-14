'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/lib/utils'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, ShoppingCart, Eye, CreditCard } from 'lucide-react'
import ClickTracker from '@/components/click-tracker'
import CODOrderForm from '@/components/cod-order-form'

interface DealCardProps {
  deal: {
    id: string
    slug: string
    title: string
    description?: string
    price: number
    salePrice?: number
    image?: string
    cod: boolean
    platform: {
      name: string
    } | null
    shop: {
      name: string
      slug?: string
      phone?: string
      whatsapp?: string
    } | null
    affiliateUrl?: string | null
  }
  showDirectLink?: boolean
  className?: string
}

export default function DealCard({ deal, showDirectLink = false, className = "" }: DealCardProps) {
  return (
    <Card className={`overflow-hidden hover:shadow-lg transition-shadow ${className}`}>
      <div className="relative h-48">
        <Image
          src={deal.image || '/placeholder-product.svg'}
          alt={deal.title}
          fill
          className="object-cover"
        />
        {deal.salePrice && (
          <div className="absolute top-3 right-3">
            <Badge className="bg-red-500 text-white shadow-lg border-0">
              -{Math.round(((deal.price - deal.salePrice) / deal.price) * 100)}%
            </Badge>
          </div>
        )}
      </div>
      
      <CardHeader className="pb-3">
        <CardTitle className="line-clamp-2 text-lg">
          <Link href={`/deals/${deal.slug}`} className="hover:text-primary transition-colors">
            {deal.title}
          </Link>
        </CardTitle>
        {deal.description && (
          <CardDescription className="line-clamp-2">
            {deal.description}
          </CardDescription>
        )}
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {deal.salePrice ? (
                <>
                  <span className="text-2xl font-bold text-primary bg-primary/10 px-2 py-1 rounded-md">
                    {formatPrice(deal.salePrice)}
                  </span>
                  <span className="text-sm text-muted-foreground line-through">
                    {formatPrice(deal.price)}
                  </span>
                </>
              ) : (
                <span className="text-2xl font-bold text-primary">
                  {formatPrice(deal.price)}
                </span>
              )}
            </div>
            {deal.cod && (
              <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                💳 COD
              </Badge>
            )}
          </div>
          
          <div className="space-y-2">
            {/* View Details Button - Always show */}
            <Link href={`/deals/${deal.slug}`}>
              <Button className="w-full group/btn hover:shadow-md transition-all duration-200 bg-blue-600 hover:bg-blue-700">
                <Eye className="h-4 w-4 mr-2" />
                View Details
                <ArrowRight className="h-4 w-4 ml-1 group-hover/btn:translate-x-1 transition-transform duration-200" />
              </Button>
            </Link>
            
            {/* Buy/COD Button - Show based on deal type */}
            {deal.platform && deal.affiliateUrl ? (
              // Affiliate deal - show buy button
              <ClickTracker
                dealId={deal.id}
                affiliateUrl={deal.affiliateUrl}
                platformName={deal.platform.name}
                className="w-full group/btn hover:shadow-md transition-all duration-200 bg-gradient-primary hover:opacity-90"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Buy on {deal.platform.name}
                <ArrowRight className="h-4 w-4 ml-1 group-hover/btn:translate-x-1 transition-transform duration-200" />
              </ClickTracker>
            ) : deal.cod && deal.shop ? (
              // Local shop deal with COD - use CODOrderForm
              <CODOrderForm deal={deal as any} />
            ) : null}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
