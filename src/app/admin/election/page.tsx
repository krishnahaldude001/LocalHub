import { Metadata } from 'next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Plus, FileText, BarChart3, Download, Calendar, User, Tag, Eye } from 'lucide-react'
import ElectionActions from '@/components/election-actions'
import ElectionFilter from '@/components/election-filter'
import { createPrismaClient } from '@/lib/db-connection'

export const metadata: Metadata = {
  title: 'Election Management | Admin Dashboard',
  description: 'Manage election articles, data, and analytics.',
}

// Load articles from database
async function getElectionArticles() {
  const prisma = createPrismaClient()
  const rows = await prisma.election.findMany({
    orderBy: { publishedAt: 'desc' }
  })

  return rows.map((a) => ({
    id: a.id,
    title: a.title,
    excerpt: a.description || '',
    category: a.category,
    area: a.area,
    author: a.author,
    publishedAt: a.publishedAt.toISOString(),
    readTime: '—',
    views: a.viewCount,
    status: a.published ? 'published' : 'draft',
    hasPDF: false,
    hasData: false,
    tags: [] as string[],
  }))
}

// Load categories from database
async function getCategories() {
  const prisma = createPrismaClient()
  const articles = await prisma.election.findMany({
    select: { category: true }
  })
  
  // Count articles by category
  const categoryCounts = articles.reduce((acc, article) => {
    acc[article.category] = (acc[article.category] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  
  return Object.entries(categoryCounts).map(([name, count]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    count,
    slug: name.toLowerCase()
  }))
}

export default async function ElectionManagementPage() {
  const electionArticles = await getElectionArticles()
  const categories = await getCategories()

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Election Management</h1>
          <p className="text-muted-foreground">Manage election articles, data, and analytics</p>
        </div>
        <Link href="/admin/election/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add New Article
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Articles</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{electionArticles.length}</div>
            <p className="text-xs text-muted-foreground">All articles in database</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{electionArticles.filter(a => a.status === 'published').length}</div>
            <p className="text-xs text-muted-foreground">{Math.round((electionArticles.filter(a => a.status === 'published').length / electionArticles.length) * 100) || 0}% of total</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Drafts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{electionArticles.filter(a => a.status === 'draft').length}</div>
            <p className="text-xs text-muted-foreground">{Math.round((electionArticles.filter(a => a.status === 'draft').length / electionArticles.length) * 100) || 0}% of total</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{electionArticles.reduce((sum, article) => sum + article.views, 0)}</div>
            <p className="text-xs text-muted-foreground">Across all articles</p>
          </CardContent>
        </Card>
      </div>


      {/* Articles List with Filtering */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">All Articles</h2>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </Button>
          </div>
        </div>
        
        <ElectionFilter articles={electionArticles} categories={categories} />
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks for managing election content</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/admin/election/new">
              <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                <Plus className="h-6 w-6" />
                <span>Add New Article</span>
              </Button>
            </Link>
            <Link href="/admin/election/analytics">
              <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                <BarChart3 className="h-6 w-6" />
                <span>View Analytics</span>
              </Button>
            </Link>
            <Link href="/admin/election/settings">
              <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                <FileText className="h-6 w-6" />
                <span>Settings</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}