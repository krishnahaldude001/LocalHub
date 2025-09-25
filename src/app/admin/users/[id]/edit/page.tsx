import { Metadata } from 'next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { hasPermission, type UserRole } from '@/lib/roles'
import { createPrismaClient } from '@/lib/db-connection'
import { redirect, notFound } from 'next/navigation'
import { ArrowLeft, Save, User, Shield, Eye, Edit, Trash2, Settings, AlertTriangle } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Edit User | Admin Dashboard',
  description: 'Edit user permissions and details',
}

// Permission categories for granular control
const PERMISSION_CATEGORIES = {
  deals: {
    label: 'Deals Management',
    icon: '🛍️',
    roles: ['admin', 'editor', 'dealer'], // Only show to these roles
    permissions: {
      canReadDeals: 'View Deals',
      canCreateDeals: 'Create Deals',
      canEditDeals: 'Edit Deals',
      canDeleteDeals: 'Delete Deals',
    }
  },
  news: {
    label: 'News Management',
    icon: '📰',
    roles: ['admin', 'editor', 'news_writer'], // Only show to these roles
    permissions: {
      canReadNews: 'View News',
      canCreateNews: 'Create News',
      canEditNews: 'Edit News',
      canDeleteNews: 'Delete News',
    }
  },
  users: {
    label: 'User Management',
    icon: '👥',
    roles: ['admin'], // Only admin can manage users
    permissions: {
      canReadUsers: 'View Users',
      canCreateUsers: 'Create Users',
      canEditUsers: 'Edit Users',
      canDeleteUsers: 'Delete Users',
    }
  },
  shops: {
    label: 'Shop Management',
    icon: '🏪',
    roles: ['admin', 'editor'], // Only admin and editor can manage shops
    permissions: {
      canReadShops: 'View Shops',
      canCreateShops: 'Create Shops',
      canEditShops: 'Edit Shops',
      canDeleteShops: 'Delete Shops',
    }
  },
  settings: {
    label: 'System Settings',
    icon: '⚙️',
    roles: ['admin'], // Only admin can manage settings
    permissions: {
      canManageSettings: 'Manage Settings',
      canViewAnalytics: 'View Analytics',
      canManagePlatforms: 'Manage Platforms',
    }
  }
}

// Role-based permission templates
const ROLE_PERMISSIONS = {
  admin: {
    label: 'Administrator',
    description: 'Full access to all features',
    color: 'destructive',
    permissions: {
      canReadDeals: true,
      canCreateDeals: true,
      canEditDeals: true,
      canDeleteDeals: true,
      canReadNews: true,
      canCreateNews: true,
      canEditNews: true,
      canDeleteNews: true,
      canReadUsers: true,
      canCreateUsers: true,
      canEditUsers: true,
      canDeleteUsers: true,
      canReadShops: true,
      canCreateShops: true,
      canEditShops: true,
      canDeleteShops: true,
      canManageSettings: true,
      canViewAnalytics: true,
      canManagePlatforms: true,
    }
  },
  editor: {
    label: 'Content Editor',
    description: 'Can manage content but not users',
    color: 'default',
    permissions: {
      canReadDeals: true,
      canCreateDeals: true,
      canEditDeals: true,
      canDeleteDeals: false,
      canReadNews: true,
      canCreateNews: true,
      canEditNews: true,
      canDeleteNews: false,
      canReadUsers: true,
      canCreateUsers: false,
      canEditUsers: false,
      canDeleteUsers: false,
      canReadShops: true,
      canCreateShops: false,
      canEditShops: false,
      canDeleteShops: false,
      canManageSettings: false,
      canViewAnalytics: true,
      canManagePlatforms: false,
    }
  },
  dealer: {
    label: 'Deal Manager',
    description: 'Can manage deals and shops',
    color: 'secondary',
    permissions: {
      canReadDeals: true,
      canCreateDeals: true,
      canEditDeals: true,
      canDeleteDeals: true,
      canReadNews: false,
      canCreateNews: false,
      canEditNews: false,
      canDeleteNews: false,
      canReadUsers: false,
      canCreateUsers: false,
      canEditUsers: false,
      canDeleteUsers: false,
      canReadShops: true,
      canCreateShops: true,
      canEditShops: true,
      canDeleteShops: true,
      canManageSettings: false,
      canViewAnalytics: true,
      canManagePlatforms: false,
    }
  },
  news_writer: {
    label: 'News Writer',
    description: 'Can only manage news content',
    color: 'outline',
    permissions: {
      canReadDeals: false,
      canCreateDeals: false,
      canEditDeals: false,
      canDeleteDeals: false,
      canReadNews: true,
      canCreateNews: true,
      canEditNews: true,
      canDeleteNews: false,
      canReadUsers: false,
      canCreateUsers: false,
      canEditUsers: false,
      canDeleteUsers: false,
      canReadShops: false,
      canCreateShops: false,
      canEditShops: false,
      canDeleteShops: false,
      canManageSettings: false,
      canViewAnalytics: false,
      canManagePlatforms: false,
    }
  },
  user: {
    label: 'Regular User',
    description: 'Basic access only',
    color: 'secondary',
    permissions: {
      canReadDeals: true,
      canCreateDeals: false,
      canEditDeals: false,
      canDeleteDeals: false,
      canReadNews: true,
      canCreateNews: false,
      canEditNews: false,
      canDeleteNews: false,
      canReadUsers: false,
      canCreateUsers: false,
      canEditUsers: false,
      canDeleteUsers: false,
      canReadShops: true,
      canCreateShops: false,
      canEditShops: false,
      canDeleteShops: false,
      canManageSettings: false,
      canViewAnalytics: false,
      canManagePlatforms: false,
    }
  }
}

interface EditUserPageProps {
  params: {
    id: string
  }
}

export default async function EditUserPage({ params }: EditUserPageProps) {
  const session = await getServerSession(authOptions)
  const userRole = (session?.user as any)?.role as UserRole || 'user'
  
  // Check if user has permission to edit users
  if (!hasPermission(userRole, 'canEditUsers')) {
    redirect('/admin/unauthorized')
  }

  // Fetch user data
  const prisma = createPrismaClient()
  let user
  try {
    user = await prisma.user.findUnique({
      where: { id: params.id }
    })
  } catch (error) {
    console.error('Error fetching user:', error)
    notFound()
  } finally {
    await prisma.$disconnect()
  }

  if (!user) {
    notFound()
  }

  // Get current user's permissions for comparison
  const currentUserPermissions = ROLE_PERMISSIONS[userRole]?.permissions || {}

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Link href="/admin/users">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Users
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Edit User</h1>
            <p className="text-muted-foreground">Modify user permissions and details</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                User Information
              </CardTitle>
              <CardDescription>Basic user details and authentication</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" defaultValue={user.name || ''} placeholder="Enter full name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" defaultValue={user.email} placeholder="user@example.com" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">New Password (optional)</Label>
                  <Input id="password" type="password" placeholder="Leave blank to keep current" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">User Role</Label>
                  <Select defaultValue={user.role}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(ROLE_PERMISSIONS).map(([role, config]) => (
                        <SelectItem key={role} value={role}>
                          <div className="flex items-center gap-2">
                            <Badge variant={config.color as any}>{config.label}</Badge>
                            <span className="text-sm text-muted-foreground">{config.description}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Permission Settings */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Permission Settings
              </CardTitle>
              <CardDescription>Configure granular permissions for this user</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {Object.entries(PERMISSION_CATEGORIES)
                  .filter(([_, config]) => config.roles.includes(user.role)) // Filter based on user's role
                  .map(([category, config]) => (
                    <div key={category} className="space-y-4">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{config.icon}</span>
                        <h3 className="text-lg font-medium">{config.label}</h3>
                        <Badge variant="outline" className="text-xs">
                          {config.roles.join(', ')}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.entries(config.permissions).map(([permission, label]) => {
                          const hasPermission = currentUserPermissions[permission as keyof typeof currentUserPermissions]
                          const isRestricted = !hasPermission && permission.includes('Delete')
                          
                          return (
                            <div key={permission} className={`flex items-center justify-between p-3 border rounded-lg ${isRestricted ? 'bg-muted/50' : ''}`}>
                              <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2">
                                  {permission.includes('Read') && <Eye className="h-4 w-4 text-blue-500" />}
                                  {permission.includes('Create') && <User className="h-4 w-4 text-green-500" />}
                                  {permission.includes('Edit') && <Edit className="h-4 w-4 text-orange-500" />}
                                  {permission.includes('Delete') && <Trash2 className="h-4 w-4 text-red-500" />}
                                  {permission.includes('Manage') && <Settings className="h-4 w-4 text-purple-500" />}
                                </div>
                                <div>
                                  <span className="text-sm font-medium">{label}</span>
                                  {isRestricted && (
                                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                      <AlertTriangle className="h-3 w-3" />
                                      Restricted
                                    </div>
                                  )}
                                </div>
                              </div>
                              <Switch disabled={isRestricted} />
                            </div>
                          )
                        })}
                      </div>
                      <Separator />
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* User Info */}
          <Card>
            <CardHeader>
              <CardTitle>User Details</CardTitle>
              <CardDescription>Current user information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  {user.image ? (
                    <img
                      src={user.image}
                      alt={user.name || 'User'}
                      className="h-10 w-10 rounded-full"
                    />
                  ) : (
                    <User className="h-5 w-5 text-primary" />
                  )}
                </div>
                <div>
                  <p className="font-medium">{user.name || 'No Name'}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Role</span>
                  <Badge variant="outline">{user.role}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Created</span>
                  <span className="text-sm text-muted-foreground">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Last Updated</span>
                  <span className="text-sm text-muted-foreground">
                    {new Date(user.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Role Templates */}
          <Card>
            <CardHeader>
              <CardTitle>Role Templates</CardTitle>
              <CardDescription>Quick permission sets based on roles</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {Object.entries(ROLE_PERMISSIONS).map(([role, config]) => (
                <div key={role} className="p-3 border rounded-lg hover:bg-accent/50 cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div>
                      <Badge variant={config.color as any}>{config.label}</Badge>
                      <p className="text-sm text-muted-foreground mt-1">{config.description}</p>
                    </div>
                    <Button variant="outline" size="sm">Apply</Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Permission Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Permission Summary</CardTitle>
              <CardDescription>Overview of granted permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Read Access</span>
                  <Badge variant="outline">5 permissions</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Write Access</span>
                  <Badge variant="outline">3 permissions</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Delete Access</span>
                  <Badge variant="outline">1 permission</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Admin Access</span>
                  <Badge variant="outline">2 permissions</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between mt-8">
        <div className="flex items-center gap-4">
          <Button variant="destructive" size="sm">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete User
          </Button>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/admin/users">
            <Button variant="outline">Cancel</Button>
          </Link>
          <Button>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  )
}
