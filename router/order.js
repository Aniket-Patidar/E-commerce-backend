const express = require('express');
const router = express.Router()
const { createOrder, fetchOrdersByUser } = require('../controller/order');

router.post('/', createOrder)
router.get('/', fetchOrdersByUser)
// router.delete('/:id', deleteCart)
// router.patch('/:id', updateCart)

module.exports = router


