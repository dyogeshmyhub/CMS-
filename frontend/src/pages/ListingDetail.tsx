import { Link, useParams } from 'react-router-dom'
import { Flag, Heart, MapPin, MessageCircle, Phone, Share2, Shield, Star } from 'lucide-react'
import { useAppContext } from '../context/AppContext'
import ListingCard from '../components/ListingCard'

function formatPrice(price: number) {
  if (price === 0) return 'Contact for price'
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(
    price,
  )
}

export default function ListingDetail() {
  const { id } = useParams()
  const { listings, favorites, toggleFavorite } = useAppContext()
  const listing = listings.find((l) => l.id === id)

  if (!listing) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="font-display text-2xl font-bold text-slate-900">Listing not found</h1>
        <Link to="/listings" className="mt-4 inline-block text-brand-600 hover:underline">
          Back to listings
        </Link>
      </div>
    )
  }

  const isFav = favorites.includes(listing.id)
  const related = listings.filter((l) => l.category === listing.category && l.id !== listing.id).slice(0, 3)

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <nav className="mb-6 text-sm text-slate-400">
        <Link to="/" className="hover:text-brand-600">Home</Link> /{' '}
        <Link to="/listings" className="hover:text-brand-600">Listings</Link> /{' '}
        <span className="text-slate-600">{listing.title}</span>
      </nav>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.6fr_1fr]">
        <div>
          <div className="mb-4 flex items-center gap-2">
            <span className="h-1.5 w-8 rounded-full bg-gradient-to-r from-brand-500 to-brand-700" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-700">Listing</span>
          </div>
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <img src={listing.image} alt={listing.title} className="aspect-video w-full object-cover" />
          </div>

          <div className="mt-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
                  {listing.condition}
                </span>
                <h1 className="mt-3 font-display text-2xl font-bold text-slate-900 sm:text-3xl">
                  {listing.title}
                </h1>
                <p className="mt-2 flex items-center gap-1 text-sm text-slate-500">
                  <MapPin className="h-4 w-4" /> {listing.location} · Posted {listing.postedAt} ·{' '}
                  {listing.views} views
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => toggleFavorite(listing.id)}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:text-rose-500"
                >
                  <Heart className={`h-4.5 w-4.5 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
                </button>
                <button className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:text-brand-600">
                  <Share2 className="h-4.5 w-4.5" />
                </button>
                <button className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:text-brand-600">
                  <Flag className="h-4.5 w-4.5" />
                </button>
              </div>
            </div>

            <p className="mt-4 font-display text-3xl font-extrabold text-brand-600">
              {formatPrice(listing.price)}
            </p>

            <div className="mt-8 border-t border-slate-200 pt-6">
              <h2 className="font-display text-lg font-bold text-slate-900">Description</h2>
              <p className="mt-3 leading-relaxed text-slate-600">{listing.description}</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-brand-100 bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_100%)] p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <img src={listing.seller.avatar} alt={listing.seller.name} className="h-12 w-12 rounded-full" />
              <div>
                <p className="font-display font-semibold text-slate-900">{listing.seller.name}</p>
                <p className="flex items-center gap-1 text-xs text-brand-600">
                  <Star className="h-3.5 w-3.5 fill-brand-500 text-brand-500" /> {listing.seller.rating}{' '}
                  rating
                </p>
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-3">
              <button className="flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-700">
                <Phone className="h-4 w-4" /> Show Phone Number
              </button>
              <button className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-brand-300">
                <MessageCircle className="h-4 w-4" /> Chat with Seller
              </button>
            </div>

            <div className="mt-5 flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-xs text-emerald-700">
              <Shield className="h-4 w-4 shrink-0" /> Never share OTPs or make advance payments outside the
              platform.
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <h3 className="font-display text-sm font-bold text-slate-900">Safety Tips</h3>
            <ul className="mt-3 space-y-2 text-xs text-slate-500">
              <li>• Meet in a safe, public location</li>
              <li>• Inspect the item before paying</li>
              <li>• Avoid wire transfers to strangers</li>
            </ul>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-16">
          <h2 className="font-display text-xl font-bold text-slate-900">Similar Listings</h2>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((l) => (
              <ListingCard key={l.id} listing={l} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
