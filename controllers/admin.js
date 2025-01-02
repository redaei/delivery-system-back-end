const Admin = require('../models/Admin')
const router = require('express').Router()

router.get('/profile', async (req, res) => {
  try {
    const admin = await Admin.findById(req.user._id)
    return res.status(201).json(admin)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Something went wrong!' })
  }
})

module.exports = router
