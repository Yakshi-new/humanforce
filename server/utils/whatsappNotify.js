/**
 * WhatsApp Notification Utility
 * Uses WAHA (WhatsApp HTTP API / OpenWA) to send WhatsApp messages.
 *
 * Correct endpoint format (discovered from live API):
 *   POST {OPENWA_BASE_URL}/api/sessions/{SESSION_ID}/messages/send-text
 *   Body: { chatId: "919XXXXXXXXX@c.us", text: "..." }
 *   Header: x-api-key: ...
 */

/**
 * Returns current OpenWA config from environment.
 * Reading at call-time (not module-load) so dotenv has already run.
 */
function cfg() {
  return {
    baseUrl:  process.env.OPENWA_BASE_URL || 'https://commonwealth-necessary-para-settlement.trycloudflare.com',
    apiKey:   process.env.OPENWA_API_KEY  || '',
    session:  process.env.OPENWA_SESSION  || 'default',
    adminNum: process.env.ADMIN_WHATSAPP  || '919644464981@c.us',
  }
}

/**
 * Converts a raw phone number to OpenWA chatId format.
 * "9644464981"    → "919644464981@c.us"
 * "+919644464981" → "919644464981@c.us"
 * "919644464981"  → "919644464981@c.us"
 */
export function toOpenWAChatId(phone) {
  if (!phone) return null
  let digits = phone.replace(/\D/g, '')
  // Indian 10-digit number → prepend 91
  if (digits.length === 10 && /^[6-9]/.test(digits)) {
    digits = '91' + digits
  }
  return `${digits}@c.us`
}

/**
 * Low-level: POST to the WAHA send-text endpoint
 * @param {string} chatId  - e.g. "919644464981@c.us"
 * @param {string} text    - message body
 */
async function sendText(chatId, text) {
  const { baseUrl, apiKey, session } = cfg()
  const url = `${baseUrl}/api/sessions/${session}/messages/send-text`

  const res = await fetch(url, {
    method:  'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key':    apiKey,
    },
    body: JSON.stringify({ chatId, text }),
  })

  if (!res.ok) {
    const errBody = await res.text()
    throw new Error(`OpenWA sendText failed [${res.status}]: ${errBody}`)
  }

  return res.json()
}

/**
 * Sends a welcome WhatsApp message to the user who submitted the enquiry.
 * Only called if the user provided a phone number.
 */
export async function sendWelcomeToUser(enquiry) {
  const { name, phone, subject } = enquiry
  if (!phone) return

  const chatId = toOpenWAChatId(phone)
  if (!chatId) return

  const message =
    `👋 Hello ${name}!\n\n` +
    `Thank you for reaching out to *HumanForce*. We've received your enquiry and our team will get back to you within *2 hours*. ⚡\n\n` +
    `📋 *Your Subject:* ${subject}\n\n` +
    `If you have any urgent questions, feel free to reply to this message! 😊\n\n` +
    `— Team HumanForce`

  try {
    await sendText(chatId, message)
    console.log(`✅ WhatsApp welcome sent to user: ${chatId}`)
  } catch (err) {
    console.error(`⚠️  WhatsApp welcome to user failed (non-blocking):`, err.message)
  }
}

/**
 * Sends a notification to the admin when a new enquiry arrives.
 */
export async function sendEnquiryNotificationToAdmin(enquiry) {
  const { name, email, phone, subject, message } = enquiry
  const { adminNum } = cfg()

  const text =
    `🔔 *New Enquiry Received!*\n\n` +
    `👤 *Name:* ${name}\n` +
    `📧 *Email:* ${email}\n` +
    `📞 *Phone:* ${phone || 'Not provided'}\n` +
    `📋 *Subject:* ${subject}\n` +
    `💬 *Message:*\n${message}\n\n` +
    `🕐 _Received at ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST_`

  try {
    await sendText(adminNum, text)
    console.log(`✅ WhatsApp admin notification sent to ${adminNum}`)
  } catch (err) {
    console.error(`⚠️  WhatsApp admin notification failed (non-blocking):`, err.message)
  }
}

/**
 * Sends an auto-reply to a user who replied via WhatsApp.
 * @param {string} chatId       - Sender's chatId e.g. "919XXXXXXXXX@c.us"
 * @param {string} senderName   - Display name (optional)
 */
export async function sendAutoReply(chatId, senderName = '') {
  const firstName = senderName ? senderName.split(' ')[0] : 'there'

  const text =
    `👋 Hi ${firstName}!\n\n` +
    `Thanks for your message! 🙏\n\n` +
    `Our team has received your reply and will respond to you shortly. In the meantime, you can also reach us at:\n\n` +
    `📧 yakshi539@gmail.com\n` +
    `🕐 Mon–Sat: 10AM–7PM IST\n\n` +
    `— Team HumanForce`

  try {
    await sendText(chatId, text)
    console.log(`✅ WhatsApp auto-reply sent to ${chatId}`)
  } catch (err) {
    console.error(`⚠️  WhatsApp auto-reply failed (non-blocking):`, err.message)
  }
}
