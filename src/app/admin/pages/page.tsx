import { Metadata } from 'next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Edit, Eye, FileText, Globe, Users, Shield, Mail } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Pages Management | Admin Dashboard',
  description: 'Manage static pages content',
}

export default function PagesManagementPage() {
  const pages = [
    {
      id: 'about',
      title: 'About Us',
      description: 'Learn about LocalHub and our mission',
      path: '/about',
      icon: Users,
      lastModified: '2024-01-15',
      status: 'Published'
    },
    {
      id: 'contact',
      title: 'Contact Us',
      description: 'Get in touch with our team',
      path: '/contact',
      icon: Mail,
      lastModified: '2024-01-15',
      status: 'Published'
    },
    {
      id: 'privacy',
      title: 'Privacy Policy',
      description: 'How we protect your data',
      path: '/privacy',
      icon: Shield,
      lastModified: '2024-01-15',
      status: 'Published'
    },
    {
      id: 'disclosures',
      title: 'Disclosures',
      description: 'Affiliate and business disclosures',
      path: '/disclosures',
      icon: FileText,
      lastModified: '2024-01-15',
      status: 'Published'
    },
    {
      id: 'election',
      title: 'Election Reports',
      description: 'Election analysis and reports',
      path: '/election',
      icon: Globe,
      lastModified: '2024-01-15',
      status: 'Published'
    }
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Pages Management</h1>
          <p className="text-muted-foreground">Edit content for static pages</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pages</CardTitle>
            <Badge variant="secondary">{pages.length}</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pages.length}</div>
            <p className="text-xs text-muted-foreground">Static pages</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published</CardTitle>
            <Badge variant="secondary">{pages.filter(p => p.status === 'Published').length}</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pages.filter(p => p.status === 'Published').length}</div>
            <p className="text-xs text-muted-foreground">Live pages</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Updated</CardTitle>
            <Badge variant="secondary">Today</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">Pages updated</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">SEO Score</CardTitle>
            <Badge variant="secondary">95%</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">95%</div>
            <p className="text-xs text-muted-foreground">Optimization</p>
          </CardContent>
        </Card>
      </div>

      {/* Pages List */}
      <Card>
        <CardHeader>
          <CardTitle>All Pages</CardTitle>
          <CardDescription>
            Manage your static pages content. Click edit to modify page content.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pages.map((page) => {
              const IconComponent = page.icon
              return (
                <div key={page.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                  {/* Page Icon */}
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <IconComponent className="h-6 w-6 text-primary" />
                  </div>

                  {/* Page Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium">{page.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {page.description}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline">{page.path}</Badge>
                      <Badge variant="secondary">{page.status}</Badge>
                      <span className="text-xs text-muted-foreground">
                        Updated {page.lastModified}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Link href={page.path} target="_blank">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href={`/admin/pages/${page.id}/edit`}>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">SEO Settings</CardTitle>
            <CardDescription>Configure SEO for all pages</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" disabled>
              <Globe className="h-4 w-4 mr-2" />
              SEO Settings
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Page Templates</CardTitle>
            <CardDescription>Manage page templates and layouts</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" disabled>
              <FileText className="h-4 w-4 mr-2" />
              Templates
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Bulk Operations</CardTitle>
            <CardDescription>Update multiple pages at once</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" disabled>
              <Edit className="h-4 w-4 mr-2" />
              Bulk Edit
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
