"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Edit, Trash2, Loader2, Eye } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

interface ElectionActionsProps {
  articleId: string
  articleTitle: string
  canEdit: boolean
  canDelete: boolean
}

export default function ElectionActions({ 
  articleId, 
  articleTitle, 
  canEdit, 
  canDelete 
}: ElectionActionsProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const response = await fetch(`/api/admin/election/${articleId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        toast.success('Article deleted successfully')
        router.refresh() // Refresh the page to update the article list
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to delete article')
      }
    } catch (error) {
      console.error('Error deleting article:', error)
      toast.error('Failed to delete article')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="flex items-center space-x-2">
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => router.push(`/election/articles/${articleId}`)}
      >
        <Eye className="h-4 w-4 mr-2" />
        View
      </Button>
      
      {canEdit && (
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => router.push(`/admin/election/${articleId}/edit`)}
        >
          <Edit className="h-4 w-4 mr-2" />
          Edit
        </Button>
      )}
      
      {canDelete && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-destructive hover:text-destructive"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4 mr-2" />
              )}
              Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the article{' '}
                <strong>{articleTitle}</strong> and remove it from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete Article
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  )
}
