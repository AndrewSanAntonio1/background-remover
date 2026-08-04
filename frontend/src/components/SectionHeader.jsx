import Reveal from './Reveal'
import './SectionHeader.css'

/** Eyebrow + title + subtitle block shared by every landing section. */
export default function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = 'center',
  id,
}) {
  return (
    <Reveal
      className={`section-header ${
        align === 'center' ? 'section-header--center' : ''
      }`}
    >
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h2 className="section-header__title" id={id}>
        {title}
      </h2>
      {subtitle && <p className="section-header__subtitle">{subtitle}</p>}
    </Reveal>
  )
}
