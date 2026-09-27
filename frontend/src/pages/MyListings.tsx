import { listings as sampleListings } from '../data/mockData'

export default function MyListings() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-10">
      <div>
        <h1 className="font-display text-3xl font-bold text-slate-900">My Listings</h1>
        <p className="mt-1 text-sm text-slate-500">Keep track of the items you have listed and their status.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {sampleListings.slice(0, 6).map((listing) => (
          <div key={listing.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <img src={listing.image} alt={listing.title} className="h-44 w-full object-cover" />
            <div className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-lg font-bold text-slate-900">${listing.price.toLocaleString()}</p>
                  <h2 className="mt-1 text-base font-semibold text-slate-800">{listing.title}</h2>
                </div>
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-600">Active</span>
              </div>
              <p className="mt-2 text-sm text-slate-500">{listing.location}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
