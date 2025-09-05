"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'

interface Platform {
  id: string
  name: string
  slug: string
  color: string
  description: string | null
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  _count: {
    deals: number
  }
}

interface PlatformManagementProps {
  platforms: Platform[]
}

const COLOR_OPTIONS = [
  { value: 'bg-gray-500', label: 'Gray' },
  { value: 'bg-red-500', label: 'Red' },
  { value: 'bg-orange-500', label: 'Orange' },
  { value: 'bg-yellow-500', label: 'Yellow' },
  { value: 'bg-green-500', label: 'Green' },
  { value: 'bg-blue-500', label: 'Blue' },
  { value: 'bg-indigo-500', label: 'Indigo' },
  { value: 'bg-purple-500', label: 'Purple' },
  { value: 'bg-pink-500', label: 'Pink' },
  { value: 'bg-cyan-500', label: 'Cyan' },
  { value: 'bg-teal-500', label: 'Teal' },
  { value: 'bg-emerald-500', label: 'Emerald' },
  { value: 'bg-lime-500', label: 'Lime' },
  { value: 'bg-amber-500', label: 'Amber' },
  { value: 'bg-orange-600', label: 'Orange Dark' },
  { value: 'bg-red-600', label: 'Red Dark' },
  { value: 'bg-blue-600', label: 'Blue Dark' },
  { value: 'bg-indigo-600', label: 'Indigo Dark' },
  { value: 'bg-cyan-600', label: 'Cyan Dark' },
  { value: 'bg-pink-600', label: 'Pink Dark' },
]

export default function PlatformManagement({ platforms: initialPlatforms }: PlatformManagementProps) {
  const [platforms, setPlatforms] = useState(initialPlatforms)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingPlatform, setEditingPlatform] = useState<Platform | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    color: 'bg-gray-500',
    description: '',
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const resetForm = () => {
    setFormData({
      name: '',
      color: 'bg-gray-500',
      description: '',
    })
    setEditingPlatform(null)
  }

  const handleCreatePlatform = async () => {
    if (!formData.name.trim()) {
      toast.error('Platform name is required')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/admin/platforms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const newPlatform = await response.json()
        setPlatforms(prev => [...prev, newPlatform].sort((a, b) => a.name.localeCompare(b.name)))
        toast.success('Platform created successfully')
        setIsCreateDialogOpen(false)
        resetForm()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to create platform')
      }
    } catch (error) {
      toast.error('Failed to create platform')
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdatePlatform = async () => {
    if (!editingPlatform || !formData.name.trim()) {
      toast.error('Platform name is required')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`/api/admin/platforms/${editingPlatform.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const updatedPlatform = await response.json()
        setPlatforms(prev => 
          prev.map(p => p.id === updatedPlatform.id ? updatedPlatform : p)
            .sort((a, b) => a.name.localeCompare(b.name))
        )
        toast.success('Platform updated successfully')
        setEditingPlatform(null)
        resetForm()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to update platform')
      }
    } catch (error) {
      toast.error('Failed to update platform')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeletePlatform = async (platform: Platform) => {
    if ((platform._count?.deals || 0) > 0) {
      toast.error('Cannot delete platform that has deals. Please deactivate it instead.')
      return
    }

    if (!confirm(`Are you sure you want to delete "${platform.name}"?`)) {
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`/api/admin/platforms/${platform.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setPlatforms(prev => prev.filter(p => p.id !== platform.id))
        toast.success('Platform deleted successfully')
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to delete platform')
      }
    } catch (error) {
      toast.error('Failed to delete platform')
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleActive = async (platform: Platform) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/admin/platforms/${platform.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: platform.name,
          color: platform.color,
          description: platform.description,
          isActive: !platform.isActive,
        }),
      })

      if (response.ok) {
        const updatedPlatform = await response.json()
        setPlatforms(prev => 
          prev.map(p => p.id === updatedPlatform.id ? updatedPlatform : p)
        )
        toast.success(`Platform ${updatedPlatform.isActive ? 'activated' : 'deactivated'} successfully`)
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to update platform')
      }
    } catch (error) {
      toast.error('Failed to update platform')
    } finally {
      setIsLoading(false)
    }
  }

  const startEdit = (platform: Platform) => {
    setEditingPlatform(platform)
    setFormData({
      name: platform.name,
      color: platform.color,
      description: platform.description || '',
    })
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold">All Platforms</h2>
          <Badge variant="outline">{platforms.length} platforms</Badge>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add Platform
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Platform</DialogTitle>
              <DialogDescription>
                Create a new e-commerce platform for your deals.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Platform Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="e.g., MyStore"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="color">Color</Label>
                <Select value={formData.color} onValueChange={(value) => handleInputChange('color', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {COLOR_OPTIONS.map((color) => (
                      <SelectItem key={color.value} value={color.value}>
                        <div className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded ${color.value}`} />
                          {color.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Brief description of the platform"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreatePlatform} disabled={isLoading}>
                  {isLoading ? 'Creating...' : 'Create Platform'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Platforms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {platforms.map((platform) => (
          <Card key={platform.id} className={`${!platform.isActive ? 'opacity-60' : ''}`}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge className={platform.color}>
                    {platform.name}
                  </Badge>
                  {!platform.isActive && (
                    <Badge variant="outline" className="text-xs">
                      Inactive
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggleActive(platform)}
                    disabled={isLoading}
                  >
                    {platform.isActive ? (
                      <Eye className="h-4 w-4" />
                    ) : (
                      <EyeOff className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => startEdit(platform)}
                    disabled={isLoading}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeletePlatform(platform)}
                    disabled={isLoading || (platform._count?.deals || 0) > 0}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">
                  {platform.description || 'No description'}
                </div>
                <div className="text-xs text-muted-foreground">
                  {platform._count?.deals || 0} deals • {platform.slug}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingPlatform} onOpenChange={() => setEditingPlatform(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Platform</DialogTitle>
            <DialogDescription>
              Update the platform information.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Platform Name *</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="e.g., MyStore"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-color">Color</Label>
              <Select value={formData.color} onValueChange={(value) => handleInputChange('color', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {COLOR_OPTIONS.map((color) => (
                    <SelectItem key={color.value} value={color.value}>
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded ${color.value}`} />
                        {color.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Input
                id="edit-description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Brief description of the platform"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setEditingPlatform(null)}>
                Cancel
              </Button>
              <Button onClick={handleUpdatePlatform} disabled={isLoading}>
                {isLoading ? 'Updating...' : 'Update Platform'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
