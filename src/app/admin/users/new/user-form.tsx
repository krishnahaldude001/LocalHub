'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeft, Save, UserPlus } from 'lucide-react'
import Link from 'next/link'
import UserPermissionForm from '@/components/user-permission-form'

export default function UserForm() {
  const [selectedRole, setSelectedRole] = useState('user')

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
                  <Input id="name" placeholder="Enter full name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" placeholder="user@example.com" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" placeholder="Enter password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">User Role</Label>
                  <Select value={selectedRole} onValueChange={setSelectedRole}>
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
            onRoleChange={setSelectedRole} 
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
          <Button variant="outline">Cancel</Button>
        </Link>
        <Button>
          <Save className="h-4 w-4 mr-2" />
          Create User
        </Button>
      </div>
    </div>
  )
}
