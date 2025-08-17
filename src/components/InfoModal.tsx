'use client';

import React from 'react';
import type { Event } from '@/lib/supabaseClient';

interface InfoModalProps {
  item: Event | null;
  onClose: () => void;
}

export default function InfoModal({ item, onClose }: InfoModalProps) {
  if (!item) return null;

  return (
    <div 
      className="fixed inset-0 backdrop-blur-sm z-50 flex justify-center items-center"
      onClick={onClose}
    >
      <div 
        className="relative bg-white p-6 rounded-lg shadow-xl text-gray-800 max-w-lg w-full" 
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-2xl font-russo text-gray-900 mb-2">{item.name}</h2>
        <p className="text-lg text-gray-700 mb-4">{item.price} UAH</p>
        <hr className="mb-4" />
        <div className="text-gray-800 space-y-2">
          <p><strong>Date:</strong> {item.date}</p>
          <p>{item.details || 'More details will be available soon.'}</p>
          <p><strong>Duration</strong>: 2 months, 8 classes, 3 hours each</p>
        </div>
        <button 
          onClick={onClose} 
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>
    </div>
  );
}