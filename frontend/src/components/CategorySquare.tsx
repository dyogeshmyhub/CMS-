import { Link } from 'react-router-dom'

interface CategorySquareProps {
  title: string
  subtitle: string
  route: string
  info: string
}

export default function CategorySquare({ title, subtitle, route, info }: CategorySquareProps) {
  return (
    <Link to={route} className="marketplace-card" aria-label={`${title} ${subtitle}`}>
      <div className="feature-square__label">{title}</div>
      <div className="feature-square__meta">{subtitle}</div>
      <div className="feature-square__info">{info}</div>
    </Link>
  )
}
