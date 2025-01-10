const { signToken } = require('../middleware/jwtUtils')
const Admin = require('../models/Admin')
const bcrypt = require('bcrypt')
const router = require('express').Router()

router.post('/bananaSignup', async (req, res) => {
  try {
    const { userName, password, adminName } = req.body
    if (!userName || !password || !adminName)
      return res.status(400).json({ error: 'Missing required fields.' })
    const adminExist = await Admin.findOne({ userName })
    if (adminExist)
      return res.status(409).json({ error: 'Username already taken.' })
    const hashedPassword = bcrypt.hashSync(password, +process.env.SALT)
    const admin = await Admin.create({
      userName,
      password: hashedPassword,
      adminName
    })
    const token = signToken(admin)
    return res.status(201).json({ message: 'User created', token })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Something went wrong!' })
  }
})

router.post('/bananaSignin', async (req, res) => {
  try {
    const { userName, password } = req.body
    if (!userName || !password)
      return res.status(400).json({ error: 'Missing required fields.' })
    const admin = await Admin.findOne({ userName })
    if (!admin) return res.status(400).json({ error: 'Bad request.' })
    const matched = bcrypt.compareSync(password, admin.password)
    if (!matched) return res.status(400).json({ error: 'Bad request.' })
    const token = signToken(admin)
    return res.status(201).json({ token, role: 'Admin' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Something went wrong!' })
  }
})

module.exports = router
