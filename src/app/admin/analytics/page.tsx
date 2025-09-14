import { Metadata } from 'next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getDeals, getPosts, getClicks, getUsers } from '@/lib/simple-db'
import { config } from '@/lib/config'
import { 
  TrendingUp, 
  Users, 
  Eye, 
  ShoppingCart, 
  Newspaper,
  Calendar,
  MapPin,
  Star
} from 'lucide-react'

// Force dynamic rendering to avoid build-time database calls
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Analytics Dashboard | Admin Dashboard',
  description: 'View performance metrics and analytics',
}

export default async function AnalyticsPage() {
  // Fetch analytics data using simple connection with error handling
  let deals = []
  let clicks = []
  let posts = []
  let users = []

  try {
    const [
      dealsData,
      clicksData,
      postsData,
      usersData
    ] = await Promise.all([
      getDeals(100).catch(() => []),
      getClicks().catch(() => []),
      getPosts(100).catch(() => []),
      getUsers().catch(() => [])
    ])
    
    deals = dealsData || []
    clicks = clicksData || []
    posts = postsData || []
    users = usersData || []
  } catch (error) {
    console.error('Error fetching analytics data:', error)
    // Use empty arrays as fallback
  }

  // Calculate basic metrics
  const totalClicks = clicks.length
  const totalDeals = deals.length
  const totalPosts = posts.length
  const totalUsers = users.length
  const avgClicksPerDeal = totalDeals > 0 ? (totalClicks / totalDeals).toFixed(1) : 0

  // Platform performance
  const platformData = deals.reduce((acc, deal) => {
    // Handle deals without platforms (local shop deals)
    const platform = deal.platform?.name || 'Local Shops'
    const clicks = deal._count?.clicks || 0
    if (!acc[platform]) {
      acc[platform] = { platform, clicks: 0, deals: 0 }
    }
    acc[platform].clicks += clicks
    acc[platform].deals += 1
    return acc
  }, {} as Record<string, { platform: string; clicks: number; deals: number }>)

  const topPlatforms = (Object.values(platformData) as { platform: string; clicks: number; deals: number }[])
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, 5)

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        <p className="text-muted-foreground">Performance metrics and insights</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Deals</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDeals}</div>
            <p className="text-xs text-muted-foreground">
              Active product deals
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClicks}</div>
            <p className="text-xs text-muted-foreground">
              Affiliate link clicks
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">News Articles</CardTitle>
            <Newspaper className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPosts}</div>
            <p className="text-xs text-muted-foreground">
              Published articles
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              Registered users
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Average Clicks per Deal</CardTitle>
            <CardDescription>Performance across all deals</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{avgClicksPerDeal}</div>
            <p className="text-sm text-muted-foreground mt-2">
              Based on {totalDeals} deals and {totalClicks} total clicks
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Performing Platforms</CardTitle>
            <CardDescription>Platforms with most clicks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topPlatforms.length > 0 ? (
                topPlatforms.map((platform, index) => (
                  <div key={platform.platform} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Badge variant="outline">{index + 1}</Badge>
                      <span className="font-medium">{platform.platform}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{platform.clicks}</div>
                      <div className="text-xs text-muted-foreground">{platform.deals} deals</div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-4">
                  No platform data available
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest clicks and interactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {clicks.slice(0, 10).map((click, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">Deal Click</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(click.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <Badge variant="outline">Click</Badge>
              </div>
            ))}
            {clicks.length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                No clicks recorded yet
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
