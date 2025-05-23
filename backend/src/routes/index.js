const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const productRoutes = require('./productRoutes');
const categoryRoutes = require('./categoryRoutes');
const prescriptionRoutes = require('./prescriptionRoutes'); // Add this

router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);
router.use('/prescriptions', prescriptionRoutes); // Add this (mount under /api/prescriptions)


router.get('/', (req, res) => {
  res.json({ message: 'Welcome to OptiCart API - Now with Prescriptions!' });
});

module.exports = router;
