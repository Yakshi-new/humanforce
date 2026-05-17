import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Zap, ChevronDown } from 'lucide-react'
import './Navbar.css'

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services' },
  { label: 'Categories', href: '/categories' },
  { label: 'How It Works', href: '/how-it-works' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'About', href: '/about' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 16)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => { setOpen(false) }, [pathname])

  return (
    <header className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo">
          <div className="logo-icon"><Zap size={18}/></div>
          <span>HumanForce</span>
        </Link>

        <nav className="navbar-nav">
          {NAV_LINKS.map(n => (
            <Link
              key={n.href}
              to={n.href}
              className={`nav-link ${pathname === n.href ? 'nav-link-active' : ''}`}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="navbar-actions">
          <Link to="/login" className="btn-ghost" style={{ padding: '10px 18px', fontSize: '0.9rem' }}>Sign In</Link>
          <Link to="/register" className="btn-primary" style={{ padding: '10px 22px', fontSize: '0.9rem' }}>Get Started</Link>
        </div>

        <button className="navbar-burger" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="navbar-mobile">
          {NAV_LINKS.map(n => (
            <Link
              key={n.href}
              to={n.href}
              className={`mobile-link ${pathname === n.href ? 'mobile-link-active' : ''}`}
            >
              {n.label}
            </Link>
          ))}
          <div className="mobile-actions">
            <Link to="/login" className="btn-outline" style={{ justifyContent: 'center' }}>Sign In</Link>
            <Link to="/register" className="btn-primary" style={{ justifyContent: 'center' }}>Get Started</Link>
          </div>
        </div>
      )}
    </header>
  )
}
