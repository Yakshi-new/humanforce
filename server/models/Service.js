import mongoose from 'mongoose'

const serviceSchema = new mongoose.Schema({
  serviceId: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  desc: { type: String, required: true },
  price: { type: Number, required: true },
  iconName: { type: String, required: true },
  category: { type: String, required: true },
  tags: [{ type: String }],
  rating: { type: Number, default: 4.8 },
  reviews: { type: Number, default: 0 },
  color: { type: String, required: true },
  bg: { type: String, required: true }
})

export default mongoose.model('Service', serviceSchema)
