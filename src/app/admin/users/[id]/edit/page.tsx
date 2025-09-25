import { Metadata } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { hasPermission, type UserRole } from '@/lib/roles'
import { createPrismaClient } from '@/lib/db-connection'
import { redirect, notFound } from 'next/navigation'
import UserEditForm from './user-edit-form'

export const metadata: Metadata = {
  title: 'Edit User | Admin Dashboard',
  description: 'Edit user permissions and details',
}


interface EditUserPageProps {
  params: {
    id: string
  }
}

export default async function EditUserPage({ params }: EditUserPageProps) {
  const session = await getServerSession(authOptions)
  const userRole = (session?.user as any)?.role as UserRole || 'user'
  
  // Check if user has permission to edit users
  if (!hasPermission(userRole, 'canEditUsers')) {
    redirect('/admin/unauthorized')
  }

  // Fetch user data
  const prisma = createPrismaClient()
  let user
  try {
    user = await prisma.user.findUnique({
      where: { id: params.id }
    })
  } catch (error) {
    console.error('Error fetching user:', error)
    notFound()
  } finally {
    await prisma.$disconnect()
  }

  if (!user) {
    notFound()
  }

  return <UserEditForm user={user} userId={params.id} />
}
