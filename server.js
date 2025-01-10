const dotenv = require('dotenv')
dotenv.config()
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const cors = require('cors')
const adminAuthController = require('./controllers/adminAuth')
const adminController = require('./controllers/admin')
const { verifyToken } = require('./middleware/jwtUtils')
const shopController = require('./controllers/shops')
const driverController = require('./controllers/drivers')
const orderController = require('./controllers/orders')
mongoose.connect(process.env.MONGODB_URI)
mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`)
})
const PORT = process.env.PORT
app.use(express.json())
app.use(cors())

// Routes go here
app.use('/auth', adminAuthController)
app.use('/admin', verifyToken, adminController)
app.use('/shops', shopController)
app.use('/drivers', driverController)
app.use('/orders', orderController)
app.listen(PORT, () => {
  console.log('The express app is ready!', PORT)
})
