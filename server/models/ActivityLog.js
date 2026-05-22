import mongoose from 'mongoose'

const activityLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  email: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, required: true },
  action: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
})

export default mongoose.model('ActivityLog', activityLogSchema)
