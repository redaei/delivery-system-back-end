const mongoose = require('mongoose')
const Admin = require('./Admin')

const driverSchema = new mongoose.Schema(
  {
    driverUserName: {
      type: String,
      require: true,
      unique: true
    },
    password: {
      type: String,
      require: true
    },
    driverName: {
      type: String,
      require: true
    },
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Admin
    },
    phone: {
      type: Number
    },
    status: {
      type: Boolean,
      default: false
    },
    deliveryPrice: {
      type: Number,
      require: true
    }
  },
  { timestamps: true }
)

const Driver = mongoose.model('Driver', driverSchema)

module.exports = Driver
