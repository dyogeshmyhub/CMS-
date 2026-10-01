import { useEffect, useState } from 'react'
import { ArrowUpRight, Megaphone } from 'lucide-react'
import { useAppContext } from '../context/AppContext'

export default function AdvertisementDisplay() {
  const { advertisements } = useAppContext()
  const today = new Date().toISOString().slice(0, 10)
  const activeAdvertisements = advertisements
    .filter((advertisement) => advertisement.status === 'ACTIVE'
      && (!advertisement.startDate || advertisement.startDate <= today)
      && (!advertisement.endDate || advertisement.endDate >= today))
    .slice(0, 5)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const activeIndex = selectedIndex % Math.max(activeAdvertisements.length, 1)
  const advertisement = activeAdvertisements[activeIndex]

  useEffect(() => {
    if (activeAdvertisements.length < 2) return undefined
    const interval = window.setInterval(() => {
      setSelectedIndex((current) => (current + 1) % activeAdvertisements.length)
    }, 5000)
    return () => window.clearInterval(interval)
  }, [activeAdvertisements.length])

  return (
    <aside className="advertisement-panel" aria-label="Featured advertisements" aria-live="polite">
      <div className="advertisement-panel__heading">
        <span className="advertisement-panel__eyebrow"><Megaphone className="h-3.5 w-3.5" /> Featured</span>
        <span className="text-xs font-medium text-slate-500">Advertisement</span>
      </div>

      {advertisement ? (
        <article key={advertisement.id} className="advertisement-slide">
          {advertisement.image ? (
            <img className="advertisement-panel__image" src={advertisement.image} alt={advertisement.title} />
          ) : (
            <div className="advertisement-panel__image-fallback" aria-label="Advertisement image unavailable">
              <Megaphone className="h-8 w-8" />
            </div>
          )}
          <div className="advertisement-panel__content">
            <p className="advertisement-panel__advertiser">{advertisement.advertiser}</p>
            <h2 className="advertisement-panel__title">{advertisement.title}</h2>
            <p className="advertisement-panel__description">{advertisement.description}</p>
            {advertisement.ctaText && advertisement.ctaLink && (
              <a
                className="advertisement-panel__cta"
                href={advertisement.ctaLink}
                target={advertisement.ctaLink.startsWith('http') ? '_blank' : undefined}
                rel={advertisement.ctaLink.startsWith('http') ? 'noreferrer' : undefined}
              >
                {advertisement.ctaText} <ArrowUpRight className="h-4 w-4" />
              </a>
            )}
          </div>
        </article>
      ) : (
        <div className="advertisement-empty">
          <Megaphone className="h-8 w-8" aria-hidden="true" />
        </div>
      )}

      <div className="advertisement-panel__footer">Featured Advertisements</div>

      {activeAdvertisements.length > 1 && (
        <div className="advertisement-panel__indicators" aria-label="Choose advertisement">
          {activeAdvertisements.map((item, index) => (
            <button
              key={item.id}
              type="button"
              className={`advertisement-panel__indicator${index === activeIndex ? ' is-active' : ''}`}
              onClick={() => setSelectedIndex(index)}
              aria-label={`Show advertisement ${index + 1}`}
              aria-current={index === activeIndex ? 'true' : undefined}
            />
          ))}
        </div>
      )}
    </aside>
  )
}