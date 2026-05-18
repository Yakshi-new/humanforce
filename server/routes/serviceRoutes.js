import express from 'express'
import Service from '../models/Service.js'
import { protect, adminOnly } from '../middleware/auth.js'

const router = express.Router()

// Initial seed data
const SEED_SERVICES = [
  {
    serviceId: 1, name: 'Movies', desc: 'Book a buddy to watch movies together — cinemas, OTT premieres, or film festivals.',
    price: 1000, iconName: 'Film', color: '#E53935', bg: 'linear-gradient(135deg,#E53935,#C62828)',
    category: 'Entertainment', tags: ['Cinema', 'Film Festival', 'OTT'], rating: 4.8, reviews: 312,
  },
  {
    serviceId: 2, name: 'Shopping', desc: 'A personal shopping companion to help you pick the best products and deals.',
    price: 1000, iconName: 'ShoppingBag', color: '#D81B60', bg: 'linear-gradient(135deg,#D81B60,#AD1457)',
    category: 'Lifestyle', tags: ['Malls', 'Grocery', 'Fashion'], rating: 4.7, reviews: 289,
  },
  {
    serviceId: 3, name: 'Travel', desc: 'Your perfect travel buddy for road trips, treks, city tours, and more.',
    price: 1000, iconName: 'Plane', color: '#1E88E5', bg: 'linear-gradient(135deg,#1E88E5,#1565C0)',
    category: 'Adventure', tags: ['Road Trip', 'Trekking', 'City Tour'], rating: 4.9, reviews: 401,
  },
  {
    serviceId: 4, name: 'Medical Help', desc: 'A compassionate companion for hospital visits, appointments, and post-care support.',
    price: 3000, iconName: 'Stethoscope', color: '#43A047', bg: 'linear-gradient(135deg,#43A047,#2E7D32)',
    category: 'Care', tags: ['Hospital', 'Appointments', 'Post-Care'], rating: 4.9, reviews: 198,
  },
  {
    serviceId: 5, name: 'Elder Care', desc: 'Warm, respectful companions for senior citizens — conversations, walks, and activities.',
    price: 1000, iconName: 'Heart', color: '#E53935', bg: 'linear-gradient(135deg,#E53935,#C62828)',
    category: 'Care', tags: ['Senior', 'Companionship', 'Wellness'], rating: 4.9, reviews: 276,
  },
  {
    serviceId: 6, name: 'Domestic Help', desc: 'Assistance with household tasks — cooking, cleaning, organizing, and errands.',
    price: 1000, iconName: 'Home', color: '#FB8C00', bg: 'linear-gradient(135deg,#FB8C00,#E65100)',
    category: 'Lifestyle', tags: ['Cooking', 'Cleaning', 'Errands'], rating: 4.6, reviews: 354,
  },
  {
    serviceId: 7, name: 'Business Events', desc: 'Professional companion for corporate events, conferences, and networking sessions.',
    price: 1000, iconName: 'Briefcase', color: '#37474F', bg: 'linear-gradient(135deg,#37474F,#263238)',
    category: 'Professional', tags: ['Conferences', 'Networking', 'Corporate'], rating: 4.8, reviews: 187,
  },
  {
    serviceId: 8, name: 'Outdoor Events', desc: 'An enthusiastic partner for outdoor fests, adventure sports, and nature events.',
    price: 1000, iconName: 'TreePine', color: '#00897B', bg: 'linear-gradient(135deg,#00897B,#00695C)',
    category: 'Adventure', tags: ['Festivals', 'Nature', 'Adventure'], rating: 4.7, reviews: 243,
  },
  {
    serviceId: 9, name: 'Baking/Cooking', desc: 'A culinary buddy to bake, cook, and explore new recipes together.',
    price: 1000, iconName: 'ChefHat', color: '#F4511E', bg: 'linear-gradient(135deg,#F4511E,#BF360C)',
    category: 'Lifestyle', tags: ['Baking', 'Recipes', 'Culinary'], rating: 4.8, reviews: 165,
  },
  {
    serviceId: 10, name: 'Sporting Events', desc: 'Get a passionate sports fan to join you at live matches and sporting events.',
    price: 3000, iconName: 'Trophy', color: '#F9A825', bg: 'linear-gradient(135deg,#F9A825,#F57F17)',
    category: 'Entertainment', tags: ['Cricket', 'Football', 'Live Events'], rating: 4.8, reviews: 231,
  },
  {
    serviceId: 11, name: 'Playing Sports', desc: 'Find a sports partner for badminton, tennis, gym workouts, swimming, and more.',
    price: 1000, iconName: 'Dumbbell', color: '#00ACC1', bg: 'linear-gradient(135deg,#00ACC1,#00838F)',
    category: 'Adventure', tags: ['Badminton', 'Gym', 'Tennis'], rating: 4.7, reviews: 298,
  },
  {
    serviceId: 12, name: 'Comedy Club', desc: 'Enjoy stand-up shows, improv nights, and comedy events with a fun-loving buddy.',
    price: 1000, iconName: 'Laugh', color: '#8E24AA', bg: 'linear-gradient(135deg,#8E24AA,#6A1B9A)',
    category: 'Entertainment', tags: ['Stand-up', 'Improv', 'Fun'], rating: 4.9, reviews: 177,
  },
  {
    serviceId: 13, name: 'Going to Bar', desc: 'A social companion for bar hopping, craft beer tasting, and evening outings.',
    price: 1000, iconName: 'Wine', color: '#7B1FA2', bg: 'linear-gradient(135deg,#7B1FA2,#4A148C)',
    category: 'Nightlife', tags: ['Bar Hopping', 'Cocktails', 'Social'], rating: 4.6, reviews: 203,
  },
  {
    serviceId: 14, name: 'Hanging Out', desc: 'Just want company? Book a buddy for casual hangouts, walks, and chilling.',
    price: 1000, iconName: 'Coffee', color: '#00796B', bg: 'linear-gradient(135deg,#00796B,#004D40)',
    category: 'Lifestyle', tags: ['Casual', 'Walks', 'Coffee'], rating: 4.8, reviews: 512,
  },
  {
    serviceId: 15, name: 'Tutoring', desc: 'Expert tutors for academics, skill development, language learning, and more.',
    price: 1000, iconName: 'GraduationCap', color: '#1976D2', bg: 'linear-gradient(135deg,#1976D2,#0D47A1)',
    category: 'Professional', tags: ['Academics', 'Languages', 'Skills'], rating: 4.9, reviews: 389,
  },
  {
    serviceId: 16, name: 'Clubbing', desc: 'Hit the nightclub scene with a fun, safe, and energetic clubbing companion.',
    price: 1000, iconName: 'Music', color: '#AD1457', bg: 'linear-gradient(135deg,#AD1457,#880E4F)',
    category: 'Nightlife', tags: ['Nightclub', 'Dancing', 'Music'], rating: 4.7, reviews: 156,
  },
  {
    serviceId: 17, name: 'Dinner', desc: 'Fine dining, casual meals, or food explorations — never dine alone again.',
    price: 1000, iconName: 'Utensils', color: '#C62828', bg: 'linear-gradient(135deg,#C62828,#B71C1C)',
    category: 'Lifestyle', tags: ['Fine Dining', 'Restaurants', 'Food'], rating: 4.8, reviews: 341,
  },
  {
    serviceId: 18, name: 'Music', desc: 'Attend concerts, open-mic nights, and music festivals with a fellow music lover.',
    price: 1000, iconName: 'Music', color: '#1565C0', bg: 'linear-gradient(135deg,#1565C0,#0D47A1)',
    category: 'Entertainment', tags: ['Concerts', 'Festivals', 'Open-mic'], rating: 4.8, reviews: 267,
  },
  {
    serviceId: 19, name: 'Culture', desc: 'Explore art galleries, museums, heritage sites, and cultural events together.',
    price: 1000, iconName: 'Palette', color: '#2E7D32', bg: 'linear-gradient(135deg,#2E7D32,#1B5E20)',
    category: 'Adventure', tags: ['Museums', 'Art', 'Heritage'], rating: 4.7, reviews: 189,
  },
  {
    serviceId: 20, name: 'Parties', desc: 'Book the life of the party — energetic, fun, and the perfect party companion.',
    price: 1000, iconName: 'PartyPopper', color: '#E91E63', bg: 'linear-gradient(135deg,#E91E63,#C2185B)',
    category: 'Nightlife', tags: ['Birthday', 'Celebrations', 'Events'], rating: 4.9, reviews: 423,
  }
]

// Seed function if DB is empty
export const seedServicesIfNeeded = async () => {
  try {
    const count = await Service.countDocuments()
    if (count === 0) {
      console.log('Seeding initial 20 premium services into MongoDB...')
      await Service.insertMany(SEED_SERVICES)
      console.log('Successfully seeded services!')
    }
  } catch (error) {
    console.error('Failed to seed services:', error)
  }
}

// @desc    Get all services
// @route   GET /api/services
// @access  Public
router.get('/', async (req, res) => {
  try {
    // Seed on demand if empty
    await seedServicesIfNeeded()
    const services = await Service.find({})
    res.json(services)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
})

// @desc    Get specific service
// @route   GET /api/services/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const service = await Service.findOne({ serviceId: parseInt(req.params.id) }) || await Service.findById(req.params.id)
    if (service) {
      res.json(service)
    } else {
      res.status(404).json({ message: 'Service not found' })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
})

// @desc    Create new service
// @route   POST /api/services
// @access  Private/Admin
router.post('/', protect, adminOnly, async (req, res) => {
  const { name, desc, price, iconName, category, tags, color, bg } = req.body

  try {
    const highestSvc = await Service.findOne().sort('-serviceId')
    const serviceId = highestSvc ? highestSvc.serviceId + 1 : 1

    const newService = await Service.create({
      serviceId,
      name,
      desc,
      price,
      iconName: iconName || 'Zap',
      category,
      tags: tags || [],
      color: color || '#E53935',
      bg: bg || 'linear-gradient(135deg,#E53935,#C62828)'
    })

    res.status(201).json(newService)
  } catch (error) {
    console.error(error)
    res.status(400).json({ message: 'Invalid service data' })
  }
})

export default router
