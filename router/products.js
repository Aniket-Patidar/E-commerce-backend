const express = require('express');
const router = express.Router()
const { fetchAllProducts, createProduct, fetchProductById, updateProduct, deletedProduct } = require('../controller/products');
const authenticateToken = require('../middleware/jwt');


router.post('/', authenticateToken, createProduct)
    .get('/', fetchAllProducts)
    .get('/:id', fetchProductById)
    .patch('/:id', authenticateToken, updateProduct)
    .delete('/:id', authenticateToken, deletedProduct)
module.exports = router


