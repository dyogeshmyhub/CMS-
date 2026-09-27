import { useMemo, useState } from 'react'
import { Search, SlidersHorizontal } from 'lucide-react'
import { useAppContext } from '../context/AppContext'

const categoryOptions = ['All', 'Classified', 'Renting', 'Housing', 'Events', 'Gold', 'Community', 'Ethnicity', 'Membership', 'Funding']
const locationOptions = ['All', 'Dubai', 'Toronto', 'Lahore', 'Remote', 'Global']

export default function SearchAndBrowse() {
  const { listings } = useAppContext()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [location, setLocation] = useState('All')
  const [sort, setSort] = useState('latest')

  const filteredResults = useMemo(() => {
    const lowerQuery = query.trim().toLowerCase()

    let result = [...listings].filter((listing) => {
      const matchesQuery = !lowerQuery || listing.title.toLowerCase().includes(lowerQuery) || listing.description.toLowerCase().includes(lowerQuery)
      const matchesCategory = category === 'All' || listing.category.toLowerCase() === category.toLowerCase()
      const matchesLocation = location === 'All' || listing.location.toLowerCase().includes(location.toLowerCase())
      return matchesQuery && matchesCategory && matchesLocation
    })

    if (sort === 'latest') {
      result = result.sort((a, b) => b.views - a.views)
    }

    if (sort === 'price-low') {
      result = result.sort((a, b) => a.price - b.price)
    }

    if (sort === 'price-high') {
      result = result.sort((a, b) => b.price - a.price)
    }

    return result
  }, [category, listings, location, query, sort])

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="rounded-[30px] border border-brand-100 bg-white p-5 shadow-[0_18px_50px_rgba(21,77,150,0.07)] sm:p-7">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="h-1.5 w-8 rounded-full bg-gradient-to-r from-brand-500 to-brand-700" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-700">Browse</span>
            </div>
            <h2 className="font-display text-2xl font-bold text-slate-900 sm:text-3xl">Browse For Anything</h2>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
            <SlidersHorizontal className="h-4 w-4 text-brand-700" />
            {filteredResults.length} results
          </div>
        </div>

        <div className="grid gap-3 lg:grid-cols-[minmax(0,2fr)_180px_180px_160px]">
          <label className="relative flex items-center">
            <Search className="pointer-events-none absolute left-3 h-4 w-4 text-brand-700" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              aria-label="Search marketplace"
              placeholder="Search anything..."
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-3 text-sm text-slate-700 outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
            />
          </label>

          <select value={category} onChange={(event) => setCategory(event.target.value)} className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-700 outline-none transition focus:border-brand-400">
            {categoryOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>

          <select value={location} onChange={(event) => setLocation(event.target.value)} className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-700 outline-none transition focus:border-brand-400">
            {locationOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>

          <select value={sort} onChange={(event) => setSort(event.target.value)} className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-700 outline-none transition focus:border-brand-400">
            <option value="latest">Latest</option>
            <option value="price-low">Price Low</option>
            <option value="price-high">Price High</option>
          </select>
        </div>

        {filteredResults.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-sm text-slate-500">
            No listings matched your search. Try broadening your keyword, category or location.
          </div>
        ) : (
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredResults.slice(0, 6).map((listing) => (
              <div key={listing.id} className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
                <div className="mb-3 flex items-center justify-between gap-2">
                  <span className="rounded-full bg-brand-100 px-2 py-1 text-[9px] font-bold uppercase tracking-[0.18em] text-brand-800">{listing.category}</span>
                  <span className="text-[11px] text-slate-500">{listing.location}</span>
                </div>
                <h3 className="font-display text-lg font-bold text-slate-900">{listing.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{listing.description}</p>
                <div className="mt-4 flex items-center justify-between gap-3">
                  <p className="font-display text-lg font-bold text-brand-800">{listing.price === 0 ? 'Contact' : `$${listing.price.toLocaleString()}`}</p>
                  <button type="button" className="rounded-full bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white">View</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
