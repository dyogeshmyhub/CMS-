import { Link, useParams } from 'react-router-dom'
import { Calendar, User } from 'lucide-react'
import { useAppContext } from '../context/AppContext'

export default function CmsPage() {
  const { slug } = useParams()
  const { pages } = useAppContext()
  const page = pages.find((p) => p.slug === slug)

  if (!page) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="font-display text-2xl font-bold text-slate-900">Page not found</h1>
        <Link to="/" className="mt-4 inline-block text-brand-600 hover:underline">
          Back to home
        </Link>
      </div>
    )
  }

  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">Guide</span>
      <h1 className="mt-4 font-display text-3xl font-extrabold text-slate-900 sm:text-4xl">{page.title}</h1>
      <div className="mt-4 flex items-center gap-4 text-sm text-slate-500">
        <span className="flex items-center gap-1.5"><User className="h-4 w-4" /> {page.author}</span>
        <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" /> {page.updatedAt}</span>
      </div>

      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-8 leading-relaxed text-slate-600 shadow-sm">
        <p className="font-medium text-slate-800">{page.excerpt}</p>
        <p className="mt-4">
          This content is managed through the Golden Traders CMS admin dashboard. Editors can create,
          publish and update guides like this one to help buyers and sellers get the most out of the
          marketplace, without ever touching code.
        </p>
        <p className="mt-4">
          Head over to the CMS dashboard to see how pages, categories, listings and users are all
          managed from a single, elegant interface.
        </p>
      </div>
    </article>
  )
}
