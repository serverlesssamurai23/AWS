const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// @route   GET api/products
// @desc    Get all products (with optional filters: category, sortBy, order, limit, page)
// @access  Public
router.get('/', productController.getAllProducts);

// @route   GET api/products/:id
// @desc    Get a single product by ID
// @access  Public
router.get('/:id', productController.getProductById);

module.exports = router;
