import { randomUUID } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createPrismaClient } from '@/lib/db-connection'
import { hasPermission, type UserRole } from '@/lib/roles'

function extFromMime(mime: string): string {
  if (mime === 'image/jpeg') return 'jpg'
  if (mime === 'image/png') return 'png'
  if (mime === 'image/gif') return 'gif'
  if (mime === 'image/webp') return 'webp'
  return 'img'
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const role = (session.user as { role?: string }).role as UserRole
    const canStaffUpload =
      hasPermission(role, 'canCreateDeals') || hasPermission(role, 'canCreateNews')
    if (!canStaffUpload) {
      const prisma = createPrismaClient()
      try {
        const ownsShop = await prisma.shop.findFirst({
          where: { userId: session.user.id },
          select: { id: true },
        })
        if (!ownsShop) {
          return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }
      } finally {
        await prisma.$disconnect()
      }
    }

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Only JPEG, PNG, GIF, or WebP images are allowed' },
        { status: 400 }
      )
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size must be less than 5MB' }, { status: 400 })
    }

    const blobToken = process.env.BLOB_READ_WRITE_TOKEN?.trim()
    if (blobToken) {
      const pathname = `localhub/${randomUUID()}.${extFromMime(file.type)}`
      const blob = await put(pathname, file, {
        access: 'public',
        token: blobToken,
        contentType: file.type,
      })
      return NextResponse.json({
        success: true,
        url: blob.url,
        publicUrl: true,
        filename: file.name,
        size: file.size,
        type: file.type,
      })
    }

    // No Blob token: inline base64 — works in the CMS and on-page, but not for og:image / WhatsApp.
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = buffer.toString('base64')
    const dataUrl = `data:${file.type};base64,${base64}`

    return NextResponse.json({
      success: true,
      url: dataUrl,
      publicUrl: false,
      filename: file.name,
      size: file.size,
      type: file.type,
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
