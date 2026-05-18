import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, X, Star, CheckCircle, ArrowRight, Clock, Zap } from 'lucide-react'
import * as LucideIcons from 'lucide-react'
import { api } from '../utils/api'
import './Services.css'

const CATEGORIES = ['All', 'Entertainment', 'Lifestyle', 'Adventure', 'Care', 'Professional', 'Nightlife']

// Helper to resolve string icon name to a Lucide icon component dynamically
const getIcon = (name) => {
  return LucideIcons[name] || Zap
}

export default function Services() {
  const navigate = useNavigate()
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  
  // Booking modal state
  const [booked, setBooked] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [bookingForm, setBookingForm] = useState({ date: '', time: '', hours: 2, note: '' })
  const [confirmed, setConfirmed] = useState(false)
  const [bookingError, setBookingError] = useState('')
  const [bookingLoading, setBookingLoading] = useState(false)

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true)
        const data = await api.getServices()
        setServices(data)
      } catch (err) {
        console.error('Error fetching services:', err)
        setError('Failed to load services. Please check backend connection.')
      } finally {
        setLoading(false)
      }
    }
    fetchServices()
  }, [])

  const filtered = services.filter(s => {
    if (category !== 'All' && s.category !== category) return false
    if (search && !s.name.toLowerCase().includes(search.toLowerCase()) && !s.desc.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const openBooking = (service) => {
    setBooked(service)
    setShowModal(true)
    setConfirmed(false)
    setBookingError('')
    setBookingForm({ date: '', time: '', hours: 2, note: '' })
  }

  const handleConfirm = async (e) => {
    e.preventDefault()
    setBookingError('')

    // Authentication Guard
    if (!api.isAuthenticated()) {
      navigate('/login')
      return
    }

    try {
      setBookingLoading(true)
      await api.createBooking({
        serviceId: booked.serviceId,
        date: bookingForm.date,
        time: bookingForm.time,
        hours: bookingForm.hours,
        note: bookingForm.note
      })
      setConfirmed(true)
    } catch (err) {
      console.error(err)
      setBookingError(err.message || 'Failed to submit booking. Try again.')
    } finally {
      setBookingLoading(false)
    }
  }

  return (
    <main className="services-page">
      {/* Hero */}
      <div className="services-hero">
        <div className="container">
          <div className="services-hero-badge">
            <CheckCircle size={16} /> Trusted by 50,000+ Users Across India
          </div>
          <h1>Book a <span className="text-red">Buddy</span> for Any Occasion</h1>
          <p>Verified, friendly, and ready to accompany you — anytime, anywhere. Experience seamless marketplace matching.</p>
          <div className="services-search-wrap">
            <Search size={20} className="search-icon" />
            <input
              type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search services — Movies, Travel, Elder Care..."
              className="services-search-input"
            />
            {search && <button onClick={() => setSearch('')} className="search-clear"><X size={16} /></button>}
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="categories-strip">
        <div className="container">
          <div className="cat-pills">
            {CATEGORIES.map(c => (
              <button
                key={c}
                className={`cat-pill ${category === c ? 'active' : ''}`}
                onClick={() => setCategory(c)}
              >{c}</button>
            ))}
          </div>
          <p className="results-label">
            {loading ? 'Loading services...' : <span><strong>{filtered.length}</strong> services available</span>}
          </p>
        </div>
      </div>

      {/* Services Grid */}
      <div className="container">
        {loading ? (
          <div className="services-loading-state" style={{ padding: '60px 0', textAlign: 'center' }}>
            <div className="loader" style={{
              width: '40px',
              height: '40px',
              border: '3px solid rgba(229,57,53,0.1)',
              borderTopColor: '#E53935',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 16px'
            }}></div>
            <p style={{ color: 'var(--gray-400)' }}>Loading premium on-demand services...</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : error ? (
          <div className="services-error-state" style={{ padding: '60px 0', textAlign: 'center', color: '#E53935' }}>
            <p>{error}</p>
          </div>
        ) : (
          <>
            <div className="hor-services-grid">
              {filtered.map(s => {
                const IconComponent = getIcon(s.iconName)
                return (
                  <div key={s._id || s.serviceId} className="hor-svc-card" style={{ '--card-color': s.color }}>
                    <div className="hor-card-bg" style={{ background: s.bg }}>
                      <div className="hor-card-icon-wrap">
                        <IconComponent size={36} color="white" />
                      </div>
                      <div className="hor-card-price">
                        <Clock size={12} /> ₹{s.price.toLocaleString('en-IN')}/hr
                      </div>
                    </div>
                    <div className="hor-card-body">
                      <div className="hor-card-top">
                        <h3>{s.name}</h3>
                        <span className="hor-cat-badge">{s.category}</span>
                      </div>
                      <p className="hor-card-desc">{s.desc}</p>
                      <div className="hor-card-tags">
                        {s.tags.map(t => <span key={t} className="hor-tag">{t}</span>)}
                      </div>
                      <div className="hor-card-footer">
                        <div className="hor-rating">
                          <Star size={13} fill="#FFC107" color="#FFC107" />
                          <strong>{s.rating || 4.8}</strong>
                          <span>({s.reviews || 120} reviews)</span>
                        </div>
                        <button className="hor-book-btn" onClick={() => openBooking(s)}>
                          Book Now <ArrowRight size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {filtered.length === 0 && (
              <div className="no-results">
                <p>No services match "<strong>{search}</strong>". <button onClick={() => { setSearch(''); setCategory('All') }} className="link-red">Clear filters</button></p>
              </div>
            )}
          </>
        )}
      </div>

      {/* GST Notice */}
      <div className="gst-notice">
        <div className="container">
          <p>* All prices are starting rates. Final pricing may vary based on location, duration, and service specifics. GST applicable as per government norms. Registered on <strong>HumanOnRent.AI</strong>.</p>
        </div>
      </div>

      {/* Booking Modal */}
      {showModal && booked && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="booking-modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowModal(false)}><X size={20} /></button>

            {bookingError && (
              <div className="booking-error" style={{
                background: 'rgba(229,57,53,0.1)',
                border: '1px solid rgba(229,57,53,0.3)',
                color: '#E53935',
                padding: '10px 14px',
                borderRadius: '6px',
                fontSize: '0.85rem',
                margin: '16px',
                fontWeight: 500
              }}>
                {bookingError}
              </div>
            )}

            {!confirmed ? (
              <>
                <div className="modal-header" style={{ background: booked.bg }}>
                  <div className="modal-icon">
                    {(() => {
                      const ModalIcon = getIcon(booked.iconName)
                      return <ModalIcon size={32} color="white" />
                    })()}
                  </div>
                  <h2>{booked.name}</h2>
                  <p>₹{booked.price.toLocaleString('en-IN')}/hr + GST</p>
                </div>
                <form className="booking-form" onSubmit={handleConfirm}>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Date</label>
                      <input type="date" required value={bookingForm.date}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={e => setBookingForm({ ...bookingForm, date: e.target.value })} />
                    </div>
                    <div className="form-group">
                      <label>Time</label>
                      <input type="time" required value={bookingForm.time}
                        onChange={e => setBookingForm({ ...bookingForm, time: e.target.value })} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Duration: <strong>{bookingForm.hours} hour{bookingForm.hours > 1 ? 's' : ''}</strong></label>
                    <input type="range" min="1" max="8" value={bookingForm.hours}
                      onChange={e => setBookingForm({ ...bookingForm, hours: +e.target.value })}
                      className="hours-slider" style={{ '--scolor': booked.color }} />
                    <div className="slider-labels"><span>1 hr</span><span>8 hrs</span></div>
                  </div>
                  <div className="form-group">
                    <label>Special Requests (optional)</label>
                    <textarea rows={3} placeholder="Any specific requirements..." value={bookingForm.note}
                      onChange={e => setBookingForm({ ...bookingForm, note: e.target.value })} />
                  </div>
                  <div className="booking-summary">
                    <span>Total Estimate</span>
                    <strong style={{ color: booked.color }}>₹{(booked.price * bookingForm.hours).toLocaleString('en-IN')} + GST</strong>
                  </div>
                  
                  {!api.isAuthenticated() ? (
                    <button type="button" className="btn-book-confirm" style={{ background: '#37474F' }} onClick={() => navigate('/login')}>
                      Sign In to Book
                    </button>
                  ) : (
                    <button type="submit" disabled={bookingLoading} className="btn-book-confirm" style={{ background: booked.bg }}>
                      {bookingLoading ? 'Processing Booking...' : 'Confirm Booking'}
                    </button>
                  )}
                </form>
              </>
            ) : (
              <div className="booking-success">
                <div className="success-icon" style={{ background: booked.bg }}>
                  <CheckCircle size={48} color="white" />
                </div>
                <h2>Booking Confirmed!</h2>
                <p>Your <strong>{booked.name}</strong> buddy has been booked for <strong>{bookingForm.hours} hour{bookingForm.hours > 1 ? 's' : ''}</strong> on <strong>{bookingForm.date}</strong> at <strong>{bookingForm.time}</strong>.</p>
                <p className="success-note">A friendly buddy will be paired with you immediately. Monitor updates on your dashboard.</p>
                <p className="success-amount" style={{ color: booked.color }}>Total: ₹{(booked.price * bookingForm.hours).toLocaleString('en-IN')} + GST</p>
                <div className="success-actions">
                  <button className="btn-view-dash" onClick={() => setShowModal(false)}>
                    Back to Services
                  </button>
                  <Link to="/dashboard" className="btn-primary" onClick={() => setShowModal(false)}>
                    View Dashboard
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  )
}
