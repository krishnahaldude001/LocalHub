'use client'

import { useState } from 'react'
import YouTubeEmbed from '@/components/youtube-embed'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function TestYouTubePage() {
  const [testUrl, setTestUrl] = useState('https://www.youtube.com/watch?v=dQw4w9WgXcQ')

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">YouTube Embed Test Page</h1>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Test YouTube Embedding</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="youtube-url">YouTube URL</Label>
              <Input
                id="youtube-url"
                value={testUrl}
                onChange={(e) => setTestUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="mt-1"
              />
            </div>
            
            <div>
              <Label>Preview</Label>
              <div className="mt-2">
                <YouTubeEmbed 
                  url={testUrl} 
                  title="Test Video"
                  className="w-full"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Supported URL Formats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p>• https://www.youtube.com/watch?v=VIDEO_ID</p>
              <p>• https://youtu.be/VIDEO_ID</p>
              <p>• https://www.youtube.com/embed/VIDEO_ID</p>
              <p>• https://youtube.com/watch?v=VIDEO_ID</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
