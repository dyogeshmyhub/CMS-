import { BarChart3, BellRing, DatabaseZap, ShieldCheck, Sparkles, Users } from 'lucide-react'
import { externalSources } from '../services/marketplaceData'

const supportAreas = [
  { title: 'Service Management', description: 'Monitor local and global service listings, update availability and moderation status.', icon: Sparkles },
  { title: 'User Administration', description: 'Track activity, profiles, role assignment and premium account health.', icon: Users },
  { title: 'Marketplace Insights', description: 'Measure listing growth, engagement and category performance in one dashboard.', icon: BarChart3 },
  { title: 'Data Sync & Security', description: 'Keep third-party imports, content ingestion and platform alerts synchronized.', icon: ShieldCheck },
]

export default function AdminSupportBoard() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="h-1.5 w-8 rounded-full bg-gradient-to-r from-brand-500 to-brand-700" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-700">Admin support</span>
          </div>
          <h2 className="font-display text-2xl font-bold text-slate-900 sm:text-3xl">Management and external source architecture</h2>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5 flex items-center gap-2 text-brand-800">
            <DatabaseZap className="h-4 w-4" />
            <span className="text-xs font-bold uppercase tracking-[0.2em]">Admin / management support</span>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {supportAreas.map(({ title, description, icon: Icon }) => (
              <article key={title} className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
                <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-100 text-brand-700">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="font-display text-lg font-bold text-slate-900">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-[linear-gradient(180deg,#f7fbff_0%,#ffffff_100%)] p-5 shadow-sm sm:p-6">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-brand-800">
              <BellRing className="h-4 w-4" />
              <span className="text-xs font-bold uppercase tracking-[0.2em]">External sources</span>
            </div>
            <span className="rounded-full bg-brand-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-brand-800">Adapter layer</span>
          </div>

          <div className="space-y-3">
            {externalSources.map((source) => (
              <div key={source.id} className="rounded-[22px] border border-slate-200 bg-white p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-display text-base font-bold text-slate-900">{source.name}</h3>
                    <p className="mt-1 text-xs text-slate-500">{source.sourceUrl}</p>
                  </div>
                  <span
                    className={`rounded-full px-2 py-1 text-[9px] font-bold uppercase tracking-[0.14em] ${
                      source.syncStatus === 'success'
                        ? 'bg-emerald-50 text-emerald-700'
                        : source.syncStatus === 'syncing'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-rose-50 text-rose-700'
                    }`}
                  >
                    {source.syncStatus}
                  </span>
                </div>

                <div className="mt-3 flex items-center justify-between gap-2 text-[11px] uppercase tracking-[0.12em] text-slate-500">
                  <span>{source.importedRecords} records</span>
                  <span>{source.lastSyncedAt ? new Date(source.lastSyncedAt).toLocaleDateString() : 'Not synced'}</span>
                </div>

                {source.errorStatus && (
                  <p className="mt-3 rounded-xl bg-rose-50 px-2.5 py-2 text-xs text-rose-700">{source.errorStatus}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
