import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, X, Film, ShoppingBag, Plane, Stethoscope, Heart, Home, Briefcase, TreePine, ChefHat, Trophy, Dumbbell, Laugh, Wine, Coffee, GraduationCap, Music, Utensils, Palette, PartyPopper, Clock, Star, CheckCircle, ArrowRight } from 'lucide-react'
import './Services.css'

const ALL_SERVICES = [
  {
    id: 1, name: 'Movies', desc: 'Book a buddy to watch movies together — cinemas, OTT premieres, or film festivals.',
    price: 1000, icon: Film, color: '#E53935', bg: 'linear-gradient(135deg,#E53935,#C62828)',
    category: 'Entertainment', tags: ['Cinema', 'Film Festival', 'OTT'], rating: 4.8, reviews: 312,
  },
  {
    id: 2, name: 'Shopping', desc: 'A personal shopping companion to help you pick the best products and deals.',
    price: 1000, icon: ShoppingBag, color: '#D81B60', bg: 'linear-gradient(135deg,#D81B60,#AD1457)',
    category: 'Lifestyle', tags: ['Malls', 'Grocery', 'Fashion'], rating: 4.7, reviews: 289,
  },
  {
    id: 3, name: 'Travel', desc: 'Your perfect travel buddy for road trips, treks, city tours, and more.',
    price: 1000, icon: Plane, color: '#1E88E5', bg: 'linear-gradient(135deg,#1E88E5,#1565C0)',
    category: 'Adventure', tags: ['Road Trip', 'Trekking', 'City Tour'], rating: 4.9, reviews: 401,
  },
  {
    id: 4, name: 'Medical Help', desc: 'A compassionate companion for hospital visits, appointments, and post-care support.',
    price: 3000, icon: Stethoscope, color: '#43A047', bg: 'linear-gradient(135deg,#43A047,#2E7D32)',
    category: 'Care', tags: ['Hospital', 'Appointments', 'Post-Care'], rating: 4.9, reviews: 198,
  },
  {
    id: 5, name: 'Elder Care', desc: 'Warm, respectful companions for senior citizens — conversations, walks, and activities.',
    price: 1000, icon: Heart, color: '#E53935', bg: 'linear-gradient(135deg,#E53935,#C62828)',
    category: 'Care', tags: ['Senior', 'Companionship', 'Wellness'], rating: 4.9, reviews: 276,
  },
  {
    id: 6, name: 'Domestic Help', desc: 'Assistance with household tasks — cooking, cleaning, organizing, and errands.',
    price: 1000, icon: Home, color: '#FB8C00', bg: 'linear-gradient(135deg,#FB8C00,#E65100)',
    category: 'Lifestyle', tags: ['Cooking', 'Cleaning', 'Errands'], rating: 4.6, reviews: 354,
  },
  {
    id: 7, name: 'Business Events', desc: 'Professional companion for corporate events, conferences, and networking sessions.',
    price: 1000, icon: Briefcase, color: '#37474F', bg: 'linear-gradient(135deg,#37474F,#263238)',
    category: 'Professional', tags: ['Conferences', 'Networking', 'Corporate'], rating: 4.8, reviews: 187,
  },
  {
    id: 8, name: 'Outdoor Events', desc: 'An enthusiastic partner for outdoor fests, adventure sports, and nature events.',
    price: 1000, icon: TreePine, color: '#00897B', bg: 'linear-gradient(135deg,#00897B,#00695C)',
    category: 'Adventure', tags: ['Festivals', 'Nature', 'Adventure'], rating: 4.7, reviews: 243,
  },
  {
    id: 9, name: 'Baking/Cooking', desc: 'A culinary buddy to bake, cook, and explore new recipes together.',
    price: 1000, icon: ChefHat, color: '#F4511E', bg: 'linear-gradient(135deg,#F4511E,#BF360C)',
    category: 'Lifestyle', tags: ['Baking', 'Recipes', 'Culinary'], rating: 4.8, reviews: 165,
  },
  {
    id: 10, name: 'Sporting Events', desc: 'Get a passionate sports fan to join you at live matches and sporting events.',
    price: 3000, icon: Trophy, color: '#F9A825', bg: 'linear-gradient(135deg,#F9A825,#F57F17)',
    category: 'Entertainment', tags: ['Cricket', 'Football', 'Live Events'], rating: 4.8, reviews: 231,
  },
  {
    id: 11, name: 'Playing Sports', desc: 'Find a sports partner for badminton, tennis, gym workouts, swimming, and more.',
    price: 1000, icon: Dumbbell, color: '#00ACC1', bg: 'linear-gradient(135deg,#00ACC1,#00838F)',
    category: 'Adventure', tags: ['Badminton', 'Gym', 'Tennis'], rating: 4.7, reviews: 298,
  },
  {
    id: 12, name: 'Comedy Club', desc: 'Enjoy stand-up shows, improv nights, and comedy events with a fun-loving buddy.',
    price: 1000, icon: Laugh, color: '#8E24AA', bg: 'linear-gradient(135deg,#8E24AA,#6A1B9A)',
    category: 'Entertainment', tags: ['Stand-up', 'Improv', 'Fun'], rating: 4.9, reviews: 177,
  },
  {
    id: 13, name: 'Going to Bar', desc: 'A social companion for bar hopping, craft beer tasting, and evening outings.',
    price: 1000, icon: Wine, color: '#7B1FA2', bg: 'linear-gradient(135deg,#7B1FA2,#4A148C)',
    category: 'Nightlife', tags: ['Bar Hopping', 'Cocktails', 'Social'], rating: 4.6, reviews: 203,
  },
  {
    id: 14, name: 'Hanging Out', desc: 'Just want company? Book a buddy for casual hangouts, walks, and chilling.',
    price: 1000, icon: Coffee, color: '#00796B', bg: 'linear-gradient(135deg,#00796B,#004D40)',
    category: 'Lifestyle', tags: ['Casual', 'Walks', 'Coffee'], rating: 4.8, reviews: 512,
  },
  {
    id: 15, name: 'Tutoring', desc: 'Expert tutors for academics, skill development, language learning, and more.',
    price: 1000, icon: GraduationCap, color: '#1976D2', bg: 'linear-gradient(135deg,#1976D2,#0D47A1)',
    category: 'Professional', tags: ['Academics', 'Languages', 'Skills'], rating: 4.9, reviews: 389,
  },
  {
    id: 16, name: 'Clubbing', desc: 'Hit the nightclub scene with a fun, safe, and energetic clubbing companion.',
    price: 1000, icon: Music, color: '#AD1457', bg: 'linear-gradient(135deg,#AD1457,#880E4F)',
    category: 'Nightlife', tags: ['Nightclub', 'Dancing', 'Music'], rating: 4.7, reviews: 156,
  },
  {
    id: 17, name: 'Dinner', desc: 'Fine dining, casual meals, or food explorations — never dine alone again.',
    price: 1000, icon: Utensils, color: '#C62828', bg: 'linear-gradient(135deg,#C62828,#B71C1C)',
    category: 'Lifestyle', tags: ['Fine Dining', 'Restaurants', 'Food'], rating: 4.8, reviews: 341,
  },
  {
    id: 18, name: 'Music', desc: 'Attend concerts, open-mic nights, and music festivals with a fellow music lover.',
    price: 1000, icon: Music, color: '#1565C0', bg: 'linear-gradient(135deg,#1565C0,#0D47A1)',
    category: 'Entertainment', tags: ['Concerts', 'Festivals', 'Open-mic'], rating: 4.8, reviews: 267,
  },
  {
    id: 19, name: 'Culture', desc: 'Explore art galleries, museums, heritage sites, and cultural events together.',
    price: 1000, icon: Palette, color: '#2E7D32', bg: 'linear-gradient(135deg,#2E7D32,#1B5E20)',
    category: 'Adventure', tags: ['Museums', 'Art', 'Heritage'], rating: 4.7, reviews: 189,
  },
  {
    id: 20, name: 'Parties', desc: 'Book the life of the party — energetic, fun, and the perfect party companion.',
    price: 1000, icon: PartyPopper, color: '#E91E63', bg: 'linear-gradient(135deg,#E91E63,#C2185B)',
    category: 'Nightlife', tags: ['Birthday', 'Celebrations', 'Events'], rating: 4.9, reviews: 423,
  },
]

const CATEGORIES = ['All', 'Entertainment', 'Lifestyle', 'Adventure', 'Care', 'Professional', 'Nightlife']

export default function Services() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [booked, setBooked] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [bookingForm, setBookingForm] = useState({ date: '', time: '', hours: 2, note: '' })
  const [confirmed, setConfirmed] = useState(false)

  const filtered = ALL_SERVICES.filter(s => {
    if (category !== 'All' && s.category !== category) return false
    if (search && !s.name.toLowerCase().includes(search.toLowerCase()) && !s.desc.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const openBooking = (service) => {
    setBooked(service)
    setShowModal(true)
    setConfirmed(false)
    setBookingForm({ date: '', time: '', hours: 2, note: '' })
  }

  const handleConfirm = (e) => {
    e.preventDefault()
    setConfirmed(true)
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
          <p>All 20 services available at just <strong>₹1000/hr</strong>. Verified, friendly, and ready to accompany you — anytime, anywhere.</p>
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
          <p className="results-label"><strong>{filtered.length}</strong> services available</p>
        </div>
      </div>

      {/* Services Grid */}
      <div className="container">
        <div className="hor-services-grid">
          {filtered.map(s => {
            const Icon = s.icon
            return (
              <div key={s.id} className="hor-svc-card" style={{ '--card-color': s.color }}>
                <div className="hor-card-bg" style={{ background: s.bg }}>
                  <div className="hor-card-icon-wrap">
                    <Icon size={36} color="white" />
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
                      <strong>{s.rating}</strong>
                      <span>({s.reviews} reviews)</span>
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

            {!confirmed ? (
              <>
                <div className="modal-header" style={{ background: booked.bg }}>
                  <div className="modal-icon">
                    {<booked.icon size={32} color="white" />}
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
                  <button type="submit" className="btn-book-confirm" style={{ background: booked.bg }}>
                    Confirm Booking
                  </button>
                </form>
              </>
            ) : (
              <div className="booking-success">
                <div className="success-icon" style={{ background: booked.bg }}>
                  <CheckCircle size={48} color="white" />
                </div>
                <h2>Booking Confirmed!</h2>
                <p>Your <strong>{booked.name}</strong> buddy has been booked for <strong>{bookingForm.hours} hour{bookingForm.hours > 1 ? 's' : ''}</strong> on <strong>{bookingForm.date}</strong> at <strong>{bookingForm.time}</strong>.</p>
                <p className="success-note">You will receive a confirmation on your registered email/WhatsApp shortly.</p>
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
