'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cartStore'; // To potentially store shipping address

// Define an interface for shipping address data
export interface ShippingAddress {
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string; // Or province
  zipCode: string;
  country: string;
  phoneNumber: string;
  email: string; // May prefill from user account if logged in
}

// Zustand store extension for checkout data (optional, can also use local state for forms)
// For now, let's keep form state local to this component.
// interface CheckoutState {
//   shippingAddress: ShippingAddress | null;
//   setShippingAddress: (address: ShippingAddress) => void;
// }
// const useCheckoutStore = create<CheckoutState>(...) ...


const ShippingPage = () => {
  const router = useRouter();
  // const { setShippingAddress } = useCheckoutStore(); // If using Zustand for checkout state

  const [formData, setFormData] = useState<ShippingAddress>({
    fullName: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'USA', // Default country
    phoneNumber: '',
    email: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ShippingAddress, string>>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof ShippingAddress]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ShippingAddress, string>> = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required.';
    if (!formData.addressLine1.trim()) newErrors.addressLine1 = 'Address line 1 is required.';
    if (!formData.city.trim()) newErrors.city = 'City is required.';
    if (!formData.state.trim()) newErrors.state = 'State/Province is required.';
    if (!formData.zipCode.trim()) newErrors.zipCode = 'ZIP/Postal code is required.';
    else if (!/^\d{5}(-\d{4})?$/.test(formData.zipCode) && formData.country === "USA") newErrors.zipCode = 'Invalid US ZIP code.'; // Simple US Zip validation
    if (!formData.country.trim()) newErrors.country = 'Country is required.';
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required.';
    else if (!/^\+?[1-9]\d{1,14}$/.test(formData.phoneNumber.replace(/\s+/g, ''))) newErrors.phoneNumber = 'Invalid phone number format.';
    if (!formData.email.trim()) newErrors.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format.';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('Shipping Address Submitted:', formData);
      // Here, you would typically save this to a global state (like Zustand store for checkout)
      // or pass it via backend to persist with the order.
      // For now, just log and navigate.
      // setShippingAddress(formData); // Example if using Zustand
      
      // Store in localStorage for now to pass to next step (simple, not for production)
      if (typeof window !== 'undefined') {
        localStorage.setItem('shippingAddress', JSON.stringify(formData));
      }
      router.push('/checkout/payment'); // Navigate to next step
    } else {
      console.log("Validation failed", errors);
    }
  };

  // TODO: Fetch user's saved addresses if logged in and allow pre-filling.

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 sm:p-8 rounded-lg shadow-xl">
      <h1 className="text-2xl font-semibold mb-6 text-gray-800">Shipping Information</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Full Name</label>
          <input type="text" name="fullName" id="fullName" value={formData.fullName} onChange={handleChange} className={`mt-1 block w-full px-3 py-2 border ${errors.fullName ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`} />
          {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
          <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} className={`mt-1 block w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`} />
          {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
        </div>
        
        <div>
          <label htmlFor="addressLine1" className="block text-sm font-medium text-gray-700">Address Line 1</label>
          <input type="text" name="addressLine1" id="addressLine1" value={formData.addressLine1} onChange={handleChange} className={`mt-1 block w-full px-3 py-2 border ${errors.addressLine1 ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`} />
          {errors.addressLine1 && <p className="text-xs text-red-500 mt-1">{errors.addressLine1}</p>}
        </div>

        <div>
          <label htmlFor="addressLine2" className="block text-sm font-medium text-gray-700">Address Line 2 <span className="text-xs text-gray-500">(Optional)</span></label>
          <input type="text" name="addressLine2" id="addressLine2" value={formData.addressLine2} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
            <input type="text" name="city" id="city" value={formData.city} onChange={handleChange} className={`mt-1 block w-full px-3 py-2 border ${errors.city ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`} />
            {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city}</p>}
          </div>
          <div>
            <label htmlFor="state" className="block text-sm font-medium text-gray-700">State / Province</label>
            <input type="text" name="state" id="state" value={formData.state} onChange={handleChange} className={`mt-1 block w-full px-3 py-2 border ${errors.state ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`} />
            {errors.state && <p className="text-xs text-red-500 mt-1">{errors.state}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">ZIP / Postal Code</label>
            <input type="text" name="zipCode" id="zipCode" value={formData.zipCode} onChange={handleChange} className={`mt-1 block w-full px-3 py-2 border ${errors.zipCode ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`} />
            {errors.zipCode && <p className="text-xs text-red-500 mt-1">{errors.zipCode}</p>}
          </div>
          <div>
            <label htmlFor="country" className="block text-sm font-medium text-gray-700">Country</label>
            <select name="country" id="country" value={formData.country} onChange={handleChange} className={`mt-1 block w-full px-3 py-2 border ${errors.country ? 'border-red-500' : 'border-gray-300'} bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}>
              {/* Populate with a list of countries, for now just USA */}
              <option value="USA">United States</option>
              <option value="Canada">Canada</option>
              <option value="UK">United Kingdom</option>
              {/* Add more countries as needed */}
            </select>
            {errors.country && <p className="text-xs text-red-500 mt-1">{errors.country}</p>}
          </div>
        </div>
        
        <div>
          <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Phone Number <span className="text-xs text-gray-500">(For delivery updates)</span></label>
          <input type="tel" name="phoneNumber" id="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className={`mt-1 block w-full px-3 py-2 border ${errors.phoneNumber ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`} />
          {errors.phoneNumber && <p className="text-xs text-red-500 mt-1">{errors.phoneNumber}</p>}
        </div>

        <div className="pt-4">
          <button type="submit" className="w-full bg-blue-600 text-white py-3 px-4 rounded-md font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
            Continue to Payment
          </button>
        </div>
      </form>
    </div>
  );
};

export default ShippingPage;
