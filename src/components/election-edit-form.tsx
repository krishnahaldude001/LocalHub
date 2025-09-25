'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Save, FileText, Eye, Upload, Image, BarChart3 } from 'lucide-react'
import { toast } from 'sonner'

interface ElectionArticle {
  id: string
  title: string
  excerpt: string
  category: string
  area: string
  author: string
  content: string
  status: string
  featured: boolean
  hasPDF: boolean
  hasData: boolean
  tags: string[]
  publishedAt: string
}

interface ElectionEditFormProps {
  article: ElectionArticle
  articleId?: string
}

const categories = [
  { value: 'demographics', label: 'Demographics' },
  { value: 'constituency', label: 'Constituency' },
  { value: 'trends', label: 'Trends' },
  { value: 'issues', label: 'Issues' },
  { value: 'analytics', label: 'Analytics' }
]

const areas = [
  { value: 'govandi', label: 'Govandi' },
  { value: 'shivaji-nagar', label: 'Shivaji Nagar' },
  { value: 'baiganwadi', label: 'Baiganwadi' },
  { value: 'all-areas', label: 'All Areas' }
]

export default function ElectionEditForm({ article, articleId }: ElectionEditFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: article.title,
    excerpt: article.excerpt,
    category: article.category,
    area: article.area,
    author: article.author,
    content: article.content,
    status: article.status,
    featured: article.featured,
    hasPDF: article.hasPDF,
    hasData: article.hasData,
    tags: article.tags.join(', '),
    publishedAt: new Date(article.publishedAt).toISOString().slice(0, 16)
  })

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSaveChanges = async () => {
    setIsLoading(true)
    const id = articleId || article.id
    console.log('Saving changes for article:', id)
    console.log('Form data:', formData)
    
    try {
      const response = await fetch(`/api/admin/election/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
        })
      })

      console.log('Response status:', response.status)
      console.log('Response ok:', response.ok)

      if (response.ok) {
        const result = await response.json()
        toast.success('Changes saved successfully!')
        console.log('Article updated:', result.article)
      } else {
        const error = await response.json()
        console.error('API Error:', error)
        toast.error(error.message || 'Failed to save changes')
      }
    } catch (error) {
      console.error('Error saving changes:', error)
      toast.error('Failed to save changes')
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateArticle = async () => {
    setIsLoading(true)
    const id = articleId || article.id
    console.log('Updating article:', id)
    console.log('Form data:', formData)
    
    try {
      const response = await fetch(`/api/admin/election/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
          status: 'published'
        })
      })

      console.log('Response status:', response.status)
      console.log('Response ok:', response.ok)

      if (response.ok) {
        const result = await response.json()
        toast.success('Article updated and published!')
        console.log('Article updated:', result.article)
        router.push('/admin/election')
      } else {
        const error = await response.json()
        console.error('API Error:', error)
        toast.error(error.message || 'Failed to update article')
      }
    } catch (error) {
      console.error('Error updating article:', error)
      toast.error('Failed to update article')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePreview = () => {
    // Open preview in new tab
    const id = articleId || article.id
    window.open(`/election/articles/${id}`, '_blank')
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main Form */}
      <div className="lg:col-span-2 space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Essential details for your election article</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Article Title *</Label>
                <Input 
                  id="title" 
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="author">Author *</Label>
                <Input 
                  id="author" 
                  value={formData.author}
                  onChange={(e) => handleInputChange('author', e.target.value)}
                  className="w-full"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="excerpt">Article Excerpt *</Label>
              <Textarea 
                id="excerpt" 
                value={formData.excerpt}
                onChange={(e) => handleInputChange('excerpt', e.target.value)}
                className="w-full"
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="area">Area *</Label>
                <Select value={formData.area} onValueChange={(value) => handleInputChange('area', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select area" />
                  </SelectTrigger>
                  <SelectContent>
                    {areas.map((area) => (
                      <SelectItem key={area.value} value={area.value}>
                        {area.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content */}
        <Card>
          <CardHeader>
            <CardTitle>Article Content</CardTitle>
            <CardDescription>Write your election article content</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="content">Article Content *</Label>
              <Textarea 
                id="content" 
                value={formData.content}
                onChange={(e) => handleInputChange('content', e.target.value)}
                className="w-full min-h-[400px]"
                rows={20}
              />
              <p className="text-sm text-muted-foreground">
                You can use markdown formatting for rich text content
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Images and Media */}
        <Card>
          <CardHeader>
            <CardTitle>Images and Media</CardTitle>
            <CardDescription>Manage images, charts, and visual content</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="featured-image">Featured Image</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Image className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-sm text-gray-600 mb-2">Current featured image</p>
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Change Image
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Inline Images</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Image className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-sm text-gray-600 mb-2">Manage inline images</p>
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Add Images
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data and Analytics */}
        <Card>
          <CardHeader>
            <CardTitle>Data and Analytics</CardTitle>
            <CardDescription>Manage data files, charts, and analytics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Switch 
                  id="has-pdf" 
                  checked={formData.hasPDF}
                  onCheckedChange={(checked) => handleInputChange('hasPDF', checked)}
                />
                <Label htmlFor="has-pdf">Include PDF Report</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch 
                  id="has-data" 
                  checked={formData.hasData}
                  onCheckedChange={(checked) => handleInputChange('hasData', checked)}
                />
                <Label htmlFor="has-data">Include Data Files</Label>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Data Files</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <BarChart3 className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-sm text-gray-600 mb-2">Manage data files</p>
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Data
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* Publish Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Publish Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="publish-date">Publish Date</Label>
              <Input 
                id="publish-date" 
                type="datetime-local"
                value={formData.publishedAt}
                onChange={(e) => handleInputChange('publishedAt', e.target.value)}
                className="w-full"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="featured" 
                checked={formData.featured}
                onCheckedChange={(checked) => handleInputChange('featured', checked)}
              />
              <Label htmlFor="featured">Featured Article</Label>
            </div>
          </CardContent>
        </Card>

        {/* Tags */}
        <Card>
          <CardHeader>
            <CardTitle>Tags</CardTitle>
            <CardDescription>Manage article tags</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="tags">Add Tags</Label>
              <Input 
                id="tags" 
                placeholder="Enter tags separated by commas"
                value={formData.tags}
                onChange={(e) => handleInputChange('tags', e.target.value)}
                className="w-full"
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              {formData.tags.split(',').map((tag, index) => (
                tag.trim() && (
                  <Badge key={index} variant="secondary">{tag.trim()}</Badge>
                )
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Article Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Article Statistics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Views</span>
              <span className="font-medium">1,250</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Downloads</span>
              <span className="font-medium">89</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Last Updated</span>
              <span className="font-medium">2 days ago</span>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              className="w-full" 
              onClick={handleSaveChanges}
              disabled={isLoading}
            >
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button 
              className="w-full" 
              onClick={handleUpdateArticle}
              disabled={isLoading}
            >
              <FileText className="h-4 w-4 mr-2" />
              {isLoading ? 'Updating...' : 'Update Article'}
            </Button>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={handlePreview}
            >
              <Eye className="h-4 w-4 mr-2" />
              Preview Changes
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
