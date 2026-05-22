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
    const serviceId = service._id || service.serviceId
    if (api.isAuthenticated()) {
      navigate(`/dashboard/book?service=${serviceId}`)
    } else {
      navigate('/login', { state: { from: `/dashboard/book?service=${serviceId}` } })
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
    </main>
  )
}
