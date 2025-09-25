import { NextRequest, NextResponse } from 'next/server'
import { createPrismaClient } from '@/lib/db-connection'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { hasPermission } from '@/lib/roles'
import bcrypt from 'bcryptjs'

// POST - Create new user
export async function POST(request: NextRequest) {
  try {
    console.log('POST request received for creating user')
    
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      console.log('Unauthorized: No session')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userRole = (session.user as any)?.role
    console.log('User role:', userRole)
    
    if (!hasPermission(userRole, 'canCreateUsers')) {
      console.log('Forbidden: User does not have permission to create users')
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    console.log('Request body:', body)

    const { name, email, password, role } = body

    // Validate required fields
    if (!name || !email || !password || !role) {
      return NextResponse.json({ 
        error: 'Missing required fields: name, email, password, role' 
      }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ 
        error: 'Invalid email format' 
      }, { status: 400 })
    }

    // Validate role
    const validRoles = ['admin', 'editor', 'dealer', 'news_writer', 'user']
    if (!validRoles.includes(role)) {
      return NextResponse.json({ 
        error: 'Invalid role. Must be one of: admin, editor, dealer, news_writer, user' 
      }, { status: 400 })
    }

    const prisma = createPrismaClient()

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      console.log('User already exists with email:', email)
      return NextResponse.json({ 
        error: 'User with this email already exists' 
      }, { status: 409 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        emailVerified: null, // Will be verified when they first login
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    })

    console.log('User created successfully:', newUser.email)

    return NextResponse.json({ 
      message: 'User created successfully',
      user: newUser 
    })
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  } finally {
    const prisma = createPrismaClient()
    await prisma.$disconnect()
  }
}
