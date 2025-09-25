'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeft, Save, UserPlus, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import UserPermissionForm from '@/components/user-permission-form'

export default function UserForm() {
  const [selectedRole, setSelectedRole] = useState('user')
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user'
  })
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
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        toast.success('User created successfully!')
        router.push('/admin/users')
      } else {
        const error = await response.json()
        toast.error(error.message || 'Failed to create user')
      }
    } catch (error) {
      console.error('Error creating user:', error)
      toast.error('Failed to create user')
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
              <h1 className="text-3xl font-bold">Add New User</h1>
              <p className="text-muted-foreground">Create a new user with custom permissions</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserPlus className="h-5 w-5" />
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
                    <Label htmlFor="password">Password</Label>
                    <Input 
                      id="password" 
                      name="password"
                      type="password" 
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Enter password" 
                      required 
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
          {/* Role Information */}
          <Card>
            <CardHeader>
              <CardTitle>Selected Role</CardTitle>
              <CardDescription>Current role information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Role</span>
                  <span className="text-sm font-medium capitalize">{selectedRole}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Access Level</span>
                  <span className="text-sm text-muted-foreground">
                    {selectedRole === 'admin' ? 'Full Access' : 
                     selectedRole === 'editor' ? 'Content Management' :
                     selectedRole === 'dealer' ? 'Deal Management' :
                     selectedRole === 'news_writer' ? 'News Only' : 'Basic Access'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-4 mt-8">
          <Link href="/admin/users">
            <Button variant="outline" type="button">Cancel</Button>
          </Link>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            {isLoading ? 'Creating...' : 'Create User'}
          </Button>
        </div>
      </div>
    </form>
  )
}
