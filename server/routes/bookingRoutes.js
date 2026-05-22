import express from 'express'
import Booking from '../models/Booking.js'
import User from '../models/User.js'
import Service from '../models/Service.js'
import { protect } from '../middleware/auth.js'
import ActivityLog from '../models/ActivityLog.js'

const router = express.Router()

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private
router.post('/', protect, async (req, res) => {
  const { serviceId, date, time, hours, note, razorpayPaymentId } = req.body

  try {
    const service = await Service.findOne({ serviceId }) || await Service.findById(serviceId)
    if (!service) {
      return res.status(404).json({ message: 'Service not found' })
    }

    const totalCost = service.price * hours

    // Generate unique booking ID: #HF-XXXX
    const count = await Booking.countDocuments()
    const bookingId = `#HF-${1000 + count + 1}`

    // Assign a provider: look up active providers in MongoDB
    // If we have providers, assign the first one, or choose at random.
    // Otherwise leave as null (client booked general service)
    const providers = await User.find({ role: 'provider', status: 'Active' })
    let assignedProvider = null
    if (providers.length > 0) {
      // Pick random provider
      assignedProvider = providers[Math.floor(Math.random() * providers.length)]._id
    }

    const depositPaid = totalCost * 0.2

    const booking = await Booking.create({
      bookingId,
      client: req.user._id,
      provider: assignedProvider,
      service: service._id,
      date,
      time,
      hours,
      note: note || '',
      totalCost,
      depositPaid,
      remainingPaid: false,
      razorpayPaymentId: razorpayPaymentId || '',
      status: 'Pending'
    })

    // Log booking creation
    try {
      await ActivityLog.create({
        userId: req.user._id,
        email: req.user.email,
        name: `${req.user.firstName} ${req.user.lastName}`,
        role: req.user.role,
        action: 'Booking Created'
      })
    } catch (logErr) {
      console.error('Error logging booking creation:', logErr)
    }

    const populatedBooking = await Booking.findById(booking._id)
      .populate('service')
      .populate('client', 'firstName lastName email phone avatar')
      .populate('provider', 'firstName lastName email phone bio avatar')

    res.status(201).json(populatedBooking)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
})

// @desc    Get all bookings for logged-in user
// @route   GET /api/bookings
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    let bookingsQuery = {}

    if (req.user.role === 'customer') {
      bookingsQuery = { client: req.user._id }
    } else if (req.user.role === 'provider') {
      bookingsQuery = { provider: req.user._id }
    } else if (req.user.role === 'admin') {
      bookingsQuery = {} // Admin sees everything
    }

    const bookings = await Booking.find(bookingsQuery)
      .populate('service')
      .populate('client', 'firstName lastName email phone company avatar')
      .populate('provider', 'firstName lastName email phone rating reviewsCount avatar')
      .sort('-createdAt')

    res.json(bookings)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
})

// @desc    Update booking status
// @route   PUT /api/bookings/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
  const { status } = req.body

  try {
    const booking = await Booking.findById(req.params.id)

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' })
    }

    // Verify authorized party: client/provider of booking, or admin
    const isClient = booking.client.toString() === req.user._id.toString()
    const isProvider = booking.provider && booking.provider.toString() === req.user._id.toString()
    const isAdmin = req.user.role === 'admin'

    if (!isClient && !isProvider && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized to modify this booking' })
    }

    if (req.user.role === 'admin' && req.body.providerId !== undefined) {
      booking.provider = req.body.providerId || null
    }

    booking.status = status || booking.status
    await booking.save()

    // Log action to ActivityLog
    if (status) {
      let action = ''
      if (status === 'Active') action = 'Booking Accepted'
      else if (status === 'In-Progress') action = 'Booking Started'
      else if (status === 'Declined') action = 'Booking Declined'
      else if (status === 'Completed') action = 'Booking Completed'

      if (action) {
        try {
          await ActivityLog.create({
            userId: req.user._id,
            email: req.user.email,
            name: `${req.user.firstName} ${req.user.lastName}`,
            role: req.user.role,
            action
          })
        } catch (logErr) {
          console.error('Error logging booking status update:', logErr)
        }
      }
    }

    // If booking is completed and provider exists, add to provider's earnings!
    if (status === 'Completed' && booking.provider) {
      const providerUser = await User.findById(booking.provider)
      if (providerUser) {
        providerUser.earnings = (providerUser.earnings || 0) + booking.totalCost
        await providerUser.save()
      }
    }

    const updatedBooking = await Booking.findById(booking._id)
      .populate('service')
      .populate('client', 'firstName lastName email phone company avatar')
      .populate('provider', 'firstName lastName email phone bio avatar')

    res.json(updatedBooking)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
})

// @desc    Pay remaining 80% balance
// @route   POST /api/bookings/:id/pay-remaining
// @access  Private
router.post('/:id/pay-remaining', protect, async (req, res) => {
  const { remainingPaymentId, method } = req.body

  try {
    const booking = await Booking.findById(req.params.id)

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' })
    }

    // Allow provider OR client OR admin to confirm payment
    const isClient = booking.client.toString() === req.user._id.toString()
    const isProvider = booking.provider && booking.provider.toString() === req.user._id.toString()
    const isAdmin = req.user.role === 'admin'

    if (!isClient && !isProvider && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized' })
    }

    booking.remainingPaid = true
    booking.remainingPaymentId = remainingPaymentId || 'cash_confirmed'
    booking.remainingPaymentMethod = method || 'cash'

    await booking.save()

    const updatedBooking = await Booking.findById(booking._id)
      .populate('service')
      .populate('client', 'firstName lastName email phone company avatar')
      .populate('provider', 'firstName lastName email phone bio avatar')

    res.json(updatedBooking)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
})

// @desc    Provider completes job — confirms payment method and marks booking Completed
// @route   POST /api/bookings/:id/provider-complete
// @access  Private (Provider only)
router.post('/:id/provider-complete', protect, async (req, res) => {
  const { method, remainingPaymentId } = req.body
  // method: 'cash' | 'upi'
  // remainingPaymentId: razorpay payment ID (for UPI) or omitted (for cash)

  try {
    const booking = await Booking.findById(req.params.id)
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' })
    }

    const isProvider = booking.provider && booking.provider.toString() === req.user._id.toString()
    const isAdmin = req.user.role === 'admin'

    if (!isProvider && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized: only the assigned provider can complete this booking' })
    }

    if (!['Active', 'In-Progress'].includes(booking.status)) {
      return res.status(400).json({ message: 'Only Active or In-Progress bookings can be completed' })
    }

    // Mark payment and booking as complete
    booking.remainingPaid = true
    booking.remainingPaymentMethod = method || 'cash'
    booking.remainingPaymentId = remainingPaymentId || `${method}_confirmed_${Date.now()}`
    booking.status = 'Completed'

    await booking.save()

    // Update provider earnings
    try {
      const providerUser = await User.findById(booking.provider)
      if (providerUser) {
        providerUser.earnings = (providerUser.earnings || 0) + booking.totalCost
        await providerUser.save()
      }
    } catch (e) {
      console.error('Earnings update error:', e)
    }

    // Activity log
    try {
      await ActivityLog.create({
        userId: req.user._id,
        email: req.user.email,
        name: `${req.user.firstName} ${req.user.lastName}`,
        role: req.user.role,
        action: 'Booking Completed',
        details: `Booking ${booking.bookingId} completed via ${method} payment`
      })
    } catch (e) {
      console.error('Log error:', e)
    }

    const updatedBooking = await Booking.findById(booking._id)
      .populate('service')
      .populate('client', 'firstName lastName email phone company avatar')
      .populate('provider', 'firstName lastName email phone bio avatar')

    res.json(updatedBooking)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
})

// @desc    Provider starts service
// @route   POST /api/bookings/:id/start
// @access  Private (Provider or Admin)
router.post('/:id/start', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' })
    }

    const isProvider = booking.provider && booking.provider.toString() === req.user._id.toString()
    const isAdmin = req.user.role === 'admin'

    if (!isProvider && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized: only the assigned provider can start this service' })
    }

    if (booking.status !== 'Active') {
      return res.status(400).json({ message: 'Only accepted (Active) bookings can be started' })
    }

    booking.status = 'In-Progress'
    await booking.save()

    // Activity log
    try {
      await ActivityLog.create({
        userId: req.user._id,
        email: req.user.email,
        name: `${req.user.firstName} ${req.user.lastName}`,
        role: req.user.role,
        action: 'Booking Started',
        details: `Booking ${booking.bookingId} service started`
      })
    } catch (e) {
      console.error('Log error:', e)
    }

    const updatedBooking = await Booking.findById(booking._id)
      .populate('service')
      .populate('client', 'firstName lastName email phone company avatar')
      .populate('provider', 'firstName lastName email phone bio avatar')

    res.json(updatedBooking)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
})

// @desc    Provider cancels accepted/started service with 30% penalty
// @route   POST /api/bookings/:id/provider-cancel
// @access  Private (Provider or Admin)
router.post('/:id/provider-cancel', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' })
    }

    const isProvider = booking.provider && booking.provider.toString() === req.user._id.toString()
    const isAdmin = req.user.role === 'admin'

    if (!isProvider && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized: only the assigned provider can cancel this service' })
    }

    if (!['Active', 'In-Progress'].includes(booking.status)) {
      return res.status(400).json({ message: 'Only accepted (Active) or In-Progress bookings can be cancelled by the provider' })
    }

    // Provider who cancelled
    const providerId = booking.provider
    const totalCost = booking.totalCost
    const penalty = totalCost * 0.3

    // Apply penalty to the provider's earnings
    const providerUser = await User.findById(providerId)
    if (providerUser) {
      providerUser.earnings = (providerUser.earnings || 0) - penalty
      await providerUser.save()
    }

    // Log the cancellation activity with penalty details
    try {
      await ActivityLog.create({
        userId: req.user._id,
        email: req.user.email,
        name: `${req.user.firstName} ${req.user.lastName}`,
        role: req.user.role,
        action: `Booking Cancelled by Provider - 30% Penalty (₹${penalty}) Applied`,
        details: `Provider ${providerUser ? `${providerUser.firstName} ${providerUser.lastName}` : 'Buddy'} cancelled booking ${booking.bookingId}.`
      })
    } catch (e) {
      console.error('Log error:', e)
    }

    // Reset booking back to Pending and unassigned
    booking.provider = null
    booking.status = 'Pending'
    // Clear change requests or other fields if any
    booking.changeBuddyRequested = false
    booking.changeBuddyReason = ''
    booking.lastReassignedAt = new Date() // Set time of re-assignment
    await booking.save()

    const updatedBooking = await Booking.findById(booking._id)
      .populate('service')
      .populate('client', 'firstName lastName email phone company avatar')
      .populate('provider', 'firstName lastName email phone bio avatar')

    res.json({
      message: `Booking cancelled successfully. A 30% penalty of ₹${penalty} has been deducted from your earnings.`,
      booking: updatedBooking
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
})

// @desc    Request to change buddy for a booking
// @route   PUT /api/bookings/:id/request-change-buddy
// @access  Private
router.put('/:id/request-change-buddy', protect, async (req, res) => {
  const { reason } = req.body
  try {
    const booking = await Booking.findById(req.params.id)
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' })
    }

    if (booking.client.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to request buddy change for this booking' })
    }

    // Check if it is before 30 mins of booking scheduled time
    let bookingDateTime = new Date(`${booking.date}T${booking.time}`)
    
    // Fallback in case date/time string is in a non-standard format
    if (isNaN(bookingDateTime.getTime())) {
      bookingDateTime = new Date(booking.date)
    }

    if (!isNaN(bookingDateTime.getTime())) {
      const now = new Date()
      const timeDiff = bookingDateTime.getTime() - now.getTime()
      const diffMinutes = timeDiff / (1000 * 60)
      if (diffMinutes < 30) {
        return res.status(400).json({ message: 'Buddy change can only be requested up to 30 minutes before the scheduled time.' })
      }
    }

    booking.changeBuddyRequested = true
    booking.changeBuddyReason = reason || 'No reason provided'
    await booking.save()

    // Add activity log
    try {
      await ActivityLog.create({
        userId: req.user._id,
        email: req.user.email,
        name: `${req.user.firstName} ${req.user.lastName}`,
        role: req.user.role,
        action: 'Booking Status Update',
        details: `Buddy change requested for booking ${booking.bookingId}`
      })
    } catch (e) {
      console.error(e)
    }

    res.json({ message: 'Buddy change request submitted successfully', booking })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
})

export default router
