import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle2, ImagePlus, UploadCloud } from 'lucide-react'
import { useAppContext } from '../context/AppContext'
import type { Listing } from '../types'

export default function PostAd() {
  const { addListing, categories } = useAppContext()
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState(categories[0].id)
  const [location, setLocation] = useState('')
  const [condition, setCondition] = useState<Listing['condition']>('Used')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const newListing: Listing = {
      id: `l-${Date.now()}`,
      title: title || 'Untitled listing',
      description: description || 'No description provided.',
      price: Number(price) || 0,
      category,
      location: location || 'Unknown',
      image: `https://picsum.photos/seed/${Date.now()}/800/600`,
      featured: false,
      condition,
      postedAt: 'Just now',
      seller: { name: 'You', avatar: 'https://i.pravatar.cc/100?img=68', rating: 5 },
      views: 0,
    }
    addListing(newListing)
    setSubmitted(true)
    setTimeout(() => navigate(`/listings/${newListing.id}`), 1200)
  }

  if (submitted) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-32 text-center">
        <CheckCircle2 className="h-16 w-16 text-emerald-500" />
        <h1 className="mt-4 font-display text-2xl font-bold text-slate-900">Ad Posted Successfully!</h1>
        <p className="mt-2 text-sm text-slate-500">Redirecting you to your new listing...</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 text-center">
        <div className="mb-3 flex items-center justify-center gap-2">
          <span className="h-1.5 w-8 rounded-full bg-gradient-to-r from-brand-500 to-brand-700" />
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-700">Post Ad</span>
        </div>
        <h1 className="font-display text-3xl font-bold text-slate-900">Post a New Ad</h1>
        <p className="mt-2 text-sm text-slate-500">
          Fill in the details below — it only takes a minute.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-brand-100 bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_100%)] p-6 sm:p-8 shadow-sm">
        <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-10 text-center transition hover:border-brand-400 hover:bg-brand-50/40">
          <UploadCloud className="h-8 w-8 text-slate-400" />
          <span className="text-sm font-medium text-slate-600">Click to upload photos</span>
          <span className="text-xs text-slate-400">PNG, JPG up to 10MB (demo only)</span>
          <input type="file" className="hidden" />
        </label>

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-slate-800">Title</label>
          <input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. iPhone 15 Pro Max — 256GB"
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-800">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-brand-400"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-800">Condition</label>
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value as Listing['condition'])}
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-brand-400"
            >
              {(['New', 'Like New', 'Used', 'For Parts'] as const).map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-800">Price (USD)</label>
            <input
              type="number"
              min={0}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0"
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-brand-400"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-800">Location</label>
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="City, State"
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-brand-400"
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-slate-800">Description</label>
          <textarea
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your item, its condition, and any details buyers should know."
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-brand-400"
          />
        </div>

        <button
          type="submit"
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-brand-500/30 transition hover:bg-brand-700"
        >
          <ImagePlus className="h-4 w-4" /> Publish Listing
        </button>
      </form>
    </div>
  )
}
