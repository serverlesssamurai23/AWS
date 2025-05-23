'use client';
import React from 'react';
import { useRouter } from 'next/navigation';

const AdminLoginPage = () => {
    const router = useRouter();
    const handleLogin = () => {
        // Simulate login
        localStorage.setItem('isAdminLoggedIn', 'true');
        alert('Admin login simulated successfully!');
        router.replace('/admin/dashboard'); // Use replace to avoid login page in history
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="p-8 bg-white rounded-lg shadow-xl max-w-sm w-full">
                <h1 className="text-2xl font-bold text-center text-gray-700 mb-6">OptiCart Admin Login</h1>
                <form onSubmit={(e) => {e.preventDefault(); handleLogin();}} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-600">Email</label>
                        <input type="email" name="email" id="email" required className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" defaultValue="admin@example.com"/>
                    </div>
                    <div>
                        <label htmlFor="password"className="block text-sm font-medium text-gray-600">Password</label>
                        <input type="password" name="password" id="password" required className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" defaultValue="password"/>
                    </div>
                    <button type="submit" className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
                        Login
                    </button>
                </form>
                 <p className="text-xs text-gray-500 mt-4 text-center">This is a simulated login for development.</p>
            </div>
        </div>
    );
};

export default AdminLoginPage;
