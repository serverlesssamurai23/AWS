'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { UserPrescription, UserPrescriptionCreationData, createPrescription, updateMyPrescription } from '@/services/api'; // Adjust path

interface PrescriptionFormProps {
  initialData?: UserPrescription; // For editing
  onSave?: (prescription: UserPrescription) => void; // Optional callback after saving
}

// Initialize with default or empty values
const defaultFormData: UserPrescriptionCreationData = {
  prescription_name: '',
  prescription_type: 'eyeglass_single_vision', // Default type
  patient_name: '',
  prescriber_name: '',
  prescription_date: '', // YYYY-MM-DD
  expiry_date: '',       // YYYY-MM-DD
  pd_right: undefined,
  pd_left: undefined,
  pd_both: undefined,
  sphere_right: 0, // Default to 0 or handle as potentially empty string then convert
  cylinder_right: undefined,
  axis_right: undefined,
  add_right: undefined,
  prism_diopters_right: undefined,
  prism_base_direction_right: '',
  sphere_left: 0,
  cylinder_left: undefined,
  axis_left: undefined,
  add_left: undefined,
  prism_diopters_left: undefined,
  prism_base_direction_left: '',
  notes: '',
  uploaded_file_url: '', // This form won't handle file uploads directly, only URL
};


const PrescriptionForm: React.FC<PrescriptionFormProps> = ({ initialData, onSave }) => {
  const router = useRouter();
  const [formData, setFormData] = useState<UserPrescriptionCreationData>(defaultFormData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      // Convert numeric fields that might be null/undefined to empty strings for input compatibility if needed,
      // or handle their type correctly. For controlled components, ensure types match.
      // Date needs to be in YYYY-MM-DD for <input type="date">
      setFormData({
        prescription_name: initialData.prescription_name || '',
        prescription_type: initialData.prescription_type,
        patient_name: initialData.patient_name,
        prescriber_name: initialData.prescriber_name || '',
        prescription_date: initialData.prescription_date ? new Date(initialData.prescription_date).toISOString().split('T')[0] : '',
        expiry_date: initialData.expiry_date ? new Date(initialData.expiry_date).toISOString().split('T')[0] : '',
        pd_right: initialData.pd_right ?? undefined,
        pd_left: initialData.pd_left ?? undefined,
        pd_both: initialData.pd_both ?? undefined,
        sphere_right: initialData.sphere_right,
        cylinder_right: initialData.cylinder_right ?? undefined,
        axis_right: initialData.axis_right ?? undefined,
        add_right: initialData.add_right ?? undefined,
        prism_diopters_right: initialData.prism_diopters_right ?? undefined,
        prism_base_direction_right: initialData.prism_base_direction_right || '',
        sphere_left: initialData.sphere_left,
        cylinder_left: initialData.cylinder_left ?? undefined,
        axis_left: initialData.axis_left ?? undefined,
        add_left: initialData.add_left ?? undefined,
        prism_diopters_left: initialData.prism_diopters_left ?? undefined,
        prism_base_direction_left: initialData.prism_base_direction_left || '',
        notes: initialData.notes || '',
        uploaded_file_url: initialData.uploaded_file_url || '',
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    let parsedValue: string | number | undefined = value;

    if (type === 'number') {
        // Allow empty string for optional numbers, otherwise parse
        parsedValue = value === '' ? undefined : parseFloat(value);
    }
    
    setFormData(prev => ({ ...prev, [name]: parsedValue }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Basic Validation
    if (!formData.patient_name || !formData.prescription_date || formData.sphere_right === undefined || formData.sphere_left === undefined) {
      setError('Patient Name, Prescription Date, and Sphere values for both eyes are required.');
      setIsLoading(false);
      return;
    }
    
    // Ensure numeric fields that are optional but empty are sent as undefined, not NaN or empty string if API expects numbers
    const dataToSubmit = { ...formData };
    for (const key in dataToSubmit) {
        if (typeof (dataToSubmit as any)[key] === 'number' && isNaN((dataToSubmit as any)[key])) {
            (dataToSubmit as any)[key] = undefined;
        }
    }


    try {
      let savedPrescription: UserPrescription;
      if (initialData?.id) {
        savedPrescription = await updateMyPrescription(initialData.id, dataToSubmit);
      } else {
        savedPrescription = await createPrescription(dataToSubmit);
      }
      if (onSave) {
        onSave(savedPrescription);
      } else {
        router.push('/account/prescriptions'); // Default redirect
      }
    } catch (err: any) {
      setError(err.message || 'Failed to save prescription.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Helper for number input fields
  const numberInputProps = (name: keyof UserPrescriptionCreationData, step: string = "0.25") => ({
    type: "number",
    name: name,
    id: name,
    value: formData[name] === undefined ? '' : String(formData[name]), // Handle undefined for empty input
    onChange: handleChange,
    step: step,
    className: "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
  });


  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
      {error && <div className="p-3 bg-red-100 text-red-700 rounded">{error}</div>}

      <div>
        <label htmlFor="prescription_name" className="block text-sm font-medium text-gray-700">Prescription Name (e.g., My Reading Glasses)</label>
        <input type="text" name="prescription_name" id="prescription_name" value={formData.prescription_name} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="patient_name" className="block text-sm font-medium text-gray-700">Patient Name*</label>
          <input type="text" name="patient_name" id="patient_name" value={formData.patient_name} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
        </div>
        <div>
          <label htmlFor="prescription_type" className="block text-sm font-medium text-gray-700">Prescription Type*</label>
          <select name="prescription_type" id="prescription_type" value={formData.prescription_type} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
            <option value="eyeglass_single_vision">Eyeglass - Single Vision</option>
            <option value="eyeglass_progressive">Eyeglass - Progressive</option>
            <option value="eyeglass_bifocal">Eyeglass - Bifocal</option>
            <option value="eyeglass_reading">Eyeglass - Reading</option>
            {/* Add contact lens types if supported by this form/table structure */}
          </select>
        </div>
        <div>
          <label htmlFor="prescription_date" className="block text-sm font-medium text-gray-700">Prescription Date*</label>
          <input type="date" name="prescription_date" id="prescription_date" value={formData.prescription_date} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
        </div>
        <div>
          <label htmlFor="expiry_date" className="block text-sm font-medium text-gray-700">Expiry Date</label>
          <input type="date" name="expiry_date" id="expiry_date" value={formData.expiry_date} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
        </div>
         <div>
          <label htmlFor="prescriber_name" className="block text-sm font-medium text-gray-700">Prescriber Name/Clinic</label>
          <input type="text" name="prescriber_name" id="prescriber_name" value={formData.prescriber_name} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
        </div>
      </div>
      
      <fieldset className="mt-6 border p-4 rounded-md">
        <legend className="text-lg font-medium text-gray-900 px-2">Optical Values</legend>
        {/* Right Eye */}
        <div className="mt-4">
          <h4 className="text-md font-semibold text-gray-700 mb-2">Right Eye (OD)</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div><label htmlFor="sphere_right" className="block text-xs font-medium text-gray-600">Sphere (SPH)*</label><input {...numberInputProps('sphere_right')} required /></div>
            <div><label htmlFor="cylinder_right" className="block text-xs font-medium text-gray-600">Cylinder (CYL)</label><input {...numberInputProps('cylinder_right')} /></div>
            <div><label htmlFor="axis_right" className="block text-xs font-medium text-gray-600">Axis</label><input {...numberInputProps('axis_right', "1")} /></div>
            <div><label htmlFor="add_right" className="block text-xs font-medium text-gray-600">Add</label><input {...numberInputProps('add_right')} /></div>
          </div>
        </div>
        {/* Left Eye */}
        <div className="mt-6">
          <h4 className="text-md font-semibold text-gray-700 mb-2">Left Eye (OS)</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div><label htmlFor="sphere_left" className="block text-xs font-medium text-gray-600">Sphere (SPH)*</label><input {...numberInputProps('sphere_left')} required /></div>
            <div><label htmlFor="cylinder_left" className="block text-xs font-medium text-gray-600">Cylinder (CYL)</label><input {...numberInputProps('cylinder_left')} /></div>
            <div><label htmlFor="axis_left" className="block text-xs font-medium text-gray-600">Axis</label><input {...numberInputProps('axis_left', "1")} /></div>
            <div><label htmlFor="add_left" className="block text-xs font-medium text-gray-600">Add</label><input {...numberInputProps('add_left')} /></div>
          </div>
        </div>
        {/* PD Values */}
        <div className="mt-6">
          <h4 className="text-md font-semibold text-gray-700 mb-2">Pupillary Distance (PD)</h4>
           <p className="text-xs text-gray-500 mb-2">Enter PD for both eyes OR for Right and Left individually.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div><label htmlFor="pd_both" className="block text-xs font-medium text-gray-600">PD (Both Eyes)</label><input {...numberInputProps('pd_both', "0.5")} /></div>
            <div><label htmlFor="pd_right" className="block text-xs font-medium text-gray-600">PD (Right Eye)</label><input {...numberInputProps('pd_right', "0.5")} /></div>
            <div><label htmlFor="pd_left" className="block text-xs font-medium text-gray-600">PD (Left Eye)</label><input {...numberInputProps('pd_left', "0.5")} /></div>
          </div>
        </div>
        {/* Prism Values (Optional) - Could be hidden by default */}
         <details className="mt-4 text-sm">
            <summary className="cursor-pointer text-gray-600 font-medium">Prism Values (Optional)</summary>
            <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 border p-3 rounded">
                <div>
                    <h5 className="text-xs font-semibold text-gray-700 mb-1">Right Eye Prism</h5>
                    <label htmlFor="prism_diopters_right" className="block text-xs font-medium text-gray-600">Diopters</label>
                    <input {...numberInputProps('prism_diopters_right', "0.01")} />
                    <label htmlFor="prism_base_direction_right" className="block text-xs font-medium text-gray-600 mt-2">Base Direction</label>
                    <input type="text" name="prism_base_direction_right" id="prism_base_direction_right" value={formData.prism_base_direction_right} onChange={handleChange} className="mt-1 block w-full px-3 py-1 border border-gray-300 rounded-md shadow-sm sm:text-xs" />
                </div>
                 <div>
                    <h5 className="text-xs font-semibold text-gray-700 mb-1">Left Eye Prism</h5>
                    <label htmlFor="prism_diopters_left" className="block text-xs font-medium text-gray-600">Diopters</label>
                    <input {...numberInputProps('prism_diopters_left', "0.01")} />
                    <label htmlFor="prism_base_direction_left" className="block text-xs font-medium text-gray-600 mt-2">Base Direction</label>
                    <input type="text" name="prism_base_direction_left" id="prism_base_direction_left" value={formData.prism_base_direction_left} onChange={handleChange} className="mt-1 block w-full px-3 py-1 border border-gray-300 rounded-md shadow-sm sm:text-xs" />
                </div>
            </div>
        </details>
      </fieldset>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Notes / Optometrist Instructions</label>
        <textarea name="notes" id="notes" rows={3} value={formData.notes} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea>
      </div>
      
      {/* Placeholder for file upload URL - actual upload would be a separate process */}
      <div>
        <label htmlFor="uploaded_file_url" className="block text-sm font-medium text-gray-700">Uploaded Prescription File URL (if any)</label>
        <input type="url" name="uploaded_file_url" id="uploaded_file_url" value={formData.uploaded_file_url} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="https://example.com/path/to/your/rx.pdf"/>
        <p className="text-xs text-gray-500 mt-1">Note: This form does not handle file uploads. If you upload a file elsewhere, you can paste the link here.</p>
      </div>

      <div className="flex justify-end space-x-3">
        <button type="button" onClick={() => router.back()} className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Cancel
        </button>
        <button type="submit" disabled={isLoading} className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50">
          {isLoading ? (initialData ? 'Saving...' : 'Adding...') : (initialData ? 'Save Changes' : 'Add Prescription')}
        </button>
      </div>
    </form>
  );
};

export default PrescriptionForm;
