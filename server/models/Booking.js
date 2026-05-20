import mongoose from 'mongoose'

const bookingSchema = new mongoose.Schema({
  bookingId: { type: String, required: true, unique: true },
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  provider: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  hours: { type: Number, required: true },
  note: { type: String, default: '' },
  totalCost: { type: Number, required: true },
  depositPaid: { type: Number, required: true },
  remainingPaid: { type: Boolean, default: false },
  razorpayPaymentId: { type: String, default: '' },
  remainingPaymentId: { type: String, default: '' },
  status: { type: String, enum: ['Pending', 'Active', 'Completed', 'Declined'], default: 'Pending' },
  createdAt: { type: Date, default: Date.now }
})

export default mongoose.model('Booking', bookingSchema)
