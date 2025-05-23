'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import PrescriptionForm from '@/components/prescriptions/PrescriptionForm'; // Adjust path
import { getMyPrescriptionById, UserPrescription } from '@/services/api'; // Adjust path

const EditPrescriptionPage = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string; // Type assertion

  const [prescription, setPrescription] = useState<UserPrescription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const fetchPrescription = async () => {
        setLoading(true);
        setError(null);
        try {
          const data = await getMyPrescriptionById(id);
          setPrescription(data);
        } catch (err: any) {
          setError(err.message || `Failed to fetch prescription with ID: ${id}.`);
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchPrescription();
    }
  }, [id]);

  if (loading) return <p className="text-center py-10">Loading prescription details...</p>;
  if (error) return <p className="text-center text-red-500 py-10">Error: {error}</p>;
  if (!prescription) return <p className="text-center py-10">Prescription not found.</p>;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Edit Prescription</h1>
        <button onClick={() => router.push('/account/prescriptions')} className="text-sm text-blue-500 hover:underline">
            &larr; Back to My Prescriptions
        </button>
      </div>
      <PrescriptionForm 
        initialData={prescription}
        onSave={() => {
          // Could show a success message before redirecting
          router.push('/account/prescriptions');
        }}
      />
    </div>
  );
};

export default EditPrescriptionPage;
