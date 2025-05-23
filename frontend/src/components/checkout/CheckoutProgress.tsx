'use client';
import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link'; // Allow navigation to previous steps if desired

interface Step {
  name: string;
  path: string;
}

const steps: Step[] = [
  { name: 'Shipping', path: '/checkout/shipping' },
  { name: 'Payment', path: '/checkout/payment' },
  { name: 'Review Order', path: '/checkout/review' },
];

const CheckoutProgress: React.FC = () => {
  const pathname = usePathname();
  const currentStepIndex = steps.findIndex(step => pathname === step.path);

  return (
    <nav aria-label="Checkout progress" className="mb-8 p-4 bg-gray-100 rounded-lg">
      <ol className="flex items-center justify-center space-x-2 sm:space-x-4">
        {steps.map((step, index) => (
          <li key={step.name} className="flex items-center">
            {index < currentStepIndex ? (
              // Completed step
              <Link href={step.path} className="flex flex-col items-center text-center text-blue-600 hover:text-blue-800">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-full flex items-center justify-center text-white">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <span className="mt-1 text-xs sm:text-sm font-medium">{step.name}</span>
              </Link>
            ) : index === currentStepIndex ? (
              // Current step
              <div className="flex flex-col items-center text-center text-blue-600">
                <div className="w-8 h-8 sm:w-10 sm:h-10 border-2 border-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold">{index + 1}</span>
                </div>
                <span className="mt-1 text-xs sm:text-sm font-medium">{step.name}</span>
              </div>
            ) : (
              // Upcoming step
              <div className="flex flex-col items-center text-center text-gray-500">
                <div className="w-8 h-8 sm:w-10 sm:h-10 border-2 border-gray-400 rounded-full flex items-center justify-center">
                  <span className="text-gray-400">{index + 1}</span>
                </div>
                <span className="mt-1 text-xs sm:text-sm font-medium">{step.name}</span>
              </div>
            )}
            {index < steps.length - 1 && (
              <svg className="w-5 h-5 text-gray-300 mx-2 sm:mx-4 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
              </svg>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default CheckoutProgress;
