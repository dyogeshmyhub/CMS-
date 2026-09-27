import { useAppContext } from '../context/AppContext'

export default function UserProfile() {
  const { currentUser } = useAppContext()

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-10">
      <div>
        <h1 className="font-display text-3xl font-bold text-slate-900">Profile</h1>
        <p className="mt-1 text-sm text-slate-500">Manage your personal account details.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-display text-xl font-bold text-slate-900">Personal Information</h2>
          <div className="mt-5 space-y-4 text-sm text-slate-600">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Full Name</p>
              <p className="mt-1 font-medium text-slate-800">{currentUser?.name || 'Unknown user'}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Email</p>
              <p className="mt-1 font-medium text-slate-800">{currentUser?.email || 'noreply@example.com'}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Role</p>
              <p className="mt-1 font-medium text-slate-800">USER</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-display text-xl font-bold text-slate-900">Account Security</h2>
          <div className="mt-5 space-y-4 text-sm text-slate-600">
            <div className="rounded-xl bg-slate-50 p-3">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Password</p>
              <p className="mt-1 font-medium text-slate-800">Protected and encrypted</p>
            </div>
            <div className="rounded-xl bg-slate-50 p-3">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Status</p>
              <p className="mt-1 font-medium text-emerald-600">Active</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
