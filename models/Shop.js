const mongoose = require('mongoose')
const Admin = require('./Admin')

const shopSchema = new mongoose.Schema(
  {
    shopUserName: {
      type: String,
      require: true,
      unique: true
    },
    password: {
      type: String,
      require: true
    },
    location: {
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
    openTime: {
      type: String
    }
  },
  { timestamps: true }
)

const Shop = mongoose.model('Shop', shopSchema)

module.exports = Shop
