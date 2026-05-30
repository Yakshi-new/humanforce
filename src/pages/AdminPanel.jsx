import { useState, useEffect } from 'react'
import { Link, Routes, Route, useNavigate, useLocation, useParams } from 'react-router-dom'
import { LayoutDashboard, Users, Briefcase, Grid, CreditCard, Settings, LogOut, Zap, UserCheck, BarChart2, AlertTriangle, Menu, X, Search, PlayCircle, CheckCircle, History, Mail, MessageSquare } from 'lucide-react'
import { api } from '../utils/api'
import { DashboardSkeleton, PageLoader, TableSkeleton, SpinnerIcon } from '../components/Loader'
import './Dashboard.css'

const NAV = [
  { icon: <LayoutDashboard size={18}/>, label:'Dashboard', path:'/admin' },
  { icon: <Briefcase size={18}/>, label:'Requests', path:'/admin/requests' },
  { icon: <MessageSquare size={18}/>, label:'Messages Trace', path:'/admin/messages-trace' },
  { icon: <Users size={18}/>, label:'Users', path:'/admin/users' },
  { icon: <UserCheck size={18}/>, label:'Providers', path:'/admin/providers' },
  { icon: <Briefcase size={18}/>, label:'Services', path:'/admin/services' },
  { icon: <CreditCard size={18}/>, label:'Transactions', path:'/admin/transactions' },
  { icon: <Mail size={18}/>, label:'Enquiries', path:'/admin/enquiries', badge: 'newEnquiriesCount' },
  { icon: <History size={18}/>, label:'Log History', path:'/admin/logs' },
  { icon: <Settings size={18}/>, label:'Settings', path:'/admin/settings' },
]

function AdminHome() {
  const [stats, setStats] = useState({ 
    totalUsers: 0, 
    totalProviders: 0, 
    activeBookings: 0, 
    revenue: 0,
    platformCommission: 0,
    runningOperations: 0,
    completedOperations: 0,
    upcomingBookings: []
  })
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
    return <DashboardSkeleton widgetCount={7} tableRows={5} tableCols={7} />
  }

  return (
    <div className="dash-content">
      <h2 className="dash-page-title">Admin Dashboard</h2>
      
      <div className="dash-widgets">
        {[
          { icon:<Users size={22}/>, label:'Total Customers', value: stats.totalUsers || 0, trend:'Verified accounts', color:'#1E88E5' },
          { icon:<UserCheck size={22}/>, label:'Active Providers', value: stats.totalProviders || 0, trend:'Marketplace roster', color:'#43A047' },
          { icon:<PlayCircle size={22}/>, label:'Running Operations', value: stats.runningOperations || 0, trend:'In-progress bookings', color:'#FF9800' },
          { icon:<CheckCircle size={22}/>, label:'Complete Operations', value: stats.completedOperations || 0, trend:'Successfully finished', color:'#00ACC1' },
          { icon:<AlertTriangle size={22}/>, label:'Buddy Requests', value: stats.changeBuddyRequestsCount || 0, trend:'Pending buddy changes', color:'#E53935' },
          { icon:<CreditCard size={22}/>, label:'Total Escrow Volume', value: `₹${(stats.revenue || 0).toLocaleString('en-IN')}`, trend:'Net booking value', color:'#8E24AA' },
          { icon:<CreditCard size={22}/>, label:'Platform Commission', value: `₹${(stats.platformCommission || 0).toLocaleString('en-IN')}`, trend:'20% deposit escrow cut', color:'#43A047' },
        ].map((w,i) => (
          <div key={i} className="widget-card">
            <div className="widget-icon" style={{background:`${w.color}15`,color:w.color}}>{w.icon}</div>
            <div className="widget-info">
              <div className="widget-value">{w.value}</div>
              <div className="widget-label">{w.label}</div>
              <div className="widget-trend" style={{color:w.color}}>{w.trend}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Pending & Upcoming Bookings Section (Today & Tomorrow) */}
      <div className="dash-card" style={{ marginBottom: '28px' }}>
        <div className="dash-card-header" style={{ borderBottom: '1px solid var(--gray-200)', paddingBottom: '14px', marginBottom: '16px' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: 0, fontSize: '1.05rem', fontWeight: 700 }}>
            📅 Pending & Upcoming Operations (Today & Tomorrow)
          </h3>
          <span className="status-pill status-active" style={{ fontSize: '0.78rem' }}>
            {(stats.upcomingBookings || []).length} Scheduled
          </span>
        </div>
        
        <div className="orders-table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Client Details</th>
                <th>Buddy Details</th>
                <th>Service Info</th>
                <th>Schedule Date & Time</th>
                <th>Escrow Cost Breakdown</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {(stats.upcomingBookings || []).map((b) => (
                <tr key={b._id}>
                  <td className="mono font-bold">{b.bookingId}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#1E88E5', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', overflow: 'hidden', flexShrink: 0 }}>
                        {b.client?.avatar ? (
                          <img src={b.client.avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          b.client?.firstName?.[0] || 'C'
                        )}
                      </div>
                      <div>
                        <div className="font-bold">{b.client?.firstName} {b.client?.lastName}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--gray-500)' }}>{b.client?.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    {b.provider ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#43A047', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', overflow: 'hidden', flexShrink: 0 }}>
                          {b.provider?.avatar ? (
                            <img src={b.provider.avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            b.provider?.firstName?.[0] || 'P'
                          )}
                        </div>
                        <div className="font-bold">{b.provider?.firstName} {b.provider?.lastName}</div>
                      </div>
                    ) : (
                      <span style={{ color: '#FF9800', fontStyle: 'italic', fontWeight: 600 }}>Unassigned Buddy</span>
                    )}
                  </td>
                  <td>
                    <div className="font-bold">{b.service?.name}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--gray-500)' }}>{b.service?.category}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{b.date}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--gray-500)' }}>{b.time} ({b.hours} hrs)</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 700 }}>Total: ₹{b.totalCost?.toLocaleString('en-IN')}</div>
                    <div style={{ fontSize: '0.78rem', color: '#43A047', fontWeight: 600 }}>Deposit (20%): ₹{b.depositPaid?.toLocaleString('en-IN')}</div>
                  </td>
                  <td>
                    <span className={`status-pill status-${(b.status || '').toLowerCase()}`}>{b.status}</span>
                  </td>
                </tr>
              ))}
              {(stats.upcomingBookings || []).length === 0 && (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', color: 'var(--gray-500)', padding: '36px 0' }}>
                    🏖️ No pending or upcoming operations scheduled for today or tomorrow.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Unaccepted Bookings */}
      <div className="dash-card" style={{ marginBottom: '28px' }}>
        <div className="dash-card-header" style={{ borderBottom: '1px solid var(--gray-200)', paddingBottom: '14px', marginBottom: '16px' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: 0, fontSize: '1.05rem', fontWeight: 700 }}>
            🚨 Unaccepted Bookings (No Provider Assigned)
          </h3>
          <span className="status-pill status-pending" style={{ fontSize: '0.78rem', background: '#FFF3E0', color: '#EF6C00' }}>
            {(stats.unacceptedBookings || []).length} Pending Assign
          </span>
        </div>
        
        <div className="orders-table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Client Details</th>
                <th>Service Info</th>
                <th>Schedule Date & Time</th>
                <th>Total Cost</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {(stats.unacceptedBookings || []).map((b) => (
                <tr key={b._id}>
                  <td className="mono font-bold">{b.bookingId}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#1E88E5', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', overflow: 'hidden', flexShrink: 0 }}>
                        {b.client?.avatar ? (
                          <img src={b.client.avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          b.client?.firstName?.[0] || 'C'
                        )}
                      </div>
                      <div>
                        <div className="font-bold">{b.client?.firstName} {b.client?.lastName}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--gray-500)' }}>{b.client?.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="font-bold">{b.service?.name}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--gray-500)' }}>{b.service?.category}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{b.date}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--gray-500)' }}>{b.time} ({b.hours} hrs)</div>
                  </td>
                  <td>₹{b.totalCost?.toLocaleString('en-IN')}</td>
                  <td>
                    <span className="status-pill status-pending">{b.status}</span>
                  </td>
                  <td>
                    <Link to="/admin/requests" className="btn-primary" style={{ padding: '4px 10px', fontSize: '0.75rem', textDecoration: 'none' }}>
                      Assign Buddy
                    </Link>
                  </td>
                </tr>
              ))}
              {(stats.unacceptedBookings || []).length === 0 && (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', color: 'var(--gray-500)', padding: '36px 0' }}>
                    ✅ All bookings have assigned providers.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Outstanding Payments Ledger */}
      <div className="dash-card" style={{ marginBottom: '28px' }}>
        <div className="dash-card-header" style={{ borderBottom: '1px solid var(--gray-200)', paddingBottom: '14px', marginBottom: '16px' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: 0, fontSize: '1.05rem', fontWeight: 700 }}>
            💳 Outstanding Payments Ledger
          </h3>
          <span className="status-pill status-active" style={{ fontSize: '0.78rem' }}>
            {(stats.outstandingBookings || []).filter(b => !b.remainingPaid).length} Outstanding
          </span>
        </div>
        
        <div className="orders-table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Client Name</th>
                <th>Assigned Buddy</th>
                <th>Total Cost</th>
                <th>Deposit Paid (20%)</th>
                <th>Outstanding (80%)</th>
                <th>Remaining Paid Status</th>
              </tr>
            </thead>
            <tbody>
              {(stats.outstandingBookings || []).map((b) => {
                const outstandingAmount = (b.totalCost || 0) * 0.8;
                return (
                  <tr key={b._id}>
                    <td className="mono font-bold">{b.bookingId}</td>
                    <td>{b.client ? `${b.client.firstName} ${b.client.lastName}` : 'N/A'}</td>
                    <td>
                      {b.provider ? (
                        `${b.provider.firstName} ${b.provider.lastName}`
                      ) : (
                        <span style={{ color: '#FF9800', fontWeight: 600 }}>Unassigned</span>
                      )}
                    </td>
                    <td>₹{(b.totalCost || 0).toLocaleString('en-IN')}</td>
                    <td style={{ color: '#43A047', fontWeight: 600 }}>₹{(b.depositPaid || 0).toLocaleString('en-IN')}</td>
                    <td style={{ color: b.remainingPaid ? 'var(--gray-400)' : '#E53935', fontWeight: 600 }}>
                      ₹{outstandingAmount.toLocaleString('en-IN')}
                    </td>
                    <td>
                      {b.remainingPaid ? (
                        <span className="status-pill status-completed">Completed</span>
                      ) : (
                        <span className="status-pill status-pending">Pending</span>
                      )}
                    </td>
                  </tr>
                );
              })}
              {(stats.outstandingBookings || []).length === 0 && (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', color: 'var(--gray-500)', padding: '36px 0' }}>
                    No bookings found in ledger.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
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
    return <PageLoader message={`Loading ${title}...`} />
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

function AdminBuddyRequests() {
  const [bookings, setBookings] = useState([])
  const [providers, setProviders] = useState([])
  const [loading, setLoading] = useState(true)
  const [assigningId, setAssigningId] = useState(null)
  const [selectedProvider, setSelectedProvider] = useState({})

  const loadData = async () => {
    try {
      const bData = await api.getBookings()
      const pData = await api.getAdminProviders()
      const requests = bData.filter(b => b.changeBuddyRequested === true)
      setBookings(requests)
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

  const handleReassign = async (bookingId) => {
    const providerId = selectedProvider[bookingId]
    if (!providerId) {
      alert('Please select a buddy to assign.')
      return
    }
    setAssigningId(bookingId)
    try {
      await api.reassignBuddy(bookingId, providerId)
      alert('Buddy reassigned successfully!')
      loadData()
    } catch (err) {
      console.error(err)
      alert('Failed to reassign buddy: ' + err.message)
    } finally {
      setAssigningId(null)
    }
  }

  if (loading) return <PageLoader message="Loading buddy change requests..." />

  return (
    <div className="dash-content">
      <h2 className="dash-page-title">Buddy Change Requests</h2>
      <div className="dash-card">
        <div className="orders-table-wrap">
          {bookings.length === 0 ? (
            <p style={{ padding: '40px', textAlign: 'center', color: 'var(--gray-500)' }}>No pending buddy change requests.</p>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Customer</th>
                  <th>Original Buddy</th>
                  <th>Reason for Request</th>
                  <th>Select New Buddy</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map(b => (
                  <tr key={b._id}>
                    <td className="mono">{b.bookingId}</td>
                    <td>
                      <div><strong>{b.client?.firstName} {b.client?.lastName}</strong></div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--gray-400)' }}>{b.client?.email}</div>
                    </td>
                    <td>
                      {b.provider ? (
                        <div>
                          <div><strong>{b.provider.firstName} {b.provider.lastName}</strong></div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--gray-400)' }}>Rating: {b.provider.rating}⭐</div>
                        </div>
                      ) : (
                        'Unassigned'
                      )}
                    </td>
                    <td>
                      <div style={{
                        maxWidth: '250px',
                        whiteSpace: 'normal',
                        wordBreak: 'break-word',
                        color: '#E53935',
                        fontWeight: 500,
                        fontSize: '0.85rem'
                      }}>
                        {b.changeBuddyReason || 'No reason provided'}
                      </div>
                    </td>
                    <td>
                      <select
                        value={selectedProvider[b._id] || ''}
                        onChange={(e) => setSelectedProvider({ ...selectedProvider, [b._id]: e.target.value })}
                        className="form-input"
                        style={{ padding: '4px 8px', fontSize: '0.85rem', width: '200px' }}
                      >
                        <option value="">-- Choose Active Buddy --</option>
                        {providers
                          .filter(p => !b.provider || p._id !== b.provider._id)
                          .map(p => (
                            <option key={p._id} value={p._id}>
                              {p.firstName} {p.lastName} ({p.skills?.slice(0,2).join(', ')})
                            </option>
                          ))}
                      </select>
                    </td>
                    <td>
                      <button
                        onClick={() => handleReassign(b._id)}
                        disabled={assigningId === b._id}
                        className="btn-primary"
                        style={{
                          padding: '6px 12px',
                          fontSize: '0.8rem',
                          background: '#E53935',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        {assigningId === b._id ? 'Reassigning...' : 'Reassign Buddy'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}

function AdminMessagesTrace() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const loadData = async () => {
    try {
      const data = await api.getAdminMessages()
      setMessages(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const filteredMessages = messages.filter(m => {
    const senderName = `${m.sender?.firstName || ''} ${m.sender?.lastName || ''}`.toLowerCase()
    const receiverName = `${m.receiver?.firstName || ''} ${m.receiver?.lastName || ''}`.toLowerCase()
    const text = (m.text || '').toLowerCase()
    const query = search.toLowerCase()
    return senderName.includes(query) || receiverName.includes(query) || text.includes(query)
  })

  if (loading) return <PageLoader message="Loading message audit logs..." />

  return (
    <div className="dash-content">
      <div className="dash-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 className="dash-page-title" style={{ margin: 0 }}>Chat Message Audit Logs</h2>
        <div className="search-box" style={{ width: '300px' }}>
          <Search size={16} />
          <input
            type="text"
            placeholder="Search by sender, receiver, text..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-input search-input"
          />
        </div>
      </div>

      <div className="dash-card">
        <div className="orders-table-wrap">
          {filteredMessages.length === 0 ? (
            <p style={{ padding: '40px', textAlign: 'center', color: 'var(--gray-500)' }}>No message logs found matching search.</p>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Sender</th>
                  <th>Receiver</th>
                  <th>Message Content</th>
                </tr>
              </thead>
              <tbody>
                {filteredMessages.map(m => (
                  <tr key={m._id}>
                    <td style={{ fontSize: '0.8rem', color: 'var(--gray-400)' }}>
                      {new Date(m.createdAt).toLocaleString()}
                    </td>
                    <td>
                      <div><strong>{m.sender?.firstName} {m.sender?.lastName}</strong></div>
                      <div style={{
                        display: 'inline-block',
                        fontSize: '0.65rem',
                        padding: '1px 4px',
                        background: m.sender?.role === 'customer' ? 'rgba(30,136,229,0.1)' : 'rgba(67,160,71,0.1)',
                        color: m.sender?.role === 'customer' ? '#1E88E5' : '#43A047',
                        borderRadius: '3px',
                        fontWeight: 600
                      }}>
                        {m.sender?.role}
                      </div>
                    </td>
                    <td>
                      <div><strong>{m.receiver?.firstName} {m.receiver?.lastName}</strong></div>
                      <div style={{
                        display: 'inline-block',
                        fontSize: '0.65rem',
                        padding: '1px 4px',
                        background: m.receiver?.role === 'customer' ? 'rgba(30,136,229,0.1)' : 'rgba(67,160,71,0.1)',
                        color: m.receiver?.role === 'customer' ? '#1E88E5' : '#43A047',
                        borderRadius: '3px',
                        fontWeight: 600
                      }}>
                        {m.receiver?.role}
                      </div>
                    </td>
                    <td style={{
                      whiteSpace: 'normal',
                      wordBreak: 'break-word',
                      fontSize: '0.9rem',
                      color: 'var(--gray-700)',
                      maxWidth: '400px'
                    }}>
                      {m.text}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
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

  const handleBuddyReassign = async (bookingId, providerId) => {
    if (!providerId) return
    try {
      await api.reassignBuddy(bookingId, providerId)
      await loadData()
    } catch (err) {
      console.error(err)
      alert('Failed to reassign buddy: ' + err.message)
    }
  }

  const filtered = bookings.filter(b => 
    JSON.stringify(b).toLowerCase().includes(search.toLowerCase())
  )

  if (loading) {
    return (
      <div className="dash-content">
        <div className="sk-box sk-page-title" style={{ marginBottom: '28px' }}></div>
        <div className="dash-card">
          <TableSkeleton rows={6} cols={8} />
        </div>
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#1E88E5', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', overflow: 'hidden', flexShrink: 0 }}>
                        {b.client?.avatar ? (
                          <img src={b.client.avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          b.client?.firstName?.[0] || 'C'
                        )}
                      </div>
                      <div>
                        <div className="font-bold">{b.client?.firstName} {b.client?.lastName}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--gray-400)' }}>{b.client?.email}</div>
                      </div>
                    </div>
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
                    {/* Buddy-change request alert box shown above the dropdown */}
                    {b.changeBuddyRequested && (
                      <div style={{
                        marginBottom: '8px',
                        padding: '8px 10px',
                        borderRadius: '8px',
                        background: 'rgba(229,57,53,0.08)',
                        border: '1px solid rgba(229,57,53,0.35)',
                        fontSize: '0.75rem',
                        color: '#E53935'
                      }}>
                        <div style={{ fontWeight: 700, marginBottom: '3px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <AlertTriangle size={12} /> Change Requested
                        </div>
                        <div style={{ color: 'rgba(229,57,53,0.85)', marginBottom: '6px', fontStyle: 'italic' }}>
                          "{b.changeBuddyReason || 'No reason given'}"
                        </div>
                        <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                          <select
                            defaultValue=""
                            onChange={(e) => handleBuddyReassign(b._id, e.target.value)}
                            style={{
                              flex: 1,
                              padding: '3px 6px',
                              fontSize: '0.73rem',
                              background: '#1a1a2e',
                              color: 'white',
                              border: '1px solid rgba(229,57,53,0.4)',
                              borderRadius: '4px',
                              cursor: 'pointer'
                            }}
                          >
                            <option value="">Pick new buddy...</option>
                            {providers
                              .filter(p => !b.provider || p._id !== b.provider?._id)
                              .map(p => (
                                <option key={p._id} value={p._id}>
                                  {p.firstName} {p.lastName}
                                </option>
                              ))}
                          </select>
                        </div>
                      </div>
                    )}
                    {/* Normal assigned buddy dropdown */}
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
                      {['Active', 'In-Progress'].includes(b.status) && (
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

function AdminUserActivity() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        setLoading(true)
        const res = await api.getAdminUserActivity(id)
        setData(res)
      } catch (err) {
        console.error(err)
        setError('Failed to compile activity records for this user.')
      } finally {
        setLoading(false)
      }
    }
    fetchActivity()
  }, [id])

  if (loading) {
    return <PageLoader message="Analyzing user operational registry..." />
  }

  if (error || !data) {
    return (
      <div className="dash-content">
        <button 
          onClick={() => navigate(-1)} 
          style={{ 
            background: 'var(--primary)', 
            border: 'none', 
            color: 'white', 
            padding: '8px 16px', 
            borderRadius: '6px', 
            cursor: 'pointer',
            fontWeight: 600,
            marginBottom: '20px'
          }}
        >
          ← Back to Directory
        </button>
        <div className="dash-card" style={{ padding: '40px', textAlign: 'center' }}>
          <p style={{ color: 'var(--danger)', fontWeight: 600 }}>{error || 'User not found'}</p>
        </div>
      </div>
    )
  }

  const { user, bookings } = data

  return (
    <div className="dash-content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 className="dash-page-title" style={{ margin: 0 }}>User Activity Profile</h2>
        <button 
          onClick={() => navigate(-1)} 
          style={{ 
            background: 'rgba(255,255,255,0.08)', 
            border: '1px solid rgba(255,255,255,0.1)', 
            color: 'var(--gray-700)', 
            padding: '8px 16px', 
            borderRadius: '6px', 
            cursor: 'pointer',
            fontWeight: 600
          }}
        >
          ← Back
        </button>
      </div>

      {/* User Information Profile Card */}
      <div className="dash-card" style={{ marginBottom: '28px', background: 'linear-gradient(135deg, #1e1e38 0%, #15152b 100%)', border: '1px solid rgba(255,255,255,0.08)', color: 'white' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ 
            width: '64px', 
            height: '64px', 
            borderRadius: '12px', 
            background: user.role === 'provider' ? '#43A047' : '#1E88E5', 
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden'
          }}>
            {user.avatar ? (
              <img src={user.avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <span style={{ fontSize: '1.8rem' }}>{user.role === 'provider' ? '🛡️' : '👤'}</span>
            )}
          </div>
          <div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0, color: 'white' }}>
              {user.firstName} {user.lastName}
            </h3>
            <span className="status-pill status-active" style={{ textTransform: 'capitalize', marginTop: '6px', display: 'inline-block' }}>
              {user.role} Account
            </span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginTop: '24px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email Address</div>
            <div style={{ fontSize: '1rem', fontWeight: 600, marginTop: '4px', wordBreak: 'break-all', color: 'white' }}>{user.email}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Phone Number</div>
            <div style={{ fontSize: '1rem', fontWeight: 600, marginTop: '4px', color: 'white' }}>{user.phone || 'Not Provided'}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Account ID</div>
            <div className="mono" style={{ fontSize: '0.9rem', fontWeight: 600, marginTop: '4px', color: 'var(--gray-300)' }}>{user._id}</div>
          </div>
        </div>
      </div>

      {/* Operational Service History Ledger */}
      <div className="dash-card">
        <div className="dash-card-header" style={{ borderBottom: '1px solid var(--gray-100)', paddingBottom: '14px', marginBottom: '16px' }}>
          <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            💼 Operations, Scheduling & Escrow Ledger
          </h3>
          <span className="status-pill status-active" style={{ fontSize: '0.78rem' }}>
            {bookings.length} Booking Records
          </span>
        </div>

        <div className="orders-table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Service Detail</th>
                <th>Date & Time</th>
                <th>Client Details</th>
                <th>Assigned Buddy</th>
                <th>Escrow Breakdown</th>
                <th>Operation State</th>
                <th>Payment Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b._id}>
                  <td className="mono font-bold">{b.bookingId}</td>
                  <td>
                    <div className="font-bold">{b.service?.name}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--gray-500)' }}>{b.service?.category}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{b.date}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--gray-500)' }}>{b.time} ({b.hours} hrs)</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{b.client?.firstName} {b.client?.lastName}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--gray-400)' }}>{b.client?.phone}</div>
                  </td>
                  <td>
                    {b.provider ? (
                      <div>
                        <div style={{ fontWeight: 600 }}>{b.provider?.firstName} {b.provider?.lastName}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--gray-400)' }}>{b.provider?.phone}</div>
                      </div>
                    ) : (
                      <span style={{ color: '#FF9800', fontStyle: 'italic', fontWeight: 600 }}>Unassigned</span>
                    )}
                  </td>
                  <td>
                    <div style={{ fontWeight: 700 }}>Total: ₹{b.totalCost?.toLocaleString('en-IN')}</div>
                    <div style={{ fontSize: '0.78rem', color: '#43A047', fontWeight: 600 }}>Deposit (20%): ₹{b.depositPaid?.toLocaleString('en-IN')}</div>
                  </td>
                  <td>
                    <span className={`status-pill status-${(b.status || '').toLowerCase()}`}>{b.status}</span>
                  </td>
                  <td>
                    {b.remainingPaid ? (
                      <span className="status-pill status-active" style={{ fontSize: '0.75rem' }}>Fully Paid (100%)</span>
                    ) : (
                      <span className="status-pill status-pending" style={{ fontSize: '0.75rem' }}>Deposit Secured (20%)</span>
                    )}
                  </td>
                </tr>
              ))}
              {bookings.length === 0 && (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', color: 'var(--gray-500)', padding: '36px 0' }}>
                    📭 No active, running, or completed booking records logged for this user.
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

function AdminEnquiries() {
  const [enquiries, setEnquiries] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const loadEnquiries = async () => {
    try {
      const data = await api.getEnquiries()
      setEnquiries(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadEnquiries()
  }, [])

  const handleStatusUpdate = async (id, status) => {
    try {
      await api.updateEnquiryStatus(id, status)
      await loadEnquiries()
    } catch (err) {
      console.error(err)
    }
  }

  const filtered = enquiries.filter(e => 
    JSON.stringify(e).toLowerCase().includes(search.toLowerCase())
  )

  if (loading) {
    return <PageLoader message="Loading contact enquiries..." />
  }

  return (
    <div className="dash-content">
      <h2 className="dash-page-title">Contact Enquiries</h2>
      
      <div className="dash-card">
        <div className="table-toolbar">
          <div className="table-search">
            <Search size={16}/>
            <input 
              className="form-input" 
              placeholder="Search enquiries..." 
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
                <th>Date</th>
                <th>Name</th>
                <th>Contact Details</th>
                <th>Subject</th>
                <th>Message</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((e) => (
                <tr key={e._id}>
                  <td>{new Date(e.createdAt).toLocaleDateString()}</td>
                  <td className="font-bold">{e.name}</td>
                  <td>
                    <div>{e.email}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--gray-500)' }}>{e.phone || 'No phone'}</div>
                  </td>
                  <td className="font-bold">{e.subject}</td>
                  <td style={{ maxWidth: '300px', whiteSpace: 'normal', fontSize: '0.85rem' }}>{e.message}</td>
                  <td>
                    <span className={`status-pill status-${e.status === 'Resolved' ? 'active' : e.status === 'In-Progress' ? 'pending' : 'done'}`} style={{ fontSize: '0.78rem' }}>
                      {e.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      {e.status !== 'Resolved' && (
                        <>
                          {e.status === 'New' && (
                            <button
                              onClick={() => handleStatusUpdate(e._id, 'In-Progress')}
                              style={{
                                background: 'rgba(251,140,0,0.1)',
                                border: '1px solid rgba(251,140,0,0.2)',
                                color: '#FB8C00',
                                padding: '4px 8px',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '0.75rem',
                                fontWeight: 600
                              }}
                            >
                              In Progress
                            </button>
                          )}
                          <button
                            onClick={() => handleStatusUpdate(e._id, 'Resolved')}
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
                            Resolve
                          </button>
                        </>
                      )}
                      {e.status === 'Resolved' && (
                        <span style={{ color: 'var(--gray-500)', fontSize: '0.78rem' }}>Closed</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', color: 'var(--gray-500)', padding: '24px' }}>
                    No matching enquiries registered.
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

function AdminLogs() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const data = await api.getAdminLogs()
        setLogs(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchLogs()
  }, [])

  const filtered = logs.filter(l =>
    JSON.stringify(l).toLowerCase().includes(search.toLowerCase())
  )

  if (loading) {
    return <PageLoader message="Loading activity logs registry..." />
  }

  return (
    <div className="dash-content">
      <h2 className="dash-page-title">User & Provider Activity Registry</h2>
      
      <div className="dash-card">
        <div className="table-toolbar">
          <div className="table-search">
            <Search size={16}/>
            <input 
              className="form-input" 
              placeholder="Search logs by email, name, role or action..." 
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
                <th>Timestamp</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Action</th>
                <th>Details</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((log) => (
                <tr key={log._id}>
                  <td>{new Date(log.timestamp).toLocaleString()}</td>
                  <td>{log.name}</td>
                  <td>{log.email}</td>
                  <td style={{ textTransform: 'capitalize' }}>{log.role}</td>
                  <td>
                    <span style={{
                      fontWeight: 600,
                      color: log.action === 'Login' ? '#43A047' : log.action === 'Auto-Logout' ? '#E53935' : '#FB8C00'
                    }}>
                      {log.action}
                    </span>
                  </td>
                  <td>{log.details || '-'}</td>
                  <td>
                    <span className="status-pill status-active">Recorded</span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', color: 'var(--gray-500)', padding: '24px' }}>
                    No activity logs recorded.
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

export default function AdminPanel() {
  const navigate = useNavigate()
  const location = useLocation()
  const authenticated = api.isAuthenticated() && api.getUser()?.role === 'admin'

  useEffect(() => {
    if (!authenticated) {
      navigate('/login', { state: { from: location.pathname + location.search } })
    }
  }, [authenticated, navigate, location.pathname, location.search])

  const [sideOpen, setSideOpen] = useState(false)
  const [stats, setStats] = useState(null)

  const loadStats = async () => {
    try {
      const data = await api.getAdminStats()
      setStats(data)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    if (authenticated) {
      loadStats()
    }
  }, [authenticated])

  const handleLogout = () => {
    api.logout()
    navigate('/')
  }

  if (!authenticated) {
    return null
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
          <div className="dash-user-avatar" style={{background:'#E53935', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden'}}>
            {api.getUser()?.avatar ? (
              <img src={api.getUser().avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              getInitials()
            )}
          </div>
          <div>
            <div className="dash-user-name">Super Admin</div>
            <div className="dash-user-role">Full Access Ledger</div>
          </div>
        </div>

        <nav className="dash-nav">
          {NAV.map(n => (
            <Link key={n.path} to={n.path} className={`dash-nav-link ${location.pathname === n.path ? 'dash-nav-active' : ''}`}>
              {n.icon} <span>{n.label}</span>
              {n.badge && stats && stats[n.badge] > 0 && (
                <span className="badge" style={{
                  background: '#E53935',
                  color: 'white',
                  borderRadius: '10px',
                  padding: '1px 6px',
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  marginLeft: 'auto'
                }}>
                  {stats[n.badge]}
                </span>
              )}
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
          <Route path="buddy-requests" element={<AdminRequests/>}/>
          <Route path="messages-trace" element={<AdminMessagesTrace/>}/>
          
          <Route 
            path="users" 
            element={
              <UserTable 
                title="Platform Customers" 
                fetchFn={api.getAdminUsers} 
                cols={['ID', 'Full Name', 'Email', 'Phone', 'Last Login', 'Role', 'Status', 'Audit']} 
                mapRow={r => [
                  r._id ? r._id.substring(r._id.length - 6).toUpperCase() : 'N/A', 
                  <Link to={`/admin/users/${r._id}`} style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#1E88E5', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', overflow: 'hidden', flexShrink: 0 }}>
                      {r.avatar ? (
                        <img src={r.avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        r.firstName?.[0] || 'U'
                      )}
                    </div>
                    {r.firstName} {r.lastName}
                  </Link>,
                  r.email,
                  r.phone || 'N/A', 
                  r.lastLogin ? new Date(r.lastLogin).toLocaleString() : 'Never',
                  r.role, 
                  <span className="status-pill status-active">Active</span>
                ]}
              />
            }
          />
          <Route path="users/:id" element={<AdminUserActivity />} />
          
          <Route 
            path="providers" 
            element={
              <UserTable 
                title="Service Buddies" 
                fetchFn={api.getAdminProviders} 
                cols={['ID', 'Name', 'Email', 'Phone', 'Earnings', 'Last Login', 'Status', 'Audit']} 
                mapRow={r => [
                  r._id ? r._id.substring(r._id.length - 6).toUpperCase() : 'N/A', 
                  <Link to={`/admin/users/${r._id}`} style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#43A047', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', overflow: 'hidden', flexShrink: 0 }}>
                      {r.avatar ? (
                        <img src={r.avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        r.firstName?.[0] || 'P'
                      )}
                    </div>
                    {r.firstName} {r.lastName}
                  </Link>,
                  r.email,
                  r.phone || 'N/A', 
                  `₹${(r.earnings || 0).toLocaleString('en-IN')}`, 
                  r.lastLogin ? new Date(r.lastLogin).toLocaleString() : 'Never',
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
                cols={['TX ID', 'Customer Account', 'Assigned Buddy', 'Accepted State', 'Total Cost', 'Secured Deposit', 'Remaining Balance', 'Schedule Date', 'Method', 'State', 'Audit']} 
                mapRow={r => [
                  r._id, 
                  r.user, 
                  r.provider || <span style={{ color: '#FF9800', fontStyle: 'italic', fontWeight: 600 }}>Unassigned</span>,
                  r.status === 'Pending' ? (
                    <span style={{ color: '#FF9800', fontWeight: 600 }}>⌛ Pending Accept</span>
                  ) : r.status === 'Declined' ? (
                    <span style={{ color: '#E53935', fontWeight: 600 }}>❌ Declined</span>
                  ) : (
                    <span style={{ color: '#43A047', fontWeight: 600 }}>✓ Accepted</span>
                  ),
                  `₹${r.totalCost.toLocaleString('en-IN')}`,
                  `₹${(r.depositPaid || (r.totalCost * 0.2)).toLocaleString('en-IN')}`,
                  r.remainingPaid ? (
                    <span style={{ color: '#43A047', fontWeight: 600 }}>Paid (₹{(r.totalCost * 0.8).toLocaleString('en-IN')})</span>
                  ) : (
                    <span style={{ color: '#E53935', fontWeight: 600 }}>Pending (₹{(r.totalCost * 0.8).toLocaleString('en-IN')})</span>
                  ),
                  r.date, 
                  r.method, 
                  <span className={`status-pill status-${r.status === 'In-Progress' ? 'in-progress' : (r.status === 'Paid' || r.status === 'Active' || r.status === 'Completed' ? 'active' : r.status === 'Declined' ? 'done' : 'pending')}`}>{r.status}</span>
                ]}
              />
            }
          />

          <Route path="logs" element={<AdminLogs/>}/>
          <Route path="enquiries" element={<AdminEnquiries/>}/>
          <Route path="settings" element={<Placeholder title="Settings"/>}/>
        </Routes>
      </main>
    </div>
  )
}
