'use client';
import React from 'react';
import PrescriptionForm from '@/components/prescriptions/PrescriptionForm'; // Adjust path
import { useRouter } from 'next/navigation';

const AddPrescriptionPage = () => {
  const router = useRouter();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Add New Prescription</h1>
         <button onClick={() => router.back()} className="text-sm text-blue-500 hover:underline">
          &larr; Back to My Prescriptions
        </button>
      </div>
      <PrescriptionForm 
        onSave={() => {
          // Could show a success message before redirecting
          router.push('/account/prescriptions');
        }} 
      />
    </div>
  );
};

export default AddPrescriptionPage;
