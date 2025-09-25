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
import { redirect } from 'next/navigation'
import { ArrowLeft, Save, UserPlus, Shield, Eye, Edit, Trash2, Settings } from 'lucide-react'
import Link from 'next/link'
import UserPermissionForm from '@/components/user-permission-form'

export const metadata: Metadata = {
  title: 'Add New User | Admin Dashboard',
  description: 'Create a new user with custom permissions',
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

import UserForm from './user-form'

export default async function AddUserPage() {
  const session = await getServerSession(authOptions)
  const userRole = (session?.user as any)?.role as UserRole || 'user'
  
  // Check if user has permission to create users
  if (!hasPermission(userRole, 'canCreateUsers')) {
    redirect('/admin/unauthorized')
  }

  return <UserForm />
}
