import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X, Zap, ChevronDown, LogOut, LayoutDashboard } from 'lucide-react'
import { api } from '../utils/api'
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
  const [user, setUser] = useState(null)
  const { pathname } = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 16)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => {
    setOpen(false)
    setUser(api.getUser())
  }, [pathname])

  const handleLogout = () => {
    api.logout()
    setUser(null)
    navigate('/')
  }

  const getDashboardPath = (role) => {
    if (role === 'admin') return '/admin'
    if (role === 'provider') return '/provider'
    return '/dashboard'
  }

  const getInitials = (firstName, lastName) => {
    return `${(firstName || '')[0] || ''}${(lastName || '')[0] || ''}`.toUpperCase()
  }

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
          {user ? (
            <div className="nav-user-pill-wrap" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Link to={getDashboardPath(user.role)} className="nav-user-profile-pill" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                textDecoration: 'none',
                background: 'rgba(229,57,53,0.1)',
                padding: '6px 14px',
                borderRadius: '50px',
                border: '1px solid rgba(229,57,53,0.2)',
                color: '#E53935',
                fontWeight: 600,
                fontSize: '0.88rem'
              }}>
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: '#E53935',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.78rem',
                  fontWeight: 700
                }}>
                  {getInitials(user.firstName, user.lastName)}
                </div>
                <span>Dashboard</span>
              </Link>
              <button onClick={handleLogout} className="btn-ghost" style={{ padding: '8px 12px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
                <LogOut size={14} /> Log Out
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="btn-ghost" style={{ padding: '10px 18px', fontSize: '0.9rem' }}>Sign In</Link>
              <Link to="/register" className="btn-primary" style={{ padding: '10px 22px', fontSize: '0.9rem' }}>Get Started</Link>
            </>
          )}
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
            {user ? (
              <>
                <Link to={getDashboardPath(user.role)} className="btn-primary" style={{ justifyContent: 'center', display: 'flex', gap: '8px' }}>
                  <LayoutDashboard size={16} /> Go to Dashboard
                </Link>
                <button onClick={handleLogout} className="btn-outline" style={{ justifyContent: 'center', display: 'flex', gap: '8px', width: '100%', marginTop: '8px' }}>
                  <LogOut size={16} /> Log Out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-outline" style={{ justifyContent: 'center' }}>Sign In</Link>
                <Link to="/register" className="btn-primary" style={{ justifyContent: 'center' }}>Get Started</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
