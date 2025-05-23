'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

// Mock data structure - in a real app, this would come from an API and services/api.ts
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
  items: MockOrderItem[]; // For detail view, not necessarily shown in list
}

const mockOrdersData: MockOrder[] = [
  {
    id: '1',
    orderNumber: 'Opti-73459',
    date: '2023-10-26',
    status: 'Delivered',
    totalAmount: 179.98,
    items: [
      { id: 'prod1', name: 'Classic Aviators - Gold', quantity: 1, price: 129.99, imageUrl: '/images/placeholder.png' },
      { id: 'prod2', name: 'Lens Cleaning Kit', quantity: 1, price: 49.99, imageUrl: '/images/placeholder.png' },
    ],
  },
  {
    id: '2',
    orderNumber: 'Opti-84560',
    date: '2023-11-15',
    status: 'Shipped',
    totalAmount: 245.50,
    items: [
      { id: 'prod3', name: 'Blue Light Blocking Glasses - Tortoise Shell', quantity: 1, price: 75.00, imageUrl: '/images/placeholder.png' },
      { id: 'prod4', name: 'Monthly Contact Lenses (2 Boxes)', quantity: 2, price: 85.25, imageUrl: '/images/placeholder.png' },
    ],
  },
  {
    id: '3',
    orderNumber: 'Opti-91234',
    date: '2024-01-05',
    status: 'Processing',
    totalAmount: 99.00,
    items: [
      { id: 'prod5', name: 'Stylish Reading Glasses +1.50', quantity: 1, price: 99.00, imageUrl: '/images/placeholder.png' },
    ],
  },
];


const OrderHistoryPage = () => {
  const [orders, setOrders] = useState<MockOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching data
    setLoading(true);
    // In a real app, you would fetch this data from your backend API
    // e.g., const fetchedOrders = await getMyOrders(); (from services/api.ts)
    setTimeout(() => { // Simulate network delay
      setOrders(mockOrdersData);
      setLoading(false);
    }, 500);
  }, []);

  if (loading) {
    return <p className="text-center py-10">Loading your order history...</p>;
  }

  if (orders.length === 0) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-6">My Orders</h1>
        <p>You have not placed any orders yet.</p>
        <Link href="/products" className="mt-4 inline-block text-blue-500 hover:underline">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>
      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order.id} className="bg-white p-4 sm:p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-3 sm:mb-2">
              <div>
                <h2 className="text-lg font-semibold text-blue-600">Order #{order.orderNumber}</h2>
                <p className="text-sm text-gray-500">Date: {new Date(order.date).toLocaleDateString()}</p>
              </div>
              <div className={`mt-2 sm:mt-0 px-3 py-1 text-xs sm:text-sm font-medium rounded-full text-white self-start sm:self-center
                ${order.status === 'Delivered' ? 'bg-green-500' : ''}
                ${order.status === 'Shipped' ? 'bg-blue-500' : ''}
                ${order.status === 'Processing' ? 'bg-yellow-500' : ''}
                ${order.status === 'Cancelled' ? 'bg-red-500' : ''}
              `}>
                {order.status}
              </div>
            </div>
            <div className="text-sm text-gray-700 mb-3">
              Total Amount: <span className="font-semibold">${order.totalAmount.toFixed(2)}</span>
            </div>
            {/* Simplified item display for list view */}
            <div className="mb-3 text-xs text-gray-500">
                {order.items.slice(0, 2).map(item => item.name).join(', ')}
                {order.items.length > 2 ? ` and ${order.items.length - 2} more item(s)`: ''}
            </div>
            <Link
              href={`/account/orders/${order.id}`} // Link to order detail page
              className="inline-block px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-300 transition-colors"
            >
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderHistoryPage;
