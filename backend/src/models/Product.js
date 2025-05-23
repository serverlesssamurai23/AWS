const db = require('../config/db');

const Product = {
  async findAll({ category, sortBy = 'created_at', order = 'DESC', limit = 10, offset = 0 }) {
    let queryText = `
      SELECT p.id, p.name, p.description, p.price, p.sku, p.stock_quantity, p.main_image_url, c.name as category_name, c.slug as category_slug
      FROM Products p
      LEFT JOIN ProductCategories c ON p.category_id = c.id  -- Assuming you add category_id to Products
      WHERE p.is_active = TRUE
    `;
    const queryParams = [];

    if (category) {
      queryParams.push(category);
      queryText += ` AND c.slug = $${queryParams.length}`;
    }

    // Basic sorting - expand as needed
    const validSortColumns = ['created_at', 'price', 'name'];
    if (validSortColumns.includes(sortBy)) {
      queryText += ` ORDER BY p.${sortBy} ${order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC'}`;
    } else {
      queryText += ` ORDER BY p.created_at DESC`; // Default sort
    }

    queryParams.push(limit);
    queryText += ` LIMIT $${queryParams.length}`;
    queryParams.push(offset);
    queryText += ` OFFSET $${queryParams.length}`;

    try {
      const { rows } = await db.query(queryText, queryParams);
      // Also fetch total count for pagination
      let countQueryText = 'SELECT COUNT(*) FROM Products p WHERE p.is_active = TRUE';
      if (category) {
          countQueryText = `SELECT COUNT(*) FROM Products p LEFT JOIN ProductCategories c ON p.category_id = c.id WHERE p.is_active = TRUE AND c.slug = $1`;
          const { rows: countRows } = await db.query(countQueryText, [category]);
          return { products: rows, total: parseInt(countRows[0].count, 10) };
      } else {
          const { rows: countRows } = await db.query(countQueryText);
          return { products: rows, total: parseInt(countRows[0].count, 10) };
      }
    } catch (err) {
      console.error('Error fetching all products:', err);
      throw err;
    }
  },

  async findById(id) {
    const productQuery = `
      SELECT p.*, c.name as category_name, c.slug as category_slug 
      FROM Products p
      LEFT JOIN ProductCategories c ON p.category_id = c.id 
      WHERE p.id = $1 AND p.is_active = TRUE
    `;
    const variantsQuery = 'SELECT * FROM ProductVariants WHERE product_id = $1';
    try {
      const { rows: productRows } = await db.query(productQuery, [id]);
      if (productRows.length === 0) {
        return null;
      }
      const product = productRows[0];
      const { rows: variantRows } = await db.query(variantsQuery, [id]);
      product.variants = variantRows;
      return product;
    } catch (err) {
      console.error(`Error fetching product by ID ${id}:`, err);
      throw err;
    }
  }
};

module.exports = Product;
