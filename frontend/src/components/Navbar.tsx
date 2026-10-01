import { Link, NavLink } from 'react-router-dom'
import { Heart, Menu, PlusCircle, Search, User, X } from 'lucide-react'
import { useState } from 'react'
import { useAppContext } from '../context/AppContext'

const publicNavLinks = [
  { to: '/', label: 'Home' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { isAuthenticated, userName, logout, favorites, currentUser, normalizeRole } = useAppContext()
  const role = currentUser ? normalizeRole(currentUser.role) : 'USER'

  const roleNavLinks = {
    USER: [
      { to: '/user/dashboard', label: 'Dashboard' },
      { to: '/user/my-listings', label: 'My Listings' },
      { to: '/user/profile', label: 'Profile' },
    ],
    ADMIN: [
      { to: '/admin', label: 'Dashboard' },
      { to: '/admin/users', label: 'Users' },
      { to: '/admin/listings', label: 'Listings' },
      { to: '/admin/categories', label: 'Categories' },
      { to: '/admin/reports', label: 'Reports' },
    ],
    SUPER_ADMIN: [
      { to: '/super-admin', label: 'Dashboard' },
      { to: '/super-admin/admins', label: 'Admins' },
      { to: '/super-admin/users', label: 'Users' },
      { to: '/super-admin/listings', label: 'Listings' },
      { to: '/super-admin/settings', label: 'Settings' },
      { to: '/super-admin/reports', label: 'Reports' },
    ],
  }

  const navigationLinks = isAuthenticated ? roleNavLinks[role] || [] : publicNavLinks

  return (
    <header className="sticky top-0 z-50 border-b border-sky-100/80 bg-[#C4E3FF] backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 font-display text-xl font-extrabold tracking-tight">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 via-blue-600 to-blue-800 text-white shadow-lg shadow-sky-200/70">
            G
          </span>
          <span className="text-[#0B2A5B]">Golden Traders</span>
        </Link>

        <div className="hidden flex-1 items-center justify-center gap-6 md:flex">
          <nav className="flex items-center gap-1">
            {(isAuthenticated ? navigationLinks : publicNavLinks).map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `rounded-full px-4 py-2 text-sm font-medium transition ${
                    isActive
                      ? 'bg-sky-100 text-sky-900 shadow-sm'
                      : 'text-slate-600 hover:bg-sky-50 hover:text-sky-800'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="w-full max-w-sm">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-sky-600" />
              <input
                type="search"
                placeholder="Search listings..."
                className="w-full rounded-full border border-sky-200 bg-sky-50/60 py-2 pl-9 pr-4 text-sm shadow-sm outline-none transition placeholder:text-sky-800/70 focus:border-sky-400 focus:ring-2 focus:ring-sky-200"
              />
            </div>
          </div>
        </div>

        <div className="hidden items-center gap-2 md:flex">
          {!isAuthenticated && (
            <Link
              to="/favorites"
              className="relative rounded-full p-2 text-slate-500 hover:bg-sky-50 hover:text-sky-700"
            >
              <Heart className="h-5 w-5" />
              {favorites.length > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent-500 text-[10px] font-bold text-white">
                  {favorites.length}
                </span>
              )}
            </Link>
          )}

          {!isAuthenticated && (
            <Link
              to="/post-ad"
              className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-sky-500 via-cyan-500 to-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-sky-200/70 transition hover:brightness-105"
            >
              <PlusCircle className="h-4 w-4" /> Post Ad
            </Link>
          )}

          {isAuthenticated ? (
            <>
              {role === 'USER' && (
                <Link
                  to="/post-ad"
                  className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-sky-500 via-cyan-500 to-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-sky-200/70 transition hover:brightness-105"
                >
                  <PlusCircle className="h-4 w-4" /> Post Ad
                </Link>
              )}
              <button
                onClick={() => logout()}
                className="flex items-center gap-1.5 rounded-full bg-sky-50 px-3.5 py-2 text-sm font-medium text-sky-900 hover:bg-sky-100"
              >
                <User className="h-4 w-4" /> {userName ? userName.split(' ')[0] : 'Account'}
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-1.5 rounded-full bg-sky-50 px-3.5 py-2 text-sm font-medium text-sky-900 hover:bg-sky-100"
            >
              <User className="h-4 w-4" /> Sign In
            </Link>
          )}
        </div>

        <button className="md:hidden" onClick={() => setOpen((v) => !v)} aria-label="Toggle menu">
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-sky-100 bg-[#C4E3FF] px-4 py-4 md:hidden">
          <div className="flex flex-col gap-2">
            {(isAuthenticated ? navigationLinks : publicNavLinks).map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2 text-sm font-medium transition ${
                    isActive
                      ? 'bg-sky-100 text-sky-900'
                      : 'text-slate-700 hover:bg-sky-50 hover:text-sky-900'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            {!isAuthenticated && (
              <Link
                to="/post-ad"
                onClick={() => setOpen(false)}
                className="rounded-lg bg-gradient-to-r from-sky-500 to-blue-600 px-3 py-2 text-center text-sm font-semibold text-white"
              >
                Post Ad
              </Link>
            )}
            {!isAuthenticated && (
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="rounded-lg bg-sky-50 px-3 py-2 text-center text-sm font-medium text-sky-900"
              >
                Sign In
              </Link>
            )}
            {isAuthenticated && (
              <button
                onClick={() => {
                  logout()
                  setOpen(false)
                }}
                className="rounded-lg bg-sky-50 px-3 py-2 text-sm font-medium text-sky-900"
              >
                Sign out ({userName.split(' ')[0] || 'Account'})
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
