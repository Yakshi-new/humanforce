import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Star, CheckCircle, ArrowRight, MessageSquare, Calendar, Shield, Clock, Globe, Zap } from 'lucide-react'
import * as LucideIcons from 'lucide-react'
import { api, loadRazorpayScript } from '../utils/api'
import './ServiceDetail.css'

const getIcon = (name) => {
  return LucideIcons[name] || Zap
}

export default function ServiceDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [service, setService] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [tab, setTab] = useState('overview')
  const [bookingForm, setBookingForm] = useState({ date: '', time: '12:00', hours: 2, note: '' })
  const [booked, setBooked] = useState(false)
  const [bookingLoading, setBookingLoading] = useState(false)
  const [bookingError, setBookingError] = useState('')

  useEffect(() => {
    const fetchService = async () => {
      try {
        setLoading(true)
        const data = await api.getServiceById(id)
        setService(data)
      } catch (err) {
        console.error(err)
        setError('Service catalog item could not be loaded.')
      } finally {
        setLoading(false)
      }
    }
    fetchService()
  }, [id])

  const handleBook = async (e) => {
    e.preventDefault()
    setBookingError('')

    if (!api.isAuthenticated()) {
      navigate('/login', { state: { from: `/services/${id}` } })
      return
    }

    const user = api.getUser()
    const depositAmount = (service.price * bookingForm.hours) * 0.2

    try {
      setBookingLoading(true)

      // 1. Load Razorpay script dynamically
      const loaded = await loadRazorpayScript()
      if (!loaded) {
        throw new Error('Failed to load payment gateway. Check your internet connection.')
      }

      // 2. Open Razorpay checkout options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_q31m9CozvW9C3v', // Test Key
        amount: Math.round(depositAmount * 100), // in paise
        currency: 'INR',
        name: 'HumanForce Buddy Portal',
        description: `20% Booking Deposit for ${service.name}`,
        handler: async function (response) {
          try {
            setBookingLoading(true)
            // 3. Create the booking on successful payment
            await api.createBooking({
              serviceId: service.serviceId,
              date: bookingForm.date,
              time: bookingForm.time,
              hours: bookingForm.hours,
              note: bookingForm.note,
              razorpayPaymentId: response.razorpay_payment_id
            })
            setBooked(true)
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
          color: '#E53935' // HumanForce Red theme
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
    if (!api.isAuthenticated()) {
      navigate('/login', { state: { from: `/services/${id}` } })
      return
    }
    if (!bookingForm.date || !bookingForm.time) {
      setBookingError('Please select a valid scheduled date and start time.')
      return
    }
    try {
      setBookingLoading(true)
      await api.createBooking({
        serviceId: service.serviceId,
        date: bookingForm.date,
        time: bookingForm.time,
        hours: bookingForm.hours,
        note: bookingForm.note,
        razorpayPaymentId: `simpay_${Date.now()}`
      })
      setBooked(true)
    } catch (err) {
      console.error(err)
      setBookingError(err.message || 'Failed to complete booking processing.')
    } finally {
      setBookingLoading(false)
    }
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--gray-950)' }}>
        <p style={{ color: '#E53935' }}>Retrieving service specs...</p>
      </div>
    )
  }

  if (error || !service) {
    return (
      <div className="container" style={{ padding: '80px 24px', textAlign: 'center', color: '#E53935' }}>
        <h2>Error Loading Catalog</h2>
        <p>{error || 'Catalog item not found.'}</p>
        <Link to="/services" className="btn-primary" style={{ marginTop: '20px', display: 'inline-block' }}>Back to Services</Link>
      </div>
    )
  }

  const IconComponent = getIcon(service.iconName)

  return (
    <main className="detail-page">
      {/* Hero */}
      <div className="detail-hero" style={{ background: service.bg }}>
        <div className="container">
          <div className="breadcrumb" style={{ color: 'rgba(255,255,255,0.7)' }}>
            <Link to="/" style={{ color: 'white' }}>Home</Link> / <Link to="/services" style={{ color: 'white' }}>Services</Link> / <span>{service.name}</span>
          </div>
        </div>
      </div>

      <div className="container detail-layout">
        {/* Main Content */}
        <div className="detail-main">
          <div className="detail-header-card card">
            <div className="detail-avatar-wrap">
              <div className="detail-avatar" style={{ background: service.bg, color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <IconComponent size={32} />
              </div>
              <div className="detail-availability">● Available Now</div>
            </div>
            <div className="detail-info">
              <span className="badge badge-red">{service.category}</span>
              <h1 className="detail-title">{service.name}</h1>
              <div className="detail-meta">
                <div className="detail-rating">
                  <Star size={16} fill="#FFC107" color="#FFC107" />
                  <strong>{service.rating || 4.8}</strong>
                  <span>({service.reviews || 120} reviews)</span>
                </div>
                <div className="detail-stat"><Clock size={15} /> On-Demand Coordinate</div>
                <div className="detail-stat"><Globe size={15} /> English, Hindi & Regional</div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="detail-tabs">
            {['overview', 'skills', 'deliverables'].map(t => (
              <button key={t} className={`tab-btn ${tab === t ? 'tab-active' : ''}`} onClick={() => setTab(t)}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          <div className="card tab-content">
            {tab === 'overview' && (
              <div>
                <h3>About This Service</h3>
                <p style={{marginTop:'12px', lineHeight: '1.6'}}>{service.desc}</p>
                <div className="trust-badges">
                  {[{ icon: <Shield size={16}/>, label: 'ID Verified Buddy' },{ icon: <CheckCircle size={16}/>, label: 'Skills Inspected' },{ icon: <Star size={16}/>, label: 'Highest Rated' }].map((b,i) => (
                    <div key={i} className="trust-badge-item"><span className="tb-icon">{b.icon}</span>{b.label}</div>
                  ))}
                </div>
              </div>
            )}
            {tab === 'skills' && (
              <div>
                <h3>Specialization & Highlights</h3>
                <div className="skills-wrap" style={{marginTop:'16px'}}>
                  {service.tags.map(sk => (
                    <span key={sk} className="skill-pill">{sk}</span>
                  ))}
                </div>
              </div>
            )}
            {tab === 'deliverables' && (
              <div>
                <h3>Platform Execution Standards</h3>
                <ul className="deliverables-list">
                  {[
                    'Highly verified, respectful and active professional buddy',
                    'Zero-friction event scheduling coordinates',
                    'Complete dynamic matching algorithms with secure check-in',
                    'Dynamic hourly tracking dashboard logs'
                  ].map((d,i) => (
                    <li key={i}><CheckCircle size={16} className="check-icon" />{d}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Booking Sidebar */}
        <div className="detail-sidebar">
          <div className="booking-card card">
            <div className="booking-price">
              <span className="booking-from">Hourly Rate</span>
              <div className="booking-amount"><span>₹</span>{service.price}<span className="booking-unit">/hr</span></div>
            </div>

            {bookingError && (
              <div className="booking-error" style={{
                background: 'rgba(229,57,53,0.1)',
                border: '1px solid rgba(229,57,53,0.3)',
                color: '#E53935',
                padding: '10px 14px',
                borderRadius: '6px',
                fontSize: '0.85rem',
                marginBottom: '16px',
                fontWeight: 500
              }}>
                {bookingError}
              </div>
            )}

            {!booked ? (
              <form onSubmit={handleBook} className="booking-form">
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
                  />
                  <div className="slider-labels"><span>1 hr</span><span>8 hrs</span></div>
                </div>
                <div className="form-group">
                  <label className="form-label">Special Requests (optional)</label>
                  <textarea 
                    value={bookingForm.note} 
                    onChange={e => setBookingForm({ ...bookingForm, note: e.target.value })} 
                    className="form-input" 
                    rows="3" 
                    placeholder="Tell them about your coordinates..." 
                    style={{resize:'vertical'}} 
                  />
                </div>
                <div className="booking-total" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '12px', marginBottom: '12px' }}>
                  <span>Total Estimated Price:</span>
                  <strong>₹{(service.price * bookingForm.hours).toLocaleString('en-IN')} + GST</strong>
                </div>
                <div className="booking-total" style={{ marginTop: '0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#43A047', fontWeight: 600 }}>Payable Now (20% Deposit):</span>
                  <strong style={{ color: '#43A047', fontSize: '1.4rem' }}>₹{((service.price * bookingForm.hours) * 0.2).toLocaleString('en-IN')}</strong>
                </div>
                
                {!api.isAuthenticated() ? (
                  <button type="button" className="btn-primary booking-btn" onClick={() => navigate('/login', { state: { from: `/services/${id}` } })}>
                    Sign In to Book
                  </button>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <button type="submit" disabled={bookingLoading} className="btn-primary booking-btn">
                      {bookingLoading ? 'Processing Request...' : <><Calendar size={18} /> Book Buddy</>}
                    </button>
                    <button type="button" onClick={handleSimulatedBook} disabled={bookingLoading} className="btn-outline booking-btn-sim" style={{ borderColor: '#43A047', color: '#43A047', background: 'transparent', padding: '12px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                      ⚡ Simulate Payment (Test Mode)
                    </button>
                  </div>
                )}
              </form>
            ) : (
              <div className="booking-success" style={{ textAlign: 'center', padding: '30px 10px' }}>
                <CheckCircle size={40} className="check-icon" style={{ color: '#43A047', margin: '0 auto 12px' }} />
                <h4>Booking Deposit Processed!</h4>
                <p style={{ fontSize: '0.88rem', color: 'var(--gray-400)', marginTop: '8px' }}>
                  Your 20% deposit down payment has been successfully secured. Check status logs and chat with your buddy directly in the dashboard.
                </p>
                <Link to="/dashboard" className="btn-primary" style={{ marginTop: '16px', display: 'inline-block', padding: '8px 16px', fontSize: '0.85rem' }}>
                  Open Dashboard
                </Link>
              </div>
            )}
            <a href="https://wa.me/919999999999" target="_blank" rel="noopener noreferrer" className="whatsapp-contact">
              <MessageSquare size={16} /> Instant Support
            </a>
          </div>
          
          <div className="guarantee-card card">
            <Shield size={20} className="check-icon" style={{ color: '#43A047' }} />
            <div>
              <strong>Satisfaction Standard</strong>
              <p>Premium 100% replacement pledge if buddy pairing doesn't suit your expectations.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
