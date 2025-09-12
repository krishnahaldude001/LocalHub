"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MapPin, ChevronDown, Check } from 'lucide-react'
import { config, getAreasForLocation } from '@/lib/config'

interface LocationSelectorProps {
  currentArea?: string
  onAreaChange?: (area: string) => void
  className?: string
}

export default function LocationSelector({ 
  currentArea, 
  onAreaChange, 
  className = "" 
}: LocationSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedArea, setSelectedArea] = useState(currentArea || config.defaultLocation.areas[0])
  
  const areas = getAreasForLocation()

  const handleAreaSelect = (area: string) => {
    setSelectedArea(area)
    setIsOpen(false)
    onAreaChange?.(area)
  }

  return (
    <div className={`relative ${className}`}>
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full justify-between"
      >
        <div className="flex items-center space-x-2">
          <MapPin className="h-4 w-4" />
          <span>{selectedArea}, {config.defaultLocation.city}</span>
        </div>
        <ChevronDown className="h-4 w-4" />
      </Button>

      {isOpen && (
        <Card className="absolute top-full left-0 right-0 mt-2 z-50 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Select Your Area</CardTitle>
            <CardDescription className="text-xs">
              Choose your area in {config.defaultLocation.city} to see relevant content
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-2 gap-2">
              {areas.map((area) => (
                <Button
                  key={area}
                  variant={selectedArea === area ? "default" : "ghost"}
                  size="sm"
                  onClick={() => handleAreaSelect(area)}
                  className="justify-start h-auto p-2"
                >
                  <div className="flex items-center space-x-2 w-full">
                    {selectedArea === area && <Check className="h-3 w-3" />}
                    <span className="text-xs">{area}</span>
                  </div>
                </Button>
              ))}
            </div>
            
            <div className="mt-4 pt-3 border-t">
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" />
                <span>Currently showing: {config.defaultLocation.city}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
