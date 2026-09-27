import { Link, NavLink, Outlet } from 'react-router-dom'
import { FileText, LayoutDashboard, List, LogOut, Settings, ShieldCheck, Users } from 'lucide-react'

const navItems = [
  { to: '/super-admin', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/super-admin/admins', label: 'Admin Management', icon: ShieldCheck },
  { to: '/super-admin/users', label: 'Users', icon: Users },
  { to: '/super-admin/listings', label: 'Listings', icon: List },
  { to: '/super-admin/categories', label: 'Categories', icon: FileText },
  { to: '/super-admin/settings', label: 'Settings', icon: Settings },
]

export default function SuperAdminLayout() {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="hidden w-72 flex-col border-r border-slate-200 bg-white px-4 py-6 lg:flex">
        <Link to="/" className="mb-8 flex items-center gap-2 px-2 font-display text-lg font-extrabold">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-accent-500 text-sm text-white">
            G
          </span>
          <span className="text-gradient">Golden Traders</span>
        </Link>

        <nav className="flex flex-1 flex-col gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`
              }
            >
              <item.icon className="h-4.5 w-4.5" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <Link to="/" className="mt-4 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-900">
          <LogOut className="h-4.5 w-4.5" /> Back to site
        </Link>
      </aside>

      <div className="flex-1">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white/80 px-4 py-3 backdrop-blur lg:hidden">
          <Link to="/" className="font-display text-lg font-extrabold text-gradient">Golden Traders</Link>
          <Link to="/" className="text-sm font-medium text-slate-500">Exit</Link>
        </div>
        <div className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
