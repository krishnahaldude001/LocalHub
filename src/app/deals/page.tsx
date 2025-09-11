import { Metadata } from 'next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { config, getAreasForLocation } from '@/lib/config'
import { formatDate, formatPrice, getDiscountPercentage, getPlatformColor, getPlatformName } from '@/lib/utils'
import { prisma, parseGallery } from '@/lib/db'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Star, MapPin, Calendar } from 'lucide-react'

// Force dynamic rendering to avoid build-time database calls
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: `Best Deals | ${config.appName}`,
  description: `Discover amazing deals and offers from top platforms in ${config.defaultLocation.areas.join(', ')} areas.`,
}

export default async function DealsPage() {
  // Fetch deals from database
  const dbDeals = await prisma.deal.findMany({
    include: { platform: true },
    orderBy: { publishedAt: 'desc' }
  })

  // Transform database deals to match the expected format
  const deals = dbDeals.map(deal => ({
    ...deal,
    gallery: parseGallery(deal.gallery)
  }))

  const areas = getAreasForLocation()

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Enhanced Header */}
      <div className="relative text-center mb-16 overflow-hidden">
        {/* Enhanced Gradient Background */}
        <div className="absolute inset-0 bg-gradient-warm opacity-5 rounded-3xl -m-4"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10 rounded-3xl -m-4"></div>
        
        {/* Content */}
        <div className="relative z-10 py-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Best <span className="text-gradient-primary">Deals</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
            Discover amazing deals and offers from Amazon, Flipkart, and Meesho in {areas.join(', ')} areas.
          </p>
          
          {/* Enhanced Area Badges */}
          <div className="flex flex-wrap justify-center gap-3">
            {areas.map((area, index) => (
              <Badge 
                key={area} 
                className="text-sm px-4 py-2 hover:scale-105 transition-transform duration-200 cursor-default shadow-sm bg-gradient-primary text-white border-0"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <MapPin className="h-3 w-3 mr-2" />
                {area}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Deals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {deals.map((deal) => (
          <Card key={deal.id} className="group overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-border/50 hover:border-primary/20">
            <div className="relative h-48 overflow-hidden">
              <Image
                src={deal.image || '/placeholder-product.svg'}
                alt={deal.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {/* Gradient overlay for better text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="absolute top-3 left-3">
                <Badge className="bg-gradient-primary text-white shadow-lg border-0">
                  {deal.area}
                </Badge>
              </div>
              {deal.salePrice && (
                <div className="absolute top-3 right-3">
                  <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg animate-pulse">
                    -{getDiscountPercentage(deal.price, deal.salePrice)}%
                  </Badge>
                </div>
              )}
            </div>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between mb-2">
                <Badge className={deal.platform.color}>
                  {deal.platform.name}
                </Badge>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{deal.rating}</span>
                </div>
              </div>
              <CardTitle className="line-clamp-2 text-lg">
                <Link href={`/deals/${deal.slug}`} className="hover:text-primary transition-colors">
                  {deal.title}
                </Link>
              </CardTitle>
              <CardDescription className="line-clamp-2">
                {deal.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {deal.salePrice ? (
                      <>
                        <span className="text-2xl font-bold text-primary">
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
                    <Badge variant="outline" className="text-xs">
                      COD
                    </Badge>
                  )}
                </div>
                <Link href={`/deals/${deal.slug}`}>
                  <Button className="w-full">
                    View Deal
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* CTA Section */}
      <div className="mt-16 text-center">
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-4">Never Miss a Deal</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Get notified about the best deals and offers in your area.
          </p>
          <Link href="/contact">
            <Button size="lg">
              Get Notifications
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
