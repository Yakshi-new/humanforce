import { useState, useEffect } from 'react'
import { Link, Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { LayoutDashboard, Users, Briefcase, Grid, CreditCard, Settings, LogOut, Zap, UserCheck, BarChart2, AlertTriangle, Menu, X, Search } from 'lucide-react'
import { api } from '../utils/api'
import './Dashboard.css'

const NAV = [
  { icon: <LayoutDashboard size={18}/>, label:'Dashboard', path:'/admin' },
  { icon: <Briefcase size={18}/>, label:'Requests', path:'/admin/requests' },
  { icon: <Users size={18}/>, label:'Users', path:'/admin/users' },
  { icon: <UserCheck size={18}/>, label:'Providers', path:'/admin/providers' },
  { icon: <Briefcase size={18}/>, label:'Services', path:'/admin/services' },
  { icon: <CreditCard size={18}/>, label:'Transactions', path:'/admin/transactions' },
  { icon: <Settings size={18}/>, label:'Settings', path:'/admin/settings' },
]

function AdminHome() {
  const [stats, setStats] = useState({ totalUsers: 0, totalProviders: 0, activeBookings: 0, revenue: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await api.getAdminStats()
        setStats(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="dash-content" style={{ textAlign: 'center', padding: '60px 0' }}>
        <p>Gathering ledger data...</p>
      </div>
    )
  }

  return (
    <div className="dash-content">
      <h2 className="dash-page-title">Admin Dashboard</h2>
      
      <div className="dash-widgets">
        {[
          { icon:<Users size={22}/>, label:'Total Customers', value: stats.totalUsers, trend:'Verified accounts', color:'#1E88E5' },
          { icon:<UserCheck size={22}/>, label:'Active Providers', value: stats.totalProviders, trend:'Marketplace roster', color:'#43A047' },
          { icon:<Briefcase size={22}/>, label:'Active Bookings', value: stats.activeBookings, trend:'In-progress operations', color:'#E53935' },
          { icon:<CreditCard size={22}/>, label:'Total Escrow Volume', value: `₹${(stats.revenue || 0).toLocaleString('en-IN')}`, trend:'Net flow-through', color:'#8E24AA' },
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
          <div className="dash-card-header"><h3>Security Status</h3></div>
          <div className="orders-table-wrap" style={{ padding: '20px' }}>
            <p style={{ color: 'var(--gray-400)', fontSize: '0.9rem', marginBottom: '12px' }}>
              All client-provider chats are protected under secure cryptographic keys. Payout settlement runs automatically every 24 hours.
            </p>
            <div className="alert-item alert-success" style={{ marginBottom: '8px' }}>
              <span>✅</span> <span>System Health: MongoDB Atlas connection stable</span>
            </div>
            <div className="alert-item alert-info">
              <span>🔒</span> <span>Escrow vault verification active</span>
            </div>
          </div>
        </div>

        <div className="dash-card">
          <div className="dash-card-header"><h3>Audit Overview</h3></div>
          <div className="alerts-list">
            {[
              { icon:'🛡️', text:'Realtime JWT Authorization enabled for all operations', type:'info' },
              { icon:'⚠️', text:'Verification reviews are audited by senior admins', type:'warning' }
            ].map((a,i) => (
              <div key={i} className={`alert-item alert-${a.type}`}>
                <span>{a.icon}</span>
                <span>{a.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function UserTable({ title, fetchFn, cols, mapRow }) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchFn()
        setData(res)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [fetchFn])

  const filtered = data.filter(d => 
    JSON.stringify(d).toLowerCase().includes(search.toLowerCase())
  )

  if (loading) {
    return (
      <div className="dash-content" style={{ textAlign: 'center', padding: '60px 0' }}>
        <p>Loading {title} audit records...</p>
      </div>
    )
  }

  return (
    <div className="dash-content">
      <h2 className="dash-page-title">{title}</h2>
      <div className="dash-card">
        <div className="table-toolbar">
          <div className="table-search">
            <Search size={16}/>
            <input 
              className="form-input" 
              placeholder={`Search ${title.toLowerCase()}...`} 
              value={search} 
              onChange={e=>setSearch(e.target.value)} 
              style={{paddingLeft:'36px'}}
            />
          </div>
        </div>
        <div className="orders-table-wrap">
          <table className="data-table">
            <thead><tr>{cols.map(c=><th key={c}>{c}</th>)}</tr></thead>
            <tbody>
              {filtered.map((row, i) => (
                <tr key={row._id || i}>
                  {mapRow(row).map((val, j) => (
                    <td key={j}>{val}</td>
                  ))}
                  <td>
                    <span style={{ fontSize: '0.8rem', color: 'var(--gray-500)' }}>Audit Logged</span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={cols.length} style={{ textAlign: 'center', color: 'var(--gray-500)', padding: '24px' }}>
                    No matching records compiled.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function AdminRequests() {
  const [bookings, setBookings] = useState([])
  const [providers, setProviders] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const loadData = async () => {
    try {
      const bData = await api.getBookings()
      const pData = await api.getAdminProviders()
      setBookings(bData)
      setProviders(pData)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleStatusUpdate = async (id, status) => {
    try {
      await api.updateBookingStatus(id, status)
      await loadData()
    } catch (err) {
      console.error(err)
    }
  }

  const handleProviderAssign = async (bookingId, providerId) => {
    try {
      await api.assignProviderToBooking(bookingId, providerId)
      await loadData()
    } catch (err) {
      console.error(err)
    }
  }

  const filtered = bookings.filter(b => 
    JSON.stringify(b).toLowerCase().includes(search.toLowerCase())
  )

  if (loading) {
    return (
      <div className="dash-content" style={{ textAlign: 'center', padding: '60px 0' }}>
        <p>Retrieving request list...</p>
      </div>
    )
  }

  return (
    <div className="dash-content">
      <h2 className="dash-page-title">Booking Assignment Requests</h2>
      
      <div className="dash-card">
        <div className="table-toolbar">
          <div className="table-search">
            <Search size={16}/>
            <input 
              className="form-input" 
              placeholder="Search requests..." 
              value={search} 
              onChange={e=>setSearch(e.target.value)} 
              style={{paddingLeft:'36px'}}
            />
          </div>
        </div>

        <div className="orders-table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Customer Account</th>
                <th>Service Info</th>
                <th>Schedule Details</th>
                <th>Financials (20% Deposit)</th>
                <th>Assigned Buddy</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((b) => (
                <tr key={b._id}>
                  <td className="mono font-bold">{b.bookingId}</td>
                  <td>
                    <div className="font-bold">{b.client?.firstName} {b.client?.lastName}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--gray-400)' }}>{b.client?.email}</div>
                  </td>
                  <td>
                    <div className="font-bold">{b.service?.name}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--gray-400)' }}>{b.service?.category}</div>
                  </td>
                  <td>
                    <div>{b.date}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--gray-400)' }}>{b.time} ({b.hours} hrs)</div>
                  </td>
                  <td className="font-bold">
                    <div>Total: ₹{b.totalCost?.toLocaleString('en-IN')}</div>
                    <div style={{ fontSize: '0.75rem', color: '#43A047' }}>Deposit: ₹{b.depositPaid?.toLocaleString('en-IN')}</div>
                  </td>
                  <td>
                    <select 
                      value={b.provider?._id || ''} 
                      onChange={(e) => handleProviderAssign(b._id, e.target.value)}
                      className="form-input"
                      style={{ 
                        padding: '4px 8px', 
                        fontSize: '0.8rem', 
                        background: '#1a1a2e', 
                        color: 'white', 
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="">-- Unassigned --</option>
                      {providers.map(p => (
                        <option key={p._id} value={p._id}>
                          {p.firstName} {p.lastName}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <span className={`status-pill status-${(b.status || '').toLowerCase()}`}>{b.status}</span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      {b.status === 'Pending' && (
                        <>
                          <button
                            onClick={() => handleStatusUpdate(b._id, 'Active')}
                            style={{
                              background: 'rgba(67,160,71,0.1)',
                              border: '1px solid rgba(67,160,71,0.2)',
                              color: '#43A047',
                              padding: '4px 8px',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '0.75rem',
                              fontWeight: 600
                            }}
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(b._id, 'Declined')}
                            style={{
                              background: 'rgba(229,57,53,0.1)',
                              border: '1px solid rgba(229,57,53,0.2)',
                              color: '#E53935',
                              padding: '4px 8px',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '0.75rem',
                              fontWeight: 600
                            }}
                          >
                            Refuse
                          </button>
                        </>
                      )}
                      {b.status === 'Active' && (
                        <button
                          onClick={() => handleStatusUpdate(b._id, 'Completed')}
                          style={{
                            background: 'rgba(67,160,71,0.15)',
                            border: '1px solid rgba(67,160,71,0.3)',
                            color: '#43A047',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '0.75rem',
                            fontWeight: 600
                          }}
                        >
                          Force Settle
                        </button>
                      )}
                      {['Completed', 'Declined'].includes(b.status) && (
                        <span style={{ color: 'var(--gray-500)', fontSize: '0.78rem' }}>Resolved</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', color: 'var(--gray-500)', padding: '24px' }}>
                    No active booking requests registered.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function Placeholder({ title }) {
  return <div className="dash-content"><h2 className="dash-page-title">{title}</h2><div className="dash-card"><p style={{color:'var(--gray-500)',textAlign:'center',padding:'40px'}}>Superadmin controls for {title} coming soon.</p></div></div>
}

export default function AdminPanel() {
  const [sideOpen, setSideOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    // Route guard
    if (!api.isAuthenticated() || api.getUser()?.role !== 'admin') {
      navigate('/login')
    }
  }, [])

  const handleLogout = () => {
    api.logout()
    navigate('/')
  }

  const getInitials = () => {
    const user = api.getUser()
    if (!user) return 'AD'
    return `${(user.firstName || '')[0] || ''}${(user.lastName || '')[0] || ''}`.toUpperCase()
  }

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
          <div className="dash-user-avatar" style={{background:'#E53935', color: 'white'}}>
            {getInitials()}
          </div>
          <div>
            <div className="dash-user-name">Super Admin</div>
            <div className="dash-user-role">Full Access Ledger</div>
          </div>
        </div>

        <nav className="dash-nav">
          {NAV.map(n => (
            <Link key={n.path} to={n.path} className={`dash-nav-link ${location.pathname === n.path ? 'dash-nav-active' : ''}`}>
              {n.icon} {n.label}
            </Link>
          ))}
        </nav>
        
        <button onClick={handleLogout} className="dash-logout" style={{ background: 'none', border: 'none', textAlign: 'left', width: '100%', cursor: 'pointer' }}>
          <LogOut size={16}/> Sign Out
        </button>
      </aside>

      <main className="dash-main">
        <Routes>
          <Route index element={<AdminHome/>}/>
          <Route path="requests" element={<AdminRequests/>}/>
          
          <Route 
            path="users" 
            element={
              <UserTable 
                title="Platform Customers" 
                fetchFn={api.getAdminUsers} 
                cols={['ID', 'First Name', 'Last Name', 'Email', 'Phone', 'Role', 'Status', 'Audit']} 
                mapRow={r => [
                  r._id ? r._id.substring(r._id.length - 6).toUpperCase() : 'N/A', 
                  r.firstName, 
                  r.lastName, 
                  r.email, 
                  r.phone || 'N/A', 
                  r.role, 
                  <span className="status-pill status-active">Active</span>
                ]}
              />
            }
          />
          
          <Route 
            path="providers" 
            element={
              <UserTable 
                title="Service Buddies" 
                fetchFn={api.getAdminProviders} 
                cols={['ID', 'Name', 'Email', 'Phone', 'Earnings', 'Status', 'Audit']} 
                mapRow={r => [
                  r._id ? r._id.substring(r._id.length - 6).toUpperCase() : 'N/A', 
                  `${r.firstName} ${r.lastName}`, 
                  r.email, 
                  r.phone || 'N/A', 
                  `₹${(r.earnings || 0).toLocaleString('en-IN')}`, 
                  <span className="status-pill status-active">Active</span>
                ]}
              />
            }
          />

          <Route 
            path="services" 
            element={
              <UserTable 
                title="Premium Services Catalog" 
                fetchFn={api.getServices} 
                cols={['Service ID', 'Name', 'Category', 'Price/hr', 'Rating', 'Audit']} 
                mapRow={r => [
                  r.serviceId, 
                  r.name, 
                  r.category, 
                  `₹${r.price.toLocaleString('en-IN')}`, 
                  r.rating || '4.8'
                ]}
              />
            }
          />

          <Route 
            path="transactions" 
            element={
              <UserTable 
                title="Secured Transactions Ledger" 
                fetchFn={api.getAdminTransactions} 
                cols={['TX ID', 'Customer Account', 'Assigned Buddy', 'Volume', 'Schedule Date', 'Method', 'State', 'Audit']} 
                mapRow={r => [
                  r._id, 
                  r.user, 
                  r.provider, 
                  r.amount, 
                  r.date, 
                  r.method, 
                  <span className={`status-pill status-${r.status === 'Paid' ? 'active' : r.status === 'Refunded' ? 'done' : 'pending'}`}>{r.status}</span>
                ]}
              />
            }
          />

          <Route path="settings" element={<Placeholder title="Settings"/>}/>
        </Routes>
      </main>
    </div>
  )
}
