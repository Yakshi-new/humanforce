import { useState, useEffect, useRef } from 'react'
import { Link, Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { User, Calendar, Inbox, DollarSign, MessageSquare, Star, LogOut, Zap, Clock, CheckCircle, Menu, X, Send, AlertCircle, Banknote, Smartphone, Check, CheckCheck } from 'lucide-react'
import { api } from '../utils/api'
import { loadRazorpayScript } from '../utils/api'
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
  const activeBookingsCount = bookings.filter(b => ['Active', 'In-Progress'].includes(b.status)).length
  const completedBookings = bookings.filter(b => b.status === 'Completed')
  const totalHours = completedBookings.reduce((sum, b) => sum + (b.hours || 0), 0)

  return (
    <div className="dash-content">
      <h2 className="dash-page-title">My Profile</h2>
      <div className="provider-profile-card dash-card" style={{marginBottom:'24px'}}>
        <div className="provider-header">
          <div className="provider-big-avatar" style={{ background: '#E53935', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
            {user.avatar ? (
              <img src={user.avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              user.firstName?.[0] || 'P'
            )}
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

// Payment Confirmation Modal
function PaymentModal({ booking, onCash, onUPI, onSimulateUPI, onCancel, loading }) {
  const remainingAmount = booking ? booking.totalCost * 0.8 : 0
  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 9999
    }}>
      <div style={{
        background: 'var(--surface, #1e1e2e)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '16px',
        padding: '36px',
        width: '420px',
        maxWidth: '95vw',
        boxShadow: '0 24px 64px rgba(0,0,0,0.5)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            width: '56px', height: '56px', borderRadius: '50%',
            background: 'rgba(67,160,71,0.12)', border: '2px solid #43A047',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px'
          }}>
            <CheckCircle size={28} color="#43A047" />
          </div>
          <h3 style={{ margin: '0 0 6px', fontSize: '1.25rem', fontWeight: 700 }}>Complete Job</h3>
          <p style={{ margin: 0, color: 'var(--gray-400)', fontSize: '0.9rem' }}>
            Confirm remaining payment of <strong style={{ color: '#43A047' }}>₹{remainingAmount.toLocaleString('en-IN')}</strong>
          </p>
        </div>

        <div style={{ marginBottom: '20px', padding: '12px 16px', background: 'rgba(255,255,255,0.04)', borderRadius: '8px', fontSize: '0.85rem', color: 'var(--gray-400)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span>Booking</span>
            <span style={{ color: 'var(--gray-200)', fontWeight: 600 }}>{booking?.bookingId}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span>Total Value</span>
            <span style={{ color: 'var(--gray-200)', fontWeight: 600 }}>₹{booking?.totalCost?.toLocaleString('en-IN')}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Deposit (20%) Paid</span>
            <span style={{ color: '#43A047', fontWeight: 600 }}>✓ ₹{booking?.depositPaid?.toLocaleString('en-IN')}</span>
          </div>
        </div>

        <p style={{ fontSize: '0.88rem', color: 'var(--gray-400)', marginBottom: '16px', textAlign: 'center' }}>
          How did the customer pay the remaining 80%?
        </p>

        <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
          <button
            onClick={onCash}
            disabled={loading}
            style={{
              flex: 1,
              padding: '16px 12px',
              borderRadius: '12px',
              border: '2px solid rgba(67,160,71,0.4)',
              background: 'rgba(67,160,71,0.08)',
              color: '#43A047',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '0.95rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s',
              opacity: loading ? 0.6 : 1
            }}
          >
            <Banknote size={24} />
            Cash
            <span style={{ fontSize: '0.72rem', fontWeight: 400, color: 'var(--gray-400)' }}>Received in hand</span>
          </button>
          <button
            onClick={onUPI}
            disabled={loading}
            style={{
              flex: 1,
              padding: '16px 12px',
              borderRadius: '12px',
              border: '2px solid rgba(30,136,229,0.4)',
              background: 'rgba(30,136,229,0.08)',
              color: '#1E88E5',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '0.95rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s',
              opacity: loading ? 0.6 : 1
            }}
          >
            <Smartphone size={24} />
            UPI
            <span style={{ fontSize: '0.72rem', fontWeight: 400, color: 'var(--gray-400)' }}>Open payment gateway</span>
          </button>
        </div>

        <button
          onClick={onSimulateUPI}
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px',
            marginBottom: '16px',
            borderRadius: '8px',
            border: '2px dashed rgba(67,160,71,0.4)',
            background: 'rgba(67,160,71,0.05)',
            color: '#43A047',
            cursor: 'pointer',
            fontWeight: 700,
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'all 0.2s',
            opacity: loading ? 0.6 : 1
          }}
        >
          ⚡ Simulate UPI (Test Mode)
        </button>

        <button
          onClick={onCancel}
          disabled={loading}
          style={{
            width: '100%',
            padding: '10px',
            borderRadius: '8px',
            border: '1px solid rgba(255,255,255,0.08)',
            background: 'transparent',
            color: 'var(--gray-400)',
            cursor: 'pointer',
            fontSize: '0.85rem'
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  )
}

function CancelPenaltyModal({ booking, onConfirm, onCancel, loading }) {
  const penaltyAmount = booking ? booking.totalCost * 0.3 : 0
  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 9999
    }}>
      <div style={{
        background: 'var(--surface, #1e1e2e)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '16px',
        padding: '36px',
        width: '420px',
        maxWidth: '95vw',
        boxShadow: '0 24px 64px rgba(0,0,0,0.5)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            width: '56px', height: '56px', borderRadius: '50%',
            background: 'rgba(229,57,53,0.12)', border: '2px solid #E53935',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px'
          }}>
            <X size={28} color="#E53935" />
          </div>
          <h3 style={{ margin: '0 0 6px', fontSize: '1.25rem', fontWeight: 700 }}>Cancel Service Booking</h3>
          <p style={{ margin: 0, color: 'var(--gray-400)', fontSize: '0.9rem' }}>
            Warning: Cancelling will incur a <strong style={{ color: '#E53935' }}>30% penalty</strong>.
          </p>
        </div>

        <div style={{ marginBottom: '20px', padding: '12px 16px', background: 'rgba(255,255,255,0.04)', borderRadius: '8px', fontSize: '0.85rem', color: 'var(--gray-400)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span>Booking ID</span>
            <span style={{ color: 'var(--gray-200)', fontWeight: 600 }}>{booking?.bookingId}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span>Total Value</span>
            <span style={{ color: 'var(--gray-200)', fontWeight: 600 }}>₹{booking?.totalCost?.toLocaleString('en-IN')}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Cancellation Penalty (30%)</span>
            <span style={{ color: '#E53935', fontWeight: 600 }}>₹{penaltyAmount.toLocaleString('en-IN')}</span>
          </div>
        </div>

        <p style={{ fontSize: '0.86rem', color: 'var(--gray-400)', marginBottom: '24px', lineHeight: '1.4' }}>
          This penalty (₹{penaltyAmount.toLocaleString('en-IN')}) will be deducted from your total earnings. If your balance becomes negative, it will be automatically adjusted in your future service completions.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button
            onClick={onConfirm}
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              background: '#E53935',
              color: 'white',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '0.95rem',
              transition: 'all 0.2s',
              textAlign: 'center',
              border: 'none'
            }}
          >
            {loading ? 'Processing Cancellation...' : `Yes, Cancel & Deduct ₹${penaltyAmount}`}
          </button>
          
          <button
            onClick={onCancel}
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'var(--gray-300)',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.9rem',
              transition: 'all 0.2s',
              textAlign: 'center'
            }}
          >
            Keep Service Booking
          </button>
        </div>
      </div>
    </div>
  )
}

function ProviderBookings({ bookings, onComplete, onStatusUpdate, onStart, onCancel }) {
  const [payModal, setPayModal] = useState(null) // booking object being completed
  const [paying, setPaying] = useState(false)
  const [cancelModal, setCancelModal] = useState(null) // booking object being cancelled
  const [cancelling, setCancelling] = useState(false)
  
  const activeAndDone = bookings.filter(b => ['Active', 'In-Progress', 'Completed'].includes(b.status))

  const handleStartClick = async (booking) => {
    if (window.confirm('Are you sure you want to start this service?')) {
      try {
        if (onStart) await onStart(booking._id)
      } catch (err) {
        alert('Failed to start service: ' + err.message)
      }
    }
  }

  const handleCancelClick = (booking) => {
    setCancelModal(booking)
  }

  const handleCancelConfirm = async () => {
    setCancelling(true)
    try {
      if (onCancel) await onCancel(cancelModal._id)
      setCancelModal(null)
    } catch (err) {
      alert('Failed to cancel booking: ' + err.message)
    } finally {
      setCancelling(false)
    }
  }

  const handleCompleteClick = (booking) => {
    setPayModal(booking)
  }

  const handleCashPayment = async () => {
    setPaying(true)
    try {
      await api.providerComplete(payModal._id, 'cash')
      setPayModal(null)
      if (onComplete) onComplete()
    } catch (err) {
      console.error(err)
      alert('Failed to complete booking: ' + err.message)
    } finally {
      setPaying(false)
    }
  }

  const handleUPIPayment = async () => {
    setPaying(true)
    try {
      const loaded = await loadRazorpayScript()
      if (!loaded) {
        throw new Error('Failed to load Razorpay. Check your internet connection.')
      }

      const remainingAmount = payModal.totalCost * 0.8
      const user = api.getUser()

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_q31m9CozvW9C3v',
        amount: Math.round(remainingAmount * 100),
        currency: 'INR',
        name: 'HumanForce Buddy Portal',
        description: `Remaining 80% Payment — ${payModal.bookingId}`,
        handler: async (response) => {
          try {
            await api.providerComplete(payModal._id, 'upi', response.razorpay_payment_id)
            setPayModal(null)
            if (onComplete) onComplete()
          } catch (err) {
            alert('Payment succeeded but booking update failed: ' + err.message)
          } finally {
            setPaying(false)
          }
        },
        prefill: {
          name: payModal.client ? `${payModal.client.firstName} ${payModal.client.lastName}` : '',
          email: payModal.client?.email || '',
          contact: payModal.client?.phone || ''
        },
        theme: { color: '#1E88E5' },
        modal: {
          ondismiss: () => {
            setPaying(false)
          }
        }
      }

      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (err) {
      console.error(err)
      alert(err.message || 'Failed to initialize UPI payment. You can use the "Simulate UPI" button to complete this booking.')
      setPaying(false)
    }
  }

  const handleSimulateUPI = async () => {
    setPaying(true)
    try {
      await api.providerComplete(payModal._id, 'upi', `simpay_upi_${Date.now()}`)
      setPayModal(null)
      if (onComplete) onComplete()
    } catch (err) {
      console.error(err)
      alert('Failed to complete booking: ' + err.message)
    } finally {
      setPaying(false)
    }
  }

  return (
    <div className="dash-content">
      {payModal && (
        <PaymentModal
          booking={payModal}
          onCash={handleCashPayment}
          onUPI={handleUPIPayment}
          onSimulateUPI={handleSimulateUPI}
          onCancel={() => setPayModal(null)}
          loading={paying}
        />
      )}

      {cancelModal && (
        <CancelPenaltyModal
          booking={cancelModal}
          onConfirm={handleCancelConfirm}
          onCancel={() => setCancelModal(null)}
          loading={cancelling}
        />
      )}

      <h2 className="dash-page-title">Bookings</h2>
      <div className="dash-card">
        <div className="orders-table-wrap">
          {activeAndDone.length === 0 ? (
            <p style={{ padding: '40px', textAlign: 'center', color: 'var(--gray-500)' }}>No active or past bookings currently assigned.</p>
          ) : (
            <table className="data-table">
              <thead><tr><th>Client</th><th>Service</th><th>Start Date</th><th>Hours</th><th>Status</th><th>Amount</th><th>Payment</th><th>Action</th></tr></thead>
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
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span className={`status-pill ${b.remainingPaid ? 'status-active' : 'status-pending'}`} style={{ fontSize: '0.7rem' }}>
                          {b.remainingPaid ? '✓ Fully Paid' : '⏳ 80% Pending'}
                        </span>
                        {b.remainingPaymentMethod && (
                          <span style={{ fontSize: '0.68rem', color: 'var(--gray-400)' }}>
                            via {b.remainingPaymentMethod.toUpperCase()}
                          </span>
                        )}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        {b.status === 'Active' && (
                          <button
                            onClick={() => handleStartClick(b)}
                            style={{
                              background: 'rgba(21,101,192,0.1)',
                              border: '1px solid rgba(21,101,192,0.3)',
                              color: '#1565C0',
                              padding: '6px 12px',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '0.8rem',
                              fontWeight: 600,
                              whiteSpace: 'nowrap'
                            }}
                          >
                            ▶ Start Service
                          </button>
                        )}
                        {b.status === 'In-Progress' && (
                          <button
                            onClick={() => handleCompleteClick(b)}
                            style={{
                              background: 'rgba(67,160,71,0.1)',
                              border: '1px solid rgba(67,160,71,0.3)',
                              color: '#43A047',
                              padding: '6px 12px',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '0.8rem',
                              fontWeight: 600,
                              whiteSpace: 'nowrap'
                            }}
                          >
                            ✓ Complete Job
                          </button>
                        )}
                        {['Active', 'In-Progress'].includes(b.status) && (
                          <button
                            onClick={() => handleCancelClick(b)}
                            style={{
                              background: 'rgba(229,57,53,0.1)',
                              border: '1px solid rgba(229,57,53,0.3)',
                              color: '#E53935',
                              padding: '6px 12px',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '0.8rem',
                              fontWeight: 600,
                              whiteSpace: 'nowrap'
                            }}
                          >
                            ✕ Cancel
                          </button>
                        )}
                        {b.status === 'Completed' && (
                          <span style={{ color: '#43A047', fontSize: '0.8rem', fontWeight: 600, whiteSpace: 'nowrap' }}>✓ Settled</span>
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

function ProviderRequests({ bookings, onStatusUpdate }) {
  const pendingRequests = bookings.filter(b => b.status === 'Pending')

  const getMinutesRemaining = (createdAt, lastReassignedAt) => {
    const baseline = lastReassignedAt ? new Date(lastReassignedAt) : new Date(createdAt)
    const elapsed = (Date.now() - baseline.getTime()) / (1000 * 60)
    const remaining = Math.max(0, 30 - Math.floor(elapsed))
    return remaining
  }

  return (
    <div className="dash-content">
      <h2 className="dash-page-title">Incoming Requests</h2>
      <div className="requests-list">
        {pendingRequests.length === 0 ? (
          <div className="dash-card" style={{ padding: '60px', textAlign: 'center' }}>
            <p style={{ color: 'var(--gray-500)' }}>No pending customer assignment requests currently.</p>
          </div>
        ) : (
          pendingRequests.map((r) => {
            const minutesLeft = getMinutesRemaining(r.createdAt, r.lastReassignedAt)
            const isUrgent = minutesLeft <= 10
            return (
              <div key={r._id} className="request-card dash-card">
                <div className="request-header">
                  <div className="request-client-avatar" style={{ background: '#E53935', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                    {r.client?.avatar ? (
                      <img src={r.client.avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      r.client?.firstName?.[0] || 'C'
                    )}
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
                    {/* Auto-reassign countdown */}
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      marginTop: '8px',
                      padding: '4px 10px',
                      borderRadius: '20px',
                      background: isUrgent ? 'rgba(229,57,53,0.1)' : 'rgba(255,152,0,0.1)',
                      border: `1px solid ${isUrgent ? 'rgba(229,57,53,0.3)' : 'rgba(255,152,0,0.3)'}`,
                      fontSize: '0.78rem',
                      color: isUrgent ? '#E53935' : '#FF9800',
                      fontWeight: 600
                    }}>
                      <Clock size={12} />
                      {minutesLeft === 0
                        ? 'Auto-reassigning shortly...'
                        : `Auto-reassign in ${minutesLeft} min`}
                    </div>
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
            )
          })
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
                <div className="convo-avatar" style={{ background: '#E53935', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  {c.user?.avatar ? (
                    <img src={c.user.avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    c.user?.firstName?.[0] || 'C'
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
                    activeThread.user?.firstName?.[0] || 'C'
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

function Placeholder({ title }) {
  return <div className="dash-content"><h2 className="dash-page-title">{title}</h2><div className="dash-card"><p style={{color:'var(--gray-500)',textAlign:'center',padding:'40px'}}>Coming soon in next release.</p></div></div>
}

export default function ProviderDashboard() {
  const navigate = useNavigate()
  const location = useLocation()
  const authenticated = api.isAuthenticated() && api.getUser()?.role === 'provider'

  useEffect(() => {
    if (!authenticated) {
      navigate('/login', { state: { from: location.pathname + location.search } })
    }
  }, [authenticated, navigate, location.pathname, location.search])

  const [sideOpen, setSideOpen] = useState(false)
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState(api.getUser())
  const [unreadCount, setUnreadCount] = useState(0)

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
      syncProfile()
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
      await syncProfile() // Refresh earnings on completion!
    } catch (err) {
      console.error(err)
    }
  }

  const handleStartBooking = async (bookingId) => {
    try {
      await api.startBooking(bookingId)
      await loadBookings()
    } catch (err) {
      console.error(err)
      throw err
    }
  }

  const handleCancelBooking = async (bookingId) => {
    try {
      await api.providerCancelBooking(bookingId)
      await loadBookings()
      await syncProfile() // Deducted 30% penalty reflects in earnings immediately
    } catch (err) {
      console.error(err)
      throw err
    }
  }

  const handleLogout = () => {
    api.logout()
    navigate('/')
  }

  if (!authenticated) {
    return null
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
          <div className="dash-user-avatar" style={{ background: '#E53935', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
            {currentUser.avatar ? (
              <img src={currentUser.avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              getInitials()
            )}
          </div>
          <div>
            <div className="dash-user-name">{currentUser.firstName} {currentUser.lastName}</div>
            <div className="dash-user-role" style={{ textTransform: 'capitalize' }}>Verified Provider</div>
          </div>
        </div>

        <nav className="dash-nav">
          {NAV.map(n => {
            const isMessages = n.label === 'Client Messages'
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
          <Route index element={<ProviderHome user={currentUser} bookings={bookings} />} />
          <Route path="bookings" element={<ProviderBookings bookings={bookings} onStatusUpdate={handleStatusUpdate} onComplete={async () => { await loadBookings(); await syncProfile() }} onStart={handleStartBooking} onCancel={handleCancelBooking} />} />
          <Route path="requests" element={<ProviderRequests bookings={bookings} onStatusUpdate={handleStatusUpdate} />} />
          <Route path="earnings" element={<ProviderEarnings user={currentUser} bookings={bookings} />} />
          <Route path="messages" element={<DashMessages onMessagesRead={loadUnreadCount} />} />
          <Route path="reviews" element={<ProviderReviews />} />
          <Route path="calendar" element={<Placeholder title="Calendar"/>} />
        </Routes>
      </main>
    </div>
  )
}
