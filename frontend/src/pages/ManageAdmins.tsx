import { Plus, ShieldCheck, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useAppContext } from '../context/AppContext'

export default function ManageAdmins() {
  const { authToken } = useAppContext()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleCreateAdmin = async () => {
    setError('')
    setMessage('')

    if (!name || !email || !password || !confirmPassword) {
      setError('All fields are required.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch('http://localhost:3001/api/admins', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken || ''}`,
        },
        body: JSON.stringify({ name, email, password, confirmPassword }),
      })

      const payload = await response.json()
      if (!response.ok) {
        setError(payload.message || 'Unable to create admin.')
      } else {
        setMessage(`Admin account created for ${payload.user?.email || email}.`)
        setName('')
        setEmail('')
        setPassword('')
        setConfirmPassword('')
      }
    } catch {
      setError('Unable to create admin account.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-slate-900">Admin Management</h1>
        <p className="mt-1 text-sm text-slate-500">Create and manage administrator accounts.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <div>
              <h2 className="font-display text-xl font-bold text-slate-900">Create Admin</h2>
              <p className="text-sm text-slate-500">Only a Super Admin can perform this action.</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Full name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Confirm password</label>
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100" />
            </div>

            {error && <p className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}
            {message && <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{message}</p>}

            <button onClick={handleCreateAdmin} disabled={isSubmitting} className="flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-brand-500/30 hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-70">
              <Plus className="h-4 w-4" /> {isSubmitting ? 'Creating...' : 'Create Admin'}
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-display text-xl font-bold text-slate-900">Admin Privileges</h2>
          <ul className="mt-4 space-y-3 text-sm text-slate-600">
            <li className="flex items-start gap-2"><span className="mt-1 h-2 w-2 rounded-full bg-brand-500" /> Manage platform content and listings</li>
            <li className="flex items-start gap-2"><span className="mt-1 h-2 w-2 rounded-full bg-brand-500" /> View and moderate users</li>
            <li className="flex items-start gap-2"><span className="mt-1 h-2 w-2 rounded-full bg-brand-500" /> Approve or reject listings</li>
            <li className="flex items-start gap-2"><span className="mt-1 h-2 w-2 rounded-full bg-brand-500" /> Cannot manage Super Admin privileges</li>
          </ul>

          <div className="mt-6 rounded-xl bg-slate-50 p-3 text-sm text-slate-600">
            <div className="flex items-center justify-between">
              <span>Current protected actions</span>
              <Trash2 className="h-4 w-4 text-slate-400" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
