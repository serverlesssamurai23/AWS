'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // To prevent back navigation to review page in some cases

// Interface for the minimal order summary stored in localStorage
interface LastOrderSummary {
  totalItems: number;
  orderSubtotal: number;
  orderId?: string; // In a real app, this would come from the backend
}

const OrderSuccessPage = () => {
  const router = useRouter();
  const [orderSummary, setOrderSummary] = useState<LastOrderSummary | null>(null);
  const [mockOrderId, setMockOrderId] = useState<string>('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const summaryJson = localStorage.getItem('lastOrderSummary');
      if (summaryJson) {
        setOrderSummary(JSON.parse(summaryJson));
        // For this simulation, generate a mock order ID if not present
        setMockOrderId(summaryJson.includes("orderId") ? JSON.parse(summaryJson).orderId : `Opti-${Date.now().toString().slice(-6)}`);
      } else {
        // If no summary, perhaps redirect to homepage as order process wasn't completed properly
        // This indicates the user might have landed here directly without placing an order.
        console.warn("Order success page: No lastOrderSummary found in localStorage. Redirecting to home.");
        router.replace('/'); // Use replace to prevent going back to this empty success page
      }
      // Optional: Clear the summary from localStorage after displaying it once,
      // to prevent showing old data if the user revisits this page via history.
      // localStorage.removeItem('lastOrderSummary'); 
      // However, for now, let's keep it so a refresh shows the data.
    }

    // Prevent users from using the back button to go to the review page again
    // as the cart would be empty and checkout details cleared.
    // This is a simple client-side attempt; server-side state is more robust.
    const handleBackButton = (event: PopStateEvent) => {
        // Redirect to homepage if they try to go back from success page
        router.replace('/');
    };
    window.addEventListener('popstate', handleBackButton);
    return () => {
        window.removeEventListener('popstate', handleBackButton);
    };

  }, [router]);


  if (!orderSummary) {
    return (
      <div className="container mx-auto p-4 text-center py-20">
        <p>Loading order confirmation...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 text-center py-10 sm:py-20">
      <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-6 rounded-lg shadow-md max-w-2xl mx-auto mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold mb-3">Thank You For Your Order!</h1>
        <p className="text-lg">Your order has been placed successfully.</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto mb-8 text-left">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Order Confirmation</h2>
        <p className="text-gray-600 mb-2">
          <strong>Order ID:</strong> <span className="font-mono">{orderSummary.orderId || mockOrderId}</span>
        </p>
        <p className="text-gray-600 mb-2">
          <strong>Total Items:</strong> {orderSummary.totalItems}
        </p>
        <p className="text-gray-600 mb-4">
          <strong>Order Subtotal:</strong> <span className="font-semibold">${orderSummary.orderSubtotal.toFixed(2)}</span>
        </p>
        <p className="text-sm text-gray-500">
          You will receive an email confirmation shortly with your order details. 
          (This is a simulation, so no email will actually be sent.)
        </p>
      </div>

      <div className="space-y-3 sm:space-y-0 sm:space-x-4">
        <Link href="/products" className="inline-block px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow hover:shadow-lg">
          Continue Shopping
        </Link>
        <Link href="/account/orders" className="inline-block px-8 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors shadow hover:shadow-lg">
          View My Orders
        </Link> 
        {/* "/account/orders" page doesn't exist yet, but link is aspirational */}
      </div>
    </div>
  );
};

export default OrderSuccessPage;
