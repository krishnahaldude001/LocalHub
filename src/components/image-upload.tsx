'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import {
  normalizeImageUrlForEmbed,
  displaySrcForImageUrl,
} from '@/lib/image-url'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Upload, X, Image as ImageIcon, Link, Eye, EyeOff, Check } from 'lucide-react'
import { toast } from 'sonner'

interface ImageUploadProps {
  value?: string
  onChange: (url: string) => void
  focusX?: number
  onFocusXChange?: (value: number) => void
  focusY?: number
  onFocusYChange?: (value: number) => void
  placeholder?: string
  className?: string
}

function LiveCropPreview({
  displaySrc,
  focusX,
  focusY,
  framing,
  aspectClassName,
}: {
  displaySrc: string
  focusX: number
  focusY: number
  framing: boolean
  aspectClassName: string
}) {
  const errRef = useRef(false)
  useEffect(() => {
    errRef.current = false
  }, [displaySrc])

  return (
    <div
      className={`relative w-full overflow-hidden rounded-md border bg-muted ${aspectClassName}`}
    >
      <img
        src={displaySrc}
        alt="Preview"
        referrerPolicy="no-referrer"
        className="absolute inset-0 h-full w-full object-cover transition-[object-position] duration-75"
        style={
          framing
            ? { objectPosition: `${focusX}% ${focusY}%` }
            : { objectPosition: '50% 50%' }
        }
        onError={() => {
          if (!errRef.current) {
            errRef.current = true
            toast.error(
              'Could not load image. For Google Drive, set sharing to “Anyone with the link”, or upload the file instead.'
            )
          }
        }}
      />
    </div>
  )
}

export default function ImageUpload({
  value = '',
  onChange,
  focusX = 50,
  onFocusXChange,
  focusY = 50,
  onFocusYChange,
  placeholder = 'Enter image URL or upload a file',
  className = '',
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [inputMode, setInputMode] = useState<'url' | 'upload'>('url')
  const [previewOn, setPreviewOn] = useState(true)
  const [pendingFile, setPendingFile] = useState<File | null>(null)
  const [pendingObjectUrl, setPendingObjectUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const framing = Boolean(onFocusXChange || onFocusYChange)

  const revokePending = useCallback(() => {
    setPendingObjectUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev)
      return null
    })
    setPendingFile(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }, [])

  const latestBlobRef = useRef<string | null>(null)
  useEffect(() => {
    latestBlobRef.current = pendingObjectUrl
  }, [pendingObjectUrl])

  useEffect(() => {
    return () => {
      if (latestBlobRef.current) URL.revokeObjectURL(latestBlobRef.current)
    }
  }, [])

  const committedSrc = value.trim() ? displaySrcForImageUrl(value) : ''
  const resolvedSrc = pendingObjectUrl ?? committedSrc

  const handleUrlChange = (url: string) => {
    revokePending()
    const normalized = url.trim() === '' ? '' : normalizeImageUrlForEmbed(url)
    onChange(normalized)
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB')
      return
    }

    setPendingObjectUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev)
      return URL.createObjectURL(file)
    })
    setPendingFile(file)
    toast.info('Preview ready — adjust framing, then confirm upload.')
  }

  const confirmPendingUpload = async () => {
    if (!pendingFile) return

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', pendingFile)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) throw new Error('Upload failed')

      const result = await response.json()
      const url = typeof result.url === 'string' ? result.url : ''
      revokePending()
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
    revokePending()
    onChange('')
  }

  const setMode = (mode: 'url' | 'upload') => {
    if (mode === 'url') revokePending()
    setInputMode(mode)
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex gap-2">
          <Button
            type="button"
            variant={inputMode === 'url' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setMode('url')}
            className="flex items-center gap-2"
          >
            <Link className="h-4 w-4" />
            URL
          </Button>
          <Button
            type="button"
            variant={inputMode === 'upload' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setMode('upload')}
            className="flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            Upload
          </Button>
        </div>
        <Button
          type="button"
          variant={previewOn ? 'secondary' : 'outline'}
          size="sm"
          className="gap-2"
          onClick={() => setPreviewOn((v) => !v)}
        >
          {previewOn ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          {previewOn ? 'Preview on' : 'Preview off'}
        </Button>
      </div>

      <div className="lg:grid lg:grid-cols-[1fr_min(36%,300px)] lg:items-start lg:gap-6">
        <div className="space-y-4 min-w-0">
          {inputMode === 'url' && (
            <div className="space-y-2">
              <Label htmlFor="image-url">Image URL</Label>
              <Input
                id="image-url"
                type="text"
                inputMode="url"
                autoComplete="off"
                placeholder={placeholder}
                value={value}
                onChange={(e) => handleUrlChange(e.target.value)}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                Google Drive links are converted for embedding. Use &quot;Anyone with the link&quot;
                so the image loads for visitors.
              </p>
            </div>
          )}

          {inputMode === 'upload' && (
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="image-upload">Choose image file</Label>
                <div className="flex flex-wrap items-center gap-2">
                  <Input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    ref={fileInputRef}
                    className="flex-1 min-w-[200px]"
                    disabled={isUploading}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  JPG, PNG, GIF, WebP · max 5MB. You get a <strong>local preview</strong> first; nothing is uploaded until
                  you click <strong>Confirm upload</strong>.
                </p>
              </div>

              {pendingFile && (
                <div className="flex flex-wrap gap-2 rounded-md border border-dashed border-primary/40 bg-primary/5 p-3">
                  <Button
                    type="button"
                    size="sm"
                    onClick={confirmPendingUpload}
                    disabled={isUploading}
                    className="gap-1"
                  >
                    <Check className="h-4 w-4" />
                    {isUploading ? 'Uploading…' : 'Confirm upload'}
                  </Button>
                  <Button type="button" size="sm" variant="outline" onClick={revokePending} disabled={isUploading}>
                    Discard file
                  </Button>
                </div>
              )}
            </div>
          )}

          {framing && resolvedSrc && previewOn && (
            <div className="space-y-4 rounded-lg border bg-muted/30 p-4">
              <p className="text-sm font-medium">Frame position (updates live)</p>
              {onFocusXChange && (
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Left ↔ right</Label>
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
              {onFocusYChange && (
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Up ↔ down</Label>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={focusY}
                    onChange={(e) => onFocusYChange(Number(e.target.value))}
                    className="w-full accent-primary"
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {resolvedSrc && previewOn && (
          <div className="hidden lg:block">
            <Card className="sticky top-4 overflow-hidden">
              <CardContent className="p-3 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <ImageIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <span className="text-sm font-medium truncate">Side preview</span>
                  </div>
                  <Button type="button" variant="ghost" size="sm" className="h-8 w-8 shrink-0 p-0" onClick={clearImage}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <LiveCropPreview
                  displaySrc={resolvedSrc}
                  focusX={focusX}
                  focusY={focusY}
                  framing={framing}
                  aspectClassName="aspect-[4/3] min-h-[180px]"
                />
                {pendingObjectUrl && (
                  <p className="text-xs text-amber-700 dark:text-amber-400">Not saved yet — confirm upload below.</p>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {resolvedSrc && previewOn && (
        <Card>
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <ImageIcon className="h-5 w-5 shrink-0 text-muted-foreground" />
                <div className="min-w-0">
                  <p className="text-sm font-medium">Live framing (hero)</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {pendingObjectUrl
                      ? 'Local preview — confirm upload to attach to the article'
                      : value.startsWith('data:')
                        ? 'Uploaded file'
                        : 'Article featured image crop'}
                  </p>
                </div>
              </div>
              <Button type="button" variant="ghost" size="sm" className="h-8 w-8 shrink-0 p-0" onClick={clearImage}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <LiveCropPreview
              displaySrc={resolvedSrc}
              focusX={focusX}
              focusY={focusY}
              framing={framing}
              aspectClassName="h-52 sm:h-64 md:h-72"
            />
          </CardContent>
        </Card>
      )}

      {resolvedSrc && !previewOn && (
        <p className="text-xs text-muted-foreground">
          Preview is off. Turn it on to see the image, check Drive URLs, and adjust framing.
        </p>
      )}
    </div>
  )
}
