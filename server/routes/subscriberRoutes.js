import express from 'express'
import nodemailer from 'nodemailer'
import Subscriber from '../models/Subscriber.js'

const router = express.Router()

// Create reusable transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  })
}

// @desc    Subscribe to newsletter
// @route   POST /api/subscribe
// @access  Public
router.post('/', async (req, res) => {
  const { email } = req.body

  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    return res.status(400).json({ message: 'Please provide a valid email address.' })
  }

  try {
    // Check for duplicate
    const existing = await Subscriber.findOne({ email: email.toLowerCase() })
    if (existing) {
      return res.status(409).json({ message: 'This email is already subscribed!' })
    }

    // Save to DB
    const subscriber = await Subscriber.create({ email: email.toLowerCase() })

    // Send welcome email (non-blocking — don't fail if email fails)
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      try {
        const transporter = createTransporter()
        await transporter.sendMail({
          from: `"HumanForce" <${process.env.EMAIL_USER}>`,
          to: email,
          subject: '🎉 Welcome to HumanForce Newsletter!',
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="UTF-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
              <title>Welcome to HumanForce</title>
            </head>
            <body style="margin:0;padding:0;background:#0f172a;font-family:'Segoe UI',Arial,sans-serif;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f172a;padding:40px 20px;">
                <tr>
                  <td align="center">
                    <table width="600" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,#1e293b,#0f172a);border-radius:16px;border:1px solid #334155;overflow:hidden;max-width:600px;width:100%;">
                      <!-- Header -->
                      <tr>
                        <td style="background:linear-gradient(135deg,#6366f1,#8b5cf6);padding:40px 40px 30px;text-align:center;">
                          <div style="display:inline-block;background:rgba(255,255,255,0.15);border-radius:12px;padding:10px 18px;margin-bottom:16px;">
                            <span style="color:#fff;font-size:20px;font-weight:800;letter-spacing:1px;">⚡ HumanForce</span>
                          </div>
                          <h1 style="color:#fff;font-size:28px;font-weight:700;margin:0;line-height:1.3;">You're in! 🎉</h1>
                          <p style="color:rgba(255,255,255,0.85);font-size:15px;margin:10px 0 0;">Welcome to the HumanForce community</p>
                        </td>
                      </tr>
                      <!-- Body -->
                      <tr>
                        <td style="padding:40px;">
                          <p style="color:#cbd5e1;font-size:16px;line-height:1.7;margin:0 0 24px;">
                            Hi there! 👋<br/><br/>
                            Thank you for subscribing to <strong style="color:#a78bfa;">HumanForce Newsletter</strong>. You're now among the first to know about:
                          </p>
                          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                            ${[
                              ['🚀', 'New Features & Updates', 'Be first to explore our latest AI-powered tools'],
                              ['💼', 'Exclusive Offers', 'Special deals and early-bird discounts just for subscribers'],
                              ['📰', 'Industry Insights', 'Tips, trends and best practices in human services'],
                              ['🎯', 'Pro Tips', 'Make the most of the HumanForce platform'],
                            ].map(([icon, title, desc]) => `
                              <tr>
                                <td style="padding:12px 0;border-bottom:1px solid #1e293b;">
                                  <table cellpadding="0" cellspacing="0">
                                    <tr>
                                      <td style="width:40px;font-size:22px;vertical-align:top;">${icon}</td>
                                      <td style="vertical-align:top;">
                                        <p style="color:#e2e8f0;font-weight:600;font-size:14px;margin:0 0 3px;">${title}</p>
                                        <p style="color:#94a3b8;font-size:13px;margin:0;">${desc}</p>
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                            `).join('')}
                          </table>
                          <div style="text-align:center;margin:32px 0;">
                            <a href="https://humanforce-iota.vercel.app" style="display:inline-block;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;text-decoration:none;padding:14px 32px;border-radius:10px;font-size:15px;font-weight:700;letter-spacing:0.5px;">Explore HumanForce →</a>
                          </div>
                          <p style="color:#64748b;font-size:13px;text-align:center;margin:0;">
                            You received this because you subscribed at humanforce-iota.vercel.app<br/>
                            <a href="#" style="color:#6366f1;text-decoration:none;">Unsubscribe</a>
                          </p>
                        </td>
                      </tr>
                      <!-- Footer -->
                      <tr>
                        <td style="background:#0f172a;padding:20px 40px;text-align:center;border-top:1px solid #1e293b;">
                          <p style="color:#475569;font-size:12px;margin:0;">© ${new Date().getFullYear()} HumanForce · Dewas, Madhya Pradesh 455001</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </body>
            </html>
          `
        })
        console.log(`Subscription welcome email sent to: ${email}`)
      } catch (emailErr) {
        console.error('Failed to send subscription email:', emailErr.message)
        // Don't fail the request — DB record is already saved
      }
    } else {
      console.warn('EMAIL_USER or EMAIL_PASS not set — skipping subscription email.')
    }

    res.status(201).json({
      message: 'Subscribed successfully! Check your inbox for a welcome email.',
      subscriber: { id: subscriber._id, email: subscriber.email }
    })
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'This email is already subscribed!' })
    }
    console.error('Subscribe error:', error)
    res.status(500).json({ message: 'Server error. Please try again later.' })
  }
})

// @desc    Get all subscribers (admin only - no auth for simplicity, add if needed)
// @route   GET /api/subscribe
// @access  Public (restrict in production)
router.get('/', async (req, res) => {
  try {
    const subscribers = await Subscriber.find({}).sort('-createdAt')
    res.json({ count: subscribers.length, subscribers })
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
})

export default router
