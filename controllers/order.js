const Order = require('../models/Order')
const router = require('express').Router()

router.post('/createOrder', async (req, res) => {
  try {
    const createdOrder = await Order.create(req.body)
    res.status(201).json(createdOrder)
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Something went wrong!' })
  }
})

router.get('/orders', async (req, res) => {
  try {
    const order = await Order.find(req.user._id)
    return res.status(201).json(order)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Something went wrong!' })
  }
})
module.exports = router
