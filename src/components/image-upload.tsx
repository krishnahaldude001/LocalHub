'use client'

import { useState, useRef, useEffect } from 'react'
import { normalizeImageUrlForEmbed } from '@/lib/image-url'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Upload, X, Image as ImageIcon, Link } from 'lucide-react'
import { toast } from 'sonner'

interface ImageUploadProps {
  value?: string
  onChange: (url: string) => void
  /** 0 = show left of frame, 100 = right; used for featured-image horizontal framing */
  focusX?: number
  onFocusXChange?: (value: number) => void
  placeholder?: string
  className?: string
}

export default function ImageUpload({ 
  value = '', 
  onChange,
  focusX = 50,
  onFocusXChange,
  placeholder = "Enter image URL or upload a file",
  className = ""
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState(value)
  const [inputMode, setInputMode] = useState<'url' | 'upload'>('url')
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setPreviewUrl(value)
  }, [value])

  const handleUrlChange = (url: string) => {
    const normalized = url.trim() === '' ? '' : normalizeImageUrlForEmbed(url)
    setPreviewUrl(normalized)
    onChange(normalized)
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB')
      return
    }

    setIsUploading(true)

    try {
      // Upload to our API endpoint
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const result = await response.json()
      const url = typeof result.url === 'string' ? result.url : ''
      setPreviewUrl(url)
      onChange(url)
      toast.success('Image uploaded successfully!')
    } catch (error) {
      console.error('Error uploading image:', error)
      toast.error('Failed to upload image')
    } finally {
      setIsUploading(false)
    }
  }

  const clearImage = () => {
    setPreviewUrl('')
    onChange('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Mode Toggle */}
      <div className="flex gap-2">
        <Button
          type="button"
          variant={inputMode === 'url' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setInputMode('url')}
          className="flex items-center gap-2"
        >
          <Link className="h-4 w-4" />
          URL
        </Button>
        <Button
          type="button"
          variant={inputMode === 'upload' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setInputMode('upload')}
          className="flex items-center gap-2"
        >
          <Upload className="h-4 w-4" />
          Upload
        </Button>
      </div>

      {/* URL Input Mode */}
      {inputMode === 'url' && (
        <div className="space-y-2">
          <Label htmlFor="image-url">Image URL</Label>
          <Input
            id="image-url"
            type="url"
            placeholder={placeholder}
            value={value}
            onChange={(e) => handleUrlChange(e.target.value)}
            className="w-full"
          />
        </div>
      )}

      {/* File Upload Mode */}
      {inputMode === 'upload' && (
        <div className="space-y-2">
          <Label htmlFor="image-upload">Upload Image</Label>
          <div className="flex items-center gap-2">
            <Input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              ref={fileInputRef}
              className="flex-1"
              disabled={isUploading}
            />
            {isUploading && (
              <div className="text-sm text-gray-500">Uploading...</div>
            )}
          </div>
          <p className="text-xs text-gray-500">
            Supported formats: JPG, PNG, GIF. Max size: 5MB
          </p>
        </div>
      )}

      {/* Image Preview */}
      {previewUrl && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <ImageIcon className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm font-medium">Image Preview</p>
                  <p className="text-xs text-gray-500">
                    {previewUrl.startsWith('data:') ? 'Uploaded file' : 'External URL'}
                  </p>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={clearImage}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="mt-3">
              <div className="relative w-full h-40 overflow-hidden rounded-md border bg-muted">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="absolute inset-0 h-full w-full object-cover"
                  style={
                    onFocusXChange
                      ? { objectPosition: `${focusX}% center` }
                      : undefined
                  }
                  onError={() => {
                    toast.error('Failed to load image preview')
                    setPreviewUrl('')
                  }}
                />
              </div>
              {onFocusXChange && previewUrl && (
                <div className="mt-3 space-y-2">
                  <Label className="text-xs text-muted-foreground">
                    Frame position (left ↔ right)
                  </Label>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={focusX}
                    onChange={(e) => onFocusXChange(Number(e.target.value))}
                    className="w-full accent-primary"
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
