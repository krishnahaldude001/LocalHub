"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import RichTextEditor from '@/components/rich-text-editor'
import { config } from '@/lib/config'
import { Save } from 'lucide-react'

export default function NewsForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    image: '',
    youtubeUrl: '',
    area: config.defaultLocation.areas[0],
    author: 'Local News Team',
    category: 'General'
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/news', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Failed to create article')
      }

      const article = await response.json()
      console.log('Article created:', article)
      
      alert('Article created successfully!')
      router.push('/admin/news')
    } catch (error) {
      console.error('Error creating article:', error)
      alert('Failed to create article. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const categories = [
    'General',
    'Infrastructure',
    'Local Business',
    'Community',
    'Transport',
    'Culture',
    'Education',
    'Health',
    'Sports',
    'Events'
  ]

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="title">Article Title *</Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="e.g., Major Infrastructure Updates Coming to Govandi"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category *</Label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            required
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="excerpt">Article Excerpt *</Label>
        <textarea
          id="excerpt"
          name="excerpt"
          value={formData.excerpt}
          onChange={handleInputChange}
          placeholder="Brief summary of the article (2-3 sentences)..."
          className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Article Content *</Label>
        <RichTextEditor
          content={formData.content}
          onChange={(content) => setFormData(prev => ({ ...prev, content }))}
          placeholder="Write your full article content here..."
        />
      </div>

      {/* Author and Location */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="author">Author *</Label>
          <Input
            id="author"
            name="author"
            value={formData.author}
            onChange={handleInputChange}
            placeholder="e.g., Local News Team"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="area">Area *</Label>
          <select
            id="area"
            name="area"
            value={formData.area}
            onChange={handleInputChange}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            required
          >
            {config.defaultLocation.areas.map(area => (
              <option key={area} value={area}>{area}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Featured Image */}
      <div className="space-y-2">
        <Label htmlFor="image">Featured Image URL *</Label>
        <Input
          id="image"
          name="image"
          type="url"
          value={formData.image}
          onChange={handleInputChange}
          placeholder="https://images.unsplash.com/photo-..."
          required
        />
      </div>

      {/* YouTube Video */}
      <div className="space-y-2">
        <Label htmlFor="youtubeUrl">YouTube Video URL (Optional)</Label>
        <Input
          id="youtubeUrl"
          name="youtubeUrl"
          type="url"
          value={formData.youtubeUrl}
          onChange={handleInputChange}
          placeholder="https://www.youtube.com/watch?v=..."
        />
        <p className="text-sm text-muted-foreground">
          Add a YouTube video URL to embed a video in your article
        </p>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => router.push('/admin/news')}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            'Creating...'
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Create Article
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
