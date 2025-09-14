import { Metadata } from 'next'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { sampleDeals } from '@/lib/sample-data'
import { config, getAreasForLocation } from '@/lib/config'
import { formatDate, formatPrice, getDiscountPercentage, getPlatformColor, getPlatformName } from '@/lib/utils'
import { getDeals, getPosts } from '@/lib/simple-db'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Star, MapPin, Calendar } from 'lucide-react'
import ClickableAreaBadges from '@/components/clickable-area-badges'
import SocialMediaButtons from '@/components/social-media-buttons'
import DealCard from '@/components/deal-card'
import WhatsAppContact from '@/components/whatsapp-contact'

// Force dynamic rendering to avoid build-time database calls
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: `${config.appName} - Mumbai Local Deals & News`,
  description: `Discover amazing deals from local shops and stay updated with local news in Mumbai - covering ${config.defaultLocation.areas.slice(0, 5).join(', ')} and more areas.`,
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: { area?: string }
}) {
  // Fetch deals and news from database using simple connection
  const [dbDeals, news] = await Promise.all([
    getDeals(6, searchParams.area),
    getPosts(6, searchParams.area)
  ])

  // Transform database deals to match the expected format
  const deals = dbDeals.map(deal => ({
    ...deal,
    gallery: deal.gallery ? (typeof deal.gallery === 'string' && deal.gallery.startsWith('[') ? JSON.parse(deal.gallery) : [deal.gallery]) : []
  }))

  // Get areas for current location
  const areas = getAreasForLocation()
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Enhanced Hero Section */}
      <div className="relative text-center mb-16 overflow-hidden">
        {/* Enhanced Gradient Background */}
        <div className="absolute inset-0 bg-gradient-warm opacity-5 rounded-3xl -m-4"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10 rounded-3xl -m-4"></div>
        
        {/* Content */}
        <div className="relative z-10 py-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            {searchParams.area ? (
              <>
                <span className="text-gradient-primary">{searchParams.area}</span> Local Hub
              </>
            ) : (
              <>
                Welcome to <span className="text-gradient-primary">{config.appName}</span>
              </>
            )}
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
            {searchParams.area ? (
              `Discover amazing deals from local shops and stay updated with local news in ${searchParams.area}.`
            ) : (
              `Discover amazing deals from local shops and stay updated with local news in Mumbai - covering ${areas.slice(0, 5).join(', ')} and more areas.`
            )}
          </p>
          
          {/* Enhanced Area Badges */}
          <ClickableAreaBadges areas={areas} selectedArea={searchParams.area} />
          
          {/* Clear Location Button */}
          {searchParams.area && (
            <div className="mt-4">
              <Link href="/">
                <Button variant="outline" size="sm">
                  <MapPin className="h-4 w-4 mr-2" />
                  Show All Areas
                </Button>
              </Link>
            </div>
          )}
          
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
            <div className="bg-background/50 backdrop-blur-sm rounded-lg p-4 border border-border/50">
              <div className="text-2xl font-bold text-primary">{deals.length}+</div>
              <div className="text-sm text-muted-foreground">Active Deals</div>
            </div>
            <div className="bg-background/50 backdrop-blur-sm rounded-lg p-4 border border-border/50">
              <div className="text-2xl font-bold text-primary">{news.length}+</div>
              <div className="text-sm text-muted-foreground">Latest News</div>
            </div>
            <div className="bg-background/50 backdrop-blur-sm rounded-lg p-4 border border-border/50">
              <div className="text-2xl font-bold text-primary">{areas.length}</div>
              <div className="text-sm text-muted-foreground">Mumbai Areas</div>
            </div>
          </div>
          
          {/* WhatsApp Contact Button */}
          <div className="mt-8">
            <WhatsAppContact 
              message="Hi Krishna, I came from your website"
              className="shadow-lg"
            />
          </div>
        </div>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="deals" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="deals">Local Deals</TabsTrigger>
          <TabsTrigger value="news">Latest News</TabsTrigger>
        </TabsList>

        {/* Deals Tab */}
        <TabsContent value="deals" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {deals.map((deal) => (
              <DealCard key={deal.id} deal={deal} />
            ))}
          </div>
        </TabsContent>

        {/* News Tab */}
        <TabsContent value="news" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map((post) => (
              <Card key={post.id} className="group overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-border/50 hover:border-primary/20">
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Gradient overlay for better text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-gradient-primary text-white shadow-lg border-0">
                      {post.area}
                    </Badge>
                  </div>
                </div>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <Calendar className="h-4 w-4" />
                    {formatDate(post.publishedAt.toISOString())}
                  </div>
                  <CardTitle className="line-clamp-2 text-lg">
                    <Link href={`/news/${post.slug}`} className="hover:text-primary transition-colors">
                      {post.title}
                    </Link>
                  </CardTitle>
                  <CardDescription className="line-clamp-3">
                    {post.excerpt}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{post.category}</Badge>
                    <Link href={`/news/${post.slug}`}>
                      <Button variant="ghost" size="sm" className="group/btn hover:bg-gradient-primary hover:text-white transition-all duration-200">
                        Read More
                        <ArrowRight className="h-4 w-4 ml-1 group-hover/btn:translate-x-1 transition-transform duration-200" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

      </Tabs>

      {/* CTA Section */}
      <div className="mt-16 text-center">
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-4">Discover Local Deals & Stay Updated</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Find amazing deals from local shops in your area and stay updated with the latest local news and community events.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <Link href="/deals">
              <Button size="lg">
                Browse Local Deals
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
            <Link href="/shop/register">
              <Button variant="outline" size="lg">
                Register Your Shop
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
            <Link href="/news">
              <Button variant="outline" size="lg">
                Latest News
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>
          
          {/* Social Media Section */}
          <div className="border-t border-border/50 pt-6">
            <p className="text-sm text-muted-foreground mb-4">Follow us for instant updates</p>
            <SocialMediaButtons variant="outline" size="default" />
          </div>
        </div>
      </div>
    </div>
  )
}
