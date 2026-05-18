import express from 'express'
import Booking from '../models/Booking.js'
import User from '../models/User.js'
import Service from '../models/Service.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private
router.post('/', protect, async (req, res) => {
  const { serviceId, date, time, hours, note } = req.body

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
      status: 'Pending'
    })

    const populatedBooking = await Booking.findById(booking._id)
      .populate('service')
      .populate('client', 'firstName lastName email phone')
      .populate('provider', 'firstName lastName email phone bio')

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
      .populate('client', 'firstName lastName email phone company')
      .populate('provider', 'firstName lastName email phone rating reviewsCount')
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
      .populate('client', 'firstName lastName email phone company')
      .populate('provider', 'firstName lastName email phone bio')

    res.json(updatedBooking)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
})

export default router
