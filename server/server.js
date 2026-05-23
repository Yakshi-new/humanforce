import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import bcrypt from 'bcryptjs'
import dns from 'dns'

dns.setDefaultResultOrder('ipv4first')


// Import models
import User from './models/User.js'

// Import routes
import authRoutes from './routes/authRoutes.js'
import serviceRoutes, { seedServicesIfNeeded } from './routes/serviceRoutes.js'
import bookingRoutes from './routes/bookingRoutes.js'
import messageRoutes from './routes/messageRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import enquiryRoutes from './routes/enquiryRoutes.js'
import subscriberRoutes from './routes/subscriberRoutes.js'
import { startAutoReassignJob } from './jobs/autoReassignProvider.js'
import { generateAvatarUrl } from './utils/avatarHelper.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middlewares
app.use(cors())
app.use(express.json())

// API Route Registration
app.use('/api/auth', authRoutes)
app.use('/api/services', serviceRoutes)
app.use('/api/bookings', bookingRoutes)
app.use('/api/messages', messageRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/enquiries', enquiryRoutes)
app.use('/api/subscribe', subscriberRoutes)

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'HumanForce API is fully operational' })
})

// Auto-seed admin and provider accounts if they don't exist
const seedAccounts = async () => {
  try {
    // 1. Seed Super Admin
    const adminExists = await User.findOne({ email: 'admin@nomail.com' })
    if (!adminExists) {
      console.log('Seeding default Super Admin account...')
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash('HumanForce@123', salt)
      
      await User.create({
        firstName: 'Super',
        lastName: 'Admin',
        email: 'admin@nomail.com',
        phone: '+919999911111',
        password: hashedPassword,
        role: 'admin',
        status: 'Active',
        avatar: generateAvatarUrl('Super', 'Admin', 'admin')
      })
      console.log('Admin seeded: admin@nomail.com / HumanForce@123')
    }

    // 2. Seed Provider 1 (Ana Kowalski)
    const provider1Exists = await User.findOne({ email: 'ana@humanforce.com' })
    if (!provider1Exists) {
      console.log('Seeding provider: Ana Kowalski...')
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash('provider123', salt)

      await User.create({
        firstName: 'Ana',
        lastName: 'Kowalski',
        email: 'ana@humanforce.com',
        phone: '+919876543210',
        password: hashedPassword,
        role: 'provider',
        bio: 'Executive Personal Assistant · 6 years experience. Expert at email and schedule organization.',
        skills: ['Calendar Management', 'Email Handling', 'Travel Planning'],
        status: 'Active',
        rating: 4.9,
        reviewsCount: 214,
        idType: 'Passport',
        avatar: generateAvatarUrl('Ana', 'Kowalski', 'provider')
      })
    }

    // 3. Seed Provider 2 (Marcus Reyes)
    const provider2Exists = await User.findOne({ email: 'marcus@humanforce.com' })
    if (!provider2Exists) {
      console.log('Seeding provider: Marcus Reyes...')
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash('provider123', salt)

      await User.create({
        firstName: 'Marcus',
        lastName: 'Reyes',
        email: 'marcus@humanforce.com',
        phone: '+919876543211',
        password: hashedPassword,
        role: 'provider',
        bio: 'Digital Marketing specialist with extensive experience in scaling startups.',
        skills: ['Social Media', 'SEO', 'Lead Generation'],
        status: 'Active',
        rating: 4.8,
        reviewsCount: 184,
        idType: 'Driver\'s License',
        avatar: generateAvatarUrl('Marcus', 'Reyes', 'provider')
      })
    }

    // 4. Seed Services
    await seedServicesIfNeeded()

  } catch (error) {
    console.error('Error seeding default accounts:', error)
  }
}

// Database Connection
const mongoURI = process.env.DATABASE_URL || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/humanforce'

mongoose
  .connect(mongoURI)
  .then(async () => {
    console.log('Connected successfully to MongoDB Database!')
    
    // Run seeding
    await seedAccounts()

    // Start background jobs
    startAutoReassignJob()

    // Start Server
    app.listen(PORT, () => {
      console.log(`Express server running on http://localhost:${PORT}`)
    })
  })
  .catch((err) => {
    console.error('MongoDB database connection failure:', err)
    process.exit(1)
  })
