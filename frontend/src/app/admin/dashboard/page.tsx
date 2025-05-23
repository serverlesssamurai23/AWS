'use client';
import React from 'react';

const AdminDashboardPage = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Example Stats Cards - these would fetch real data */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Total Products</h2>
          <p className="text-3xl font-bold text-blue-600">150</p> {/* Mock */}
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Total Orders</h2>
          <p className="text-3xl font-bold text-green-600">320</p> {/* Mock */}
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Pending Issues</h2>
          <p className="text-3xl font-bold text-red-600">5</p> {/* Mock */}
        </div>
      </div>
      <p className="mt-8 text-gray-600">Welcome to the OptiCart Admin Panel. From here you can manage products, categories, orders, and more.</p>
    </div>
  );
};

export default AdminDashboardPage;
