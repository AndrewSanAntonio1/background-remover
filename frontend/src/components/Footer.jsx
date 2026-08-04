import { Link } from 'react-router-dom'
import Logo from './Logo'
import './Footer.css'

const COLUMNS = [
  {
    title: 'Product',
    links: [
      { label: 'Remove background', to: '/remove-background' },
      { label: 'Features', href: '/#features' },
      { label: 'How it works', href: '/#how-it-works' },
      { label: 'Pricing', href: '/#faq' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'FAQ', href: '/#faq' },
      { label: 'Contact', href: '/#contact' },
      { label: 'API docs', href: '/#contact' },
      { label: 'Status', href: '/#contact' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '/#features' },
      { label: 'Privacy', href: '/#faq' },
      { label: 'Terms', href: '/#faq' },
      { label: 'Security', href: '/#faq' },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <Logo />
          <p className="footer__tagline">
            Automatic background removal for product shots, portraits, and
            everything in between. Upload an image, get a clean transparent PNG.
          </p>
        </div>

        <div className="footer__columns">
          {COLUMNS.map((column) => (
            <div key={column.title} className="footer__column">
              <h3 className="footer__column-title">{column.title}</h3>
              <ul>
                {column.links.map((link) => (
                  <li key={link.label}>
                    {link.to ? (
                      <Link className="footer__link" to={link.to}>
                        {link.label}
                      </Link>
                    ) : (
                      <a className="footer__link" href={link.href}>
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="container footer__bottom">
        <p>&copy; {new Date().getFullYear()} Cutout. All rights reserved.</p>
        <p className="footer__note">
          Created by Andrew San Antonio • sgandrew290@gmail.com
        </p>
      </div>
    </footer>
  )
}
