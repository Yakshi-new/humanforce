import { useState, useEffect, useRef } from 'react'
import { Link, Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { User, Calendar, Inbox, DollarSign, MessageSquare, Star, LogOut, Zap, Clock, CheckCircle, Menu, X, Send } from 'lucide-react'
import { api } from '../utils/api'
import './Dashboard.css'
import './ProviderDashboard.css'

const NAV = [
  { icon: <User size={18}/>, label: 'My Profile', path: '/provider' },
  { icon: <Calendar size={18}/>, label: 'Bookings', path: '/provider/bookings' },
  { icon: <Inbox size={18}/>, label: 'Incoming Requests', path: '/provider/requests' },
  { icon: <DollarSign size={18}/>, label: 'Earnings & Payouts', path: '/provider/earnings' },
  { icon: <MessageSquare size={18}/>, label: 'Client Messages', path: '/provider/messages' },
  { icon: <Star size={18}/>, label: 'Reviews', path: '/provider/reviews' },
]

function ProviderHome({ user, bookings }) {
  const activeBookingsCount = bookings.filter(b => b.status === 'Active').length
  const completedBookings = bookings.filter(b => b.status === 'Completed')
  const totalHours = completedBookings.reduce((sum, b) => sum + (b.hours || 0), 0)

  return (
    <div className="dash-content">
      <h2 className="dash-page-title">My Profile</h2>
      <div className="provider-profile-card dash-card" style={{marginBottom:'24px'}}>
        <div className="provider-header">
          <div className="provider-big-avatar" style={{ background: '#E53935', color: 'white' }}>
            {user.firstName?.[0] || 'P'}
          </div>
          <div className="provider-info">
            <h3>{user.firstName} {user.lastName}</h3>
            <p className="provider-title">Professional Service Provider · {user.email}</p>
            <div className="provider-meta">
              <span><Star size={14} fill="#FFC107" color="#FFC107"/> 4.9 (42 reviews)</span>
              <span><CheckCircle size={14} style={{color:'#43A047'}}/> Premium verified</span>
              <span><Clock size={14}/> {user.phone || 'Ready for assignments'}</span>
            </div>
          </div>
          <div className="provider-status-toggle">
            <span>Status: </span>
            <span className="status-pill status-active">● Active</span>
          </div>
        </div>
      </div>
      
      <div className="dash-widgets">
        {[
          { icon: <DollarSign size={22}/>, label:'Total Earnings', value: `₹${(user.earnings || 0).toLocaleString('en-IN')}`, trend:'Direct platform bank payout', color:'#43A047' },
          { icon: <Calendar size={22}/>, label:'Active Bookings', value: activeBookingsCount, trend:'Assigned current orders', color:'#E53935' },
          { icon: <Star size={22}/>, label:'Avg. Rating', value:'4.9', trend:'Superb feedback', color:'#FFC107' },
          { icon: <Clock size={22}/>, label:'Hours Logged', value: `${totalHours} hrs`, trend:'On-demand work duration', color:'#1E88E5' },
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

function ProviderBookings({ bookings, onStatusUpdate }) {
  const activeAndDone = bookings.filter(b => ['Active', 'Completed'].includes(b.status))

  return (
    <div className="dash-content">
      <h2 className="dash-page-title">Bookings</h2>
      <div className="dash-card">
        <div className="orders-table-wrap">
          {activeAndDone.length === 0 ? (
            <p style={{ padding: '40px', textAlign: 'center', color: 'var(--gray-500)' }}>No active or past bookings currently assigned.</p>
          ) : (
            <table className="data-table">
              <thead><tr><th>Client</th><th>Service</th><th>Start Date</th><th>Hours</th><th>Status</th><th>Amount</th><th>Action</th></tr></thead>
              <tbody>
                {activeAndDone.map((b) => (
                  <tr key={b._id}>
                    <td className="font-bold">{b.client ? `${b.client.firstName} ${b.client.lastName}` : 'Client'}</td>
                    <td>{b.service?.name || 'General Support'}</td>
                    <td>{b.date} ({b.time})</td>
                    <td>{b.hours} hrs</td>
                    <td><span className={`status-pill status-${(b.status || '').toLowerCase()}`}>{b.status}</span></td>
                    <td className="font-bold text-primary">₹{b.totalCost?.toLocaleString('en-IN')}</td>
                    <td>
                      {b.status === 'Active' && (
                        <button
                          onClick={() => onStatusUpdate(b._id, 'Completed')}
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
                          Complete Job
                        </button>
                      )}
                      {b.status === 'Completed' && (
                        <span style={{ color: 'var(--gray-500)', fontSize: '0.8rem' }}>Settled</span>
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

function ProviderRequests({ bookings, onStatusUpdate }) {
  const pendingRequests = bookings.filter(b => b.status === 'Pending')

  return (
    <div className="dash-content">
      <h2 className="dash-page-title">Incoming Requests</h2>
      <div className="requests-list">
        {pendingRequests.length === 0 ? (
          <div className="dash-card" style={{ padding: '60px', textAlign: 'center' }}>
            <p style={{ color: 'var(--gray-500)' }}>No pending customer assignment requests currently.</p>
          </div>
        ) : (
          pendingRequests.map((r) => (
            <div key={r._id} className="request-card dash-card">
              <div className="request-header">
                <div className="request-client-avatar" style={{ background: '#E53935', color: 'white' }}>
                  {r.client?.firstName?.[0] || 'C'}
                </div>
                <div className="request-info">
                  <div className="font-bold">{r.client?.firstName} {r.client?.lastName}</div>
                  <div style={{fontSize:'0.85rem',color:'var(--gray-600)'}}>{r.service?.name}</div>
                  <div style={{fontSize:'0.82rem',color:'var(--gray-400)'}}>
                    Budget: ₹{r.totalCost?.toLocaleString('en-IN')} · Scheduled: {r.date} at {r.time} ({r.hours} hrs)
                  </div>
                  {r.note && (
                    <div style={{ fontSize: '0.8rem', color: 'var(--gray-500)', marginTop: '6px', fontStyle: 'italic' }}>
                      Request: "{r.note}"
                    </div>
                  )}
                </div>
                <div className="request-actions">
                  <button 
                    className="btn-primary" 
                    style={{padding:'8px 16px',fontSize:'0.85rem'}} 
                    onClick={() => onStatusUpdate(r._id, 'Active')}
                  >
                    Accept
                  </button>
                  <button 
                    className="btn-outline" 
                    style={{padding:'7px 16px',fontSize:'0.85rem'}} 
                    onClick={() => onStatusUpdate(r._id, 'Declined')}
                  >
                    Decline
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

function ProviderEarnings({ user, bookings }) {
  const completed = bookings.filter(b => b.status === 'Completed')

  return (
    <div className="dash-content">
      <h2 className="dash-page-title">Earnings Summary</h2>
      
      <div className="dash-widgets" style={{marginBottom:'24px'}}>
        {[
          { label:'Total Earned', value: `₹${(user.earnings || 0).toLocaleString('en-IN')}` },
          { label:'Completed Jobs', value: completed.length },
          { label:'Platform Fee (0%)', value:'₹0' },
          { label:'Pending Settlement', value:'₹0' },
        ].map((e,i) => (
          <div key={i} className="dash-card" style={{textAlign:'center'}}>
            <div style={{fontSize:'1.8rem',fontWeight:800,color:'var(--primary)'}}>{e.value}</div>
            <div style={{fontSize:'0.85rem',color:'var(--gray-500)',marginTop:'4px'}}>{e.label}</div>
          </div>
        ))}
      </div>

      <div className="dash-card">
        <div className="dash-card-header"><h3>Transaction History</h3></div>
        <div className="orders-table-wrap">
          {completed.length === 0 ? (
            <p style={{ padding: '20px', textAlign: 'center', color: 'var(--gray-500)' }}>No successful payouts compiled yet.</p>
          ) : (
            <table className="data-table">
              <thead><tr><th>Payout Date</th><th>Client</th><th>Description</th><th>Amount</th><th>Status</th></tr></thead>
              <tbody>
                {completed.map((t) => (
                  <tr key={t._id}>
                    <td>{new Date(t.createdAt || Date.now()).toLocaleDateString()}</td>
                    <td className="font-bold">{t.client?.firstName || 'Pratik'} {t.client?.lastName || 'Buddy'}</td>
                    <td>Escrow complete — {t.service?.name} ({t.hours} hrs)</td>
                    <td className="font-bold text-primary">₹{t.totalCost?.toLocaleString('en-IN')}</td>
                    <td><span className="status-pill status-active">Paid</span></td>
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

function ProviderReviews() {
  const reviews = [
    { client:'Superb client matching', rating:5, text:'Excellent experience working as a verified on-demand professional under HumanForce.', date:'May 15' },
    { client:'Premium payouts', rating:5, text:'Very clear scheduling coordinates and secure payments directly processed with zero fees.', date:'May 12' }
  ]
  return (
    <div className="dash-content">
      <h2 className="dash-page-title">Client Reviews</h2>
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
        <p>Loading active customer threads...</p>
      </div>
    )
  }

  return (
    <div className="dash-content">
      <h2 className="dash-page-title">Client Messages</h2>
      
      {threads.length === 0 ? (
        <div className="dash-card" style={{ padding: '60px', textAlign: 'center' }}>
          <p style={{ color: 'var(--gray-500)' }}>Your message queue is empty. Accept customer assignments to start chatting!</p>
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
                  {c.user?.firstName?.[0] || 'C'}
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

function Placeholder({ title }) {
  return <div className="dash-content"><h2 className="dash-page-title">{title}</h2><div className="dash-card"><p style={{color:'var(--gray-500)',textAlign:'center',padding:'40px'}}>Coming soon in next release.</p></div></div>
}

export default function ProviderDashboard() {
  const [sideOpen, setSideOpen] = useState(false)
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState(api.getUser())
  const navigate = useNavigate()
  const location = useLocation()

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

  const syncProfile = async () => {
    try {
      const profile = await api.getMe()
      setCurrentUser(profile)
      // Save updated user to localStorage to keep navbar synced
      localStorage.setItem('hf_user', JSON.stringify(profile))
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    if (!api.isAuthenticated() || api.getUser()?.role !== 'provider') {
      navigate('/login')
      return
    }
    loadBookings()
    syncProfile()
  }, [])

  const handleStatusUpdate = async (bookingId, status) => {
    try {
      await api.updateBookingStatus(bookingId, status)
      await loadBookings()
      await syncProfile() // Refresh earnings on completion!
    } catch (err) {
      console.error(err)
    }
  }

  const handleLogout = () => {
    api.logout()
    navigate('/')
  }

  if (loading || !currentUser) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--gray-950)' }}>
        <p style={{ color: '#E53935' }}>Synchronizing professional credentials...</p>
      </div>
    )
  }

  const getInitials = () => {
    return `${(currentUser.firstName || '')[0] || ''}${(currentUser.lastName || '')[0] || ''}`.toUpperCase()
  }

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
          <div className="dash-user-avatar" style={{ background: '#E53935', color: 'white' }}>
            {getInitials()}
          </div>
          <div>
            <div className="dash-user-name">{currentUser.firstName} {currentUser.lastName}</div>
            <div className="dash-user-role" style={{ textTransform: 'capitalize' }}>Verified Provider</div>
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
          <Route index element={<ProviderHome user={currentUser} bookings={bookings} />} />
          <Route path="bookings" element={<ProviderBookings bookings={bookings} onStatusUpdate={handleStatusUpdate} />} />
          <Route path="requests" element={<ProviderRequests bookings={bookings} onStatusUpdate={handleStatusUpdate} />} />
          <Route path="earnings" element={<ProviderEarnings user={currentUser} bookings={bookings} />} />
          <Route path="messages" element={<DashMessages />} />
          <Route path="reviews" element={<ProviderReviews />} />
          <Route path="calendar" element={<Placeholder title="Calendar"/>} />
        </Routes>
      </main>
    </div>
  )
}
