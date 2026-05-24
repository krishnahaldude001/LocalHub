/**
 * Normalizes Google Drive file URLs into the embed-safe /preview URL.
 * Intended for publicly shared Drive files so the iframe viewer can load them.
 */

function isPlausibleDriveFileId(id: string): boolean {
  /* Google Drive file IDs vary in length; keep a loose sanity range. */
  return id.length >= 6 && id.length <= 128 && /^[a-zA-Z0-9_-]+$/.test(id)
}

function sanitizeToDriveHttps(raw: string): URL | null {
  let s = raw.trim()
  if (!s) return null
  if (s.startsWith('http://')) {
    s = `https://${s.slice('http://'.length)}`
  }

  try {
    const u = new URL(s)
    if (u.protocol !== 'https:') return null
    if (u.hostname === 'www.drive.google.com') {
      u.hostname = 'drive.google.com'
    }
    if (u.hostname !== 'drive.google.com') return null
    return u
  } catch {
    return null
  }
}

/**
 * Accepts Drive share URLs (view/edit/open) or an existing preview URL.
 * Returns `https://drive.google.com/file/d/{id}/preview` or null if not a recognized Drive file link.
 */
export function normalizeGoogleDrivePdfEmbedUrl(
  raw: string | null | undefined
): string | null {
  const u = sanitizeToDriveHttps(raw || '')
  if (!u) return null

  const previewPath = u.pathname.match(/^\/file\/d\/([a-zA-Z0-9_-]+)\/preview(?:\/|$)/)
  const idPreview = previewPath?.[1]
  if (idPreview && isPlausibleDriveFileId(idPreview)) {
    return `https://drive.google.com/file/d/${idPreview}/preview`
  }

  const filePath = u.pathname.match(/^\/file\/d\/([a-zA-Z0-9_-]+)(?:\/|$)/)
  const idFile = filePath?.[1]
  if (idFile && isPlausibleDriveFileId(idFile)) {
    return `https://drive.google.com/file/d/${idFile}/preview`
  }

  if (u.pathname === '/open' || u.pathname === '/open/') {
    const id = u.searchParams.get('id')
    if (id && isPlausibleDriveFileId(id)) {
      return `https://drive.google.com/file/d/${id}/preview`
    }
  }

  if (u.pathname === '/uc' || u.pathname === '/uc/') {
    const id = u.searchParams.get('id')
    if (id && isPlausibleDriveFileId(id)) {
      return `https://drive.google.com/file/d/${id}/preview`
    }
  }

  return null
}

/** User-facing Drive page URL (fallback when iframe is inconvenient). */
export function driveFilePageUrlFromPreviewUrl(previewUrl: string): string {
  try {
    const u = new URL(previewUrl)
    u.pathname = u.pathname.replace(/\/preview\/?$/, '/view')
    return u.toString()
  } catch {
    return previewUrl.replace(/\/preview(?:\?.*)?$/, '/view')
  }
}
