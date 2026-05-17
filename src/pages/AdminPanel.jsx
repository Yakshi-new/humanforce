import { useState } from 'react'
import { Link, Routes, Route } from 'react-router-dom'
import { LayoutDashboard, Users, Briefcase, Grid, CreditCard, Settings, LogOut, Zap, TrendingUp, UserCheck, BarChart2, AlertTriangle, Menu, X, Search } from 'lucide-react'
import './Dashboard.css'

const NAV = [
  { icon: <LayoutDashboard size={18}/>, label:'Dashboard', path:'/admin' },
  { icon: <Users size={18}/>, label:'Users', path:'/admin/users' },
  { icon: <UserCheck size={18}/>, label:'Providers', path:'/admin/providers' },
  { icon: <Briefcase size={18}/>, label:'Services', path:'/admin/services' },
  { icon: <Grid size={18}/>, label:'Categories', path:'/admin/categories' },
  { icon: <CreditCard size={18}/>, label:'Transactions', path:'/admin/transactions' },
  { icon: <BarChart2 size={18}/>, label:'Reports', path:'/admin/reports' },
  { icon: <Settings size={18}/>, label:'Settings', path:'/admin/settings' },
]

function AdminHome() {
  return (
    <div className="dash-content">
      <h2 className="dash-page-title">Admin Dashboard</h2>
      <div className="dash-widgets">
        {[
          { icon:<Users size={22}/>, label:'Total Users', value:'14,820', trend:'+423 this week', color:'#1E88E5' },
          { icon:<UserCheck size={22}/>, label:'Providers', value:'12,041', trend:'+87 this week', color:'#43A047' },
          { icon:<Briefcase size={22}/>, label:'Active Bookings', value:'3,294', trend:'+156 today', color:'#E53935' },
          { icon:<CreditCard size={22}/>, label:'Revenue (MTD)', value:'$284K', trend:'+18% vs last month', color:'#8E24AA' },
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
          <div className="dash-card-header"><h3>Recent Signups</h3><span className="view-all">View all →</span></div>
          <div className="orders-table-wrap">
            <table className="data-table">
              <thead><tr><th>Name</th><th>Type</th><th>Date</th><th>Status</th></tr></thead>
              <tbody>
                {[
                  { name:'Alice Brown', type:'Customer', date:'May 17', status:'Active' },
                  { name:'David Park', type:'Provider', date:'May 17', status:'Pending' },
                  { name:'Emma Wilson', type:'Customer', date:'May 16', status:'Active' },
                  { name:'Frank Lee', type:'Provider', date:'May 16', status:'Pending' },
                ].map((u,i) => (
                  <tr key={i}>
                    <td className="font-bold">{u.name}</td>
                    <td><span className={`badge ${u.type==='Customer'?'badge-gray':'badge-red'}`}>{u.type}</span></td>
                    <td>{u.date}</td>
                    <td><span className={`status-pill ${u.status==='Active'?'status-active':'status-pending'}`}>{u.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="dash-card">
          <div className="dash-card-header"><h3>Platform Alerts</h3></div>
          <div className="alerts-list">
            {[
              { icon:'⚠️', text:'4 provider verifications pending review', type:'warning' },
              { icon:'💳', text:'2 payment disputes require attention', type:'error' },
              { icon:'✅', text:'System health: All services operational', type:'success' },
              { icon:'📊', text:'Monthly report ready for download', type:'info' },
            ].map((a,i) => (
              <div key={i} className={`alert-item alert-${a.type}`}>
                <span>{a.icon}</span>
                <span>{a.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="dash-card">
        <div className="dash-card-header"><h3>Revenue Overview</h3></div>
        <div className="revenue-bars">
          {[
            { month:'Jan', val:68, rev:'$68K' },{ month:'Feb', val:72, rev:'$72K' },{ month:'Mar', val:81, rev:'$81K' },
            { month:'Apr', val:75, rev:'$75K' },{ month:'May', val:100, rev:'$284K' },
          ].map((r,i) => (
            <div key={i} className="rev-bar-item">
              <div className="rev-bar-label">{r.rev}</div>
              <div className="rev-bar-wrap"><div className="rev-bar" style={{height:`${r.val}%`}}/></div>
              <div className="rev-bar-month">{r.month}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function UserTable({ title, data, cols }) {
  const [search, setSearch] = useState('')
  const filtered = data.filter(d => JSON.stringify(d).toLowerCase().includes(search.toLowerCase()))
  return (
    <div className="dash-content">
      <h2 className="dash-page-title">{title}</h2>
      <div className="dash-card">
        <div className="table-toolbar">
          <div className="table-search">
            <Search size={16}/>
            <input className="form-input" placeholder={`Search ${title.toLowerCase()}...`} value={search} onChange={e=>setSearch(e.target.value)} style={{paddingLeft:'36px'}}/>
          </div>
          <button className="btn-primary" style={{padding:'10px 18px',fontSize:'0.88rem'}}>+ Add New</button>
        </div>
        <div className="orders-table-wrap">
          <table className="data-table">
            <thead><tr>{cols.map(c=><th key={c}>{c}</th>)}</tr></thead>
            <tbody>
              {filtered.map((row,i) => (
                <tr key={i}>
                  {Object.values(row).map((v,j) => (
                    <td key={j}>
                      {typeof v === 'object' ? v : (
                        v === 'Active' ? <span className="status-pill status-active">Active</span> :
                        v === 'Pending' ? <span className="status-pill status-pending">Pending</span> :
                        v === 'Suspended' ? <span className="status-pill" style={{background:'#FFEBEE',color:'#C62828'}}>Suspended</span> :
                        <span>{v}</span>
                      )}
                    </td>
                  ))}
                  <td>
                    <button className="btn-ghost" style={{padding:'4px 10px',fontSize:'0.78rem'}}>Edit</button>
                    <button className="btn-ghost" style={{padding:'4px 10px',fontSize:'0.78rem',color:'var(--primary)'}}>View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

const USERS_DATA = [
  { id:'U-1001', name:'John Doe', email:'john@company.com', role:'Customer', joined:'May 15', status:'Active' },
  { id:'U-1002', name:'Emma Wilson', email:'emma@co.com', role:'Customer', joined:'May 14', status:'Active' },
  { id:'U-1003', name:'Mark Chen', email:'mark@firm.com', role:'Customer', joined:'May 10', status:'Active' },
  { id:'U-1004', name:'Nina Patel', email:'nina@biz.com', role:'Customer', joined:'Apr 28', status:'Suspended' },
]

const PROVIDERS_DATA = [
  { id:'P-2001', name:'Ana Kowalski', email:'ana@hf.com', category:'Personal Assistant', rating:'4.9', status:'Active' },
  { id:'P-2002', name:'Marcus Reyes', email:'marcus@hf.com', category:'Marketing', rating:'4.8', status:'Active' },
  { id:'P-2003', name:'David Park', email:'david@hf.com', category:'Business Assistant', rating:'—', status:'Pending' },
  { id:'P-2004', name:'Lily Torres', email:'lily@hf.com', category:'Customer Support', rating:'4.7', status:'Active' },
]

const SERVICES_DATA_ADMIN = [
  { id:'S-3001', title:'Executive PA', category:'Personal Assistant', provider:'Ana K.', price:'$35/hr', status:'Active' },
  { id:'S-3002', title:'Social Media Mgr', category:'Marketing', provider:'Marcus R.', price:'$38/hr', status:'Active' },
  { id:'S-3003', title:'B2B Sales SDR', category:'Sales Support', provider:'James L.', price:'$42/hr', status:'Active' },
  { id:'S-3004', title:'Data Entry Spec.', category:'Specialized', provider:'Priya S.', price:'$22/hr', status:'Pending' },
]

const TX_DATA = [
  { id:'TX-5001', user:'John Doe', provider:'Ana K.', amount:'$350', date:'May 15', method:'Card', status:'Paid' },
  { id:'TX-5002', user:'Emma Wilson', provider:'Marcus R.', amount:'$380', date:'May 10', method:'Card', status:'Paid' },
  { id:'TX-5003', user:'Mark Chen', provider:'Priya S.', amount:'$220', date:'Apr 28', method:'Bank', status:'Paid' },
  { id:'TX-5004', user:'Nina Patel', provider:'James L.', amount:'$280', date:'Apr 15', method:'Card', status:'Pending' },
]

function Placeholder({ title }) {
  return <div className="dash-content"><h2 className="dash-page-title">{title}</h2><div className="dash-card"><p style={{color:'var(--gray-500)',textAlign:'center',padding:'40px'}}>Coming soon.</p></div></div>
}

export default function AdminPanel() {
  const [sideOpen, setSideOpen] = useState(false)
  const path = window.location.pathname
  return (
    <div className="dashboard-layout">
      <button className="dash-mobile-toggle" onClick={()=>setSideOpen(!sideOpen)}><Menu size={20}/></button>
      {sideOpen && <div className="dash-overlay" onClick={()=>setSideOpen(false)}/>}
      <aside className={`dash-sidebar ${sideOpen?'sidebar-open':''}`} style={{background:'#1a1a2e'}}>
        <div className="dash-sidebar-header">
          <Link to="/" style={{color:'white',textDecoration:'none',display:'flex',alignItems:'center',gap:'8px',fontWeight:800,fontSize:'1.1rem'}}>
            <Zap size={18}/> Admin Panel
          </Link>
          <button className="dash-sidebar-close" onClick={()=>setSideOpen(false)}><X size={18}/></button>
        </div>
        <div className="dash-user-card">
          <div className="dash-user-avatar" style={{background:'#E53935'}}>SA</div>
          <div><div className="dash-user-name">Super Admin</div><div className="dash-user-role">Full Access</div></div>
        </div>
        <nav className="dash-nav">
          {NAV.map(n => (
            <Link key={n.path} to={n.path} className={`dash-nav-link ${path===n.path?'dash-nav-active':''}`}>
              {n.icon} {n.label}
            </Link>
          ))}
        </nav>
        <Link to="/" className="dash-logout"><LogOut size={16}/> Back to Site</Link>
      </aside>
      <main className="dash-main">
        <Routes>
          <Route index element={<AdminHome/>}/>
          <Route path="users" element={<UserTable title="Users" data={USERS_DATA} cols={['ID','Name','Email','Role','Joined','Status','Actions']}/>}/>
          <Route path="providers" element={<UserTable title="Providers" data={PROVIDERS_DATA} cols={['ID','Name','Email','Category','Rating','Status','Actions']}/>}/>
          <Route path="services" element={<UserTable title="Services" data={SERVICES_DATA_ADMIN} cols={['ID','Title','Category','Provider','Price','Status','Actions']}/>}/>
          <Route path="transactions" element={<UserTable title="Transactions" data={TX_DATA} cols={['ID','User','Provider','Amount','Date','Method','Status','Actions']}/>}/>
          <Route path="categories" element={<Placeholder title="Categories"/>}/>
          <Route path="reports" element={<Placeholder title="Reports"/>}/>
          <Route path="settings" element={<Placeholder title="Settings"/>}/>
        </Routes>
      </main>
    </div>
  )
}
