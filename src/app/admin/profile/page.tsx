import { Metadata } from 'next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getRoleLabel, getRoleDescription, type UserRole } from '@/lib/roles'
import { formatDate } from '@/lib/utils'
import { User, Mail, Calendar, Shield, Edit } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Profile Settings | Admin Dashboard',
  description: 'Manage your profile and account settings',
}

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <p>Please sign in to view your profile.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const userRole = (session.user as any)?.role as UserRole || 'user'

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Profile Settings</h1>
          <p className="text-muted-foreground">Manage your account and preferences</p>
        </div>
        <Button>
          <Edit className="h-4 w-4 mr-2" />
          Edit Profile
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
              <CardDescription>Your basic profile details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                  {session.user.image ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name || 'User'}
                      className="h-16 w-16 rounded-full"
                    />
                  ) : (
                    <User className="h-8 w-8 text-primary" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{session.user.name || 'No Name Set'}</h3>
                  <p className="text-muted-foreground">{session.user.email}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                  <p className="text-sm">{session.user.name || 'Not provided'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email Address</label>
                  <p className="text-sm flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    {session.user.email}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Account Role & Permissions
              </CardTitle>
              <CardDescription>Your current role and access permissions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Current Role</h4>
                  <p className="text-sm text-muted-foreground">{getRoleDescription(userRole)}</p>
                </div>
                <Badge variant="outline" className="text-lg px-3 py-1">
                  {getRoleLabel(userRole)}
                </Badge>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Your Permissions</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {userRole === 'admin' && (
                    <>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                        Manage Users
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                        Manage Deals
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                        Manage News
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                        Manage Pages
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                        View Analytics
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                        Manage Settings
                      </div>
                    </>
                  )}
                  {userRole === 'editor' && (
                    <>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                        Manage Deals
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                        Manage News
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                        View Analytics
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="h-2 w-2 rounded-full bg-gray-400"></div>
                        Manage Users
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="h-2 w-2 rounded-full bg-gray-400"></div>
                        Manage Pages
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="h-2 w-2 rounded-full bg-gray-400"></div>
                        Manage Settings
                      </div>
                    </>
                  )}
                  {userRole === 'dealer' && (
                    <>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                        Manage Deals
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                        View Analytics
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="h-2 w-2 rounded-full bg-gray-400"></div>
                        Manage Users
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="h-2 w-2 rounded-full bg-gray-400"></div>
                        Manage News
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="h-2 w-2 rounded-full bg-gray-400"></div>
                        Manage Pages
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="h-2 w-2 rounded-full bg-gray-400"></div>
                        Manage Settings
                      </div>
                    </>
                  )}
                  {userRole === 'news_writer' && (
                    <>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                        Manage News
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                        View Analytics
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="h-2 w-2 rounded-full bg-gray-400"></div>
                        Manage Users
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="h-2 w-2 rounded-full bg-gray-400"></div>
                        Manage Deals
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="h-2 w-2 rounded-full bg-gray-400"></div>
                        Manage Pages
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="h-2 w-2 rounded-full bg-gray-400"></div>
                        Manage Settings
                      </div>
                    </>
                  )}
                  {userRole === 'user' && (
                    <>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="h-2 w-2 rounded-full bg-gray-400"></div>
                        Manage Users
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="h-2 w-2 rounded-full bg-gray-400"></div>
                        Manage Deals
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="h-2 w-2 rounded-full bg-gray-400"></div>
                        Manage News
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="h-2 w-2 rounded-full bg-gray-400"></div>
                        Manage Pages
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="h-2 w-2 rounded-full bg-gray-400"></div>
                        View Analytics
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="h-2 w-2 rounded-full bg-gray-400"></div>
                        Manage Settings
                      </div>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Account Information */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Account Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Account Created</label>
                <p className="text-sm">{formatDate(new Date())}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Last Sign In</label>
                <p className="text-sm">Recently</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Email Verified</label>
                <p className="text-sm flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  Verified
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Shield className="h-4 w-4 mr-2" />
                Change Password
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Mail className="h-4 w-4 mr-2" />
                Email Preferences
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
