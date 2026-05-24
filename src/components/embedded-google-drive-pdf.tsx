import {
  driveFilePageUrlFromPreviewUrl,
  normalizeGoogleDrivePdfEmbedUrl,
} from '@/lib/google-drive-pdf-embed'

interface EmbeddedGoogleDrivePdfProps {
  /** Stored value from the database (already normalized on save, but re-validated here). */
  embedUrl: string | null | undefined
  title?: string
}

/**
 * Renders a Google Drive PDF using the official /preview embed URL.
 * `embedUrl` must be a trusted value from your database (set only via admin APIs).
 */
export default function EmbeddedGoogleDrivePdf({
  embedUrl,
  title = 'Embedded document',
}: EmbeddedGoogleDrivePdfProps) {
  const preview = normalizeGoogleDrivePdfEmbedUrl(embedUrl || '')
  if (!preview) return null

  const openInDrive = driveFilePageUrlFromPreviewUrl(preview)

  return (
    <div className="my-8 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-lg font-semibold">Document</h3>
        <a
          href={openInDrive}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-primary underline"
        >
          Open in Google Drive
        </a>
      </div>
      <div className="w-full overflow-hidden rounded-lg border bg-muted/20">
        <iframe
          src={preview}
          title={title}
          className="min-h-[600px] w-full"
          allow="fullscreen"
          loading="lazy"
        />
      </div>
    </div>
  )
}
