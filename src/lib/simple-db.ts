import { Pool } from 'pg'

// Create a simple PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
})

// Simple database query function
export async function query(text: string, params?: any[]) {
  const client = await pool.connect()
  try {
    const result = await client.query(text, params)
    return result.rows
  } finally {
    client.release()
  }
}

// Get deals
export async function getDeals(limit = 6) {
  const deals = await query(`
    SELECT 
      d.*, 
      p.name as platform_name, 
      p.color as platform_color,
      COUNT(c.id) as click_count
    FROM deals d
    JOIN platforms p ON d."platformId" = p.id
    LEFT JOIN clicks c ON d.id = c."dealId"
    GROUP BY d.id, p.name, p.color
    ORDER BY d."publishedAt" DESC
    LIMIT $1
  `, [limit])
  
  return deals.map(deal => ({
    ...deal,
    platform: {
      name: deal.platform_name,
      color: deal.platform_color
    },
    gallery: deal.gallery ? (typeof deal.gallery === 'string' && deal.gallery.startsWith('[') ? JSON.parse(deal.gallery) : [deal.gallery]) : [],
    _count: {
      clicks: parseInt(deal.click_count) || 0
    }
  }))
}

// Get posts
export async function getPosts(limit = 6) {
  return await query(`
    SELECT *
    FROM posts
    WHERE published = true
    ORDER BY "publishedAt" DESC
    LIMIT $1
  `, [limit])
}

// Get users
export async function getUsers() {
  return await query('SELECT * FROM users')
}

// Get clicks
export async function getClicks() {
  return await query('SELECT * FROM clicks')
}

// Get post count
export async function getPostCount() {
  const result = await query('SELECT COUNT(*) as count FROM posts')
  return parseInt(result[0].count)
}

// Get platforms
export async function getPlatforms() {
  return await query('SELECT * FROM platforms ORDER BY name ASC')
}

// Get single deal by ID
export async function getDealById(id: string) {
  const deals = await query(`
    SELECT d.*, p.name as platform_name, p.color as platform_color
    FROM deals d
    JOIN platforms p ON d."platformId" = p.id
    WHERE d.id = $1
  `, [id])
  
  if (deals.length === 0) return null
  
  const deal = deals[0]
  return {
    ...deal,
    platform: {
      name: deal.platform_name,
      color: deal.platform_color
    },
    gallery: deal.gallery ? (typeof deal.gallery === 'string' && deal.gallery.startsWith('[') ? JSON.parse(deal.gallery) : [deal.gallery]) : []
  }
}

// Get single post by ID
export async function getPostById(id: string) {
  const posts = await query('SELECT * FROM posts WHERE id = $1', [id])
  return posts.length > 0 ? posts[0] : null
}
