// Role-based access control utilities

export type UserRole = 'admin' | 'editor' | 'dealer' | 'news_writer' | 'user'

export type Permission = 
  | 'canManageUsers' | 'canReadUsers' | 'canCreateUsers' | 'canEditUsers' | 'canDeleteUsers'
  | 'canManageDeals' | 'canReadDeals' | 'canCreateDeals' | 'canEditDeals' | 'canDeleteDeals'
  | 'canManageNews' | 'canReadNews' | 'canCreateNews' | 'canEditNews' | 'canDeleteNews'
  | 'canManagePages' | 'canManagePlatforms' | 'canManageShops'
  | 'canReadShops' | 'canCreateShops' | 'canEditShops' | 'canDeleteShops'
  | 'canViewAnalytics' | 'canManageSettings'

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
    canReadUsers: true,
    canCreateUsers: true,
    canEditUsers: true,
    canDeleteUsers: true,
    canManageDeals: true,
    canReadDeals: true,
    canCreateDeals: true,
    canEditDeals: true,
    canDeleteDeals: true,
    canManageNews: true,
    canReadNews: true,
    canCreateNews: true,
    canEditNews: true,
    canDeleteNews: true,
    canManagePages: true,
    canManagePlatforms: true,
    canManageShops: true,
    canReadShops: true,
    canCreateShops: true,
    canEditShops: true,
    canDeleteShops: true,
    canViewAnalytics: true,
    canManageSettings: true,
  },
  [ROLES.EDITOR]: {
    canManageUsers: false,
    canReadUsers: true,
    canCreateUsers: false,
    canEditUsers: false,
    canDeleteUsers: false,
    canManageDeals: true,
    canReadDeals: true,
    canCreateDeals: true,
    canEditDeals: true,
    canDeleteDeals: false,
    canManageNews: true,
    canReadNews: true,
    canCreateNews: true,
    canEditNews: true,
    canDeleteNews: false,
    canManagePages: false,
    canManagePlatforms: false,
    canManageShops: false,
    canReadShops: true,
    canCreateShops: false,
    canEditShops: false,
    canDeleteShops: false,
    canViewAnalytics: true,
    canManageSettings: false,
  },
  [ROLES.DEALER]: {
    canManageUsers: false,
    canReadUsers: false,
    canCreateUsers: false,
    canEditUsers: false,
    canDeleteUsers: false,
    canManageDeals: true,
    canReadDeals: true,
    canCreateDeals: true,
    canEditDeals: true,
    canDeleteDeals: true,
    canManageNews: false,
    canReadNews: false,
    canCreateNews: false,
    canEditNews: false,
    canDeleteNews: false,
    canManagePages: false,
    canManagePlatforms: false,
    canManageShops: true,
    canReadShops: true,
    canCreateShops: true,
    canEditShops: true,
    canDeleteShops: true,
    canViewAnalytics: true,
    canManageSettings: false,
  },
  [ROLES.NEWS_WRITER]: {
    canManageUsers: false,
    canReadUsers: false,
    canCreateUsers: false,
    canEditUsers: false,
    canDeleteUsers: false,
    canManageDeals: false,
    canReadDeals: false,
    canCreateDeals: false,
    canEditDeals: false,
    canDeleteDeals: false,
    canManageNews: true,
    canReadNews: true,
    canCreateNews: true,
    canEditNews: true,
    canDeleteNews: false,
    canManagePages: false,
    canManagePlatforms: false,
    canManageShops: false,
    canReadShops: false,
    canCreateShops: false,
    canEditShops: false,
    canDeleteShops: false,
    canViewAnalytics: false,
    canManageSettings: false,
  },
  [ROLES.USER]: {
    canManageUsers: false,
    canReadUsers: false,
    canCreateUsers: false,
    canEditUsers: false,
    canDeleteUsers: false,
    canManageDeals: false,
    canReadDeals: true,
    canCreateDeals: false,
    canEditDeals: false,
    canDeleteDeals: false,
    canManageNews: false,
    canReadNews: true,
    canCreateNews: false,
    canEditNews: false,
    canDeleteNews: false,
    canManagePages: false,
    canManagePlatforms: false,
    canManageShops: false,
    canReadShops: true,
    canCreateShops: false,
    canEditShops: false,
    canDeleteShops: false,
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
export function hasPermission(role: UserRole, permission: Permission): boolean {
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
    items.push({ href: '/admin/election', label: 'Election', icon: 'BarChart3' })
  }
  
  if (hasPermission(userRole, 'canManagePages')) {
    items.push({ href: '/admin/pages', label: 'Pages', icon: 'FileText' })
  }
  
  if (hasPermission(userRole, 'canManagePlatforms')) {
    items.push({ href: '/admin/platforms', label: 'Platforms', icon: 'Globe' })
  }
  
  if (hasPermission(userRole, 'canManageShops')) {
    items.push({ href: '/admin/shops', label: 'Shops', icon: 'Store' })
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
