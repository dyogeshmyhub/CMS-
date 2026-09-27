import { ArrowRight, Globe2, HeartHandshake, ShieldCheck, Sparkles } from 'lucide-react'
import { marketplaceServices, rightSideServices } from '../services/marketplaceData'

export default function GlobalServiceBoard() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="h-1.5 w-8 rounded-full bg-gradient-to-r from-brand-500 to-brand-700" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-700">Global access</span>
          </div>
          <h2 className="font-display text-2xl font-bold text-slate-900 sm:text-3xl">International services and support</h2>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-brand-800">
              <ShieldCheck className="h-4 w-4" />
              <span className="text-xs font-bold uppercase tracking-[0.2em]">Left side services</span>
            </div>
            <Sparkles className="h-4 w-4 text-brand-600" />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {marketplaceServices.slice(0, 10).map((service) => (
              <article key={service.id} className="rounded-[22px] border border-brand-100 bg-brand-50/60 p-4">
                <div className="mb-3 flex items-center justify-between gap-2">
                  <span className="rounded-full bg-white px-2 py-1 text-[9px] font-bold uppercase tracking-[0.15em] text-brand-800">{service.category}</span>
                  <span className="text-[10px] font-medium text-slate-500">{service.availability}</span>
                </div>
                <h3 className="font-display text-base font-bold text-slate-900">{service.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{service.description}</p>
                <div className="mt-4 flex items-center justify-between gap-3">
                  <span className="text-[11px] uppercase tracking-[0.12em] text-slate-500">{service.location}</span>
                  <button type="button" className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-brand-800">
                    Contact <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_100%)] p-5 shadow-sm sm:p-6">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-brand-800">
              <Globe2 className="h-4 w-4" />
              <span className="text-xs font-bold uppercase tracking-[0.2em]">Right side services</span>
            </div>
            <HeartHandshake className="h-4 w-4 text-brand-600" />
          </div>

          <div className="space-y-3">
            {rightSideServices.slice(0, 10).map((service) => (
              <div key={service.id} className="rounded-[20px] border border-slate-200 bg-white p-3.5">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-display text-base font-bold text-slate-900">{service.title}</h3>
                  <span className="rounded-full bg-brand-50 px-2 py-1 text-[8px] font-bold uppercase tracking-[0.18em] text-brand-800">{service.category}</span>
                </div>
                <p className="mt-2 text-sm text-slate-600">{service.description}</p>
                <div className="mt-3 flex items-center justify-between gap-2 text-[11px] uppercase tracking-[0.12em] text-slate-500">
                  <span>{service.location}</span>
                  <span>{service.availability}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
