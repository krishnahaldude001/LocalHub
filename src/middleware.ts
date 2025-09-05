import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const { pathname } = req.nextUrl

    // Only check role permissions for admin routes (not auth routes)
    if (pathname.startsWith('/admin') && !pathname.startsWith('/api/auth')) {
      const userRole = (token as any)?.role || 'user'

      // Admin routes that require specific permissions
      const adminRoutes = {
        '/admin/users': ['admin'],
        '/admin/settings': ['admin'],
        '/admin/pages': ['admin'],
        '/admin/deals': ['admin', 'editor', 'dealer'],
        '/admin/news': ['admin', 'editor', 'news_writer'],
        '/admin/analytics': ['admin', 'editor', 'dealer', 'news_writer'],
        '/admin/dashboard': ['admin', 'editor', 'dealer', 'news_writer'],
      }

      // Check if user has permission for the current route
      for (const [route, allowedRoles] of Object.entries(adminRoutes)) {
        if (pathname.startsWith(route)) {
          if (!allowedRoles.includes(userRole)) {
            return NextResponse.redirect(new URL("/unauthorized", req.url))
          }
          break
        }
      }
    }
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl
        
        // Always allow auth routes and API routes
        if (
          pathname.startsWith('/auth') ||
          pathname.startsWith('/api/auth') ||
          pathname.startsWith('/api/') ||
          pathname === '/' ||
          pathname.startsWith('/news') ||
          pathname.startsWith('/deals') ||
          pathname.startsWith('/election') ||
          pathname.startsWith('/search') ||
          pathname.startsWith('/api/click') ||
          pathname.startsWith('/api/og') ||
          pathname === '/sitemap.xml' ||
          pathname === '/robots.txt' ||
          pathname === '/unauthorized'
        ) {
          return true
        }

        // Require authentication for admin routes only
        if (pathname.startsWith('/admin')) {
          return !!token
        }

        return true
      },
    },
  }
)

export const config = {
  matcher: [
    '/admin/:path*',
  ]
}
