const mongoose = require('mongoose')
const Shop = require('./Shop')
const Driver = require('./Driver')

const orderSchema = new mongoose.Schema(
  {
    shopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Shop
    },
    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Driver
    },
    orderNumber: {
      type: String,
      unique: true,
      required: true
    },
    orderDate: {
      type: Date
    },
    orderStatus: {
      type: String,
      enum: [
        'Pending',
        'Rejected',
        'Accepted',
        'Out for delivery',
        'Delivered'
      ],
      default: 'Pending'
    },
    pickTime: {
      type: Date
    },
    dropTime: {
      type: Date
    },
    pickTime: {
      type: Date
    },
    description: {
      type: String
    },
    deliveryPrice: {
      type: Number
    }
  },
  { timestamps: true }
)

const Order = mongoose.model('Order', orderSchema)

module.exports = Order
