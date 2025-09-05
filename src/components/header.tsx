"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { Menu, Search, Sun, Moon, MapPin, User, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from '@/components/ui/navigation-menu'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useTheme } from 'next-themes'
import { config, getAreasForLocation } from '@/lib/config'
import { canAccessAdmin, getAdminNavItems, type UserRole } from '@/lib/roles'

type Area = string

export default function Header() {
  const [mounted, setMounted] = useState(false)
  const [selectedArea, setSelectedArea] = useState<Area>(config.defaultLocation.areas[0])
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const { data: session, status } = useSession()

  useEffect(() => {
    setMounted(true)
    const savedArea = localStorage.getItem('selectedArea') as Area
    const availableAreas = getAreasForLocation()
    if (savedArea && availableAreas.includes(savedArea)) {
      setSelectedArea(savedArea)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('selectedArea', selectedArea)
  }, [selectedArea])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`
    }
  }

  // Get user role from session
  const userRole = (session?.user as any)?.role as UserRole || 'user'
  
  // Base navigation items (always visible)
  const baseNavigationItems = [
    { href: '/', label: 'Home' },
    { href: '/news', label: 'News' },
    { href: '/deals', label: 'Deals' },
    { href: '/election', label: 'Election' },
  ]
  
  // Add admin dashboard only if user has admin access
  const navigationItems = canAccessAdmin(userRole) 
    ? [...baseNavigationItems, { href: '/admin/dashboard', label: 'Dashboard' }]
    : baseNavigationItems

  if (!mounted) {
    return (
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-primary flex items-center justify-center shadow-sm">
                <span className="text-white font-bold text-sm">{config.appName.substring(0, 2).toUpperCase()}</span>
              </div>
              <span className="font-bold text-xl">{config.appName}</span>
            </Link>
            
            {/* Placeholder for navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <div className="flex items-center space-x-6">
                <div className="h-4 w-16 bg-muted animate-pulse rounded"></div>
                <div className="h-4 w-16 bg-muted animate-pulse rounded"></div>
                <div className="h-4 w-16 bg-muted animate-pulse rounded"></div>
                <div className="h-4 w-16 bg-muted animate-pulse rounded"></div>
              </div>
            </div>
            
            {/* Placeholder for right side */}
            <div className="flex items-center space-x-4">
              <div className="h-8 w-8 bg-muted animate-pulse rounded"></div>
              <div className="h-8 w-8 bg-muted animate-pulse rounded"></div>
            </div>
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-primary flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-sm">{config.appName.substring(0, 2).toUpperCase()}</span>
            </div>
            <span className="font-bold text-xl">{config.appName}</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <NavigationMenu>
              <NavigationMenuList>
                {navigationItems.map((item) => (
                  <NavigationMenuItem key={item.href}>
                    <Link href={item.href} legacyBehavior passHref>
                      <NavigationMenuLink
                        className={`px-3 py-2 text-sm font-medium transition-colors hover:text-primary ${
                          pathname === item.href ? 'text-primary' : 'text-muted-foreground'
                        }`}
                      >
                        {item.label}
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </nav>

          {/* Right side items */}
          <div className="flex items-center space-x-4">
            {/* Area Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="hidden sm:flex">
                  <MapPin className="h-4 w-4 mr-2" />
                  {selectedArea}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {getAreasForLocation().map((area) => (
                  <DropdownMenuItem
                    key={area}
                    onClick={() => setSelectedArea(area)}
                    className={selectedArea === area ? 'bg-accent' : ''}
                  >
                    {area}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Search */}
            <div className="hidden sm:flex items-center space-x-2">
              <form onSubmit={handleSearch} className="flex items-center space-x-2">
                <Input
                  placeholder="Search news & deals..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64"
                />
                <Button type="submit" size="sm">
                  <Search className="h-4 w-4" />
                </Button>
              </form>
            </div>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            >
              {mounted ? (
                theme === 'light' ? (
                  <Moon className="h-4 w-4" />
                ) : (
                  <Sun className="h-4 w-4" />
                )
              ) : (
                <Sun className="h-4 w-4" />
              )}
            </Button>

            {/* Authentication */}
            <div className="flex items-center space-x-2">
              {status === 'loading' || !mounted ? (
                <div className="h-8 w-20 bg-muted animate-pulse rounded" />
              ) : session ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span className="hidden sm:inline">{session.user?.name || session.user?.email}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {canAccessAdmin(userRole) && (
                      <>
                        <DropdownMenuItem asChild>
                          <Link href="/admin/dashboard">Dashboard</Link>
                        </DropdownMenuItem>
                        {getAdminNavItems(userRole).map((item) => (
                          <DropdownMenuItem key={item.href} asChild>
                            <Link href={item.href}>{item.label}</Link>
                          </DropdownMenuItem>
                        ))}
                        <DropdownMenuItem className="border-t" asChild>
                          <Link href="/admin/profile">Profile Settings</Link>
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuItem onClick={() => signOut()}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link href="/auth/signin">
                  <Button variant="outline" size="sm">
                    <User className="h-4 w-4 mr-2" />
                    Sign In
                  </Button>
                </Link>
              )}
            </div>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="flex flex-col space-y-4 mt-8">
                  {/* Mobile Area Selector */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Select Area</label>
                    <div className="flex flex-wrap gap-2">
                      {getAreasForLocation().map((area) => (
                        <Button
                          key={area}
                          variant={selectedArea === area ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setSelectedArea(area)}
                        >
                          {area}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Mobile Search */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Search</label>
                    <form onSubmit={handleSearch} className="flex space-x-2">
                      <Input
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      <Button type="submit" size="sm">
                        <Search className="h-4 w-4" />
                      </Button>
                    </form>
                  </div>

                  {/* Mobile Navigation */}
                  <nav className="space-y-2">
                    <label className="text-sm font-medium">Navigation</label>
                    <div className="flex flex-col space-y-2">
                      {navigationItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={`px-3 py-2 text-sm font-medium transition-colors rounded-md ${
                            pathname === item.href
                              ? 'bg-primary text-primary-foreground'
                              : 'hover:bg-accent'
                          }`}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
