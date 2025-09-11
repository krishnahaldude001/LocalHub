import { Metadata } from 'next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { prisma } from '@/lib/db'
import { config, getAreasForLocation } from '@/lib/config'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Calendar, MapPin } from 'lucide-react'

// Force dynamic rendering to avoid build-time database calls
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: `Latest News | ${config.appName}`,
  description: `Stay updated with the latest news and community updates from ${config.defaultLocation.areas.join(', ')} areas.`,
}

export default async function NewsPage() {
  const areas = getAreasForLocation()
  const news = await prisma.post.findMany({
    where: { published: true },
    orderBy: { publishedAt: 'desc' },
  })

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Latest <span className="text-primary">News</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Stay updated with the latest news and community updates from {areas.join(', ')} areas.
        </p>
        <div className="flex flex-wrap justify-center gap-2 mt-6">
          {areas.map((area) => (
            <Badge key={area} className="text-sm px-3 py-1 bg-gradient-primary text-white border-0">
              <MapPin className="h-3 w-3 mr-1" />
              {area}
            </Badge>
          ))}
        </div>
      </div>

      {/* News Grid */}
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
