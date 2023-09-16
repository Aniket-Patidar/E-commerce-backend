const express = require('express');
const router = express.Router()
const { addTOCart, fetchCartByUser, deleteCart, updateCart, deleteAllCart } = require('../controller/cart');

router.post('/', addTOCart)
router.get('/', fetchCartByUser)
router.delete('/:id', deleteCart)
router.delete('/all/:id', deleteAllCart)
router.patch('/:id', updateCart)


module.exports = router


