import { ArrowUpRight, ShieldCheck, Users, LayoutGrid, FileText } from 'lucide-react'

const stats = [
  { label: 'Total Users', value: '1,248', icon: Users },
  { label: 'Total Admins', value: '12', icon: ShieldCheck },
  { label: 'Total Listings', value: '8,420', icon: LayoutGrid },
  { label: 'Pending Listings', value: '146', icon: FileText },
]

export default function SuperAdminDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold text-slate-900">Super Admin Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">Platform oversight, system health and admin controls.</p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((card) => (
          <div key={card.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                <card.icon className="h-5 w-5" />
              </span>
              <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600">
                <ArrowUpRight className="h-3.5 w-3.5" /> +12%
              </span>
            </div>
            <p className="mt-4 text-3xl font-display font-extrabold text-slate-900">{card.value}</p>
            <p className="text-xs text-slate-500">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-display text-xl font-bold text-slate-900">Recent Users</h2>
          <ul className="mt-4 space-y-4 text-sm text-slate-600">
            <li className="flex items-center justify-between"><span>Priya Martin</span><span className="text-slate-400">2h ago</span></li>
            <li className="flex items-center justify-between"><span>Daniel Smith</span><span className="text-slate-400">5h ago</span></li>
            <li className="flex items-center justify-between"><span>Rhea Ali</span><span className="text-slate-400">1d ago</span></li>
          </ul>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-display text-xl font-bold text-slate-900">System Status</h2>
          <div className="mt-4 space-y-3 text-sm text-slate-600">
            <div className="flex items-center justify-between rounded-xl bg-emerald-50 px-3 py-2 text-emerald-700"><span>Platform uptime</span><span>99.98%</span></div>
            <div className="flex items-center justify-between rounded-xl bg-brand-50 px-3 py-2 text-brand-700"><span>Moderation queue</span><span>24 items</span></div>
            <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 text-slate-700"><span>Settings</span><span>Synced</span></div>
          </div>
        </div>
      </div>
    </div>
  )
}
