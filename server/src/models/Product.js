import { model, Schema } from 'mongoose'

const productSchema = new Schema({
  name: { type: String, required: true, trim: true },
  category: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  oldPrice: { type: Number, min: 0, default: null },
  unitValue: { type: Number, required: true, min: 0 },
  unit: { type: String, required: true, trim: true },
  image: {
    type: {
      public_id: { type: String, required: true },
      url: { type: String, required: true },
    },
    required: true
  },
  stock: { type: Number, default: 100, min: 0 }
}, { timestamps: true })

export const Product = model('Product', productSchema)
