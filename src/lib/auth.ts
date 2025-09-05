import { NextAuthOptions } from 'next-auth'
import EmailProvider from 'next-auth/providers/email'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from '@/lib/db'
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
  from: 'noreply@localhub.com',
  maxAge: 24 * 60 * 60, // 24 hours
  async sendVerificationRequest({ identifier: email, url, provider }: { identifier: string; url: string; provider: any }) {
    console.log('\n🔗 Magic Link for:', email)
    console.log('📧 Click this link to sign in:')
    console.log(url)
    console.log('⏰ This link expires in 24 hours\n')
  },
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
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

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        })

        if (!user || !user.password) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password)

        if (!isPasswordValid) {
          return null
        }

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
          from: process.env.EMAIL_FROM || 'noreply@localhub.com',
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