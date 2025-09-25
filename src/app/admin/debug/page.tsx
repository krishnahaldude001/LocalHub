import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { hasPermission, type UserRole } from '@/lib/roles'

export default async function DebugPage() {
  const session = await getServerSession(authOptions)
  const userRole = (session?.user as any)?.role as UserRole || 'user'
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Debug Information</h1>
      
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">Session Data:</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm">
            {JSON.stringify(session, null, 2)}
          </pre>
        </div>
        
        <div>
          <h2 className="text-lg font-semibold">User Role:</h2>
          <p className="text-lg">{userRole}</p>
        </div>
        
        <div>
          <h2 className="text-lg font-semibold">Permissions:</h2>
          <div className="grid grid-cols-2 gap-2">
            <div>canCreateUsers: {hasPermission(userRole, 'canCreateUsers') ? '✅' : '❌'}</div>
            <div>canEditUsers: {hasPermission(userRole, 'canEditUsers') ? '✅' : '❌'}</div>
            <div>canDeleteUsers: {hasPermission(userRole, 'canDeleteUsers') ? '✅' : '❌'}</div>
            <div>canManageUsers: {hasPermission(userRole, 'canManageUsers') ? '✅' : '❌'}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
