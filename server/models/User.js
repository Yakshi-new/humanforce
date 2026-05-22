import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['customer', 'provider', 'admin'], default: 'customer' },
  company: { type: String, default: '' },
  bio: { type: String, default: '' },
  skills: [{ type: String }],
  idType: { type: String, default: '' },
  linkedin: { type: String, default: '' },
  status: { type: String, enum: ['Active', 'Pending', 'Suspended'], default: 'Active' },
  rating: { type: Number, default: 4.8 },
  reviewsCount: { type: Number, default: 0 },
  earnings: { type: Number, default: 0 },
  avatar: { type: String, default: '' },
  lastLogin: { type: Date },
  createdAt: { type: Date, default: Date.now }
})

userSchema.pre('save', function (next) {
  if (!this.avatar) {
    const seed = encodeURIComponent(`${this.firstName}_${this.lastName}_${Date.now()}`)
    this.avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`
  }
  next()
})

export default mongoose.model('User', userSchema)
