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
    return data
  },

  getMe: async () => {
    const res = await customFetch('/api/auth/me', {
      headers: getHeaders()
    })
    return handleResponse(res)
  },

  logout: () => {
    localStorage.removeItem('hf_token')
    localStorage.removeItem('hf_user')
  },

  getUser: () => {
    const user = localStorage.getItem('hf_user')
    return user ? JSON.parse(user) : null
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('hf_token')
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
    // bookingData: { serviceId, date, time, hours, note }
    const res = await customFetch('/api/bookings', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(bookingData)
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
  }
}
