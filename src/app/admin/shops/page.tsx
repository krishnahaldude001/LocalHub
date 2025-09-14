import { Suspense } from 'react'
import { createPrismaClient } from '@/lib/db-connection'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertCircle, 
  Eye, 
  Phone, 
  Mail,
  MapPin,
  Calendar
} from 'lucide-react'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

async function getShops() {
  const prisma = createPrismaClient()
  try {
    const shops = await prisma.shop.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        },
        _count: {
          select: {
            deals: true,
            orders: true
          }
        }
      }
    })
    return shops
  } catch (error) {
    console.error('Error fetching shops:', error)
    return []
  } finally {
    await prisma.$disconnect()
  }
}

function getStatusBadge(status: string) {
  switch (status) {
    case 'active':
      return <Badge className="bg-green-100 text-green-800 border-green-200"><CheckCircle className="h-3 w-3 mr-1" />Active</Badge>
    case 'pending':
      return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200"><Clock className="h-3 w-3 mr-1" />Pending</Badge>
    case 'suspended':
      return <Badge className="bg-orange-100 text-orange-800 border-orange-200"><AlertCircle className="h-3 w-3 mr-1" />Suspended</Badge>
    case 'rejected':
      return <Badge className="bg-red-100 text-red-800 border-red-200"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

function ShopCard({ shop }: { shop: any }) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{shop.name}</CardTitle>
            <CardDescription className="mt-1">
              {shop.ownerName} • {shop.category}
            </CardDescription>
          </div>
          {getStatusBadge(shop.status)}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Contact Information */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Mail className="h-4 w-4" />
            <span>{shop.email}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Phone className="h-4 w-4" />
            <span>{shop.phone}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="h-4 w-4" />
            <span>{shop.area}</span>
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-4 text-sm">
          <span className="text-gray-600">
            <strong>{shop._count.deals}</strong> deals
          </span>
          <span className="text-gray-600">
            <strong>{shop._count.orders}</strong> orders
          </span>
        </div>

        {/* Registration Date */}
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Calendar className="h-4 w-4" />
          <span>Registered: {formatDate(shop.createdAt)}</span>
        </div>

        {/* Activation Notes */}
        {shop.activationNotes && (
          <div className="p-2 bg-gray-50 rounded text-sm">
            <strong>Notes:</strong> {shop.activationNotes}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Link href={`/shop/${shop.slug}`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full">
              <Eye className="h-4 w-4 mr-1" />
              View Shop
            </Button>
          </Link>
          <Link href={`/admin/shops/${shop.id}/manage`} className="flex-1">
            <Button size="sm" className="w-full">
              Manage
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

export default async function AdminShopsPage() {
  const shops = await getShops()

  const pendingShops = shops.filter(shop => shop.status === 'pending')
  const activeShops = shops.filter(shop => shop.status === 'active')
  const suspendedShops = shops.filter(shop => shop.status === 'suspended')
  const rejectedShops = shops.filter(shop => shop.status === 'rejected')

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Shop Management</h1>
        <p className="text-gray-600">
          Manage shop registrations and activations
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-2xl font-bold">{pendingShops.length}</p>
                <p className="text-sm text-gray-600">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{activeShops.length}</p>
                <p className="text-sm text-gray-600">Active</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">{suspendedShops.length}</p>
                <p className="text-sm text-gray-600">Suspended</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-2xl font-bold">{rejectedShops.length}</p>
                <p className="text-sm text-gray-600">Rejected</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Shops Tabs */}
      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="pending">
            Pending ({pendingShops.length})
          </TabsTrigger>
          <TabsTrigger value="active">
            Active ({activeShops.length})
          </TabsTrigger>
          <TabsTrigger value="suspended">
            Suspended ({suspendedShops.length})
          </TabsTrigger>
          <TabsTrigger value="rejected">
            Rejected ({rejectedShops.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pendingShops.map((shop) => (
              <ShopCard key={shop.id} shop={shop} />
            ))}
            {pendingShops.length === 0 && (
              <div className="col-span-full text-center py-12 text-gray-500">
                No pending shop registrations
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="active" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeShops.map((shop) => (
              <ShopCard key={shop.id} shop={shop} />
            ))}
            {activeShops.length === 0 && (
              <div className="col-span-full text-center py-12 text-gray-500">
                No active shops
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="suspended" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {suspendedShops.map((shop) => (
              <ShopCard key={shop.id} shop={shop} />
            ))}
            {suspendedShops.length === 0 && (
              <div className="col-span-full text-center py-12 text-gray-500">
                No suspended shops
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="rejected" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rejectedShops.map((shop) => (
              <ShopCard key={shop.id} shop={shop} />
            ))}
            {rejectedShops.length === 0 && (
              <div className="col-span-full text-center py-12 text-gray-500">
                No rejected shops
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
