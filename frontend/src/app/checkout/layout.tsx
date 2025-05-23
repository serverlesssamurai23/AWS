'use client'; // If CheckoutProgress or other children use client hooks
import React from 'react';
import Link from 'next/link';
import CheckoutProgress from '@/components/checkout/CheckoutProgress'; // Adjust path
import { useCartStore } from '@/store/cartStore'; // To potentially restrict access if cart is empty
import { useRouter }  from 'next/navigation';

export default function CheckoutAreaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { items } = useCartStore();
  const router = useRouter();

  // Redirect to cart if cart is empty and not already on success page or similar
  // This is a basic check; more robust checks might be needed for specific pages
  React.useEffect(() => {
    if (items.length === 0 && typeof window !== 'undefined' && !window.location.pathname.includes('/checkout/success')) { // Example condition
      // alert("Your cart is empty. Redirecting to cart page.");
      // router.push('/cart');
      // For now, let's allow access for development, but this logic is important.
      console.warn("Checkout accessed with an empty cart. This would normally redirect.");
    }
  }, [items, router]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-blue-600">OptiCart</Link>
          <div className="text-lg font-semibold">Secure Checkout</div>
        </div>
      </header>
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <CheckoutProgress />
        {children}
      </main>
      <footer className="text-center p-4 text-sm text-gray-500 border-t mt-auto">
        &copy; {new Date().getFullYear()} OptiCart. All rights reserved.
      </footer>
    </div>
  );
}
