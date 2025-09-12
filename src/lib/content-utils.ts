// Utility functions for handling content with YouTube URLs

export interface ContentWithYouTube {
  content: string
  youtubeUrl?: string
}

export function parseContentWithYouTube(content: string): ContentWithYouTube {
  try {
    // Try to parse as JSON first (for new format)
    const parsed = JSON.parse(content)
    if (parsed.content && typeof parsed.content === 'string') {
      return parsed
    }
  } catch {
    // If not JSON, treat as plain content
  }
  
  // Return as plain content
  return { content }
}

export function serializeContentWithYouTube(data: ContentWithYouTube): string {
  if (data.youtubeUrl) {
    // Store as JSON if YouTube URL is present
    return JSON.stringify(data)
  }
  // Store as plain string if no YouTube URL
  return data.content
}

export function extractYouTubeFromContent(content: string): string | null {
  const parsed = parseContentWithYouTube(content)
  return parsed.youtubeUrl || null
}
