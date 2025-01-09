const { signToken, verifyToken } = require('../middleware/jwtUtils')
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
    return res.status(201).json({ token, driver })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Something went wrong!' })
  }
})

router.get('/', async (req, res) => {
  try {
    const drivers = await Driver.find({})
    return res.status(200).json({ drivers })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Shops data cannot be retrieved!' })
  }
})

router.post('/', async (req, res) => {
  try {
    const driverInDB = await Driver.findOne({
      driverUserName: req.body.driverUserName
    })
    if (driverInDB)
      return res.status(409).json({ error: 'Username already taken.' })

    const driverData = req.body
    const hashedPassword = await bcrypt.hash(driverData.password, 10)
    driverData.password = hashedPassword

    const newDriver = new Driver(driverData)
    await newDriver.save()

    return res.status(201).json({ driver: newDriver })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Driver cannot be created!' })
  }
})
router.get('/driverProfile', verifyToken, async (req, res) => {
  try {
    const driver = await Driver.findById(req.user._id)
    return res.status(201).json(shop)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Something went wrong!' })
  }
})
router.get('/:id', async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id)
    return res.status(200).json({ driver })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Driver data cannot be retrieved!' })
  }
})

router.put('/:id', async (req, res) => {
  try {
    // Check if the password updated
    if (req.body.password) {
      if (req.body.password !== req.body.confirmPassword) {
        return res.status(400).json({ error: 'Passwords do not match' })
      }
      const hashedPassword = await bcrypt.hash(req.body.password, 10)
      req.body.password = hashedPassword
    }

    const driver = await Driver.findByIdAndUpdate(req.params.id, req.body)
    return res
      .status(200)
      .json({ driver, message: 'Driver updated successfully!' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Driver cannot be updated!' })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const driver = await Driver.findByIdAndDelete(req.params.id)
    return res
      .status(200)
      .json({ driver, message: 'Driver deleted successfully!' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Driver cannot be deleted!' })
  }
})

module.exports = router
