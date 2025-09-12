import { Metadata } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { getPlatforms } from '@/lib/simple-db'
import PlatformManagement from './platform-management'

// Force dynamic rendering to avoid build-time database calls
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Platform Management - LocalHub Admin',
  description: 'Manage e-commerce platforms for deals',
}

export default async function PlatformManagementPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    redirect('/auth/signin')
  }

  const userRole = (session.user as any)?.role
  if (userRole !== 'admin' && userRole !== 'editor') {
    redirect('/unauthorized')
  }

  // Fetch all platforms
  const platforms = await getPlatforms()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Platform Management</h1>
          <p className="text-muted-foreground">
            Manage e-commerce platforms for your deals
          </p>
        </div>
      </div>

      <PlatformManagement platforms={platforms} />
    </div>
  )
}
