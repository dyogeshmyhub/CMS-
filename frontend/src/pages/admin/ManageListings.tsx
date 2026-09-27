import { useState } from 'react'
import { Eye, Pencil, Search, Trash2 } from 'lucide-react'
import { useAppContext } from '../../context/AppContext'

export default function ManageListings() {
  const { listings } = useAppContext()
  const [query, setQuery] = useState('')

  const filtered = listings.filter((l) => l.title.toLowerCase().includes(query.toLowerCase()))

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">Manage Listings</h1>
          <p className="mt-1 text-sm text-slate-500">{listings.length} total listings</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search listings..."
            className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-4 text-sm outline-none focus:border-brand-400"
          />
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-400">
            <tr>
              <th className="px-5 py-3 font-semibold">Listing</th>
              <th className="px-5 py-3 font-semibold">Category</th>
              <th className="px-5 py-3 font-semibold">Price</th>
              <th className="px-5 py-3 font-semibold">Status</th>
              <th className="px-5 py-3 font-semibold">Views</th>
              <th className="px-5 py-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((l) => (
              <tr key={l.id} className="border-t border-slate-100 hover:bg-slate-50/60">
                <td className="flex items-center gap-3 px-5 py-3">
                  <img src={l.image} alt={l.title} className="h-10 w-10 rounded-lg object-cover" />
                  <span className="max-w-[220px] truncate font-medium text-slate-800">{l.title}</span>
                </td>
                <td className="px-5 py-3 capitalize text-slate-500">{l.category}</td>
                <td className="px-5 py-3 text-slate-500">{l.price === 0 ? '—' : `$${l.price.toLocaleString()}`}</td>
                <td className="px-5 py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                      l.featured ? 'bg-accent-500/10 text-accent-600' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {l.featured ? 'Featured' : 'Standard'}
                  </span>
                </td>
                <td className="px-5 py-3 text-slate-500">{l.views}</td>
                <td className="px-5 py-3">
                  <div className="flex justify-end gap-2">
                    <button className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-brand-600">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-brand-600">
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
