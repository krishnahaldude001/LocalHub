import { Metadata } from 'next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { ArrowLeft, Save, Upload, Image, FileText, BarChart3 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Add New Election Article | Admin Dashboard',
  description: 'Create a new election article with data, images, and analytics.',
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

export default function AddElectionArticlePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/election">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Election Management
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Add New Election Article</h1>
          <p className="text-muted-foreground">Create a new election article with data, images, and analytics</p>
        </div>
      </div>

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
                    placeholder="Enter article title"
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="author">Author *</Label>
                  <Input 
                    id="author" 
                    placeholder="Author name"
                    className="w-full"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="excerpt">Article Excerpt *</Label>
                <Textarea 
                  id="excerpt" 
                  placeholder="Brief description of the article"
                  className="w-full"
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select>
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
                  <Select>
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
                  placeholder="Write your article content here..."
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
              <CardDescription>Add images, charts, and visual content</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="featured-image">Featured Image</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Image className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-sm text-gray-600 mb-2">Upload featured image</p>
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Choose File
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Inline Images</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Image className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-sm text-gray-600 mb-2">Upload images for inline content</p>
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
              <CardDescription>Add data files, charts, and analytics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Switch id="has-pdf" />
                  <Label htmlFor="has-pdf">Include PDF Report</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="has-data" />
                  <Label htmlFor="has-data">Include Data Files</Label>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Data Files</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <BarChart3 className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-sm text-gray-600 mb-2">Upload Excel, CSV, or other data files</p>
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
                <Select>
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
                  className="w-full"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch id="featured" />
                <Label htmlFor="featured">Featured Article</Label>
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
              <CardDescription>Add relevant tags for better organization</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="tags">Add Tags</Label>
                <Input 
                  id="tags" 
                  placeholder="Enter tags separated by commas"
                  className="w-full"
                />
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">Demographics</Badge>
                <Badge variant="secondary">Voting Patterns</Badge>
                <Badge variant="secondary">Age Groups</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full">
                <Save className="h-4 w-4 mr-2" />
                Save as Draft
              </Button>
              <Button className="w-full">
                <FileText className="h-4 w-4 mr-2" />
                Publish Article
              </Button>
              <Button variant="outline" className="w-full">
                Preview Article
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
