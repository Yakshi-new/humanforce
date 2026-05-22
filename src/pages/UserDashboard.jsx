import { useState, useEffect, useRef } from 'react'
import { Link, Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { LayoutDashboard, ShoppingBag, MessageSquare, Bell, CreditCard, Settings, LogOut, Zap, Clock, Star, ArrowRight, Menu, X, Send, Calendar, Shield, CheckCircle, Search, Check, CheckCheck } from 'lucide-react'
import { api, loadRazorpayScript } from '../utils/api'
import './Dashboard.css'

const NAV = [
  { icon: <LayoutDashboard size={18}/>, label: 'Dashboard', path: '/dashboard' },
  { icon: <Calendar size={18}/>, label: 'Book a Buddy', path: '/dashboard/book' },
  { icon: <ShoppingBag size={18}/>, label: 'My Orders', path: '/dashboard/orders' },
  { icon: <MessageSquare size={18}/>, label: 'Messages', path: '/dashboard/messages' },
  { icon: <Bell size={18}/>, label: 'Notifications', path: '/dashboard/notifications' },
  { icon: <CreditCard size={18}/>, label: 'Payments', path: '/dashboard/payments' },
  { icon: <Settings size={18}/>, label: 'Settings', path: '/dashboard/settings' },
]

function DashHome({ bookings }) {
  const activeCount = bookings.filter(b => ['Pending', 'Active', 'In-Progress'].includes(b.status)).length
  const totalSpent = bookings
    .filter(b => ['Active', 'In-Progress', 'Completed'].includes(b.status))
    .reduce((sum, b) => sum + (b.totalCost || 0), 0)
  const totalHours = bookings.reduce((sum, b) => sum + (b.hours || 0), 0)

  // Active providers based on current bookings
  const activeProviders = bookings
    .filter(b => ['Active', 'In-Progress'].includes(b.status) && b.provider)
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
                        <div style={{ fontSize: '0.7rem', color: o.remainingPaid ? '#43A047' : '#E53935', fontWeight: 500 }}>{o.remainingPaid ? '✓ Fully Paid' : `Pending 80%: ₹${(o.totalCost * 0.8)?.toLocaleString('en-IN')}`}</div>
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

function DashOrders({ bookings, onStatusUpdate, onPaymentSuccess }) {
  const [payingId, setPayingId] = useState(null)

  const handlePayRemaining = async (booking) => {
    const user = api.getUser()
    const remainingAmount = booking.totalCost * 0.8
    setPayingId(booking._id)

    try {
      const loaded = await loadRazorpayScript()
      if (!loaded) {
        throw new Error('Failed to load payment gateway. Check your internet connection.')
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_q31m9CozvW9C3v',
        amount: Math.round(remainingAmount * 100), // in paise
        currency: 'INR',
        name: 'HumanForce Buddy Portal',
        description: `Pay 80% Remaining Balance for Booking ${booking.bookingId}`,
        handler: async function (response) {
          try {
            await api.payRemaining(booking._id, response.razorpay_payment_id)
            if (onPaymentSuccess) onPaymentSuccess()
          } catch (err) {
            console.error(err)
            alert('Failed to complete payment processing: ' + err.message)
          } finally {
            setPayingId(null)
          }
        },
        prefill: {
          name: user ? `${user.firstName} ${user.lastName}` : '',
          email: user ? user.email : '',
          contact: user ? user.phone : ''
        },
        theme: {
          color: '#E53935'
        },
        modal: {
          ondismiss: function () {
            setPayingId(null)
          }
        }
      }

      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (err) {
      console.error(err)
      alert(err.message || 'Failed to initialize payment.')
      setPayingId(null)
    }
  }

  const handleSimulatedPayRemaining = async (booking) => {
    setPayingId(booking._id)
    try {
      await api.payRemaining(booking._id, `simpay_rem_${Date.now()}`)
      if (onPaymentSuccess) onPaymentSuccess()
    } catch (err) {
      console.error(err)
      alert('Failed to process payment: ' + err.message)
    } finally {
      setPayingId(null)
    }
  }

  const handleRequestChangeBuddy = async (booking) => {
    const reason = prompt('Please enter the reason for requesting a buddy change:')
    if (reason === null) return
    try {
      await api.requestChangeBuddy(booking._id, reason)
      alert('Buddy change request submitted successfully!')
      if (onPaymentSuccess) onPaymentSuccess()
    } catch (err) {
      console.error(err)
      alert('Failed to request change: ' + err.message)
    }
  }

  const canRequestChange = (booking) => {
    if (!booking.provider) return false
    if (['Completed', 'Declined'].includes(booking.status)) return false
    if (booking.changeBuddyRequested) return false

    let bookingDateTime = new Date(`${booking.date}T${booking.time}`)
    if (isNaN(bookingDateTime.getTime())) {
      bookingDateTime = new Date(booking.date)
    }
    if (isNaN(bookingDateTime.getTime())) return true

    const now = new Date()
    const timeDiff = bookingDateTime.getTime() - now.getTime()
    const diffMinutes = timeDiff / (1000 * 60)
    return diffMinutes >= 30
  }

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
                    <td>
                      {o.provider ? (
                        <div>
                          <div className="font-bold">{o.provider.firstName} {o.provider.lastName}</div>
                          {o.changeBuddyRequested && (
                            <span style={{
                              display: 'inline-block',
                              background: 'rgba(229,57,53,0.1)',
                              color: '#E53935',
                              fontSize: '0.72rem',
                              padding: '2px 6px',
                              borderRadius: '3px',
                              fontWeight: 600,
                              marginTop: '4px'
                            }}>
                              Change Requested
                            </span>
                          )}
                        </div>
                      ) : (
                        <span style={{ color: 'var(--gray-400)', fontSize: '0.82rem' }}>Assigning...</span>
                      )}
                    </td>
                    <td>
                      <div>{o.date}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--gray-400)' }}>{o.time}</div>
                    </td>
                    <td>{o.hours} hrs</td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span className={`status-pill status-${(o.status || 'Pending').toLowerCase()}`}>
                          {o.status}
                        </span>
                        <span className={`status-pill ${o.remainingPaid ? 'status-active' : 'status-pending'}`} style={{ fontSize: '0.66rem' }}>
                          {o.remainingPaid ? 'Fully Paid' : 'Deposit Secured'}
                        </span>
                      </div>
                    </td>
                    <td className="font-bold">
                      <div className="text-primary">₹{o.totalCost?.toLocaleString('en-IN')}</div>
                      <div style={{ fontSize: '0.74rem', color: '#43A047', fontWeight: 600 }}>Paid 20%: ₹{(o.depositPaid || (o.totalCost * 0.2))?.toLocaleString('en-IN')}</div>
                      <div style={{ fontSize: '0.74rem', color: o.remainingPaid ? '#43A047' : '#E53935', fontWeight: 500 }}>
                        {o.remainingPaid ? 'Balance Paid' : `80% Bal: ₹${(o.totalCost * 0.8)?.toLocaleString('en-IN')}`}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
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
                        {['Active', 'In-Progress'].includes(o.status) && (
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
                        {canRequestChange(o) && (
                          <button
                            onClick={() => handleRequestChangeBuddy(o)}
                            style={{
                              background: 'rgba(229,57,53,0.05)',
                              border: '1px dashed #E53935',
                              color: '#E53935',
                              padding: '4px 10px',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '0.74rem',
                              fontWeight: 600
                            }}
                          >
                            Change Buddy
                          </button>
                        )}
                        {!o.remainingPaid && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <button
                              onClick={() => handlePayRemaining(o)}
                              disabled={payingId === o._id}
                              style={{
                                background: '#43A047',
                                border: 'none',
                                color: 'white',
                                padding: '4px 10px',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '0.78rem',
                                fontWeight: 600
                              }}
                            >
                              {payingId === o._id ? 'Paying...' : 'Pay 80%'}
                            </button>
                            <button
                              onClick={() => handleSimulatedPayRemaining(o)}
                              disabled={payingId === o._id}
                              style={{
                                background: 'transparent',
                                border: '1px solid #43A047',
                                color: '#43A047',
                                padding: '3px 8px',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '0.74rem',
                                fontWeight: 600
                              }}
                            >
                              ⚡ Simulate
                            </button>
                          </div>
                        )}
                        {['Completed', 'Declined'].includes(o.status) && o.remainingPaid && (
                          <span style={{ fontSize: '0.8rem', color: 'var(--gray-500)' }}>Archive</span>
                        )}
                      </div>
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

function DashBook({ onBookingCreated }) {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedService, setSelectedService] = useState(null)
  const [bookingForm, setBookingForm] = useState({ date: '', time: '12:00', hours: 2, note: '' })
  const [bookingLoading, setBookingLoading] = useState(false)
  const [bookingError, setBookingError] = useState('')
  const [booked, setBooked] = useState(false)

  const loadServices = async () => {
    try {
      setLoading(true)
      const data = await api.getServices()
      setServices(data)
      const params = new URLSearchParams(window.location.search)
      const queryServiceId = params.get('service')
      if (queryServiceId) {
        const found = data.find(s => s._id === queryServiceId || s.serviceId === queryServiceId)
        if (found) {
          setSelectedService(found)
        }
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadServices()
  }, [])

  const handleBook = async (e) => {
    e.preventDefault()
    setBookingError('')
    if (!selectedService) return

    const user = api.getUser()
    const depositAmount = (selectedService.price * bookingForm.hours) * 0.2

    try {
      setBookingLoading(true)
      const loaded = await loadRazorpayScript()
      if (!loaded) {
        throw new Error('Failed to load payment gateway. Check your internet connection.')
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_q31m9CozvW9C3v',
        amount: Math.round(depositAmount * 100), // in paise
        currency: 'INR',
        name: 'HumanForce Buddy Portal',
        description: `20% Booking Deposit for ${selectedService.name}`,
        handler: async function (response) {
          try {
            setBookingLoading(true)
            await api.createBooking({
              serviceId: selectedService.serviceId,
              date: bookingForm.date,
              time: bookingForm.time,
              hours: bookingForm.hours,
              note: bookingForm.note,
              razorpayPaymentId: response.razorpay_payment_id
            })
            setBooked(true)
            if (onBookingCreated) onBookingCreated()
          } catch (err) {
            console.error(err)
            setBookingError(err.message || 'Failed to complete booking processing.')
          } finally {
            setBookingLoading(false)
          }
        },
        prefill: {
          name: user ? `${user.firstName} ${user.lastName}` : '',
          email: user ? user.email : '',
          contact: user ? user.phone : ''
        },
        theme: {
          color: '#E53935'
        },
        modal: {
          ondismiss: function () {
            setBookingLoading(false)
          }
        }
      }

      const rzp = new window.Razorpay(options)
      rzp.open()

    } catch (err) {
      console.error(err)
      setBookingError(err.message || 'Failed to initialize payment.')
      setBookingLoading(false)
    }
  }

  const handleSimulatedBook = async () => {
    setBookingError('')
    if (!selectedService) return
    if (!bookingForm.date || !bookingForm.time) {
      setBookingError('Please select a valid scheduled date and start time.')
      return
    }
    try {
      setBookingLoading(true)
      await api.createBooking({
        serviceId: selectedService.serviceId,
        date: bookingForm.date,
        time: bookingForm.time,
        hours: bookingForm.hours,
        note: bookingForm.note,
        razorpayPaymentId: `simpay_${Date.now()}`
      })
      setBooked(true)
      if (onBookingCreated) onBookingCreated()
    } catch (err) {
      console.error(err)
      setBookingError(err.message || 'Failed to complete booking processing.')
    } finally {
      setBookingLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="dash-content" style={{ textAlign: 'center', padding: '60px 0' }}>
        <p style={{ color: '#E53935' }}>Retrieving live professional buddylist...</p>
      </div>
    )
  }

  if (booked) {
    return (
      <div className="dash-content">
        <h2 className="dash-page-title">Book a Buddy</h2>
        <div className="dash-card" style={{ textAlign: 'center', padding: '40px', maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ fontSize: '3rem', color: '#43A047', marginBottom: '20px' }}>✓</div>
          <h3>Booking Deposit Processed!</h3>
          <p style={{ color: 'var(--gray-400)', marginTop: '12px', lineHeight: '1.6' }}>
            Your 20% deposit payment has been successfully secured. We have initiated the buddy coordinate algorithms.
          </p>
          <div style={{ marginTop: '24px', display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <Link to="/dashboard/orders" className="btn-primary" style={{ textDecoration: 'none' }}>
              View Bookings
            </Link>
            <button onClick={() => { setBooked(false); setSelectedService(null); }} className="btn-outline">
              Book Another Buddy
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="dash-content">
      <h2 className="dash-page-title">Book a Buddy</h2>
      
      {!selectedService ? (
        <div className="dash-services-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '20px',
          marginTop: '20px'
        }}>
          {services.map(s => (
            <div key={s._id} className="dash-card" style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              height: '100%',
              position: 'relative'
            }}>
              <div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '14px'
                }}>
                  <span style={{
                    fontSize: '0.75rem',
                    background: 'rgba(229,57,53,0.1)',
                    color: '#E53935',
                    padding: '4px 10px',
                    borderRadius: '50px',
                    fontWeight: 600
                  }}>{s.category}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem' }}>
                    <Star size={14} fill="#FFC107" color="#FFC107" />
                    <strong>{s.rating || '4.8'}</strong>
                  </div>
                </div>
                <h3 style={{ fontSize: '1.15rem', color: 'white', marginBottom: '8px' }}>{s.name}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--gray-400)', lineHeight: '1.5', marginBottom: '16px' }}>{s.desc?.substring(0, 100)}...</p>
              </div>
              <div style={{
                borderTop: '1px solid rgba(255,255,255,0.06)',
                paddingTop: '14px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <span style={{ fontSize: '0.78rem', color: 'var(--gray-500)' }}>Hourly rate</span>
                  <div style={{ fontSize: '1.15rem', fontWeight: 700, color: 'white' }}>₹{s.price}<span style={{ fontSize: '0.78rem', fontWeight: 400, color: 'var(--gray-400)' }}>/hr</span></div>
                </div>
                <button onClick={() => setSelectedService(s)} className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                  Book Buddy
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '30px', marginTop: '20px' }}>
          <div className="dash-card">
            <button onClick={() => setSelectedService(null)} className="btn-outline" style={{
              padding: '6px 12px',
              fontSize: '0.8rem',
              marginBottom: '20px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              ← Back to Buddies
            </button>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '24px' }}>
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '10px',
                background: selectedService.bg || '#E53935',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem'
              }}>★</div>
              <div>
                <span style={{ fontSize: '0.78rem', background: 'rgba(229,57,53,0.1)', color: '#E53935', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>{selectedService.category}</span>
                <h3 style={{ color: 'white', marginTop: '4px' }}>{selectedService.name}</h3>
              </div>
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--gray-300)', lineHeight: '1.6', marginBottom: '20px' }}>{selectedService.desc}</p>
            
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '20px' }}>
              <h4 style={{ color: 'white', marginBottom: '12px' }}>Platform Trust Features</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <li style={{ fontSize: '0.85rem', color: 'var(--gray-400)', display: 'flex', alignItems: 'center', gap: '8px' }}>✓ 100% verified, skill-inspected professional buddy.</li>
                <li style={{ fontSize: '0.85rem', color: 'var(--gray-400)', display: 'flex', alignItems: 'center', gap: '8px' }}>✓ Zero-friction event scheduling coordinates.</li>
                <li style={{ fontSize: '0.85rem', color: 'var(--gray-400)', display: 'flex', alignItems: 'center', gap: '8px' }}>✓ 20% Deposit secured in premium escrow.</li>
              </ul>
            </div>
          </div>

          <div className="dash-card">
            <h3 style={{ color: 'white', marginBottom: '20px' }}>Booking Configurations</h3>
            {bookingError && (
              <div style={{ background: 'rgba(229,57,53,0.1)', border: '1px solid rgba(229,57,53,0.3)', color: '#E53935', padding: '10px 14px', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '16px' }}>
                {bookingError}
              </div>
            )}
            <form onSubmit={handleBook} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Scheduled Date</label>
                <input 
                  type="date" 
                  value={bookingForm.date} 
                  min={new Date().toISOString().split('T')[0]}
                  onChange={e => setBookingForm({ ...bookingForm, date: e.target.value })} 
                  className="form-input" 
                  required 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Scheduled Start Time</label>
                <input 
                  type="time" 
                  value={bookingForm.time} 
                  onChange={e => setBookingForm({ ...bookingForm, time: e.target.value })} 
                  className="form-input" 
                  required 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Duration: <strong>{bookingForm.hours} hrs</strong></label>
                <input 
                  type="range" 
                  min="1" 
                  max="8" 
                  value={bookingForm.hours} 
                  onChange={e => setBookingForm({ ...bookingForm, hours: +e.target.value })} 
                  className="price-slider" 
                  style={{ width: '100%' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: 'var(--gray-500)', marginTop: '4px' }}><span>1 hr</span><span>8 hrs</span></div>
              </div>
              <div className="form-group">
                <label className="form-label">Special Requests (optional)</label>
                <textarea 
                  value={bookingForm.note} 
                  onChange={e => setBookingForm({ ...bookingForm, note: e.target.value })} 
                  className="form-input" 
                  rows="3" 
                  placeholder="Tell them about your coordinates..." 
                  style={{ resize: 'vertical' }} 
                />
              </div>
              
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '16px', marginTop: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--gray-400)', marginBottom: '8px' }}>
                  <span>Total Bill (₹{selectedService.price} × {bookingForm.hours} hrs):</span>
                  <strong>₹{(selectedService.price * bookingForm.hours).toLocaleString('en-IN')}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#43A047', fontWeight: 600, marginBottom: '8px' }}>
                  <span>Payable Now (20% Deposit):</span>
                  <strong>₹{((selectedService.price * bookingForm.hours) * 0.2).toLocaleString('en-IN')}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--gray-400)', marginBottom: '16px' }}>
                  <span>Outstanding Balance (80% Paid Later):</span>
                  <strong>₹{((selectedService.price * bookingForm.hours) * 0.8).toLocaleString('en-IN')}</strong>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button type="submit" disabled={bookingLoading} className="btn-primary" style={{ padding: '12px', fontSize: '0.95rem', fontWeight: 600, width: '100%' }}>
                  {bookingLoading ? 'Processing Request...' : `Proceed to Pay 20% (₹${((selectedService.price * bookingForm.hours) * 0.2).toLocaleString('en-IN')})`}
                </button>
                <button type="button" onClick={handleSimulatedBook} disabled={bookingLoading} className="btn-outline" style={{ borderColor: '#43A047', color: '#43A047', background: 'transparent', padding: '12px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%' }}>
                  ⚡ Simulate Payment (Test Mode)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

function DashPayments({ bookings, onPaymentSuccess }) {
  const totalInvested = bookings
    .filter(b => ['Active', 'In-Progress', 'Completed'].includes(b.status))
    .reduce((sum, b) => sum + (b.totalCost || 0), 0)

  const totalDepositsPaid = bookings
    .reduce((sum, b) => sum + (b.depositPaid || (b.totalCost * 0.2)), 0)

  const outstandingDues = bookings
    .filter(b => !b.remainingPaid && ['Pending', 'Active', 'In-Progress'].includes(b.status))
    .reduce((sum, b) => sum + ((b.totalCost || 0) * 0.8), 0)

  const [payingId, setPayingId] = useState(null)

  const handlePayRemaining = async (booking) => {
    const user = api.getUser()
    const remainingAmount = booking.totalCost * 0.8
    setPayingId(booking._id)

    try {
      const loaded = await loadRazorpayScript()
      if (!loaded) throw new Error('Razorpay failed to load')

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_q31m9CozvW9C3v',
        amount: Math.round(remainingAmount * 100),
        currency: 'INR',
        name: 'HumanForce Buddy Portal',
        description: `Pay 80% Remaining Balance for Booking ${booking.bookingId}`,
        handler: async function (response) {
          try {
            await api.payRemaining(booking._id, response.razorpay_payment_id)
            if (onPaymentSuccess) onPaymentSuccess()
          } catch (err) {
            console.error(err)
            alert('Failed to process payment: ' + err.message)
          } finally {
            setPayingId(null)
          }
        },
        prefill: {
          name: user ? `${user.firstName} ${user.lastName}` : '',
          email: user ? user.email : '',
          contact: user ? user.phone : ''
        },
        theme: {
          color: '#E53935'
        },
        modal: {
          ondismiss: function () {
            setPayingId(null)
          }
        }
      }

      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (err) {
      console.error(err)
      alert(err.message)
      setPayingId(null)
    }
  }

  const handleSimulatedPayRemaining = async (booking) => {
    setPayingId(booking._id)
    try {
      await api.payRemaining(booking._id, `simpay_rem_${Date.now()}`)
      if (onPaymentSuccess) onPaymentSuccess()
    } catch (err) {
      console.error(err)
      alert('Failed to process payment: ' + err.message)
    } finally {
      setPayingId(null)
    }
  }

  return (
    <div className="dash-content">
      <h2 className="dash-page-title">Billing & Payments</h2>

      <div className="dash-widgets" style={{ marginBottom: '30px' }}>
        {[
          { icon: <CreditCard size={22}/>, label:'Total Budget Invested', value: `₹${totalInvested.toLocaleString('en-IN')}`, trend:'Total value of services contracted', color:'#1E88E5' },
          { icon: <CheckCircle size={22}/>, label:'Secured Deposits (20%)', value: `₹${totalDepositsPaid.toLocaleString('en-IN')}`, trend:'Escrow secured down-payments', color:'#43A047' },
          { icon: <Clock size={22}/>, label:'Outstanding Balance (80%)', value: `₹${outstandingDues.toLocaleString('en-IN')}`, trend:'Outstanding balance due', color:'#E53935' },
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

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.8fr', gap: '30px' }}>
        {/* Visa Card Mockup */}
        <div className="dash-card" style={{
          background: 'linear-gradient(135deg, #1f1c2c 0%, #928dab 100%)',
          color: 'white',
          borderRadius: '16px',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: '220px',
          boxShadow: '0 10px 20px rgba(0,0,0,0.3)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '150px', height: '150px', borderRadius: '50%', background: 'rgba(229,57,53,0.15)', filter: 'blur(30px)' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, letterSpacing: '1px' }}>HumanForce ESCROW</div>
            <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>SECURED PORTAL</div>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 500, letterSpacing: '3px', margin: '24px 0' }}>•••• •••• •••• {(api.getUser()?.phone || '1234').slice(-4)}</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>Escrow Client</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{api.getUser() ? `${api.getUser().firstName} ${api.getUser().lastName}` : 'Guest Client'}</div>
            </div>
            <div style={{ fontSize: '1.2rem', fontWeight: 900, color: 'rgba(255,255,255,0.8)' }}>VISA</div>
          </div>
        </div>

        {/* Transactions ledger */}
        <div className="dash-card">
          <div className="dash-card-header" style={{ marginBottom: '20px' }}>
            <h3>Escrow Billing Ledger</h3>
          </div>
          <div className="orders-table-wrap">
            {bookings.length === 0 ? (
              <p style={{ padding: '30px', textAlign: 'center', color: 'var(--gray-500)' }}>No billing items registered yet.</p>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Booking</th>
                    <th>Total Cost</th>
                    <th>Breakdown</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map(b => (
                    <tr key={b._id}>
                      <td className="mono" style={{ fontSize: '0.85rem' }}>
                        <div>{b.bookingId}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--gray-500)' }}>{b.service?.name}</div>
                      </td>
                      <td className="font-bold">₹{b.totalCost?.toLocaleString('en-IN')}</td>
                      <td>
                        <div style={{ fontSize: '0.78rem', color: '#43A047' }}>20%: ₹{(b.depositPaid || (b.totalCost * 0.2))?.toLocaleString('en-IN')}</div>
                        <div style={{ fontSize: '0.78rem', color: b.remainingPaid ? '#43A047' : '#E53935' }}>80%: ₹{(b.totalCost * 0.8)?.toLocaleString('en-IN')}</div>
                      </td>
                      <td>
                        <span className={`status-pill ${b.remainingPaid ? 'status-active' : 'status-pending'}`} style={{ fontSize: '0.7rem' }}>
                          {b.remainingPaid ? 'Fully Paid' : 'Deposit Secured'}
                        </span>
                      </td>
                      <td>
                        {!b.remainingPaid ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <button
                              onClick={() => handlePayRemaining(b)}
                              disabled={payingId === b._id}
                              style={{
                                background: '#43A047',
                                border: 'none',
                                color: 'white',
                                padding: '4px 10px',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '0.74rem',
                                fontWeight: 600
                              }}
                            >
                              {payingId === b._id ? 'Paying...' : 'Pay 80%'}
                            </button>
                            <button
                              onClick={() => handleSimulatedPayRemaining(b)}
                              disabled={payingId === b._id}
                              style={{
                                background: 'transparent',
                                border: '1px solid #43A047',
                                color: '#43A047',
                                padding: '3px 8px',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '0.7rem',
                                fontWeight: 600
                              }}
                            >
                              ⚡ Simulate
                            </button>
                          </div>
                        ) : (
                          <span style={{ fontSize: '0.76rem', color: 'var(--gray-500)' }}>Complete</span>
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
    </div>
  )
}

function DashMessages({ onMessagesRead }) {
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
      if (onMessagesRead) onMessagesRead()
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
                <div className="convo-avatar" style={{ background: '#E53935', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  {c.user?.avatar ? (
                    <img src={c.user.avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    c.user?.firstName?.[0] || 'B'
                  )}
                </div>
                <div className="convo-info">
                  <div className="convo-name-row">
                    <span className="convo-name">{c.user?.firstName} {c.user?.lastName}</span>
                    <span className="convo-time">{new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <div className="convo-role" style={{ textTransform: 'capitalize' }}>{c.user?.role}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2px' }}>
                    <div className="convo-last" style={{ flex: 1 }}>{c.lastMessage}</div>
                    {c.unreadCount > 0 && <span className="convo-badge">{c.unreadCount}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {activeThread && (
            <div className="chat-panel">
              <div className="chat-panel-header">
                <div className="convo-avatar" style={{ background: '#E53935', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  {activeThread.user?.avatar ? (
                    <img src={activeThread.user.avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    activeThread.user?.firstName?.[0] || 'B'
                  )}
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
                      <div className="msg-bubble" style={{ 
                        position: 'relative', 
                        display: 'flex', 
                        flexDirection: 'column', 
                        paddingBottom: '18px', 
                        minWidth: '70px' 
                      }}>
                        <span style={{ wordBreak: 'break-word' }}>{m.text}</span>
                        <div className="msg-meta" style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'flex-end',
                          gap: '4px',
                          fontSize: '0.68rem',
                          opacity: 0.75,
                          position: 'absolute',
                          bottom: '2px',
                          right: '10px',
                          color: isCurrentUser ? 'rgba(255,255,255,0.8)' : 'var(--gray-500)'
                        }}>
                          <span>{new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          {isCurrentUser && (
                            m.isRead ? (
                              <CheckCheck size={12} style={{ color: '#90CAF9' }} />
                            ) : (
                              <Check size={12} style={{ color: 'rgba(255,255,255,0.6)' }} />
                            )
                          )}
                        </div>
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
  const navigate = useNavigate()
  const location = useLocation()
  const authenticated = api.isAuthenticated()

  useEffect(() => {
    if (!authenticated) {
      navigate('/login', { state: { from: location.pathname + location.search } })
    }
  }, [authenticated, navigate, location.pathname, location.search])

  const [sideOpen, setSideOpen] = useState(false)
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [unreadCount, setUnreadCount] = useState(0)
  
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

  const loadUnreadCount = async () => {
    try {
      const res = await api.getUnreadCount()
      setUnreadCount(res.count)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    if (authenticated) {
      loadBookings()
      loadUnreadCount()

      // Poll for unread messages count every 10 seconds
      const interval = setInterval(loadUnreadCount, 10000)
      return () => clearInterval(interval)
    }
  }, [authenticated])

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

  if (!authenticated) {
    return null
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
          <div className="dash-user-avatar" style={{ background: '#E53935', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
            {user?.avatar ? (
              <img src={user.avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              getInitials()
            )}
          </div>
          <div>
            <div className="dash-user-name">{user ? `${user.firstName} ${user.lastName}` : 'Guest User'}</div>
            <div className="dash-user-role" style={{ textTransform: 'capitalize' }}>{user ? `${user.role} Portal` : 'Customer'}</div>
          </div>
        </div>

        <nav className="dash-nav">
          {NAV.map(n => {
            const isMessages = n.label === 'Messages'
            return (
              <Link key={n.path} to={n.path} className={`dash-nav-link ${location.pathname === n.path ? 'dash-nav-active' : ''}`}>
                {n.icon}
                <span>{n.label}</span>
                {isMessages && unreadCount > 0 && (
                  <span className="dash-badge">{unreadCount}</span>
                )}
              </Link>
            )
          })}
        </nav>
        
        <button onClick={handleLogout} className="dash-logout" style={{ background: 'none', border: 'none', textAlign: 'left', width: '100%', cursor: 'pointer' }}>
          <LogOut size={16}/> Sign Out
        </button>
      </aside>

      <main className="dash-main">
        <Routes>
          <Route index element={<DashHome bookings={bookings} />} />
          <Route path="book" element={<DashBook onBookingCreated={loadBookings} />} />
          <Route path="orders" element={<DashOrders bookings={bookings} onStatusUpdate={handleStatusUpdate} onPaymentSuccess={loadBookings} />} />
          <Route path="messages" element={<DashMessages onMessagesRead={loadUnreadCount} />} />
          <Route path="notifications" element={<DashPlaceholder title="Notifications"/>} />
          <Route path="payments" element={<DashPayments bookings={bookings} onPaymentSuccess={loadBookings} />} />
          <Route path="settings" element={<DashPlaceholder title="Settings"/>} />
        </Routes>
      </main>
    </div>
  )
}
