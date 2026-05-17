import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
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
  const isDash = DASH_PREFIXES.some(p => pathname.startsWith(p))

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
