'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCartStore, CartItem } from '@/store/cartStore'; // Adjust path
import { FaTrash } from 'react-icons/fa'; // Example icon, npm install react-icons

const CartPage = () => {
  const { items, removeItem, updateQuantity, getSubtotal, getTotalItems } = useCartStore();

  const handleQuantityChange = (item: CartItem, newQuantity: number) => {
    const qty = parseInt(String(newQuantity), 10);
    if (qty >= 0) {
      updateQuantity(item.product.id, item.variant?.id, qty, item.prescriptionDetails?.tempId);
    }
  };

  const placeholderImage = "/images/placeholder.png";

  if (items.length === 0) {
    return (
      <div className="container mx-auto p-4 text-center">
        <h1 className="text-3xl font-bold mb-6">Your Shopping Cart</h1>
        <p className="text-xl mb-4">Your cart is currently empty.</p>
        <Link href="/products" className="text-blue-500 hover:underline text-lg">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Your Shopping Cart</h1>
      <div className="lg:flex lg:gap-8">
        {/* Cart Items */}
        <div className="lg:w-2/3">
          <div className="space-y-4">
            {items.map((item) => {
              const itemPrice = item.variant ? (item.product.price + (item.variant.price_modifier || 0)) : item.product.price;
              return (
                <div key={`${item.product.id}-${item.variant?.id}-${item.prescriptionDetails?.tempId || 'no-rx'}`} className="flex items-center gap-4 p-4 border rounded-lg bg-white shadow-sm">
                  <div className="w-20 h-20 relative flex-shrink-0">
                    <Image 
                      src={item.variant?.image_url || item.product.main_image_url || placeholderImage} 
                      alt={item.product.name} 
                      fill
                      style={{ objectFit: 'contain' }}
                      className="rounded"
                    />
                  </div>
                  <div className="flex-grow">
                    <Link href={`/products/${item.product.id}`} className="font-semibold text-lg hover:text-blue-600">
                      {item.product.name}
                    </Link>
                    {item.variant && <p className="text-sm text-gray-600">{item.variant.name}</p>}
                    {item.prescriptionDetails && (
                      <div className="text-xs text-gray-500 mt-1 p-2 bg-blue-50 rounded">
                        <p className="font-semibold">Prescription:</p>
                        {item.prescriptionDetails.type === 'manual' && <span>Manual Entry (Patient: {(item.prescriptionDetails.data as any)?.patient_name || 'N/A'})</span>}
                        {item.prescriptionDetails.type === 'saved' && <span>Saved: {(item.prescriptionDetails.data as UserPrescription)?.prescription_name || `For ${(item.prescriptionDetails.data as UserPrescription)?.patient_name}`}</span>}
                        {item.prescriptionDetails.type === 'upload' && <span>Uploaded: {item.prescriptionDetails.url ? <Link href={item.prescriptionDetails.url} target="_blank" className="text-blue-500">View</Link> : 'N/A'}</span>}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-3 w-28">
                    <label htmlFor={`quantity-${item.product.id}`} className="sr-only">Quantity</label>
                    <input
                      type="number"
                      id={`quantity-${item.product.id}`}
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(item, Number(e.target.value))}
                      min="0" // Allow 0 to remove via quantity update
                      className="w-16 p-1 border rounded text-center"
                    />
                  </div>
                  <div className="text-right w-24">
                    <p className="font-semibold">${(itemPrice * item.quantity).toFixed(2)}</p>
                    {item.quantity > 1 && <p className="text-xs text-gray-500">${itemPrice.toFixed(2)} each</p>}
                  </div>
                  <div className="w-10 text-right">
                    <button 
                      onClick={() => removeItem(item.product.id, item.variant?.id, item.prescriptionDetails?.tempId)} 
                      className="text-red-500 hover:text-red-700"
                      title="Remove item"
                    >
                      <FaTrash size={18} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:w-1/3 mt-8 lg:mt-0">
          <div className="p-6 bg-gray-50 rounded-lg shadow-md sticky top-20">
            <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
            <div className="flex justify-between mb-2">
              <span>Subtotal ({getTotalItems()} items)</span>
              <span>${getSubtotal().toFixed(2)}</span>
            </div>
            {/* Placeholder for Shipping, Taxes */}
            <div className="flex justify-between mb-2 text-gray-500">
              <span>Shipping</span>
              <span>TBD</span>
            </div>
            <div className="flex justify-between mb-4 text-gray-500">
              <span>Taxes</span>
              <span>TBD</span>
            </div>
            <div className="border-t pt-4 flex justify-between font-bold text-xl">
              <span>Estimated Total</span>
              <span>${getSubtotal().toFixed(2)}</span> {/* Update when shipping/taxes are added */}
            </div>
            <button 
              onClick={() => { alert('Proceed to Checkout (Not Implemented Yet)'); /* router.push('/checkout') */ }}
              className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
