import { Metadata } from 'next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { getDeals, getUsers, getClicks, getPostCount } from '@/lib/simple-db'
import { config } from '@/lib/config'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { hasPermission, getAdminNavItems, type UserRole } from '@/lib/roles'
import { createPrismaClient } from '@/lib/db-connection'
import Link from 'next/link'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Star, 
  MapPin, 
  Users, 
  BarChart3,
  Settings,
  FileText,
  ShoppingBag,
  Newspaper,
  Globe,
  Phone,
  Store
} from 'lucide-react'

// Force dynamic rendering to avoid build-time database calls
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Admin Dashboard | LocalHub',
  description: 'Complete control panel for LocalHub website management',
}

export default async function AdminDashboard() {
  // Get current user session and role
  const session = await getServerSession(authOptions)
  const userRole = (session?.user as any)?.role as UserRole || 'user'
  
  // Fetch all data for dashboard using simple connection
  const [deals, newsCount, clickStats, users] = await Promise.all([
    getDeals(100), // Get more deals for dashboard
    getPostCount(),
    getClicks(),
    getUsers()
  ])

  // Get shop statistics
  const prisma = createPrismaClient()
  let shopStats = { total: 0, pending: 0 }
  try {
    const [totalShops, pendingShops] = await Promise.all([
      prisma.shop.count(),
      prisma.shop.count({ where: { status: 'pending' } })
    ])
    shopStats = { total: totalShops, pending: pendingShops }
  } catch (error) {
    console.error('Error fetching shop stats:', error)
  } finally {
    await prisma.$disconnect()
  }

  const totalClicks = clickStats.length
  const totalDeals = deals.length
  const totalNews = newsCount
  const totalUsers = users.length

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold">Dashboard</h1>
          <div className="text-muted-foreground">
            Welcome back, {session?.user?.name || session?.user?.email} 
            {userRole !== 'user' && (
              <Badge variant="outline" className="ml-2">{userRole}</Badge>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          {hasPermission(userRole, 'canManageSettings') && (
            <Link href="/admin/settings">
              <Button variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Site Settings
              </Button>
            </Link>
          )}
          {hasPermission(userRole, 'canViewAnalytics') && (
            <Link href="/admin/analytics">
              <Button variant="outline">
                <BarChart3 className="h-4 w-4 mr-2" />
                Analytics
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Deals</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDeals}</div>
            <p className="text-xs text-muted-foreground">
              Active deals in database
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">News Articles</CardTitle>
            <Newspaper className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalNews}</div>
            <p className="text-xs text-muted-foreground">
              Published articles
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClicks}</div>
            <p className="text-xs text-muted-foreground">
              Affiliate clicks tracked
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Coverage Areas</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{config.defaultLocation.areas.length}</div>
            <p className="text-xs text-muted-foreground">
              Active areas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Management Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Deals Management - Only show if user can manage deals */}
        {hasPermission(userRole, 'canManageDeals') && (
          <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              Deals Management
            </CardTitle>
            <CardDescription>Manage product deals and offers</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Total Deals</span>
              <Badge variant="secondary">{totalDeals}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Total Clicks</span>
              <Badge variant="secondary">{totalClicks}</Badge>
            </div>
            <div className="flex gap-2">
              <Link href="/admin/deals" className="flex-1">
                <Button className="w-full" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  View All
                </Button>
              </Link>
              <Link href="/admin/deals/new">
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
        )}

        {/* News Management - Only show if user can manage news */}
        {hasPermission(userRole, 'canManageNews') && (
          <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Newspaper className="h-5 w-5" />
              News Management
            </CardTitle>
            <CardDescription>Manage news articles and content</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Published Articles</span>
              <Badge variant="secondary">{totalNews}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Categories</span>
              <Badge variant="secondary">6</Badge>
            </div>
            <div className="flex gap-2">
              <Link href="/admin/news" className="flex-1">
                <Button className="w-full" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  View All
                </Button>
              </Link>
              <Link href="/admin/news/new">
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
        )}

        {/* Pages Management - Only show if user can manage pages */}
        {hasPermission(userRole, 'canManagePages') && (
          <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Pages Management
            </CardTitle>
            <CardDescription>Edit static pages content</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Static Pages</span>
              <Badge variant="secondary">5</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Last Updated</span>
              <Badge variant="secondary">Today</Badge>
            </div>
            <div className="flex gap-2">
              <Link href="/admin/pages" className="flex-1">
                <Button className="w-full" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  Manage
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
        )}

        {/* Shops Management - Only show if user can manage shops */}
        {hasPermission(userRole, 'canManageShops') && (
          <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Store className="h-5 w-5" />
              Shops Management
            </CardTitle>
            <CardDescription>Manage shop registrations and activations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Total Shops</span>
              <Badge variant="secondary">{shopStats.total}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Pending Activation</span>
              <Badge variant="secondary">{shopStats.pending}</Badge>
            </div>
            <div className="flex gap-2">
              <Link href="/admin/shops" className="flex-1">
                <Button className="w-full" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  Manage Shops
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
        )}

        {/* Contact Management - Only show if user can manage settings */}
        {hasPermission(userRole, 'canManageSettings') && (
          <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Contact Management
            </CardTitle>
            <CardDescription>Manage business contact information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Email</span>
              <Badge variant="secondary">{config.contact.email}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Phone</span>
              <Badge variant="secondary">{config.contact.phone}</Badge>
            </div>
            <div className="flex gap-2">
              <Link href="/admin/contact" className="flex-1">
                <Button className="w-full" size="sm">
                  <Phone className="h-4 w-4 mr-2" />
                  Manage
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
        )}

        {/* Site Settings - Only show if user can manage settings */}
        {hasPermission(userRole, 'canManageSettings') && (
          <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Site Settings
            </CardTitle>
            <CardDescription>Configure website settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">App Name</span>
              <Badge variant="secondary">{config.appName}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Areas</span>
              <Badge variant="secondary">{config.defaultLocation.areas.length}</Badge>
            </div>
            <div className="flex gap-2">
              <Link href="/admin/settings" className="flex-1">
                <Button className="w-full" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Configure
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
        )}

        {/* User Management - Only show if user can manage users */}
        {hasPermission(userRole, 'canManageUsers') && (
          <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              User Management
            </CardTitle>
            <CardDescription>Manage users and permissions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Total Users</span>
              <Badge variant="secondary">{totalUsers}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Admins</span>
              <Badge variant="secondary">{users.filter(u => u.role === 'admin').length}</Badge>
            </div>
            <div className="flex gap-2">
              <Link href="/admin/users" className="flex-1">
                <Button className="w-full" size="sm">
                  <Users className="h-4 w-4 mr-2" />
                  Manage
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
        )}

        {/* Platform Management - Only show if user can manage platforms */}
        {hasPermission(userRole, 'canManagePlatforms') && (
          <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Platform Management
            </CardTitle>
            <CardDescription>Manage e-commerce platforms</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Total Platforms</span>
              <Badge variant="secondary">20+</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Active Platforms</span>
              <Badge variant="secondary">All</Badge>
            </div>
            <div className="flex gap-2">
              <Link href="/admin/platforms" className="flex-1">
                <Button className="w-full" size="sm">
                  <Globe className="h-4 w-4 mr-2" />
                  Manage
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
        )}

        {/* Analytics - Only show if user can view analytics */}
        {hasPermission(userRole, 'canViewAnalytics') && (
          <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Analytics
            </CardTitle>
            <CardDescription>View performance metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Page Views</span>
              <Badge variant="secondary">-</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Conversion Rate</span>
              <Badge variant="secondary">-</Badge>
            </div>
            <div className="flex gap-2">
              <Link href="/admin/analytics" className="flex-1">
                <Button className="w-full" size="sm">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  View Reports
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
        )}
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest changes and updates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {deals.slice(0, 5).map((deal) => (
              <div key={deal.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <ShoppingBag className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{deal.title}</p>
                     <p className="text-sm text-muted-foreground">
                       {deal._count?.clicks || 0} clicks • {deal.area}
                     </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{deal.platform?.name || deal.shop?.name || 'Local Shop'}</Badge>
                  <Link href={`/admin/deals/${deal.id}/edit`}>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
