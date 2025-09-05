export interface Post {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  image: string
  area: string
  publishedAt: string
  author: string
  category: string
}

export interface Deal {
  id: string
  slug: string
  title: string
  description: string
  price: number
  salePrice?: number
  platform: 'amazon' | 'flipkart' | 'meesho'
  affiliateUrl: string
  rating: number
  cod: boolean
  image: string
  gallery: string[]
  area: string
  publishedAt: string
}

export const samplePosts: Post[] = [
  {
    id: '1',
    slug: 'govandi-infrastructure-updates-2024',
    title: 'Major Infrastructure Updates Coming to Govandi in 2024',
    excerpt: 'Exciting developments including road widening, new parks, and improved public transport connectivity.',
    content: 'The Municipal Corporation has announced a comprehensive infrastructure development plan for Govandi in 2024. This includes widening of major roads, construction of new parks and recreational areas, and significant improvements to public transport connectivity. The project is expected to be completed in phases over the next 18 months.',
    image: 'https://picsum.photos/800/400?random=12',
    area: 'Govandi',
    publishedAt: '2024-01-15T10:00:00Z',
    author: 'Local News Team',
    category: 'Infrastructure'
  },
  {
    id: '2',
    slug: 'shivaji-nagar-market-renovation',
    title: 'Shivaji Nagar Market Gets Major Facelift',
    excerpt: 'Historic market area undergoes renovation with modern amenities while preserving cultural heritage.',
    content: 'The iconic Shivaji Nagar market, a cornerstone of local commerce for decades, is undergoing a major renovation. The project includes modern amenities like better lighting, improved drainage, and enhanced accessibility while carefully preserving the area\'s rich cultural heritage and traditional architecture.',
    image: 'https://picsum.photos/800/400?random=13',
    area: 'Shivaji Nagar',
    publishedAt: '2024-01-12T14:30:00Z',
    author: 'Community Reporter',
    category: 'Local Business'
  },
  {
    id: '3',
    slug: 'baiganwadi-community-center-opening',
    title: 'New Community Center Opens in Baiganwadi',
    excerpt: 'State-of-the-art facility offers educational programs, health services, and recreational activities.',
    content: 'A new community center has opened its doors in Baiganwadi, providing residents with access to educational programs, health services, and recreational activities. The facility features modern classrooms, a health clinic, and a multi-purpose hall for community events and celebrations.',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=400&fit=crop',
    area: 'Baiganwadi',
    publishedAt: '2024-01-10T09:15:00Z',
    author: 'Social Development Desk',
    category: 'Community'
  },
  {
    id: '4',
    slug: 'govandi-transport-improvements',
    title: 'Public Transport Improvements in Govandi',
    excerpt: 'New bus routes and improved frequency to enhance connectivity across the area.',
    content: 'The transport department has announced significant improvements to public transport services in Govandi. This includes new bus routes connecting previously underserved areas, increased frequency during peak hours, and the introduction of air-conditioned buses on major routes.',
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&h=400&fit=crop',
    area: 'Govandi',
    publishedAt: '2024-01-08T16:45:00Z',
    author: 'Transport Correspondent',
    category: 'Transport'
  },
  {
    id: '5',
    slug: 'shivaji-nagar-cultural-festival',
    title: 'Annual Cultural Festival Returns to Shivaji Nagar',
    excerpt: 'Week-long celebration featuring traditional music, dance, and local cuisine.',
    content: 'The much-anticipated annual cultural festival is returning to Shivaji Nagar this month. The week-long celebration will feature traditional music performances, classical dance shows, local cuisine demonstrations, and workshops on traditional arts and crafts.',
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&h=400&fit=crop',
    area: 'Shivaji Nagar',
    publishedAt: '2024-01-05T11:20:00Z',
    author: 'Cultural Affairs',
    category: 'Culture'
  },
  {
    id: '6',
    slug: 'baiganwadi-education-initiative',
    title: 'New Education Initiative Launched in Baiganwadi',
    excerpt: 'Partnership with local schools to provide digital literacy and skill development programs.',
    content: 'A new education initiative has been launched in Baiganwadi, focusing on digital literacy and skill development. The program, in partnership with local schools and community organizations, aims to bridge the digital divide and prepare residents for the modern workforce.',
    image: 'https://images.unsplash.com/photo-1523240797355-351f22f4f71a?w=800&h=400&fit=crop',
    area: 'Baiganwadi',
    publishedAt: '2024-01-03T13:10:00Z',
    author: 'Education Desk',
    category: 'Education'
  }
]

export const sampleDeals: Deal[] = [
  {
    id: '1',
    slug: 'amazon-echo-dot-4th-gen',
    title: 'Echo Dot (4th Gen) - Smart Speaker with Alexa',
    description: 'Smart speaker with Alexa | Charcoal fabric design | 40% off',
    price: 4999,
    salePrice: 2999,
    platform: 'amazon',
    affiliateUrl: 'https://amzn.to/example1',
    rating: 4.5,
    cod: true,
    image: 'https://images.unsplash.com/photo-1543512214-318c7553f230?w=400&h=300&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1543512214-318c7553f230?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1543512214-318c7553f230?w=400&h=300&fit=crop'
    ],
    area: 'Govandi',
    publishedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    slug: 'flipkart-samsung-galaxy-m34',
    title: 'Samsung Galaxy M34 5G (Prism Silver, 8GB, 128GB Storage)',
    description: '6.5 inch FHD+ Display, 50MP Triple Camera, 6000mAh Battery',
    price: 18999,
    salePrice: 15999,
    platform: 'flipkart',
    affiliateUrl: 'https://flipkart.com/example1',
    rating: 4.2,
    cod: false,
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop'
    ],
    area: 'Shivaji Nagar',
    publishedAt: '2024-01-14T14:30:00Z'
  },
  {
    id: '3',
    slug: 'meesho-casual-tshirts-pack',
    title: 'Pack of 3 Casual T-Shirts for Men',
    description: 'Comfortable cotton t-shirts, perfect for daily wear',
    price: 999,
    salePrice: 599,
    platform: 'meesho',
    affiliateUrl: 'https://meesho.com/example1',
    rating: 4.0,
    cod: true,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=300&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=300&fit=crop'
    ],
    area: 'Baiganwadi',
    publishedAt: '2024-01-13T09:15:00Z'
  },
  {
    id: '4',
    slug: 'amazon-mi-tv-4a',
    title: 'Mi TV 4A 80 cm (32 inches) HD Ready Android Smart LED TV',
    description: 'HD Ready (1366x768) | Android 9.0 | 1GB RAM + 8GB Storage',
    price: 15999,
    salePrice: 12999,
    platform: 'amazon',
    affiliateUrl: 'https://amzn.to/example2',
    rating: 4.3,
    cod: true,
    image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=300&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=300&fit=crop'
    ],
    area: 'Govandi',
    publishedAt: '2024-01-12T16:45:00Z'
  },
  {
    id: '5',
    slug: 'flipkart-boat-rockerz-450',
    title: 'boAt Rockerz 450 Bluetooth Headphones',
    description: '40mm Dynamic Drivers, 15 Hours Playback, Lightweight Design',
    price: 1999,
    salePrice: 1499,
    platform: 'flipkart',
    affiliateUrl: 'https://flipkart.com/example2',
    rating: 4.1,
    cod: false,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop'
    ],
    area: 'Shivaji Nagar',
    publishedAt: '2024-01-11T11:20:00Z'
  },
  {
    id: '6',
    slug: 'meesho-home-decor-set',
    title: 'Modern Home Decor Set - Wall Art & Cushions',
    description: 'Beautiful wall art prints and matching cushion covers for your living room',
    price: 2499,
    salePrice: 1799,
    platform: 'meesho',
    affiliateUrl: 'https://meesho.com/example2',
    rating: 4.4,
    cod: true,
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop'
    ],
    area: 'Baiganwadi',
    publishedAt: '2024-01-10T13:10:00Z'
  }
]

export const areas = ['Govandi', 'Shivaji Nagar', 'Baiganwadi'] as const
export type Area = typeof areas[number]
