'use client'; // Needed if any child components or this layout uses client hooks
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation'; // For active link styling

// Simple admin authentication check (replace with real auth in a real app)
const useAdminAuth = () => {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // Simulate checking admin auth status (e.g., from a token, cookie, or API)
    // For now, let's use a simple localStorage flag for simulation.
    // In a real app, NEVER rely solely on localStorage for security.
    const adminFlag = typeof window !== 'undefined' ? localStorage.getItem('isAdminLoggedIn') : null;
    if (adminFlag === 'true') {
      setIsAdminAuthenticated(true);
    } else {
        // For development, let's default to authenticated to bypass login for now.
        // In production, this should default to false and redirect.
        // setIsAdminAuthenticated(false); 
        // router.replace('/admin/login'); // if not authenticated and loading is done
        console.warn("Admin area accessed without explicit login. Defaulting to authenticated for DEV.");
        setIsAdminAuthenticated(true); // DEV ONLY
    }
    setLoading(false);
  }, []);
  return { isAdminAuthenticated, loading };
};


const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const { isAdminAuthenticated, loading } = useAdminAuth(); // Basic auth check

  const navItems = [
    { name: 'Dashboard', href: '/admin/dashboard' },
    { name: 'Products', href: '/admin/products' },
    { name: 'Categories', href: '/admin/categories' },
    { name: 'Orders', href: '/admin/orders' }, // Placeholder for future
    // { name: 'Users', href: '/admin/users' }, // Placeholder for future
  ];
  
  // Simulate an admin login page for now (conceptual)
  if (loading) return <div className="p-10 text-center">Checking admin authentication...</div>;
  if (!isAdminAuthenticated && pathname !== '/admin/login') {
    // In a real app, you'd redirect to /admin/login
    // For now, we'll just show a message if we were to enforce this.
    // router.replace('/admin/login');
     return (
        <div className="p-10 text-center">
            <p>Access Denied. Please log in as an administrator.</p>
            <Link href="/admin/login" className="text-blue-500 hover:underline">Go to Admin Login</Link>
            <p className="text-xs mt-4">(Login page is conceptual for now)</p>
        </div>
    );
  }


  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-6 space-y-4 fixed h-full shadow-lg">
        <h1 className="text-2xl font-semibold mb-6">OptiCart Admin</h1>
        <nav>
          {navItems.map(item => (
            <Link
              key={item.name}
              href={item.href}
              className={`block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700
                ${pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/admin/dashboard') ? 'bg-gray-900' : ''}`}
            >
              {item.name}
            </Link>
          ))}
        </nav>
         <div className="mt-auto pt-6">
            <Link href="/" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 text-sm">
                &larr; Back to Main Site
            </Link>
             <button 
                onClick={() => { 
                    if (typeof window !== 'undefined') localStorage.removeItem('isAdminLoggedIn'); 
                    // router.replace('/admin/login');
                    alert("Simulated Admin Logout. (Login page is conceptual)");
                }}
                className="w-full mt-2 text-left block py-2.5 px-4 rounded transition duration-200 hover:bg-red-700 text-sm"
            >
                Logout Admin
            </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 sm:p-10 ml-64 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
