"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Eye, User, Calendar, FileText, Tag } from 'lucide-react'
import Link from 'next/link'
import ElectionActions from '@/components/election-actions'

interface Article {
  id: string
  title: string
  excerpt: string
  category: string
  area: string
  author: string
  publishedAt: string
  readTime: string
  views: number
  status: string
  hasPDF: boolean
  hasData: boolean
  tags: string[]
}

interface Category {
  name: string
  count: number
  slug: string
}

interface ElectionFilterProps {
  articles: Article[]
  categories: Category[]
}

export default function ElectionFilter({ articles, categories }: ElectionFilterProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')

  // Filter articles based on selected category and search term
  const filteredArticles = articles.filter(article => {
    const matchesCategory = selectedCategory === 'all' || 
      article.category.toLowerCase() === selectedCategory.toLowerCase()
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.author.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesCategory && matchesSearch
  })

  return (
    <div className="space-y-6">
      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={selectedCategory === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory('all')}
          >
            All ({articles.length})
          </Button>
          {categories.map((category) => (
            <Button
              key={category.slug}
              variant={selectedCategory === category.slug ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category.slug)}
            >
              {category.name} ({category.count})
            </Button>
          ))}
        </div>
      </div>

      {/* Articles List */}
      <div className="space-y-4">
        {filteredArticles.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No articles found matching your criteria.</p>
          </div>
        ) : (
          filteredArticles.map((article) => (
            <Card key={article.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant={article.status === 'published' ? 'default' : 'secondary'}>
                        {article.status}
                      </Badge>
                      <Badge variant="outline">{article.category}</Badge>
                      <Badge variant="secondary">{article.area}</Badge>
                    </div>
                    
                    <h3 className="text-xl font-semibold mb-2">{article.title}</h3>
                    <p className="text-muted-foreground mb-4">{article.excerpt}</p>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        <span>{article.author}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        <span>{article.views} views</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FileText className="h-4 w-4" />
                        <span>{article.readTime}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-4">
                      {article.hasPDF && (
                        <Badge variant="outline" className="text-xs">
                          <FileText className="h-3 w-3 mr-1" />
                          PDF
                        </Badge>
                      )}
                      {article.hasData && (
                        <Badge variant="outline" className="text-xs">
                          <Tag className="h-3 w-3 mr-1" />
                          Data
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap gap-1">
                      {article.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          <Tag className="h-3 w-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <ElectionActions
                    articleId={article.id}
                    articleTitle={article.title}
                    canEdit={true}
                    canDelete={true}
                  />
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
