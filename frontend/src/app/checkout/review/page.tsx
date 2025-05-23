'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useCartStore, CartItem, UserPrescription } from '@/store/cartStore'; // Adjust path, ensure UserPrescription is exported from store or imported from api
import { ShippingAddress } from '../shipping/page'; // Adjust path
// Assuming BillingAddress is same as ShippingAddress, and PaymentDetails structure
// type BillingAddress = ShippingAddress; // Already defined in payment/page.tsx conceptually
interface PaymentDetails { // As defined conceptually in payment/page.tsx
  paymentMethod: 'creditCard' | 'paypal' | '';
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
}


const ReviewOrderPage = () => {
  const router = useRouter();
  const { items, getSubtotal, getTotalItems, clearCart } = useCartStore();
  
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress | null>(null);
  const [billingAddress, setBillingAddress] = useState<ShippingAddress | null>(null); // Assuming BillingAddress is same structure
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false); // For "Place Order" button

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const sa = localStorage.getItem('shippingAddress');
      const ba = localStorage.getItem('billingAddress');
      const pd = localStorage.getItem('paymentDetails');

      if (sa) setShippingAddress(JSON.parse(sa));
      if (ba) setBillingAddress(JSON.parse(ba));
      if (pd) setPaymentDetails(JSON.parse(pd));

      if (!sa || !pd) { // If essential info is missing, redirect
        // alert('Checkout information is incomplete. Please start again.');
        // router.push('/checkout/shipping');
         console.warn("Review page: Essential checkout info (shipping/payment) missing from localStorage.");
      }
      if (items.length === 0) {
        // alert('Your cart is empty.');
        // router.push('/cart');
         console.warn("Review page: Cart is empty.");
      }
    }
  }, [items.length, router]);

  const handlePlaceOrder = async () => {
    setIsLoading(true);
    // 1. Consolidate all order information
    const orderData = {
      cartItems: items,
      shippingAddress,
      billingAddress,
      paymentDetails,
      orderSubtotal: getSubtotal(),
      totalItems: getTotalItems(),
      // In a real app, add: shippingCost, taxes, orderTotal, userId if logged in, etc.
      orderDate: new Date().toISOString(),
    };

    console.log('--- Simulating Order Placement ---');
    console.log('Order Data:', JSON.stringify(orderData, null, 2));

    // 2. Simulate backend API call
    // In a real app:
    // try {
    //   const response = await fetch('/api/orders', { // Your backend order endpoint
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json', /* Add Auth token if needed */ },
    //     body: JSON.stringify(orderData),
    //   });
    //   if (!response.ok) throw new Error('Order placement failed');
    //   const createdOrder = await response.json();
    //   console.log('Order successfully placed with backend:', createdOrder);
    //   // Store orderId or confirmation details if needed for success page
    //   localStorage.setItem('lastOrderId', createdOrder.id); 
    // } catch (error) {
    //   console.error('Order placement error:', error);
    //   alert(`There was an error placing your order: ${error.message}. Please try again.`);
    //   setIsLoading(false);
    //   return;
    // }

    // For this simulation, just delay slightly
    await new Promise(resolve => setTimeout(resolve, 1000));


    // 3. Clear the cart (from Zustand and localStorage if persisted)
    clearCart(); 
    // If cart items were also in localStorage (e.g. for persistence), clear them too.
    // localStorage.removeItem('cart-storage'); // If using Zustand persist middleware with this name

    // 4. Clear checkout details from localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('shippingAddress');
      localStorage.removeItem('billingAddress');
      localStorage.removeItem('paymentDetails');
      // Potentially store a minimal order confirmation for the success page
      localStorage.setItem('lastOrderSummary', JSON.stringify({
        totalItems: orderData.totalItems,
        orderSubtotal: orderData.orderSubtotal,
        // In real app, include order ID from backend
      }));
    }
    
    // 5. Redirect to order confirmation/thank you page
    router.push('/checkout/success');
  };

  const placeholderImage = "/images/placeholder.png";

  if (!shippingAddress || !paymentDetails || items.length === 0) {
    // Basic protection against direct access or empty cart
    // Could show a more user-friendly message or redirect earlier in useEffect
    return (
        <div className="text-center py-10">
            <p>Loading order details or information is incomplete...</p>
            <p className="mt-4"><Link href="/checkout/shipping" className="text-blue-500 hover:underline">Start Checkout</Link> or <Link href="/cart" className="text-blue-500 hover:underline">Return to Cart</Link></p>
        </div>
    );
  }


  return (
    <div className="max-w-4xl mx-auto bg-white p-6 sm:p-8 rounded-lg shadow-xl">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Review Your Order</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Shipping & Billing Details */}
        <div>
          <h2 className="text-xl font-semibold mb-3 text-gray-700">Shipping Address</h2>
          {shippingAddress ? (
            <div className="text-sm text-gray-600 bg-gray-50 p-4 rounded-md">
              <p>{shippingAddress.fullName}</p>
              <p>{shippingAddress.addressLine1}{shippingAddress.addressLine2 ? `, ${shippingAddress.addressLine2}` : ''}</p>
              <p>{shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode} - {shippingAddress.country}</p>
              <p>Email: {shippingAddress.email}</p>
              <p>Phone: {shippingAddress.phoneNumber}</p>
              <Link href="/checkout/shipping" className="text-xs text-blue-500 hover:underline mt-1 inline-block">Edit Shipping</Link>
            </div>
          ) : <p className="text-sm text-gray-500">Not provided.</p>}
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-3 text-gray-700">Billing & Payment</h2>
          {billingAddress ? (
            <div className="text-sm text-gray-600 bg-gray-50 p-4 rounded-md mb-4">
              <h3 className="font-medium text-gray-700 mb-1">Billing Address:</h3>
              <p>{billingAddress.fullName}</p>
              <p>{billingAddress.addressLine1}{billingAddress.addressLine2 ? `, ${billingAddress.addressLine2}` : ''}</p>
              <p>{billingAddress.city}, {billingAddress.state} {billingAddress.zipCode} - {billingAddress.country}</p>
            </div>
          ) : <p className="text-sm text-gray-500">Billing address not provided.</p>}
          {paymentDetails ? (
            <div className="text-sm text-gray-600 bg-gray-50 p-4 rounded-md">
                <h3 className="font-medium text-gray-700 mb-1">Payment Method:</h3>
              <p className="capitalize">
                {paymentDetails.paymentMethod === 'creditCard' ? 'Credit Card' : 'PayPal'}
              </p>
              {paymentDetails.paymentMethod === 'creditCard' && paymentDetails.cardNumber && (
                <p>Card: **** **** **** {paymentDetails.cardNumber.slice(-4)}</p>
              )}
               <Link href="/checkout/payment" className="text-xs text-blue-500 hover:underline mt-1 inline-block">Edit Payment</Link>
            </div>
          ) : <p className="text-sm text-gray-500">Payment details not provided.</p>}
        </div>
      </div>

      {/* Order Items Summary */}
      <h2 className="text-xl font-semibold mb-4 text-gray-700">Order Summary ({getTotalItems()} items)</h2>
      <div className="space-y-3 mb-6 border-t border-b py-4">
        {items.map(item => {
          const itemPrice = item.variant ? (item.product.price + (item.variant.price_modifier || 0)) : item.product.price;
          return (
            <div key={`${item.product.id}-${item.variant?.id}-${item.prescriptionDetails?.tempId || 'no-rx'}`} className="flex items-center gap-3 text-sm">
              <Image src={item.variant?.image_url || item.product.main_image_url || placeholderImage} alt={item.product.name} width={50} height={50} className="rounded object-contain"/>
              <div className="flex-grow">
                <p className="font-medium text-gray-800">{item.product.name} {item.variant ? `(${item.variant.name})` : ''}</p>
                <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                 {item.prescriptionDetails && (
                    <p className="text-xs text-blue-600">Prescription: {item.prescriptionDetails.type === 'manual' ? 'Manual Entry' : (item.prescriptionDetails.type === 'saved' ? `Saved (${(item.prescriptionDetails.data as UserPrescription)?.prescription_name || (item.prescriptionDetails.data as UserPrescription)?.patient_name})` : 'Uploaded URL')}</p>
                )}
              </div>
              <p className="font-medium text-gray-800">${(itemPrice * item.quantity).toFixed(2)}</p>
            </div>
          );
        })}
      </div>
      
      {/* Totals */}
      <div className="space-y-1 text-right text-sm text-gray-700 mb-8">
        <p>Subtotal: <span className="font-medium">${getSubtotal().toFixed(2)}</span></p>
        <p>Shipping: <span className="font-medium">FREE</span></p> {/* Placeholder */}
        <p>Taxes: <span className="font-medium">TBD</span></p> {/* Placeholder */}
        <p className="text-lg font-bold text-gray-800 mt-1">Order Total: <span className="text-blue-600">${getSubtotal().toFixed(2)}</span></p> {/* Update when shipping/taxes added */}
      </div>

      <div className="text-center">
        <button 
          onClick={handlePlaceOrder}
          disabled={isLoading}
          className="w-full max-w-xs bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors disabled:opacity-70"
        >
          {isLoading ? 'Placing Order...' : 'Place Order'}
        </button>
      </div>
       <div className="mt-6 text-center">
            <Link href="/cart" className="text-sm text-blue-500 hover:underline">
                &larr; Return to Cart
            </Link>
        </div>
    </div>
  );
};

export default ReviewOrderPage;
