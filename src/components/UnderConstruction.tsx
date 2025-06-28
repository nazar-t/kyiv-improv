import React from 'react';
import Image from 'next/image'

const UnderConstruction: React.FC = () => {
  return (
    <div className="bg-primary-black font-sans flex items-center justify-center min-h-screen">
      <div className="bg-white rounded-lg p-8 md:p-12 mx-4 max-w-lg w-full text-center">
        <div className="mb-6 flex justify-center">
            <Image src="/logo.png" alt="Company Logo" width={150} height={150} className="object-contain"/>        
          </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          Сайт у розробці
        </h1>
        <p className="text-gray-600 mb-6 text-lg">
          Скоро зустрінемось!
        </p>
        <div className="border-t border-gray-200 pt-6">
            <p className="text-sm text-gray-500">
                &copy; {new Date().getFullYear()} All Rights Reserved.
            </p>
        </div>
      </div>
    </div>
  );
}

export default UnderConstruction;
