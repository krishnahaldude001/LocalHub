import { NextRequest, NextResponse } from 'next/server'
import { createPrismaClient } from '@/lib/db-connection'
import { serializeContentWithYouTube } from '@/lib/content-utils'

// Function to generate a URL-friendly slug
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim()
}

export async function POST(request: NextRequest) {
  const prisma = createPrismaClient()
  try {
    const body = await request.json()
    const { title, content, excerpt, image, category, area, author, published, youtubeUrl } = body

    // Validate required fields
    if (!title || !content || !category || !area || !author) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Serialize content with YouTube URL if provided
    const serializedContent = serializeContentWithYouTube({ content, youtubeUrl })

    // Generate a unique slug
    const baseSlug = generateSlug(title)
    let slug = baseSlug
    let counter = 1

    // Check if slug already exists and make it unique
    while (true) {
      const existingPost = await prisma.post.findUnique({
        where: { slug },
        select: { id: true }
      })
      if (!existingPost) break
      slug = `${baseSlug}-${counter}`
      counter++
    }

    // Create the post using Prisma ORM
    const post = await prisma.post.create({
      data: {
        slug,
        title,
        content: serializedContent,
        excerpt: excerpt || '',
        image: image || '',
        category,
        area,
        author,
        published: published !== false, // Default to true if not specified
        youtubeUrl: youtubeUrl || null
      }
    })

    return NextResponse.json({ 
      success: true, 
      id: post.id 
    })

  } catch (error) {
    console.error('Error creating news article:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
