import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import ShopActivationMessage from '@/components/shop-activation-message'
import { createPrismaClient } from '@/lib/db-connection'

interface SuccessPageProps {
  searchParams: {
    shopId?: string
  }
}

async function getShopStatus(shopId: string) {
  const prisma = createPrismaClient()
  try {
    const shop = await prisma.shop.findUnique({
      where: { id: shopId },
      select: {
        id: true,
        name: true,
        status: true,
        activationNotes: true
      }
    })
    return shop
  } catch (error) {
    console.error('Error fetching shop status:', error)
    return null
  } finally {
    await prisma.$disconnect()
  }
}

export default async function ShopRegistrationSuccessPage({ searchParams }: SuccessPageProps) {
  const { shopId } = searchParams

  if (!shopId) {
    notFound()
  }

  const shop = await getShopStatus(shopId)

  if (!shop) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Shop Registration Successful!
          </h1>
          <p className="text-gray-600">
            Thank you for registering your shop "{shop.name}" with us.
          </p>
        </div>

        <Suspense fallback={<div>Loading...</div>}>
          <ShopActivationMessage 
            status={shop.status as 'pending' | 'active' | 'suspended' | 'rejected'}
            shopName={shop.name}
            activationNotes={shop.activationNotes || undefined}
          />
        </Suspense>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            You will receive an email confirmation shortly. 
            Please keep your login credentials safe.
          </p>
        </div>
      </div>
    </div>
  )
}
