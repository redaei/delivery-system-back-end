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

router.get('/', async (req, res) => {
  try {
    const shops = await Shop.find({})
    return res.status(200).json({ shops })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Shops data cannot be retrieved!' })
  }
})

router.post('/', async (req, res) => {
  try {
    const shopInDB = await Shop.findOne({ shopUserName: req.body.shopUserName })
    if (shopInDB)
      return res.status(409).json({ error: 'Username already taken.' })

    //check if the password and confirm password match
    if (req.body.password !== req.body.confirmPassword)
      return res.status(400).json({ error: 'Passwords do not match.' })

    //hash the password
    const hashedPassword = bcrypt.hashSync(req.body.password, +process.env.SALT)
    req.body.password = hashedPassword

    const shop = await Shop.create(req.body)
    return res.status(201).json({ shop, message: 'Shop created successfully!' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Shop cannot be created!' })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id)
    return res.status(200).json({ shop })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Shop data cannot be retrieved!' })
  }
})

router.put('/:id', async (req, res) => {
  try {
    //check if the password is being updated, and if it is, check if the confirm password matches, then hash the password
    if (req.body.password) {
      if (req.body.password !== req.body.confirmPassword)
        return res.status(400).json({ error: 'Passwords do not match.' })
      const hashedPassword = bcrypt.hashSync(
        req.body.password,
        +process.env.SALT
      )
      req.body.password = hashedPassword
    }
    const shop = await Shop.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    })
    return res.status(200).json({ shop, message: 'Shop updated successfully!' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Shop cannot be updated!' })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    await Shop.findByIdAndDelete(req.params.id)
    return res.status(200).json({ message: 'Shop deleted successfully!' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Shop cannot be deleted!' })
  }
})

module.exports = router
