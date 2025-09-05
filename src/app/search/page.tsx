"use client"

import { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { samplePosts, sampleDeals, areas } from '@/lib/sample-data'
import { formatDate, formatPrice, getDiscountPercentage, getPlatformColor, getPlatformName } from '@/lib/utils'
import Link from 'next/link'
import Image from 'next/image'
import { Search, MapPin, Calendar, Star, ArrowRight } from 'lucide-react'
import Fuse from 'fuse.js'

export default function SearchPage() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('q') || ''
  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [selectedArea, setSelectedArea] = useState<string>('all')
  const [activeTab, setActiveTab] = useState<'all' | 'news' | 'deals'>('all')

  // Configure Fuse.js for fuzzy search
  const fuseOptions = {
    keys: ['title', 'description', 'excerpt', 'content'],
    threshold: 0.3,
    includeScore: true,
  }

  const fuse = useMemo(() => new Fuse([...samplePosts, ...sampleDeals], fuseOptions), [])

  // Perform search
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return []
    
    const results = fuse.search(searchQuery)
    return results.map(result => result.item)
  }, [searchQuery, fuse])

  // Filter by area
  const filteredResults = useMemo(() => {
    if (selectedArea === 'all') return searchResults
    
    return searchResults.filter(item => {
      if ('area' in item) {
        return item.area === selectedArea
      }
      return false
    })
  }, [searchResults, selectedArea])

  // Separate results by type
  const newsResults = filteredResults.filter(item => 'excerpt' in item) as typeof samplePosts
  const dealResults = filteredResults.filter(item => 'platform' in item) as typeof sampleDeals

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      const url = new URL(window.location.href)
      url.searchParams.set('q', searchQuery.trim())
      window.history.pushState({}, '', url.toString())
    }
  }

  const handleAreaFilter = (area: string) => {
    setSelectedArea(area)
  }

  useEffect(() => {
    setSearchQuery(initialQuery)
  }, [initialQuery])

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Search Results</h1>
        <p className="text-xl text-muted-foreground">
          Find news, deals, and updates in your area
        </p>
      </div>

      {/* Search Form */}
      <div className="max-w-2xl mx-auto mb-8">
        <form onSubmit={handleSearch} className="flex gap-2">
          <Input
            placeholder="Search for news, deals, or topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
          <Button type="submit">
            <Search className="h-4 w-4" />
          </Button>
        </form>
      </div>

      {/* Area Filter */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        <Button
          variant={selectedArea === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleAreaFilter('all')}
        >
          All Areas
        </Button>
        {areas.map((area) => (
          <Button
            key={area}
            variant={selectedArea === area ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleAreaFilter(area)}
          >
            <MapPin className="h-3 w-3 mr-1" />
            {area}
          </Button>
        ))}
      </div>

      {/* Results Count */}
      {searchQuery.trim() && (
        <div className="text-center mb-6">
          <p className="text-muted-foreground">
            Found {filteredResults.length} result{filteredResults.length !== 1 ? 's' : ''} for "{searchQuery}"
          </p>
        </div>
      )}

      {/* Results Tabs */}
      {filteredResults.length > 0 && (
        <div className="mb-8">
          <div className="flex justify-center gap-4 mb-6">
            <Button
              variant={activeTab === 'all' ? 'default' : 'outline'}
              onClick={() => setActiveTab('all')}
            >
              All ({filteredResults.length})
            </Button>
            <Button
              variant={activeTab === 'news' ? 'default' : 'outline'}
              onClick={() => setActiveTab('news')}
            >
              News ({newsResults.length})
            </Button>
            <Button
              variant={activeTab === 'deals' ? 'default' : 'outline'}
              onClick={() => setActiveTab('deals')}
            >
              Deals ({dealResults.length})
            </Button>
          </div>

          {/* All Results */}
          {activeTab === 'all' && (
            <div className="space-y-6">
              {/* News Results */}
              {newsResults.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold mb-4">News Articles</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {newsResults.map((post) => (
                      <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="relative h-48">
                          <Image
                            src={post.image}
                            alt={post.title}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute top-3 left-3">
                            <Badge variant="secondary" className="bg-background/80">
                              {post.area}
                            </Badge>
                          </div>
                        </div>
                        <CardHeader className="pb-3">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                            <Calendar className="h-4 w-4" />
                            {formatDate(post.publishedAt)}
                          </div>
                          <CardTitle className="line-clamp-2 text-lg">
                            <Link href={`/news/${post.slug}`} className="hover:text-primary transition-colors">
                              {post.title}
                            </Link>
                          </CardTitle>
                          <CardDescription className="line-clamp-3">
                            {post.excerpt}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="flex items-center justify-between">
                            <Badge variant="outline">{post.category}</Badge>
                            <Link href={`/news/${post.slug}`}>
                              <Button variant="ghost" size="sm">
                                Read More
                                <ArrowRight className="h-4 w-4 ml-1" />
                              </Button>
                            </Link>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Deals Results */}
              {dealResults.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold mb-4">Deals</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {dealResults.map((deal) => (
                      <Card key={deal.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="relative h-48">
                          <Image
                            src={deal.image}
                            alt={deal.title}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute top-3 left-3">
                            <Badge variant="secondary" className="bg-background/80">
                              {deal.area}
                            </Badge>
                          </div>
                          {deal.salePrice && (
                            <div className="absolute top-3 right-3">
                              <Badge className="bg-red-500 text-white">
                                -{getDiscountPercentage(deal.price, deal.salePrice)}%
                              </Badge>
                            </div>
                          )}
                        </div>
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between mb-2">
                            <Badge className={getPlatformColor(deal.platform)}>
                              {getPlatformName(deal.platform)}
                            </Badge>
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm font-medium">{deal.rating}</span>
                            </div>
                          </div>
                          <CardTitle className="line-clamp-2 text-lg">
                            <Link href={`/deals/${deal.slug}`} className="hover:text-primary transition-colors">
                              {deal.title}
                            </Link>
                          </CardTitle>
                          <CardDescription className="line-clamp-2">
                            {deal.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                {deal.salePrice ? (
                                  <>
                                    <span className="text-lg font-bold text-primary">
                                      {formatPrice(deal.salePrice)}
                                    </span>
                                    <span className="text-sm text-muted-foreground line-through">
                                      {formatPrice(deal.price)}
                                    </span>
                                  </>
                                ) : (
                                  <span className="text-lg font-bold text-primary">
                                    {formatPrice(deal.price)}
                                  </span>
                                )}
                              </div>
                            </div>
                            <Link href={`/deals/${deal.slug}`}>
                              <Button className="w-full">
                                View Deal
                                <ArrowRight className="h-4 w-4 ml-1" />
                              </Button>
                            </Link>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* News Only */}
          {activeTab === 'news' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {newsResults.map((post) => (
                <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative h-48">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-gradient-primary text-white shadow-lg border-0">
                        {post.area}
                      </Badge>
                    </div>
                  </div>
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <Calendar className="h-4 w-4" />
                      {formatDate(post.publishedAt)}
                    </div>
                    <CardTitle className="line-clamp-2 text-lg">
                      <Link href={`/news/${post.slug}`} className="hover:text-primary transition-colors">
                        {post.title}
                      </Link>
                    </CardTitle>
                    <CardDescription className="line-clamp-3">
                      {post.excerpt}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">{post.category}</Badge>
                      <Link href={`/news/${post.slug}`}>
                        <Button variant="ghost" size="sm">
                          Read More
                          <ArrowRight className="h-4 w-4 ml-1" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Deals Only */}
          {activeTab === 'deals' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dealResults.map((deal) => (
                <Card key={deal.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative h-48">
                    <Image
                      src={deal.image}
                      alt={deal.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-gradient-primary text-white shadow-lg border-0">
                        {deal.area}
                      </Badge>
                    </div>
                    {deal.salePrice && (
                      <div className="absolute top-3 right-3">
                        <Badge className="bg-red-500 text-white">
                          -{getDiscountPercentage(deal.price, deal.salePrice)}%
                        </Badge>
                      </div>
                    )}
                  </div>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between mb-2">
                      <Badge className={getPlatformColor(deal.platform)}>
                        {getPlatformName(deal.platform)}
                      </Badge>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{deal.rating}</span>
                      </div>
                    </div>
                    <CardTitle className="line-clamp-2 text-lg">
                      <Link href={`/deals/${deal.slug}`} className="hover:text-primary transition-colors">
                        {deal.title}
                      </Link>
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                      {deal.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {deal.salePrice ? (
                            <>
                              <span className="text-lg font-bold text-primary">
                                {formatPrice(deal.salePrice)}
                              </span>
                              <span className="text-sm text-muted-foreground line-through">
                                {formatPrice(deal.price)}
                              </span>
                            </>
                          ) : (
                            <span className="text-lg font-bold text-primary">
                              {formatPrice(deal.price)}
                            </span>
                          )}
                        </div>
                      </div>
                      <Link href={`/deals/${deal.slug}`}>
                        <Button className="w-full">
                          View Deal
                          <ArrowRight className="h-4 w-4 ml-1" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* No Results */}
      {searchQuery.trim() && filteredResults.length === 0 && (
        <div className="text-center py-12">
          <div className="bg-muted/50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <Search className="h-10 w-10 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold mb-4">No results found</h2>
          <p className="text-muted-foreground mb-6">
            Try adjusting your search terms or browse our categories below.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/news">
              <Button variant="outline">Browse News</Button>
            </Link>
            <Link href="/deals">
              <Button variant="outline">Browse Deals</Button>
            </Link>
            <Link href="/">
              <Button>Go Home</Button>
            </Link>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!searchQuery.trim() && (
        <div className="text-center py-12">
          <div className="bg-muted/50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <Search className="h-10 w-10 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold mb-4">Start searching</h2>
          <p className="text-muted-foreground mb-6">
            Search for news, deals, or topics in your area.
          </p>
        </div>
      )}
    </div>
  )
}
