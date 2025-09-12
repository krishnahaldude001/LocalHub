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
import AnalyticsCharts from './analytics-charts'

// Force dynamic rendering to avoid build-time database calls
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Analytics Dashboard | Admin Dashboard',
  description: 'View performance metrics and analytics',
}

export default async function AnalyticsPage() {
  // Fetch analytics data using simple connection
  const [
    deals,
    clicks,
    posts,
    users
  ] = await Promise.all([
    getDeals(100),
    getClicks(),
    getPosts(100),
    getUsers()
  ])

  // Calculate metrics
  const totalClicks = clicks.length
  const totalDeals = deals.length
  const totalPosts = posts.length
  const totalUsers = users.length
  const avgClicksPerDeal = totalDeals > 0 ? (totalClicks / totalDeals).toFixed(1) : 0

  // Platform performance
  const platformData = deals.reduce((acc, deal) => {
    const platform = deal.platform.name
    const clicks = deal._count?.clicks || 0
    if (!acc[platform]) {
      acc[platform] = { platform, clicks: 0, deals: 0 }
    }
    acc[platform].clicks += clicks
    acc[platform].deals += 1
    return acc
  }, {} as Record<string, { platform: string; clicks: number; deals: number }>)

  const platformChartData = (Object.values(platformData) as { platform: string; clicks: number; deals: number }[]).map(item => ({
    platform: item.platform,
    clicks: item.clicks,
    deals: item.deals
  }))

  // Area performance
  const areaData = deals.reduce((acc, deal) => {
    const area = deal.area
    const clicks = deal._count?.clicks || 0
    if (!acc[area]) {
      acc[area] = { area, clicks: 0, deals: 0 }
    }
    acc[area].clicks += clicks
    acc[area].deals += 1
    return acc
  }, {} as Record<string, { area: string; clicks: number; deals: number }>)

  const areaChartData = (Object.values(areaData) as { area: string; clicks: number; deals: number }[]).map(item => ({
    area: item.area,
    clicks: item.clicks,
    deals: item.deals
  }))

  // Category performance for posts
  const categoryData = posts.reduce((acc, post) => {
    const category = post.category
    if (!acc[category]) {
      acc[category] = { posts: 0 }
    }
    acc[category].posts += 1
    return acc
  }, {} as Record<string, { posts: number }>)

  const categoryChartData = Object.entries(categoryData).map(([category, data]) => ({
    category,
    posts: data.posts
  }))

  // Recent activity (last 7 days)
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  const recentClicks = clicks.filter(click => 
    new Date(click.createdAt) >= sevenDaysAgo
  )

  // Daily clicks for the last 7 days
  const dailyClicks = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (6 - i))
    const dayClicks = recentClicks.filter(click => {
      const clickDate = new Date(click.createdAt)
      return clickDate.toDateString() === date.toDateString()
    }).length
    
    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      clicks: dayClicks
    }
  })


  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Performance metrics and insights</p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClicks}</div>
            <p className="text-xs text-muted-foreground">
              +{recentClicks.length} in last 7 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Deals</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDeals}</div>
            <p className="text-xs text-muted-foreground">
              Active deals
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
            <CardTitle className="text-sm font-medium">Avg Clicks/Deal</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgClicksPerDeal}</div>
            <p className="text-xs text-muted-foreground">
              Performance metric
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <AnalyticsCharts
        platformChartData={platformChartData}
        areaChartData={areaChartData}
        categoryChartData={categoryChartData}
        dailyClicks={dailyClicks}
        topDeals={deals.map(deal => ({
          id: deal.id,
          title: deal.title,
          platform: deal.platform.name,
          area: deal.area,
          rating: deal.rating,
          _count: deal._count
        }))}
      />
    </div>
  )
}
