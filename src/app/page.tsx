import React from 'react';
import RegistrationForm from '@/components/RegistrationForm'; // Import the form component

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start pt-12 px-4 sm:px-8 bg-gray-100"> {/* Adjusted padding/alignment */}
      <div className="w-full max-w-2xl bg-white p-6 sm:p-8 rounded-lg shadow-md">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-gray-800">
          Improv & Debate Club Registration
        </h1>
        <RegistrationForm /> {/* Render the form component */}
      </div>
    </main>
  );
}
