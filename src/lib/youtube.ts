// Utility functions for YouTube URL handling

export function extractYouTubeId(url: string): string | null {
  if (!url) return null
  
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
  const match = url.match(regExp)
  return match && match[2].length === 11 ? match[2] : null
}

export function isValidYouTubeUrl(url: string): boolean {
  return extractYouTubeId(url) !== null
}

export function getYouTubeEmbedUrl(url: string): string | null {
  const videoId = extractYouTubeId(url)
  return videoId ? `https://www.youtube.com/embed/${videoId}` : null
}

export function getYouTubeThumbnailUrl(url: string): string | null {
  const videoId = extractYouTubeId(url)
  return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null
}
