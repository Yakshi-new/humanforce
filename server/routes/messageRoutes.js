import express from 'express'
import Message from '../models/Message.js'
import User from '../models/User.js'
import Booking from '../models/Booking.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

// @desc    Send a message
// @route   POST /api/messages
// @access  Private
router.post('/', protect, async (req, res) => {
  const { receiverId, text } = req.body

  if (!text) {
    return res.status(400).json({ message: 'Message text is required' })
  }

  try {
    const receiverExists = await User.findById(receiverId)
    if (!receiverExists) {
      return res.status(404).json({ message: 'Receiver not found' })
    }

    // Restrict messages: must have a booking relation
    if (req.user.role === 'customer') {
      const bookingExists = await Booking.findOne({ client: req.user._id, provider: receiverId })
      if (!bookingExists) {
        return res.status(403).json({ message: 'You can only message your assigned buddy.' })
      }
    } else if (req.user.role === 'provider') {
      const bookingExists = await Booking.findOne({ provider: req.user._id, client: receiverId })
      if (!bookingExists) {
        return res.status(403).json({ message: 'You can only message customers assigned to your bookings.' })
      }
    }

    const message = await Message.create({
      sender: req.user._id,
      receiver: receiverId,
      text
    })

    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'firstName lastName email')
      .populate('receiver', 'firstName lastName email')

    res.status(201).json(populatedMessage)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
})

// @desc    Get total unread message count for current user
// @route   GET /api/messages/unread-count
// @access  Private
router.get('/unread-count', protect, async (req, res) => {
  try {
    const count = await Message.countDocuments({ receiver: req.user._id, isRead: false })
    res.json({ count })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
})

// @desc    Get chat history with a specific user
// @route   GET /api/messages/:userId
// @access  Private
router.get('/:userId', protect, async (req, res) => {
  try {
    // Mark incoming messages as read
    await Message.updateMany(
      { sender: req.params.userId, receiver: req.user._id, isRead: false },
      { $set: { isRead: true } }
    )

    const chatHistory = await Message.find({
      $or: [
        { sender: req.user._id, receiver: req.params.userId },
        { sender: req.params.userId, receiver: req.user._id }
      ]
    })
    .populate('sender', 'firstName lastName email')
    .populate('receiver', 'firstName lastName email')
    .sort('createdAt')

    res.json(chatHistory)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
})

// @desc    Get all active conversation threads for current user
// @route   GET /api/messages/conversations
// @access  Private
router.get('/conversations/threads', protect, async (req, res) => {
  try {
    let allowedPartnerIds = []

    if (req.user.role === 'customer') {
      const bookings = await Booking.find({ client: req.user._id, provider: { $ne: null } })
      allowedPartnerIds = bookings.map(b => b.provider.toString())
    } else if (req.user.role === 'provider') {
      const bookings = await Booking.find({ provider: req.user._id })
      allowedPartnerIds = bookings.map(b => b.client.toString())
    } else {
      // Admin/Super Admin: can chat with any customer/provider
      const users = await User.find({ role: { $in: ['customer', 'provider'] } })
      allowedPartnerIds = users.map(u => u._id.toString())
    }

    // De-duplicate allowed partner IDs
    const uniquePartnerIds = [...new Set(allowedPartnerIds)]

    // Now, for each unique partner, retrieve their user details and the latest message (if any)
    const threads = await Promise.all(uniquePartnerIds.map(async (partnerId) => {
      const partner = await User.findById(partnerId).select('firstName lastName email role bio avatar')
      if (!partner) return null

      // Find the latest message exchanged between req.user and this partner
      const latestMsg = await Message.findOne({
        $or: [
          { sender: req.user._id, receiver: partnerId },
          { sender: partnerId, receiver: req.user._id }
        ]
      }).sort('-createdAt')

      // Count unread messages from partner to current user
      const unreadCount = await Message.countDocuments({
        sender: partnerId,
        receiver: req.user._id,
        isRead: false
      })

      return {
        user: partner,
        lastMessage: latestMsg ? latestMsg.text : 'No messages yet. Click to start chatting!',
        createdAt: latestMsg ? latestMsg.createdAt : new Date(),
        senderId: latestMsg ? latestMsg.sender : null,
        unreadCount
      }
    }))

    // Filter out nulls and sort by latest message/creation date
    const filteredThreads = threads
      .filter(t => t !== null)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

    res.json(filteredThreads)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
})

export default router
