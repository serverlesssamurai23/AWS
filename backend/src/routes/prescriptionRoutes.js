const express = require('express');
const router = express.Router();
const prescriptionController = require('../controllers/prescriptionController');
const { protect } = require('../middleware/authMiddleware'); // Assuming this is where 'protect' is

// All routes in this file are protected and require authentication
router.use(protect);

// @route   POST api/prescriptions
// @desc    Create a new prescription for the logged-in user
// @access  Private
router.post('/', prescriptionController.createPrescription);

// @route   GET api/prescriptions
// @desc    Get all prescriptions for the logged-in user
// @access  Private
router.get('/', prescriptionController.getPrescriptions);

// @route   GET api/prescriptions/:id
// @desc    Get a specific prescription by ID for the logged-in user
// @access  Private
router.get('/:id', prescriptionController.getPrescriptionById);

// @route   PUT api/prescriptions/:id
// @desc    Update a specific prescription by ID for the logged-in user
// @access  Private
router.put('/:id', prescriptionController.updatePrescription);

// @route   DELETE api/prescriptions/:id
// @desc    Delete a specific prescription by ID for the logged-in user
// @access  Private
router.delete('/:id', prescriptionController.deletePrescription);

module.exports = router;
