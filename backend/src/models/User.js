const db = require('../config/db'); // Assuming db.js exports a query function or pool
const bcrypt = require('bcryptjs');

const User = {
  async create(email, password, firstName, lastName, phoneNumber) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const queryText = 
      'INSERT INTO Users (email, password_hash, first_name, last_name, phone_number) VALUES ($1, $2, $3, $4, $5) RETURNING id, email, first_name, last_name, created_at';
    const values = [email, hashedPassword, firstName, lastName, phoneNumber];
    
    try {
      const { rows } = await db.query(queryText, values);
      return rows[0];
    } catch (err) {
      console.error('Error creating user:', err);
      throw err; // Or handle more gracefully
    }
  },

  async findByEmail(email) {
    const queryText = 'SELECT * FROM Users WHERE email = $1';
    try {
      const { rows } = await db.query(queryText, [email]);
      return rows[0];
    } catch (err) {
      console.error('Error finding user by email:', err);
      throw err;
    }
  },

  async comparePassword(candidatePassword, hashedPassword) {
    return bcrypt.compare(candidatePassword, hashedPassword);
  }
};

module.exports = User;
