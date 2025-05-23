'use client';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image'; // For displaying item images

// Re-using mock data structure from the list page for consistency
interface MockOrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  imageUrl?: string;
}

interface MockOrder {
  id: string;
  orderNumber: string;
  date: string;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  totalAmount: number;
  items: MockOrderItem[];
  // Add mock shipping/billing addresses if needed for more detail
  shippingAddress?: { fullName: string; addressLine1: string; city: string; zipCode: string; country: string; };
  billingAddress?: { fullName: string; addressLine1: string; city: string; zipCode: string; country: string; };
  paymentMethod?: string;
}

// Find a specific order from the mock data (simulating API fetch by ID)
const mockOrdersData: MockOrder[] = [ // Copied from above for standalone use here
  {
    id: '1', orderNumber: 'Opti-73459', date: '2023-10-26', status: 'Delivered', totalAmount: 179.98, 
    items: [ { id: 'prod1', name: 'Classic Aviators - Gold', quantity: 1, price: 129.99, imageUrl: '/images/placeholder.png' }, { id: 'prod2', name: 'Lens Cleaning Kit', quantity: 1, price: 49.99, imageUrl: '/images/placeholder.png' } ],
    shippingAddress: { fullName: 'John Doe', addressLine1: '123 Main St', city: 'Anytown', zipCode: '12345', country: 'USA' },
    paymentMethod: 'Credit Card ending in 1234'
  },
  { 
    id: '2', orderNumber: 'Opti-84560', date: '2023-11-15', status: 'Shipped', totalAmount: 245.50, 
    items: [ { id: 'prod3', name: 'Blue Light Blocking Glasses - Tortoise Shell', quantity: 1, price: 75.00, imageUrl: '/images/placeholder.png' }, { id: 'prod4', name: 'Monthly Contact Lenses (2 Boxes)', quantity: 2, price: 85.25, imageUrl: '/images/placeholder.png' } ],
    shippingAddress: { fullName: 'Jane Smith', addressLine1: '456 Oak Ave', city: 'Otherville', zipCode: '67890', country: 'USA' },
    paymentMethod: 'PayPal'
  },
   { 
    id: '3', orderNumber: 'Opti-91234', date: '2024-01-05', status: 'Processing', totalAmount: 99.00, 
    items: [ { id: 'prod5', name: 'Stylish Reading Glasses +1.50', quantity: 1, price: 99.00, imageUrl: '/images/placeholder.png' } ],
    shippingAddress: { fullName: 'Alice Brown', addressLine1: '789 Pine Ln', city: 'Smalltown', zipCode: '10112', country: 'USA' },
    paymentMethod: 'Credit Card ending in 5678'
  },
];

const findMockOrderById = (orderId: string): MockOrder | undefined => {
  return mockOrdersData.find(order => order.id === orderId);
};


const OrderDetailPage = () => {
  const params = useParams();
  const orderId = params.orderId as string;
  const [order, setOrder] = useState<MockOrder | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        const foundOrder = findMockOrderById(orderId);
        setOrder(foundOrder || null);
        setLoading(false);
      }, 300);
    }
  }, [orderId]);

  if (loading) {
    return <p className="text-center py-10">Loading order details...</p>;
  }

  if (!order) {
    return (
      <div className="text-center py-10">
        <p className="text-xl text-red-500">Order not found.</p>
        <Link href="/account/orders" className="mt-4 inline-block text-blue-500 hover:underline">
          &larr; Back to Order History
        </Link>
      </div>
    );
  }
  
  const placeholderImage = "/images/placeholder.png";

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Order Details</h1>
        <Link href="/account/orders" className="text-sm text-blue-500 hover:underline">
          &larr; Back to Order History
        </Link>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 pb-6 border-b">
          <div>
            <h2 className="text-lg font-semibold text-gray-700">Order #{order.orderNumber}</h2>
            <p className="text-sm text-gray-500">Date: {new Date(order.date).toLocaleDateString()}</p>
            <p className="text-sm text-gray-500">Status: <span className="font-medium">{order.status}</span></p>
            <p className="text-sm text-gray-500">Total: <span className="font-bold text-gray-800">${order.totalAmount.toFixed(2)}</span></p>
          </div>
          {order.shippingAddress && (
            <div>
                <h3 className="text-md font-semibold text-gray-600 mb-1">Shipping Address</h3>
                <p className="text-sm text-gray-500">{order.shippingAddress.fullName}</p>
                <p className="text-sm text-gray-500">{order.shippingAddress.addressLine1}</p>
                <p className="text-sm text-gray-500">{order.shippingAddress.city}, {order.shippingAddress.zipCode} ({order.shippingAddress.country})</p>
            </div>
          )}
           {order.paymentMethod && (
             <div className="md:col-span-2">
                <h3 className="text-md font-semibold text-gray-600 mb-1">Payment Method</h3>
                <p className="text-sm text-gray-500">{order.paymentMethod}</p>
            </div>
          )}
        </div>

        <h3 className="text-lg font-semibold text-gray-700 mb-3">Items in this Order:</h3>
        <div className="space-y-4">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-start gap-4 p-3 border rounded-md bg-gray-50">
              <Image 
                src={item.imageUrl || placeholderImage} 
                alt={item.name} 
                width={60} 
                height={60} 
                className="rounded object-contain flex-shrink-0"
              />
              <div className="flex-grow">
                <p className="font-medium text-gray-800">{item.name}</p>
                <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                <p className="text-sm text-gray-500">Price per item: ${item.price.toFixed(2)}</p>
              </div>
              <p className="font-semibold text-gray-800">${(item.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-6 pt-6 border-t text-right">
            <p className="text-lg font-bold text-gray-800">Order Total: <span className="text-blue-600">${order.totalAmount.toFixed(2)}</span></p>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
