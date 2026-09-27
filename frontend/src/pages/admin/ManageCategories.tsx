import { Pencil, Plus, Trash2, X } from 'lucide-react'
import { useState } from 'react'
import { iconMap } from '../../components/iconMap'
import { useAppContext } from '../../context/AppContext'

const iconOptions = Object.keys(iconMap)

export default function ManageCategories() {
  const { categories, addCategory, updateCategory, removeCategory } = useAppContext()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [draftCategory, setDraftCategory] = useState({ name: '', icon: 'Car', count: 0 })

  const resetForm = () => {
    setDraftCategory({ name: '', icon: 'Car', count: 0 })
    setEditingId(null)
  }

  const openCreateModal = () => {
    resetForm()
    setIsModalOpen(true)
  }

  const openEditModal = (cat: { id: string; name: string; icon: string; count: number }) => {
    setEditingId(cat.id)
    setDraftCategory({ name: cat.name, icon: cat.icon, count: cat.count })
    setIsModalOpen(true)
  }

  const handleSaveCategory = () => {
    const trimmedName = draftCategory.name.trim()
    if (!trimmedName) return

    if (editingId) {
      updateCategory(editingId, {
        name: trimmedName,
        icon: draftCategory.icon,
        count: Number(draftCategory.count) || 0,
      })
    } else {
      addCategory({
        id: `custom-${Date.now()}`,
        name: trimmedName,
        icon: draftCategory.icon,
        count: Number(draftCategory.count) || 0,
      })
    }

    resetForm()
    setIsModalOpen(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">Manage Categories</h1>
          <p className="mt-1 text-sm text-slate-500">{categories.length} active categories</p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-brand-500/30 hover:bg-brand-700"
        >
          <Plus className="h-4 w-4" /> Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat) => {
          const Icon = iconMap[cat.icon]
          return (
            <div
              key={cat.id}
              className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-semibold text-slate-800">{cat.name}</p>
                  <p className="text-xs text-slate-400">{cat.count.toLocaleString()} listings</p>
                </div>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => openEditModal(cat)}
                  className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-brand-600"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={() => removeCategory(cat.id)}
                  className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-600">
                  {editingId ? 'Update category' : 'New category'}
                </p>
                <h2 className="mt-1 font-display text-2xl font-bold text-slate-900">
                  {editingId ? 'Edit Category' : 'Add Category'}
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
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Category name</label>
                <input
                  value={draftCategory.name}
                  onChange={(e) => setDraftCategory((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. Travel, Real Estate"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-brand-400 focus:bg-white focus:ring-2 focus:ring-brand-100"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Icon</label>
                <select
                  value={draftCategory.icon}
                  onChange={(e) => setDraftCategory((prev) => ({ ...prev, icon: e.target.value }))}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-brand-400 focus:bg-white focus:ring-2 focus:ring-brand-100"
                >
                  {iconOptions.map((iconName) => (
                    <option key={iconName} value={iconName}>
                      {iconName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Initial listings count</label>
                <input
                  type="number"
                  min="0"
                  value={draftCategory.count}
                  onChange={(e) => setDraftCategory((prev) => ({ ...prev, count: Number(e.target.value) || 0 }))}
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
                onClick={handleSaveCategory}
                className="rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-brand-500/30 hover:bg-brand-700"
              >
                {editingId ? 'Update Category' : 'Save Category'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
