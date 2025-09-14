import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Create Prisma client with better error handling and connection pooling
function createPrismaClient() {
  try {
    // Use pooled DATABASE_URL for production (Vercel), direct for local development
    const databaseUrl = process.env.DATABASE_URL
    
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
