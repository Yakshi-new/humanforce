import express from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import User from '../models/User.js'
import ActivityLog from '../models/ActivityLog.js'
import { protect } from '../middleware/auth.js'
import { generateAvatarUrl } from '../utils/avatarHelper.js'

const router = express.Router()

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'humanforce_secure_jwt_token_secret_key_9988776655', {
    expiresIn: '2h',
  })
}

const logUserActivity = async (user, action = 'Login', details = '') => {
  try {
    if (action === 'Login') {
      user.lastLogin = new Date()
      await user.save()
    }
    await ActivityLog.create({
      userId: user._id,
      email: user.email,
      name: `${user.firstName} ${user.lastName}`,
      role: user.role,
      action,
      details: details || (action === 'Login' ? 'User logged in successfully' : action === 'Register' ? 'User registered a new account' : '')
    })
  } catch (error) {
    console.error(`Error logging user activity (${action}):`, error)
  }
}

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', async (req, res) => {
  const { firstName, lastName, email, phone, password, role, company, bio, skills, idType, linkedin } = req.body

  try {
    const userExists = await User.findOne({ email })

    if (userExists) {
      const roleLabel = userExists.role === 'provider' ? 'Provider' : userExists.role === 'admin' ? 'Admin' : 'User'
      return res.status(409).json({
        message: `This email is already registered as a ${roleLabel}. Please sign in instead.`,
        code: 'ALREADY_REGISTERED',
        existingRole: userExists.role
      })
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Generate role-specific professional avatar
    const avatarUrl = generateAvatarUrl(firstName, lastName, role || 'customer')

    const user = await User.create({
      firstName,
      lastName,
      email,
      phone,
      password: hashedPassword,
      role: role || 'customer',
      company: company || '',
      bio: bio || '',
      skills: skills || [],
      idType: idType || '',
      linkedin: linkedin || '',
      avatar: avatarUrl,
      status: role === 'provider' ? 'Pending' : 'Active' // Providers require verification
    })

    if (user) {
      await logUserActivity(user, 'Register')
      await logUserActivity(user, 'Login')
      res.status(201).json({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        company: user.company,
        bio: user.bio,
        skills: user.skills,
        idType: user.idType,
        linkedin: user.linkedin,
        status: user.status,
        rating: user.rating,
        reviewsCount: user.reviewsCount,
        avatar: user.avatar,
        token: generateToken(user._id)
      })
    } else {
      res.status(400).json({ message: 'Invalid user data' })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
})

// @desc    Auth user & get token (Login)
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res) => {
  const { email, password, phone, method } = req.body

  try {
    let user

    if (method === 'otp') {
      // Simulate mobile OTP login or look up by phone
      user = await User.findOne({ phone })
      if (!user) {
        return res.status(400).json({ message: 'No user registered with this phone number' })
      }
      // Simulate OTP verification directly
      await logUserActivity(user, 'Login')
      return res.json({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        company: user.company,
        bio: user.bio,
        skills: user.skills,
        status: user.status,
        rating: user.rating,
        reviewsCount: user.reviewsCount,
        avatar: user.avatar,
        token: generateToken(user._id)
      })
    } else if (method === 'google') {
      // Simulate google login. If email exists, log in. If not, create a dummy account!
      user = await User.findOne({ email })
      if (!user) {
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash('google_oauth_dummy_pass', salt)
        const googleFirstName = email.split('@')[0]
        const avatarUrl = generateAvatarUrl(googleFirstName, 'User', 'customer')
        user = await User.create({
          firstName: googleFirstName,
          lastName: 'Google User',
          email,
          phone: '+919999999999',
          password: hashedPassword,
          role: 'customer',
          avatar: avatarUrl
        })
        await logUserActivity(user, 'Register')
      }
      await logUserActivity(user, 'Login')
      return res.json({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        company: user.company,
        bio: user.bio,
        skills: user.skills,
        status: user.status,
        rating: user.rating,
        reviewsCount: user.reviewsCount,
        avatar: user.avatar,
        token: generateToken(user._id)
      })
    } else {
      // Email/Password login
      user = await User.findOne({ email })

      if (user && (await bcrypt.compare(password, user.password))) {
        await logUserActivity(user, 'Login')
        res.json({
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          role: user.role,
          company: user.company,
          bio: user.bio,
          skills: user.skills,
          status: user.status,
          rating: user.rating,
          reviewsCount: user.reviewsCount,
          avatar: user.avatar,
          token: generateToken(user._id)
        })
      } else {
        res.status(401).json({ message: 'Invalid email or password' })
      }
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
})

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password')
    if (user) {
      res.json(user)
    } else {
      res.status(404).json({ message: 'User not found' })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
})

// @desc    Log user logout activity
// @route   POST /api/auth/logout
// @access  Private
router.post('/logout', protect, async (req, res) => {
  try {
    const { isAuto } = req.body
    await ActivityLog.create({
      userId: req.user._id,
      email: req.user.email,
      name: `${req.user.firstName} ${req.user.lastName}`,
      role: req.user.role,
      action: isAuto ? 'Auto-Logout' : 'Logout',
      details: isAuto ? 'User was automatically logged out due to session expiration' : 'User manually logged out'
    })
    res.json({ status: 'OK', message: 'Logout activity logged' })
  } catch (error) {
    console.error('Error logging logout activity:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

export default router
