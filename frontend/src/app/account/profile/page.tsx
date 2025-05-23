'use client';
import React, { useState, useEffect } from 'react';
// import { useAuthStore } from '@/store/authStore'; // Assuming an auth store for user info
// For now, simulate user data or get from localStorage if login was simulated to store it there

interface UserProfileData {
  firstName: string;
  lastName: string;
  email: string;
}

const ProfilePage = () => {
  // const { user, updateUserProfile, changePassword } = useAuthStore(); // Example if using auth store
  const [profileData, setProfileData] = useState<UserProfileData>({
    firstName: 'Test', // Mock data
    lastName: 'User',  // Mock data
    email: 'test.user@example.com', // Mock data
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [profileMessage, setProfileMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);

  // Simulate fetching user data on load
  useEffect(() => {
    // In a real app, fetch from API or get from auth store
    // const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser') || '{}');
    // if(loggedInUser.email) {
    //    setProfileData({ 
    //        firstName: loggedInUser.firstName || 'Test', 
    //        lastName: loggedInUser.lastName || 'User', 
    //        email: loggedInUser.email 
    //    });
    // }
    console.log("Profile page loaded, using mock data for now.");
  }, []);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProfileLoading(true);
    setProfileMessage(null);
    // Simulate API Call
    console.log('Updating profile with:', profileData);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay
    // try {
    //   await updateUserProfile(profileData); // From auth store/API service
    //   setProfileMessage({ type: 'success', text: 'Profile updated successfully!' });
    // } catch (error: any) {
    //   setProfileMessage({ type: 'error', text: error.message || 'Failed to update profile.' });
    // }
    setProfileMessage({ type: 'success', text: 'Profile update simulated successfully!' });
    // localStorage.setItem('loggedInUser', JSON.stringify(profileData)); // Update mock local storage
    setIsProfileLoading(false);
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      setPasswordMessage({ type: 'error', text: 'New passwords do not match.' });
      return;
    }
    if (passwordData.newPassword.length < 6) {
      setPasswordMessage({ type: 'error', text: 'New password must be at least 6 characters.' });
      return;
    }
    setIsPasswordLoading(true);
    setPasswordMessage(null);
    // Simulate API Call
    console.log('Changing password with:', { current: '***', new: '***' }); // Don't log actual passwords
    await new Promise(resolve => setTimeout(resolve, 1000));
    // try {
    //   await changePassword(passwordData); // From auth store/API service
    //   setPasswordMessage({ type: 'success', text: 'Password changed successfully!' });
    //   setPasswordData({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
    // } catch (error: any) {
    //   setPasswordMessage({ type: 'error', text: error.message || 'Failed to change password.' });
    // }
    setPasswordMessage({ type: 'success', text: 'Password change simulated successfully!' });
    setPasswordData({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
    setIsPasswordLoading(false);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Profile Details</h1>
      
      {/* Profile Update Form */}
      <form onSubmit={handleProfileSubmit} className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Update Your Information</h2>
        {profileMessage && (
          <div className={`p-3 mb-4 rounded-md text-sm ${profileMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {profileMessage.text}
          </div>
        )}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
              <input type="text" name="firstName" id="firstName" value={profileData.firstName} onChange={handleProfileChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" required />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
              <input type="text" name="lastName" id="lastName" value={profileData.lastName} onChange={handleProfileChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" required />
            </div>
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
            <input type="email" name="email" id="email" value={profileData.email} onChange={handleProfileChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" required />
          </div>
          <div>
            <button type="submit" disabled={isProfileLoading} className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors">
              {isProfileLoading ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </div>
        </div>
      </form>

      {/* Change Password Form */}
      <form onSubmit={handlePasswordSubmit} className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Change Password</h2>
        {passwordMessage && (
          <div className={`p-3 mb-4 rounded-md text-sm ${passwordMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {passwordMessage.text}
          </div>
        )}
        <div className="space-y-4">
          <div>
            <label htmlFor="currentPassword"className="block text-sm font-medium text-gray-700">Current Password</label>
            <input type="password" name="currentPassword" id="currentPassword" value={passwordData.currentPassword} onChange={handlePasswordChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" required />
          </div>
          <div>
            <label htmlFor="newPassword"className="block text-sm font-medium text-gray-700">New Password</label>
            <input type="password" name="newPassword" id="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" required />
          </div>
          <div>
            <label htmlFor="confirmNewPassword"className="block text-sm font-medium text-gray-700">Confirm New Password</label>
            <input type="password" name="confirmNewPassword" id="confirmNewPassword" value={passwordData.confirmNewPassword} onChange={handlePasswordChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" required />
          </div>
          <div>
            <button type="submit" disabled={isPasswordLoading} className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors">
              {isPasswordLoading ? 'Changing...' : 'Change Password'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProfilePage;
