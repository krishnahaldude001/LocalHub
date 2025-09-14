import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { prisma } from '@/lib/db'
import { config } from '@/lib/config'
import { formatDate } from '@/lib/utils'
import RichTextRenderer from '@/components/rich-text-renderer'
import YouTubeEmbed from '@/components/youtube-embed'
import { extractYouTubeFromContent, parseContentWithYouTube } from '@/lib/content-utils'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Calendar, MapPin, User, Tag } from 'lucide-react'
import ViewTracker from '@/components/view-tracker'
import SocialSharing from '@/components/social-sharing'

// Force dynamic rendering to avoid build-time database calls
export const dynamic = 'force-dynamic'

interface NewsPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: NewsPageProps): Promise<Metadata> {
  const post = await prisma.post.findUnique({
    where: { slug: params.slug },
  })
  
  if (!post) {
    return {
      title: `News Not Found - ${config.appName}`,
      description: 'The requested news article could not be found.',
    }
  }

  return {
    title: `${post.title} - ${config.appName}`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.image],
      type: 'article',
      publishedTime: post.publishedAt.toISOString(),
      authors: [post.author],
    },
  }
}

export default async function NewsPage({ params }: NewsPageProps) {
  const post = await prisma.post.findUnique({
    where: { slug: params.slug },
  })
  
  if (!post) {
    notFound()
  }

  // Parse the content to handle JSON format
  const parsedContent = parseContentWithYouTube(post.content)

  // Find related posts (same area or category)
  const relatedPosts = await prisma.post.findMany({
    where: {
      AND: [
        { id: { not: post.id } },
        { published: true },
        {
          OR: [
            { area: post.area },
            { category: post.category }
          ]
        }
      ]
    },
    take: 3,
    orderBy: { publishedAt: 'desc' },
  })

  return (
    <div className="container mx-auto px-4 py-8">
      {/* View Tracker */}
      <ViewTracker type="post" contentId={post.id} />
      
      {/* Back Button */}
      <div className="mb-6">
        <Link href="/news">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to News
          </Button>
        </Link>
      </div>

      {/* Article Header */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="secondary">
            <MapPin className="h-3 w-3 mr-1" />
            {post.area}
          </Badge>
          <Badge variant="outline">
            <Tag className="h-3 w-3 mr-1" />
            {post.category}
          </Badge>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {formatDate(post.publishedAt)}
          </div>
          <div className="flex items-center gap-1">
            <User className="h-4 w-4" />
            {post.author}
          </div>
        </div>
      </div>

      {/* Featured Image */}
      <div className="relative h-64 md:h-96 mb-8 rounded-2xl overflow-hidden">
        <Image
          src={post.image}
          alt={post.title}
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Article Content */}
      <div className="max-w-4xl mx-auto">
        <div className="prose prose-lg max-w-none mb-12">
          <p className="text-xl text-muted-foreground mb-6 leading-relaxed">
            {post.excerpt}
          </p>
          
          {/* YouTube Video */}
          {parsedContent.youtubeUrl && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-3">Related Video</h3>
              <YouTubeEmbed 
                url={parsedContent.youtubeUrl} 
                title={post.title}
                className="w-full"
              />
            </div>
          )}
          
          <div className="text-base leading-relaxed">
            <RichTextRenderer content={parsedContent.content} />
          </div>
        </div>

        {/* Article Footer */}
        <div className="border-t pt-8 mb-12">
          <div className="space-y-6">
            {/* Social Sharing */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <SocialSharing 
                title={post.title}
                url={`${config.appUrl}/news/${post.slug}`}
                description={post.excerpt || ''}
              />
            </div>
            
            {/* Tags */}
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-sm text-muted-foreground">Tags:</span>
              <Badge variant="outline">{post.area}</Badge>
              <Badge variant="outline">{post.category}</Badge>
              <Badge variant="outline">Local News</Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Related News</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedPosts.map((relatedPost) => (
              <Card key={relatedPost.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48">
                  <Image
                    src={relatedPost.image}
                    alt={relatedPost.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge variant="secondary" className="bg-background/80">
                      {relatedPost.area}
                    </Badge>
                  </div>
                </div>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <Calendar className="h-4 w-4" />
                    {formatDate(relatedPost.publishedAt)}
                  </div>
                  <CardTitle className="line-clamp-2 text-lg">
                    <Link href={`/news/${relatedPost.slug}`} className="hover:text-primary transition-colors">
                      {relatedPost.title}
                    </Link>
                  </CardTitle>
                  <CardDescription className="line-clamp-2">
                    {relatedPost.excerpt}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{relatedPost.category}</Badge>
                    <Link href={`/news/${relatedPost.slug}`}>
                      <Button variant="ghost" size="sm">
                        Read More
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
          <h2 className="text-2xl font-bold mb-4">Stay Updated with Local News</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Get the latest updates about your area and community events delivered to your inbox.
          </p>
          <Link href="/news">
            <Button size="lg">
              Browse All News
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
