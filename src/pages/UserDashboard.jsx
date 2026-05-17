import { useState } from 'react'
import { Link, Routes, Route, useNavigate } from 'react-router-dom'
import { LayoutDashboard, ShoppingBag, MessageSquare, Bell, CreditCard, Settings, LogOut, Zap, TrendingUp, Clock, Star, BarChart2, ChevronRight, Menu, X } from 'lucide-react'
import './Dashboard.css'

const NAV = [
  { icon: <LayoutDashboard size={18}/>, label: 'Dashboard', path: '/dashboard' },
  { icon: <ShoppingBag size={18}/>, label: 'My Orders', path: '/dashboard/orders' },
  { icon: <MessageSquare size={18}/>, label: 'Messages', path: '/dashboard/messages', badge: 3 },
  { icon: <Bell size={18}/>, label: 'Notifications', path: '/dashboard/notifications', badge: 5 },
  { icon: <CreditCard size={18}/>, label: 'Payments', path: '/dashboard/payments' },
  { icon: <Settings size={18}/>, label: 'Settings', path: '/dashboard/settings' },
]

const ORDERS = [
  { id:'#HF-1041', service:'Executive Personal Assistant', pro:'Ana K.', status:'Active', amount:'$350', date:'May 15, 2026' },
  { id:'#HF-1038', service:'Social Media Manager', pro:'Marcus R.', status:'Active', amount:'$380', date:'May 10, 2026' },
  { id:'#HF-1029', service:'Data Entry Specialist', pro:'Priya S.', status:'Completed', amount:'$220', date:'Apr 28, 2026' },
  { id:'#HF-1021', service:'Customer Support Agent', pro:'James L.', status:'Completed', amount:'$280', date:'Apr 15, 2026' },
]

function DashHome() {
  return (
    <div className="dash-content">
      <h2 className="dash-page-title">Dashboard</h2>
      <div className="dash-widgets">
        {[
          { icon: <ShoppingBag size={22}/>, label:'Active Orders', value:'3', trend:'+1 this week', color:'#E53935' },
          { icon: <CreditCard size={22}/>, label:'Total Spent', value:'$2,840', trend:'+$350 this month', color:'#1E88E5' },
          { icon: <Star size={22}/>, label:'Avg. Rating Given', value:'4.8', trend:'From 12 reviews', color:'#FFC107' },
          { icon: <Clock size={22}/>, label:'Hours Contracted', value:'142', trend:'+28 this month', color:'#43A047' },
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

      <div className="dash-grid-2">
        <div className="dash-card">
          <div className="dash-card-header"><h3>Recent Orders</h3><Link to="/dashboard/orders" className="view-all">View all</Link></div>
          <div className="orders-table-wrap">
            <table className="data-table">
              <thead><tr><th>ID</th><th>Service</th><th>Status</th><th>Amount</th></tr></thead>
              <tbody>
                {ORDERS.slice(0,3).map(o => (
                  <tr key={o.id}>
                    <td className="mono">{o.id}</td>
                    <td>{o.service}</td>
                    <td><span className={`status-pill ${o.status==='Active'?'status-active':'status-done'}`}>{o.status}</span></td>
                    <td className="font-bold">{o.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="dash-card">
          <div className="dash-card-header"><h3>Active Services</h3></div>
          <div className="active-services">
            {[{ name:'Ana K.', role:'Personal Assistant', since:'May 15', avatar:'A' },{ name:'Marcus R.', role:'Social Media Manager', since:'May 10', avatar:'M' },{ name:'Priya S.', role:'Data Entry', since:'Apr 28', avatar:'P' }].map((s,i) => (
              <div key={i} className="active-svc-row">
                <div className="svc-pro-avatar">{s.avatar}</div>
                <div className="svc-pro-info"><div className="svc-pro-name">{s.name}</div><div className="svc-pro-role">{s.role}</div></div>
                <div className="svc-since">Since {s.since}</div>
                <span className="status-pill status-active">Active</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="dash-card">
        <div className="dash-card-header"><h3>Recent Activity</h3></div>
        <div className="activity-feed">
          {[
            { icon:'📦', text:'New booking confirmed with Ana K. (Personal Assistant)', time:'2 hours ago' },
            { icon:'💬', text:'Marcus R. sent you a message', time:'Yesterday' },
            { icon:'✅', text:'Order #HF-1029 marked as completed', time:'Apr 28' },
            { icon:'💳', text:'Payment of $280 processed successfully', time:'Apr 15' },
          ].map((a,i) => (
            <div key={i} className="activity-item">
              <span className="activity-icon">{a.icon}</span>
              <div className="activity-text">{a.text}</div>
              <div className="activity-time">{a.time}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function DashOrders() {
  return (
    <div className="dash-content">
      <h2 className="dash-page-title">My Orders</h2>
      <div className="dash-card">
        <div className="orders-table-wrap">
          <table className="data-table">
            <thead><tr><th>Order ID</th><th>Service</th><th>Professional</th><th>Date</th><th>Status</th><th>Amount</th></tr></thead>
            <tbody>
              {ORDERS.map(o => (
                <tr key={o.id}>
                  <td className="mono">{o.id}</td>
                  <td>{o.service}</td>
                  <td>{o.pro}</td>
                  <td>{o.date}</td>
                  <td><span className={`status-pill ${o.status==='Active'?'status-active':'status-done'}`}>{o.status}</span></td>
                  <td className="font-bold text-primary">{o.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function DashMessages() {
  const [active, setActive] = useState(0)
  const convos = [
    { name:'Ana K.', role:'Personal Assistant', last:'I\'ll prepare the briefing by 9 AM tomorrow.', time:'10:32 AM', unread:2 },
    { name:'Marcus R.', role:'Social Media', last:'The campaign report is ready for review.', time:'Yesterday', unread:1 },
    { name:'HumanForce Support', role:'Support', last:'Your verification was approved!', time:'May 14', unread:0 },
  ]
  return (
    <div className="dash-content">
      <h2 className="dash-page-title">Messages</h2>
      <div className="messages-layout">
        <div className="convos-list">
          {convos.map((c,i) => (
            <div key={i} className={`convo-item ${active===i?'convo-active':''}`} onClick={()=>setActive(i)}>
              <div className="convo-avatar">{c.name[0]}</div>
              <div className="convo-info">
                <div className="convo-name-row"><span className="convo-name">{c.name}</span><span className="convo-time">{c.time}</span></div>
                <div className="convo-role">{c.role}</div>
                <div className="convo-last">{c.last}</div>
              </div>
              {c.unread>0 && <span className="convo-badge">{c.unread}</span>}
            </div>
          ))}
        </div>
        <div className="chat-panel">
          <div className="chat-panel-header">
            <div className="convo-avatar">{convos[active].name[0]}</div>
            <div><div className="font-bold">{convos[active].name}</div><div style={{fontSize:'0.8rem',color:'var(--gray-500)'}}>{convos[active].role}</div></div>
          </div>
          <div className="chat-messages-area">
            <div className="chat-msg bot"><div className="msg-bubble">{convos[active].last}</div></div>
            <div className="chat-msg user"><div className="msg-bubble">Got it, thank you!</div></div>
          </div>
          <div className="chat-input-row">
            <input className="form-input" placeholder="Type a message..." style={{flex:1}}/>
            <button className="btn-primary" style={{padding:'12px 20px'}}>Send</button>
          </div>
        </div>
      </div>
    </div>
  )
}

function DashPlaceholder({ title }) {
  return <div className="dash-content"><h2 className="dash-page-title">{title}</h2><div className="dash-card"><p style={{color:'var(--gray-500)',textAlign:'center',padding:'40px'}}>This section is coming soon.</p></div></div>
}

export default function UserDashboard() {
  const [sideOpen, setSideOpen] = useState(false)
  const path = window.location.pathname

  return (
    <div className="dashboard-layout">
      <button className="dash-mobile-toggle" onClick={()=>setSideOpen(!sideOpen)}><Menu size={20}/></button>
      {sideOpen && <div className="dash-overlay" onClick={()=>setSideOpen(false)}/>}
      <aside className={`dash-sidebar ${sideOpen?'sidebar-open':''}`}>
        <div className="dash-sidebar-header">
          <Link to="/" className="auth-logo" style={{color:'white',textDecoration:'none',display:'flex',alignItems:'center',gap:'8px',fontWeight:800,fontSize:'1.1rem'}}>
            <Zap size={18}/> HumanForce
          </Link>
          <button className="dash-sidebar-close" onClick={()=>setSideOpen(false)}><X size={18}/></button>
        </div>
        <div className="dash-user-card">
          <div className="dash-user-avatar">JD</div>
          <div><div className="dash-user-name">John Doe</div><div className="dash-user-role">Customer Account</div></div>
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
          <Route index element={<DashHome/>}/>
          <Route path="orders" element={<DashOrders/>}/>
          <Route path="messages" element={<DashMessages/>}/>
          <Route path="notifications" element={<DashPlaceholder title="Notifications"/>}/>
          <Route path="payments" element={<DashPlaceholder title="Payments"/>}/>
          <Route path="settings" element={<DashPlaceholder title="Settings"/>}/>
        </Routes>
      </main>
    </div>
  )
}
