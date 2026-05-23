import { useEffect, useRef, useState } from 'react'
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
import BlogDetail from './pages/BlogDetail'
import Login from './pages/Login'
import Register from './pages/Register'
import ProviderRegister from './pages/ProviderRegister'
import UserDashboard from './pages/UserDashboard'
import ProviderDashboard from './pages/ProviderDashboard'
import AdminPanel from './pages/AdminPanel'
import Categories from './pages/Categories'

// ─── Constants ─────────────────────────────────────────────────────────────
const INACTIVITY_TIMEOUT_MS  = 15 * 60 * 1000  // 15 min of no user action
const CHECK_INTERVAL_MS      = 5  * 1000        // check every 5 s
const OFFLINE_TIMEOUT_MS     = 10 * 60 * 1000  // 10 min offline → logout
const DASH_PREFIXES          = ['/dashboard', '/provider', '/admin']

// ─── Main layout with full session security ─────────────────────────────────
function Layout() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const isDash = DASH_PREFIXES.some(p => pathname.startsWith(p))

  const offlineAtRef    = useRef(null)   // timestamp when we went offline
  const throttleRef     = useRef(null)
  const intervalRef     = useRef(null)

  // ── Helper: wipe session and redirect ──────────────────────────────────────
  const doLogout = async (reason = 'inactivity') => {
    console.warn(`[Session] Auto-logout: ${reason}`)
    await api.logout(true)
    navigate('/login')
  }

  // ── Helper: reset activity timestamp to now ────────────────────────────────
  const touchActivity = () => {
    if (!api.isAuthenticated()) return
    if (!throttleRef.current) {
      localStorage.setItem('hf_last_activity', Date.now().toString())
      throttleRef.current = setTimeout(() => { throttleRef.current = null }, 1000)
    }
  }

  // ── Core check: called every 5 s ──────────────────────────────────────────
  const checkSession = async () => {
    if (!api.isAuthenticated()) return

    const lastStr = localStorage.getItem('hf_last_activity')
    if (!lastStr) {
      localStorage.setItem('hf_last_activity', Date.now().toString())
      return
    }

    const elapsed = Date.now() - parseInt(lastStr, 10)

    if (elapsed >= INACTIVITY_TIMEOUT_MS) {
      doLogout('inactivity')
    }
  }

  // ── On tab/window visibility change ────────────────────────────────────────
  const handleVisibilityChange = async () => {
    if (document.visibilityState === 'visible') {
      if (!api.isAuthenticated()) return

      const closedAtStr = sessionStorage.getItem('hf_closed_at')
      if (closedAtStr) {
        const gap = Date.now() - parseInt(closedAtStr, 10)
        sessionStorage.removeItem('hf_closed_at')
        if (gap >= INACTIVITY_TIMEOUT_MS) {
          doLogout('inactivity-while-away')
          return
        }
      }

      await checkSession()
    }
  }

  // ── Internet connection events ─────────────────────────────────────────────
  const handleOffline = () => {
    offlineAtRef.current = Date.now()
    console.warn('[Session] Internet connection lost.')
  }

  const handleOnline = () => {
    if (offlineAtRef.current && api.isAuthenticated()) {
      const offlineDuration = Date.now() - offlineAtRef.current
      offlineAtRef.current = null
      if (offlineDuration >= OFFLINE_TIMEOUT_MS) {
        doLogout('offline-too-long')
        return
      }
    }
    offlineAtRef.current = null
    console.info('[Session] Internet connection restored.')
  }

  // ── Window close / navigate away ──────────────────────────────────────────
  const handleBeforeUnload = () => {
    if (api.isAuthenticated()) {
      sessionStorage.setItem('hf_closed_at', Date.now().toString())
    }
  }

  // ── Cross-tab logout sync ──────────────────────────────────────────────────
  const handleStorageChange = (e) => {
    if (e.key === 'hf_token' && !e.newValue) {
      navigate('/login')
    }
  }

  // ── Mount / unmount ────────────────────────────────────────────────────────
  useEffect(() => {
    if (api.isAuthenticated()) {
      const closedAtStr = sessionStorage.getItem('hf_closed_at')
      if (closedAtStr) {
        const gap = Date.now() - parseInt(closedAtStr, 10)
        sessionStorage.removeItem('hf_closed_at')
        if (gap >= INACTIVITY_TIMEOUT_MS) {
          doLogout('inactivity-while-away')
          return
        }
      }

      const lastStr = localStorage.getItem('hf_last_activity')
      if (lastStr) {
        const elapsed = Date.now() - parseInt(lastStr, 10)
        if (elapsed >= INACTIVITY_TIMEOUT_MS) {
          doLogout('inactivity')
          return
        }
      }

      if (!localStorage.getItem('hf_last_activity')) {
        localStorage.setItem('hf_last_activity', Date.now().toString())
      }
    }

    const ACTIVITY_EVENTS = ['mousemove', 'keydown', 'scroll', 'click', 'touchstart', 'pointerdown']
    ACTIVITY_EVENTS.forEach(ev => window.addEventListener(ev, touchActivity, { passive: true }))

    intervalRef.current = setInterval(checkSession, CHECK_INTERVAL_MS)

    document.addEventListener('visibilitychange', handleVisibilityChange)

    window.addEventListener('offline', handleOffline)
    window.addEventListener('online', handleOnline)

    window.addEventListener('beforeunload', handleBeforeUnload)

    window.addEventListener('storage', handleStorageChange)

    return () => {
      ACTIVITY_EVENTS.forEach(ev => window.removeEventListener(ev, touchActivity))
      clearInterval(intervalRef.current)
      if (throttleRef.current) clearTimeout(throttleRef.current)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('offline', handleOffline)
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('beforeunload', handleBeforeUnload)
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [navigate])  // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {!isDash && <Navbar />}
      <Routes>
        <Route path="/"             element={<Home />} />
        <Route path="/services"     element={<Services />} />
        <Route path="/services/:id" element={<ServiceDetail />} />
        <Route path="/categories"   element={<Categories />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/pricing"      element={<Pricing />} />
        <Route path="/about"        element={<About />} />
        <Route path="/contact"      element={<Contact />} />
        <Route path="/blog"         element={<Blog />} />
        <Route path="/blog/:id"     element={<BlogDetail />} />
        <Route path="/login"        element={<Login />} />
        <Route path="/register"     element={<Register />} />
        <Route path="/register/provider" element={<ProviderRegister />} />
        <Route path="/dashboard/*"  element={<UserDashboard />} />
        <Route path="/provider/*"   element={<ProviderDashboard />} />
        <Route path="/admin/*"      element={<AdminPanel />} />
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
