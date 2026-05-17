import { Link } from 'react-router-dom'
import { CheckCircle, ArrowRight, Zap, Shield, Star } from 'lucide-react'
import './Categories.css'

const PLANS = [
  {
    name: 'Starter', price: 29, unit: '/hr', desc: 'Perfect for individuals and small projects',
    features: ['1 Professional', 'Basic AI matching', 'Email support', 'Standard SLA (48hr)', 'No monthly commitment'],
    notIncluded: ['Dedicated account manager', 'Priority matching', 'Analytics dashboard'],
    cta: 'Get Started', href: '/register', popular: false
  },
  {
    name: 'Business', price: 499, unit: '/mo', desc: 'For growing businesses needing consistent support',
    features: ['Up to 5 Professionals', 'AI-powered matching', '24/7 Priority support', 'Analytics dashboard', 'Dedicated account manager', 'Custom onboarding', 'Escrow payments'],
    notIncluded: ['API access', 'White-label options'],
    cta: 'Start Free Trial', href: '/register', popular: true
  },
  {
    name: 'Enterprise', price: null, unit: 'custom', desc: 'Custom solutions for large-scale operations',
    features: ['Unlimited professionals', 'Custom AI workflows', 'SLA guarantees', 'API access', 'White-label options', 'Dedicated team', 'Custom reporting', 'Compliance support'],
    notIncluded: [],
    cta: 'Contact Sales', href: '/contact', popular: false
  }
]

const ADDONS = [
  { label: 'Additional Professional', price: '+$29/hr' },
  { label: 'Priority Matching', price: '+$49/mo' },
  { label: 'Advanced Analytics', price: '+$79/mo' },
  { label: 'White-label Branding', price: 'Enterprise' },
]

export default function Pricing() {
  return (
    <main className="page-with-navbar">
      <div className="page-hero">
        <div className="container">
          <div className="section-tag" style={{display:'inline-flex',margin:'0 auto 16px'}}><Zap size={14}/> Pricing</div>
          <h1>Simple, <span style={{color:'var(--primary)'}}>transparent</span> pricing</h1>
          <p style={{fontSize:'1.05rem',color:'var(--gray-600)',maxWidth:'520px',margin:'12px auto 0'}}>No hidden fees. No long-term contracts. Scale up or down anytime.</p>
        </div>
      </div>

      <div className="container" style={{padding:'60px 24px 80px'}}>
        <div className="pricing-grid-full">
          {PLANS.map((p, i) => (
            <div key={i} className={`price-card-full ${p.popular?'price-card-popular':''}`}>
              {p.popular && <div className="popular-ribbon">Most Popular ★</div>}
              <div className="pcf-header">
                <div className="pcf-name">{p.name}</div>
                <div className="pcf-price">
                  {p.price ? <><span className="pcf-currency">$</span><span className="pcf-amount">{p.price}</span><span className="pcf-unit">{p.unit}</span></>: <span className="pcf-amount" style={{fontSize:'2rem'}}>Custom</span>}
                </div>
                <p className="pcf-desc">{p.desc}</p>
              </div>
              <div className="pcf-features">
                {p.features.map((f,j) => <div key={j} className="pcf-feature included"><CheckCircle size={16}/>{f}</div>)}
                {p.notIncluded.map((f,j) => <div key={j} className="pcf-feature not-included"><span style={{width:16,height:16,display:'inline-block',textAlign:'center',lineHeight:'16px',color:'var(--gray-400)'}}>—</span>{f}</div>)}
              </div>
              <Link to={p.href} className={p.popular?'btn-primary':'btn-outline'} style={{justifyContent:'center',marginTop:'24px'}}>
                {p.cta} <ArrowRight size={16}/>
              </Link>
            </div>
          ))}
        </div>

        <div className="addons-section">
          <h3 style={{marginBottom:'20px'}}>Available Add-ons</h3>
          <div className="addons-grid">
            {ADDONS.map((a,i) => (
              <div key={i} className="addon-card">
                <span>{a.label}</span>
                <span className="addon-price">{a.price}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="pricing-guarantees">
          {[
            { icon:<Shield size={24}/>, title:'Satisfaction Guarantee', desc:'Not happy with your professional? We replace them free of charge.' },
            { icon:<Star size={24}/>, title:'7-Day Free Trial', desc:'Try Business plan risk-free for 7 days. No credit card required.' },
            { icon:<Zap size={24}/>, title:'Cancel Anytime', desc:'No lock-in contracts. Cancel or downgrade anytime with no penalties.' },
          ].map((g,i) => (
            <div key={i} className="guarantee-block">
              <div className="guarantee-icon">{g.icon}</div>
              <h4>{g.title}</h4>
              <p>{g.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
