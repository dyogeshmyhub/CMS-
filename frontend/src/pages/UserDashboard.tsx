import { ArrowRight, BriefcaseBusiness, FileText, LayoutDashboard, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import { listings as sampleListings } from '../data/mockData'

export default function UserDashboard() {
  const { currentUser } = useAppContext()

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-10">
      <div className="rounded-3xl bg-gradient-to-r from-brand-600 via-brand-500 to-sky-500 p-8 text-white shadow-lg shadow-brand-100">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-brand-100">Welcome back</p>
            <h1 className="mt-2 font-display text-3xl font-bold">{currentUser?.name || 'Member'}</h1>
            <p className="mt-2 max-w-xl text-sm text-brand-50">
              Manage your listings, track activity, and keep your marketplace profile fresh.
            </p>
          </div>
          <Link
            to="/post-ad"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-brand-700 transition hover:bg-brand-50"
          >
            Create Listing <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {[
          { label: 'Active Listings', value: '12', icon: LayoutDashboard },
          { label: 'Pending Listings', value: '3', icon: FileText },
          { label: 'Favorites', value: '8', icon: Sparkles },
        ].map((card) => (
          <div key={card.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
                <card.icon className="h-5 w-5" />
              </span>
            </div>
            <p className="mt-4 text-3xl font-display font-extrabold text-slate-900">{card.value}</p>
            <p className="mt-1 text-sm text-slate-500">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-display text-xl font-bold text-slate-900">My Listings</h2>
            <Link to="/user/my-listings" className="text-sm font-semibold text-brand-600 hover:underline">
              View all
            </Link>
          </div>
          <div className="space-y-4">
            {sampleListings.slice(0, 4).map((listing) => (
              <div key={listing.id} className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-3">
                <img src={listing.image} alt={listing.title} className="h-16 w-16 rounded-xl object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-800">{listing.title}</p>
                  <p className="mt-1 text-xs text-slate-500">{listing.location}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-900">${listing.price.toLocaleString()}</p>
                  <p className="text-[11px] text-emerald-600">Active</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-display text-xl font-bold text-slate-900">Profile</h2>
          <div className="mt-4 space-y-4 text-sm text-slate-600">
            <div className="rounded-xl bg-slate-50 p-3">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Email</p>
              <p className="mt-1 font-medium text-slate-800">{currentUser?.email || 'noreply@example.com'}</p>
            </div>
            <div className="rounded-xl bg-slate-50 p-3">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Account Type</p>
              <p className="mt-1 font-medium text-slate-800">User</p>
            </div>
            <div className="rounded-xl bg-slate-50 p-3">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Status</p>
              <p className="mt-1 font-medium text-emerald-600">Active</p>
            </div>
          </div>
          <Link to="/user/profile" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-600 hover:underline">
            Edit profile <BriefcaseBusiness className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
