'use client'; 
import React, { useState, useEffect, FormEvent } from 'react';
import type { RegistrableItem } from '@/lib/supabaseClient'; 
import { Dictionary } from '@/lib/getDictionary';

interface RegistrationFormProps {
  item: RegistrableItem;
  onClose: () => void;
  dict: Dictionary;
}

export default function RegistrationForm({ item, onClose, dict }: RegistrationFormProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [number, setNumber] = useState(''); //TODO change to phone
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(true); 

  useEffect(() => {
    const savedData = localStorage.getItem('userDetails');
    if (savedData) {
      const { firstName, lastName, email, phone } = JSON.parse(savedData);
      setFirstName(firstName);
      setLastName(lastName);
      setEmail(email);
      setNumber(phone);
    }
  }, []); 

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitStatus('submitting');
    setSubmitError(null);
    try { 
        // The API call now sends the item's ID and its type
        const response = await fetch('/api/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            firstName,
            lastName,
            email,
            number,
            selectedEventId: item.id, // Send the type to the API
          }),
        });

        const result = await response.json();
        if (!response.ok) throw new Error(result.error);
        
        // On success, redirect to LiqPay
        if (result.liqpayData && result.liqpaySignature) {
            setSubmitStatus('success');
            onClose();
            // (Your LiqPay redirect logic here)
        } else {
            throw new Error('LiqPay data was not received.');
        }

      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'An unexpected error occurred.';
        setSubmitError(message);
        setSubmitStatus('error');
      }
  };

  return (
     <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-xl text-gray-800">
        <h2 className="text-2xl font-bold text-gray-900">{item.name}</h2>
        <p className="text-lg">{item.price} UAH</p>
        <hr/>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name <span className="text-red-500">*</span></label>
          <input
            type="text"
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900" // Added text-gray-900
          />
        </div>
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name <span className="text-red-500">*</span></label>
          <input
            type="text"
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900" // Added text-gray-900
          />
        </div>
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email <span className="text-red-500">*</span></label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900" // Added text-gray-900
        />
      </div>
      <div>
        <label htmlFor="number" className="block text-sm font-medium text-gray-700">Number <span className="text-red-500">*</span></label>
        <input
          type="text"
          id="number"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900" // Added text-gray-900
        />
      </div>
      <div className="flex items-center">
        <input
          id="remember-me"
          type="checkbox"
          checked={rememberMe}
          onChange={(e) => setRememberMe(e.target.checked)}
          className="h-4 w-4 text-yellow-500 border-gray-300 rounded"
        />
        <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
          Remember me for next time
        </label>
      </div>
      <div>
            <button type="submit" disabled={submitStatus === 'submitting'}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-yellow-400 hover:bg-yellow-500 disabled:opacity-50">
              {submitStatus === 'submitting' ? dict.form.processing : dict.form.proceed_to_payment}
            </button>
      </div>
      {submitStatus === 'error' && <p className="text-red-600">{submitError}</p>}
    </form>
  );
}
