import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { categories as initialCategories, cmsPages as initialPages, listings as initialListings, users as initialUsers } from '../data/mockData'
import type { AppUser, Category, CmsPage, Listing } from '../types'

export type AuthRole = 'USER' | 'ADMIN' | 'SUPER_ADMIN'

export interface AuthUser {
  id: string
  name: string
  email: string
  role: AuthRole
  status: 'ACTIVE' | 'DISABLED'
  phone?: string
  createdAt?: string
  updatedAt?: string
}

interface AppContextValue {
  listings: Listing[]
  addListing: (listing: Listing) => void
  categories: Category[]
  addCategory: (category: Category) => void
  updateCategory: (id: string, updates: Partial<Category>) => void
  removeCategory: (id: string) => void
  pages: CmsPage[]
  addPage: (page: CmsPage) => void
  updatePage: (id: string, updates: Partial<CmsPage>) => void
  removePage: (id: string) => void
  users: AppUser[]
  addUser: (user: AppUser) => void
  updateUser: (id: string, updates: Partial<AppUser>) => void
  removeUser: (id: string) => void
  favorites: string[]
  toggleFavorite: (id: string) => void
  isAuthenticated: boolean
  isLoading: boolean
  userName: string
  currentUser: AuthUser | null
  authToken: string | null
  login: (credentials: { email: string; password: string }) => Promise<{ success: boolean; message?: string }>
  register: (payload: { name: string; email: string; password: string; confirmPassword: string; phone?: string }) => Promise<{ success: boolean; message?: string }>
  logout: () => void
  refreshAuth: () => Promise<void>
  normalizeRole: (value?: string) => AuthRole
}

const API_BASE_URL = 'http://localhost:3001'
const CATEGORY_STORAGE_KEY = 'golden-traders-categories'
const PAGES_STORAGE_KEY = 'golden-traders-pages'
const USERS_STORAGE_KEY = 'golden-traders-users'
const AUTH_TOKEN_KEY = 'golden-traders-auth-token'
const AUTH_USER_KEY = 'golden-traders-auth-user'

const AppContext = createContext<AppContextValue | undefined>(undefined)

export function normalizeRole(value?: string): AuthRole {
  const normalized = String(value || '').trim().toUpperCase()
  if (normalized === 'SUPER_ADMIN' || normalized === 'SUPERADMIN') return 'SUPER_ADMIN'
  if (normalized === 'ADMIN' || normalized === 'ADMINISTRATOR') return 'ADMIN'
  return 'USER'
}

export function normalizeRoleLabel(value?: string) {
  const role = normalizeRole(value)
  return role === 'SUPER_ADMIN' ? 'Super Admin' : role === 'ADMIN' ? 'Admin' : 'User'
}

function safeStorageRead<T>(key: string): T | null {
  if (typeof window === 'undefined') return null

  try {
    const saved = window.localStorage.getItem(key)
    return saved ? (JSON.parse(saved) as T) : null
  } catch {
    return null
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [listings, setListings] = useState<Listing[]>(initialListings)
  const [categories, setCategories] = useState<Category[]>(() => {
    if (typeof window === 'undefined') return initialCategories

    const saved = safeStorageRead<Category[]>(CATEGORY_STORAGE_KEY)
    return saved && saved.length > 0 ? saved : initialCategories
  })
  const [pages, setPages] = useState<CmsPage[]>(() => {
    if (typeof window === 'undefined') return initialPages

    const saved = safeStorageRead<CmsPage[]>(PAGES_STORAGE_KEY)
    return saved && saved.length > 0 ? saved : initialPages
  })
  const [users, setUsers] = useState<AppUser[]>(() => {
    if (typeof window === 'undefined') return initialUsers

    const saved = safeStorageRead<AppUser[]>(USERS_STORAGE_KEY)
    return saved && saved.length > 0 ? saved : initialUsers
  })
  const [favorites, setFavorites] = useState<string[]>([])
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null)
  const [authToken, setAuthToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const userName = currentUser?.name || ''
  const isAuthenticated = Boolean(currentUser && authToken)

  useEffect(() => {
    const storedToken = typeof window !== 'undefined' ? window.localStorage.getItem(AUTH_TOKEN_KEY) : null
    const storedUser = safeStorageRead<AuthUser>(AUTH_USER_KEY)

    if (storedToken && storedUser) {
      setAuthToken(storedToken)
      setCurrentUser(storedUser)
    }

    setIsLoading(false)
  }, [])

  useEffect(() => {
    let isMounted = true

    const loadData = async () => {
      try {
        const [categoriesResponse, pagesResponse, usersResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/categories`),
          fetch(`${API_BASE_URL}/pages`),
          authToken ? fetch(`${API_BASE_URL}/api/users`, { headers: { Authorization: `Bearer ${authToken}` } }) : Promise.resolve(null),
        ])

        if (categoriesResponse.ok) {
          const categoriesData = (await categoriesResponse.json()) as Category[]
          if (isMounted && Array.isArray(categoriesData) && categoriesData.length > 0) {
            setCategories(categoriesData)
            if (typeof window !== 'undefined') {
              window.localStorage.setItem(CATEGORY_STORAGE_KEY, JSON.stringify(categoriesData))
            }
          }
        }

        if (pagesResponse.ok) {
          const pagesData = (await pagesResponse.json()) as CmsPage[]
          if (isMounted && Array.isArray(pagesData) && pagesData.length > 0) {
            setPages(pagesData)
            if (typeof window !== 'undefined') {
              window.localStorage.setItem(PAGES_STORAGE_KEY, JSON.stringify(pagesData))
            }
          }
        }

        if (usersResponse && usersResponse.ok) {
          const usersData = (await usersResponse.json()) as AppUser[]
          if (isMounted && Array.isArray(usersData) && usersData.length > 0) {
            setUsers(usersData)
            if (typeof window !== 'undefined') {
              window.localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(usersData))
            }
          }
        }
      } catch {
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(CATEGORY_STORAGE_KEY, JSON.stringify(categories))
          window.localStorage.setItem(PAGES_STORAGE_KEY, JSON.stringify(pages))
          window.localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users))
        }
      }
    }

    loadData()
    return () => {
      isMounted = false
    }
  }, [authToken])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(CATEGORY_STORAGE_KEY, JSON.stringify(categories))
    }
  }, [categories])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(PAGES_STORAGE_KEY, JSON.stringify(pages))
    }
  }, [pages])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users))
    }
  }, [users])

  const persistAuth = (token: string, user: AuthUser) => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(AUTH_TOKEN_KEY, token)
      window.localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user))
    }
    setAuthToken(token)
    setCurrentUser(user)
  }

  const clearAuth = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(AUTH_TOKEN_KEY)
      window.localStorage.removeItem(AUTH_USER_KEY)
    }
    setAuthToken(null)
    setCurrentUser(null)
  }

  const login = async (credentials: { email: string; password: string }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: credentials.email.trim(),
          password: credentials.password,
        }),
      })

      const payload = await response.json()
      if (!response.ok) {
        return { success: false, message: payload.message || 'Unable to log in.' }
      }

      const user = payload.user as AuthUser
      persistAuth(payload.token, user)
      return { success: true, message: payload.message || 'Login successful.' }
    } catch {
      return { success: false, message: 'Unable to reach the authentication service.' }
    }
  }

  const register = async (payload: { name: string; email: string; password: string; confirmPassword: string; phone?: string }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await response.json()
      if (!response.ok) {
        return { success: false, message: data.message || 'Registration failed.' }
      }

      const user = data.user as AuthUser
      persistAuth(data.token, user)
      return { success: true, message: data.message || 'Account created successfully.' }
    } catch {
      return { success: false, message: 'Unable to create your account right now.' }
    }
  }

  const refreshAuth = async () => {
    if (!authToken) {
      clearAuth()
      return
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${authToken}` },
      })

      if (!response.ok) {
        clearAuth()
        return
      }

      const data = (await response.json()) as { user?: AuthUser }
      if (data.user) {
        persistAuth(authToken, data.user)
      }
    } catch {
      clearAuth()
    }
  }

  const logout = async () => {
    try {
      if (authToken) {
        await fetch(`${API_BASE_URL}/api/auth/logout`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${authToken}` },
        })
      }
    } catch {
      // ignore logout API errors; clear local state regardless
    }

    clearAuth()
  }

  const addListing = (listing: Listing) => setListings((prev) => [listing, ...prev])

  const addCategory = async (category: Category) => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        },
        body: JSON.stringify(category),
      })
      if (!response.ok) throw new Error('Failed to create category')
      const savedCategory = (await response.json()) as Category
      setCategories((prev) => [...prev, savedCategory])
      return
    } catch {
      setCategories((prev) => [...prev, category])
    }
  }

  const updateCategory = async (id: string, updates: Partial<Category>) => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        },
        body: JSON.stringify({ ...categories.find((cat) => cat.id === id), ...updates }),
      })
      if (!response.ok) throw new Error('Failed to update category')
      const savedCategory = (await response.json()) as Category
      setCategories((prev) => prev.map((cat) => (cat.id === id ? savedCategory : cat)))
      return
    } catch {
      setCategories((prev) => prev.map((cat) => (cat.id === id ? { ...cat, ...updates } : cat)))
    }
  }

  const removeCategory = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
        method: 'DELETE',
        headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
      })
      if (!response.ok) throw new Error('Failed to delete category')
    } catch {
      // fallback to local state when the server is unavailable
    }
    setCategories((prev) => prev.filter((cat) => cat.id !== id))
  }

  const addPage = async (page: CmsPage) => {
    try {
      const response = await fetch(`${API_BASE_URL}/pages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        },
        body: JSON.stringify(page),
      })
      if (!response.ok) throw new Error('Failed to create page')
      const savedPage = (await response.json()) as CmsPage
      setPages((prev) => [savedPage, ...prev])
      return
    } catch {
      setPages((prev) => [page, ...prev])
    }
  }

  const updatePage = async (id: string, updates: Partial<CmsPage>) => {
    try {
      const response = await fetch(`${API_BASE_URL}/pages/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        },
        body: JSON.stringify({ ...pages.find((page) => page.id === id), ...updates }),
      })
      if (!response.ok) throw new Error('Failed to update page')
      const savedPage = (await response.json()) as CmsPage
      setPages((prev) => prev.map((page) => (page.id === id ? savedPage : page)))
      return
    } catch {
      setPages((prev) => prev.map((page) => (page.id === id ? { ...page, ...updates } : page)))
    }
  }

  const removePage = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/pages/${id}`, {
        method: 'DELETE',
        headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
      })
      if (!response.ok) throw new Error('Failed to delete page')
    } catch {
      // fallback to local state when the server is unavailable
    }
    setPages((prev) => prev.filter((page) => page.id !== id))
  }

  const addUser = async (user: AppUser) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        },
        body: JSON.stringify(user),
      })
      if (!response.ok) throw new Error('Failed to create user')
      const savedUser = (await response.json()) as AppUser
      setUsers((prev) => [savedUser, ...prev])
      return
    } catch {
      setUsers((prev) => [user, ...prev])
    }
  }

  const updateUser = async (id: string, updates: Partial<AppUser>) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        },
        body: JSON.stringify({ ...users.find((user) => user.id === id), ...updates }),
      })
      if (!response.ok) throw new Error('Failed to update user')
      const savedUser = (await response.json()) as AppUser
      setUsers((prev) => prev.map((user) => (user.id === id ? savedUser : user)))
      return
    } catch {
      setUsers((prev) => prev.map((user) => (user.id === id ? { ...user, ...updates } : user)))
    }
  }

  const removeUser = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/${id}`, {
        method: 'DELETE',
        headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
      })
      if (!response.ok) throw new Error('Failed to delete user')
    } catch {
      // fallback to local state when the server is unavailable
    }
    setUsers((prev) => prev.filter((user) => user.id !== id))
  }

  const toggleFavorite = (id: string) =>
    setFavorites((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]))

  const value = useMemo(
    () => ({
      listings,
      addListing,
      categories,
      addCategory,
      updateCategory,
      removeCategory,
      pages,
      addPage,
      updatePage,
      removePage,
      users,
      addUser,
      updateUser,
      removeUser,
      favorites,
      toggleFavorite,
      isAuthenticated,
      isLoading,
      userName,
      currentUser,
      authToken,
      login,
      register,
      logout,
      refreshAuth,
      normalizeRole,
    }),
    [listings, categories, pages, users, favorites, isAuthenticated, isLoading, userName, currentUser, authToken],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useAppContext() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useAppContext must be used within AppProvider')
  return ctx
}
