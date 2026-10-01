import { Pencil, Plus, ToggleLeft, ToggleRight, Trash2, X } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { useAppContext } from '../../context/AppContext'
import type { Advertisement, AdvertisementInput } from '../../types'

const emptyAdvertisement: AdvertisementInput = {
  title: '',
  advertiser: '',
  image: '',
  description: '',
  ctaText: 'Learn more',
  ctaLink: '',
  startDate: '',
  endDate: '',
  status: 'ACTIVE',
}

const maximumActiveAdvertisements = 5

export default function ManageAdvertisements() {
  const { advertisements, addAdvertisement, updateAdvertisement, removeAdvertisement } = useAppContext()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [draft, setDraft] = useState<AdvertisementInput>(emptyAdvertisement)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const activeCount = advertisements.filter((item) => item.status === 'ACTIVE').length
  const maximumReached = activeCount >= maximumActiveAdvertisements

  const openCreateForm = () => {
    setNotice('')
    setError(maximumReached ? 'Maximum of 5 active advertisements reached. Manage existing advertisements before adding another.' : '')
    if (maximumReached) return
    setDraft(emptyAdvertisement)
    setEditingId(null)
    setIsModalOpen(true)
  }

  const openEditForm = (advertisement: Advertisement) => {
    setNotice('')
    setError('')
    setEditingId(advertisement.id)
    setDraft({
      title: advertisement.title,
      advertiser: advertisement.advertiser,
      image: advertisement.image,
      description: advertisement.description,
      ctaText: advertisement.ctaText,
      ctaLink: advertisement.ctaLink,
      startDate: advertisement.startDate,
      endDate: advertisement.endDate,
      status: advertisement.status,
    })
    setIsModalOpen(true)
  }

  const closeForm = () => {
    setIsModalOpen(false)
    setEditingId(null)
    setDraft(emptyAdvertisement)
    setError('')
  }

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')

    if (!editingId && draft.status === 'ACTIVE' && maximumReached) {
      setError('Maximum of 5 active advertisements reached. Manage existing advertisements before adding another.')
      return
    }

    try {
      if (editingId) await updateAdvertisement(editingId, draft)
      else await addAdvertisement(draft)
      closeForm()
      setNotice(editingId ? 'Advertisement updated.' : 'Advertisement added.')
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Unable to save advertisement.')
    }
  }

  const handleToggleStatus = async (advertisement: Advertisement) => {
    const nextStatus = advertisement.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
    try {
      await updateAdvertisement(advertisement.id, { ...advertisement, status: nextStatus })
      setNotice(`Advertisement ${nextStatus === 'ACTIVE' ? 'activated' : 'deactivated'}.`)
      setError('')
    } catch (toggleError) {
      setError(toggleError instanceof Error ? toggleError.message : 'Unable to change advertisement status.')
    }
  }

  const handleDelete = async (advertisement: Advertisement) => {
    if (!window.confirm(`Delete “${advertisement.title}”?`)) return
    try {
      await removeAdvertisement(advertisement.id)
      setNotice('Advertisement deleted.')
      setError('')
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Unable to delete advertisement.')
    }
  }

  const updateDraft = (field: keyof AdvertisementInput, value: string) => {
    setDraft((current) => ({ ...current, [field]: value }))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">Manage Advertisements</h1>
          <p className="mt-1 text-sm text-slate-600">{activeCount} of {maximumActiveAdvertisements} active placements</p>
        </div>
        <button
          type="button"
          onClick={openCreateForm}
          disabled={maximumReached}
          className="flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-brand-500/30 hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus className="h-4 w-4" /> Add Advertisement
        </button>
      </div>

      {maximumReached && (
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Maximum of 5 active advertisements reached. Deactivate or delete an existing ad before adding another.
        </p>
      )}
      {notice && <p role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{notice}</p>}
      {error && <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>}

      <div className="space-y-3">
        {advertisements.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
            No advertisements yet. Add one to feature it on the homepage.
          </div>
        ) : advertisements.map((advertisement) => (
          <article key={advertisement.id} className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center">
            {advertisement.image ? (
              <img src={advertisement.image} alt="" className="h-24 w-full rounded-xl object-cover sm:w-36" />
            ) : (
              <div className="flex h-24 w-full items-center justify-center rounded-xl bg-sky-50 text-xs text-slate-500 sm:w-36">No image</div>
            )}
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-semibold text-slate-900">{advertisement.title}</h2>
                <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${advertisement.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                  {advertisement.status === 'ACTIVE' ? 'Active' : 'Inactive'}
                </span>
              </div>
              <p className="mt-1 text-sm text-slate-600">{advertisement.advertiser} · {advertisement.description}</p>
              <p className="mt-1 text-xs text-slate-500">
                {advertisement.startDate || 'No start date'} – {advertisement.endDate || 'No end date'}
              </p>
            </div>
            <div className="flex shrink-0 gap-1">
              <button type="button" onClick={() => void handleToggleStatus(advertisement)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100" aria-label={`${advertisement.status === 'ACTIVE' ? 'Deactivate' : 'Activate'} ${advertisement.title}`}>
                {advertisement.status === 'ACTIVE' ? <ToggleRight className="h-5 w-5" /> : <ToggleLeft className="h-5 w-5" />}
              </button>
              <button type="button" onClick={() => openEditForm(advertisement)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-brand-700" aria-label={`Edit ${advertisement.title}`}>
                <Pencil className="h-4 w-4" />
              </button>
              <button type="button" onClick={() => void handleDelete(advertisement)} className="rounded-lg p-2 text-slate-500 hover:bg-rose-50 hover:text-rose-600" aria-label={`Delete ${advertisement.title}`}>
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </article>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
          <form onSubmit={(event) => void handleSave(event)} className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl sm:p-7">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-600">Homepage placement</p>
                <h2 className="mt-1 font-display text-2xl font-bold text-slate-900">{editingId ? 'Edit Advertisement' : 'Add Advertisement'}</h2>
              </div>
              <button type="button" onClick={closeForm} className="rounded-full p-2 text-slate-400 hover:bg-slate-100" aria-label="Close form">
                <X className="h-4 w-4" />
              </button>
            </div>

            {error && <p role="alert" className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>}

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-medium text-slate-700">Advertisement title
                <input required maxLength={120} value={draft.title} onChange={(event) => updateDraft('title', event.target.value)} className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 font-normal outline-none focus:border-brand-400" />
              </label>
              <label className="text-sm font-medium text-slate-700">Advertiser / company
                <input required maxLength={100} value={draft.advertiser} onChange={(event) => updateDraft('advertiser', event.target.value)} className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 font-normal outline-none focus:border-brand-400" />
              </label>
              <label className="text-sm font-medium text-slate-700 sm:col-span-2">Advertisement image URL
                <input type="url" value={draft.image} onChange={(event) => updateDraft('image', event.target.value)} placeholder="https://example.com/image.jpg" className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 font-normal outline-none focus:border-brand-400" />
              </label>
              <label className="text-sm font-medium text-slate-700 sm:col-span-2">Short description
                <textarea required maxLength={360} rows={3} value={draft.description} onChange={(event) => updateDraft('description', event.target.value)} className="mt-1.5 w-full resize-y rounded-xl border border-slate-200 px-3 py-2.5 font-normal outline-none focus:border-brand-400" />
              </label>
              <label className="text-sm font-medium text-slate-700">CTA text
                <input maxLength={40} value={draft.ctaText} onChange={(event) => updateDraft('ctaText', event.target.value)} placeholder="Learn more" className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 font-normal outline-none focus:border-brand-400" />
              </label>
              <label className="text-sm font-medium text-slate-700">CTA link
                <input type="url" value={draft.ctaLink} onChange={(event) => updateDraft('ctaLink', event.target.value)} placeholder="https://example.com" className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 font-normal outline-none focus:border-brand-400" />
              </label>
              <label className="text-sm font-medium text-slate-700">Start date
                <input type="date" value={draft.startDate} onChange={(event) => updateDraft('startDate', event.target.value)} className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 font-normal outline-none focus:border-brand-400" />
              </label>
              <label className="text-sm font-medium text-slate-700">End date
                <input type="date" value={draft.endDate} min={draft.startDate || undefined} onChange={(event) => updateDraft('endDate', event.target.value)} className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 font-normal outline-none focus:border-brand-400" />
              </label>
              <label className="text-sm font-medium text-slate-700">Status
                <select value={draft.status} onChange={(event) => updateDraft('status', event.target.value)} className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 font-normal outline-none focus:border-brand-400">
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              </label>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={closeForm} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50">Cancel</button>
              <button type="submit" className="rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700">{editingId ? 'Save changes' : 'Save advertisement'}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}