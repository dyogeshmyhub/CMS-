export type AppRole = 'USER' | 'ADMIN' | 'SUPER_ADMIN'
export type AppStatus = 'ACTIVE' | 'DISABLED'

export interface Category {
  id: string
  name: string
  icon: string
  count: number
}

export interface AppUser {
  id: string
  name: string
  email: string
  phone?: string
  countryCode?: string
  address?: string
  company?: string
  role: AppRole
  joined?: string
  status: AppStatus
  avatar?: string
  createdAt?: string
  updatedAt?: string
}

export interface Listing {
  id: string
  title: string
  description: string
  price: number
  category: string
  subcategory?: string
  location: string
  image: string
  featured: boolean
  condition: 'New' | 'Like New' | 'Used' | 'For Parts'
  postedAt: string
  seller: {
    name: string
    avatar: string
    rating: number
  }
  views: number
}

export interface CmsPage {
  id: string
  title: string
  slug: string
  status: 'Published' | 'Draft'
  author: string
  updatedAt: string
  excerpt: string
}

export type AdvertisementStatus = 'ACTIVE' | 'INACTIVE'

export interface Advertisement {
  id: string
  title: string
  advertiser: string
  image: string
  description: string
  ctaText: string
  ctaLink: string
  startDate: string
  endDate: string
  status: AdvertisementStatus
  createdAt: string
  updatedAt: string
}

export type AdvertisementInput = Omit<Advertisement, 'id' | 'createdAt' | 'updatedAt'>

