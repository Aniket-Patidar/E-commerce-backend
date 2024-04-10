const express = require('express');
const router = express.Router()
const { fetchAllProducts, fetchProductById } = require('../controller/products');
const authenticateToken = require('../middleware/jwt');


router.get('/', fetchAllProducts)
router.get('/:id', fetchProductById)

module.exports = router


