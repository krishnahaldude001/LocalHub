import { NextAuthOptions } from 'next-auth'
import EmailProvider from 'next-auth/providers/email'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { createPrismaClient } from '@/lib/db-connection'
import bcrypt from 'bcryptjs'

// Extend the built-in session types
declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name?: string | null
      image?: string | null
      role: string
    }
  }
}

// Custom email provider for development
const customEmailProvider = {
  id: 'email',
  type: 'email' as const,
  name: 'Email',
  server: '',
  from: 'noreply@localhub.space',
  maxAge: 24 * 60 * 60, // 24 hours
  async sendVerificationRequest({ identifier: email, url, provider }: { identifier: string; url: string; provider: any }) {
    console.log('\n🔗 Magic Link for:', email)
    console.log('📧 Click this link to sign in:')
    console.log(url)
    console.log('⏰ This link expires in 24 hours\n')
  },
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(createPrismaClient()),
  providers: [
    // Credentials provider for username/password
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const prisma = createPrismaClient();
        
        // Try to find user by email or mobile number
        let user = await prisma.user.findUnique({
          where: { email: credentials.email }
        })

        // If not found by exact email, try to find by mobile number variations
        if (!user) {
          const mobileVariations = [
            credentials.email,
            credentials.email.replace(/\s/g, ''), // Remove spaces
            credentials.email.replace(/\+/g, ''), // Remove +
            credentials.email.replace(/\s/g, '').replace(/\+/g, ''), // Remove both
          ]

          for (const variation of mobileVariations) {
            user = await prisma.user.findFirst({
              where: { 
                email: {
                  contains: variation
                }
              }
            })
            if (user) break
          }
        }

        if (!user || !user.password) {
          console.log('User not found or no password:', credentials.email)
          return null
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password)

        if (!isPasswordValid) {
          console.log('Invalid password for user:', user.email)
          return null
        }

        console.log('Login successful for user:', user.email, 'Role:', user.role)

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        }
      }
    }),
    // Use custom provider in development, regular EmailProvider in production
    process.env.NODE_ENV === 'development' 
      ? customEmailProvider as any
      : EmailProvider({
          server: process.env.EMAIL_SERVER_HOST ? {
            host: process.env.EMAIL_SERVER_HOST,
            port: process.env.EMAIL_SERVER_PORT,
            auth: {
              user: process.env.EMAIL_SERVER_USER,
              pass: process.env.EMAIL_SERVER_PASSWORD,
            },
          } : undefined,
          from: process.env.EMAIL_FROM || 'noreply@localhub.space',
        }),
  ],
  callbacks: {
    async session({ session, token }) {
      try {
        if (session?.user && token?.sub) {
          session.user.id = token.sub
          session.user.role = (token as any).role || 'user'
        }
        return session
      } catch (error) {
        console.error('Session callback error:', error)
        return session
      }
    },
    async jwt({ token, user }) {
      try {
        if (user) {
          token.role = (user as any).role || 'user'
        }
        return token
      } catch (error) {
        console.error('JWT callback error:', error)
        return token
      }
    },
    async redirect({ url, baseUrl }) {
      // If it's a relative URL, make it absolute
      if (url.startsWith('/')) {
        return `${baseUrl}${url}`
      }
      // If it's the same origin, allow it
      if (new URL(url).origin === baseUrl) {
        return url
      }
      // Default redirect to home
      return baseUrl
    },
  },
  pages: {
    signIn: '/auth/signin',
    verifyRequest: '/auth/verify-request',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
  },
}