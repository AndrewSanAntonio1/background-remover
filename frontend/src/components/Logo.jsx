import { Link } from 'react-router-dom'
import { IconWand } from './Icons'
import './Logo.css'

export default function Logo({ to = '/', onClick }) {
  return (
    <Link to={to} className="logo" onClick={onClick} aria-label="Cutout home">
      <span className="logo__mark">
        <IconWand size={18} />
      </span>
      <span>Cutout</span>
    </Link>
  )
}
