import { Metadata } from 'next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { prisma } from '@/lib/db'
import { config, getAreasForLocation } from '@/lib/config'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Calendar, MapPin, Filter } from 'lucide-react'
import ClickableAreaBadges from '@/components/clickable-area-badges'

// Force dynamic rendering to avoid build-time database calls
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: `Latest News | ${config.appName}`,
  description: `Stay updated with the latest news and community updates from ${config.defaultLocation.areas.join(', ')} areas.`,
}

interface NewsPageProps {
  searchParams: {
    area?: string
  }
}

export default async function NewsPage({ searchParams }: NewsPageProps) {
  const areas = getAreasForLocation()
  const selectedArea = searchParams.area
  
  // Add error handling for database connection
  let news = []
  try {
    if (!prisma) {
      throw new Error('Prisma client is not initialized')
    }
    
    // Build where clause based on area filter
    const whereClause: any = { published: true }
    if (selectedArea) {
      whereClause.area = selectedArea
    }
    
    news = await prisma.post.findMany({
      where: whereClause,
      orderBy: { publishedAt: 'desc' },
    })
  } catch (error) {
    console.error('Error fetching news:', error)
    // Return empty array if there's an error
    news = []
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          {selectedArea ? (
            <>
              <span className="text-primary">{selectedArea}</span> News
            </>
          ) : (
            <>
              Latest <span className="text-primary">News</span>
            </>
          )}
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          {selectedArea 
            ? `Stay updated with the latest news and community updates from ${selectedArea}.`
            : `Stay updated with the latest news and community updates from ${areas.join(', ')} areas.`
          }
        </p>
        
        {/* Area Filter */}
        <div className="mt-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Filter by area:</span>
          </div>
          <ClickableAreaBadges areas={areas} selectedArea={selectedArea} />
        </div>
        
        {/* Clear Filter Button */}
        {selectedArea && (
          <div className="mt-4">
            <Link href="/news">
              <Button variant="outline" size="sm">
                <MapPin className="h-4 w-4 mr-2" />
                Show All Areas
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* News Grid */}
      {news.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((post) => (
          <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative h-48">
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover"
              />
              <div className="absolute top-3 left-3">
                <Badge className="bg-gradient-primary text-white shadow-lg border-0">
                  {post.area}
                </Badge>
              </div>
            </div>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <Calendar className="h-4 w-4" />
                {formatDate(post.publishedAt)}
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
                  <Button variant="ghost" size="sm">
                    Read More
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="bg-muted/50 rounded-lg p-8">
            <h3 className="text-xl font-semibold mb-2">
              {selectedArea ? `No News Available for ${selectedArea}` : 'No News Available'}
            </h3>
            <p className="text-muted-foreground mb-4">
              {selectedArea 
                ? `We don't have any news articles for ${selectedArea} yet. Try selecting a different area or check back soon!`
                : "We're working on bringing you the latest news. Please check back soon!"
              }
            </p>
            {selectedArea && (
              <Link href="/news">
                <Button variant="outline">
                  <MapPin className="h-4 w-4 mr-2" />
                  View All Areas
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}

      {/* CTA Section */}
      <div className="mt-16 text-center">
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-4">Stay Updated</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Get the latest news and updates about your area delivered to your inbox.
          </p>
          <Link href="/contact">
            <Button size="lg">
              Contact Us
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
