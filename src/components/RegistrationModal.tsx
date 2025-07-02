'use client';

import React from 'react';
import RegistrationForm from './RegistrationForm';
import type { RegistrableItem } from '@/lib/supabaseClient';
import { Dictionary } from '@/lib/getDictionary';

interface RegistrationModalProps {
  item: RegistrableItem | null;
  onClose: () => void;
  dict: Dictionary;
}

export default function RegistrationModal({ item, onClose, dict }: RegistrationModalProps) {
  if (!item) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center"
         onClick={onClose}>
      <div className="relative" onClick={e => e.stopPropagation()}>
        <RegistrationForm item={item} onClose={onClose} dict={dict} />
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-600 hover:text-gray-900">
            {/* Simple SVG for a close icon */}
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>
    </div>
  );
}