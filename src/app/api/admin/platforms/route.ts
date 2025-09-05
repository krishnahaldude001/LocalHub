import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

// GET - Fetch all platforms
export async function GET() {
  try {
    const platforms = await prisma.platform.findMany({
      orderBy: { name: 'asc' },
      where: { isActive: true },
      include: {
        _count: {
          select: { deals: true }
        }
      }
    })
    
    return NextResponse.json(platforms)
  } catch (error) {
    console.error('Error fetching platforms:', error)
    return NextResponse.json(
      { error: 'Failed to fetch platforms' },
      { status: 500 }
    )
  }
}

// POST - Create new platform
export async function POST(request: NextRequest) {
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
    const { name, color, description } = body

    if (!name) {
      return NextResponse.json(
        { error: 'Platform name is required' },
        { status: 400 }
      )
    }

    // Generate slug from name
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

    // Check if platform already exists
    const existingPlatform = await prisma.platform.findUnique({
      where: { slug }
    })

    if (existingPlatform) {
      return NextResponse.json(
        { error: 'Platform with this name already exists' },
        { status: 400 }
      )
    }

    const platform = await prisma.platform.create({
      data: {
        name,
        slug,
        color: color || 'bg-gray-500',
        description: description || null,
      },
      include: {
        _count: {
          select: { deals: true }
        }
      }
    })

    return NextResponse.json(platform, { status: 201 })
  } catch (error) {
    console.error('Error creating platform:', error)
    return NextResponse.json(
      { error: 'Failed to create platform' },
      { status: 500 }
    )
  }
}
