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
---

## 6. User Profile Management Endpoints (Conceptual)

These endpoints allow authenticated users to manage their profile information. They build upon the existing authentication setup. Assumes `protect` middleware is used.

**A. `backend/src/controllers/userController.js` (New File or merged with `authController.js`)**

```javascript
// const User = require('../models/User'); // Assuming User model has methods to update profile
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken'); // If email change requires re-issuing token or re-verification

// exports.getMyProfile = async (req, res) => {
//   try {
//     // req.user.id is available from 'protect' middleware
//     const user = await User.findById(req.user.id).select('-password_hash'); // Exclude password hash
//     if (!user) {
//       return res.status(404).json({ message: 'User not found.' });
//     }
//     res.json(user);
//   } catch (error) {
//     console.error('Get profile error:', error);
//     res.status(500).json({ message: 'Server error while fetching profile.' });
//   }
// };

// exports.updateMyProfile = async (req, res) => {
//   try {
//     const { firstName, lastName, email } = req.body;
//     const userId = req.user.id;

//     // Basic validation
//     if (!firstName || !lastName || !email) {
//       return res.status(400).json({ message: 'First name, last name, and email are required.' });
//     }
//     if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
//        return res.status(400).json({ message: 'Invalid email format.' });
//     }

//     // Check if email is being changed and if it's already taken by another user
//     const currentUser = await User.findById(userId);
//     if (email !== currentUser.email) {
//       const existingUserWithNewEmail = await User.findByEmail(email);
//       if (existingUserWithNewEmail) {
//         return res.status(400).json({ message: 'This email is already in use by another account.' });
//       }
//     }
    
//     const updatedUser = await User.updateProfile(userId, { firstName, lastName, email }); // Implement User.updateProfile
//     // Exclude password hash from response
//     const userResponse = { ...updatedUser.toObject() }; // Assuming Mongoose or similar ORM
//     delete userResponse.password_hash;

//     // If email was changed, potentially re-issue token or require email verification
//     res.json({ message: 'Profile updated successfully.', user: userResponse });
//   } catch (error) {
//     console.error('Update profile error:', error);
//     res.status(500).json({ message: 'Server error while updating profile.' });
//   }
// };

// exports.changeMyPassword = async (req, res) => {
//   try {
//     const { currentPassword, newPassword, confirmNewPassword } = req.body;
//     const userId = req.user.id;

//     if (!currentPassword || !newPassword || !confirmNewPassword) {
//       return res.status(400).json({ message: 'All password fields are required.' });
//     }
//     if (newPassword !== confirmNewPassword) {
//       return res.status(400).json({ message: 'New passwords do not match.' });
//     }
//     if (newPassword.length < 6) { // Consistent with registration
//       return res.status(400).json({ message: 'New password must be at least 6 characters long.' });
//     }

//     const user = await User.findById(userId); // Fetches full user doc including password_hash
//     if (!user) {
//       return res.status(404).json({ message: 'User not found.' });
//     }

//     const isMatch = await User.comparePassword(currentPassword, user.password_hash);
//     if (!isMatch) {
//       return res.status(401).json({ message: 'Incorrect current password.' });
//     }

//     // Hash new password and save
//     const salt = await bcrypt.genSalt(10);
//     const newPasswordHash = await bcrypt.hash(newPassword, salt);
//     await User.updatePassword(userId, newPasswordHash); // Implement User.updatePassword

//     res.json({ message: 'Password changed successfully.' });
//   } catch (error) {
//     console.error('Change password error:', error);
//     res.status(500).json({ message: 'Server error while changing password.' });
//   }
// };
```
**Note:** The above controller code is conceptual and commented out as it requires `User` model methods like `findById`, `updateProfile`, `updatePassword` which are not fully defined in `User.js` yet. This provides the API structure.

**B. `backend/src/routes/userRoutes.js` (New File)**
```javascript
// const express = require('express');
// const router = express.Router();
// const userController = require('../controllers/userController'); // Assuming userController.js created
// const { protect } = require('../middleware/authMiddleware');

// // All routes protected
// router.use(protect);

// // @route   GET api/users/me/profile
// // @desc    Get current user's profile
// // @access  Private
// router.get('/me/profile', userController.getMyProfile);

// // @route   PUT api/users/me/profile
// // @desc    Update current user's profile (name, email)
// // @access  Private
// router.put('/me/profile', userController.updateMyProfile);

// // @route   PUT api/users/me/profile/password
// // @desc    Change current user's password
// // @access  Private
// router.put('/me/profile/password', userController.changeMyPassword);

// module.exports = router;
```

**C. Update `backend/src/routes/index.js`**
   Add the new `userRoutes` to the main API router.
```diff
// ... other imports
// const userRoutes = require('./userRoutes'); // Add this

// ... other router.use() calls
// router.use('/users', userRoutes); // Add this, e.g., paths like /api/users/me/profile
```
The above backend definitions are conceptual and marked as comments to indicate they are for documentation within the guide at this stage.

---
---

## 7. User Address Management Endpoints (Conceptual)

These endpoints allow authenticated users to manage their saved shipping/billing addresses.

**A. Database Schema (Conceptual - New Table: `UserAddresses`)**
   (This would typically be in `DatabaseSchema.md`, but for context here)
```sql
-- CREATE TABLE UserAddresses (
--   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--   user_id UUID NOT NULL REFERENCES Users(id) ON DELETE CASCADE,
--   address_type VARCHAR(50) NOT NULL, -- 'shipping' or 'billing'
--   full_name VARCHAR(255) NOT NULL,
--   address_line1 VARCHAR(255) NOT NULL,
--   address_line2 VARCHAR(255),
--   city VARCHAR(100) NOT NULL,
--   state VARCHAR(100) NOT NULL,
--   zip_code VARCHAR(20) NOT NULL,
--   country VARCHAR(100) NOT NULL,
--   phone_number VARCHAR(50),
--   is_default_shipping BOOLEAN DEFAULT FALSE,
--   is_default_billing BOOLEAN DEFAULT FALSE,
--   created_at TIMESTAMPZ DEFAULT CURRENT_TIMESTAMP,
--   updated_at TIMESTAMPZ DEFAULT CURRENT_TIMESTAMP
-- );
-- CREATE INDEX idx_user_addresses_user_id ON UserAddresses(user_id);
```

**B. `backend/src/controllers/addressController.js` (New File - Conceptual)**
```javascript
// const UserAddress = require('../models/UserAddress'); // Assuming a model for UserAddresses table

// exports.getAddresses = async (req, res) => { /* ...fetch all addresses for req.user.id ... */ };
// exports.addAddress = async (req, res) => { /* ...add new address for req.user.id, validate req.body ... */ };
// exports.updateAddress = async (req, res) => { /* ...update address where id = req.params.id and user_id = req.user.id ... */ };
// exports.deleteAddress = async (req, res) => { /* ...delete address where id = req.params.id and user_id = req.user.id ... */ };
// exports.setDefaultAddress = async (req, res) => { 
//   /* ...set is_default_shipping/billing = true for req.params.id 
//      and ensure other addresses for that user and type are set to false ... */ 
// };
```

**C. `backend/src/routes/addressRoutes.js` (New File - Conceptual)**
```javascript
// const express = require('express');
// const router = express.Router();
// const addressController = require('../controllers/addressController');
// const { protect } = require('../middleware/authMiddleware');

// router.use(protect);

// router.get('/', addressController.getAddresses);
// router.post('/', addressController.addAddress);
// router.put('/:id', addressController.updateAddress);
// router.delete('/:id', addressController.deleteAddress);
// router.put('/:id/default', addressController.setDefaultAddress); // e.g., ?type=shipping or in body

// module.exports = router;
```

**D. Update `backend/src/routes/index.js` (Conceptual)**
   Add the new `addressRoutes` to the main API router.
```diff
// ... other imports
// const addressRoutes = require('./addressRoutes'); // Add this

// ... other router.use() calls
// router.use('/addresses', addressRoutes); // Add this, e.g., paths like /api/addresses
```
The above backend definitions are conceptual and marked as comments to indicate they are for documentation within the guide at this stage.

---
---

## 8. Educational Content APIs (Conceptual)

Endpoints for fetching educational articles.

**A. `backend/src/controllers/educationController.js` (New File - Conceptual)**
```javascript
// const EducationalArticle = require('../models/EducationalArticle'); // Assuming a model
// const EducationalArticleCategory = require('../models/EducationalArticleCategory');

// exports.getArticles = async (req, res) => { /* Fetch all articles, paginated, filter by category? */ };
// exports.getArticleBySlug = async (req, res) => { /* Fetch single article by slug */ };
// exports.getArticleCategories = async (req, res) => { /* Fetch all article categories */ };
```

**B. `backend/src/routes/educationRoutes.js` (New File - Conceptual)**
```javascript
// const express = require('express');
// const router = express.Router();
// const educationController = require('../controllers/educationController');

// router.get('/articles', educationController.getArticles);
// router.get('/articles/:slug', educationController.getArticleBySlug);
// router.get('/categories', educationController.getArticleCategories);
// router.get('/categories/:categorySlug/articles', educationController.getArticles); // Filter by category

// module.exports = router;
```

**C. Update `backend/src/routes/index.js` (Conceptual)**
```diff
// ... other imports
// const educationRoutes = require('./educationRoutes'); // Add this

// ... other router.use() calls
// router.use('/education', educationRoutes); // Add this, e.g., /api/education/articles
```
The above backend definitions are conceptual and marked as comments.

---
---

## 9. Admin Panel APIs (Conceptual)

Endpoints for administrators to manage core site data like products, categories, and orders. These require robust authentication and authorization (e.g., checking for an 'admin' role on the user).

**A. Admin Authentication/Authorization (Conceptual)**
*   Admin users might be a separate user type or have a specific role (e.g., `role: 'admin'` in the `Users` table).
*   A separate login route for admins (`/api/admin/login`) might be used, or the main login could issue tokens with role information.
*   A middleware `isAdmin` would protect admin routes, checking `req.user.role === 'admin'`.

**B. `backend/src/controllers/adminProductController.js` (New File - Conceptual)**
```javascript
// const Product = require('../models/Product'); // From main site
// // const ProductVariant = require('../models/ProductVariant'); // If variants are handled separately

// exports.createProduct = async (req, res) => { /* ...logic to create a new product and its variants. Validate req.body ... */ };
// exports.updateProduct = async (req, res) => { /* ...logic to update product req.params.id and its variants ... */ };
// exports.deleteProduct = async (req, res) => { /* ...logic to delete product req.params.id (soft or hard delete) ... */ };
// // exports.getProducts = async (req, res) => { /* ...admin version of getProducts, may show inactive products ... */ };
```

**C. `backend/src/controllers/adminCategoryController.js` (New File - Conceptual)**
```javascript
// const ProductCategory = require('../models/Category'); // From main site

// exports.createCategory = async (req, res) => { /* ...logic to create a new category. Validate req.body (name, slug, description) ... */ };
// exports.updateCategory = async (req, res) => { /* ...logic to update category req.params.id ... */ };
// exports.deleteCategory = async (req, res) => { /* ...logic to delete category req.params.id. Consider impact on products. ... */ };
// // exports.getCategories = async (req, res) => { /* ...admin version of getCategories ... */ };
```

**D. `backend/src/routes/adminRoutes.js` (New File - Conceptual)**
```javascript
// const express = require('express');
// const router = express.Router();
// const adminProductController = require('../controllers/adminProductController');
// const adminCategoryController = require('../controllers/adminCategoryController');
// const { protect, isAdmin } = require('../middleware/authMiddleware'); // Assuming isAdmin middleware

// router.use(protect, isAdmin); // Protect all admin routes

// // Product Management
// router.post('/products', adminProductController.createProduct);
// router.put('/products/:id', adminProductController.updateProduct);
// router.delete('/products/:id', adminProductController.deleteProduct);
// // router.get('/products', adminProductController.getProducts); // Admin list view

// // Category Management
// router.post('/categories', adminCategoryController.createCategory);
// router.put('/categories/:id', adminCategoryController.updateCategory);
// router.delete('/categories/:id', adminCategoryController.deleteCategory);
// // router.get('/categories', adminCategoryController.getCategories); // Admin list view

// module.exports = router;
```

**E. Update `backend/src/routes/index.js` (Conceptual)**
   Add the new `adminRoutes` to the main API router, likely prefixed.
```diff
// ... other imports
// const adminRoutes = require('./adminRoutes'); // Add this

// ... other router.use() calls
// router.use('/admin', adminRoutes); // Add this, e.g., /api/admin/products
```
The above backend definitions are conceptual and marked as comments.

---
