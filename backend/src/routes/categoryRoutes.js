const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

// @route   GET api/categories
// @desc    Get all categories
// @access  Public
router.get('/', categoryController.getAllCategories);

// @route   GET api/categories/:slug
// @desc    Get a single category by slug
// @access  Public
router.get('/:slug', categoryController.getCategoryBySlug);

// @route   GET api/categories/:slug/products
// @desc    Get products for a specific category slug
// @access  Public
router.get('/:slug/products', categoryController.getProductsByCategorySlug);

module.exports = router;
