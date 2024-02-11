const express = require('express');
const router = express.Router()
const { createOrder, fetchOrdersByUser } = require('../controller/order');
const authenticateToken = require('../middleware/jwt');

router.post('/', authenticateToken, createOrder)
router.get('/', authenticateToken, fetchOrdersByUser)
// router.delete('/:id', deleteCart)
// router.patch('/:id', updateCart)

module.exports = router


