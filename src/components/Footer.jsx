import { Link } from 'react-router-dom'
import { Zap, Mail, Phone, MapPin } from 'lucide-react'
import './Footer.css'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
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
              ].map(([label, href]) => (
                <li key={href}><Link to={href}>{label}</Link></li>
              ))}
            </ul>
          </div>

          <div className="footer-col">
            <h4>Contact</h4>
            <ul className="footer-contact-list">
              <li><Mail size={15} /><a href="mailto:hello@humanforce.ai">hello@humanforce.ai</a></li>
              <li><Phone size={15} /><a href="tel:+18001234567">+1 (800) 123-4567</a></li>
              <li><MapPin size={15} /><span>San Francisco, CA 94102</span></li>
            </ul>
            <div className="footer-newsletter">
              <input type="email" placeholder="Your email" className="form-input footer-email-input" />
              <button className="btn-primary footer-sub-btn">Subscribe</button>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {year} HumanForce. All rights reserved.</span>
          <div className="footer-legal">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
