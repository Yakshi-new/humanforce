import express from 'express'
import { sendAutoReply } from '../utils/whatsappNotify.js'

const router = express.Router()

/**
 * @route   POST /api/whatsapp/webhook
 * @desc    Receives incoming WhatsApp messages from OpenWA
 * @access  Public (called by OpenWA)
 *
 * OpenWA sends a POST with the message payload when a user replies to your bot.
 * Payload shape (open-wa/wa-automate):
 * {
 *   "type": "message",
 *   "data": {
 *     "id": { ... },
 *     "body": "Hello there",
 *     "from": "919876543210@c.us",
 *     "sender": { "formattedName": "John Doe", ... },
 *     "timestamp": 1716820000,
 *     "type": "chat",
 *     "isGroupMsg": false,
 *     ...
 *   }
 * }
 */
router.post('/webhook', async (req, res) => {
  try {
    const payload = req.body

    // ── Log the raw payload for debugging ──────────────────────────────────
    console.log('\n📲 Incoming WhatsApp webhook payload:')
    console.log(JSON.stringify(payload, null, 2))

    // ── Extract message data ───────────────────────────────────────────────
    // OpenWA wraps everything inside a "data" key
    const data = payload?.data || payload

    const fromChatId  = data?.from       || data?.chatId || ''
    const messageBody = data?.body       || ''
    const senderName  = data?.sender?.formattedName || data?.notifyName || ''
    const isGroupMsg  = data?.isGroupMsg || false
    const msgType     = data?.type       || 'chat'

    // Ignore group messages and non-text messages
    if (isGroupMsg) {
      console.log('ℹ️  Ignoring group message')
      return res.status(200).json({ success: true, message: 'Group message ignored' })
    }

    if (msgType !== 'chat') {
      console.log(`ℹ️  Ignoring non-text message type: ${msgType}`)
      return res.status(200).json({ success: true, message: 'Non-text message ignored' })
    }

    // ── Log the incoming message ────────────────────────────────────────────
    console.log(`\n💬 Message from ${senderName || fromChatId}: "${messageBody}"`)

    // ── Send auto-reply ────────────────────────────────────────────────────
    if (fromChatId) {
      // Fire-and-forget — don't await so webhook returns fast
      sendAutoReply(fromChatId, senderName)
    }

    // ── Acknowledge to OpenWA ──────────────────────────────────────────────
    res.status(200).json({
      success: true,
      message: 'Webhook received and processed',
      from:    fromChatId,
      body:    messageBody,
    })

  } catch (error) {
    console.error('❌ WhatsApp webhook error:', error)
    // Always return 200 to prevent OpenWA from retrying endlessly
    res.status(200).json({ success: false, error: error.message })
  }
})

/**
 * @route   GET /api/whatsapp/webhook
 * @desc    Health check / verification endpoint for webhook setup
 * @access  Public
 */
router.get('/webhook', (req, res) => {
  res.json({
    status:  'active',
    message: '✅ WhatsApp webhook is online and listening',
    endpoint: 'POST /api/whatsapp/webhook',
  })
})

/**
 * @route   GET /api/whatsapp/status
 * @desc    Quick status check for the WhatsApp integration
 * @access  Public
 */
router.get('/status', (req, res) => {
  res.json({
    status:       'OK',
    openwa_url:   process.env.OPENWA_BASE_URL,
    admin_number: process.env.ADMIN_WHATSAPP,
    webhook_path: '/api/whatsapp/webhook',
    instructions: 'Set this URL as your OpenWA webhook in the OpenWA dashboard',
  })
})

export default router
