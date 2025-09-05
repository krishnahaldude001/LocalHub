import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

// PUT - Update platform
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
    if (userRole !== 'admin' && userRole !== 'editor') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const { name, color, description, isActive } = body

    if (!name) {
      return NextResponse.json(
        { error: 'Platform name is required' },
        { status: 400 }
      )
    }

    // Generate slug from name
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

    // Check if another platform with this slug exists
    const existingPlatform = await prisma.platform.findFirst({
      where: {
        slug,
        id: { not: params.id }
      }
    })

    if (existingPlatform) {
      return NextResponse.json(
        { error: 'Platform with this name already exists' },
        { status: 400 }
      )
    }

    const platform = await prisma.platform.update({
      where: { id: params.id },
      data: {
        name,
        slug,
        color: color || 'bg-gray-500',
        description: description || null,
        isActive: isActive !== undefined ? isActive : true,
      },
      include: {
        _count: {
          select: { deals: true }
        }
      }
    })

    return NextResponse.json(platform)
  } catch (error) {
    console.error('Error updating platform:', error)
    return NextResponse.json(
      { error: 'Failed to update platform' },
      { status: 500 }
    )
  }
}

// DELETE - Delete platform
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
    if (userRole !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Check if platform has deals
    const dealsCount = await prisma.deal.count({
      where: { platformId: params.id }
    })

    if (dealsCount > 0) {
      return NextResponse.json(
        { error: 'Cannot delete platform that has deals. Please deactivate it instead.' },
        { status: 400 }
      )
    }

    await prisma.platform.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Platform deleted successfully' })
  } catch (error) {
    console.error('Error deleting platform:', error)
    return NextResponse.json(
      { error: 'Failed to delete platform' },
      { status: 500 }
    )
  }
}
