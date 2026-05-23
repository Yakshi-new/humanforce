import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  Zap, ArrowRight, CheckCircle,
  Briefcase, DollarSign, Users, Clock, Award, Loader
} from 'lucide-react'
import { api } from '../utils/api'
import './Auth.css'
import './Register.css'
import './ProviderRegister.css'

const STEPS = ['Basic Info', 'Choose Services', 'Verification']

const PERKS = [
  { icon: <DollarSign size={20} />, title: 'Earn on Your Terms', desc: 'Set your own rates and work schedule' },
  { icon: <Users size={20} />, title: 'Premium Clients', desc: 'Access verified businesses seeking top talent' },
  { icon: <Clock size={20} />, title: 'Flexible Hours', desc: 'Work from anywhere, anytime you want' },
  { icon: <Award size={20} />, title: 'Get Recognized', desc: 'Build your reputation with verified reviews' },
]

// Category → emoji mapping for service cards
const CATEGORY_EMOJI = {
  Entertainment: '🎬', Lifestyle: '☕', Adventure: '🏕️',
  Care: '❤️', Professional: '💼', Nightlife: '🌙',
}

export default function ProviderRegister() {
  const location = useLocation()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '', password: '',
    skills: [], idType: ''
  })
  const [services, setServices] = useState([])       // loaded from API
  const [servicesLoading, setServicesLoading] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [alreadyRegistered, setAlreadyRegistered] = useState(null)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const next = () => setStep(s => Math.min(s + 1, STEPS.length - 1))
  const back = () => setStep(s => Math.max(s - 1, 0))

  // Load services when moving to step 1
  useEffect(() => {
    if (step === 1 && services.length === 0) {
      setServicesLoading(true)
      api.getServices()
        .then(data => setServices(data))
        .catch(() => setServices([]))
        .finally(() => setServicesLoading(false))
    }
  }, [step])

  const toggleService = (name) => {
    set('skills', form.skills.includes(name)
      ? form.skills.filter(s => s !== name)
      : [...form.skills, name]
    )
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')
    setAlreadyRegistered(null)
    setLoading(true)
    try {
      await api.register({
        role: 'provider',
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        password: form.password,
        skills: form.skills,       // service names stored as skills
        idType: form.idType,
      })
      navigate('/provider')
    } catch (err) {
      if (err.message && err.message.toLowerCase().includes('already registered')) {
        setAlreadyRegistered({ message: err.message })
        setStep(0)
      } else {
        setError(err.message || 'Registration failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="auth-page provider-reg-page">
      {/* Left Panel */}
      <div className="auth-left provider-reg-left">
        <div className="auth-brand">
          <Link to="/" className="auth-logo">
            <Zap size={20} /> HumanForce
          </Link>
          <div className="provider-reg-badge">
            <Briefcase size={14} />
            <span>Provider Application</span>
          </div>
          <h2>Turn your skills into a thriving business</h2>
          <p>Join thousands of professionals earning on HumanForce — the AI-powered marketplace connecting talent with opportunity.</p>

          <div className="provider-perks">
            {PERKS.map((p, i) => (
              <div key={i} className="provider-perk">
                <div className="perk-icon">{p.icon}</div>
                <div>
                  <p className="perk-title">{p.title}</p>
                  <p className="perk-desc">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="provider-stats">
            {[['10K+', 'Active Clients'], ['₹850', 'Avg. Hourly Rate'], ['4.9★', 'Avg. Rating']].map(([val, lbl]) => (
              <div key={lbl} className="pstat">
                <span className="pstat-val">{val}</span>
                <span className="pstat-lbl">{lbl}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="auth-right">
        <div className="auth-box">
          <div className="provider-reg-header">
            <h2>Become a Provider</h2>
            <p className="auth-sub">
              Already registered? <Link to="/login" className="auth-link">Sign in here</Link>
              {' · '}
              <Link to="/register" className="auth-link">Register as Customer</Link>
            </p>
          </div>

          {/* Already Registered Banner */}
          {alreadyRegistered && (
            <div className="already-registered-banner">
              <div className="already-registered-icon">⚠️</div>
              <div className="already-registered-body">
                <p className="already-registered-title">Account Already Exists</p>
                <p className="already-registered-msg">{alreadyRegistered.message}</p>
                <Link to="/login" state={{ from: location.state?.from }} className="already-registered-btn">
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

          {/* Steps Indicator */}
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
          <p className="provider-step-label">{STEPS[step]}</p>

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
                <input type="email" className="form-input" value={form.email} onChange={e => set('email', e.target.value)} placeholder="john@example.com" required />
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input type="tel" className="form-input" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+91 98765 43210" required />
              </div>
              <div className="form-group">
                <label className="form-label">Create Password</label>
                <input type="password" className="form-input" value={form.password} onChange={e => set('password', e.target.value)} placeholder="Min. 8 characters" required minLength={8} />
              </div>
              <button type="submit" className="btn-primary auth-btn">
                Next: Choose Services <ArrowRight size={16} />
              </button>
            </form>
          )}

          {/* ── Step 1: Choose Services ── */}
          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Services you can offer</span>
                  <span className="skills-count">{form.skills.length} selected</span>
                </label>
                <p className="skills-hint">Pick all the services you're comfortable providing — minimum 1 required</p>
              </div>

              {servicesLoading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
                  <Loader size={28} className="spinner-icon" style={{ color: 'var(--primary)' }} />
                </div>
              ) : (
                <div className="provider-service-grid">
                  {services.map(svc => {
                    const picked = form.skills.includes(svc.name)
                    return (
                      <button
                        key={svc._id}
                        type="button"
                        className={`provider-service-card ${picked ? 'picked' : ''}`}
                        onClick={() => toggleService(svc.name)}
                        style={{ '--svc-color': svc.color }}
                      >
                        <span className="svc-emoji">
                          {CATEGORY_EMOJI[svc.category] || '⚡'}
                        </span>
                        <span className="svc-name">{svc.name}</span>
                        <span className="svc-cat">{svc.category}</span>
                        {picked && (
                          <span className="svc-check">
                            <CheckCircle size={14} />
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>
              )}

              {form.skills.length === 0 && !servicesLoading && (
                <p style={{ color: '#f43f5e', fontSize: '0.8rem', marginTop: 8 }}>
                  Please select at least one service
                </p>
              )}

              <div className="step-nav" style={{ marginTop: 20 }}>
                <button type="button" onClick={back} className="btn-outline">← Back</button>
                <button
                  type="button"
                  onClick={() => { if (form.skills.length > 0) next() }}
                  className="btn-primary"
                  style={{ opacity: form.skills.length === 0 ? 0.5 : 1 }}
                  disabled={form.skills.length === 0}
                >
                  Next: Verify ID <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* ── Step 2: Verification ── */}
          {step === 2 && (
            <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column' }}>
              <div className="provider-verify-intro">
                <div className="verify-icon-wrap">
                  <Award size={28} />
                </div>
                <p>We verify all providers to maintain platform trust. Your documents are encrypted and never shared.</p>
              </div>

              <div className="form-group">
                <label className="form-label">ID Type</label>
                <select className="form-input" value={form.idType} onChange={e => set('idType', e.target.value)} required>
                  <option value="">Select ID type</option>
                  <option>Driver's License</option>
                  <option>Aadhaar Card</option>
                  <option>PAN Card</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Upload ID Document</label>
                <div className="upload-zone">
                  <span>📎</span>
                  <p>Drag &amp; drop or <span className="auth-link">browse files</span></p>
                  <p style={{ fontSize: '0.78rem', color: 'var(--gray-400)' }}>PNG, JPG, PDF — max 5 MB</p>
                  <input type="file" style={{ display: 'none' }} />
                </div>
              </div>

              {/* Agreement */}
              <div className="provider-agreement">
                <CheckCircle size={14} style={{ color: 'var(--success)', flexShrink: 0, marginTop: 2 }} />
                <span>
                  By registering, you agree to our{' '}
                  <a href="#" className="auth-link">Terms of Service</a> and{' '}
                  <a href="#" className="auth-link">Provider Guidelines</a>.
                </span>
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
