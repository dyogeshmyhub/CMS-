import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { ArrowUpRight, DollarSign, Eye, ListChecks, Users } from 'lucide-react'
import { salesTrend, listings, cmsPages, users } from '../../data/mockData'

const statCards = [
  {
    label: 'Total Listings',
    value: listings.length.toLocaleString(),
    delta: '+12.4%',
    icon: ListChecks,
  },
  {
    label: 'Total Users',
    value: users.length.toLocaleString(),
    delta: '+4.1%',
    icon: Users,
  },
  {
    label: 'Monthly Revenue',
    value: '$17,650',
    delta: '+9.8%',
    icon: DollarSign,
  },
  {
    label: 'Page Views',
    value: '482K',
    delta: '+21.6%',
    icon: Eye,
  },
]

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-900">Overview</h1>
        <p className="mt-1 text-sm text-slate-500">Welcome back, here's what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => (
          <div key={card.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                <card.icon className="h-5 w-5" />
              </span>
              <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600">
                <ArrowUpRight className="h-3.5 w-3.5" /> {card.delta}
              </span>
            </div>
            <p className="mt-4 font-display text-2xl font-extrabold text-slate-900">{card.value}</p>
            <p className="text-xs text-slate-500">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-display text-lg font-bold text-slate-900">Listings & Revenue Trend</h2>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesTrend}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4361ee" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#4361ee" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} stroke="#94a3b8" />
                <YAxis tickLine={false} axisLine={false} fontSize={12} stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 13 }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#4361ee"
                  strokeWidth={2.5}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-display text-lg font-bold text-slate-900">Recent CMS Activity</h2>
          <ul className="mt-4 space-y-4">
            {cmsPages.map((page) => (
              <li key={page.id} className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-800">{page.title}</p>
                  <p className="text-xs text-slate-400">by {page.author} · {page.updatedAt}</p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                    page.status === 'Published'
                      ? 'bg-emerald-50 text-emerald-600'
                      : 'bg-brand-50 text-brand-600'
                  }`}
                >
                  {page.status}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-display text-lg font-bold text-slate-900">Latest Listings</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-xs uppercase text-slate-400">
                <th className="pb-3 font-semibold">Title</th>
                <th className="pb-3 font-semibold">Category</th>
                <th className="pb-3 font-semibold">Price</th>
                <th className="pb-3 font-semibold">Views</th>
                <th className="pb-3 font-semibold">Posted</th>
              </tr>
            </thead>
            <tbody>
              {listings.slice(0, 6).map((l) => (
                <tr key={l.id} className="border-b border-slate-50 last:border-0">
                  <td className="max-w-xs truncate py-3 pr-4 font-medium text-slate-800">{l.title}</td>
                  <td className="py-3 pr-4 capitalize text-slate-500">{l.category}</td>
                  <td className="py-3 pr-4 text-slate-500">{l.price === 0 ? '—' : `$${l.price.toLocaleString()}`}</td>
                  <td className="py-3 pr-4 text-slate-500">{l.views}</td>
                  <td className="py-3 text-slate-500">{l.postedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
