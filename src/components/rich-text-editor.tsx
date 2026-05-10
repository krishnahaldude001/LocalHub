"use client"

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Quote, 
  Undo, 
  Redo,
  Link as LinkIcon,
  Image as ImageIcon,
  Upload,
  Check,
} from 'lucide-react'
import { useState, useEffect, useRef, useCallback } from 'react'
import { toast } from 'sonner'
import { normalizeImageUrlForEmbed } from '@/lib/image-url'

interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
}

export default function RichTextEditor({ content, onChange, placeholder = "Start writing..." }: RichTextEditorProps) {
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')
  const [isImageModalOpen, setIsImageModalOpen] = useState(false)
  const [imageModalTab, setImageModalTab] = useState<'url' | 'upload'>('url')
  const [imageUrlInput, setImageUrlInput] = useState('')
  const [isImageUploading, setIsImageUploading] = useState(false)
  const [pendingEditorFile, setPendingEditorFile] = useState<File | null>(null)
  const [pendingEditorObjectUrl, setPendingEditorObjectUrl] = useState<string | null>(null)
  const [isMounted, setIsMounted] = useState(false)
  const imageFileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline',
        },
      }),
    ],
    content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[200px] p-4 border rounded-md',
      },
    },
  })

  const revokeEditorPending = useCallback(() => {
    setPendingEditorObjectUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev)
      return null
    })
    setPendingEditorFile(null)
    if (imageFileRef.current) imageFileRef.current.value = ''
  }, [])

  const openImageModal = () => {
    setImageUrlInput('')
    setImageModalTab('url')
    revokeEditorPending()
    setIsImageModalOpen(true)
  }

  const closeImageModal = () => {
    revokeEditorPending()
    setIsImageModalOpen(false)
  }

  const setImageTab = (t: 'url' | 'upload') => {
    if (t === 'url') revokeEditorPending()
    setImageModalTab(t)
  }

  const insertImageFromUrl = () => {
    const raw = imageUrlInput.trim()
    if (!raw || !editor) {
      toast.error('Enter an image URL')
      return
    }
    const src = normalizeImageUrlForEmbed(raw)
    editor.chain().focus().setImage({ src }).run()
    revokeEditorPending()
    setIsImageModalOpen(false)
    setImageUrlInput('')
    toast.success('Image added')
  }

  const handleEditorFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
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

    setPendingEditorObjectUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev)
      return URL.createObjectURL(file)
    })
    setPendingEditorFile(file)
    toast.info('Preview ready — confirm to upload and insert.')
  }

  const confirmEditorUpload = async () => {
    if (!pendingEditorFile || !editor) return

    setIsImageUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', pendingEditorFile)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) throw new Error('Upload failed')

      const result = await response.json()
      const url = typeof result.url === 'string' ? result.url : ''
      if (!url) throw new Error('No URL returned')

      revokeEditorPending()
      editor.chain().focus().setImage({ src: url }).run()
      setIsImageModalOpen(false)
      if (result.publicUrl === false) {
        toast.success('Image added (inline only)')
        toast.warning(
          'For share previews use a public https image or set BLOB_READ_WRITE_TOKEN on the server and upload again.'
        )
      } else {
        toast.success('Image added')
      }
    } catch {
      toast.error('Failed to upload image')
    } finally {
      setIsImageUploading(false)
    }
  }

  const addLink = () => {
    if (linkUrl && editor) {
      editor.chain().focus().setLink({ href: linkUrl }).run()
      setLinkUrl('')
      setIsLinkModalOpen(false)
    }
  }

  if (!isMounted || !editor) {
    return (
      <div className="border rounded-lg">
        <div className="flex flex-wrap items-center gap-1 p-2 border-b bg-muted/50">
          <div className="h-8 w-8 bg-muted animate-pulse rounded"></div>
          <div className="h-8 w-8 bg-muted animate-pulse rounded"></div>
          <div className="h-8 w-8 bg-muted animate-pulse rounded"></div>
          <div className="h-8 w-8 bg-muted animate-pulse rounded"></div>
        </div>
        <div className="min-h-[200px] p-4 border rounded-md bg-muted/20">
          <div className="space-y-2">
            <div className="h-4 bg-muted animate-pulse rounded w-3/4"></div>
            <div className="h-4 bg-muted animate-pulse rounded w-1/2"></div>
            <div className="h-4 bg-muted animate-pulse rounded w-2/3"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="border rounded-lg">
      <div className="flex flex-wrap items-center gap-1 p-2 border-b bg-muted/50">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive('bold') ? 'bg-accent' : ''}
        >
          <Bold className="h-4 w-4" />
        </Button>
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive('italic') ? 'bg-accent' : ''}
        >
          <Italic className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-border mx-1" />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive('bulletList') ? 'bg-accent' : ''}
        >
          <List className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive('orderedList') ? 'bg-accent' : ''}
        >
          <ListOrdered className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={editor.isActive('blockquote') ? 'bg-accent' : ''}
        >
          <Quote className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-border mx-1" />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setIsLinkModalOpen(true)}
          className={editor.isActive('link') ? 'bg-accent' : ''}
        >
          <LinkIcon className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={openImageModal}
        >
          <ImageIcon className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-border mx-1" />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
        >
          <Undo className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>

      <EditorContent 
        editor={editor} 
        className="min-h-[200px]"
        placeholder={placeholder}
      />

      {isLinkModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Add Link</h3>
            <input
              type="url"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="Enter URL..."
              className="w-full p-2 border rounded-md mb-4"
              autoFocus
            />
            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={() => setIsLinkModalOpen(false)}>
                Cancel
              </Button>
              <Button type="button" onClick={addLink}>
                Add Link
              </Button>
            </div>
          </div>
        </div>
      )}

      {isImageModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-lg shadow-lg max-w-md w-full mx-4 space-y-4">
            <h3 className="text-lg font-semibold">Insert image</h3>
            <p className="text-sm text-muted-foreground">
              Paste a URL or pick a file. For uploads you see a <strong>local preview</strong> first, then confirm to upload and insert.
            </p>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={imageModalTab === 'url' ? 'default' : 'outline'}
                size="sm"
                className="gap-2"
                onClick={() => setImageTab('url')}
              >
                <LinkIcon className="h-4 w-4" />
                URL
              </Button>
              <Button
                type="button"
                variant={imageModalTab === 'upload' ? 'default' : 'outline'}
                size="sm"
                className="gap-2"
                onClick={() => setImageTab('upload')}
              >
                <Upload className="h-4 w-4" />
                Upload
              </Button>
            </div>
            {imageModalTab === 'url' ? (
              <div className="space-y-2">
                <Label htmlFor="editor-image-url">Image URL</Label>
                <Input
                  id="editor-image-url"
                  type="text"
                  inputMode="url"
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                  placeholder="https://… or Google Drive link"
                />
              </div>
            ) : (
              <div className="space-y-3">
                <Label htmlFor="editor-image-file">Choose image file</Label>
                <Input
                  id="editor-image-file"
                  type="file"
                  accept="image/*"
                  ref={imageFileRef}
                  onChange={handleEditorFileSelect}
                  disabled={isImageUploading}
                />
                <p className="text-xs text-muted-foreground">JPG, PNG, GIF, WebP · max 5MB</p>
                {pendingEditorObjectUrl && (
                  <>
                    <div className="rounded-md border overflow-hidden bg-muted max-h-48 flex items-center justify-center">
                      <img
                        src={pendingEditorObjectUrl}
                        alt=""
                        className="max-h-48 w-full object-contain"
                      />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        type="button"
                        size="sm"
                        onClick={confirmEditorUpload}
                        disabled={isImageUploading}
                        className="gap-1"
                      >
                        <Check className="h-4 w-4" />
                        {isImageUploading ? 'Uploading…' : 'Confirm upload & insert'}
                      </Button>
                      <Button type="button" size="sm" variant="outline" onClick={revokeEditorPending} disabled={isImageUploading}>
                        Discard
                      </Button>
                    </div>
                  </>
                )}
              </div>
            )}
            <div className="flex gap-2 justify-end pt-2">
              <Button type="button" variant="outline" onClick={closeImageModal}>
                Cancel
              </Button>
              {imageModalTab === 'url' && (
                <Button type="button" onClick={insertImageFromUrl}>
                  Insert
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
