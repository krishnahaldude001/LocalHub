"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import ImageUpload from '@/components/image-upload'
import { config } from '@/lib/config'
import { stringifyGallery } from '@/lib/db'
import { Save, Plus, X, Store, Globe } from 'lucide-react'

interface Platform {
  id: string
  name: string
  slug: string
  color: string
}

interface Shop {
  id: string
  name: string
  slug: string
  area: string
  category: string
}

export default function DealForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [platforms, setPlatforms] = useState<Platform[]>([])
  const [shops, setShops] = useState<Shop[]>([])
  const [galleryImages, setGalleryImages] = useState<string[]>([''])
  const [dealType, setDealType] = useState<'platform' | 'shop'>('platform')

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    salePrice: '',
    platformId: '',
    shopId: '',
    affiliateUrl: '',
    rating: '4.0',
    cod: true,
    image: '',
    youtubeUrl: '',
    area: config.defaultLocation.areas[0],
    category: '',
    discountType: 'percentage'
  })

  // Fetch platforms and shops on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch platforms
        const platformsResponse = await fetch('/api/admin/platforms')
        if (platformsResponse.ok) {
          const platformsData = await platformsResponse.json()
          setPlatforms(platformsData)
          // Set default platform if available
          if (platformsData.length > 0 && !formData.platformId) {
            setFormData(prev => ({ ...prev, platformId: platformsData[0].id }))
          }
        }

        // Fetch shops
        const shopsResponse = await fetch('/api/shops')
        if (shopsResponse.ok) {
          const shopsData = await shopsResponse.json()
          setShops(shopsData)
        }
      } catch (error) {
        console.error('Failed to fetch data:', error)
      }
    }
    fetchData()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const addGalleryImage = () => {
    setGalleryImages(prev => [...prev, ''])
  }

  const removeGalleryImage = (index: number) => {
    setGalleryImages(prev => prev.filter((_, i) => i !== index))
  }

  const updateGalleryImage = (index: number, value: string) => {
    setGalleryImages(prev => prev.map((img, i) => i === index ? value : img))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Generate slug from title
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')

      // Prepare gallery data
      const gallery = galleryImages.filter(img => img.trim() !== '')

      const dealData = {
        slug,
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        salePrice: formData.salePrice ? parseFloat(formData.salePrice) : null,
        platformId: dealType === 'platform' ? formData.platformId : null,
        shopId: dealType === 'shop' ? formData.shopId : null,
        affiliateUrl: dealType === 'platform' ? formData.affiliateUrl : null,
        rating: parseFloat(formData.rating),
        cod: formData.cod,
        image: formData.image,
        youtubeUrl: formData.youtubeUrl,
        gallery: stringifyGallery(gallery),
        area: formData.area,
        category: formData.category,
        discountType: formData.discountType,
        isActive: true
      }

      const response = await fetch('/api/admin/deals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dealData),
      })

      if (response.ok) {
        router.push('/admin')
        router.refresh()
      } else {
        throw new Error('Failed to create deal')
      }
    } catch (error) {
      console.error('Error creating deal:', error)
      alert('Failed to create deal. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Deal Type Selection */}
      <div className="space-y-4">
        <Label>Deal Type *</Label>
        <div className="flex gap-4">
          <Button
            type="button"
            variant={dealType === 'platform' ? 'default' : 'outline'}
            onClick={() => setDealType('platform')}
            className="flex items-center gap-2"
          >
            <Globe className="h-4 w-4" />
            Affiliate Marketing
          </Button>
          <Button
            type="button"
            variant={dealType === 'shop' ? 'default' : 'outline'}
            onClick={() => setDealType('shop')}
            className="flex items-center gap-2"
          >
            <Store className="h-4 w-4" />
            Local Shop Deal
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          {dealType === 'platform' 
            ? 'Create an affiliate marketing deal with external platform links'
            : 'Create a local shop deal with Cash on Delivery option'
          }
        </p>
      </div>

      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="title">Product Title *</Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="e.g., Echo Dot (4th Gen) - Smart Speaker"
            required
          />
        </div>

        {dealType === 'platform' ? (
          <div className="space-y-2">
            <Label htmlFor="platformId">Platform *</Label>
            <select
              id="platformId"
              name="platformId"
              value={formData.platformId}
              onChange={handleInputChange}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              required
            >
              <option value="">Select a platform</option>
              {platforms.map((platform) => (
                <option key={platform.id} value={platform.id}>
                  {platform.name}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div className="space-y-2">
            <Label htmlFor="shopId">Shop *</Label>
            <select
              id="shopId"
              name="shopId"
              value={formData.shopId}
              onChange={handleInputChange}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              required
            >
              <option value="">Select a shop</option>
              {shops.map((shop) => (
                <option key={shop.id} value={shop.id}>
                  {shop.name} ({shop.area})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Describe the product and its features..."
          className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          required
        />
      </div>

      {/* Pricing and Category */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label htmlFor="price">Original Price (₹) *</Label>
          <Input
            id="price"
            name="price"
            type="number"
            value={formData.price}
            onChange={handleInputChange}
            placeholder="4999"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="salePrice">Sale Price (₹)</Label>
          <Input
            id="salePrice"
            name="salePrice"
            type="number"
            value={formData.salePrice}
            onChange={handleInputChange}
            placeholder="2999"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="rating">Rating (0-5) *</Label>
          <Input
            id="rating"
            name="rating"
            type="number"
            step="0.1"
            min="0"
            max="5"
            value={formData.rating}
            onChange={handleInputChange}
            placeholder="4.5"
            required
          />
        </div>
      </div>

      {/* Category and Discount Type (for shop deals) */}
      {dealType === 'shop' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              required
            >
              <option value="">Select category</option>
              <option value="electronics">Electronics</option>
              <option value="clothing">Clothing</option>
              <option value="home">Home & Garden</option>
              <option value="beauty">Beauty & Health</option>
              <option value="sports">Sports & Fitness</option>
              <option value="books">Books & Media</option>
              <option value="automotive">Automotive</option>
              <option value="food">Food & Beverages</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="discountType">Discount Type *</Label>
            <select
              id="discountType"
              name="discountType"
              value={formData.discountType}
              onChange={handleInputChange}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              required
            >
              <option value="percentage">Percentage Off</option>
              <option value="fixed">Fixed Amount Off</option>
              <option value="buy-one-get-one">Buy One Get One</option>
              <option value="bulk">Bulk Discount</option>
              <option value="clearance">Clearance Sale</option>
            </select>
          </div>
        </div>
      )}

      {/* URLs and Location */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {dealType === 'platform' && (
          <div className="space-y-2">
            <Label htmlFor="affiliateUrl">Affiliate URL *</Label>
            <Input
              id="affiliateUrl"
              name="affiliateUrl"
              type="url"
              value={formData.affiliateUrl}
              onChange={handleInputChange}
              placeholder="https://amzn.to/example"
              required
            />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="area">Area *</Label>
          <select
            id="area"
            name="area"
            value={formData.area}
            onChange={handleInputChange}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            required
          >
            {config.defaultLocation.areas.map(area => (
              <option key={area} value={area}>{area}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Image */}
      <div className="space-y-2">
        <Label>Main Image *</Label>
        <ImageUpload
          value={formData.image}
          onChange={(url) => setFormData(prev => ({ ...prev, image: url }))}
          placeholder="Enter image URL or upload a file"
        />
      </div>

      {/* YouTube Video */}
      <div className="space-y-2">
        <Label htmlFor="youtubeUrl">YouTube Video URL (Optional)</Label>
        <Input
          id="youtubeUrl"
          name="youtubeUrl"
          type="url"
          value={formData.youtubeUrl}
          onChange={handleInputChange}
          placeholder="https://www.youtube.com/watch?v=..."
        />
        <p className="text-sm text-muted-foreground">
          Add a YouTube video URL to embed a product review or demo video
        </p>
      </div>

      {/* Gallery Images */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Gallery Images</Label>
          <Button type="button" variant="outline" size="sm" onClick={addGalleryImage}>
            <Plus className="h-4 w-4 mr-2" />
            Add Image
          </Button>
        </div>
        {galleryImages.map((image, index) => (
          <div key={index} className="flex items-center gap-2">
            <Input
              value={image}
              onChange={(e) => updateGalleryImage(index, e.target.value)}
              placeholder="https://images.unsplash.com/photo-..."
              className="flex-1"
            />
            {galleryImages.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeGalleryImage(index)}
                className="text-red-500 hover:text-red-700"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
      </div>

      {/* COD Option */}
      <div className="flex items-center space-x-2">
        <input
          id="cod"
          name="cod"
          type="checkbox"
          checked={formData.cod}
          onChange={handleInputChange}
          className="h-4 w-4 rounded border-gray-300"
        />
        <Label htmlFor="cod">Cash on Delivery Available</Label>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => router.push('/admin')}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            'Creating...'
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Create Deal
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
