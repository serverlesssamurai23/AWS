// In frontend/src/components/layout/Navbar.tsx
'use client'; // Required if Navbar uses client-side hooks like from Zustand
import Link from 'next/link';
import { useCartStore } from '@/store/cartStore'; // Adjust path
import { FaShoppingCart, FaUserCircle } from 'react-icons/fa'; // Example icons

const Navbar = () => {
  const totalItems = useCartStore(state => state.getTotalItems()); // Get live item count

  return (
    <nav className="bg-gray-100 p-4 shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-blue-600">OptiCart</Link>
        <ul className="hidden md:flex items-center space-x-6">
          <li><Link href="/categories/prescription-glasses" className="hover:text-blue-500">Prescription Glasses</Link></li>
          <li><Link href="/categories/contact-lenses" className="hover:text-blue-500">Contact Lenses</Link></li>
          <li><Link href="/categories/sunglasses" className="hover:text-blue-500">Sunglasses</Link></li>
          <li><Link href="/categories/accessories" className="hover:text-blue-500">Accessories</Link></li>
          <li><Link href="/education" className="hover:text-blue-500">Eye Health</Link></li>
        </ul>
        <div className="flex items-center space-x-5">
          <input type="text" placeholder="Search products..." className="hidden lg:block p-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"/>
          <Link href="/account/dashboard" className="hover:text-blue-500 flex items-center" title="My Account">
            <FaUserCircle size={24} />
            <span className="ml-1 hidden md:inline">Account</span>
          </Link>
          <Link href="/cart" className="hover:text-blue-500 flex items-center" title="Shopping Cart">
            <FaShoppingCart size={24} />
            {totalItems > 0 && (
              <span className="ml-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
            <span className="ml-1 hidden md:inline">Cart</span>
          </Link>
        </div>
      </div>
      {/* Optional: Mobile navigation bar or search bar can be added here */}
    </nav>
  );
};

export default Navbar;
