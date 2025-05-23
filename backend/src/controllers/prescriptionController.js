const Prescription = require('../models/Prescription');

// Basic validation for prescription data (can be significantly expanded)
const validatePrescriptionData = (data) => {
  if (!data.patientName || !data.prescriptionDate || !data.sphereRight || !data.sphereLeft || !data.prescriptionType) {
    return 'Missing required fields: patientName, prescriptionDate, sphereRight, sphereLeft, prescriptionType are mandatory.';
  }
  // Add more specific validations for sphere, cyl, axis formats, PD ranges, etc.
  return null;
};


exports.createPrescription = async (req, res) => {
  try {
    const userId = req.user.id; // From protect middleware
    const validationError = validatePrescriptionData(req.body);
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const prescription = await Prescription.create(userId, req.body);
    res.status(201).json(prescription);
  } catch (error) {
    console.error('Create prescription error:', error);
    res.status(500).json({ message: 'Server error while creating prescription.' });
  }
};

exports.getPrescriptions = async (req, res) => {
  try {
    const userId = req.user.id;
    const prescriptions = await Prescription.findByUserId(userId);
    res.json(prescriptions);
  } catch (error) {
    console.error('Get prescriptions error:', error);
    res.status(500).json({ message: 'Server error while fetching prescriptions.' });
  }
};

exports.getPrescriptionById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const prescription = await Prescription.findByIdAndUserId(id, userId);
    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found or not owned by user.' });
    }
    res.json(prescription);
  } catch (error) {
    console.error('Get prescription by ID error:', error);
    res.status(500).json({ message: 'Server error while fetching prescription.' });
  }
};

exports.updatePrescription = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    
    // Optional: Validate data before sending to model
    // const validationError = validatePrescriptionData(req.body); 
    // if (validationError) {
    //   return res.status(400).json({ message: validationError });
    // }

    const updatedPrescription = await Prescription.update(id, userId, req.body);
    if (!updatedPrescription) {
      return res.status(404).json({ message: 'Prescription not found or not owned by user for update.' });
    }
    res.json(updatedPrescription);
  } catch (error) {
    console.error('Update prescription error:', error);
    res.status(500).json({ message: 'Server error while updating prescription.' });
  }
};

exports.deletePrescription = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const success = await Prescription.delete(id, userId);
    if (!success) {
      return res.status(404).json({ message: 'Prescription not found or not owned by user for deletion.' });
    }
    res.status(204).send(); // No content
  } catch (error) {
    console.error('Delete prescription error:', error);
    res.status(500).json({ message: 'Server error while deleting prescription.' });
  }
};
