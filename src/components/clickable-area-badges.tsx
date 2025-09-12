'use client'

import { Badge } from '@/components/ui/badge'
import { MapPin } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'

interface ClickableAreaBadgesProps {
  areas: string[]
  selectedArea?: string
}

export default function ClickableAreaBadges({ areas, selectedArea }: ClickableAreaBadgesProps) {
  const [hoveredArea, setHoveredArea] = useState<string | null>(null)

  return (
    <div className="flex flex-wrap justify-center gap-3 mb-8">
      {areas.map((area, index) => {
        const isSelected = selectedArea === area
        const isHovered = hoveredArea === area
        
        return (
          <Link key={area} href={`/news?area=${encodeURIComponent(area)}`}>
            <Badge 
              className={`text-sm px-4 py-2 transition-all duration-200 cursor-pointer shadow-md border-0 font-medium ${
                isSelected 
                  ? 'bg-gradient-primary text-white scale-105 shadow-lg' 
                  : isHovered
                    ? 'bg-gradient-primary/90 text-white scale-105 shadow-lg'
                    : 'bg-white/95 text-gray-800 hover:bg-gradient-primary hover:text-white hover:scale-105 shadow-lg border border-gray-200'
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
              onMouseEnter={() => setHoveredArea(area)}
              onMouseLeave={() => setHoveredArea(null)}
            >
              <MapPin className="h-3 w-3 mr-2" />
              {area}
            </Badge>
          </Link>
        )
      })}
    </div>
  )
}
