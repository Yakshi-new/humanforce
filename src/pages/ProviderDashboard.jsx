import { useState } from 'react'
import { Link, Routes, Route } from 'react-router-dom'
import { User, Calendar, Inbox, DollarSign, MessageSquare, Star, LogOut, Zap, TrendingUp, Clock, CheckCircle, Menu, X } from 'lucide-react'
import './Dashboard.css'
import './ProviderDashboard.css'

const NAV = [
  { icon: <User size={18}/>, label: 'My Profile', path: '/provider' },
  { icon: <Calendar size={18}/>, label: 'Bookings', path: '/provider/bookings' },
  { icon: <Inbox size={18}/>, label: 'Requests', path: '/provider/requests', badge: 4 },
  { icon: <DollarSign size={18}/>, label: 'Earnings', path: '/provider/earnings' },
  { icon: <Calendar size={18}/>, label: 'Calendar', path: '/provider/calendar' },
  { icon: <MessageSquare size={18}/>, label: 'Messages', path: '/provider/messages', badge: 2 },
  { icon: <Star size={18}/>, label: 'Reviews', path: '/provider/reviews' },
]

function ProviderHome() {
  return (
    <div className="dash-content">
      <h2 className="dash-page-title">My Profile</h2>
      <div className="provider-profile-card dash-card" style={{marginBottom:'24px'}}>
        <div className="provider-header">
          <div className="provider-big-avatar">AK</div>
          <div className="provider-info">
            <h3>Ana Kowalski</h3>
            <p className="provider-title">Executive Personal Assistant · 6 years exp.</p>
            <div className="provider-meta">
              <span><Star size={14} fill="#FFC107" color="#FFC107"/> 4.9 (214 reviews)</span>
              <span><CheckCircle size={14} style={{color:'#43A047'}}/> ID Verified</span>
              <span><Clock size={14}/> Full-time Available</span>
            </div>
          </div>
          <div className="provider-status-toggle">
            <span>Status: </span>
            <span className="status-pill status-active">● Available</span>
          </div>
        </div>
      </div>
      <div className="dash-widgets">
        {[
          { icon: <DollarSign size={22}/>, label:'Total Earnings', value:'$8,240', trend:'+$1,200 this month', color:'#43A047' },
          { icon: <Calendar size={22}/>, label:'Active Bookings', value:'3', trend:'2 starting this week', color:'#E53935' },
          { icon: <Star size={22}/>, label:'Avg. Rating', value:'4.9', trend:'From 214 reviews', color:'#FFC107' },
          { icon: <Clock size={22}/>, label:'Hours Worked', value:'386', trend:'+28 this month', color:'#1E88E5' },
        ].map((w,i) => (
          <div key={i} className="widget-card">
            <div className="widget-icon" style={{background:`${w.color}15`,color:w.color}}>{w.icon}</div>
            <div className="widget-info">
              <div className="widget-value">{w.value}</div>
              <div className="widget-label">{w.label}</div>
              <div className="widget-trend">{w.trend}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ProviderBookings() {
  const bookings = [
    { client:'James T.', service:'Executive PA', start:'May 15', hrs:40, status:'Active', amount:'$1,400' },
    { client:'Sarah M.', service:'Executive PA', start:'May 10', hrs:20, status:'Active', amount:'$700' },
    { client:'Chen W.', service:'Calendar Mgmt', start:'Apr 28', hrs:10, status:'Completed', amount:'$350' },
    { client:'Priya S.', service:'Email Handling', start:'Apr 15', hrs:15, status:'Completed', amount:'$525' },
  ]
  return (
    <div className="dash-content">
      <h2 className="dash-page-title">Bookings</h2>
      <div className="dash-card">
        <div className="orders-table-wrap">
          <table className="data-table">
            <thead><tr><th>Client</th><th>Service</th><th>Start Date</th><th>Hours</th><th>Status</th><th>Amount</th></tr></thead>
            <tbody>
              {bookings.map((b,i) => (
                <tr key={i}>
                  <td className="font-bold">{b.client}</td>
                  <td>{b.service}</td>
                  <td>{b.start}</td>
                  <td>{b.hrs} hrs</td>
                  <td><span className={`status-pill ${b.status==='Active'?'status-active':'status-done'}`}>{b.status}</span></td>
                  <td className="font-bold text-primary">{b.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function ProviderRequests() {
  const [reqs, setReqs] = useState([
    { client:'Nexaretail Inc.', service:'Business PA — Full-time', budget:'$1,600/mo', date:'May 17', status:'pending' },
    { client:'GrowthLab', service:'Marketing Assist. — 20hrs/wk', budget:'$800/mo', date:'May 16', status:'pending' },
    { client:'TechVault', service:'Calendar & Email — Part-time', budget:'$500/mo', date:'May 15', status:'pending' },
    { client:'StartupXYZ', service:'Executive PA — Full-time', budget:'$1,400/mo', date:'May 14', status:'accepted' },
  ])
  const respond = (i, action) => {
    const updated = [...reqs]
    updated[i] = {...updated[i], status: action}
    setReqs(updated)
  }
  return (
    <div className="dash-content">
      <h2 className="dash-page-title">Incoming Requests</h2>
      <div className="requests-list">
        {reqs.map((r,i) => (
          <div key={i} className="request-card dash-card">
            <div className="request-header">
              <div className="request-client-avatar">{r.client[0]}</div>
              <div className="request-info">
                <div className="font-bold">{r.client}</div>
                <div style={{fontSize:'0.85rem',color:'var(--gray-600)'}}>{r.service}</div>
                <div style={{fontSize:'0.82rem',color:'var(--gray-400)'}}>Budget: {r.budget} · Received {r.date}</div>
              </div>
              <div className="request-actions">
                {r.status === 'pending' ? (
                  <>
                    <button className="btn-primary" style={{padding:'8px 16px',fontSize:'0.85rem'}} onClick={()=>respond(i,'accepted')}>Accept</button>
                    <button className="btn-outline" style={{padding:'7px 16px',fontSize:'0.85rem'}} onClick={()=>respond(i,'declined')}>Decline</button>
                  </>
                ) : (
                  <span className={`status-pill ${r.status==='accepted'?'status-active':'status-done'}`}>{r.status.charAt(0).toUpperCase()+r.status.slice(1)}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ProviderEarnings() {
  return (
    <div className="dash-content">
      <h2 className="dash-page-title">Earnings</h2>
      <div className="dash-widgets" style={{marginBottom:'24px'}}>
        {[
          { label:'This Month', value:'$1,200' },
          { label:'Last Month', value:'$1,840' },
          { label:'Total Earned', value:'$8,240' },
          { label:'Pending Payout', value:'$560' },
        ].map((e,i) => (
          <div key={i} className="dash-card" style={{textAlign:'center'}}>
            <div style={{fontSize:'2rem',fontWeight:800,color:'var(--primary)'}}>{e.value}</div>
            <div style={{fontSize:'0.85rem',color:'var(--gray-500)',marginTop:'4px'}}>{e.label}</div>
          </div>
        ))}
      </div>
      <div className="dash-card">
        <div className="dash-card-header"><h3>Transaction History</h3></div>
        <div className="orders-table-wrap">
          <table className="data-table">
            <thead><tr><th>Date</th><th>Client</th><th>Description</th><th>Amount</th><th>Status</th></tr></thead>
            <tbody>
              {[
                { date:'May 15', client:'James T.', desc:'Week 1 — PA Services', amount:'$350', status:'Paid' },
                { date:'May 10', client:'Sarah M.', desc:'Week 1 — PA Services', amount:'$350', status:'Paid' },
                { date:'May 1', client:'Chen W.', desc:'Calendar Project', amount:'$350', status:'Paid' },
                { date:'Apr 15', client:'Priya S.', desc:'Email Management', amount:'$150', status:'Pending' },
              ].map((t,i) => (
                <tr key={i}>
                  <td>{t.date}</td><td className="font-bold">{t.client}</td><td>{t.desc}</td>
                  <td className="font-bold text-primary">{t.amount}</td>
                  <td><span className={`status-pill ${t.status==='Paid'?'status-active':'status-pending'}`}>{t.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function ProviderReviews() {
  const reviews = [
    { client:'James T.', rating:5, text:'Exceptional work. Always proactive and organized. My calendar has never been so clean!', date:'May 14' },
    { client:'Sarah M.', rating:5, text:'Ana is a superstar. She managed everything flawlessly during a very busy quarter.', date:'May 9' },
    { client:'Chen W.', rating:4, text:'Very professional and responsive. Would definitely hire again.', date:'Apr 27' },
  ]
  return (
    <div className="dash-content">
      <h2 className="dash-page-title">Reviews</h2>
      <div className="reviews-list">
        {reviews.map((r,i) => (
          <div key={i} className="dash-card" style={{marginBottom:'16px'}}>
            <div className="review-header">
              <div className="review-avatar">{r.client[0]}</div>
              <div><div className="review-name">{r.client}</div><div className="review-date">{r.date}</div></div>
              <div className="review-stars" style={{color:'#FFC107'}}>{'★'.repeat(r.rating)}</div>
            </div>
            <p className="review-text" style={{marginTop:'12px'}}>{r.text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function Placeholder({ title }) {
  return <div className="dash-content"><h2 className="dash-page-title">{title}</h2><div className="dash-card"><p style={{color:'var(--gray-500)',textAlign:'center',padding:'40px'}}>Coming soon.</p></div></div>
}

export default function ProviderDashboard() {
  const [sideOpen, setSideOpen] = useState(false)
  const path = window.location.pathname
  return (
    <div className="dashboard-layout">
      <button className="dash-mobile-toggle" onClick={()=>setSideOpen(!sideOpen)}><Menu size={20}/></button>
      {sideOpen && <div className="dash-overlay" onClick={()=>setSideOpen(false)}/>}
      <aside className={`dash-sidebar ${sideOpen?'sidebar-open':''}`}>
        <div className="dash-sidebar-header">
          <Link to="/" style={{color:'white',textDecoration:'none',display:'flex',alignItems:'center',gap:'8px',fontWeight:800,fontSize:'1.1rem'}}>
            <Zap size={18}/> HumanForce
          </Link>
          <button className="dash-sidebar-close" onClick={()=>setSideOpen(false)}><X size={18}/></button>
        </div>
        <div className="dash-user-card">
          <div className="dash-user-avatar" style={{background:'#1E88E5'}}>AK</div>
          <div><div className="dash-user-name">Ana Kowalski</div><div className="dash-user-role">Service Provider</div></div>
        </div>
        <nav className="dash-nav">
          {NAV.map(n => (
            <Link key={n.path} to={n.path} className={`dash-nav-link ${path===n.path?'dash-nav-active':''}`}>
              {n.icon} {n.label}
              {n.badge && <span className="dash-badge">{n.badge}</span>}
            </Link>
          ))}
        </nav>
        <Link to="/" className="dash-logout"><LogOut size={16}/> Back to Site</Link>
      </aside>
      <main className="dash-main">
        <Routes>
          <Route index element={<ProviderHome/>}/>
          <Route path="bookings" element={<ProviderBookings/>}/>
          <Route path="requests" element={<ProviderRequests/>}/>
          <Route path="earnings" element={<ProviderEarnings/>}/>
          <Route path="calendar" element={<Placeholder title="Calendar"/>}/>
          <Route path="messages" element={<Placeholder title="Messages"/>}/>
          <Route path="reviews" element={<ProviderReviews/>}/>
        </Routes>
      </main>
    </div>
  )
}
