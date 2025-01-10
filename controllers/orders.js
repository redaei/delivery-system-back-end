const Shop = require('../models/Shop')
const Driver = require('../models/Driver')
const Order = require('../models/Order')
const router = require('express').Router()

router.get('/', async (req, res) => {
  try {
    const orders = await Order.find({}).populate('driverId').populate('shopId')
    return res.status(200).json({ orders })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Orders data cannot be retrieved!' })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('driverId')
      .populate('shopId')
    return res.status(200).json({ order })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Order data cannot be retrieved!' })
  }
})

router.get('/driver', async (req, res) => {
  try {
    const orders = await Order.find({ driverId: req.user._id })
      .populate('driverId')
      .populate('shopId')
    return res.status(201).json(orders)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Orders data cannot be retrieved!' })
  }
})

router.get('/shop', async (req, res) => {
  try {
    const orders = await Order.find({ shopId: req.user._id })
      .populate('driverId')
      .populate('shopId')
    return res.status(201).json(orders)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Orders data cannot be retrieved!' })
  }
})

router.post('/', async (req, res) => {
  try {
    req.body.shopId = req.user._id
    req.body.orderDate = new Date()

    const lastOrder = await Order.findOne().sort({ orderNumber: -1 })
    if (lastOrder) {
      const orderNumber = lastOrder.orderNumber.split('-')[1]
      req.body.orderNumber = `ORD-${parseInt(orderNumber) + 1}`
    } else {
      req.body.orderNumber = `ORD-100001`
    }

    const order = await Order.create(req.body)
    return res.status(201).json({ order })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Order cannot be created!' })
  }
})

router.put('/:id/:action', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
    if (!order) {
      return res.status(404).json({ error: 'Order not found!' })
    }
    order.orderStatus = req.params.action
    await order.save()

    return res.status(200).json({ order })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Order status cannot be updated!' })
  }
})

router.put('/:id', async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    })
    return res.status(200).json({ order })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Order cannot be updated!' })
  }
})
router.delete('/:id', async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id)
    return res
      .status(200)
      .json({
        message: `Successfully deleted order with Order Number: ${order.orderNumber}`
      })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Order cannot be deleted!' })
  }
})

module.exports = router
