import express from 'express'
import Message from '../models/Message.js'
import User from '../models/User.js'
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

// @desc    Get chat history with a specific user
// @route   GET /api/messages/:userId
// @access  Private
router.get('/:userId', protect, async (req, res) => {
  try {
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
    // Find all unique users the current user has chatted with
    const messages = await Message.find({
      $or: [{ sender: req.user._id }, { receiver: req.user._id }]
    }).sort('-createdAt')

    const chattedUserIds = new Set()
    const latestMessages = []

    for (const msg of messages) {
      const otherUserId = msg.sender.toString() === req.user._id.toString()
        ? msg.receiver.toString()
        : msg.sender.toString()

      if (!chattedUserIds.has(otherUserId)) {
        chattedUserIds.add(otherUserId)
        latestMessages.push(msg)
      }
    }

    // Populate user profiles
    const threads = await Promise.all(latestMessages.map(async (msg) => {
      const otherUserId = msg.sender.toString() === req.user._id.toString()
        ? msg.receiver
        : msg.sender

      const otherUser = await User.findById(otherUserId).select('firstName lastName email role bio')
      return {
        user: otherUser,
        lastMessage: msg.text,
        createdAt: msg.createdAt,
        senderId: msg.sender
      }
    }))

    res.json(threads)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
})

export default router
