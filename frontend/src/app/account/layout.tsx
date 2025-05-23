// This file will apply the AccountLayout to all child routes of /account
'use client'; // AccountLayout uses usePathname, so this needs to be a client component boundary
import React from 'react';
import AccountLayout from '@/components/account/AccountLayout'; // Adjust path as needed

export default function AccountAreaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Here you might add logic to check if user is authenticated.
  // If not, redirect to login page. For now, we assume authenticated.
  // Example:
  // useEffect(() => {
  //   const token = localStorage.getItem('authToken');
  //   if (!token) {
  //     router.push('/login'); // Assuming you have a login page at /login
  //   }
  // }, [router]);


  return <AccountLayout>{children}</AccountLayout>;
}
