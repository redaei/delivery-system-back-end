const mongoose = require('mongoose')

const adminSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      require: true,
      unique: true
    },
    password: {
      type: String,
      require: true
    },
    adminName: {
      type: String,
      require: true
    }
  },
  { timestamps: true }
)

const Admin = mongoose.model('Admin', adminSchema)

module.exports = Admin
