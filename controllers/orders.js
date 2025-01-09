const Order = require('../models/Order')
const Shop = require('../models/Shop')
const Driver = require('../models/Driver')
const router = require('express').Router()

router.get('/', async (req, res) => {
  try {
    const orders = await Order.find({})
    return res.status(200).json({ orders })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Orders data cannot be retrieved!' })
  }
})

router.post('/', async (req, res) => {
  try {
    //assign req.userid to body.shopId
    req.body.shopId = req.user._id

    //orderDate is the current date
    req.body.orderDate = new Date()

    const order = await Order.create(req.body)
    return res.status(201).json({ order })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Order cannot be created!' })
  }
})
