import { model, Schema } from 'mongoose'

const favoriteSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  }
}, { timestamps: true })

export const Favorite = model('Favorite', favoriteSchema)
