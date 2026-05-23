import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Zap, Mail, Phone, MapPin, CheckCircle, X, Loader } from 'lucide-react'
import { api } from '../utils/api'
import './Footer.css'

export default function Footer() {
  const year = new Date().getFullYear()
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') // 'idle' | 'loading' | 'success' | 'error'
  const [errorMsg, setErrorMsg] = useState('')
  const [showPopup, setShowPopup] = useState(false)

  const handleSubscribe = async () => {
    const trimmed = email.trim()
    if (!trimmed) {
      setErrorMsg('Please enter your email address.')
      setStatus('error')
      return
    }
    if (!/^\S+@\S+\.\S+$/.test(trimmed)) {
      setErrorMsg('Please enter a valid email address.')
      setStatus('error')
      return
    }

    setStatus('loading')
    setErrorMsg('')

    try {
      await api.subscribeNewsletter(trimmed)
      setStatus('success')
      setEmail('')
      setShowPopup(true)
    } catch (err) {
      setStatus('error')
      setErrorMsg(err.message || 'Something went wrong. Please try again.')
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSubscribe()
  }

  const closePopup = () => {
    setShowPopup(false)
    setStatus('idle')
  }

  return (
    <>
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <Link to="/" className="footer-logo">
                <div className="logo-icon"><Zap size={18} /></div>
                <span>HumanForce</span>
              </Link>
              <p>AI-powered human services marketplace. Connecting businesses with world-class professionals in seconds.</p>
              <div className="footer-social">
                {[
                  { label: 'X (Twitter)', href: '#', mark: '𝕏' },
                  { label: 'LinkedIn', href: '#', mark: 'in' },
                  { label: 'Instagram', href: '#', mark: '📷' },
                ].map((s, i) => (
                  <a key={i} href={s.href} className="social-icon" aria-label={s.label} target="_blank" rel="noopener noreferrer">
                    <span style={{fontWeight:700,fontSize:'0.85rem'}}>{s.mark}</span>
                  </a>
                ))}
              </div>
            </div>

            <div className="footer-col">
              <h4>Platform</h4>
              <ul>
                {[
                  ['Services', '/services'],
                  ['Categories', '/categories'],
                  ['How It Works', '/how-it-works'],
                  ['Pricing', '/pricing'],
                  ['Blog', '/blog'],
                ].map(([label, href]) => (
                  <li key={href}><Link to={href}>{label}</Link></li>
                ))}
              </ul>
            </div>

            <div className="footer-col">
              <h4>Company</h4>
              <ul>
                {[
                  ['About Us', '/about'],
                  ['Contact', '/contact'],
                  ['Careers', '#'],
                  ['Press', '#'],
                  ['Partners', '#'],
                ].map(([label, href], idx) => (
                  <li key={label + idx}><Link to={href}>{label}</Link></li>
                ))}
                <li className="footer-provider-link-item">
                  <Link to="/register/provider" className="footer-provider-link">
                    <span className="footer-provider-badge">💼</span>
                    Become a Provider
                  </Link>
                </li>
              </ul>
            </div>

            <div className="footer-col">
              <h4>Contact</h4>
              <ul className="footer-contact-list">
                <li><Mail size={15} /><a href="mailto:hello@humanforce.ai">yakshi539@gmail.com</a></li>
                <li><Phone size={15} /><a href="tel:+919644464981">+91 96444 64981</a></li>
                <li><MapPin size={15} /><span>Dewas, Madhya Pradesh 455001 </span></li>
              </ul>

              {/* Newsletter Subscribe */}
              <div className="footer-newsletter">
                <input
                  type="email"
                  id="footer-subscribe-email"
                  placeholder="Your email"
                  className={`form-input footer-email-input${status === 'error' ? ' input-error' : ''}`}
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (status === 'error') { setStatus('idle'); setErrorMsg('') }
                  }}
                  onKeyDown={handleKeyDown}
                  disabled={status === 'loading'}
                  aria-label="Newsletter email"
                />
                <button
                  id="footer-subscribe-btn"
                  className="btn-primary footer-sub-btn"
                  onClick={handleSubscribe}
                  disabled={status === 'loading'}
                  aria-label="Subscribe to newsletter"
                >
                  {status === 'loading'
                    ? <Loader size={15} className="spinner-icon" />
                    : 'Subscribe'}
                </button>
              </div>

              {/* Inline error message */}
              {status === 'error' && errorMsg && (
                <p className="footer-subscribe-error">{errorMsg}</p>
              )}
            </div>
          </div>

          <div className="footer-bottom">
            <span>© {year} HumanForce-iota.vercel.app. All rights reserved.</span>
            <div className="footer-legal">
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
              <a href="#">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Thank You Popup */}
      {showPopup && (
        <div className="subscribe-overlay" role="dialog" aria-modal="true" aria-label="Subscription successful" onClick={closePopup}>
          <div className="subscribe-popup" onClick={(e) => e.stopPropagation()}>
            <button className="popup-close-btn" onClick={closePopup} aria-label="Close popup">
              <X size={18} />
            </button>
            <div className="popup-icon-wrap">
              <CheckCircle size={48} className="popup-check-icon" />
            </div>
            <h2 className="popup-title">You're Subscribed! 🎉</h2>
            <p className="popup-body">
              Thanks for joining the <strong>HumanForce</strong> community.<br />
              Check your inbox — a welcome email is on its way!
            </p>
            <button className="btn-primary popup-cta-btn" onClick={closePopup}>
              Awesome, got it!
            </button>
          </div>
        </div>
      )}
    </>
  )
}
