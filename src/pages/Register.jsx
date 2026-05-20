import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Zap, ArrowRight, User, Briefcase, CheckCircle } from 'lucide-react'
import { api } from '../utils/api'
import './Auth.css'
import './Register.css'

const STEPS = ['Role', 'Basic Info', 'Profile', 'Verification', 'Complete']

export default function Register() {
  const location = useLocation()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [role, setRole] = useState('')
  const [form, setForm] = useState({ firstName:'', lastName:'', email:'', phone:'', password:'', company:'', bio:'', skills:[], idType:'', linkedin:'' })
  const [error, setError] = useState('')

  const set = (k,v) => setForm(f => ({...f, [k]:v}))
  const next = () => setStep(s => Math.min(s+1, STEPS.length-1))
  const back = () => setStep(s => Math.max(s-1, 0))

  const SKILLS_LIST = ['Calendar Management','Email Handling','Social Media','SEO','Content Writing','Customer Support','Data Entry','Lead Generation','Travel Planning','Event Coordination']

  const toggleSkill = sk => {
    const arr = form.skills.includes(sk) ? form.skills.filter(s=>s!==sk) : [...form.skills, sk]
    set('skills', arr)
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const payload = {
        role,
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        password: form.password,
        company: form.company,
        bio: form.bio,
        skills: form.skills,
        idType: form.idType
      }
      const data = await api.register(payload)
      const redirectPath = location.state?.from || (role === 'provider' ? '/provider' : '/dashboard')
      navigate(redirectPath)
    } catch (err) {
      setError(err.message || 'Registration failed')
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-left">
        <div className="auth-brand">
          <Link to="/" className="auth-logo"><Zap size={20}/> HumanForce</Link>
          <h2>Join the future of intelligent work</h2>
          <p>Whether you need help or want to offer services — HumanForce connects you with the right people powered by AI.</p>
          <div className="auth-features">
            {['Free to register','AI-powered matching','Secure & verified platform','Start in minutes'].map((f,i)=>(
              <div key={i} className="auth-feature"><span className="auth-check">✓</span>{f}</div>
            ))}
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-box">
          <h2>Create Account</h2>
          <p className="auth-sub">Already have one? <Link to="/login" state={{ from: location.state?.from }} className="auth-link">Sign in</Link></p>

          {error && (
            <div className="auth-error-banner" style={{
              background: 'rgba(229,57,53,0.1)',
              border: '1px solid rgba(229,57,53,0.3)',
              color: '#E53935',
              padding: '10px 14px',
              borderRadius: '6px',
              fontSize: '0.85rem',
              marginBottom: '16px',
              fontWeight: 500
            }}>
              {error}
            </div>
          )}

          {/* Steps Indicator */}
          <div className="steps-indicator">
            {STEPS.map((s, i) => (
              <>
                <div key={s} className={`step-dot ${i < step ? 'done' : i===step ? 'active' : ''}`}>
                  {i < step ? '✓' : i+1}
                </div>
                {i < STEPS.length-1 && <div key={`line-${i}`} className={`step-line ${i < step ? 'done':''}`}/>}
              </>
            ))}
          </div>

          {/* Step 0: Role */}
          {step === 0 && (
            <>
              <p style={{marginBottom:'16px', fontSize:'0.95rem', color:'var(--gray-700)', fontWeight:'600'}}>I want to...</p>
              <div className="role-cards">
                <div className={`role-card ${role==='customer'?'selected':''}`} onClick={()=>setRole('customer')}>
                  <div className="role-card-icon">👤</div>
                  <h4>Hire a Professional</h4>
                  <p>I need skilled assistance for my business or personal tasks</p>
                </div>
                <div className={`role-card ${role==='provider'?'selected':''}`} onClick={()=>setRole('provider')}>
                  <div className="role-card-icon">💼</div>
                  <h4>Offer Services</h4>
                  <p>I want to provide my skills and earn on the platform</p>
                </div>
              </div>
              <button className="btn-primary auth-btn" onClick={next} disabled={!role} style={{opacity:role?1:0.5}}>
                Continue <ArrowRight size={16}/>
              </button>
            </>
          )}

          {/* Step 1: Basic Info */}
          {step === 1 && (
            <form onSubmit={e=>{e.preventDefault();next()}} style={{display:'flex',flexDirection:'column',gap:'0'}}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">First Name</label>
                  <input className="form-input" value={form.firstName} onChange={e=>set('firstName',e.target.value)} placeholder="John" required/>
                </div>
                <div className="form-group">
                  <label className="form-label">Last Name</label>
                  <input className="form-input" value={form.lastName} onChange={e=>set('lastName',e.target.value)} placeholder="Smith" required/>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input type="email" className="form-input" value={form.email} onChange={e=>set('email',e.target.value)} placeholder="john@company.com" required/>
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input type="tel" className="form-input" value={form.phone} onChange={e=>set('phone',e.target.value)} placeholder="+1 (555) 000-0000" required/>
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <input type="password" className="form-input" value={form.password} onChange={e=>set('password',e.target.value)} placeholder="Min. 8 characters" required minLength={8}/>
              </div>
              <div className="step-nav">
                <button type="button" onClick={back} className="btn-outline">← Back</button>
                <button type="submit" className="btn-primary">Next Step <ArrowRight size={16}/></button>
              </div>
            </form>
          )}

          {/* Step 2: Profile */}
          {step === 2 && (
            <form onSubmit={e=>{e.preventDefault();next()}} style={{display:'flex',flexDirection:'column'}}>
              {role === 'customer' ? (
                <div className="form-group">
                  <label className="form-label">Company / Organization</label>
                  <input className="form-input" value={form.company} onChange={e=>set('company',e.target.value)} placeholder="Acme Corp (optional)"/>
                </div>
              ) : (
                <>
                  <div className="form-group">
                    <label className="form-label">Professional Bio</label>
                    <textarea className="form-input" value={form.bio} onChange={e=>set('bio',e.target.value)} rows={4} placeholder="Describe your experience and expertise..." style={{resize:'vertical'}}/>
                  </div>
                  <div className="form-group">
                    <label className="form-label">LinkedIn Profile (optional)</label>
                    <input className="form-input" value={form.linkedin} onChange={e=>set('linkedin',e.target.value)} placeholder="https://linkedin.com/in/yourname"/>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Your Skills</label>
                    <div className="skills-picker">
                      {SKILLS_LIST.map(sk => (
                        <button key={sk} type="button" className={`skill-pick-btn ${form.skills.includes(sk)?'picked':''}`} onClick={()=>toggleSkill(sk)}>{sk}</button>
                      ))}
                    </div>
                  </div>
                </>
              )}
              <div className="step-nav">
                <button type="button" onClick={back} className="btn-outline">← Back</button>
                <button type="submit" className="btn-primary">Next Step <ArrowRight size={16}/></button>
              </div>
            </form>
          )}

          {/* Step 3: Verification */}
          {step === 3 && (
            <form onSubmit={handleRegister} style={{display:'flex',flexDirection:'column'}}>
              <div className="form-group">
                <label className="form-label">ID Type</label>
                <select className="form-input" value={form.idType} onChange={e=>set('idType',e.target.value)} required>
                  <option value="">Select ID type</option>
                  <option>Passport</option>
                  <option>Driver's License</option>
                  <option>National ID Card</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Upload ID Document</label>
                <div className="upload-zone">
                  <span>📎</span>
                  <p>Drag & drop or <span className="auth-link">browse</span></p>
                  <p style={{fontSize:'0.78rem',color:'var(--gray-400)'}}>PNG, JPG, PDF — max 5MB</p>
                  <input type="file" style={{display:'none'}}/>
                </div>
              </div>
              <div className="verify-note">
                <CheckCircle size={16}/> Your documents are encrypted and stored securely. We never share your personal data.
              </div>
              <div className="step-nav">
                <button type="button" onClick={back} className="btn-outline">← Back</button>
                <button type="submit" className="btn-primary">Complete Registration <ArrowRight size={16}/></button>
              </div>
            </form>
          )}

          {/* Step 4: Done */}
          {step === 4 && (
            <div className="auth-success">
              <div className="auth-success-icon">🎉</div>
              <h3>Welcome to HumanForce!</h3>
              <p>Your account has been created. {role === 'provider' ? 'Your profile is under review — you\'ll be notified within 24 hours.' : 'Start exploring services right away.'}</p>
              <Link to={role==='provider'?'/provider':'/dashboard'} className="btn-primary" style={{marginTop:'20px',justifyContent:'center'}}>
                Go to Dashboard <ArrowRight size={16}/>
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
