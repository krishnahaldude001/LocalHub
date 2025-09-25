import { prisma } from './db'

// Use the singleton Prisma client to avoid connection conflicts
export function createPrismaClient() {
  return prisma
}

// For server-side usage - use singleton client
export async function withPrisma<T>(
  operation: (prisma: typeof import('./db').prisma) => Promise<T>
): Promise<T> {
  try {
    return await operation(prisma)
  } catch (error) {
    console.error('Prisma operation failed:', error)
    throw error
  }
}
