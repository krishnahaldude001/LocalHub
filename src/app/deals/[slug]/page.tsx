import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { config } from '@/lib/config'
import { formatDate, formatPrice, getDiscountPercentage, getPlatformColor, getPlatformName } from '@/lib/utils'
import { prisma, parseGallery } from '@/lib/db'
import YouTubeEmbed from '@/components/youtube-embed'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Star, MapPin, Calendar, ExternalLink, ShoppingCart, CreditCard } from 'lucide-react'
import DealClient from './deal-client'
import ViewTracker from '@/components/view-tracker'
import SocialSharing from '@/components/social-sharing'

// Force dynamic rendering to avoid build-time database calls
export const dynamic = 'force-dynamic'

interface DealsPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: DealsPageProps): Promise<Metadata> {
  const deal = await prisma.deal.findUnique({
    where: { slug: params.slug },
    include: { platform: true, shop: true }
  })

  if (!deal) {
    return {
      title: 'Deal Not Found',
    }
  }

  return {
    title: `${deal.title} | ${config.appName}`,
    description: deal.description || `Great deal on ${deal.title}`,
  }
}

export default async function DealsPage({ params }: DealsPageProps) {
  const deal = await prisma.deal.findUnique({
    where: { slug: params.slug },
    include: { platform: true, shop: true }
  })
  
  if (!deal) {
    notFound()
  }

  // Transform deal data
  const dealData = {
    ...deal,
    gallery: parseGallery(deal.gallery)
  }

  // Find related deals (same area or platform)
  const relatedDeals = await prisma.deal.findMany({
    where: {
      AND: [
        { id: { not: deal.id } },
        {
          OR: [
            { area: deal.area },
            { platformId: deal.platformId },
            { shopId: deal.shopId }
          ]
        }
      ]
    },
    include: { platform: true, shop: true },
    take: 3
  })

  // Transform related deals
  const relatedDealsData = relatedDeals.map(relatedDeal => ({
    ...relatedDeal,
    gallery: parseGallery(relatedDeal.gallery)
  }))

  return (
    <div className="container mx-auto px-4 py-8">
      {/* View Tracker */}
      <ViewTracker type="deal" contentId={deal.id} />
      
      {/* Back Button */}
      <div className="mb-6">
        <Link href="/deals">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Deals
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="relative h-96 rounded-2xl overflow-hidden">
            <Image
              src={dealData.image || '/placeholder-product.svg'}
              alt={dealData.title}
              fill
              className="object-cover"
              priority
            />
            {dealData.salePrice && (
              <div className="absolute top-4 right-4">
                <Badge className="bg-red-500 text-white text-lg px-3 py-1">
                  -{getDiscountPercentage(dealData.price, dealData.salePrice)}%
                </Badge>
              </div>
            )}
          </div>
          
          {/* Gallery */}
          {dealData.gallery.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {dealData.gallery.map((image, index) => (
                <div key={index} className="relative h-20 rounded-lg overflow-hidden">
                  <Image
                    src={image}
                    alt={`${dealData.title} ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {/* Platform and Rating */}
          <div className="flex items-center justify-between">
            <Badge className={`${dealData.platform?.color || 'bg-blue-500'} text-white`}>
              {dealData.platform?.name || dealData.shop?.name || 'Local Shop'}
            </Badge>
            <div className="flex items-center gap-1">
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold">{dealData.rating}</span>
              <span className="text-muted-foreground">/5</span>
            </div>
          </div>

          {/* Title and Description */}
          <div>
            <h1 className="text-3xl font-bold mb-3">{dealData.title}</h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              {dealData.description}
            </p>
          </div>

          {/* Price */}
          <div className="space-y-2">
            {dealData.salePrice ? (
              <div className="flex items-center gap-3">
                <span className="text-4xl font-bold text-primary">
                  {formatPrice(dealData.salePrice)}
                </span>
                <span className="text-2xl text-muted-foreground line-through">
                  {formatPrice(dealData.price)}
                </span>
                <Badge className="bg-green-500 text-white">
                  Save {formatPrice(dealData.price - dealData.salePrice)}
                </Badge>
              </div>
            ) : (
              <span className="text-4xl font-bold text-primary">
                {formatPrice(dealData.price)}
              </span>
            )}
          </div>

          {/* Features */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Available in {dealData.area}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Published {formatDate(dealData.publishedAt.toISOString())}
              </span>
            </div>
            {dealData.cod && (
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-600 font-medium">Cash on Delivery Available</span>
              </div>
            )}
          </div>

          {/* YouTube Video */}
          {dealData.youtubeUrl && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Product Video</h3>
              <YouTubeEmbed 
                url={dealData.youtubeUrl} 
                title={dealData.title}
                className="w-full"
              />
            </div>
          )}

          {/* CTA Buttons */}
          <div className="space-y-6">
            <DealClient deal={{
              ...dealData,
              salePrice: dealData.salePrice || dealData.price,
              price: dealData.price || 0,
              shop: dealData.shop ? {
                name: dealData.shop.name,
                slug: dealData.shop.slug,
                phone: dealData.shop.phone,
                whatsapp: dealData.shop.whatsapp || undefined
              } : null
            }} />
            
            {/* Social Sharing */}
            <div className="border-t pt-6">
              <SocialSharing 
                title={dealData.title}
                url={`${config.appUrl}/deals/${dealData.slug}`}
                description={`Check out this amazing deal: ${dealData.title} - ${dealData.salePrice ? formatPrice(dealData.salePrice) : formatPrice(dealData.price)}`}
              />
            </div>
            
            <div className="text-center">
              <p className="text-xs text-muted-foreground">
                This is an affiliate link. We may earn a commission from qualifying purchases.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Related Deals */}
      {relatedDealsData.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Related Deals</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedDealsData.map((relatedDeal) => (
              <Card key={relatedDeal.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48">
                  <Image
                    src={relatedDeal.image || '/placeholder-product.svg'}
                    alt={relatedDeal.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge variant="secondary" className="bg-background/80">
                      {relatedDeal.area}
                    </Badge>
                  </div>
                  {relatedDeal.salePrice && (
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-red-500 text-white">
                        -{getDiscountPercentage(relatedDeal.price, relatedDeal.salePrice)}%
                      </Badge>
                    </div>
                  )}
                </div>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <Badge className={relatedDeal.platform?.color || 'bg-blue-500'}>
                      {relatedDeal.platform?.name || relatedDeal.shop?.name || 'Local Shop'}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{relatedDeal.rating}</span>
                    </div>
                  </div>
                  <CardTitle className="line-clamp-2 text-lg">
                    <Link href={`/deals/${relatedDeal.slug}`} className="hover:text-primary transition-colors">
                      {relatedDeal.title}
                    </Link>
                  </CardTitle>
                  <CardDescription className="line-clamp-2">
                    {relatedDeal.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {relatedDeal.salePrice ? (
                          <>
                            <span className="text-lg font-bold text-primary">
                              {formatPrice(relatedDeal.salePrice)}
                            </span>
                            <span className="text-sm text-muted-foreground line-through">
                              {formatPrice(relatedDeal.price)}
                            </span>
                          </>
                        ) : (
                          <span className="text-lg font-bold text-primary">
                            {formatPrice(relatedDeal.price)}
                          </span>
                        )}
                      </div>
                      {relatedDeal.cod && (
                        <Badge variant="outline" className="text-xs">
                          COD
                        </Badge>
                      )}
                    </div>
                    <Link href={`/deals/${relatedDeal.slug}`}>
                      <Button className="w-full">
                        View Deal
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* CTA Section */}
      <div className="mt-16 text-center">
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-4">Discover More Amazing Deals</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Explore our curated collection of the best deals from Amazon, Flipkart, and Meesho.
          </p>
          <Link href="/deals">
            <Button size="lg">
              Browse All Deals
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
