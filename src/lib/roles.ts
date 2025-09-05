// Role-based access control utilities

export type UserRole = 'admin' | 'editor' | 'dealer' | 'news_writer' | 'user'

export const ROLES = {
  ADMIN: 'admin' as const,
  EDITOR: 'editor' as const,
  DEALER: 'dealer' as const,
  NEWS_WRITER: 'news_writer' as const,
  USER: 'user' as const,
} as const

export const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: {
    canManageUsers: true,
    canManageDeals: true,
    canManageNews: true,
    canManagePages: true,
    canManagePlatforms: true,
    canViewAnalytics: true,
    canManageSettings: true,
  },
  [ROLES.EDITOR]: {
    canManageUsers: false,
    canManageDeals: true,
    canManageNews: true,
    canManagePages: false,
    canManagePlatforms: true,
    canViewAnalytics: true,
    canManageSettings: false,
  },
  [ROLES.DEALER]: {
    canManageUsers: false,
    canManageDeals: true,
    canManageNews: false,
    canManagePages: false,
    canManagePlatforms: false,
    canViewAnalytics: true,
    canManageSettings: false,
  },
  [ROLES.NEWS_WRITER]: {
    canManageUsers: false,
    canManageDeals: false,
    canManageNews: true,
    canManagePages: false,
    canManagePlatforms: false,
    canViewAnalytics: true,
    canManageSettings: false,
  },
  [ROLES.USER]: {
    canManageUsers: false,
    canManageDeals: false,
    canManageNews: false,
    canManagePages: false,
    canManagePlatforms: false,
    canViewAnalytics: false,
    canManageSettings: false,
  },
} as const

export const ROLE_LABELS = {
  [ROLES.ADMIN]: 'Administrator',
  [ROLES.EDITOR]: 'Editor',
  [ROLES.DEALER]: 'Deal Manager',
  [ROLES.NEWS_WRITER]: 'News Writer',
  [ROLES.USER]: 'User',
} as const

export const ROLE_DESCRIPTIONS = {
  [ROLES.ADMIN]: 'Full access to all features and user management',
  [ROLES.EDITOR]: 'Can manage deals and news content',
  [ROLES.DEALER]: 'Can only manage deals and view analytics',
  [ROLES.NEWS_WRITER]: 'Can only manage news content and view analytics',
  [ROLES.USER]: 'Regular user with no admin access',
} as const

// Helper functions
export function hasPermission(role: UserRole, permission: keyof typeof ROLE_PERMISSIONS[UserRole]): boolean {
  return ROLE_PERMISSIONS[role]?.[permission] ?? false
}

export function canAccessAdmin(userRole: UserRole): boolean {
  return userRole !== ROLES.USER
}

export function getRoleLabel(role: UserRole): string {
  return ROLE_LABELS[role] ?? 'Unknown'
}

export function getRoleDescription(role: UserRole): string {
  return ROLE_DESCRIPTIONS[role] ?? 'No description available'
}

// Navigation items based on role
export function getAdminNavItems(userRole: UserRole) {
  const items = []
  
  if (hasPermission(userRole, 'canManageDeals')) {
    items.push({ href: '/admin/deals', label: 'Deals', icon: 'ShoppingBag' })
  }
  
  if (hasPermission(userRole, 'canManageNews')) {
    items.push({ href: '/admin/news', label: 'News', icon: 'Newspaper' })
  }
  
  if (hasPermission(userRole, 'canManagePages')) {
    items.push({ href: '/admin/pages', label: 'Pages', icon: 'FileText' })
  }
  
  if (hasPermission(userRole, 'canManagePlatforms')) {
    items.push({ href: '/admin/platforms', label: 'Platforms', icon: 'Globe' })
  }
  
  if (hasPermission(userRole, 'canViewAnalytics')) {
    items.push({ href: '/admin/analytics', label: 'Analytics', icon: 'BarChart3' })
  }
  
  if (hasPermission(userRole, 'canManageUsers')) {
    items.push({ href: '/admin/users', label: 'Users', icon: 'Users' })
  }
  
  if (hasPermission(userRole, 'canManageSettings')) {
    items.push({ href: '/admin/settings', label: 'Settings', icon: 'Settings' })
  }
  
  return items
}
