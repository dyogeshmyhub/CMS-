import { useEffect, useRef, useState } from 'react'
import { ChevronDown, Play, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'

interface CategorySquareProps {
  title: string
  subtitle: string
  route: string
  accent?: 'gold' | 'blue' | 'amber'
  info: string
  meta: string
}

export default function CategorySquare({
  title,
  subtitle,
  route,
  accent = 'gold',
  info,
  meta,
}: CategorySquareProps) {
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClick)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])

  return (
    <div ref={menuRef} className={`feature-square feature-square-${accent}`}>
      <Link to={route} className="feature-square__body" aria-label={`${title} ${subtitle}`}>
        <div className="feature-square__badge">
          <Sparkles className="h-3.5 w-3.5" />
        </div>
        <div className="feature-square__label">{title}</div>
        <div className="feature-square__meta">{subtitle}</div>
        <div className="feature-square__info">{info}</div>
      </Link>

      <button
        type="button"
        className="feature-square__toggle"
        aria-expanded={open}
        aria-label={`Open ${title} options`}
        onClick={() => setOpen((current) => !current)}
      >
        <ChevronDown className="h-3.5 w-3.5" />
      </button>

      {open && (
        <div className="feature-square__dropdown" role="menu" aria-label={`${title} menu`}>
          <div className="feature-square__dropdown-item">
            <span>{meta}</span>
            <button type="button" className="feature-square__play" aria-label={`Play preview for ${title}`}>
              <Play className="h-3.5 w-3.5" />
            </button>
          </div>
          <Link to={route} className="feature-square__dropdown-action" onClick={() => setOpen(false)}>
            View updates
          </Link>
        </div>
      )}
    </div>
  )
}
