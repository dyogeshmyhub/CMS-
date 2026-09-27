import { Link, useLocation, useParams } from 'react-router-dom'
import { ArrowRight, MapPin, Sparkles } from 'lucide-react'
import ListingCard from '../components/ListingCard'
import { useAppContext } from '../context/AppContext'

const categoryLookup: Record<string, { label: string; description: string; filters: string[] }> = {
  classified: { label: 'Classified', description: 'Jobs, services, products and local community listings.', filters: ['vehicles', 'electronics', 'fashion', 'services', 'jobs'] },
  renting: { label: 'Renting', description: 'Find a place to rent or list a property for rent.', filters: ['property'] },
  housing: { label: 'Housing', description: 'Explore homes, apartments and real-estate opportunities.', filters: ['property'] },
  events: { label: 'Events', description: 'Announcements, gatherings and events for every community.', filters: ['travel', 'services'] },
  gold: { label: 'Gold', description: 'Premium gold, precious metals and trade listings.', filters: ['services'] },
  community: { label: 'Community', description: 'Connect with groups, local networks and support circles.', filters: ['services'] },
  ethnicity: { label: 'Ethnicity', description: 'International culture and community-led connections.', filters: ['services', 'travel'] },
  membership: { label: 'Membership', description: 'Access professional, social and business memberships.', filters: ['services'] },
  funding: { label: 'Funding', description: 'Opportunities, investors and business support conversations.', filters: ['services', 'jobs'] },
}

export default function CategoryPage() {
  const { slug } = useParams()
  const location = useLocation()
  const { listings } = useAppContext()
  const routeKey = (
    slug ?? location.pathname.replace(/^\//, '').split('/')[0] ?? 'classified'
  ).toLowerCase()
  const config = categoryLookup[routeKey] ?? categoryLookup.classified

  const visibleListings = listings.filter((listing) =>
    config.filters.includes(listing.category) || listing.title.toLowerCase().includes(config.label.toLowerCase()),
  )

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 overflow-hidden rounded-[28px] border border-brand-200 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.9),transparent_32%),linear-gradient(135deg,#edf5ff_0%,#ffffff_35%,#fef7e7_100%)] p-6 shadow-[0_20px_60px_rgba(21,77,150,0.08)] sm:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white/60 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-700">
              <Sparkles className="h-3.5 w-3.5" />
              International marketplace
            </div>
            <h1 className="font-display text-3xl font-bold text-slate-900 sm:text-4xl">{config.label}</h1>
            <p className="mt-3 max-w-2xl text-sm text-slate-600 sm:text-base">{config.description}</p>
          </div>

          <Link
            to="/listings"
            className="inline-flex items-center gap-2 self-start rounded-full bg-gradient-to-r from-brand-600 to-brand-800 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-brand-200/70 transition hover:brightness-110"
          >
            Browse all listings <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <section className="mb-10 grid gap-4 md:grid-cols-3">
        {[
          { label: 'Live updates', value: `${visibleListings.length}+` },
          { label: 'Location coverage', value: '120 cities' },
          { label: 'Verified members', value: '6.2K+' },
        ].map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">{stat.label}</p>
            <p className="mt-2 font-display text-2xl font-bold text-slate-900">{stat.value}</p>
          </div>
        ))}
      </section>

      {visibleListings.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <p className="font-display text-xl font-semibold text-slate-900">No listings yet for this category.</p>
          <p className="mt-2 text-sm text-slate-500">This feature is ready for the next backend data connection.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {visibleListings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}

      <div className="mt-12 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-display text-xl font-bold text-slate-900">Local highlights</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {visibleListings.slice(0, 3).map((listing) => (
            <div key={listing.id} className="rounded-2xl border border-brand-100 bg-brand-50/50 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-brand-700">{listing.category}</p>
              <p className="mt-2 font-display text-lg font-bold text-slate-900">{listing.title}</p>
              <p className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                <MapPin className="h-4 w-4 text-brand-600" />
                {listing.location}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
