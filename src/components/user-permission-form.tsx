'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Eye, UserPlus, Edit, Trash2, Settings } from 'lucide-react'

// Permission categories for granular control
const PERMISSION_CATEGORIES = {
  deals: {
    label: 'Deals Management',
    icon: '🛍️',
    roles: ['admin', 'editor', 'dealer'],
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
    roles: ['admin', 'editor', 'news_writer'],
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
    roles: ['admin'],
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
    roles: ['admin', 'editor'],
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
    roles: ['admin'],
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

interface UserPermissionFormProps {
  selectedRole: string
  onRoleChange: (role: string) => void
}

export default function UserPermissionForm({ selectedRole, onRoleChange }: UserPermissionFormProps) {
  const [permissions, setPermissions] = useState<Record<string, boolean>>({})

  // Filter categories based on selected role
  const filteredCategories = Object.entries(PERMISSION_CATEGORIES).filter(([_, config]) => 
    config.roles.includes(selectedRole)
  )

  // Apply role template when role changes
  useEffect(() => {
    if (selectedRole && ROLE_PERMISSIONS[selectedRole as keyof typeof ROLE_PERMISSIONS]) {
      const rolePermissions = ROLE_PERMISSIONS[selectedRole as keyof typeof ROLE_PERMISSIONS].permissions
      setPermissions(rolePermissions)
    }
  }, [selectedRole])

  const handlePermissionChange = (permission: string, value: boolean) => {
    setPermissions(prev => ({
      ...prev,
      [permission]: value
    }))
  }

  const applyRoleTemplate = (role: string) => {
    onRoleChange(role)
    if (ROLE_PERMISSIONS[role as keyof typeof ROLE_PERMISSIONS]) {
      const rolePermissions = ROLE_PERMISSIONS[role as keyof typeof ROLE_PERMISSIONS].permissions
      setPermissions(rolePermissions)
    }
  }

  // Calculate permission summary
  const permissionSummary = {
    read: Object.values(permissions).filter(p => p).length,
    write: Object.entries(permissions).filter(([key, value]) => value && (key.includes('Create') || key.includes('Edit'))).length,
    delete: Object.entries(permissions).filter(([key, value]) => value && key.includes('Delete')).length,
    admin: Object.entries(permissions).filter(([key, value]) => value && (key.includes('Manage') || key.includes('Settings'))).length,
  }

  return (
    <div className="space-y-6">
      {/* Permission Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Permission Settings
          </CardTitle>
          <CardDescription>
            Configure granular permissions for this user
            {selectedRole && (
              <span className="ml-2">
                - Showing permissions for <Badge variant="outline">{selectedRole}</Badge>
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {filteredCategories.map(([category, config]) => (
              <div key={category} className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{config.icon}</span>
                  <h3 className="text-lg font-medium">{config.label}</h3>
                  <Badge variant="outline" className="text-xs">
                    {config.roles.join(', ')}
                  </Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(config.permissions).map(([permission, label]) => (
                    <div key={permission} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          {permission.includes('Read') && <Eye className="h-4 w-4 text-blue-500" />}
                          {permission.includes('Create') && <UserPlus className="h-4 w-4 text-green-500" />}
                          {permission.includes('Edit') && <Edit className="h-4 w-4 text-orange-500" />}
                          {permission.includes('Delete') && <Trash2 className="h-4 w-4 text-red-500" />}
                          {permission.includes('Manage') && <Settings className="h-4 w-4 text-purple-500" />}
                        </div>
                        <span className="text-sm font-medium">{label}</span>
                      </div>
                      <Switch 
                        checked={permissions[permission] || false}
                        onCheckedChange={(value) => handlePermissionChange(permission, value)}
                      />
                    </div>
                  ))}
                </div>
                <Separator />
              </div>
            ))}
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
                <button 
                  onClick={() => applyRoleTemplate(role)}
                  className="px-3 py-1 text-sm border rounded hover:bg-accent"
                >
                  Apply
                </button>
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
              <Badge variant="outline">{permissionSummary.read} permissions</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Write Access</span>
              <Badge variant="outline">{permissionSummary.write} permissions</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Delete Access</span>
              <Badge variant="outline">{permissionSummary.delete} permissions</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Admin Access</span>
              <Badge variant="outline">{permissionSummary.admin} permissions</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
