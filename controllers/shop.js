const { signToken } = require('../middleware/jwtUtils')
const Shop = require('../models/Shop')
const bcrypt = require('bcrypt')
const router = require('express').Router()

router.post('/shopSignup', async (req, res) => {
  try {
    const { shopUserName, password, location, phone } = req.body
    if (!shopUserName || !password)
      return res.status(400).json({ error: 'Missing required fields.' })
    const shopExist = await Shop.findOne({ shopUserName })
    if (shopExist)
      return res.status(409).json({ error: 'Username already taken.' })
    const hashedPassword = bcrypt.hashSync(password, +process.env.SALT)
    const shop = await Shop.create({
      shopUserName,
      password: hashedPassword,
      location,
      phone
    })
    const token = signToken(shop)
    return res.status(201).json({ message: 'User created', token })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Something went wrong!' })
  }
})

router.post('/shopSignin', async (req, res) => {
  try {
    const { shopUserName, password } = req.body
    if (!shopUserName || !password)
      return res.status(400).json({ error: 'Missing required fields.' })
    const shop = await Shop.findOne({ shopUserName })
    if (!shop) return res.status(400).json({ error: 'Bad request.' })
    const matched = bcrypt.compareSync(password, shop.password)
    if (!matched) return res.status(400).json({ error: 'Bad request.' })
    const token = signToken(shop)
    return res.status(201).json({ token })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Something went wrong!' })
  }
})

router.get('/shopProfile', async (req, res) => {
  try {
    const shop = await Shop.findById(req.user._id)
    return res.status(201).json(shop)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Something went wrong!' })
  }
})

module.exports = router
