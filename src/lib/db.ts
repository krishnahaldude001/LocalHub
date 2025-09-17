import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Create Prisma client with better error handling and connection pooling
function createPrismaClient() {
  try {
    // For Supabase, use DATABASE_URL (pooler) for better connectivity
    let databaseUrl = process.env.DATABASE_URL || process.env.DIRECT_URL
    
    // Add connection parameters to prevent prepared statement conflicts
    if (databaseUrl?.includes('postgresql://')) {
      const url = new URL(databaseUrl)
      url.searchParams.set('prepared_statements', 'false')
      url.searchParams.set('connection_limit', '1')
      url.searchParams.set('pool_timeout', '20')
      databaseUrl = url.toString()
    }
    
    return new PrismaClient({
      log: ['error'],
      errorFormat: 'pretty',
      datasources: {
        db: {
          url: databaseUrl,
        },
      },
    })
  } catch (error) {
    console.error('Failed to create Prisma client:', error)
    throw error
  }
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Helper function to parse gallery JSON string
export function parseGallery(gallery: string | null): string[] {
  if (!gallery) return []
  try {
    return JSON.parse(gallery)
  } catch {
    return []
  }
}

// Helper function to stringify gallery array
export function stringifyGallery(gallery: string[]): string {
  return JSON.stringify(gallery)
}
