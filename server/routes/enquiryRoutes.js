import express from 'express'
import Enquiry from '../models/Enquiry.js'
import { protect, adminOnly } from '../middleware/auth.js'
import {
  sendWelcomeToUser,
  sendEnquiryNotificationToAdmin,
} from '../utils/whatsappNotify.js'

const router = express.Router()

// @desc    Submit a contact enquiry
// @route   POST /api/enquiries
// @access  Public
router.post('/', async (req, res) => {
  const { name, email, phone, subject, message } = req.body

  try {
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'Name, email, subject and message are required' })
    }

    const enquiry = await Enquiry.create({
      name,
      email,
      phone: phone || '',
      subject,
      message,
      status: 'New'
    })

    // ── WhatsApp Notifications (fire-and-forget, non-blocking) ───────────
    // 1. Send welcome message to the user (if they gave a phone)
    sendWelcomeToUser({ name, phone, subject })
    // 2. Notify admin about the new enquiry
    sendEnquiryNotificationToAdmin({ name, email, phone, subject, message })

    res.status(201).json(enquiry)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
})

// @desc    Get all enquiries
// @route   GET /api/enquiries
// @access  Private/Admin
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const enquiries = await Enquiry.find({}).sort('-createdAt')
    res.json(enquiries)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
})

// @desc    Update enquiry status
// @route   PUT /api/enquiries/:id
// @access  Private/Admin
router.put('/:id', protect, adminOnly, async (req, res) => {
  const { status } = req.body

  try {
    const enquiry = await Enquiry.findById(req.params.id)

    if (!enquiry) {
      return res.status(404).json({ message: 'Enquiry not found' })
    }

    enquiry.status = status || enquiry.status
    await enquiry.save()

    res.json(enquiry)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
})

export default router
