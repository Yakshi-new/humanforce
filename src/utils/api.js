// Central API utility for HumanForce React Frontend

const API_BASE = import.meta.env.VITE_API_URL || ''

const customFetch = (path, options) => {
  const url = path.startsWith('/') ? `${API_BASE}${path}` : path
  return fetch(url, options)
}

const getHeaders = () => {
  const token = localStorage.getItem('hf_token')
  const headers = {
    'Content-Type': 'application/json'
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  return headers
}

const handleResponse = async (res) => {
  // 401 = token expired or invalid → force immediate re-login
  if (res.status === 401) {
    localStorage.removeItem('hf_token')
    localStorage.removeItem('hf_user')
    localStorage.removeItem('hf_last_activity')
    sessionStorage.removeItem('hf_session_active')
    // Use location.replace so history is not polluted
    window.location.replace('/login')
    return Promise.reject(new Error('Session expired'))
  }
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData.message || 'Something went wrong')
  }
  return res.json()
}

export const api = {
  // --- AUTH ENDPOINTS ---
  login: async (credentials) => {
    // credentials: { email, password, phone, method }
    const res = await customFetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    })
    const data = await handleResponse(res)
    // Save in storage
    localStorage.setItem('hf_token', data.token)
    localStorage.setItem('hf_user', JSON.stringify(data))
    localStorage.setItem('hf_last_activity', Date.now().toString())
    sessionStorage.setItem('hf_session_active', 'true')
    return data
  },

  register: async (userData) => {
    const res = await customFetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    })
    const data = await handleResponse(res)
    // Save in storage
    localStorage.setItem('hf_token', data.token)
    localStorage.setItem('hf_user', JSON.stringify(data))
    localStorage.setItem('hf_last_activity', Date.now().toString())
    sessionStorage.setItem('hf_session_active', 'true')
    return data
  },

  getMe: async () => {
    const res = await customFetch('/api/auth/me', {
      headers: getHeaders()
    })
    return handleResponse(res)
  },

  logout: async (isAuto = false) => {
    try {
      const token = localStorage.getItem('hf_token')
      if (token) {
        await customFetch('/api/auth/logout', {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify({ isAuto })
        })
      }
    } catch (err) {
      console.error('Failed to log logout activity:', err)
    }
    localStorage.removeItem('hf_token')
    localStorage.removeItem('hf_user')
    localStorage.removeItem('hf_last_activity')
    sessionStorage.removeItem('hf_session_active')
  },

  getUser: () => {
    // If the token is invalid or session is closed, make sure we return null
    if (!api.isAuthenticated()) {
      return null
    }
    const user = localStorage.getItem('hf_user')
    return user ? JSON.parse(user) : null
  },

  isAuthenticated: () => {
    const hasToken = !!localStorage.getItem('hf_token')
    const sessionActive = !!sessionStorage.getItem('hf_session_active')

    // Check inactivity timeout
    const lastStr = localStorage.getItem('hf_last_activity')
    let isStale = false
    if (lastStr) {
      const elapsed = Date.now() - parseInt(lastStr, 10)
      if (elapsed >= 15 * 60 * 1000) { // 15 minutes of inactivity timeout
        isStale = true
      }
    }

    if (hasToken && (!sessionActive || isStale)) {
      // Clean up stale session synchronously
      localStorage.removeItem('hf_token')
      localStorage.removeItem('hf_user')
      localStorage.removeItem('hf_last_activity')
      sessionStorage.removeItem('hf_session_active')
      return false
    }

    return hasToken && sessionActive
  },

  // --- SERVICE ENDPOINTS ---
  getServices: async () => {
    const res = await customFetch('/api/services')
    return handleResponse(res)
  },

  getServiceById: async (id) => {
    const res = await customFetch(`/api/services/${id}`)
    return handleResponse(res)
  },

  createService: async (svcData) => {
    const res = await customFetch('/api/services', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(svcData)
    })
    return handleResponse(res)
  },

  // --- BOOKING ENDPOINTS ---
  createBooking: async (bookingData) => {
    // bookingData: { serviceId, date, time, hours, note, razorpayPaymentId }
    const res = await customFetch('/api/bookings', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(bookingData)
    })
    return handleResponse(res)
  },

  payRemaining: async (bookingId, remainingPaymentId) => {
    const res = await customFetch(`/api/bookings/${bookingId}/pay-remaining`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ remainingPaymentId })
    })
    return handleResponse(res)
  },

  getBookings: async () => {
    const res = await customFetch('/api/bookings', {
      headers: getHeaders()
    })
    return handleResponse(res)
  },

  updateBookingStatus: async (bookingId, status) => {
    const res = await customFetch(`/api/bookings/${bookingId}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ status })
    })
    return handleResponse(res)
  },

  providerComplete: async (bookingId, method, remainingPaymentId) => {
    const res = await customFetch(`/api/bookings/${bookingId}/provider-complete`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ method, remainingPaymentId })
    })
    return handleResponse(res)
  },

  startBooking: async (bookingId) => {
    const res = await customFetch(`/api/bookings/${bookingId}/start`, {
      method: 'POST',
      headers: getHeaders()
    })
    return handleResponse(res)
  },

  providerCancelBooking: async (bookingId) => {
    const res = await customFetch(`/api/bookings/${bookingId}/provider-cancel`, {
      method: 'POST',
      headers: getHeaders()
    })
    return handleResponse(res)
  },

  // --- MESSAGES ENDPOINTS ---
  getConversations: async () => {
    const res = await customFetch('/api/messages/conversations/threads', {
      headers: getHeaders()
    })
    return handleResponse(res)
  },

  getChatHistory: async (userId) => {
    const res = await customFetch(`/api/messages/${userId}`, {
      headers: getHeaders()
    })
    return handleResponse(res)
  },

  sendMessage: async (receiverId, text) => {
    const res = await customFetch('/api/messages', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ receiverId, text })
    })
    return handleResponse(res)
  },

  getUnreadCount: async () => {
    const res = await customFetch('/api/messages/unread-count', {
      headers: getHeaders()
    })
    return handleResponse(res)
  },

  // --- ADMIN PANEL ENDPOINTS ---
  getAdminStats: async () => {
    const res = await customFetch('/api/admin/stats', {
      headers: getHeaders()
    })
    return handleResponse(res)
  },

  getAdminUsers: async () => {
    const res = await customFetch('/api/admin/users', {
      headers: getHeaders()
    })
    return handleResponse(res)
  },

  getAdminProviders: async () => {
    const res = await customFetch('/api/admin/providers', {
      headers: getHeaders()
    })
    return handleResponse(res)
  },

  getAdminTransactions: async () => {
    const res = await customFetch('/api/admin/transactions', {
      headers: getHeaders()
    })
    return handleResponse(res)
  },

  assignProviderToBooking: async (bookingId, providerId) => {
    const res = await customFetch(`/api/bookings/${bookingId}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ providerId })
    })
    return handleResponse(res)
  },

  getAdminUserActivity: async (userId) => {
    const res = await customFetch(`/api/admin/users/${userId}/activity`, {
      headers: getHeaders()
    })
    return handleResponse(res)
  },

  getAdminLogs: async () => {
    const res = await customFetch('/api/admin/logs', {
      headers: getHeaders()
    })
    return handleResponse(res)
  },

  createEnquiry: async (enquiryData) => {
    const res = await customFetch('/api/enquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(enquiryData)
    })
    return handleResponse(res)
  },

  getAdminEnquiries: async () => {
    const res = await customFetch('/api/enquiries', {
      headers: getHeaders()
    })
    return handleResponse(res)
  },

  updateAdminEnquiryStatus: async (id, status) => {
    const res = await customFetch(`/api/enquiries/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ status })
    })
    return handleResponse(res)
  },

  getEnquiries: async () => {
    const res = await customFetch('/api/enquiries', {
      headers: getHeaders()
    })
    return handleResponse(res)
  },

  updateEnquiryStatus: async (id, status) => {
    const res = await customFetch(`/api/enquiries/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ status })
    })
    return handleResponse(res)
  },

  requestChangeBuddy: async (bookingId, reason) => {
    const res = await customFetch(`/api/bookings/${bookingId}/request-change-buddy`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ reason })
    })
    return handleResponse(res)
  },

  reassignBuddy: async (bookingId, providerId) => {
    const res = await customFetch(`/api/admin/bookings/${bookingId}/reassign`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ providerId })
    })
    return handleResponse(res)
  },

  getAdminMessages: async () => {
    const res = await customFetch('/api/admin/messages', {
      headers: getHeaders()
    })
    return handleResponse(res)
  },

  subscribeNewsletter: async (email) => {
    const res = await customFetch('/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    })
    return handleResponse(res)
  }
}

export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true)
      return
    }
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}
