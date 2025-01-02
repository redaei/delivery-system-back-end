const dotenv = require('dotenv')
dotenv.config()
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const cors = require('cors')
const adminAuthRouter = require('../controllers/adminAuth')
const adminRouter = require('../controllers/admin')
const { verifyToken } = require('./middleware/jwtUtils')
const shopAuth = require('../controllers/shop')
const driverAuth = require('../controllers/driver')

mongoose.connect(process.env.MONGODB_URI)
mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`)
})
const PORT = process.env.PORT
app.use(express.json())
app.use(cors())

// Routes go here
app.use('/auth', adminAuthRouter)
app.use('/admin', verifyToken, adminRouter)
app.use('/shop', shopAuth)
app.use('/driver', driverAuth)

app.listen(PORT, () => {
  console.log('The express app is ready!', PORT)
})
