const db = require('../config/db');

// Helper to convert object keys from camelCase to snake_case for DB insertion
const camelToSnakeCase = str => str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);

const Prescription = {
  async create(userId, prescriptionData) {
    const fields = Object.keys(prescriptionData);
    const snakeCaseFields = fields.map(camelToSnakeCase);
    const valuePlaceholders = fields.map((_, index) => `$${index + 2}`).join(', '); // $1 will be user_id

    const queryText = `
      INSERT INTO UserPrescriptions (user_id, ${snakeCaseFields.join(', ')})
      VALUES ($1, ${valuePlaceholders})
      RETURNING *; 
    `;
    // Ensure order of values matches fields
    const values = [userId, ...fields.map(field => prescriptionData[field])];

    try {
      const { rows } = await db.query(queryText, values);
      return rows[0]; // Return the created prescription
    } catch (err) {
      console.error('Error creating prescription:', err);
      throw err;
    }
  },

  async findByUserId(userId) {
    const queryText = 'SELECT * FROM UserPrescriptions WHERE user_id = $1 ORDER BY created_at DESC';
    try {
      const { rows } = await db.query(queryText, [userId]);
      return rows;
    } catch (err) {
      console.error('Error fetching prescriptions by user ID:', err);
      throw err;
    }
  },

  async findByIdAndUserId(id, userId) {
    const queryText = 'SELECT * FROM UserPrescriptions WHERE id = $1 AND user_id = $2';
    try {
      const { rows } = await db.query(queryText, [id, userId]);
      return rows[0];
    } catch (err) {
      console.error('Error fetching prescription by ID and user ID:', err);
      throw err;
    }
  },

  async update(id, userId, prescriptionData) {
    const fields = Object.keys(prescriptionData);
    if (fields.length === 0) {
      return this.findByIdAndUserId(id, userId); // No fields to update, return current
    }
    const snakeCaseFields = fields.map(camelToSnakeCase);
    const setClauses = snakeCaseFields.map((field, index) => `${field} = $${index + 3}`).join(', '); // $1=id, $2=userId

    const queryText = `
      UPDATE UserPrescriptions
      SET ${setClauses}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1 AND user_id = $2
      RETURNING *;
    `;
    const values = [id, userId, ...fields.map(field => prescriptionData[field])];

    try {
      const { rows } = await db.query(queryText, values);
      return rows[0];
    } catch (err) {
      console.error('Error updating prescription:', err);
      throw err;
    }
  },

  async delete(id, userId) {
    const queryText = 'DELETE FROM UserPrescriptions WHERE id = $1 AND user_id = $2 RETURNING id';
    try {
      const { rows } = await db.query(queryText, [id, userId]);
      return rows.length > 0; // Return true if deletion was successful
    } catch (err) {
      console.error('Error deleting prescription:', err);
      throw err;
    }
  }
};

module.exports = Prescription;
