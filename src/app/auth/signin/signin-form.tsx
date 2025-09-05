"use client"

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Mail, Loader2, Lock, User } from 'lucide-react'

export default function SignInForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [authMethod, setAuthMethod] = useState<'credentials' | 'email'>('credentials')

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage('')

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
        callbackUrl: '/admin/dashboard'
      })

      if (result?.error) {
        setMessage('Invalid email or password.')
      } else if (result?.ok) {
        window.location.href = '/admin/dashboard'
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
        callbackUrl: '/admin/dashboard'
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
          </div>
        </div>
      )}
    </div>
  )
}
