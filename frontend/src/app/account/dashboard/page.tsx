'use client';
import React from 'react';

const AccountDashboardPage = () => {
  // In a real app, fetch user data or display summary info
  // const [user, setUser] = useState(null);
  // useEffect(() => { /* fetch user data */ }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Account Dashboard</h1>
      <p className="mb-4">Welcome to your account dashboard!</p>
      <p className="mb-2">From here you can manage your orders, prescriptions, profile details, and more.</p>
      {/* Add quick links or summary boxes here */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <div className="p-4 bg-gray-50 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Recent Orders</h3>
          <p className="text-sm text-gray-600">You have no recent orders.</p> {/* Placeholder */}
          {/* <Link href="/account/orders" className="text-blue-500 hover:underline">View all orders</Link> */}
        </div>
        <div className="p-4 bg-gray-50 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Saved Prescriptions</h3>
          <p className="text-sm text-gray-600">You have no saved prescriptions.</p> {/* Placeholder */}
          {/* <Link href="/account/prescriptions" className="text-blue-500 hover:underline">Manage prescriptions</Link> */}
        </div>
      </div>
    </div>
  );
};

export default AccountDashboardPage;
