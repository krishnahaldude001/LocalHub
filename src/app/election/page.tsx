import { Metadata } from 'next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { ArrowRight, FileText, BarChart3, Users, MapPin, TrendingUp, Download, Eye, Calendar } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Election Articles & Analytics | LocalHub',
  description: 'Comprehensive election articles, data analysis, and insights for Govandi, Shivaji Nagar, and Baiganwadi areas.',
}

export default function ElectionPage() {
  // Sample election articles - this would come from database
  const electionArticles = [
    {
      id: '1',
      title: 'Voter Demographics Analysis 2025',
      excerpt: 'Comprehensive analysis of voter demographics in Govandi, Shivaji Nagar, and Baiganwadi areas.',
      category: 'Demographics',
      area: 'Govandi',
      author: 'Election Analytics Team',
      publishedAt: '2025-01-15',
      readTime: '8 min read',
      views: 1250,
      image: '/election/demographics-chart.svg',
      hasPDF: true,
      hasData: true,
      tags: ['Demographics', 'Voting Patterns', 'Age Groups']
    },
    {
      id: '2', 
      title: 'Constituency Performance Report',
      excerpt: 'Detailed analysis of constituency performance and candidate profiles.',
      category: 'Constituency',
      area: 'Shivaji Nagar',
      author: 'Political Analyst',
      publishedAt: '2025-01-12',
      readTime: '12 min read',
      views: 980,
      image: '/election/constituency-map.svg',
      hasPDF: true,
      hasData: false,
      tags: ['Constituency', 'Candidates', 'Performance']
    },
    {
      id: '3',
      title: 'Infrastructure Development Impact',
      excerpt: 'How infrastructure projects are influencing voter decisions in local areas.',
      category: 'Issues',
      area: 'Baiganwadi',
      author: 'Infrastructure Expert',
      publishedAt: '2025-01-10',
      readTime: '6 min read',
      views: 750,
      image: '/election/infrastructure-chart.svg',
      hasPDF: false,
      hasData: true,
      tags: ['Infrastructure', 'Development', 'Voter Impact']
    },
    {
      id: '4',
      title: 'Youth Voting Trends 2025',
      excerpt: 'Analysis of youth participation and voting patterns in upcoming elections.',
      category: 'Trends',
      area: 'All Areas',
      author: 'Youth Analyst',
      publishedAt: '2025-01-08',
      readTime: '10 min read',
      views: 1100,
      image: '/election/youth-trends.svg',
      hasPDF: true,
      hasData: true,
      tags: ['Youth', 'Trends', 'Participation']
    }
  ]

  const categories = [
    { name: 'Demographics', count: 3, icon: <Users className="h-5 w-5" /> },
    { name: 'Constituency', count: 2, icon: <MapPin className="h-5 w-5" /> },
    { name: 'Trends', count: 4, icon: <TrendingUp className="h-5 w-5" /> },
    { name: 'Issues', count: 2, icon: <FileText className="h-5 w-5" /> }
  ]

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