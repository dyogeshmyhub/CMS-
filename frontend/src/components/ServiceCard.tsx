import { ArrowRight } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface ServiceCardProps {
  title: string
  description: string
  icon: LucideIcon
  actionLabel?: string
  location?: string
  category?: string
}

export default function ServiceCard({
  title,
  description,
  icon: Icon,
  actionLabel = 'Request now',
  location,
  category,
}: ServiceCardProps) {
  return (
    <article className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-[0_20px_42px_rgba(19,42,94,0.08)]">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-100 to-brand-200 text-brand-800">
        <Icon className="h-5 w-5" />
      </div>
      <div className="mb-2 flex items-center justify-between gap-2">
        <h3 className="font-display text-lg font-bold text-slate-900">{title}</h3>
        {category && <span className="rounded-full bg-brand-50 px-2 py-1 text-[9px] font-bold uppercase tracking-[0.15em] text-brand-800">{category}</span>}
      </div>
      <p className="text-sm leading-6 text-slate-600">{description}</p>
      {location && <p className="mt-3 text-xs font-medium uppercase tracking-[0.12em] text-slate-500">{location}</p>}
      <button type="button" className="mt-4 inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-brand-200 hover:text-brand-800">
        {actionLabel} <ArrowRight className="h-3.5 w-3.5" />
      </button>
    </article>
  )
}
