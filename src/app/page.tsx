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

// Force dynamic rendering to avoid build-time database calls
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: `${config.appName} - Mumbai Local News & Deals`,
  description: `${config.appDescription} in Mumbai - covering ${config.defaultLocation.areas.slice(0, 5).join(', ')} and more areas.`,
}

export default async function HomePage() {
  // Fetch deals and news from database using simple connection
  const [dbDeals, news] = await Promise.all([
    getDeals(6),
    getPosts(6)
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
            Welcome to <span className="text-gradient-primary">{config.appName}</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
            {config.appDescription} in Mumbai - covering {areas.slice(0, 5).join(', ')} and more areas.
          </p>
          
          {/* Enhanced Area Badges */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
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
        </div>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="news" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="news">Latest News</TabsTrigger>
          <TabsTrigger value="deals">Today's Deals</TabsTrigger>
        </TabsList>

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

        {/* Deals Tab */}
        <TabsContent value="deals" className="space-y-6">
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
                    <Link href={`/deals/${deal.slug}`}>
                      <Button className="w-full group/btn hover:shadow-md transition-all duration-200 bg-gradient-primary hover:opacity-90">
                        View Deal
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
          <h2 className="text-2xl font-bold mb-4">Stay Updated with Local News</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Get the latest updates about your area, exclusive deals, and community events delivered to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/news">
              <Button size="lg">
                Browse All News
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
            <Link href="/deals">
              <Button variant="outline" size="lg">
                Explore Deals
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
