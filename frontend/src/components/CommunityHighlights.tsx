import { MessageSquareHeart, Music4, Sparkles, Users } from 'lucide-react'
import { entertainmentCards, socialProfiles } from '../services/marketplaceData'

export default function CommunityHighlights() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="h-1.5 w-8 rounded-full bg-gradient-to-r from-brand-500 to-brand-700" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-700">Community</span>
          </div>
          <h2 className="font-display text-2xl font-bold text-slate-900 sm:text-3xl">Entertainment and new connections</h2>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5 flex items-center gap-2 text-brand-800">
            <Music4 className="h-4 w-4" />
            <span className="text-xs font-bold uppercase tracking-[0.2em]">Entertainment / General knowledge</span>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {entertainmentCards.map((card) => (
              <article key={card.id} className="rounded-[24px] border border-slate-200 bg-gradient-to-br from-slate-50 to-brand-50 p-4">
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-brand-700 shadow-sm">
                  <Sparkles className="h-5 w-5" />
                </div>
                <h3 className="font-display text-lg font-bold text-slate-900">{card.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{card.description}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-[linear-gradient(180deg,#f5f9ff_0%,#ffffff_100%)] p-5 shadow-sm sm:p-6">
          <div className="mb-5 flex items-center gap-2 text-brand-800">
            <Users className="h-4 w-4" />
            <span className="text-xs font-bold uppercase tracking-[0.2em]">Communication / new friends</span>
          </div>

          <div className="space-y-4">
            {socialProfiles.map((profile) => (
              <article key={profile.id} className="rounded-[22px] border border-slate-200 bg-white p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-display text-lg font-bold text-slate-900">{profile.name}</h3>
                    <p className="mt-1 text-sm text-slate-500">{profile.location} • {profile.community}</p>
                  </div>
                  <div className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-emerald-700">
                    {profile.status}
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {profile.interests.map((interest) => (
                    <span key={`${profile.id}-${interest}`} className="rounded-full bg-brand-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-brand-700">
                      {interest}
                    </span>
                  ))}
                </div>

                <button type="button" className="mt-4 inline-flex items-center gap-2 rounded-full bg-brand-600 px-3 py-2 text-xs font-semibold text-white">
                  <MessageSquareHeart className="h-3.5 w-3.5" />
                  Connect
                </button>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
