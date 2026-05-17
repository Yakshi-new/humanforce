import { useState, useEffect } from 'react'
import { X, Zap } from 'lucide-react'
import { Link } from 'react-router-dom'
import './LeadCapturePopup.css'

export default function LeadCapturePopup() {
  const [visible, setVisible] = useState(false)
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    const dismissed = sessionStorage.getItem('hf_popup_dismissed')
    if (dismissed) return
    const timer = setTimeout(() => setVisible(true), 15000)
    return () => clearTimeout(timer)
  }, [])

  const dismiss = () => {
    setVisible(false)
    sessionStorage.setItem('hf_popup_dismissed', '1')
  }

  const handleSubmit = e => {
    e.preventDefault()
    if (!email) return
    setSubmitted(true)
    setTimeout(dismiss, 2000)
  }

  if (!visible) return null

  return (
    <div className="popup-overlay" onClick={e => e.target === e.currentTarget && dismiss()}>
      <div className="popup-box">
        <button className="popup-close" onClick={dismiss}><X size={18} /></button>
        <div className="popup-icon"><Zap size={28} /></div>
        {!submitted ? (
          <>
            <h3>Get 20% Off Your First Booking!</h3>
            <p>Join 10,000+ businesses using HumanForce. Enter your email to claim your exclusive discount.</p>
            <form onSubmit={handleSubmit} className="popup-form">
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="Enter your email address" className="form-input" required
              />
              <button type="submit" className="btn-primary">Claim My Discount →</button>
            </form>
            <p className="popup-disclaimer">No spam. Unsubscribe anytime.</p>
          </>
        ) : (
          <div className="popup-success">
            <div className="success-icon">✓</div>
            <h3>You're in! 🎉</h3>
            <p>Check your inbox for your exclusive 20% discount code.</p>
          </div>
        )}
      </div>
    </div>
  )
}
