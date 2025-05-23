'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link'; // For editing shipping address
import { ShippingAddress } from '../shipping/page'; // Assuming ShippingAddress interface is exported from shipping page

// Define an interface for Billing Address (can be same as ShippingAddress)
type BillingAddress = ShippingAddress;

// Define an interface for Payment Details (simplified)
interface PaymentDetails {
  paymentMethod: 'creditCard' | 'paypal' | '';
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
}

const PaymentPage = () => {
  const router = useRouter();
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress | null>(null);
  const [useShippingAsBilling, setUseShippingAsBilling] = useState(true);
  const [billingAddress, setBillingAddress] = useState<BillingAddress>({
    fullName: '', addressLine1: '', city: '', state: '', zipCode: '', country: '', phoneNumber: '', email: ''
  });
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({
    paymentMethod: '', cardNumber: '', expiryDate: '', cvv: ''
  });
  const [billingErrors, setBillingErrors] = useState<Partial<Record<keyof BillingAddress, string>>>({});
  const [paymentErrors, setPaymentErrors] = useState<Partial<Record<keyof PaymentDetails, string>>>({});


  useEffect(() => {
    // Retrieve shipping address from localStorage (as set by shipping page)
    if (typeof window !== 'undefined') {
      const savedShippingAddress = localStorage.getItem('shippingAddress');
      if (savedShippingAddress) {
        const parsedAddress: ShippingAddress = JSON.parse(savedShippingAddress);
        setShippingAddress(parsedAddress);
        // Pre-fill billing if using shipping as billing
        if (useShippingAsBilling) {
          setBillingAddress(parsedAddress);
        }
      } else {
        // If no shipping address, redirect back to shipping page
        // alert('Shipping address not found. Please complete the shipping step first.');
        // router.push('/checkout/shipping');
        console.warn("Payment page: Shipping address not found in localStorage. User might need to be redirected.");
      }
    }
  }, [useShippingAsBilling]); // Rerun if useShippingAsBilling changes to repopulate

  const handleBillingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBillingAddress(prev => ({ ...prev, [name]: value }));
     if (billingErrors[name as keyof BillingAddress]) {
      setBillingErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPaymentDetails(prev => ({ ...prev, [name]: value }));
    if (paymentErrors[name as keyof PaymentDetails]) {
      setPaymentErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };
  
  const handleUseShippingAsBillingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUseShippingAsBilling(e.target.checked);
    if (e.target.checked && shippingAddress) {
      setBillingAddress(shippingAddress);
      setBillingErrors({}); // Clear billing errors when copying
    } else {
      // Optionally clear billing address when unchecked, or leave as is for user to edit
       setBillingAddress({ fullName: '', addressLine1: '', city: '', state: '', zipCode: '', country: '', phoneNumber: '', email: ''});
    }
  };

  const validateBillingAddress = (): boolean => {
    if (useShippingAsBilling) return true; // No need to validate if using shipping
    const newErrors: Partial<Record<keyof BillingAddress, string>> = {};
    if (!billingAddress.fullName.trim()) newErrors.fullName = 'Full name is required.';
    if (!billingAddress.addressLine1.trim()) newErrors.addressLine1 = 'Address line 1 is required.';
    if (!billingAddress.city.trim()) newErrors.city = 'City is required.';
    if (!billingAddress.state.trim()) newErrors.state = 'State/Province is required.';
    if (!billingAddress.zipCode.trim()) newErrors.zipCode = 'ZIP/Postal code is required.';
    if (!billingAddress.country.trim()) newErrors.country = 'Country is required.';
    // Email and phone are often not required for billing if already collected for shipping/account
    setBillingErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePaymentDetails = (): boolean => {
    const newErrors: Partial<Record<keyof PaymentDetails, string>> = {};
    if (!paymentDetails.paymentMethod) newErrors.paymentMethod = 'Please select a payment method.';
    if (paymentDetails.paymentMethod === 'creditCard') {
      if (!paymentDetails.cardNumber?.trim() || !/^\d{13,19}$/.test(paymentDetails.cardNumber.replace(/\s+/g, ''))) newErrors.cardNumber = 'Valid card number is required.';
      if (!paymentDetails.expiryDate?.trim() || !/^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(paymentDetails.expiryDate)) newErrors.expiryDate = 'Valid expiry date (MM/YY) is required.';
      if (!paymentDetails.cvv?.trim() || !/^\d{3,4}$/.test(paymentDetails.cvv)) newErrors.cvv = 'Valid CVV (3 or 4 digits) is required.';
    }
    setPaymentErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isBillingValid = validateBillingAddress();
    const isPaymentValid = validatePaymentDetails();

    if (isBillingValid && isPaymentValid) {
      const finalBillingAddress = useShippingAsBilling && shippingAddress ? shippingAddress : billingAddress;
      console.log('Billing Address:', finalBillingAddress);
      console.log('Payment Details:', paymentDetails);
      
      // Store in localStorage for now (simple, not for production)
      if (typeof window !== 'undefined') {
        localStorage.setItem('billingAddress', JSON.stringify(finalBillingAddress));
        localStorage.setItem('paymentDetails', JSON.stringify(paymentDetails));
      }
      router.push('/checkout/review');
    } else {
        console.log("Payment/Billing Validation Failed. Billing Errors:", billingErrors, "Payment Errors:", paymentErrors);
    }
  };

  if (!shippingAddress && typeof window !== 'undefined' && !localStorage.getItem('shippingAddress')) {
    // This might flash briefly before useEffect kicks in to redirect or warn.
    // A more robust solution involves protecting routes or using a checkout context/store.
    return <p className="text-center py-10">Loading shipping details or redirecting...</p>;
  }


  return (
    <div className="max-w-2xl mx-auto bg-white p-6 sm:p-8 rounded-lg shadow-xl">
      <h1 className="text-2xl font-semibold mb-6 text-gray-800">Payment Information</h1>

      {/* Display Shipping Address */}
      {shippingAddress && (
        <div className="mb-6 p-4 border border-gray-200 rounded-md bg-gray-50">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-700">Shipping To:</h2>
            <Link href="/checkout/shipping" className="text-sm text-blue-500 hover:underline">Edit</Link>
          </div>
          <p className="text-sm text-gray-600">{shippingAddress.fullName}</p>
          <p className="text-sm text-gray-600">{shippingAddress.addressLine1}{shippingAddress.addressLine2 ? `, ${shippingAddress.addressLine2}` : ''}</p>
          <p className="text-sm text-gray-600">{shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}</p>
          <p className="text-sm text-gray-600">{shippingAddress.country}</p>
          <p className="text-sm text-gray-600">Email: {shippingAddress.email}</p>
          <p className="text-sm text-gray-600">Phone: {shippingAddress.phoneNumber}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Billing Address Section */}
        <fieldset>
          <legend className="text-lg font-medium text-gray-900 mb-2">Billing Address</legend>
          <div className="mb-4">
            <label className="flex items-center text-sm text-gray-700">
              <input
                type="checkbox"
                checked={useShippingAsBilling}
                onChange={handleUseShippingAsBillingChange}
                className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <span className="ml-2">Same as shipping address</span>
            </label>
          </div>

          {!useShippingAsBilling && (
            <div className="space-y-4 p-4 border border-gray-200 rounded-md">
              <div>
                <label htmlFor="billingFullName" className="block text-sm font-medium text-gray-700">Full Name</label>
                <input type="text" name="fullName" id="billingFullName" value={billingAddress.fullName} onChange={handleBillingChange} className={`mt-1 block w-full px-3 py-2 border ${billingErrors.fullName ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm`} />
                {billingErrors.fullName && <p className="text-xs text-red-500 mt-1">{billingErrors.fullName}</p>}
              </div>
              <div>
                <label htmlFor="billingAddressLine1" className="block text-sm font-medium text-gray-700">Address Line 1</label>
                <input type="text" name="addressLine1" id="billingAddressLine1" value={billingAddress.addressLine1} onChange={handleBillingChange} className={`mt-1 block w-full px-3 py-2 border ${billingErrors.addressLine1 ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm`} />
                 {billingErrors.addressLine1 && <p className="text-xs text-red-500 mt-1">{billingErrors.addressLine1}</p>}
              </div>
              {/* Add all other billing address fields similarly: addressLine2, city, state, zipCode, country */}
               <div>
                <label htmlFor="billingCity" className="block text-sm font-medium text-gray-700">City</label>
                <input type="text" name="city" id="billingCity" value={billingAddress.city} onChange={handleBillingChange} className={`mt-1 block w-full px-3 py-2 border ${billingErrors.city ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm`} />
                {billingErrors.city && <p className="text-xs text-red-500 mt-1">{billingErrors.city}</p>}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="billingState" className="block text-sm font-medium text-gray-700">State / Province</label>
                    <input type="text" name="state" id="billingState" value={billingAddress.state} onChange={handleBillingChange} className={`mt-1 block w-full px-3 py-2 border ${billingErrors.state ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm`} />
                    {billingErrors.state && <p className="text-xs text-red-500 mt-1">{billingErrors.state}</p>}
                </div>
                <div>
                    <label htmlFor="billingZipCode" className="block text-sm font-medium text-gray-700">ZIP / Postal Code</label>
                    <input type="text" name="zipCode" id="billingZipCode" value={billingAddress.zipCode} onChange={handleBillingChange} className={`mt-1 block w-full px-3 py-2 border ${billingErrors.zipCode ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm`} />
                    {billingErrors.zipCode && <p className="text-xs text-red-500 mt-1">{billingErrors.zipCode}</p>}
                </div>
              </div>
               <div>
                <label htmlFor="billingCountry" className="block text-sm font-medium text-gray-700">Country</label>
                <select name="country" id="billingCountry" value={billingAddress.country} onChange={handleBillingChange} className={`mt-1 block w-full px-3 py-2 border ${billingErrors.country ? 'border-red-500' : 'border-gray-300'} bg-white rounded-md shadow-sm`}>
                    <option value="USA">United States</option><option value="Canada">Canada</option><option value="UK">United Kingdom</option>
                </select>
                {billingErrors.country && <p className="text-xs text-red-500 mt-1">{billingErrors.country}</p>}
              </div>
            </div>
          )}
        </fieldset>

        {/* Payment Method Section */}
        <fieldset className="pt-4">
          <legend className="text-lg font-medium text-gray-900 mb-2">Payment Method</legend>
          <div className="space-y-2">
            <label className="flex items-center p-3 border rounded-md hover:border-blue-500 has-[:checked]:bg-blue-50 has-[:checked]:border-blue-500">
              <input type="radio" name="paymentMethod" value="creditCard" checked={paymentDetails.paymentMethod === 'creditCard'} onChange={handlePaymentChange} className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"/>
              <span className="ml-2 text-sm text-gray-700">Credit Card</span>
            </label>
            <label className="flex items-center p-3 border rounded-md hover:border-blue-500 has-[:checked]:bg-blue-50 has-[:checked]:border-blue-500">
              <input type="radio" name="paymentMethod" value="paypal" checked={paymentDetails.paymentMethod === 'paypal'} onChange={handlePaymentChange} className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"/>
              <span className="ml-2 text-sm text-gray-700">PayPal</span>
            </label>
          </div>
           {paymentErrors.paymentMethod && <p className="text-xs text-red-500 mt-1">{paymentErrors.paymentMethod}</p>}


          {paymentDetails.paymentMethod === 'creditCard' && (
            <div className="mt-4 space-y-3 p-4 border border-gray-200 rounded-md bg-gray-50">
              <div>
                <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">Card Number</label>
                <input type="text" name="cardNumber" id="cardNumber" value={paymentDetails.cardNumber} onChange={handlePaymentChange} placeholder="0000 0000 0000 0000" className={`mt-1 block w-full px-3 py-2 border ${paymentErrors.cardNumber ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm`} />
                {paymentErrors.cardNumber && <p className="text-xs text-red-500 mt-1">{paymentErrors.cardNumber}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700">Expiry Date (MM/YY)</label>
                  <input type="text" name="expiryDate" id="expiryDate" value={paymentDetails.expiryDate} onChange={handlePaymentChange} placeholder="MM/YY" className={`mt-1 block w-full px-3 py-2 border ${paymentErrors.expiryDate ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm`} />
                  {paymentErrors.expiryDate && <p className="text-xs text-red-500 mt-1">{paymentErrors.expiryDate}</p>}
                </div>
                <div>
                  <label htmlFor="cvv" className="block text-sm font-medium text-gray-700">CVV</label>
                  <input type="text" name="cvv" id="cvv" value={paymentDetails.cvv} onChange={handlePaymentChange} placeholder="123" className={`mt-1 block w-full px-3 py-2 border ${paymentErrors.cvv ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm`} />
                  {paymentErrors.cvv && <p className="text-xs text-red-500 mt-1">{paymentErrors.cvv}</p>}
                </div>
              </div>
            </div>
          )}
          {paymentDetails.paymentMethod === 'paypal' && (
            <div className="mt-4 p-4 border border-gray-200 rounded-md bg-gray-50 text-center">
              <p className="text-sm text-gray-700">You will be redirected to PayPal to complete your payment.</p>
              {/* Actual PayPal button would go here */}
            </div>
          )}
        </fieldset>
        
        <div className="pt-6 flex justify-between items-center">
           <button type="button" onClick={() => router.back()} className="text-sm text-blue-500 hover:underline">
            &larr; Back to Shipping
          </button>
          <button type="submit" className="bg-blue-600 text-white py-3 px-6 rounded-md font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
            Continue to Review Order
          </button>
        </div>
      </form>
    </div>
  );
};

export default PaymentPage;
