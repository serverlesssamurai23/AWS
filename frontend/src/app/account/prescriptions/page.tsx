'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getMyPrescriptions, UserPrescription, deleteMyPrescription } from '@/services/api'; // Adjust path

const MyPrescriptionsPage = () => {
  const [prescriptions, setPrescriptions] = useState<UserPrescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPrescriptions = async () => {
    setLoading(true);
    setError(null);
    try {
      // Authentication: This assumes a token is stored (e.g., in localStorage)
      // and getMyPrescriptions handles sending it.
      // If no token, the API call should fail or this page should redirect to login.
      const data = await getMyPrescriptions();
      setPrescriptions(data);
    } catch (err: any) {
      if (err.status === 401) {
        setError("You are not authorized. Please log in.");
        // Optionally redirect to login: router.push('/login');
      } else {
        setError(err.message || 'Failed to fetch prescriptions.');
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this prescription?')) {
      try {
        await deleteMyPrescription(id);
        // Refetch or filter out the deleted prescription from state
        setPrescriptions(prev => prev.filter(p => p.id !== id));
      } catch (err: any) {
        setError(err.message || 'Failed to delete prescription.');
        console.error(err);
      }
    }
  };

  if (loading) return <p className="text-center py-10">Loading your prescriptions...</p>;
  if (error) return <p className="text-center text-red-500 py-10">Error: {error}</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Prescriptions</h1>
        <Link href="/account/prescriptions/add" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
          Add New Prescription
        </Link>
      </div>
      {prescriptions.length === 0 ? (
        <p>You have no saved prescriptions.</p>
      ) : (
        <div className="space-y-4">
          {prescriptions.map((rx) => (
            <div key={rx.id} className="p-4 border rounded-lg shadow-sm bg-white">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-semibold text-blue-700">{rx.prescription_name || `Prescription for ${rx.patient_name}`}</h2>
                  <p className="text-sm text-gray-600">Type: {rx.prescription_type}</p>
                  <p className="text-sm text-gray-600">Patient: {rx.patient_name}</p>
                  <p className="text-sm text-gray-600">Date: {new Date(rx.prescription_date).toLocaleDateString()}</p>
                  {rx.expiry_date && <p className="text-sm text-gray-500">Expires: {new Date(rx.expiry_date).toLocaleDateString()}</p>}
                </div>
                <div className="space-x-2 flex-shrink-0">
                  <Link href={`/account/prescriptions/${rx.id}/edit`} className="text-sm text-blue-500 hover:underline">Edit</Link>
                  <button onClick={() => handleDelete(rx.id)} className="text-sm text-red-500 hover:underline">Delete</button>
                </div>
              </div>
              <details className="mt-2 text-sm">
                <summary className="cursor-pointer text-gray-500">View Details</summary>
                <div className="mt-2 p-3 bg-gray-50 rounded">
                  <p><strong>Right Eye (OD):</strong> SPH: {rx.sphere_right} {rx.cylinder_right ? `CYL: ${rx.cylinder_right}` : ''} {rx.axis_right ? `AXIS: ${rx.axis_right}` : ''} {rx.add_right ? `ADD: ${rx.add_right}` : ''}</p>
                  <p><strong>Left Eye (OS):</strong> SPH: {rx.sphere_left} {rx.cylinder_left ? `CYL: ${rx.cylinder_left}` : ''} {rx.axis_left ? `AXIS: ${rx.axis_left}` : ''} {rx.add_left ? `ADD: ${rx.add_left}` : ''}</p>
                  {rx.pd_both && <p><strong>PD (Both):</strong> {rx.pd_both} mm</p>}
                  {(rx.pd_left && rx.pd_right) && <p><strong>PD (Right/Left):</strong> {rx.pd_right} mm / {rx.pd_left} mm</p>}
                  {/* Add more fields like prism, notes if needed */}
                </div>
              </details>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyPrescriptionsPage;
