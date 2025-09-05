"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts'
import { Star } from 'lucide-react'

interface AnalyticsChartsProps {
  platformChartData: Array<{ platform: string; clicks: number; deals: number }>
  areaChartData: Array<{ area: string; clicks: number; deals: number }>
  categoryChartData: Array<{ category: string; count: number }>
  dailyClicks: Array<{ date: string; clicks: number }>
  topDeals: Array<{
    id: string
    title: string
    platform: string
    area: string
    rating: number | null
    _count: { clicks: number }
  }>
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

export default function AnalyticsCharts({
  platformChartData,
  areaChartData,
  categoryChartData,
  dailyClicks,
  topDeals
}: AnalyticsChartsProps) {
  return (
    <>
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Daily Clicks Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Daily Clicks (Last 7 Days)</CardTitle>
            <CardDescription>Click activity over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dailyClicks}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="clicks" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Platform Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Platform Performance</CardTitle>
            <CardDescription>Clicks by platform</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={platformChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="platform" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="clicks" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Area Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Area Performance</CardTitle>
            <CardDescription>Clicks by coverage area</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={areaChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ area, percent }) => `${area} ${((percent || 0) * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="clicks"
                >
                  {areaChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* News Categories */}
        <Card>
          <CardHeader>
            <CardTitle>News Categories</CardTitle>
            <CardDescription>Articles by category</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryChartData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="category" type="category" width={100} />
                <Tooltip />
                <Bar dataKey="count" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Performing Deals */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Deals</CardTitle>
          <CardDescription>Deals with the most clicks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topDeals
              .sort((a, b) => b._count.clicks - a._count.clicks)
              .slice(0, 5)
              .map((deal, index) => (
                <div key={deal.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="font-medium">{deal.title}</h4>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Badge variant="outline">{deal.platform}</Badge>
                        <Badge variant="secondary">{deal.area}</Badge>
                        {deal.rating && (
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span>{deal.rating}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">{deal._count.clicks}</div>
                    <div className="text-sm text-muted-foreground">clicks</div>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </>
  )
}
