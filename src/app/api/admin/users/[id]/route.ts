import { NextRequest, NextResponse } from 'next/server'
import { createPrismaClient } from '@/lib/db-connection'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { hasPermission } from '@/lib/roles'
import bcrypt from 'bcryptjs'

// DELETE user
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userRole = (session.user as any)?.role
    if (!hasPermission(userRole, 'canDeleteUsers')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const prisma = createPrismaClient()
    const userId = params.id

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Prevent deleting admin users
    if (user.role === 'admin') {
      return NextResponse.json({ error: 'Cannot delete admin users' }, { status: 403 })
    }

    // Delete the user
    await prisma.user.delete({
      where: { id: userId }
    })

    return NextResponse.json({ message: 'User deleted successfully' })
  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  } finally {
    const prisma = createPrismaClient()
    await prisma.$disconnect()
  }
}

// PUT user (update)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userRole = (session.user as any)?.role
    if (!hasPermission(userRole, 'canEditUsers')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const prisma = createPrismaClient()
    const userId = params.id
    const body = await request.json()

    console.log('PUT request received for user:', userId)
    console.log('Request body:', body)

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!existingUser) {
      console.log('User not found:', userId)
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    console.log('Existing user found:', existingUser.email)

    // Prepare update data
    const updateData: any = {
      name: body.name,
      email: body.email,
      role: body.role,
      image: body.image
    }

    // Handle password update if provided
    if (body.password && body.password.trim() !== '') {
      console.log('Updating password for user:', existingUser.email)
      const hashedPassword = await bcrypt.hash(body.password, 12)
      updateData.password = hashedPassword
    }

    // Update the user
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    })

    console.log('User updated successfully:', updatedUser.email)

    return NextResponse.json({ 
      message: 'User updated successfully',
      user: updatedUser 
    })
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  } finally {
    const prisma = createPrismaClient()
    await prisma.$disconnect()
  }
}
