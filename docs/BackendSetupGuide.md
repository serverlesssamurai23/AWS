# Backend Setup Guide (Node.js with Express.js & PostgreSQL)

This guide outlines the steps to set up the backend project for OptiCart.

## 1. Initialize Project & Install Dependencies

Navigate to the `backend` directory in your terminal and run the following commands:

```bash
# Initialize a new Node.js project
npm init -y

# Install core dependencies
npm install express pg dotenv bcryptjs jsonwebtoken cors

# Install development dependencies
npm install -D nodemon
```

**Dependency Overview:**
*   `express`: Web framework for Node.js.
*   `pg`: PostgreSQL client for Node.js.
*   `dotenv`: Loads environment variables from a `.env` file.
*   `bcryptjs`: Library for hashing passwords.
*   `jsonwebtoken`: For creating and verifying JSON Web Tokens (JWTs) for authentication.
*   `cors`: Middleware for enabling Cross-Origin Resource Sharing.
*   `nodemon` (dev): Utility that monitors for changes and automatically restarts the server.

## 2. Project Structure

Create the following directory structure within the `backend` folder:

```
backend/
├── src/
│   ├── config/             # Database configuration, environment variables
│   │   └── db.js           # Database connection setup
│   │   └── index.js        # Central export for config
│   ├── controllers/        # Request handlers (logic for routes)
│   │   └── authController.js # Example: User registration, login
│   ├── middleware/         # Custom middleware (e.g., auth, error handling)
│   │   └── authMiddleware.js # Example: JWT verification
│   ├── models/             # Database interaction logic (queries, ORM models if used)
│   │   └── User.js         # Example: User model functions
│   ├── routes/             # API route definitions
│   │   └── authRoutes.js   # Example: /api/auth/register, /api/auth/login
│   │   └── index.js        # Central router to combine all route modules
│   └── services/           # Business logic separated from controllers (optional)
├── .env                    # Environment variables (DB_USER, DB_PASS, JWT_SECRET, etc. - DO NOT COMMIT)
├── .gitignore              # Specify intentionally untracked files (e.g., node_modules, .env)
├── server.js               # Main application entry point
└── package.json
```

## 3. Create Core Files

**A. `.env` (Create this file in the `backend` root, and add to `.gitignore`)**

```env
# Server Configuration
PORT=5000

# Database Configuration (Example for PostgreSQL)
DB_USER=your_db_user
DB_HOST=localhost
DB_DATABASE=opticart_db
DB_PASSWORD=your_db_password
DB_PORT=5432

# JWT Configuration
JWT_SECRET=your_very_strong_jwt_secret_key
JWT_EXPIRES_IN=1h
```

**B. `backend/.gitignore`**

```
node_modules/
.env
```

**C. `backend/server.js` (Initial setup)**

```javascript
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mainRouter = require('./src/routes'); // Will be created later

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies

// API Routes
app.use('/api', mainRouter); // All routes will be prefixed with /api

// Basic error handling (can be expanded)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
```

**D. `backend/src/config/db.js` (PostgreSQL Connection Example using `pg` Pool)**

```javascript
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

pool.on('connect', () => {
  console.log('Connected to the PostgreSQL database!');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool, // Export pool if direct access is needed
};
```
**E. `backend/src/config/index.js`**
```javascript
const dbConfig = require('./db');

module.exports = {
    dbConfig
};
```

**F. `backend/src/routes/index.js` (Main Router)**
```javascript
const express = require('express');
const router = express.Router();

// Import other route modules here later
// const productRoutes = require('./productRoutes');
// router.use('/products', productRoutes);

const authRoutes = require('./authRoutes'); // To be created
router.use('/auth', authRoutes);


router.get('/', (req, res) => {
  res.json({ message: 'Welcome to OptiCart API' });
});

module.exports = router;
```

## 4. Update `package.json` `scripts`

Modify the `scripts` section in `backend/package.json`:

```json
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js",
  "test": "echo "Error: no test specified" && exit 1"
}
```

## Next Steps

With this basic structure, you can start developing specific models, controllers, and routes, beginning with user authentication (registration and login endpoints). Remember to create the actual database (`opticart_db` in the example) in your PostgreSQL instance.

---

## 5. Initial Authentication Endpoints (Example)

This section outlines the implementation of basic user registration and login endpoints.

**A. `backend/src/models/User.js` (Conceptual - actual queries will depend on your DB setup)**

```javascript
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
```

**B. `backend/src/controllers/authController.js`**

```javascript
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Basic input validation (can be expanded with a library like Joi)
const validateInput = (email, password) => {
  if (!email || !password || password.length < 6) {
    return 'Invalid input: Email is required and password must be at least 6 characters.';
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return 'Invalid input: Please provide a valid email address.';
  }
  return null; // No error
};

exports.register = async (req, res) => {
  try {
    const { email, password, firstName, lastName, phoneNumber } = req.body;

    const validationError = validateInput(email, password);
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email.' });
    }

    const newUser = await User.create(email, password, firstName, lastName, phoneNumber);
    // Don't send password_hash back
    const userResponse = { ...newUser };
    delete userResponse.password_hash;

    // Optionally, generate a JWT token upon registration
    const token = jwt.sign({ id: newUser.id, email: newUser.email }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    res.status(201).json({ 
      message: 'User registered successfully', 
      user: userResponse,
      token // Send token if auto-login after registration
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration.' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const validationError = validateInput(email, password);
    if (validationError) {
      // More generic message for login to avoid confirming if email exists or not
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' }); // Generic message
    }

    const isMatch = await User.comparePassword(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' }); // Generic message
    }

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
    
    // Don't send password_hash back
    const userResponse = { id: user.id, email: user.email, first_name: user.first_name, last_name: user.last_name };

    res.status(200).json({ 
      message: 'Login successful', 
      token, 
      user: userResponse 
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login.' });
  }
};
```

**C. `backend/src/routes/authRoutes.js`**

```javascript
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// @route   POST api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', authController.register);

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', authController.login);

module.exports = router;
```

**D. Update `backend/src/routes/index.js`**

Ensure `authRoutes` is correctly imported and used as shown in the `BackendSetupGuide.md` section 3.F. (It was already included in the template, this is just a reminder).

This provides a basic but functional starting point for user authentication. Further enhancements would include more robust validation, password complexity rules, email verification, password reset functionality, and refresh tokens.
