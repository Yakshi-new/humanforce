import { useState, useEffect, useRef } from 'react'
import { Link, Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { LayoutDashboard, ShoppingBag, MessageSquare, Bell, CreditCard, Settings, LogOut, Zap, Clock, Star, ArrowRight, Menu, X, Send } from 'lucide-react'
import { api } from '../utils/api'
import './Dashboard.css'

const NAV = [
  { icon: <LayoutDashboard size={18}/>, label: 'Dashboard', path: '/dashboard' },
  { icon: <ShoppingBag size={18}/>, label: 'My Orders', path: '/dashboard/orders' },
  { icon: <MessageSquare size={18}/>, label: 'Messages', path: '/dashboard/messages' },
  { icon: <Bell size={18}/>, label: 'Notifications', path: '/dashboard/notifications' },
  { icon: <CreditCard size={18}/>, label: 'Payments', path: '/dashboard/payments' },
  { icon: <Settings size={18}/>, label: 'Settings', path: '/dashboard/settings' },
]

function DashHome({ bookings }) {
  const activeCount = bookings.filter(b => ['Pending', 'Active'].includes(b.status)).length
  const totalSpent = bookings
    .filter(b => ['Active', 'Completed'].includes(b.status))
    .reduce((sum, b) => sum + (b.totalCost || 0), 0)
  const totalHours = bookings.reduce((sum, b) => sum + (b.hours || 0), 0)

  // Active providers based on current bookings
  const activeProviders = bookings
    .filter(b => b.status === 'Active' && b.provider)
    .map(b => b.provider)
    // De-duplicate
    .filter((v, i, a) => a.findIndex(t => t._id === v._id) === i)

  return (
    <div className="dash-content">
      <h2 className="dash-page-title">Dashboard</h2>
      
      <div className="dash-widgets">
        {[
          { icon: <ShoppingBag size={22}/>, label:'Active Bookings', value: activeCount, trend:'Ready to serve', color:'#E53935' },
          { icon: <CreditCard size={22}/>, label:'Total Invested', value: `₹${totalSpent.toLocaleString('en-IN')}`, trend:'Escrow secured', color:'#1E88E5' },
          { icon: <Star size={22}/>, label:'Avg. Service Rating', value:'4.9', trend:'From verified reviews', color:'#FFC107' },
          { icon: <Clock size={22}/>, label:'Hours Contracted', value: `${totalHours} hrs`, trend:'Total logged time', color:'#43A047' },
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
          <div className="dash-card-header">
            <h3>Recent Bookings</h3>
            <Link to="/dashboard/orders" className="view-all">View all</Link>
          </div>
          <div className="orders-table-wrap">
            {bookings.length === 0 ? (
              <p style={{ padding: '20px', textAlign: 'center', color: 'var(--gray-500)' }}>No bookings registered yet.</p>
            ) : (
              <table className="data-table">
                <thead><tr><th>ID</th><th>Service</th><th>Status</th><th>Total</th></tr></thead>
                <tbody>
                  {bookings.slice(0, 4).map(o => (
                    <tr key={o._id}>
                      <td className="mono">{o.bookingId}</td>
                      <td>{o.service?.name || 'General Support'}</td>
                      <td>
                        <span className={`status-pill status-${(o.status || 'Pending').toLowerCase()}`}>
                          {o.status}
                        </span>
                      </td>
                      <td className="font-bold">
                        <div>₹{o.totalCost?.toLocaleString('en-IN')}</div>
                        <div style={{ fontSize: '0.74rem', color: '#43A047', fontWeight: 500 }}>Paid 20%: ₹{(o.depositPaid || (o.totalCost * 0.2))?.toLocaleString('en-IN')}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="dash-card">
          <div className="dash-card-header"><h3>Your Buddies</h3></div>
          <div className="active-services">
            {activeProviders.length === 0 ? (
              <p style={{ padding: '20px', textAlign: 'center', color: 'var(--gray-500)' }}>No active buddies assigned at the moment.</p>
            ) : (
              activeProviders.map((p, i) => (
                <div key={p._id || i} className="active-svc-row">
                  <div className="svc-pro-avatar" style={{ background: '#E53935', color: 'white' }}>
                    {p.firstName?.[0] || 'B'}
                  </div>
                  <div className="svc-pro-info">
                    <div className="svc-pro-name">{p.firstName} {p.lastName}</div>
                    <div className="svc-pro-role">{p.phone}</div>
                  </div>
                  <Link to="/dashboard/messages" className="status-pill status-active" style={{ textDecoration: 'none' }}>
                    Chat
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="dash-card">
        <div className="dash-card-header"><h3>Recent System Activity</h3></div>
        <div className="activity-feed">
          {bookings.length === 0 ? (
            <p style={{ padding: '20px', color: 'var(--gray-500)' }}>Account is newly created. Welcome to HumanForce!</p>
          ) : (
            bookings.slice(0, 3).map((b, i) => (
              <div key={b._id} className="activity-item">
                <span className="activity-icon">{b.status === 'Completed' ? '✅' : b.status === 'Declined' ? '❌' : '📦'}</span>
                <div className="activity-text">
                  {b.status === 'Pending' ? `Booking request ${b.bookingId} generated for ${b.service?.name}` : `Booking status updated to ${b.status} for ${b.bookingId}`}
                </div>
                <div className="activity-time">{new Date(b.createdAt).toLocaleDateString()}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

function DashOrders({ bookings, onStatusUpdate }) {
  return (
    <div className="dash-content">
      <h2 className="dash-page-title">My Bookings</h2>
      <div className="dash-card">
        <div className="orders-table-wrap">
          {bookings.length === 0 ? (
            <p style={{ padding: '40px', textAlign: 'center', color: 'var(--gray-500)' }}>You have no bookings recorded. Visit the services section to hire a buddy.</p>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Service</th>
                  <th>Assigned Buddy</th>
                  <th>Scheduled Date</th>
                  <th>Hours</th>
                  <th>Status</th>
                  <th>Amount</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map(o => (
                  <tr key={o._id}>
                    <td className="mono">{o.bookingId}</td>
                    <td>
                      <div className="font-bold">{o.service?.name}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--gray-400)' }}>{o.service?.category}</div>
                    </td>
                    <td>{o.provider ? `${o.provider.firstName} ${o.provider.lastName}` : <span style={{ color: 'var(--gray-400)', fontSize: '0.82rem' }}>Assigning...</span>}</td>
                    <td>
                      <div>{o.date}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--gray-400)' }}>{o.time}</div>
                    </td>
                    <td>{o.hours} hrs</td>
                    <td>
                      <span className={`status-pill status-${(o.status || 'Pending').toLowerCase()}`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="font-bold">
                      <div className="text-primary">₹{o.totalCost?.toLocaleString('en-IN')}</div>
                      <div style={{ fontSize: '0.74rem', color: '#43A047', fontWeight: 600 }}>Deposit: ₹{(o.depositPaid || (o.totalCost * 0.2))?.toLocaleString('en-IN')}</div>
                    </td>
                    <td>
                      {o.status === 'Pending' && (
                        <button
                          onClick={() => onStatusUpdate(o._id, 'Declined')}
                          style={{
                            background: 'rgba(229,57,53,0.1)',
                            border: '1px solid rgba(229,57,53,0.2)',
                            color: '#E53935',
                            padding: '4px 10px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '0.78rem'
                          }}
                        >
                          Cancel
                        </button>
                      )}
                      {o.status === 'Active' && (
                        <button
                          onClick={() => onStatusUpdate(o._id, 'Completed')}
                          style={{
                            background: 'rgba(67,160,71,0.1)',
                            border: '1px solid rgba(67,160,71,0.2)',
                            color: '#43A047',
                            padding: '4px 10px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '0.78rem'
                          }}
                        >
                          Complete
                        </button>
                      )}
                      {['Completed', 'Declined'].includes(o.status) && (
                        <span style={{ fontSize: '0.8rem', color: 'var(--gray-500)' }}>Archive</span>
                      )}
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

function DashMessages() {
  const [threads, setThreads] = useState([])
  const [activeThread, setActiveThread] = useState(null)
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(true)
  const pollInterval = useRef(null)
  const chatEndRef = useRef(null)

  const loadThreads = async () => {
    try {
      const data = await api.getConversations()
      setThreads(data)
      if (data.length > 0 && !activeThread) {
        setActiveThread(data[0])
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const loadChat = async (userId) => {
    try {
      const chat = await api.getChatHistory(userId)
      setMessages(chat)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    loadThreads()
  }, [])

  useEffect(() => {
    if (activeThread?.user?._id) {
      loadChat(activeThread.user._id)

      // Start Polling for fresh messages
      if (pollInterval.current) clearInterval(pollInterval.current)
      pollInterval.current = setInterval(() => {
        loadChat(activeThread.user._id)
      }, 3000)
    }

    return () => {
      if (pollInterval.current) clearInterval(pollInterval.current)
    }
  }, [activeThread])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async (e) => {
    e.preventDefault()
    if (!text.trim() || !activeThread?.user?._id) return

    try {
      const tempText = text
      setText('')
      await api.sendMessage(activeThread.user._id, tempText)
      await loadChat(activeThread.user._id)
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) {
    return (
      <div className="dash-content" style={{ textAlign: 'center', padding: '60px 0' }}>
        <p>Opening chat terminal...</p>
      </div>
    )
  }

  return (
    <div className="dash-content">
      <h2 className="dash-page-title">Messages</h2>
      
      {threads.length === 0 ? (
        <div className="dash-card" style={{ padding: '60px', textAlign: 'center' }}>
          <p style={{ color: 'var(--gray-500)' }}>Your mailbox is empty. Book a buddy to start chatting!</p>
        </div>
      ) : (
        <div className="messages-layout">
          <div className="convos-list">
            {threads.map((c, i) => (
              <div 
                key={c.user?._id || i} 
                className={`convo-item ${activeThread?.user?._id === c.user?._id ? 'convo-active' : ''}`} 
                onClick={() => setActiveThread(c)}
              >
                <div className="convo-avatar" style={{ background: '#E53935', color: 'white' }}>
                  {c.user?.firstName?.[0] || 'B'}
                </div>
                <div className="convo-info">
                  <div className="convo-name-row">
                    <span className="convo-name">{c.user?.firstName} {c.user?.lastName}</span>
                    <span className="convo-time">{new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <div className="convo-role" style={{ textTransform: 'capitalize' }}>{c.user?.role}</div>
                  <div className="convo-last">{c.lastMessage}</div>
                </div>
              </div>
            ))}
          </div>

          {activeThread && (
            <div className="chat-panel">
              <div className="chat-panel-header">
                <div className="convo-avatar" style={{ background: '#E53935', color: 'white' }}>
                  {activeThread.user?.firstName?.[0]}
                </div>
                <div>
                  <div className="font-bold">{activeThread.user?.firstName} {activeThread.user?.lastName}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--gray-500)' }}>{activeThread.user?.email}</div>
                </div>
              </div>

              <div className="chat-messages-area">
                {messages.map((m) => {
                  const isCurrentUser = m.sender._id.toString() !== activeThread.user._id.toString()
                  return (
                    <div key={m._id} className={`chat-msg ${isCurrentUser ? 'user' : 'bot'}`}>
                      <div className="msg-bubble">
                        {m.text}
                      </div>
                    </div>
                  )
                })}
                <div ref={chatEndRef} />
              </div>

              <form className="chat-input-row" onSubmit={handleSend}>
                <input 
                  className="form-input" 
                  placeholder="Type secure escrow message..." 
                  style={{ flex: 1 }}
                  value={text}
                  onChange={e => setText(e.target.value)}
                />
                <button type="submit" className="btn-primary" style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Send size={14} /> Send
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function DashPlaceholder({ title }) {
  return <div className="dash-content"><h2 className="dash-page-title">{title}</h2><div className="dash-card"><p style={{color:'var(--gray-500)',textAlign:'center',padding:'40px'}}>Secure billing & integration coming soon in future release.</p></div></div>
}

export default function UserDashboard() {
  const [sideOpen, setSideOpen] = useState(false)
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()
  
  const user = api.getUser()

  const loadBookings = async () => {
    try {
      const data = await api.getBookings()
      setBookings(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Route guard
    if (!api.isAuthenticated()) {
      navigate('/login')
      return
    }
    loadBookings()
  }, [])

  const handleStatusUpdate = async (bookingId, status) => {
    try {
      await api.updateBookingStatus(bookingId, status)
      await loadBookings()
    } catch (err) {
      console.error(err)
    }
  }

  const handleLogout = () => {
    api.logout()
    navigate('/')
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--gray-950)' }}>
        <p style={{ color: '#E53935' }}>Retrieving account status...</p>
      </div>
    )
  }

  const getInitials = () => {
    if (!user) return 'HF'
    return `${(user.firstName || '')[0] || ''}${(user.lastName || '')[0] || ''}`.toUpperCase()
  }

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
          <div className="dash-user-avatar" style={{ background: '#E53935', color: 'white' }}>
            {getInitials()}
          </div>
          <div>
            <div className="dash-user-name">{user ? `${user.firstName} ${user.lastName}` : 'Guest User'}</div>
            <div className="dash-user-role" style={{ textTransform: 'capitalize' }}>{user ? `${user.role} Portal` : 'Customer'}</div>
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
          <Route index element={<DashHome bookings={bookings} />} />
          <Route path="orders" element={<DashOrders bookings={bookings} onStatusUpdate={handleStatusUpdate} />} />
          <Route path="messages" element={<DashMessages />} />
          <Route path="notifications" element={<DashPlaceholder title="Notifications"/>} />
          <Route path="payments" element={<DashPlaceholder title="Payments"/>} />
          <Route path="settings" element={<DashPlaceholder title="Settings"/>} />
        </Routes>
      </main>
    </div>
  )
}
