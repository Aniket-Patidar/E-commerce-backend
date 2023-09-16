const express = require('express');
const router = express.Router()
const { fetchAllProducts, createProduct, fetchProductById, updateProduct, deletedProduct } = require('../controller/products')


router.post('/', createProduct)
    .get('/', fetchAllProducts)
    .get('/:id', fetchProductById)
    .patch('/:id', updateProduct)
    .delete('/:id', deletedProduct)
module.exports = router


