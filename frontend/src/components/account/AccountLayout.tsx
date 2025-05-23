import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation'; // For active link styling

interface AccountLayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { name: 'Dashboard', href: '/account/dashboard' },
  { name: 'Order History', href: '/account/orders' }, // Assuming /account/orders page
  { name: 'My Prescriptions', href: '/account/prescriptions' },
  { name: 'Profile Details', href: '/account/profile' }, // Assuming /account/profile page
  { name: 'Saved Addresses', href: '/account/addresses' }, // Assuming /account/addresses page
  // Add more items as per UX Wireframes (e.g., Payment Methods, Communication Preferences)
];

const AccountLayout: React.FC<AccountLayoutProps> = ({ children }) => {
  const pathname = usePathname();

  return (
    <div className="container mx-auto p-4 flex flex-col md:flex-row gap-8">
      <aside className="w-full md:w-1/4 lg:w-1/5">
        <h2 className="text-xl font-semibold mb-4">My Account</h2>
        <nav className="space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`block px-4 py-2 rounded-md text-sm font-medium transition-colors
                ${pathname === item.href 
                  ? 'bg-blue-500 text-white' 
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
            >
              {item.name}
            </Link>
          ))}
           <button 
            onClick={() => { /* Implement logout logic here: remove token, redirect */ 
                if (typeof window !== 'undefined') localStorage.removeItem('authToken'); 
                window.location.href = '/'; // Redirect to homepage
            }}
            className="w-full mt-4 text-left block px-4 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-50"
          >
            Logout
          </button>
        </nav>
      </aside>
      <main className="w-full md:w-3/4 lg:w-4/5">
        {children}
      </main>
    </div>
  );
};

export default AccountLayout;
