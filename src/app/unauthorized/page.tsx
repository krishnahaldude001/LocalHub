import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ShieldX, Home, ArrowLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Unauthorized Access | LocalHub',
  description: 'You do not have permission to access this page',
}

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="container mx-auto px-4">
        <Card className="max-w-md mx-auto text-center">
          <CardHeader>
            <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center">
              <ShieldX className="h-8 w-8 text-destructive" />
            </div>
            <CardTitle className="text-2xl">Access Denied</CardTitle>
            <CardDescription>
              You don't have permission to access this page. Please contact an administrator if you believe this is an error.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Link href="/">
                <Button className="w-full">
                  <Home className="h-4 w-4 mr-2" />
                  Go to Home
                </Button>
              </Link>
              <Button variant="outline" className="w-full" onClick={() => window.history.back()}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go Back
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              If you need access to this page, please contact your administrator.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
