import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/simple-db'
import { serializeContentWithYouTube } from '@/lib/content-utils'

export async function POST(request: NextRequest) {
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

    // Create the post
    const result = await query(`
      INSERT INTO posts (title, content, excerpt, image, category, area, author, published, "publishedAt", "createdAt", "updatedAt")
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW(), NOW())
      RETURNING id
    `, [title, serializedContent, excerpt, image, category, area, author, published])

    return NextResponse.json({ 
      success: true, 
      id: result[0].id 
    })

  } catch (error) {
    console.error('Error creating news article:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
