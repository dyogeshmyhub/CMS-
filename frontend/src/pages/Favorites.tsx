import { Link } from 'react-router-dom'
import { HeartCrack } from 'lucide-react'
import { useAppContext } from '../context/AppContext'
import ListingCard from '../components/ListingCard'

export default function Favorites() {
  const { listings, favorites } = useAppContext()
  const favListings = listings.filter((l) => favorites.includes(l.id))

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-bold text-slate-900">Saved Listings</h1>
      <p className="mt-1 text-sm text-slate-500">{favListings.length} items saved</p>

      {favListings.length === 0 ? (
        <div className="mt-10 flex flex-col items-center rounded-2xl border border-dashed border-slate-300 bg-white py-20 text-center">
          <HeartCrack className="h-12 w-12 text-slate-300" />
          <p className="mt-4 font-display text-lg font-semibold text-slate-700">No saved listings yet</p>
          <p className="mt-1 text-sm text-slate-500">Tap the heart icon on any listing to save it here.</p>
          <Link
            to="/listings"
            className="mt-6 rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
          >
            Browse Listings
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {favListings.map((l) => (
            <ListingCard key={l.id} listing={l} />
          ))}
        </div>
      )}
    </div>
  )
}
