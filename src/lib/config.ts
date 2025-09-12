// Global configuration for the app
export const config = {
  // App branding
  appName: 'LocalHub', // Changed from GovandiHub to be more global
  appDescription: 'Your local hub for news, deals, and community updates',
  appUrl: 'https://localhub.com',
  
  // Default location (can be overridden)
  defaultLocation: {
    name: 'Mumbai',
    areas: ['Govandi', 'Mankhurd', 'Kurla', 'Ghatkopar', 'Powai', 'Andheri', 'Bandra', 'Dadar', 'Thane'],
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India'
  },
  
  // Supported locations (for future expansion)
  supportedLocations: [
    {
      name: 'Mumbai',
      areas: ['Govandi', 'Mankhurd', 'Kurla', 'Ghatkopar', 'Powai', 'Andheri', 'Bandra', 'Dadar', 'Thane'],
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India'
    },
    {
      name: 'Delhi',
      areas: ['Connaught Place', 'Karol Bagh', 'Lajpat Nagar', 'CP', 'Rajouri Garden', 'Dwarka'],
      city: 'New Delhi',
      state: 'Delhi',
      country: 'India'
    },
    {
      name: 'Bangalore',
      areas: ['Koramangala', 'Indiranagar', 'Whitefield', 'Electronic City', 'Marathahalli', 'HSR Layout'],
      city: 'Bangalore',
      state: 'Karnataka',
      country: 'India'
    }
  ],
  
  // Contact information
  contact: {
    email: 'hello@localhub.com',
    phone: '+91-9876543210',
    address: 'Mumbai, Maharashtra, India'
  },
  
  // Social media
  social: {
    whatsapp: 'https://wa.me/919876543210',
    twitter: 'https://twitter.com/localhub',
    facebook: 'https://facebook.com/localhub',
    instagram: 'https://instagram.com/localhub'
  },
  
  // Features
  features: {
    news: true,
    deals: true,
    election: true,
    search: true,
    darkMode: true,
    affiliateTracking: true
  }
}

// Helper function to get current location config
export function getCurrentLocation(locationName?: string) {
  if (!locationName) {
    return config.defaultLocation
  }
  
  const location = config.supportedLocations.find(loc => 
    loc.name.toLowerCase() === locationName.toLowerCase()
  )
  
  return location || config.defaultLocation
}

// Helper function to get all areas across all locations
export function getAllAreas() {
  return config.supportedLocations.flatMap(location => location.areas)
}

// Helper function to get areas for a specific location
export function getAreasForLocation(locationName?: string) {
  const location = getCurrentLocation(locationName)
  return location.areas
}
