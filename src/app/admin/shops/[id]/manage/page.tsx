import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { createPrismaClient } from '@/lib/db-connection'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertCircle, 
  Phone, 
  Mail,
  MapPin,
  Calendar,
  Store,
  User,
  FileText
} from 'lucide-react'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'
import ShopManagementForm from './shop-management-form'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

interface ManagePageProps {
  params: {
    id: string
  }
}

async function getShopDetails(shopId: string) {
  const prisma = createPrismaClient()
  try {
    const shop = await prisma.shop.findUnique({
      where: { id: shopId },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        },
        deals: {
          select: {
            id: true,
            title: true,
            createdAt: true,
            isActive: true
          },
          orderBy: { createdAt: 'desc' }
        },
        orders: {
          select: {
            id: true,
            totalAmount: true,
            status: true,
            createdAt: true,
            customerName: true
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    })
    return shop
  } catch (error) {
    console.error('Error fetching shop details:', error)
    return null
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

export default async function ShopManagePage({ params }: ManagePageProps) {
  const session = await getServerSession(authOptions)
  
  if (!session || (session.user as any)?.role !== 'admin') {
    notFound()
  }

  const shop = await getShopDetails(params.id)

  if (!shop) {
    notFound()
  }

  const totalRevenue = shop.orders.reduce((sum, order) => sum + order.totalAmount, 0)
  const activeDeals = shop.deals.filter(deal => deal.isActive).length

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Manage Shop</h1>
            <p className="text-gray-600">Manage shop account and activation status</p>
          </div>
          <Link href="/admin/shops">
            <Button variant="outline">
              ← Back to Shops
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Shop Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl">{shop.name}</CardTitle>
                  <CardDescription className="mt-1">
                    {shop.ownerName} • {shop.category}
                  </CardDescription>
                </div>
                {getStatusBadge(shop.status)}
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Contact Information */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Contact Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span>{shop.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span>{shop.phone}</span>
                    </div>
                    {shop.whatsapp && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <span>WhatsApp: {shop.whatsapp}</span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span>{shop.area}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span>Registered: {formatDate(shop.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div>
                <h3 className="font-semibold mb-2">Address</h3>
                <p className="text-sm text-gray-600">{shop.address}</p>
              </div>

              {/* Description */}
              {shop.description && (
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-sm text-gray-600">{shop.description}</p>
                </div>
              )}

              {/* Business Hours */}
              {shop.businessHours && (
                <div>
                  <h3 className="font-semibold mb-2">Business Hours</h3>
                  <p className="text-sm text-gray-600">{shop.businessHours}</p>
                </div>
              )}

              {/* Activation Notes */}
              {shop.activationNotes && (
                <div>
                  <h3 className="font-semibold mb-2">Admin Notes</h3>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700">{shop.activationNotes}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Shop Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Store className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold">{activeDeals}</p>
                    <p className="text-sm text-gray-600">Active Deals</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold">{shop.orders.length}</p>
                    <p className="text-sm text-gray-600">Total Orders</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="text-2xl font-bold">₹{totalRevenue.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">Total Revenue</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Management Panel */}
        <div className="space-y-6">
          <ShopManagementForm shop={shop} />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-8">
        <Tabs defaultValue="deals" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="deals">Recent Deals</TabsTrigger>
            <TabsTrigger value="orders">Recent Orders</TabsTrigger>
          </TabsList>

          <TabsContent value="deals" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Deals</CardTitle>
              </CardHeader>
              <CardContent>
                {shop.deals.length > 0 ? (
                  <div className="space-y-3">
                    {shop.deals.slice(0, 5).map((deal) => (
                      <div key={deal.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{deal.title}</p>
                          <p className="text-sm text-gray-500">{formatDate(deal.createdAt)}</p>
                        </div>
                        <Badge variant={deal.isActive ? "default" : "secondary"}>
                          {deal.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">No deals found</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
              </CardHeader>
              <CardContent>
                {shop.orders.length > 0 ? (
                  <div className="space-y-3">
                    {shop.orders.slice(0, 5).map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{order.customerName}</p>
                          <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">₹{order.totalAmount}</p>
                          <Badge variant="outline">{order.status}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">No orders found</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
