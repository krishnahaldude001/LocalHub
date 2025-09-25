'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { ArrowLeft, Save, User, Shield, Eye, Edit, Trash2, Settings, AlertTriangle, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import UserPermissionForm from '@/components/user-permission-form'

interface User {
  id: string
  name: string | null
  email: string
  role: string
  createdAt: Date
  updatedAt: Date
  image?: string | null
}

interface UserEditFormProps {
  user: User
  userId: string
}

export default function UserEditForm({ user, userId }: UserEditFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: user.name || '',
    email: user.email,
    password: '',
    role: user.role
  })
  const [selectedRole, setSelectedRole] = useState(user.role)
  const router = useRouter()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleRoleChange = (role: string) => {
    setSelectedRole(role)
    setFormData(prev => ({
      ...prev,
      role
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      console.log('Updating user:', userId)
      console.log('Form data:', formData)
      
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      console.log('Response status:', response.status)
      console.log('Response ok:', response.ok)

      if (response.ok) {
        const result = await response.json()
        toast.success('User updated successfully!')
        console.log('User updated:', result.user)
        router.push('/admin/users')
      } else {
        const error = await response.json()
        console.error('API Error:', error)
        toast.error(error.message || 'Failed to update user')
      }
    } catch (error) {
      console.error('Error updating user:', error)
      toast.error('Failed to update user')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
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
                    <Input 
                      id="name" 
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter full name" 
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input 
                      id="email" 
                      name="email"
                      type="email" 
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="user@example.com" 
                      required 
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">New Password (optional)</Label>
                    <Input 
                      id="password" 
                      name="password"
                      type="password" 
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Leave blank to keep current" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">User Role</Label>
                    <Select value={selectedRole} onValueChange={handleRoleChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Administrator</SelectItem>
                        <SelectItem value="editor">Content Editor</SelectItem>
                        <SelectItem value="dealer">Deal Manager</SelectItem>
                        <SelectItem value="news_writer">News Writer</SelectItem>
                        <SelectItem value="user">Regular User</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Permission Settings */}
            <UserPermissionForm 
              selectedRole={selectedRole} 
              onRoleChange={handleRoleChange} 
            />
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
                    <Badge variant="outline">3 permissions</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Write Access</span>
                    <Badge variant="outline">2 permissions</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Delete Access</span>
                    <Badge variant="outline">0 permissions</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Admin Access</span>
                    <Badge variant="outline">0 permissions</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between mt-8">
          <div className="flex items-center gap-4">
            <Button variant="destructive" size="sm" type="button">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete User
            </Button>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/admin/users">
              <Button variant="outline" type="button">Cancel</Button>
            </Link>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </div>
    </form>
  )
}
