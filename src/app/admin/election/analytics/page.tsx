import { Metadata } from 'next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { ArrowLeft, Download, BarChart3, TrendingUp, Eye, Users, Calendar, FileText } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Election Analytics | Admin Dashboard',
  description: 'Analytics and insights for election articles and content.',
}

const analyticsData = {
  overview: {
    totalViews: 4080,
    totalDownloads: 234,
    totalArticles: 12,
    avgReadTime: '8.5 min'
  },
  topArticles: [
    {
      id: '1',
      title: 'Voter Demographics Analysis 2025',
      views: 1250,
      downloads: 45,
      category: 'Demographics',
      area: 'Govandi'
    },
    {
      id: '2',
      title: 'Youth Voting Trends 2025',
      views: 1100,
      downloads: 38,
      category: 'Trends',
      area: 'All Areas'
    },
    {
      id: '3',
      title: 'Constituency Performance Report',
      views: 980,
      downloads: 32,
      category: 'Constituency',
      area: 'Shivaji Nagar'
    }
  ],
  categoryStats: [
    { category: 'Demographics', articles: 3, views: 1850, downloads: 67 },
    { category: 'Trends', articles: 4, views: 2100, downloads: 89 },
    { category: 'Constituency', articles: 2, views: 980, downloads: 32 },
    { category: 'Issues', articles: 2, views: 750, downloads: 28 },
    { category: 'Analytics', articles: 1, views: 400, downloads: 18 }
  ],
  areaStats: [
    { area: 'Govandi', articles: 4, views: 1650, downloads: 58 },
    { area: 'Shivaji Nagar', articles: 3, views: 1200, downloads: 42 },
    { area: 'Baiganwadi', articles: 2, views: 800, downloads: 28 },
    { area: 'All Areas', articles: 3, views: 1430, downloads: 106 }
  ]
}

export default function ElectionAnalyticsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/election">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Election Management
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Election Analytics</h1>
          <p className="text-muted-foreground">Insights and performance metrics for election content</p>
        </div>
        <div className="ml-auto">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.overview.totalViews.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Downloads</CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.overview.totalDownloads}</div>
            <p className="text-xs text-muted-foreground">+8% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Articles</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.overview.totalArticles}</div>
            <p className="text-xs text-muted-foreground">+2 this month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Read Time</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.overview.avgReadTime}</div>
            <p className="text-xs text-muted-foreground">+0.5 min from last month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Articles */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Articles</CardTitle>
            <CardDescription>Most viewed and downloaded articles</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.topArticles.map((article, index) => (
                <div key={article.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline">{article.category}</Badge>
                      <Badge variant="secondary">{article.area}</Badge>
                    </div>
                    <h3 className="font-medium text-sm">{article.title}</h3>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {article.views} views
                      </span>
                      <span className="flex items-center gap-1">
                        <Download className="h-3 w-3" />
                        {article.downloads} downloads
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">#{index + 1}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Category Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Category Performance</CardTitle>
            <CardDescription>Views and engagement by category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.categoryStats.map((category, index) => (
                <div key={category.category} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{category.category}</span>
                    <span className="text-sm text-muted-foreground">{category.articles} articles</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4 text-blue-500" />
                      <span>{category.views.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Download className="h-4 w-4 text-green-500" />
                      <span>{category.downloads}</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full" 
                      style={{ width: `${(category.views / Math.max(...analyticsData.categoryStats.map(c => c.views))) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Area Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Area Performance</CardTitle>
            <CardDescription>Content performance by geographic area</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.areaStats.map((area, index) => (
                <div key={area.area} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{area.area}</span>
                    <span className="text-sm text-muted-foreground">{area.articles} articles</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4 text-blue-500" />
                      <span>{area.views.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Download className="h-4 w-4 text-green-500" />
                      <span>{area.downloads}</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-secondary h-2 rounded-full" 
                      style={{ width: `${(area.views / Math.max(...analyticsData.areaStats.map(a => a.views))) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Engagement Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Engagement Trends</CardTitle>
            <CardDescription>Content engagement over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center py-8">
                <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Chart visualization would go here</p>
                <p className="text-sm text-muted-foreground">Views, downloads, and engagement over time</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common analytics tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <Download className="h-6 w-6" />
              <span>Export Data</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <BarChart3 className="h-6 w-6" />
              <span>Generate Report</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <TrendingUp className="h-6 w-6" />
              <span>View Trends</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
