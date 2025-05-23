const Product = require('../models/Product');

exports.getAllProducts = async (req, res) => {
  try {
    const { category, sortBy, order, limit = 10, page = 1 } = req.query;
    const offset = (parseInt(page, 10) - 1) * parseInt(limit, 10);

    const { products, total } = await Product.findAll({ 
      category, 
      sortBy, 
      order, 
      limit: parseInt(limit, 10), 
      offset 
    });
    
    res.json({
      data: products,
      pagination: {
        totalItems: total,
        totalPages: Math.ceil(total / limit),
        currentPage: parseInt(page, 10),
        pageSize: parseInt(limit, 10)
      }
    });
  } catch (error) {
    console.error('Get all products error:', error);
    res.status(500).json({ message: 'Server error while fetching products.' });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }
    res.json(product);
  } catch (error) {
    console.error(`Get product by ID ${req.params.id} error:`, error);
    res.status(500).json({ message: 'Server error while fetching product.' });
  }
};
