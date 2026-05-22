import express from 'express'
import User from '../models/User.js'
import Booking from '../models/Booking.js'
import Service from '../models/Service.js'
import ActivityLog from '../models/ActivityLog.js'
import Message from '../models/Message.js'
import { protect, adminOnly } from '../middleware/auth.js'

const router = express.Router()

// Apply protect and adminOnly middleware to all admin routes
router.use(protect)
router.use(adminOnly)

// @desc    Get dashboard metrics & stats
// @route   GET /api/admin/stats
// @access  Private/Admin
router.get('/stats', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'customer' })
    const totalProviders = await User.countDocuments({ role: 'provider' })
    
    // Total running operations: status Active or In-Progress
    const runningOperations = await Booking.countDocuments({ status: { $in: ['Active', 'In-Progress'] } })
    
    // Total completed operations: status Completed
    const completedOperations = await Booking.countDocuments({ status: 'Completed' })

    // Active bookings: status Pending, Active, or In-Progress
    const activeBookings = await Booking.countDocuments({ 
      status: { $in: ['Pending', 'Active', 'In-Progress'] } 
    })

    // Calculate revenue MTD (sum of all completed/active/in-progress bookings)
    const bookings = await Booking.find({ status: { $in: ['Active', 'In-Progress', 'Completed'] } })
    const revenue = bookings.reduce((sum, b) => sum + (b.totalCost || 0), 0)

    // Platform Commission is the sum of depositPaid (20%) for active/completed bookings
    const platformCommission = bookings.reduce((sum, b) => sum + (b.depositPaid || 0), 0)

    // Fetch upcoming and pending bookings for Current Day and Next Day
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    const formatDate = (date) => {
      const yyyy = date.getFullYear();
      const mm = String(date.getMonth() + 1).padStart(2, '0');
      const dd = String(date.getDate()).padStart(2, '0');
      return `${yyyy}-${mm}-${dd}`;
    };

    const todayStr = formatDate(today);
    const tomorrowStr = formatDate(tomorrow);

    // Let's support matching formatted date strings for flexibility
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    const todayLocale = today.toLocaleDateString('en-US', options); 
    const tomorrowLocale = tomorrow.toLocaleDateString('en-US', options);

    const todayLocale2 = today.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }); 
    const tomorrowLocale2 = tomorrow.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

    const dateMatches = [
      todayStr, 
      tomorrowStr, 
      todayLocale, 
      tomorrowLocale,
      todayLocale2,
      tomorrowLocale2
    ];

    const upcomingBookings = await Booking.find({
      date: { $in: dateMatches },
      status: { $in: ['Pending', 'Active', 'In-Progress'] }
    })
    .populate('client', 'firstName lastName email phone avatar')
    .populate('provider', 'firstName lastName avatar')
    .populate('service', 'name category')
    .sort('date time');

    const changeBuddyRequestsCount = await Booking.countDocuments({ changeBuddyRequested: true })

    res.json({
      totalUsers,
      totalProviders,
      activeBookings,
      revenue,
      platformCommission,
      runningOperations,
      completedOperations,
      upcomingBookings,
      changeBuddyRequestsCount
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
})

// @desc    Get all users list
// @route   GET /api/admin/users
// @access  Private/Admin
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({ role: 'customer' }).select('-password').sort('-createdAt')
    res.json(users)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
})

// @desc    Get all providers list
// @route   GET /api/admin/providers
// @access  Private/Admin
router.get('/providers', async (req, res) => {
  try {
    const providers = await User.find({ role: 'provider' }).select('-password').sort('-createdAt')
    res.json(providers)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
})

// @desc    Get all activity logs
// @route   GET /api/admin/logs
// @access  Private/Admin
router.get('/logs', async (req, res) => {
  try {
    const logs = await ActivityLog.find({}).sort('-timestamp')
    res.json(logs)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
})

// @desc    Get all transactions list (simulated from bookings)
// @route   GET /api/admin/transactions
// @access  Private/Admin
router.get('/transactions', async (req, res) => {
  try {
    const bookings = await Booking.find({})
      .populate('client', 'firstName lastName avatar')
      .populate('provider', 'firstName lastName avatar')
      .populate('service', 'name')
      .sort('-createdAt')
    const transactions = bookings.map(b => ({
      _id: `TX-${b.bookingId && b.bookingId.includes('-') ? b.bookingId.split('-')[1] : b.bookingId ? b.bookingId.replace('#', '') : 'UNK'}`,
      bookingId: b.bookingId || 'N/A',
      user: b.client ? `${b.client.firstName} ${b.client.lastName}` : 'Guest',
      provider: b.provider ? `${b.provider.firstName} ${b.provider.lastName}` : null,
      totalCost: b.totalCost || 0,
      amount: `₹${(b.totalCost || 0).toLocaleString('en-IN')}`,
      depositPaid: b.depositPaid || 0,
      remainingPaid: b.remainingPaid || false,
      date: b.date,
      method: 'Online Card',
      status: b.status
    }))

    res.json(transactions)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
})

// @desc    Get user profile and operational activity ledger
// @route   GET /api/admin/users/:id/activity
// @access  Private/Admin
router.get('/users/:id/activity', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password')
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Query bookings where user is either client (customer) or provider (buddy)
    const bookings = await Booking.find({
      $or: [{ client: req.params.id }, { provider: req.params.id }]
    })
    .populate('client', 'firstName lastName email phone avatar')
    .populate('provider', 'firstName lastName email phone avatar')
    .populate('service', 'name category price')
    .sort('-createdAt')

    res.json({ user, bookings })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
})

// @desc    Get all messages in the system for auditing/tracing
// @route   GET /api/admin/messages
// @access  Private/Admin
router.get('/messages', async (req, res) => {
  try {
    const messages = await Message.find({})
      .populate('sender', 'firstName lastName email role avatar')
      .populate('receiver', 'firstName lastName email role avatar')
      .sort('-createdAt')
    res.json(messages)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
})

// @desc    Admin reassign provider for a booking
// @route   PUT /api/admin/bookings/:id/reassign
// @access  Private/Admin
router.put('/bookings/:id/reassign', async (req, res) => {
  const { providerId } = req.body
  try {
    const booking = await Booking.findById(req.params.id)
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' })
    }

    const provider = await User.findById(providerId)
    if (!provider || provider.role !== 'provider') {
      return res.status(400).json({ message: 'Invalid provider ID' })
    }

    booking.provider = providerId
    booking.changeBuddyRequested = false // Clear the request state once reassigned!
    await booking.save()

    // Create activity log
    try {
      await ActivityLog.create({
        userId: req.user._id,
        email: req.user.email,
        name: `${req.user.firstName} ${req.user.lastName}`,
        role: req.user.role,
        action: 'Booking Status Update',
        details: `Admin reassigned buddy for booking ${booking.bookingId} to ${provider.firstName} ${provider.lastName}`
      })
    } catch (e) {
      console.error(e)
    }

    res.json({ message: 'Buddy reassigned successfully', booking })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
})

export default router
