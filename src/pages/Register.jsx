import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Zap, ArrowRight, CheckCircle } from 'lucide-react'
import { api } from '../utils/api'
import './Auth.css'
import './Register.css'

const STEPS = ['Basic Info', 'Your Profile', 'All Done']

export default function Register() {
  const location = useLocation()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '',
    phone: '', password: '', company: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [alreadyRegistered, setAlreadyRegistered] = useState(null) // null | { message, existingRole }

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const next = () => setStep(s => Math.min(s + 1, STEPS.length - 1))
  const back = () => setStep(s => Math.max(s - 1, 0))

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')
    setAlreadyRegistered(null)
    setLoading(true)
    try {
      await api.register({
        role: 'customer',
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        password: form.password,
        company: form.company,
      })
      const redirectPath = location.state?.from || '/dashboard'
      navigate(redirectPath)
    } catch (err) {
      // Detect the 'already registered' case specifically
      if (err.message && err.message.toLowerCase().includes('already registered')) {
        setAlreadyRegistered({ message: err.message })
        setStep(0) // bring back to step 0 so email is visible
      } else {
        setError(err.message || 'Registration failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="auth-page">
      {/* Left Panel */}
      <div className="auth-left">
        <div className="auth-brand">
          <Link to="/" className="auth-logo"><Zap size={20} /> HumanForce</Link>
          <h2>Find world-class help in seconds</h2>
          <p>HumanForce connects you with AI-matched professionals for any task — business or personal.</p>
          <div className="auth-features">
            {[
              'Free to register',
              'AI-powered professional matching',
              'Secure & verified platform',
              'Book in under 2 minutes',
            ].map((f, i) => (
              <div key={i} className="auth-feature">
                <span className="auth-check">✓</span>{f}
              </div>
            ))}
          </div>

          {/* Provider CTA in left panel */}
          <div className="register-provider-hint">
            <span>🚀</span>
            <div>
              <p style={{ fontWeight: 700, color: 'white', marginBottom: 2, fontSize: '0.9rem' }}>
                Want to offer your services?
              </p>
              <Link to="/register/provider" className="register-provider-link">
                Apply as a Provider →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="auth-right">
        <div className="auth-box">
          <h2>Create Account</h2>
          <p className="auth-sub">
            Already have one?{' '}
            <Link to="/login" state={{ from: location.state?.from }} className="auth-link">Sign in</Link>
            {' · '}
            {/* <Link to="/register/provider" className="auth-link" style={{ color: '#8b5cf6' }}>
              Become a Provider
            </Link> */}
          </p>

          {/* Already Registered Banner */}
          {alreadyRegistered && (
            <div className="already-registered-banner">
              <div className="already-registered-icon">⚠️</div>
              <div className="already-registered-body">
                <p className="already-registered-title">Account Already Exists</p>
                <p className="already-registered-msg">{alreadyRegistered.message}</p>
                <Link
                  to="/login"
                  state={{ from: location.state?.from }}
                  className="already-registered-btn"
                >
                  Sign In to your account →
                </Link>
              </div>
            </div>
          )}

          {/* Generic Error Banner */}
          {error && (
            <div style={{
              background: 'rgba(229,57,53,0.1)', border: '1px solid rgba(229,57,53,0.3)',
              color: '#E53935', padding: '10px 14px', borderRadius: '6px',
              fontSize: '0.85rem', marginBottom: '16px', fontWeight: 500
            }}>
              {error}
            </div>
          )}

          {/* Step Indicator */}
          <div className="steps-indicator">
            {STEPS.map((s, i) => (
              <span key={s} style={{ display: 'contents' }}>
                <div className={`step-dot ${i < step ? 'done' : i === step ? 'active' : ''}`}>
                  {i < step ? '✓' : i + 1}
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`step-line ${i < step ? 'done' : ''}`} />
                )}
              </span>
            ))}
          </div>

          {/* ── Step 0: Basic Info ── */}
          {step === 0 && (
            <form onSubmit={e => { e.preventDefault(); next() }} style={{ display: 'flex', flexDirection: 'column' }}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">First Name</label>
                  <input className="form-input" value={form.firstName} onChange={e => set('firstName', e.target.value)} placeholder="John" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Last Name</label>
                  <input className="form-input" value={form.lastName} onChange={e => set('lastName', e.target.value)} placeholder="Smith" required />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input type="email" className="form-input" value={form.email} onChange={e => set('email', e.target.value)} placeholder="john@company.com" required />
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input type="tel" className="form-input" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+91 98765 43210" required />
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <input type="password" className="form-input" value={form.password} onChange={e => set('password', e.target.value)} placeholder="Min. 8 characters" required minLength={8} />
              </div>
              <button type="submit" className="btn-primary auth-btn">
                Continue <ArrowRight size={16} />
              </button>
            </form>
          )}

          {/* ── Step 1: Profile ── */}
          {step === 1 && (
            <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column' }}>
              <div className="form-group">
                <label className="form-label">
                  Company / Organization
                  <span style={{ color: 'var(--gray-400)', fontWeight: 400, marginLeft: 6 }}>(optional)</span>
                </label>
                <input
                  className="form-input"
                  value={form.company}
                  onChange={e => set('company', e.target.value)}
                  placeholder="Acme Corp"
                />
              </div>

              <div className="verify-note" style={{ marginTop: 8 }}>
                <CheckCircle size={16} />
                Your information is encrypted and stored securely. We never share your personal data.
              </div>

              <div className="step-nav">
                <button type="button" onClick={back} className="btn-outline">← Back</button>
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? 'Creating Account…' : <>Complete Registration <ArrowRight size={16} /></>}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </main>
  )
}
