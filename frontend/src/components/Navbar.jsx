import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Button from './Button'
import Logo from './Logo'
import { IconClose, IconMenu } from './Icons'
import './Navbar.css'

const NAV_LINKS = [
  { label: 'Features', hash: '#features' },
  { label: 'How it works', hash: '#how-it-works' },
  { label: 'FAQ', hash: '#faq' },
  { label: 'Contact', hash: '#contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { pathname } = useLocation()

  const onLanding = pathname === '/'

  // Solidify the bar once the hero starts scrolling under it.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close the drawer on navigation.
  useEffect(() => setMenuOpen(false), [pathname])

  // Lock the page behind the open drawer, and allow Escape to dismiss it.
  useEffect(() => {
    document.body.classList.toggle('no-scroll', menuOpen)

    const onKeyDown = (event) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }

    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.classList.remove('no-scroll')
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [menuOpen])

  // On the landing page these are same-page anchors; elsewhere they need to
  // route home first.
  const hrefFor = (hash) => (onLanding ? hash : `/${hash}`)

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <header className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
        <nav className="navbar__inner container" aria-label="Main">
          <Logo />

          <ul className="navbar__links">
            {NAV_LINKS.map((link) => (
              <li key={link.hash}>
                <a className="navbar__link" href={hrefFor(link.hash)}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="navbar__actions">
            <Button to="/remove-background" size="sm">
              Remove background
            </Button>
          </div>

          <button
            type="button"
            className="navbar__toggle"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            {menuOpen ? <IconClose size={22} /> : <IconMenu size={22} />}
          </button>
        </nav>
      </header>

      {/* Mobile drawer */}
      <div
        id="mobile-menu"
        className={`mobile-menu ${menuOpen ? 'mobile-menu--open' : ''}`}
        hidden={!menuOpen}
      >
        <ul className="mobile-menu__links">
          {NAV_LINKS.map((link) => (
            <li key={link.hash}>
              <a
                className="mobile-menu__link"
                href={hrefFor(link.hash)}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <Link
          to="/remove-background"
          className="btn btn--primary btn--block btn--lg"
          onClick={() => setMenuOpen(false)}
        >
          Remove background
        </Link>
      </div>

      {menuOpen && (
        <div
          className="mobile-menu__backdrop"
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  )
}
