const Category = require('../models/Category');
const Product = require('../models/Product'); // To fetch products by category

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.json(categories);
  } catch (error) {
    console.error('Get all categories error:', error);
    res.status(500).json({ message: 'Server error while fetching categories.' });
  }
};

exports.getCategoryBySlug = async (req, res) => {
  try {
    const category = await Category.findBySlug(req.params.slug);
    if (!category) {
      return res.status(404).json({ message: 'Category not found.' });
    }
    res.json(category);
  } catch (error) {
    console.error(`Get category by slug ${req.params.slug} error:`, error);
    res.status(500).json({ message: 'Server error while fetching category.' });
  }
};

exports.getProductsByCategorySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const { sortBy, order, limit = 10, page = 1 } = req.query;
    const offset = (parseInt(page, 10) - 1) * parseInt(limit, 10);

    const category = await Category.findBySlug(slug);
    if (!category) {
      return res.status(404).json({ message: 'Category not found.' });
    }

    const { products, total } = await Product.findAll({ 
      category: slug, // Pass slug to findAll
      sortBy, 
      order, 
      limit: parseInt(limit, 10), 
      offset 
    });
    
    res.json({
      category, // Send category details along with products
      data: products,
      pagination: {
        totalItems: total,
        totalPages: Math.ceil(total / limit),
        currentPage: parseInt(page, 10),
        pageSize: parseInt(limit, 10)
      }
    });
  } catch (error) {
    console.error(`Get products by category slug ${req.params.slug} error:`, error);
    res.status(500).json({ message: 'Server error while fetching products for category.' });
  }
};
