const { signToken } = require('../middleware/jwtUtils')
const Driver = require('../models/Driver')
const bcrypt = require('bcrypt')
const router = require('express').Router()

router.post('/driverSignup', async (req, res) => {
  try {
    const { driverUserName, password, driverName, phone, deliveryPrice } =
      req.body
    if (!driverUserName || !password)
      return res.status(400).json({ error: 'Missing required fields.' })
    const driverExist = await Driver.findOne({ driverUserName })
    if (driverExist)
      return res.status(409).json({ error: 'Username already taken.' })
    const hashedPassword = bcrypt.hashSync(password, +process.env.SALT)
    const driver = await Driver.create({
      driverUserName,
      password: hashedPassword,
      driverName,
      phone,
      deliveryPrice
    })
    const token = signToken(driver)
    return res.status(201).json({ message: 'User created', token })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Something went wrong!' })
  }
})

router.post('/driverSignin', async (req, res) => {
  try {
    const { driverUserName, password } = req.body
    if (!driverUserName || !password)
      return res.status(400).json({ error: 'Missing required fields.' })
    const driver = await Driver.findOne({ driverUserName })
    if (!driver) return res.status(400).json({ error: 'Bad request.' })
    const matched = bcrypt.compareSync(password, driver.password)
    if (!matched) return res.status(400).json({ error: 'Bad request.' })
    const token = signToken(driver)
    return res.status(201).json({ token })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Something went wrong!' })
  }
})

router.get('/driverProfile', async (req, res) => {
  try {
    const driver = await Driver.findById(req.user._id)
    return res.status(201).json(shop)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Something went wrong!' })
  }
})

module.exports = router
