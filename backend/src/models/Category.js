const db = require('../config/db');

const Category = {
  async findAll() {
    const queryText = 'SELECT id, name, slug, description, parent_id FROM ProductCategories ORDER BY name ASC';
    try {
      const { rows } = await db.query(queryText);
      return rows;
    } catch (err) {
      console.error('Error fetching all categories:', err);
      throw err;
    }
  },

  async findBySlug(slug) {
    const queryText = 'SELECT id, name, slug, description, parent_id FROM ProductCategories WHERE slug = $1';
    try {
      const { rows } = await db.query(queryText, [slug]);
      return rows[0];
    } catch (err) {
      console.error(`Error fetching category by slug ${slug}:`, err);
      throw err;
    }
  }
};

module.exports = Category;
