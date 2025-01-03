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
    orderDate: {
      type: Date
    },
    orderStatus: {
      type: Boolean,
      default: false
    },
    pickTime: {
      type: Date
    },
    dropTime: {
      type: Date
    },
    deliveryPrice: {
      type: Number
    }
  },
  { timestamps: true }
)

const Order = mongoose.model('Order', orderSchema)

module.exports = Order
