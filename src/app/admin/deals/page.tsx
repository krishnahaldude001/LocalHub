import { Metadata } from 'next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { prisma, parseGallery } from '@/lib/db'
import { formatDate, formatPrice, getPlatformColor, getPlatformName } from '@/lib/utils'
import Link from 'next/link'
import Image from 'next/image'
import { Plus, Edit, Trash2, Eye, Star, MapPin } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Deals Management | Admin Dashboard',
  description: 'Manage product deals and offers',
}

export default async function DealsManagementPage() {
  // Fetch all deals from database
  const deals = await prisma.deal.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      platform: true,
      _count: {
        select: { clicks: true }
      }
    }
  })

  // Transform deals data
  const dealsData = deals.map(deal => ({
    ...deal,
    gallery: parseGallery(deal.gallery),
    clickCount: deal._count.clicks
  }))

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Deals Management</h1>
          <p className="text-muted-foreground">Manage product deals and offers</p>
        </div>
        <Link href="/admin/deals/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add New Deal
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Deals</CardTitle>
            <Badge variant="secondary">{dealsData.length}</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dealsData.length}</div>
            <p className="text-xs text-muted-foreground">Active deals in database</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
            <Badge variant="secondary">
              {dealsData.reduce((sum, deal) => sum + deal.clickCount, 0)}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dealsData.reduce((sum, deal) => sum + deal.clickCount, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Affiliate clicks tracked</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Platforms</CardTitle>
            <Badge variant="secondary">
              {new Set(dealsData.map(d => d.platform.name)).size}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(dealsData.map(d => d.platform.name)).size}
            </div>
            <p className="text-xs text-muted-foreground">Different platforms</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Areas</CardTitle>
            <Badge variant="secondary">
              {new Set(dealsData.map(d => d.area)).size}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(dealsData.map(d => d.area)).size}
            </div>
            <p className="text-xs text-muted-foreground">Coverage areas</p>
          </CardContent>
        </Card>
      </div>

      {/* Deals Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Deals</CardTitle>
          <CardDescription>
            View, edit, and delete deals from your database
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dealsData.map((deal) => (
              <div key={deal.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                {/* Product Image */}
                <div className="relative h-16 w-16 rounded-lg overflow-hidden">
                  <Image
                    src={deal.image || '/placeholder-product.svg'}
                    alt={deal.title}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Deal Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium truncate">{deal.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className={deal.platform.color}>
                      {deal.platform.name}
                    </Badge>
                    <Badge variant="outline">{deal.area}</Badge>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs">{deal.rating}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <span>{formatPrice(deal.salePrice || deal.price)}</span>
                    <span>{deal.clickCount} clicks</span>
                    <span>{formatDate(deal.createdAt.toISOString())}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Link href={`/deals/${deal.slug}`} target="_blank">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href={`/admin/deals/${deal.id}/edit`}>
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

            {dealsData.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No deals found. Create your first deal!</p>
                <Link href="/admin/deals/new" className="mt-4 inline-block">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Deal
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Add New Deal</CardTitle>
            <CardDescription>Create a new product deal</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin/deals/new">
              <Button className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add New Deal
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Bulk Import</CardTitle>
            <CardDescription>Import deals from CSV or other sources</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" disabled>
              <Plus className="h-4 w-4 mr-2" />
              Import Deals
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Analytics</CardTitle>
            <CardDescription>View deal performance and click tracking</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" disabled>
              <Eye className="h-4 w-4 mr-2" />
              View Analytics
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
