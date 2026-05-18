import express from 'express'
import User from '../models/User.js'
import Booking from '../models/Booking.js'
import Service from '../models/Service.js'
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
    
    // Active bookings: status Pending or Active
    const activeBookings = await Booking.countDocuments({ 
      status: { $in: ['Pending', 'Active'] } 
    })

    // Calculate revenue MTD (sum of all completed/active bookings)
    const bookings = await Booking.find({ status: { $in: ['Active', 'Completed'] } })
    const revenue = bookings.reduce((sum, b) => sum + (b.totalCost || 0), 0)

    res.json({
      totalUsers,
      totalProviders,
      activeBookings,
      revenue
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

// @desc    Get all transactions list (simulated from bookings)
// @route   GET /api/admin/transactions
// @access  Private/Admin
router.get('/transactions', async (req, res) => {
  try {
    const bookings = await Booking.find({})
      .populate('client', 'firstName lastName')
      .populate('provider', 'firstName lastName')
      .populate('service', 'name')
      .sort('-createdAt')

    const transactions = bookings.map(b => ({
      _id: `TX-${b.bookingId.split('-')[1]}`,
      user: b.client ? `${b.client.firstName} ${b.client.lastName}` : 'Guest',
      provider: b.provider ? `${b.provider.firstName} ${b.provider.lastName}` : 'General',
      amount: `₹${b.totalCost.toLocaleString('en-IN')}`,
      date: b.date,
      method: 'Online Card',
      status: b.status === 'Completed' ? 'Paid' : b.status === 'Declined' ? 'Refunded' : 'Pending'
    }))

    res.json(transactions)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
})

export default router
