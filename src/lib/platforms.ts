export interface Platform {
  id: string
  name: string
  color: string
  description?: string
}

export const PLATFORMS: Platform[] = [
  {
    id: 'amazon',
    name: 'Amazon',
    color: 'bg-orange-500',
    description: 'Amazon India'
  },
  {
    id: 'flipkart',
    name: 'Flipkart',
    color: 'bg-blue-500',
    description: 'Flipkart'
  },
  {
    id: 'meesho',
    name: 'Meesho',
    color: 'bg-pink-500',
    description: 'Meesho'
  },
  {
    id: 'myntra',
    name: 'Myntra',
    color: 'bg-red-500',
    description: 'Myntra Fashion'
  },
  {
    id: 'nykaa',
    name: 'Nykaa',
    color: 'bg-purple-500',
    description: 'Nykaa Beauty'
  },
  {
    id: 'ajio',
    name: 'Ajio',
    color: 'bg-green-500',
    description: 'Ajio Fashion'
  },
  {
    id: 'tatacliq',
    name: 'Tata CLiQ',
    color: 'bg-indigo-500',
    description: 'Tata CLiQ'
  },
  {
    id: 'snapdeal',
    name: 'Snapdeal',
    color: 'bg-yellow-500',
    description: 'Snapdeal'
  },
  {
    id: 'paytm',
    name: 'Paytm Mall',
    color: 'bg-cyan-500',
    description: 'Paytm Mall'
  },
  {
    id: 'shopclues',
    name: 'ShopClues',
    color: 'bg-teal-500',
    description: 'ShopClues'
  },
  {
    id: 'jiomart',
    name: 'JioMart',
    color: 'bg-emerald-500',
    description: 'JioMart'
  },
  {
    id: 'bigbasket',
    name: 'BigBasket',
    color: 'bg-lime-500',
    description: 'BigBasket Grocery'
  },
  {
    id: 'grofers',
    name: 'Grofers',
    color: 'bg-amber-500',
    description: 'Grofers (Blinkit)'
  },
  {
    id: 'swiggy',
    name: 'Swiggy',
    color: 'bg-orange-600',
    description: 'Swiggy Instamart'
  },
  {
    id: 'zomato',
    name: 'Zomato',
    color: 'bg-red-600',
    description: 'Zomato'
  },
  {
    id: 'bookmyshow',
    name: 'BookMyShow',
    color: 'bg-pink-600',
    description: 'BookMyShow'
  },
  {
    id: 'makemytrip',
    name: 'MakeMyTrip',
    color: 'bg-blue-600',
    description: 'MakeMyTrip'
  },
  {
    id: 'goibibo',
    name: 'Goibibo',
    color: 'bg-indigo-600',
    description: 'Goibibo'
  },
  {
    id: 'cleartrip',
    name: 'Cleartrip',
    color: 'bg-cyan-600',
    description: 'Cleartrip'
  },
  {
    id: 'other',
    name: 'Other',
    color: 'bg-gray-500',
    description: 'Other Platform'
  }
]

export function getPlatformById(id: string): Platform | undefined {
  return PLATFORMS.find(platform => platform.id === id)
}

export function getPlatformColor(platformId: string): string {
  const platform = getPlatformById(platformId)
  return platform?.color || 'bg-gray-500'
}

export function getPlatformName(platformId: string): string {
  const platform = getPlatformById(platformId)
  return platform?.name || platformId
}

export function getPlatformDescription(platformId: string): string {
  const platform = getPlatformById(platformId)
  return platform?.description || platformId
}
