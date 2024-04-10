const express = require('express');
const router = express.Router()
const { getALLOderTOAdmin, updateOrder, CreateBrand, createProduct, updateProduct, deletedProduct, deleteCategory, deleteBrand, getAllUsers, createCategory } = require('../controller/admin')
    






    /* brand */
router.post('/crate-brand', CreateBrand)
router.delete('/delete-brand/:id', deleteBrand)


/* category */
router.post('/crate-category', createCategory)
router.delete('/delete-category/:id', deleteCategory)


/* product */
router.post('/create-product', createProduct)
router.patch('/update-product/:id', updateProduct)
router.delete('/delete-product/:id', deletedProduct)


/* order */
router.get('/all-orders/', getALLOderTOAdmin)
router.patch('/update-order/:id', updateOrder)


/* all users */
router.get('/users', getAllUsers)


module.exports = router


