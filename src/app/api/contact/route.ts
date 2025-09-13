import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET /api/contact - Get public contact information
export async function GET() {
  try {
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
