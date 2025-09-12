import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: ['error'],
  errorFormat: 'pretty',
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
})

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
