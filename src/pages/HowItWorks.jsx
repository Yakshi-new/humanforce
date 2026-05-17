import { Link } from 'react-router-dom'
import { ArrowRight, Search, Settings, Zap, CheckCircle } from 'lucide-react'
import './Categories.css'

const STEPS = [
  { n:'01', icon: <Search size={32}/>, title:'Select a Service', desc:'Browse our categories or simply describe what you need in plain language. Our AI understands context and intent — no complicated forms.' },
  { n:'02', icon: <Settings size={32}/>, title:'Customize Your Requirements', desc:'Set your preferred hours, budget range, timezone, languages, and specific skills. Tell us exactly what matters to your business.' },
  { n:'03', icon: <Zap size={32}/>, title:'Get Instant AI Match', desc:'Our proprietary AI engine analyzes 50+ compatibility factors and presents your top-matched professionals within 60 seconds.' },
  { n:'04', icon: <CheckCircle size={32}/>, title:'Start Working Together', desc:'Review shortlisted profiles, connect instantly, and onboard your new professional in minutes. Real-time tools are included.' },
]

export default function HowItWorks() {
  return (
    <main className="page-with-navbar">
      <div className="page-hero">
        <div className="container">
          <div className="section-tag" style={{display:'inline-flex',margin:'0 auto 16px'}}><Zap size={14}/> How It Works</div>
          <h1>Start working in <span style={{color:'var(--primary)'}}>4 simple steps</span></h1>
          <p style={{fontSize:'1.05rem',color:'var(--gray-600)',maxWidth:'520px',margin:'12px auto 0'}}>From your first click to a fully onboarded professional — the fastest path to scaling your business.</p>
        </div>
      </div>

      <div className="container" style={{padding:'80px 24px'}}>
        <div className="hiw-steps">
          {STEPS.map((s, i) => (
            <div key={i} className="hiw-step">
              <div className="hiw-step-left">
                <div className="hiw-step-number">{s.n}</div>
                {i < STEPS.length - 1 && <div className="hiw-connector"/>}
              </div>
              <div className="hiw-step-content">
                <div className="hiw-icon">{s.icon}</div>
                <div>
                  <h3>{s.title}</h3>
                  <p style={{marginTop:'10px'}}>{s.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="hiw-cta">
          <h2>Ready to get started?</h2>
          <p>Join 4,500+ businesses that trust HumanForce to power their operations.</p>
          <div style={{display:'flex',gap:'16px',justifyContent:'center',marginTop:'28px',flexWrap:'wrap'}}>
            <Link to="/register" className="btn-primary">Get Started Free <ArrowRight size={16}/></Link>
            <Link to="/services" className="btn-outline">Browse Services</Link>
          </div>
        </div>
      </div>
    </main>
  )
}
