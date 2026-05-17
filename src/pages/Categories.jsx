import { Link } from 'react-router-dom'
import { ArrowRight, UserCheck, Briefcase, TrendingUp, MessageSquare, ShoppingCart, Plane, PartyPopper, Wrench } from 'lucide-react'
import './Categories.css'

const CATS = [
  { icon: <UserCheck size={36}/>, label: 'Personal Assistant', desc: 'Calendar management, travel booking, email handling, and daily executive support.', count: 1240, color: '#E53935', link: '/services?cat=personal' },
  { icon: <Briefcase size={36}/>, label: 'Business Assistant', desc: 'Operations management, SOP creation, team coordination, and reporting.', count: 980, color: '#1E88E5', link: '/services?cat=business' },
  { icon: <TrendingUp size={36}/>, label: 'Marketing Support', desc: 'Content creation, SEO, social media management, and campaign execution.', count: 1540, color: '#43A047', link: '/services?cat=marketing' },
  { icon: <MessageSquare size={36}/>, label: 'Customer Support', desc: 'Live chat, email support, ticketing systems, and customer success management.', count: 890, color: '#FB8C00', link: '/services?cat=customer' },
  { icon: <ShoppingCart size={36}/>, label: 'Sales Support', desc: 'Lead generation, cold outreach, CRM management, and pipeline building.', count: 760, color: '#8E24AA', link: '/services?cat=sales' },
  { icon: <Plane size={36}/>, label: 'Travel Assistant', desc: 'Flight & hotel bookings, visa processing, and 24/7 travel support.', count: 340, color: '#00ACC1', link: '/services?cat=travel' },
  { icon: <PartyPopper size={36}/>, label: 'Event Support', desc: 'Event planning, venue coordination, vendor management, and on-site execution.', count: 420, color: '#E91E63', link: '/services?cat=event' },
  { icon: <Wrench size={36}/>, label: 'Specialized Services', desc: 'Custom professional solutions for unique business requirements.', count: 610, color: '#546E7A', link: '/services?cat=specialized' },
]

export default function Categories() {
  return (
    <main className="page-with-navbar">
      <div className="page-hero">
        <div className="container">
          <div className="section-tag" style={{display:'inline-flex',margin:'0 auto 16px'}}>All Categories</div>
          <h1>Find the right <span style={{color:'var(--primary)'}}>service category</span></h1>
          <p style={{fontSize:'1.05rem',color:'var(--gray-600)',maxWidth:'540px',margin:'12px auto 0'}}>Browse our 8 core service categories and find the perfect professional for your business needs.</p>
        </div>
      </div>

      <div className="container" style={{padding:'60px 24px 80px'}}>
        <div className="categories-page-grid">
          {CATS.map((c,i) => (
            <Link to="/services" key={i} className="cat-page-card">
              <div className="cat-page-icon" style={{background:`${c.color}15`,color:c.color}}>{c.icon}</div>
              <div className="cat-page-body">
                <div className="cat-page-count">{c.count.toLocaleString()} professionals</div>
                <h3>{c.label}</h3>
                <p>{c.desc}</p>
                <span className="cat-page-cta">Browse services <ArrowRight size={15}/></span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
