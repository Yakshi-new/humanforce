import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Star, CheckCircle, ArrowRight, MessageSquare, Calendar, Shield, Clock, Globe } from 'lucide-react'
import './ServiceDetail.css'

const SERVICES_DATA = {
  1: { title: 'Executive Personal Assistant', category: 'Personal Assistant', price: 35, rating: 4.9, reviews: 214,
    overview: 'A top-tier executive personal assistant with 6+ years experience supporting C-suite executives at Fortune 500 companies. Specializing in calendar management, travel coordination, and communication handling.',
    skills: ['Calendar Management', 'Email Management', 'Travel Booking', 'Meeting Scheduling', 'Expense Reports', 'CRM Management', 'Research', 'Document Preparation'],
    deliverables: ['Daily briefings', 'Inbox zero management', 'Travel itineraries', 'Meeting notes & follow-ups', 'Weekly activity reports'],
    availability: 'Full-time (40 hrs/week)', lang: 'English, Spanish', timezone: 'EST / PST',
    reviews: [
      { name: 'James T.', rating: 5, text: 'Absolutely exceptional. Handles everything flawlessly. Best PA I\'ve ever worked with.', date: '2 weeks ago' },
      { name: 'Sarah M.', rating: 5, text: 'Transformed my workday. My calendar is always organized and travel is always smooth.', date: '1 month ago' },
      { name: 'Chen W.', rating: 4, text: 'Very professional and proactive. Minor communication lag occasionally but excellent overall.', date: '2 months ago' },
    ]
  }
}

const DEFAULT_SERVICE = SERVICES_DATA[1]

export default function ServiceDetail() {
  const { id } = useParams()
  const service = SERVICES_DATA[id] || DEFAULT_SERVICE
  const [tab, setTab] = useState('overview')
  const [bookingDate, setBookingDate] = useState('')
  const [bookingHours, setBookingHours] = useState(10)
  const [booked, setBooked] = useState(false)
  const [message, setMessage] = useState('')

  const handleBook = e => {
    e.preventDefault()
    setBooked(true)
  }

  return (
    <main className="detail-page">
      {/* Hero */}
      <div className="detail-hero">
        <div className="container">
          <div className="breadcrumb">
            <Link to="/">Home</Link> / <Link to="/services">Services</Link> / <span>{service.title}</span>
          </div>
        </div>
      </div>

      <div className="container detail-layout">
        {/* Main Content */}
        <div className="detail-main">
          <div className="detail-header-card card">
            <div className="detail-avatar-wrap">
              <div className="detail-avatar">{service.title[0]}</div>
              <div className="detail-availability">● Available Now</div>
            </div>
            <div className="detail-info">
              <span className="badge badge-red">{service.category}</span>
              <h1 className="detail-title">{service.title}</h1>
              <div className="detail-meta">
                <div className="detail-rating">
                  <Star size={16} fill="#FFC107" color="#FFC107" />
                  <strong>{service.rating}</strong>
                  <span>({service.reviews.length} reviews)</span>
                </div>
                <div className="detail-stat"><Clock size={15} />{service.availability}</div>
                <div className="detail-stat"><Globe size={15} />{service.lang}</div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="detail-tabs">
            {['overview', 'skills', 'deliverables', 'reviews'].map(t => (
              <button key={t} className={`tab-btn ${tab === t ? 'tab-active' : ''}`} onClick={() => setTab(t)}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          <div className="card tab-content">
            {tab === 'overview' && (
              <div>
                <h3>About This Service</h3>
                <p style={{marginTop:'12px'}}>{service.overview}</p>
                <div className="trust-badges">
                  {[{ icon: <Shield size={16}/>, label: 'ID Verified' },{ icon: <CheckCircle size={16}/>, label: 'Skills Tested' },{ icon: <Star size={16}/>, label: 'Top Rated' }].map((b,i) => (
                    <div key={i} className="trust-badge-item"><span className="tb-icon">{b.icon}</span>{b.label}</div>
                  ))}
                </div>
              </div>
            )}
            {tab === 'skills' && (
              <div>
                <h3>Skills & Expertise</h3>
                <div className="skills-wrap" style={{marginTop:'16px'}}>
                  {service.skills.map(sk => (
                    <span key={sk} className="skill-pill">{sk}</span>
                  ))}
                </div>
              </div>
            )}
            {tab === 'deliverables' && (
              <div>
                <h3>What You'll Receive</h3>
                <ul className="deliverables-list">
                  {service.deliverables.map((d,i) => (
                    <li key={i}><CheckCircle size={16} className="check-icon" />{d}</li>
                  ))}
                </ul>
              </div>
            )}
            {tab === 'reviews' && (
              <div>
                <h3>Client Reviews</h3>
                <div className="reviews-list">
                  {service.reviews.map((r,i) => (
                    <div key={i} className="review-item">
                      <div className="review-header">
                        <div className="review-avatar">{r.name[0]}</div>
                        <div>
                          <div className="review-name">{r.name}</div>
                          <div className="review-date">{r.date}</div>
                        </div>
                        <div className="review-stars">{'★'.repeat(r.rating)}</div>
                      </div>
                      <p className="review-text">{r.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Related Services */}
          <div className="related-section">
            <h3>Related Services</h3>
            <div className="related-grid">
              {[{ title: 'Business Operations Manager', price: 45, rating: 4.8 },{ title: 'Data Entry Specialist', price: 22, rating: 4.6 },{ title: 'Recruitment Assistant', price: 36, rating: 4.7 }].map((r,i) => (
                <Link to="/services/2" key={i} className="related-card">
                  <h4>{r.title}</h4>
                  <div className="related-meta">
                    <span className="stars-sm">★ {r.rating}</span>
                    <span className="related-price">from ${r.price}/hr</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Booking Sidebar */}
        <div className="detail-sidebar">
          <div className="booking-card card">
            <div className="booking-price">
              <span className="booking-from">Starting from</span>
              <div className="booking-amount"><span>$</span>{service.price}<span className="booking-unit">/hr</span></div>
            </div>
            {!booked ? (
              <form onSubmit={handleBook} className="booking-form">
                <div className="form-group">
                  <label className="form-label">Start Date</label>
                  <input type="date" value={bookingDate} onChange={e => setBookingDate(e.target.value)} className="form-input" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Hours per Week: <strong>{bookingHours}</strong></label>
                  <input type="range" min="5" max="40" value={bookingHours} onChange={e => setBookingHours(+e.target.value)} className="price-slider" />
                  <div className="slider-labels"><span>5 hrs</span><span>40 hrs</span></div>
                </div>
                <div className="form-group">
                  <label className="form-label">Message (optional)</label>
                  <textarea value={message} onChange={e => setMessage(e.target.value)} className="form-input" rows="3" placeholder="Tell them about your requirements..." style={{resize:'vertical'}} />
                </div>
                <div className="booking-total">
                  <span>Estimated weekly:</span>
                  <strong>${(service.price * bookingHours).toLocaleString()}</strong>
                </div>
                <button type="submit" className="btn-primary booking-btn">
                  <Calendar size={18} /> Book Now
                </button>
              </form>
            ) : (
              <div className="booking-success">
                <CheckCircle size={40} className="check-icon" />
                <h4>Booking Requested!</h4>
                <p>You'll receive a confirmation within 2 hours.</p>
              </div>
            )}
            <a href="https://wa.me/18001234567" target="_blank" rel="noopener noreferrer" className="whatsapp-contact">
              <MessageSquare size={16} /> Contact via WhatsApp
            </a>
          </div>
          <div className="guarantee-card card">
            <Shield size={20} className="check-icon" />
            <div>
              <strong>Satisfaction Guaranteed</strong>
              <p>Not happy? We'll replace your professional free of charge.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
