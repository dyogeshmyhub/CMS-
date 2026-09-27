import { Pencil, Plus, Trash2, X } from 'lucide-react'
import { useState } from 'react'
import { useAppContext } from '../../context/AppContext'
import type { AppUser } from '../../types'

const countryOptions = [
  { code: '+1', flag: '🇺🇸', label: 'United States' },
  { code: '+44', flag: '🇬🇧', label: 'United Kingdom' },
  { code: '+61', flag: '🇦🇺', label: 'Australia' },
  { code: '+91', flag: '🇮🇳', label: 'India' },
  { code: '+971', flag: '🇦🇪', label: 'UAE' },
  { code: '+966', flag: '🇸🇦', label: 'Saudi Arabia' },
  { code: '+92', flag: '🇵🇰', label: 'Pakistan' },
  { code: '+234', flag: '🇳🇬', label: 'Nigeria' },
  { code: '+971', flag: '🇦🇪', label: 'Dubai' },
  { code: '+65', flag: '🇸🇬', label: 'Singapore' },
  { code: '+81', flag: '🇯🇵', label: 'Japan' },
  { code: '+82', flag: '🇰🇷', label: 'South Korea' },
  { code: '+55', flag: '🇧🇷', label: 'Brazil' },
  { code: '+52', flag: '🇲🇽', label: 'Mexico' },
  { code: '+33', flag: '🇫🇷', label: 'France' },
  { code: '+49', flag: '🇩🇪', label: 'Germany' },
]

const defaultDraft = {
  name: '',
  email: '',
  phone: '',
  countryCode: '+1',
  address: '',
  company: '',
  role: 'USER' as AppUser['role'],
  status: 'ACTIVE' as AppUser['status'],
}

export default function ManageUsers() {
  const { users, addUser, updateUser, removeUser } = useAppContext()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [draft, setDraft] = useState(defaultDraft)
  const [countrySearch, setCountrySearch] = useState('')
  const [isCountryMenuOpen, setIsCountryMenuOpen] = useState(false)

  const resetForm = () => {
    setDraft(defaultDraft)
    setEditingId(null)
    setCountrySearch('')
    setIsCountryMenuOpen(false)
  }

  const openCreateModal = () => {
    resetForm()
    setIsModalOpen(true)
  }

  const filteredCountryOptions = countryOptions.filter((country) => {
    const query = countrySearch.trim().toLowerCase()
    if (!query) return true

    return (
      country.label.toLowerCase().includes(query) ||
      country.code.toLowerCase().includes(query) ||
      country.flag.toLowerCase().includes(query)
    )
  })

  const selectedCountry =
    countryOptions.find((country) => country.code === draft.countryCode) ?? countryOptions[0]

  const openEditModal = (user: AppUser) => {
    setEditingId(user.id)
    setDraft({
      name: user.name,
      email: user.email,
      phone: user.phone ?? '',
      countryCode: user.countryCode ?? '+1',
      address: user.address ?? '',
      company: user.company ?? '',
      role: user.role,
      status: user.status,
    })
    setIsModalOpen(true)
  }

  const handleSaveUser = () => {
    const name = draft.name.trim()
    const email = draft.email.trim()
    if (!name || !email) return

    const payload = {
      name,
      email,
      phone: draft.phone.trim() || undefined,
      countryCode: draft.countryCode,
      address: draft.address.trim() || undefined,
      company: draft.company.trim() || undefined,
      role: draft.role,
      status: draft.status,
    }

    if (editingId) {
      updateUser(editingId, payload)
    } else {
      addUser({
        id: `u-${Date.now()}`,
        ...payload,
        joined: new Date().toISOString().slice(0, 10),
        avatar: `https://i.pravatar.cc/100?img=${Math.floor(1 + Math.random() * 80)}`,
      })
    }

    setIsModalOpen(false)
    resetForm()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">Manage Users</h1>
          <p className="mt-1 text-sm text-slate-500">{users.length} registered users</p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-brand-500/30 hover:bg-brand-700"
        >
          <Plus className="h-4 w-4" /> Invite User
        </button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-400">
            <tr>
              <th className="px-5 py-3 font-semibold">User</th>
              <th className="px-5 py-3 font-semibold">Role</th>
              <th className="px-5 py-3 font-semibold">Joined</th>
              <th className="px-5 py-3 font-semibold">Status</th>
              <th className="px-5 py-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t border-slate-100 hover:bg-slate-50/60">
                <td className="flex items-center gap-3 px-5 py-3">
                  <img src={u.avatar} alt={u.name} className="h-9 w-9 rounded-full" />
                  <div>
                    <p className="font-medium text-slate-800">{u.name}</p>
                    <p className="text-xs text-slate-400">{u.email}</p>
                    {u.phone && (
                      <p className="text-[11px] text-slate-400">
                        {u.countryCode ?? '+1'} {u.phone}
                      </p>
                    )}
                  </div>
                </td>
                <td className="px-5 py-3">
                  <span className="rounded-full bg-brand-50 px-2.5 py-1 text-[11px] font-semibold text-brand-700">
                    {u.role}
                  </span>
                </td>
                <td className="px-5 py-3 text-slate-500">{u.joined}</td>
                <td className="px-5 py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                      u.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                    }`}
                  >
                    {u.status}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => openEditModal(u)}
                      className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-brand-600"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => removeUser(u.id)}
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
          <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-600">
                  {editingId ? 'Update user' : 'Invite user'}
                </p>
                <h2 className="mt-1 font-display text-2xl font-bold text-slate-900">
                  {editingId ? 'Edit User' : 'Invite User'}
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
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Full name</label>
                <input
                  value={draft.name}
                  onChange={(e) => setDraft((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Alex Johnson"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-brand-400 focus:bg-white focus:ring-2 focus:ring-brand-100"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Email address</label>
                <input
                  type="email"
                  value={draft.email}
                  onChange={(e) => setDraft((prev) => ({ ...prev, email: e.target.value }))}
                  placeholder="alex@company.com"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-brand-400 focus:bg-white focus:ring-2 focus:ring-brand-100"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-[120px_1fr]">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Country code</label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsCountryMenuOpen((prev) => !prev)}
                      className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-left text-sm text-slate-800 outline-none transition hover:border-brand-300 focus:border-brand-400 focus:bg-white focus:ring-2 focus:ring-brand-100"
                    >
                      <span className="flex items-center gap-2">
                        <span className="text-base">{selectedCountry.flag}</span>
                        <span className="font-medium">{selectedCountry.code}</span>
                      </span>
                      <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400">{selectedCountry.label}</span>
                    </button>

                    {isCountryMenuOpen && (
                      <div className="absolute left-0 right-0 z-20 mt-2 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
                        <div className="border-b border-slate-200 p-2">
                          <input
                            type="text"
                            value={countrySearch}
                            onChange={(e) => setCountrySearch(e.target.value)}
                            placeholder="Search country"
                            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
                          />
                        </div>
                        <div className="max-h-52 overflow-y-auto">
                          {filteredCountryOptions.map((country) => (
                            <button
                              key={`${country.code}-${country.label}`}
                              type="button"
                              onClick={() => {
                                setDraft((prev) => ({ ...prev, countryCode: country.code }))
                                setCountrySearch('')
                                setIsCountryMenuOpen(false)
                              }}
                              className={`flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm transition hover:bg-brand-50 ${
                                draft.countryCode === country.code ? 'bg-brand-50 text-brand-700' : 'text-slate-700'
                              }`}
                            >
                              <span className="flex items-center gap-2">
                                <span>{country.flag}</span>
                                <span>{country.code}</span>
                              </span>
                              <span className="text-xs text-slate-500">{country.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Phone number</label>
                  <input
                    type="tel"
                    value={draft.phone}
                    onChange={(e) => setDraft((prev) => ({ ...prev, phone: e.target.value }))}
                    placeholder="555 678 9012"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-brand-400 focus:bg-white focus:ring-2 focus:ring-brand-100"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Company</label>
                <input
                  value={draft.company}
                  onChange={(e) => setDraft((prev) => ({ ...prev, company: e.target.value }))}
                  placeholder="Northwood Studio"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-brand-400 focus:bg-white focus:ring-2 focus:ring-brand-100"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Address</label>
                <textarea
                  value={draft.address}
                  onChange={(e) => setDraft((prev) => ({ ...prev, address: e.target.value }))}
                  placeholder="123 Market Street, Austin, TX"
                  rows={3}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-brand-400 focus:bg-white focus:ring-2 focus:ring-brand-100"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Role</label>
                  <select
                    value={draft.role}
                    onChange={(e) => setDraft((prev) => ({ ...prev, role: e.target.value as AppUser['role'] }))}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-brand-400 focus:bg-white focus:ring-2 focus:ring-brand-100"
                  >
                    <option value="USER">User</option>
                    <option value="ADMIN">Admin</option>
                    <option value="SUPER_ADMIN">Super Admin</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Status</label>
                  <select
                    value={draft.status}
                    onChange={(e) => setDraft((prev) => ({ ...prev, status: e.target.value as AppUser['status'] }))}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-brand-400 focus:bg-white focus:ring-2 focus:ring-brand-100"
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="DISABLED">Disabled</option>
                  </select>
                </div>
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
                onClick={handleSaveUser}
                className="rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-brand-500/30 hover:bg-brand-700"
              >
                {editingId ? 'Update User' : 'Send Invite'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
