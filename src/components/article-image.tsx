import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Download, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ArticleImageProps {
  src: string
  alt: string
  caption?: string
  credit?: string
  downloadUrl?: string
  externalUrl?: string
  size?: 'small' | 'medium' | 'large' | 'full'
  align?: 'left' | 'center' | 'right'
  type?: 'chart' | 'photo' | 'infographic' | 'map' | 'diagram'
}

export default function ArticleImage({
  src,
  alt,
  caption,
  credit,
  downloadUrl,
  externalUrl,
  size = 'medium',
  align = 'center',
  type = 'photo'
}: ArticleImageProps) {
  const sizeClasses = {
    small: 'max-w-sm mx-auto',
    medium: 'max-w-2xl mx-auto',
    large: 'max-w-4xl mx-auto',
    full: 'w-full'
  }

  const alignClasses = {
    left: 'ml-0 mr-auto',
    center: 'mx-auto',
    right: 'ml-auto mr-0'
  }

  const typeColors = {
    chart: 'bg-blue-100 text-blue-800',
    photo: 'bg-green-100 text-green-800',
    infographic: 'bg-purple-100 text-purple-800',
    map: 'bg-orange-100 text-orange-800',
    diagram: 'bg-pink-100 text-pink-800'
  }

  return (
    <div className={`my-8 ${sizeClasses[size]} ${alignClasses[align]}`}>
      <Card className="overflow-hidden">
        <div className="relative">
          <img 
            src={src} 
            alt={alt}
            className="w-full h-auto"
          />
          {type && (
            <div className="absolute top-2 left-2">
              <Badge className={`text-xs ${typeColors[type]}`}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Badge>
            </div>
          )}
        </div>
        
        {(caption || credit || downloadUrl || externalUrl) && (
          <CardContent className="p-4">
            {caption && (
              <p className="text-sm text-muted-foreground mb-2 italic">
                {caption}
              </p>
            )}
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {credit && (
                  <span className="text-xs text-muted-foreground">
                    Credit: {credit}
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                {downloadUrl && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={downloadUrl} download>
                      <Download className="h-3 w-3 mr-1" />
                      Download
                    </a>
                  </Button>
                )}
                {externalUrl && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={externalUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-3 w-3 mr-1" />
                      View
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  )
}
