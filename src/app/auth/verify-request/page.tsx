import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Mail, ArrowLeft, Home } from 'lucide-react'

export default function VerifyRequestPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="container mx-auto px-4">
        <Card className="max-w-md mx-auto text-center">
          <CardHeader>
            <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Mail className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Check Your Email</CardTitle>
            <CardDescription>
              We've sent you a magic link to sign in. Please check your email and click the link to continue.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Link href="/auth/signin">
                <Button variant="outline" className="w-full">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Sign In
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" className="w-full">
                  <Home className="h-4 w-4 mr-2" />
                  Go to Home
                </Button>
              </Link>
            </div>
            <p className="text-xs text-muted-foreground">
              In development mode, check your terminal for the magic link URL.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}