import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight, Play, Shield, Zap, Star, Users, Clock, TrendingUp,
  CheckCircle, ChevronDown, ChevronUp, Bot, BarChart2, MessageSquare,
  CreditCard, Brain, Calendar, UserCheck, Globe, Briefcase, HeartHandshake,
  ShoppingCart, Plane, PartyPopper, Wrench, Film, Heart, ChefHat, Laugh, Coffee,
  GraduationCap, Music, Utensils, Palette, Trophy, Dumbbell, Home as HomeIcon, TreePine
} from 'lucide-react'
import './Home.css'

// --- Stats Counter ---
function Counter({ end, suffix = '' }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        let start = 0
        const step = end / 60
        const t = setInterval(() => {
          start += step
          if (start >= end) { setCount(end); clearInterval(t) }
          else setCount(Math.floor(start))
        }, 25)
      }
    }, { threshold: 0.5 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [end])
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>
}

// --- FAQ Item ---
function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={`faq-item ${open ? 'faq-open' : ''}`} onClick={() => setOpen(!open)}>
      <div className="faq-question">
        <span>{q}</span>
        {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </div>
      {open && <div className="faq-answer">{a}</div>}
    </div>
  )
}

const CATEGORIES = [
  { icon: <Film size={28} />, label: 'Movies', desc: 'Watch films & cinemas together', color: '#E53935' },
  { icon: <Plane size={28} />, label: 'Travel', desc: 'Road trips, treks & city tours', color: '#1E88E5' },
  { icon: <Heart size={28} />, label: 'Elder Care', desc: 'Compassionate senior companionship', color: '#E91E63' },
  { icon: <Briefcase size={28} />, label: 'Business Events', desc: 'Corporate events & networking', color: '#37474F' },
  { icon: <ChefHat size={28} />, label: 'Baking/Cooking', desc: 'Cook & explore recipes together', color: '#F4511E' },
  { icon: <Trophy size={28} />, label: 'Sporting Events', desc: 'Live matches & sports events', color: '#F9A825' },
  { icon: <GraduationCap size={28} />, label: 'Tutoring', desc: 'Academics, skills & languages', color: '#1976D2' },
  { icon: <PartyPopper size={28} />, label: 'Parties', desc: 'Birthday, celebrations & events', color: '#E91E63' },
]

const FEATURES = [
  { icon: <Shield size={24} />, title: 'Verified Professionals', desc: 'Every professional undergoes background checks, skills testing, and ID verification before joining.' },
  { icon: <Zap size={24} />, title: 'Fast Matching', desc: 'Our AI engine matches you with the perfect professional in under 60 seconds.' },
  { icon: <Brain size={24} />, title: 'AI Recommendations', desc: 'Smart suggestions based on your business needs, history, and performance data.' },
  { icon: <MessageSquare size={24} />, title: 'Real-Time Chat', desc: 'Built-in messaging with file sharing, voice notes, and video calls.' },
  { icon: <CreditCard size={24} />, title: 'Secure Payments', desc: 'Escrow-protected payments with automatic invoicing and multi-currency support.' },
  { icon: <BarChart2 size={24} />, title: 'Analytics Dashboard', desc: 'Track performance, spending, and productivity across all your hired professionals.' },
]

const TESTIMONIALS = [
  { name: 'Sarah Mitchell', role: 'CEO, TechVault Inc.', text: 'HumanForce transformed how we handle operations. We scaled our support team 3x in two weeks without any hiring headaches.', rating: 5, avatar: 'SM' },
  { name: 'James Okonkwo', role: 'Founder, GrowthLab', text: 'The AI matching is genuinely impressive. First match was perfect. We\'ve been working with the same VA for 8 months now.', rating: 5, avatar: 'JO' },
  { name: 'Priya Sharma', role: 'COO, NexaRetail', text: 'Saved us 40+ hours per month on admin tasks. The quality of professionals on this platform is unmatched.', rating: 5, avatar: 'PS' },
]

const FAQS = [
  { q: 'How does the matching process work?', a: 'Our AI analyzes your requirements, budget, timezone, and past preferences to instantly match you with the most compatible professionals from our verified network.' },
  { q: 'Can I replace a professional if I\'m not satisfied?', a: 'Absolutely. We offer unlimited replacements with no extra cost. Your satisfaction is guaranteed.' },
  { q: 'What are the payment terms?', a: 'We operate on weekly billing cycles with escrow protection. You only release payment when you\'re satisfied with the work.' },
  { q: 'Is there a minimum commitment?', a: 'No long-term contracts required. Start with as little as one hour and scale up or down anytime.' },
  { q: 'Do professionals work in my timezone?', a: 'Yes! You can filter by timezone and availability. We have professionals across 40+ countries covering all major timezones.' },
]


const COMPANIES = ['Accenture', 'Shopify', 'Stripe', 'Notion', 'Figma', 'Webflow', 'HubSpot', 'Slack']

export default function Home() {
  return (
    <main className="home">
      {/* HERO */}
      <section className="hero">
        <div className="hero-bg-shapes">
          <div className="shape shape-1" />
          <div className="shape shape-2" />
          <div className="shape shape-3" />
        </div>
        <div className="container hero-container">
          <div className="hero-content">
            <div className="hero-badge">
              <Bot size={14} /> &nbsp; Powered by Advanced AI Matching
            </div>
            <h1 className="hero-headline">
              Book a Buddy for<br />
              <span className="text-red">Any Occasion</span>
            </h1>
            <p className="hero-sub">
              Movies, Travel, Elder Care, Parties & 16 more services — starting at just ₹1000/hr. Verified, friendly companions ready to join you anytime.
            </p>
            <div className="hero-ctas">
              <Link to="/register" className="btn-primary hero-btn">
                Get Started Free <ArrowRight size={18} />
              </Link>
              <Link to="/contact" className="btn-outline">
                <Play size={16} /> Book a Demo
              </Link>
            </div>
            <div className="hero-trust">
              <div className="trust-avatars">
                {['A','B','C','D'].map(l => <div key={l} className="trust-avatar">{l}</div>)}
              </div>
              <div>
                <div className="stars">{'★★★★★'}</div>
                <p className="trust-text"><strong>4.9/5</strong> from 2,000+ reviews</p>
              </div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="dashboard-card animate-float">
              <div className="dash-header">
                <span className="dash-dot red"/><span className="dash-dot yellow"/><span className="dash-dot green"/>
                <span className="dash-title">HumanForce Dashboard</span>
              </div>
              <div className="dash-stats">
                <div className="dash-stat"><span className="ds-value">47</span><span className="ds-label">Active</span></div>
                <div className="dash-stat"><span className="ds-value">98%</span><span className="ds-label">Satisfied</span></div>
                <div className="dash-stat"><span className="ds-value">$12k</span><span className="ds-label">Saved</span></div>
              </div>
              <div className="dash-activity">
                {['Ana K. — Personal Assistant','Marcus R. — Sales Support','Lily T. — Marketing'].map((n,i) => (
                  <div key={i} className="dash-row">
                    <div className="dash-avatar">{n[0]}</div>
                    <span>{n}</span>
                    <span className="dash-status">Active</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="float-badge fb-1"><CheckCircle size={16} className="text-green"/> Verified Pro</div>
            <div className="float-badge fb-2"><Zap size={16} className="text-red"/> Matched in 43s</div>
            <div className="float-badge fb-3"><Star size={16} className="text-yellow"/> 4.9 Rating</div>
          </div>
        </div>
        <div className="hero-stats">
          <div className="container">
            <div className="stats-grid">
              {[
                { label: 'Verified Buddies', value: 12000, suffix: '+' },
                { label: 'Happy Users', value: 50000, suffix: '+' },
                { label: 'Hours Booked', value: 250000, suffix: '+' },
                { label: 'Cities', value: 40, suffix: '+' },
              ].map(s => (
                <div key={s.label} className="stat-item">
                  <div className="stat-value"><Counter end={s.value} suffix={s.suffix} /></div>
                  <div className="stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TRUSTED COMPANIES */}
      <section className="section trusted-section">
        <div className="container">
          <p className="trusted-label">Trusted by teams at leading companies</p>
          <div className="companies-strip">
            {COMPANIES.map(c => (
              <div key={c} className="company-logo">{c}</div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section section-alt how-section">
        <div className="container">
          <div className="section-header center">
            <div className="section-tag"><Zap size={14} /> How It Works</div>
            <h2 className="section-title">Start working in 4 simple steps</h2>
            <p className="section-sub">From requirement to ready-to-work professional in minutes, not weeks.</p>
          </div>
          <div className="steps-grid">
            {[
              { n: '01', title: 'Select a Service', desc: 'Browse categories or describe your need. Our AI understands natural language.' },
              { n: '02', title: 'Customize Requirements', desc: 'Set hours, budget, timezone, skills, and communication preferences.' },
              { n: '03', title: 'Get Instant Match', desc: 'Our AI presents top-matched professionals. Review profiles and pick yours.' },
              { n: '04', title: 'Start Working', desc: 'Onboard in minutes. Real-time collaboration tools included from day one.' },
            ].map((s, i) => (
              <div key={i} className="step-card">
                <div className="step-number">{s.n}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
                {i < 3 && <div className="step-arrow"><ArrowRight size={20} /></div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="section categories-section">
        <div className="container">
          <div className="section-header center">
            <div className="section-tag"><Globe size={14} /> 20 Services</div>
            <h2 className="section-title">A Buddy for Every Occasion</h2>
            <p className="section-sub">From Movies & Travel to Elder Care & Tutoring — book a verified buddy starting at ₹1000/hr.</p>
          </div>
          <div className="categories-grid">
            {CATEGORIES.map((c, i) => (
              <Link to="/services" key={i} className="cat-card">
                <div className="cat-icon" style={{ background: c.color + '18', color: c.color }}>{c.icon}</div>
                <h3>{c.label}</h3>
                <p>{c.desc}</p>
                <span className="cat-link">Explore <ArrowRight size={14} /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="section section-alt features-section">
        <div className="container">
          <div className="section-header center">
            <div className="section-tag"><Shield size={14} /> Platform Features</div>
            <h2 className="section-title">Everything you need to scale</h2>
            <p className="section-sub">Built for modern businesses that demand speed, quality, and reliability.</p>
          </div>
          <div className="features-grid">
            {FEATURES.map((f, i) => (
              <div key={i} className="feature-card">
                <div className="feature-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section testimonials-section">
        <div className="container">
          <div className="section-header center">
            <div className="section-tag"><Star size={14} /> Testimonials</div>
            <h2 className="section-title">What our clients say</h2>
            <p className="section-sub">Real results from real businesses using HumanForce every day.</p>
          </div>
          <div className="testimonials-grid">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="testi-card">
                <div className="stars">{'★'.repeat(t.rating)}</div>
                <p className="testi-text">"{t.text}"</p>
                <div className="testi-author">
                  <div className="testi-avatar">{t.avatar}</div>
                  <div>
                    <div className="testi-name">{t.name}</div>
                    <div className="testi-role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* FAQ */}
      <section className="section faq-section">
        <div className="container faq-container">
          <div className="section-header">
            <div className="section-tag"><ChevronDown size={14} /> FAQ</div>
            <h2 className="section-title">Frequently asked questions</h2>
            <p className="section-sub">Have more questions? <Link to="/contact" className="link-red">Contact us →</Link></p>
          </div>
          <div className="faq-list">
            {FAQS.map((f, i) => <FAQItem key={i} q={f.q} a={f.a} />)}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="section cta-banner">
        <div className="container">
          <div className="cta-banner-inner">
            <h2>Never Do Anything Alone Again</h2>
            <p>Join 50,000+ users who found their perfect buddy on our platform. Starting at just ₹1000/hr.</p>
            <div className="cta-banner-btns">
              <Link to="/services" className="btn-primary">Browse All Services <ArrowRight size={18} /></Link>
              <Link to="/register" className="btn-outline cta-outline">Register Free</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
