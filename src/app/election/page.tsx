import { Metadata } from 'next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { ArrowRight, FileText, BarChart3, Users, MapPin, TrendingUp, Download, Eye, Calendar } from 'lucide-react'
import { prisma } from '@/lib/db'

export const metadata: Metadata = {
  title: 'Election Articles & Analytics | LocalHub',
  description: 'Comprehensive election articles, data analysis, and insights for Govandi, Shivaji Nagar, and Baiganwadi areas.',
}

// Fetch election articles from database
async function getElectionArticles() {
  try {
    const articles = await prisma.election.findMany({
      where: { published: true },
      orderBy: { publishedAt: 'desc' }
    })

    return articles.map(article => ({
      id: article.id,
      title: article.title,
      excerpt: article.description || '',
      category: article.category,
      area: article.area,
      author: article.author,
      publishedAt: article.publishedAt.toISOString().split('T')[0],
      readTime: '8 min read', // Default read time
      views: article.viewCount,
      image: article.image || '/election/demographics-chart.svg',
      hasPDF: false, // This field doesn't exist in database
      hasData: false, // This field doesn't exist in database
      tags: [] // This field doesn't exist in database
    }))
  } catch (error) {
    console.error('Error fetching election articles:', error)
    return []
  }
}

// Get categories from database
async function getCategories() {
  try {
    const articles = await prisma.election.findMany({
      where: { published: true },
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
      icon: <FileText className="h-5 w-5" />
    }))
  } catch (error) {
    console.error('Error fetching categories:', error)
    return []
  }
}

export default async function ElectionPage() {
  const electionArticles = await getElectionArticles()
  const categories = await getCategories()

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <Badge className="mb-4 bg-gradient-primary text-white border-0">
          Election 2025
        </Badge>
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Election <span className="text-primary">Articles</span> & Analytics
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
          Comprehensive election articles, data analysis, and insights for Govandi, Shivaji Nagar, and Baiganwadi areas. 
          Each article contains unique data, charts, PDFs, and detailed explanations.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="#articles">
            <Button size="lg" className="text-lg px-8 py-3">
              Browse Articles
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </Link>
          <Button variant="outline" size="lg" className="text-lg px-8 py-3">
            <BarChart3 className="h-5 w-5 mr-2" />
            View Analytics
          </Button>
        </div>
      </div>

      {/* Categories */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-12">Article Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex justify-center mb-4 text-primary">
                  {category.icon}
                </div>
                <CardTitle className="text-lg">{category.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge variant="outline">{category.count} articles</Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Featured Articles */}
      <div id="articles" className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-12">Latest Election Articles</h2>
        {electionArticles.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Election Articles Yet</h3>
            <p className="text-muted-foreground mb-6">
              Check back soon for comprehensive election articles, data analysis, and insights.
            </p>
            <Button variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              Subscribe for Updates
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {electionArticles.map((article, index) => (
            <Card key={article.id} className="hover:shadow-lg transition-shadow">
              <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 rounded-t-lg flex items-center justify-center">
                {article.image ? (
                  <img 
                    src={article.image} 
                    alt={article.title}
                    className="w-full h-full object-cover rounded-t-lg"
                  />
                ) : (
                  <FileText className="h-12 w-12 text-primary" />
                )}
              </div>
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="text-xs">{article.category}</Badge>
                  <Badge variant="secondary" className="text-xs">{article.area}</Badge>
                </div>
                <CardTitle className="text-lg line-clamp-2">{article.title}</CardTitle>
                <CardDescription className="line-clamp-2">{article.excerpt}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                  <span>{article.author}</span>
                  <span>{article.readTime}</span>
                </div>
                
                <div className="flex items-center gap-2 mb-4">
                  <Eye className="h-4 w-4" />
                  <span className="text-sm">{article.views} views</span>
                  {article.hasPDF && (
                    <Badge variant="outline" className="text-xs">
                      <Download className="h-3 w-3 mr-1" />
                      PDF
                    </Badge>
                  )}
                  {article.hasData && (
                    <Badge variant="outline" className="text-xs">
                      <BarChart3 className="h-3 w-3 mr-1" />
                      Data
                    </Badge>
                  )}
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                  {article.tags.map((tag, tagIndex) => (
                    <Badge key={tagIndex} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Link href={`/election/articles/${article.id}`} className="flex-1">
                    <Button className="w-full">
                      Read Article
                    </Button>
                  </Link>
                  {article.hasPDF && (
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
          </div>
        )}
      </div>

      {/* Data & Analytics Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-12">Data & Analytics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="text-center">
            <CardHeader>
              <BarChart3 className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle>Interactive Charts</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Dynamic charts and graphs showing voting patterns, demographics, and trends.
              </p>
              <Button variant="outline">View Charts</Button>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Download className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle>Downloadable Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                PDF reports with detailed analysis, charts, and actionable insights.
              </p>
              <Button variant="outline">Download PDFs</Button>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <TrendingUp className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle>Real-time Updates</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Live updates on election trends, polling data, and community insights.
              </p>
              <Button variant="outline">View Updates</Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-12">
        <h2 className="text-3xl font-bold mb-4">Stay Informed with Data-Driven Insights</h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          Access comprehensive election articles with unique data, interactive charts, and downloadable reports.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="#articles">
            <Button size="lg" className="text-lg px-8 py-3">
              Explore All Articles
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </Link>
          <Button variant="outline" size="lg" className="text-lg px-8 py-3">
            Subscribe for Updates
          </Button>
        </div>
      </div>
    </div>
  )
}