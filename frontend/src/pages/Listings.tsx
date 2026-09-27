import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SlidersHorizontal, X } from 'lucide-react'
import { serviceSubCategories } from '../data/mockData'
import { useAppContext } from '../context/AppContext'
import ListingCard from '../components/ListingCard'
import { iconMap } from '../components/iconMap'

const sortOptions = [
  { id: 'newest', label: 'Newest first' },
  { id: 'price-asc', label: 'Price: Low to High' },
  { id: 'price-desc', label: 'Price: High to Low' },
]

export default function Listings() {
  const { listings, categories } = useAppContext()
  const [params, setParams] = useSearchParams()
  const activeCategory = params.get('category') ?? ''
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState('newest')
  const [maxPrice, setMaxPrice] = useState(500000)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [activeServiceSubcategory, setActiveServiceSubcategory] = useState('')

  useEffect(() => {
    if (activeCategory !== 'services') {
      setActiveServiceSubcategory('')
    }
  }, [activeCategory])

  const filtered = useMemo(() => {
    let result = listings.filter((l) => l.price <= maxPrice)
    if (activeCategory) result = result.filter((l) => l.category === activeCategory)
    if (activeCategory === 'services' && activeServiceSubcategory) {
      result = result.filter((l) => l.subcategory === activeServiceSubcategory)
    }
    if (query.trim()) {
      const q = query.toLowerCase()
      result = result.filter(
        (l) => l.title.toLowerCase().includes(q) || l.description.toLowerCase().includes(q),
      )
    }
    if (sort === 'price-asc') result = [...result].sort((a, b) => a.price - b.price)
    if (sort === 'price-desc') result = [...result].sort((a, b) => b.price - a.price)
    return result
  }, [listings, activeCategory, activeServiceSubcategory, query, sort, maxPrice])

  const setCategory = (id: string) => {
    if (id === activeCategory) {
      params.delete('category')
    } else {
      params.set('category', id)
    }
    setParams(params, { replace: true })
    if (id !== 'services') {
      setActiveServiceSubcategory('')
    }
  }

  const hasServiceSelection = activeCategory === 'services'

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col gap-4">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="h-1.5 w-8 rounded-full bg-gradient-to-r from-brand-500 to-brand-700" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-700">Browse</span>
            </div>
            <h1 className="font-display text-2xl font-bold text-slate-900 sm:text-3xl">
              Browse Listings
            </h1>
            <p className="mt-1 text-sm text-slate-500">{filtered.length} results found</p>
          </div>
          <div className="flex gap-2">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-brand-400"
          >
            {sortOptions.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>
            <button
              onClick={() => setFiltersOpen(true)}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 lg:hidden"
            >
              <SlidersHorizontal className="h-4 w-4" /> Filters
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {['travel', 'vehicles', 'property', 'electronics', 'services'].map((id) => {
            const cat = categories.find((category) => category.id === id)
            if (!cat) return null

            const isSelected = activeCategory === cat.id
            return (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`rounded-full border px-3 py-1.5 text-sm font-medium transition ${
                  isSelected
                    ? 'border-brand-300 bg-brand-100 text-brand-900'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-brand-200 hover:text-brand-800'
                }`}
              >
                {cat.name}
              </button>
            )
          })}
        </div>

        {hasServiceSelection && (
          <div className="flex flex-wrap gap-2">
            {serviceSubCategories.map((sub) => {
              const active = activeServiceSubcategory === sub.id
              return (
                <button
                  key={sub.id}
                  onClick={() => setActiveServiceSubcategory(active ? '' : sub.id)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                    active
                      ? 'border-brand-300 bg-brand-100 text-brand-900'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-brand-200 hover:text-brand-800'
                  }`}
                >
                  {sub.label}
                </button>
              )
            })}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[260px_1fr]">
        {/* Sidebar */}
        <aside className="hidden lg:block">
          <FilterPanel
            query={query}
            setQuery={setQuery}
            activeCategory={activeCategory}
            setCategory={setCategory}
            activeServiceSubcategory={activeServiceSubcategory}
            setActiveServiceSubcategory={setActiveServiceSubcategory}
            maxPrice={maxPrice}
            setMaxPrice={setMaxPrice}
          />
        </aside>

        {filtersOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            <div className="absolute inset-0 bg-black/40" onClick={() => setFiltersOpen(false)} />
            <div className="relative ml-auto h-full w-80 max-w-full overflow-y-auto bg-white p-5 shadow-2xl">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-display text-lg font-bold">Filters</h3>
                <button onClick={() => setFiltersOpen(false)}>
                  <X className="h-5 w-5" />
                </button>
              </div>
              <FilterPanel
                query={query}
                setQuery={setQuery}
                activeCategory={activeCategory}
                setCategory={setCategory}
                activeServiceSubcategory={activeServiceSubcategory}
                setActiveServiceSubcategory={setActiveServiceSubcategory}
                maxPrice={maxPrice}
                setMaxPrice={setMaxPrice}
              />
            </div>
          </div>
        )}

        <div>
          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-16 text-center">
              <p className="font-display text-lg font-semibold text-slate-700">No listings found</p>
              <p className="mt-1 text-sm text-slate-500">Try adjusting your search or filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

interface FilterPanelProps {
  query: string
  setQuery: (v: string) => void
  activeCategory: string
  setCategory: (id: string) => void
  activeServiceSubcategory: string
  setActiveServiceSubcategory: (v: string) => void
  maxPrice: number
  setMaxPrice: (v: number) => void
}

function FilterPanel({
  query,
  setQuery,
  activeCategory,
  setCategory,
  activeServiceSubcategory,
  setActiveServiceSubcategory,
  maxPrice,
  setMaxPrice,
}: FilterPanelProps) {
  const { categories } = useAppContext()
  return (
    <div className="space-y-6 rounded-2xl border border-brand-100 bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_100%)] p-5 shadow-sm">
      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-800">Keyword</label>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search title or description"
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-400"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-800">Category</label>
        <div className="flex flex-col gap-1">
          {categories.map((cat) => {
            const Icon = iconMap[cat.icon]
            const active = activeCategory === cat.id
            return (
              <div key={cat.id}>
                <button
                  onClick={() => setCategory(cat.id)}
                  className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm transition ${
                    active ? 'bg-brand-50 font-semibold text-brand-700' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="h-4 w-4" /> {cat.name}
                  <span className="ml-auto text-xs text-slate-400">{cat.count}</span>
                </button>
                {cat.id === 'services' && activeCategory === 'services' && (
                  <div className="mt-2 flex flex-wrap gap-2 pl-2">
                    {serviceSubCategories.map((sub) => {
                      const isSelected = activeServiceSubcategory === sub.id
                      return (
                        <button
                          key={sub.id}
                          onClick={() => setActiveServiceSubcategory(isSelected ? '' : sub.id)}
                          className={`rounded-full border px-2 py-1 text-[11px] font-medium transition ${
                            isSelected
                              ? 'border-brand-300 bg-brand-100 text-brand-900'
                              : 'border-slate-200 bg-white text-slate-600 hover:border-brand-200 hover:text-brand-800'
                          }`}
                        >
                          {sub.label}
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      <div>
        <label className="mb-2 flex justify-between text-sm font-semibold text-slate-800">
          Max Price <span className="font-normal text-slate-400">${maxPrice.toLocaleString()}</span>
        </label>
        <input
          type="range"
          min={0}
          max={500000}
          step={5000}
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full accent-brand-600"
        />
      </div>
    </div>
  )
}
