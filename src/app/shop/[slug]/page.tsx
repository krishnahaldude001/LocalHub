import { notFound } from 'next/navigation'
import { createPrismaClient } from '@/lib/db-connection'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatPrice, getDiscountPercentage } from '@/lib/utils'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, MapPin, Phone, Mail, Clock, Star, ShoppingCart, CreditCard } from 'lucide-react'
import DealCard from '@/components/deal-card'

interface ShopPageProps {
  params: { slug: string }
}

export default async function ShopPage({ params }: ShopPageProps) {
  const prisma = createPrismaClient()
  
  try {
    // Get shop details
    const shop = await prisma.shop.findUnique({
      where: { slug: params.slug },
      include: {
        deals: {
          where: { isActive: true },
          include: { platform: true },
          orderBy: { publishedAt: 'desc' }
        }
      }
    })

    if (!shop) {
      notFound()
    }

    // Get active deals count
    const activeDealsCount = shop.deals.length

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center gap-4 mb-6">
              <Link href="/deals">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Deals
                </Button>
              </Link>
            </div>
            
            {/* Shop Info */}
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0">
                <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                  {shop.image ? (
                    <Image
                      src={shop.image}
                      alt={shop.name}
                      width={96}
                      height={96}
                      className="rounded-lg object-cover"
                    />
                  ) : (
                    <ShoppingCart className="h-8 w-8 text-gray-400" />
                  )}
                </div>
              </div>
              
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{shop.name}</h1>
                    <p className="text-gray-600 mb-4">{shop.description}</p>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {shop.area}
                      </div>
                      {shop.phone && (
                        <div className="flex items-center gap-1">
                          <Phone className="h-4 w-4" />
                          {shop.phone}
                        </div>
                      )}
                      {shop.email && (
                        <div className="flex items-center gap-1">
                          <Mail className="h-4 w-4" />
                          {shop.email}
                        </div>
                      )}
                    </div>
                    
                    {shop.businessHours && (
                      <div className="flex items-center gap-1 text-sm text-gray-500 mb-4">
                        <Clock className="h-4 w-4" />
                        {shop.businessHours}
                      </div>
                    )}
                  </div>
                  
                  <div className="text-right">
                    {shop.isVerified && (
                      <Badge className="bg-green-100 text-green-800 mb-2">
                        ✓ Verified Shop
                      </Badge>
                    )}
                    {shop.rating && (
                      <div className="flex items-center gap-1 text-sm">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{shop.rating}/5</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="text-2xl font-bold text-blue-600">{activeDealsCount}</div>
                <div className="text-sm text-gray-500">Active Deals</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-2xl font-bold text-green-600">{shop.totalOrders || 0}</div>
                <div className="text-sm text-gray-500">Total Orders</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-2xl font-bold text-purple-600">{shop.category}</div>
                <div className="text-sm text-gray-500">Category</div>
              </CardContent>
            </Card>
          </div>

          {/* Deals Section */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Available Deals</h2>
              <Badge variant="outline" className="text-sm">
                {activeDealsCount} deals available
              </Badge>
            </div>

            {activeDealsCount > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {shop.deals.map((deal) => (
                  <DealCard key={deal.id} deal={deal as any} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Deals</h3>
                  <p className="text-gray-500">This shop doesn't have any active deals at the moment.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    )
  } finally {
    await prisma.$disconnect()
  }
}

export async function generateMetadata({ params }: ShopPageProps) {
  const prisma = createPrismaClient()
  
  try {
    const shop = await prisma.shop.findUnique({
      where: { slug: params.slug }
    })

    if (!shop) {
      return {
        title: 'Shop Not Found',
        description: 'The requested shop could not be found.'
      }
    }

    return {
      title: `${shop.name} - Local Deals`,
      description: `Browse all deals from ${shop.name} in ${shop.area}. ${shop.description}`,
    }
  } finally {
    await prisma.$disconnect()
  }
}
