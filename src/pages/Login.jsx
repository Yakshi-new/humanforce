import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, Lock, Phone, Eye, EyeOff, Zap, ArrowRight } from 'lucide-react'
import './Auth.css'

export default function Login() {
  const [tab, setTab] = useState('email')
  const [showPass, setShowPass] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [forgot, setForgot] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleEmail = e => { e.preventDefault(); setSubmitted(true) }
  const handleOTP = e => {
    e.preventDefault()
    if (!otpSent) { setOtpSent(true) } else { setSubmitted(true) }
  }

  return (
    <main className="auth-page">
      <div className="auth-left">
        <div className="auth-brand">
          <Link to="/" className="auth-logo"><Zap size={20} /> HumanForce</Link>
          <h2>Welcome back to the future of work</h2>
          <p>Access your dashboard, manage bookings, and collaborate with your team — all in one place.</p>
          <div className="auth-features">
            {['10,000+ verified professionals', 'AI-powered matching engine', 'Real-time collaboration tools', 'Secure escrow payments'].map((f,i) => (
              <div key={i} className="auth-feature"><span className="auth-check">✓</span>{f}</div>
            ))}
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-box">
          {submitted ? (
            <div className="auth-success">
              <div className="auth-success-icon">✓</div>
              <h3>Logged in successfully!</h3>
              <p>Redirecting to your dashboard...</p>
              <Link to="/dashboard" className="btn-primary" style={{marginTop:'20px',justifyContent:'center'}}>
                Go to Dashboard <ArrowRight size={16}/>
              </Link>
            </div>
          ) : forgot ? (
            <>
              <h2>Reset Password</h2>
              <p className="auth-sub">Enter your email to receive a reset link.</p>
              <form onSubmit={e=>{e.preventDefault();setForgot(false)}} className="auth-form">
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <div className="input-wrap"><Mail size={18} className="input-icon"/><input type="email" className="form-input input-padded" placeholder="you@company.com" required /></div>
                </div>
                <button type="submit" className="btn-primary auth-btn">Send Reset Link <ArrowRight size={16}/></button>
                <button type="button" onClick={()=>setForgot(false)} className="btn-ghost" style={{marginTop:'8px',justifyContent:'center',width:'100%'}}>← Back to Login</button>
              </form>
            </>
          ) : (
            <>
              <h2>Sign In</h2>
              <p className="auth-sub">New here? <Link to="/register" className="auth-link">Create an account</Link></p>
              <div className="auth-tabs">
                <button className={`auth-tab ${tab==='email'?'active':''}`} onClick={()=>setTab('email')}>Email</button>
                <button className={`auth-tab ${tab==='otp'?'active':''}`} onClick={()=>setTab('otp')}>Mobile OTP</button>
              </div>

              {tab === 'email' ? (
                <form onSubmit={handleEmail} className="auth-form">
                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <div className="input-wrap"><Mail size={18} className="input-icon"/>
                      <input type="email" value={email} onChange={e=>setEmail(e.target.value)} className="form-input input-padded" placeholder="you@company.com" required />
                    </div>
                  </div>
                  <div className="form-group">
                    <div className="label-row">
                      <label className="form-label">Password</label>
                      <button type="button" onClick={()=>setForgot(true)} className="forgot-link">Forgot password?</button>
                    </div>
                    <div className="input-wrap">
                      <Lock size={18} className="input-icon"/>
                      <input type={showPass?'text':'password'} value={password} onChange={e=>setPassword(e.target.value)} className="form-input input-padded input-padded-right" placeholder="••••••••" required />
                      <button type="button" onClick={()=>setShowPass(!showPass)} className="eye-btn">{showPass?<EyeOff size={16}/>:<Eye size={16}/>}</button>
                    </div>
                  </div>
                  <button type="submit" className="btn-primary auth-btn">Sign In <ArrowRight size={16}/></button>
                </form>
              ) : (
                <form onSubmit={handleOTP} className="auth-form">
                  <div className="form-group">
                    <label className="form-label">Mobile Number</label>
                    <div className="input-wrap"><Phone size={18} className="input-icon"/>
                      <input type="tel" value={phone} onChange={e=>setPhone(e.target.value)} className="form-input input-padded" placeholder="+1 (555) 000-0000" required disabled={otpSent}/>
                    </div>
                  </div>
                  {otpSent && (
                    <div className="form-group">
                      <label className="form-label">Enter OTP</label>
                      <input type="text" value={otp} onChange={e=>setOtp(e.target.value)} className="form-input otp-input" placeholder="• • • • • •" maxLength={6} required/>
                      <span className="otp-hint">OTP sent to {phone}</span>
                    </div>
                  )}
                  <button type="submit" className="btn-primary auth-btn">{otpSent?'Verify OTP':'Send OTP'} <ArrowRight size={16}/></button>
                </form>
              )}

              <div className="auth-divider"><span>or continue with</span></div>
              <button className="google-btn">
                <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                Continue with Google
              </button>
            </>
          )}
        </div>
      </div>
    </main>
  )
}
