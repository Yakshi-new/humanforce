import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import { api } from './utils/api'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import AIChatbot from './components/AIChatbot'
import StickyCTA from './components/StickyCTA'
import LeadCapturePopup from './components/LeadCapturePopup'
import WhatsAppButton from './components/WhatsAppButton'

import Home from './pages/Home'
import Services from './pages/Services'
import ServiceDetail from './pages/ServiceDetail'
import HowItWorks from './pages/HowItWorks'
import Pricing from './pages/Pricing'
import About from './pages/About'
import Contact from './pages/Contact'
import Blog from './pages/Blog'
import Login from './pages/Login'
import Register from './pages/Register'
import UserDashboard from './pages/UserDashboard'
import ProviderDashboard from './pages/ProviderDashboard'
import AdminPanel from './pages/AdminPanel'
import Categories from './pages/Categories'

const DASH_PREFIXES = ['/dashboard', '/provider', '/admin']

function Layout() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const isDash = DASH_PREFIXES.some(p => pathname.startsWith(p))

  useEffect(() => {
    // 1. Storage sync listener: If token is removed in another tab, redirect
    const handleStorageChange = (e) => {
      if (e.key === 'hf_token' && !e.newValue) {
        navigate('/login')
      }
    }
    window.addEventListener('storage', handleStorageChange)

    // 2. Inactivity tracking
    let throttleTimeout = null
    const updateActivity = () => {
      if (!api.isAuthenticated()) return
      const now = Date.now()
      if (!throttleTimeout) {
        localStorage.setItem('hf_last_activity', now.toString())
        throttleTimeout = setTimeout(() => {
          throttleTimeout = null
        }, 1000)
      }
    }

    const checkInactivity = async () => {
      if (!api.isAuthenticated()) return

      const lastActivityStr = localStorage.getItem('hf_last_activity')
      if (!lastActivityStr) {
        localStorage.setItem('hf_last_activity', Date.now().toString())
        return
      }

      const lastActivity = parseInt(lastActivityStr, 10)
      const elapsed = Date.now() - lastActivity
      const INACTIVITY_TIMEOUT = 15 * 60 * 1000 // 15 minutes

      if (elapsed >= INACTIVITY_TIMEOUT) {
        await api.logout(true)
        navigate('/login')
      }
    }

    const events = ['mousemove', 'keydown', 'scroll', 'click', 'touchstart']
    events.forEach((event) => {
      window.addEventListener(event, updateActivity)
    })

    const intervalId = setInterval(checkInactivity, 5000)

    // Initial activity set if logged in but hf_last_activity not set
    if (api.isAuthenticated() && !localStorage.getItem('hf_last_activity')) {
      localStorage.setItem('hf_last_activity', Date.now().toString())
    }

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, updateActivity)
      })
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(intervalId)
      if (throttleTimeout) clearTimeout(throttleTimeout)
    }
  }, [navigate])

  return (
    <>
      {!isDash && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/services/:id" element={<ServiceDetail />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard/*" element={<UserDashboard />} />
        <Route path="/provider/*" element={<ProviderDashboard />} />
        <Route path="/admin/*" element={<AdminPanel />} />
      </Routes>
      {!isDash && <Footer />}
      {!isDash && <AIChatbot />}
      {!isDash && <WhatsAppButton />}
      {!isDash && <LeadCapturePopup />}
      {!isDash && <StickyCTA />}
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  )
}
