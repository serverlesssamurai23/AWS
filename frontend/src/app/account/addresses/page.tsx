'use client';
import React, { useState, useEffect, FormEvent } from 'react';
// Assuming ShippingAddress can be reused or a similar interface for saved addresses
import { ShippingAddress } from '../../checkout/shipping/page'; // Adjust path if needed

interface SavedAddress extends ShippingAddress {
  id: string; // Unique ID for the saved address
  addressType?: 'shipping' | 'billing' | 'both'; // Optional type
  isDefaultShipping?: boolean;
  isDefaultBilling?: boolean;
}

// Mock initial saved addresses
const initialMockAddresses: SavedAddress[] = [
  {
    id: 'addr1',
    fullName: 'John Doe',
    addressLine1: '123 Main St',
    addressLine2: 'Apt 4B',
    city: 'Anytown',
    state: 'CA',
    zipCode: '90210',
    country: 'USA',
    phoneNumber: '555-1234',
    email: 'john.doe@example.com', // Usually not part of address, but can be for contact
    isDefaultShipping: true,
    isDefaultBilling: true,
    addressType: 'both',
  },
  {
    id: 'addr2',
    fullName: 'John Doe Work',
    addressLine1: '456 Business Rd',
    city: 'Workville',
    state: 'CA',
    zipCode: '90211',
    country: 'USA',
    phoneNumber: '555-5678',
    email: 'john.doe.work@example.com',
    isDefaultShipping: false,
    isDefaultBilling: false,
    addressType: 'shipping',
  },
];

const emptyAddressForm: Omit<SavedAddress, 'id'> = {
  fullName: '', addressLine1: '', addressLine2: '', city: '', state: '', zipCode: '', country: 'USA', phoneNumber: '', email: '',
  isDefaultShipping: false, isDefaultBilling: false, addressType: 'shipping',
};

const SavedAddressesPage = () => {
  const [addresses, setAddresses] = useState<SavedAddress[]>(initialMockAddresses);
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<SavedAddress | null>(null);
  const [formData, setFormData] = useState<Omit<SavedAddress, 'id'>>(emptyAddressForm);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof SavedAddress, string>>>({});


  useEffect(() => {
    if (editingAddress) {
      setFormData({ ...editingAddress }); // Pre-fill form if editing
      setShowForm(true);
    } else {
      setFormData(emptyAddressForm); // Reset to empty if not editing
    }
  }, [editingAddress]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked; // For checkboxes
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (formErrors[name as keyof SavedAddress]) {
      setFormErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };
  
  const validateAddressForm = (): boolean => {
    const newErrors: Partial<Record<keyof SavedAddress, string>> = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required.';
    if (!formData.addressLine1.trim()) newErrors.addressLine1 = 'Address line 1 is required.';
    // Add more validations as in checkout shipping form...
    if (!formData.city.trim()) newErrors.city = 'City is required.';
    if (!formData.state.trim()) newErrors.state = 'State/Province is required.';
    if (!formData.zipCode.trim()) newErrors.zipCode = 'ZIP/Postal code is required.';
    if (!formData.country.trim()) newErrors.country = 'Country is required.';

    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitAddress = (e: FormEvent) => {
    e.preventDefault();
    if (!validateAddressForm()) return;

    if (editingAddress) {
      // Simulate updating an address
      console.log('Updating address:', editingAddress.id, formData);
      setAddresses(prev => prev.map(addr => addr.id === editingAddress.id ? { ...formData, id: editingAddress.id } : addr));
      alert('Address updated (simulated).');
    } else {
      // Simulate adding a new address
      const newId = `addr${Date.now()}`;
      console.log('Adding new address:', { ...formData, id: newId });
      setAddresses(prev => [...prev, { ...formData, id: newId }]);
      alert('Address added (simulated).');
    }
    setEditingAddress(null);
    setShowForm(false);
    setFormData(emptyAddressForm); // Reset form
  };

  const handleEditAddress = (address: SavedAddress) => {
    setEditingAddress(address);
  };

  const handleDeleteAddress = (addressId: string) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      console.log('Deleting address:', addressId);
      setAddresses(prev => prev.filter(addr => addr.id !== addressId));
      alert('Address deleted (simulated).');
      if (editingAddress?.id === addressId) { // If deleting the one being edited
        setEditingAddress(null);
        setShowForm(false);
      }
    }
  };
  
  const handleSetDefault = (addressId: string, type: 'shipping' | 'billing') => {
    console.log(`Setting address ${addressId} as default ${type} (simulated)`);
    setAddresses(prevAddresses => prevAddresses.map(addr => ({
        ...addr,
        isDefaultShipping: type === 'shipping' ? (addr.id === addressId) : (addr.isDefaultShipping && addr.id !== addressId),
        isDefaultBilling: type === 'billing' ? (addr.id === addressId) : (addr.isDefaultBilling && addr.id !== addressId),
    })));
    alert(`Address set as default ${type} (simulated).`);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Saved Addresses</h1>
        <button
          onClick={() => { setEditingAddress(null); setShowForm(!showForm); }}
          className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-700 transition-colors"
        >
          {showForm && !editingAddress ? 'Cancel' : 'Add New Address'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmitAddress} className="bg-white p-6 rounded-lg shadow-md mb-8 space-y-4">
          <h2 className="text-xl font-semibold mb-3">{editingAddress ? 'Edit Address' : 'Add New Address'}</h2>
          {/* Re-use address form fields similar to ShippingPage or create a dedicated AddressFormComponent */}
          {/* For brevity, only a few fields shown here, assume full form like shipping */}
          <div>
            <label htmlFor="formFullName" className="block text-sm font-medium text-gray-700">Full Name</label>
            <input type="text" name="fullName" id="formFullName" value={formData.fullName} onChange={handleInputChange} className={`mt-1 block w-full px-3 py-2 border ${formErrors.fullName ? 'border-red-500' : 'border-gray-300'} rounded-md`} required/>
            {formErrors.fullName && <p className="text-xs text-red-500 mt-1">{formErrors.fullName}</p>}
          </div>
          <div>
            <label htmlFor="formAddressLine1" className="block text-sm font-medium text-gray-700">Address Line 1</label>
            <input type="text" name="addressLine1" id="formAddressLine1" value={formData.addressLine1} onChange={handleInputChange} className={`mt-1 block w-full px-3 py-2 border ${formErrors.addressLine1 ? 'border-red-500' : 'border-gray-300'} rounded-md`} required/>
            {formErrors.addressLine1 && <p className="text-xs text-red-500 mt-1">{formErrors.addressLine1}</p>}
          </div>
           {/* ... (city, state, zip, country, phone) ... */}
            <div>
                <label htmlFor="formCity" className="block text-sm font-medium text-gray-700">City</label>
                <input type="text" name="city" id="formCity" value={formData.city} onChange={handleInputChange} className={`mt-1 block w-full px-3 py-2 border ${formErrors.city ? 'border-red-500' : 'border-gray-300'} rounded-md`} required/>
                {formErrors.city && <p className="text-xs text-red-500 mt-1">{formErrors.city}</p>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="formState" className="block text-sm font-medium text-gray-700">State/Province</label>
                    <input type="text" name="state" id="formState" value={formData.state} onChange={handleInputChange} className={`mt-1 block w-full px-3 py-2 border ${formErrors.state ? 'border-red-500' : 'border-gray-300'} rounded-md`} required/>
                    {formErrors.state && <p className="text-xs text-red-500 mt-1">{formErrors.state}</p>}
                </div>
                <div>
                    <label htmlFor="formZipCode" className="block text-sm font-medium text-gray-700">ZIP/Postal Code</label>
                    <input type="text" name="zipCode" id="formZipCode" value={formData.zipCode} onChange={handleInputChange} className={`mt-1 block w-full px-3 py-2 border ${formErrors.zipCode ? 'border-red-500' : 'border-gray-300'} rounded-md`} required/>
                    {formErrors.zipCode && <p className="text-xs text-red-500 mt-1">{formErrors.zipCode}</p>}
                </div>
            </div>
             <div>
                <label htmlFor="formCountry" className="block text-sm font-medium text-gray-700">Country</label>
                <select name="country" id="formCountry" value={formData.country} onChange={handleInputChange} className={`mt-1 block w-full px-3 py-2 border ${formErrors.country ? 'border-red-500' : 'border-gray-300'} bg-white rounded-md shadow-sm`} required>
                    <option value="USA">United States</option><option value="Canada">Canada</option><option value="UK">United Kingdom</option>
                </select>
                 {formErrors.country && <p className="text-xs text-red-500 mt-1">{formErrors.country}</p>}
            </div>
             <div>
                <label htmlFor="formPhoneNumber" className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input type="tel" name="phoneNumber" id="formPhoneNumber" value={formData.phoneNumber} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"/>
            </div>


          <div className="flex items-center space-x-4">
             <label className="flex items-center text-sm">
                <input type="checkbox" name="isDefaultShipping" checked={!!formData.isDefaultShipping} onChange={handleInputChange} className="h-4 w-4 text-indigo-600 border-gray-300 rounded"/>
                <span className="ml-2">Default Shipping</span>
            </label>
            <label className="flex items-center text-sm">
                <input type="checkbox" name="isDefaultBilling" checked={!!formData.isDefaultBilling} onChange={handleInputChange} className="h-4 w-4 text-indigo-600 border-gray-300 rounded"/>
                <span className="ml-2">Default Billing</span>
            </label>
          </div>
          <div className="flex justify-end space-x-3">
            <button type="button" onClick={() => { setShowForm(false); setEditingAddress(null); }} className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-green-600 text-white font-semibold rounded-md shadow-sm hover:bg-green-700">{editingAddress ? 'Update Address' : 'Save Address'}</button>
          </div>
        </form>
      )}

      {addresses.length === 0 && !showForm && (
        <p>You have no saved addresses.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {addresses.map(addr => (
          <div key={addr.id} className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
            <h3 className="font-semibold text-gray-800">{addr.fullName}</h3>
            <p className="text-sm text-gray-600">{addr.addressLine1}{addr.addressLine2 ? `, ${addr.addressLine2}` : ''}</p>
            <p className="text-sm text-gray-600">{addr.city}, {addr.state} {addr.zipCode} - {addr.country}</p>
            {addr.phoneNumber && <p className="text-sm text-gray-600">Phone: {addr.phoneNumber}</p>}
            <div className="mt-2 space-y-1">
                {addr.isDefaultShipping && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full mr-1">Default Shipping</span>}
                {addr.isDefaultBilling && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Default Billing</span>}
            </div>
            <div className="mt-3 pt-3 border-t border-gray-100 space-x-2">
              <button onClick={() => handleEditAddress(addr)} className="text-xs text-blue-500 hover:underline">Edit</button>
              <button onClick={() => handleDeleteAddress(addr.id)} className="text-xs text-red-500 hover:underline">Delete</button>
              {!addr.isDefaultShipping && <button onClick={() => handleSetDefault(addr.id, 'shipping')} className="text-xs text-gray-600 hover:underline">Set Default Shipping</button>}
              {!addr.isDefaultBilling && <button onClick={() => handleSetDefault(addr.id, 'billing')} className="text-xs text-gray-600 hover:underline">Set Default Billing</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedAddressesPage;
