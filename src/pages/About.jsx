import { Link } from 'react-router-dom'
import { Zap, Users, Globe, Heart, Target, ArrowRight } from 'lucide-react'
import './Categories.css'

const TEAM = [
  { name:'Alexandra Reed', role:'CEO & Co-Founder', bio:'Former VP at Sequoia-backed startup. 10+ years in HR tech.', initials:'AR' },
  { name:'David Kim', role:'CTO & Co-Founder', bio:'Ex-Google AI engineer. Built ML systems serving 100M+ users.', initials:'DK' },
  { name:'Priya Nair', role:'Head of Operations', bio:'Operations wizard with experience at Stripe and Uber.', initials:'PN' },
  { name:'Marcus Webb', role:'Head of Product', bio:'Product leader who built platforms serving Fortune 500 clients.', initials:'MW' },
]

const VALUES = [
  { icon:<Heart size={24}/>, title:'People First', desc:'Every decision we make starts with our people — both clients and professionals.' },
  { icon:<Target size={24}/>, title:'Excellence', desc:'We obsess over quality. Every professional on HumanForce meets our rigorous standards.' },
  { icon:<Globe size={24}/>, title:'Global Inclusion', desc:'We believe talent has no borders. Our platform serves 40+ countries.' },
  { icon:<Zap size={24}/>, title:'Intelligent Speed', desc:'AI doesn\'t replace humans — it empowers them to work smarter and faster.' },
]

export default function About() {
  return (
    <main className="page-with-navbar">
      <div className="page-hero">
        <div className="container">
          <div className="section-tag" style={{display:'inline-flex',margin:'0 auto 16px'}}>Our Story</div>
          <h1>Built for the <span style={{color:'var(--primary)'}}>future of work</span></h1>
          <p style={{fontSize:'1.05rem',color:'var(--gray-600)',maxWidth:'560px',margin:'12px auto 0'}}>HumanForce was founded in 2022 with a simple mission: make it easy for businesses to access the best human talent, supercharged by AI.</p>
        </div>
      </div>

      <section className="section container">
        <div className="about-story-grid">
          <div>
            <h2>Why we built HumanForce</h2>
            <p style={{marginTop:'16px'}}>We saw businesses struggling with traditional hiring — slow, expensive, and unreliable. At the same time, talented professionals worldwide had no easy way to connect with global opportunities.</p>
            <p style={{marginTop:'12px'}}>HumanForce bridges that gap. We use AI to make matching faster and smarter, while keeping humans at the center of every interaction. The result: businesses scale faster, professionals earn more, and work gets done beautifully.</p>
            <div style={{display:'flex',gap:'32px',marginTop:'32px',flexWrap:'wrap'}}>
              {[{ v:'2022', l:'Founded' },{ v:'40+', l:'Countries' },{ v:'12K+', l:'Professionals' },{ v:'4.9★', l:'Avg. Rating' }].map((s,i)=>(
                <div key={i}>
                  <div style={{fontSize:'1.8rem',fontWeight:900,color:'var(--primary)'}}>{s.v}</div>
                  <div style={{fontSize:'0.82rem',color:'var(--gray-500)'}}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="about-visual">
            <div className="about-gradient-card">
              <div className="about-quote">"Our goal is to make the right human connection in seconds, not weeks."</div>
              <div className="about-quote-author">— Alexandra Reed, CEO</div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <div className="section-header center">
            <h2>Our values</h2>
            <p className="section-sub">The principles that guide everything we build.</p>
          </div>
          <div className="grid-4">
            {VALUES.map((v,i) => (
              <div key={i} className="card">
                <div className="feature-icon" style={{marginBottom:'16px'}}>{v.icon}</div>
                <h3>{v.title}</h3>
                <p style={{marginTop:'8px'}}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-header center">
            <h2>Meet the team</h2>
            <p className="section-sub">The people building the future of human services.</p>
          </div>
          <div className="team-grid">
            {TEAM.map((m,i) => (
              <div key={i} className="team-card card">
                <div className="team-avatar">{m.initials}</div>
                <h3>{m.name}</h3>
                <div className="team-role">{m.role}</div>
                <p>{m.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container" style={{textAlign:'center'}}>
          <h2>Ready to join HumanForce?</h2>
          <p style={{margin:'12px auto 32px',maxWidth:'480px',fontSize:'1.05rem'}}>Whether you're a business looking for talent or a professional seeking opportunity — we've built the platform for you.</p>
          <div style={{display:'flex',gap:'16px',justifyContent:'center',flexWrap:'wrap'}}>
            <Link to="/register" className="btn-primary">Get Started <ArrowRight size={16}/></Link>
            <Link to="/contact" className="btn-outline">Talk to Us</Link>
          </div>
        </div>
      </section>
    </main>
  )
}
