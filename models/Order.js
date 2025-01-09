const mongoose = require('mongoose')
const { type } = require('os')
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
    orderDate: {
      type: Date
    },
    orderStatus: {
      type: String,
      enum: ['Pending', 'In progress', 'Delivered'],
      default: 'Pending'
    },
    deliveryTime: {
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
