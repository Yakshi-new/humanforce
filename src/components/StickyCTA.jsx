import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { X } from 'lucide-react'
import './StickyCTA.css'

export default function StickyCTA() {
  const [visible, setVisible] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    const onScroll = () => { if (window.scrollY > 400 && !dismissed) setVisible(true) }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [dismissed])

  if (!visible || dismissed) return null

  return (
    <div className="sticky-cta">
      <div className="sticky-cta-inner">
        <p><strong>🚀 Ready to scale your business?</strong> Get matched with a professional in minutes.</p>
        <div className="sticky-cta-actions">
          <Link to="/register" className="btn-primary">Get Started Free</Link>
          <Link to="/services" className="btn-outline sticky-outline">Browse Services</Link>
        </div>
      </div>
      <button className="sticky-close" onClick={() => { setDismissed(true); setVisible(false) }}>
        <X size={16} />
      </button>
    </div>
  )
}
