import { ExternalLink, Pencil, Plus, Trash2, X } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAppContext } from '../../context/AppContext'
import type { CmsPage } from '../../types'

const defaultDraft = {
  title: '',
  slug: '',
  author: '',
  status: 'Draft' as CmsPage['status'],
  excerpt: '',
}

export default function ManagePages() {
  const { pages, addPage, updatePage, removePage } = useAppContext()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [draft, setDraft] = useState(defaultDraft)

  const resetForm = () => {
    setDraft(defaultDraft)
    setEditingId(null)
  }

  const openCreateModal = () => {
    resetForm()
    setIsModalOpen(true)
  }

  const openEditModal = (page: CmsPage) => {
    setEditingId(page.id)
    setDraft({
      title: page.title,
      slug: page.slug,
      author: page.author,
      status: page.status,
      excerpt: page.excerpt,
    })
    setIsModalOpen(true)
  }

  const handleSavePage = () => {
    const title = draft.title.trim()
    if (!title) return

    const slug = (draft.slug || title).trim().toLowerCase().replace(/[^a-z0-9]+/g, '-')
    const payload = {
      title,
      slug: slug.replace(/^-+|-+$/g, '') || 'new-page',
      status: draft.status,
      author: draft.author.trim() || 'Admin',
      updatedAt: new Date().toISOString().slice(0, 10),
      excerpt: draft.excerpt.trim() || 'New CMS page created from the admin panel.',
    }

    if (editingId) {
      updatePage(editingId, payload)
    } else {
      addPage({
        id: `p-${Date.now()}`,
        ...payload,
      })
    }

    setIsModalOpen(false)
    resetForm()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">CMS Pages</h1>
          <p className="mt-1 text-sm text-slate-500">Manage static content, guides & policies</p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-brand-500/30 hover:bg-brand-700"
        >
          <Plus className="h-4 w-4" /> New Page
        </button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-400">
            <tr>
              <th className="px-5 py-3 font-semibold">Title</th>
              <th className="px-5 py-3 font-semibold">Author</th>
              <th className="px-5 py-3 font-semibold">Status</th>
              <th className="px-5 py-3 font-semibold">Updated</th>
              <th className="px-5 py-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pages.map((page) => (
              <tr key={page.id} className="border-t border-slate-100 hover:bg-slate-50/60">
                <td className="max-w-[260px] truncate px-5 py-3 font-medium text-slate-800">{page.title}</td>
                <td className="px-5 py-3 text-slate-500">{page.author}</td>
                <td className="px-5 py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                      page.status === 'Published'
                        ? 'bg-emerald-50 text-emerald-600'
                        : 'bg-brand-50 text-brand-600'
                    }`}
                  >
                    {page.status}
                  </span>
                </td>
                <td className="px-5 py-3 text-slate-500">{page.updatedAt}</td>
                <td className="px-5 py-3">
                  <div className="flex justify-end gap-2">
                    <Link
                      to={`/pages/${page.slug}`}
                      className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-brand-600"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => openEditModal(page)}
                      className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-brand-600"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => removePage(page.id)}
                      className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-600">
                  {editingId ? 'Update page' : 'Create page'}
                </p>
                <h2 className="mt-1 font-display text-2xl font-bold text-slate-900">
                  {editingId ? 'Edit Page' : 'New Page'}
                </h2>
              </div>
              <button
                onClick={() => {
                  setIsModalOpen(false)
                  resetForm()
                }}
                className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Page title</label>
                <input
                  value={draft.title}
                  onChange={(e) => setDraft((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g. Shipping & Returns"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-brand-400 focus:bg-white focus:ring-2 focus:ring-brand-100"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Slug</label>
                  <input
                    value={draft.slug}
                    onChange={(e) => setDraft((prev) => ({ ...prev, slug: e.target.value }))}
                    placeholder="shipping-and-returns"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-brand-400 focus:bg-white focus:ring-2 focus:ring-brand-100"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Status</label>
                  <select
                    value={draft.status}
                    onChange={(e) => setDraft((prev) => ({ ...prev, status: e.target.value as CmsPage['status'] }))}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-brand-400 focus:bg-white focus:ring-2 focus:ring-brand-100"
                  >
                    <option value="Draft">Draft</option>
                    <option value="Published">Published</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Author</label>
                <input
                  value={draft.author}
                  onChange={(e) => setDraft((prev) => ({ ...prev, author: e.target.value }))}
                  placeholder="Editorial Team"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-brand-400 focus:bg-white focus:ring-2 focus:ring-brand-100"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Excerpt</label>
                <textarea
                  rows={4}
                  value={draft.excerpt}
                  onChange={(e) => setDraft((prev) => ({ ...prev, excerpt: e.target.value }))}
                  placeholder="A short summary for this page..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-brand-400 focus:bg-white focus:ring-2 focus:ring-brand-100"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => {
                  setIsModalOpen(false)
                  resetForm()
                }}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSavePage}
                className="rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-brand-500/30 hover:bg-brand-700"
              >
                {editingId ? 'Update Page' : 'Save Page'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
