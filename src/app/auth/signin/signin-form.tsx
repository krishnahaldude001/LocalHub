"use client"

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Mail, Loader2, Lock, User } from 'lucide-react'

export default function SignInForm() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [authMethod, setAuthMethod] = useState<'credentials' | 'email'>('credentials')

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage('')

    try {
      const result = await signIn('credentials', {
        email: username, // Use username as email for NextAuth
        password,
        redirect: false,
        callbackUrl: '/admin/dashboard'
      })

      if (result?.error) {
        setMessage('Invalid username or password.')
      } else if (result?.ok) {
        // Get user role and redirect accordingly
        const response = await fetch('/api/auth/session')
        const session = await response.json()
        const userRole = session?.user?.role || 'user'
        
        // Role-based redirection
        let redirectUrl = '/'
        switch (userRole) {
          case 'admin':
          case 'editor':
          case 'dealer':
          case 'news_writer':
            redirectUrl = '/admin/dashboard'
            break
          case 'user':
            // Check if user has shops
            try {
              const shopsResponse = await fetch('/api/user/shops')
              if (shopsResponse.ok) {
                const shopsData = await shopsResponse.json()
                if (shopsData.shops && shopsData.shops.length > 0) {
                  redirectUrl = '/my-shops'
                } else {
                  redirectUrl = '/'
                }
              } else {
                redirectUrl = '/'
              }
            } catch (error) {
              redirectUrl = '/'
            }
            break
          default:
            redirectUrl = '/'
        }
        
        window.location.href = redirectUrl
      }
    } catch (error) {
      setMessage('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage('')

    try {
      const result = await signIn('email', {
        email,
        redirect: false,
        callbackUrl: '/'
      })

      if (result?.error) {
        setMessage('Error sending email. Please try again.')
      } else {
        setMessage('Check your email for the sign-in link!')
      }
    } catch (error) {
      setMessage('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Authentication Method Toggle */}
      <div className="flex space-x-1 bg-muted p-1 rounded-lg">
        <button
          type="button"
          onClick={() => setAuthMethod('credentials')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            authMethod === 'credentials'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <User className="w-4 h-4 inline mr-2" />
          Username & Password
        </button>
        <button
          type="button"
          onClick={() => setAuthMethod('email')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            authMethod === 'email'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Mail className="w-4 h-4 inline mr-2" />
          Magic Link
        </button>
      </div>

      {/* Credentials Form */}
      {authMethod === 'credentials' && (
        <form onSubmit={handleCredentialsSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username (Email or Mobile Number)</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="username"
                type="text"
                placeholder="Enter email (admin@localhub.com) or mobile (+91 98765 43210)"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                <User className="mr-2 h-4 w-4" />
                Sign In
              </>
            )}
          </Button>
        </form>
      )}

      {/* Email Form */}
      {authMethod === 'email' && (
        <form onSubmit={handleEmailSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Mail className="mr-2 h-4 w-4" />
                Send Magic Link
              </>
            )}
          </Button>
        </form>
      )}

      {message && (
        <p className={`text-sm text-center ${
          message.includes('Check your email') ? 'text-green-600' : 'text-red-600'
        }`}>
          {message}
        </p>
      )}

      {/* Demo Credentials - Only show in development */}
      {authMethod === 'credentials' && process.env.NODE_ENV === 'development' && (
        <div className="mt-6 p-4 bg-muted rounded-lg">
          <h3 className="text-sm font-medium mb-2">Demo Credentials (Development Only):</h3>
          <div className="text-xs space-y-1 text-muted-foreground">
            <p><strong>Admin:</strong> admin@localhub.com / admin123</p>
            <p><strong>Editor:</strong> editor@localhub.com / editor123</p>
            <p><strong>Dealer:</strong> dealer@localhub.com / dealer123</p>
            <p className="text-blue-600"><strong>Shop Owner:</strong> +91 98765 43210 / shop123</p>
            <p className="text-blue-600"><strong>New Shop Owners:</strong> Register at /shop/register</p>
          </div>
        </div>
      )}
    </div>
  )
}
