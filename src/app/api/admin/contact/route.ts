import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

// GET /api/admin/contact - Get contact information
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if contactInfo model exists (in case Prisma client isn't regenerated yet)
    if (!prisma.contactInfo) {
      // Return default contact info if model doesn't exist yet
      return NextResponse.json({
        email: 'admin@localhub.space',
        phone: '+91-9876543210',
        whatsapp: '+91-9876543210',
        address: 'Mumbai, Maharashtra, India',
        businessHours: '9:00 AM - 6:00 PM (Mon-Fri), 10:00 AM - 4:00 PM (Sat)'
      })
    }

    const contactInfo = await prisma.contactInfo.findFirst({
      where: { isActive: true },
      orderBy: { updatedAt: 'desc' }
    })

    if (!contactInfo) {
      // Return default contact info if none exists
      return NextResponse.json({
        email: 'admin@localhub.space',
        phone: '+91-9876543210',
        whatsapp: '+91-9876543210',
        address: 'Mumbai, Maharashtra, India',
        businessHours: '9:00 AM - 6:00 PM (Mon-Fri), 10:00 AM - 4:00 PM (Sat)'
      })
    }

    return NextResponse.json(contactInfo)
  } catch (error) {
    console.error('Error fetching contact info:', error)
    // Return default contact info on any error
    return NextResponse.json({
      email: 'admin@localhub.space',
      phone: '+91-9876543210',
      whatsapp: '+91-9876543210',
      address: 'Mumbai, Maharashtra, India',
      businessHours: '9:00 AM - 6:00 PM (Mon-Fri), 10:00 AM - 4:00 PM (Sat)'
    })
  }
}

// POST /api/admin/contact - Create or update contact information
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userRole = (session.user as any)?.role
    if (userRole !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Check if contactInfo model exists (in case Prisma client isn't regenerated yet)
    if (!prisma.contactInfo) {
      return NextResponse.json({ 
        error: 'Contact management feature is not available yet. Please try again in a few minutes.' 
      }, { status: 503 })
    }

    const body = await request.json()
    const { email, phone, whatsapp, address, businessHours } = body

    // Deactivate all existing contact info
    await prisma.contactInfo.updateMany({
      where: { isActive: true },
      data: { isActive: false }
    })

    // Create new contact info
    const contactInfo = await prisma.contactInfo.create({
      data: {
        email,
        phone,
        whatsapp,
        address,
        businessHours,
        isActive: true
      }
    })

    return NextResponse.json(contactInfo)
  } catch (error) {
    console.error('Error updating contact info:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
