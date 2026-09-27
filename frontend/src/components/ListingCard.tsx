import { Link } from 'react-router-dom'
import { Heart, MapPin, Star } from 'lucide-react'
import type { Listing } from '../types'
import { useAppContext } from '../context/AppContext'

function formatPrice(price: number) {
  if (price === 0) return 'Contact for price'
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(
    price,
  )
}

export default function ListingCard({ listing }: { listing: Listing }) {
  const { favorites, toggleFavorite } = useAppContext()
  const isFav = favorites.includes(listing.id)

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-red-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-red-200 hover:shadow-[0_25px_60px_rgba(239,68,68,0.15)]">
      <Link to={`/listings/${listing.id}`} className="relative block aspect-[4/3] overflow-hidden bg-slate-100">
        <img
          src={listing.image}
          alt={listing.title}
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        {listing.featured && (
          <span className="absolute left-3 top-3 rounded-full bg-gradient-to-r from-red-500 to-blue-600 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white shadow">
            Featured
          </span>
        )}
      </Link>

      <button
        onClick={() => toggleFavorite(listing.id)}
        aria-label="Toggle favorite"
        className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-slate-500 shadow backdrop-blur transition hover:text-rose-500"
      >
        <Heart className={`h-4.5 w-4.5 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
      </button>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5 text-red-600" /> {listing.location}
          </span>
          <span>{listing.postedAt}</span>
        </div>

        <Link to={`/listings/${listing.id}`}>
          <h3 className="line-clamp-2 font-display text-base font-semibold text-slate-900 transition group-hover:text-red-700">
            {listing.title}
          </h3>
        </Link>

        <p className="font-display text-lg font-bold text-red-700">{formatPrice(listing.price)}</p>

        <div className="mt-auto flex items-center justify-between border-t border-red-100 pt-3">
          <div className="flex items-center gap-2">
            <img src={listing.seller.avatar} alt={listing.seller.name} className="h-6 w-6 rounded-full ring-2 ring-red-100" />
            <span className="text-xs font-medium text-slate-600">{listing.seller.name}</span>
          </div>
          <span className="flex items-center gap-1 text-xs font-medium text-blue-600">
            <Star className="h-3.5 w-3.5 fill-blue-500 text-blue-500" /> {listing.seller.rating}
          </span>
        </div>
      </div>
    </div>
  )
}
