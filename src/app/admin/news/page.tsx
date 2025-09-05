import { Metadata } from 'next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { prisma } from '@/lib/db'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'
import Image from 'next/image'
import { Plus, Edit, Trash2, Eye, Calendar, MapPin, Tag } from 'lucide-react'

export const metadata: Metadata = {
  title: 'News Management | Admin Dashboard',
  description: 'Manage news articles and content',
}

export default async function NewsManagementPage() {
  const news = await prisma.post.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">News Management</h1>
          <p className="text-muted-foreground">Manage news articles and content</p>
        </div>
        <Link href="/admin/news/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add New Article
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Articles</CardTitle>
            <Badge variant="secondary">{news.length}</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{news.length}</div>
            <p className="text-xs text-muted-foreground">Published articles</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <Badge variant="secondary">{new Set(news.map(p => p.category)).size}</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{new Set(news.map(p => p.category)).size}</div>
            <p className="text-xs text-muted-foreground">Different categories</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Areas Covered</CardTitle>
            <Badge variant="secondary">{new Set(news.map(p => p.area)).size}</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{new Set(news.map(p => p.area)).size}</div>
            <p className="text-xs text-muted-foreground">Coverage areas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Authors</CardTitle>
            <Badge variant="secondary">{new Set(news.map(p => p.author)).size}</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{new Set(news.map(p => p.author)).size}</div>
            <p className="text-xs text-muted-foreground">Different authors</p>
          </CardContent>
        </Card>
      </div>

      {/* Articles List */}
      <Card>
        <CardHeader>
          <CardTitle>All Articles</CardTitle>
          <CardDescription>
            Manage your news articles. Click edit to modify content.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {news.map((article) => (
              <div key={article.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                {/* Article Image */}
                <div className="relative h-16 w-16 rounded-lg overflow-hidden">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Article Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium truncate">{article.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline">{article.category}</Badge>
                    <Badge variant="secondary">{article.area}</Badge>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {formatDate(article.publishedAt.toISOString())}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                    <span>By {article.author}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Link href={`/news/${article.slug}`} target="_blank">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href={`/admin/news/${article.id}/edit`}>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Add New Article</CardTitle>
            <CardDescription>Create a new news article</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin/news/new">
              <Button className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Create Article
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Manage Categories</CardTitle>
            <CardDescription>Organize articles by categories</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" disabled>
              <Tag className="h-4 w-4 mr-2" />
              Manage Categories
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Bulk Operations</CardTitle>
            <CardDescription>Import, export, or bulk edit articles</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" disabled>
              <Edit className="h-4 w-4 mr-2" />
              Bulk Operations
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
