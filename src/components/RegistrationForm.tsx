'use client'; 
import React, { useState, useEffect, FormEvent } from 'react';
import { Dictionary } from '@/lib/getDictionary';
import Button from './Button';
import { Course, Event } from '@/lib/supabaseClient';

interface RegistrationFormProps {
  item: Course | Event;
  onClose: () => void;
  dict: Dictionary;
  registrationType: 'event' | 'course';
}

interface RegistrationPayload {
  firstName: string;
  lastName: string;
  email: string;
  number: string;
  selectedEventId?: number;
  selectedCourseId?: number;
}

// This is for the data sent FROM your API back TO the form
interface ApiResponse {
  data?: string;
  signature?: string;
  error?: string;
}

const formatEventDate = (date: string, dict: Dictionary) => {
  const d = new Date(date);
  const dayOfMonth = d.getDate();
  const month = d.getMonth();
  const dayOfWeek = d.toLocaleDateString(dict.lang === 'ua' ? 'uk-UA' : 'en-US', { weekday: 'short' }).toUpperCase();
  
  if (dict.lang === 'ua') {
    const monthGenitive = dict.months_genitive[month];
    return `${dayOfMonth} ${monthGenitive}, ${dayOfWeek}`;
  }
  
  const monthName = d.toLocaleDateString('en-US', { month: 'long' });
  return `${dayOfMonth} ${monthName}, ${dayOfWeek}`;
};

const formatTime = (time: string, duration: number | null, dict: Dictionary) => {
  if (!time) return '';
  const [hours, minutes] = time.split(':').map(Number);
  const startTime = new Date();
  startTime.setHours(hours, minutes, 0);

  let endTime;
  if (duration) {
    endTime = new Date(startTime.getTime() + duration * 60000);
  }

  const options: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit' };
  const formattedStartTime = startTime.toLocaleTimeString(dict.lang === 'ua' ? 'uk-UA' : 'en-US', options);
  const formattedEndTime = endTime ? endTime.toLocaleTimeString(dict.lang === 'ua' ? 'uk-UA' : 'en-US', options) : '';

  return formattedEndTime ? `${formattedStartTime}-${formattedEndTime}` : formattedStartTime;
};

export default function RegistrationForm({item, dict, registrationType }: RegistrationFormProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [number, setNumber] = useState('');
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
        const body: RegistrationPayload = {
            firstName,
            lastName,
            email,
            number,
        };

        if (registrationType === 'event') {
            body.selectedEventId = item.id;
        } else {
            body.selectedCourseId = item.id;
        }

        const response = await fetch('/api/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });

        const result:ApiResponse = await response.json();
        if (!response.ok) throw new Error(result.error);
        
        // --- NEW: LIQPAY REDIRECT LOGIC ---
        // Check for the data and signature from the API response
        if (result.data && result.signature) {
            if (rememberMe) {
                localStorage.setItem('userDetails', JSON.stringify({ firstName, lastName, email, phone: number }));
            } else {
                localStorage.removeItem('userDetails');
            }
            setSubmitStatus('success');
            
            // Create a hidden form to post to LiqPay's checkout URL
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = 'https://www.liqpay.ua/api/3/checkout';
            form.acceptCharset = 'utf-8';
            
            const dataInput = document.createElement('input');
            dataInput.type = 'hidden';
            dataInput.name = 'data';
            dataInput.value = result.data;
            form.appendChild(dataInput);
            
            const signatureInput = document.createElement('input');
            signatureInput.type = 'hidden';
            signatureInput.name = 'signature';
            signatureInput.value = result.signature;
            form.appendChild(signatureInput);
            
            // Append the form to the body and submit it, which will redirect the user
            document.body.appendChild(form);
            form.submit();
        } else {
            // If the API doesn't return the LiqPay data, something went wrong
            throw new Error('LiqPay data was not received from the server.');
        }

      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'An unexpected error occurred.';
        setSubmitError(message);
        setSubmitStatus('error');
      }
  };

  const getDayOfWeek = (day: number) => {
    const days = dict.lang === 'ua' ? dict.days_of_week_accusative : dict.days_of_week;
    switch (day) {
      case 0: return days.sunday;
      case 1: return days.monday;
      case 2: return days.tuesday;
      case 3: return days.wednesday;
      case 4: return days.thursday;
      case 5: return days.friday;
      case 6: return days.saturday;
      default: return '';
    }
  };

  const isCourse = (item: Course | Event): item is Course => registrationType === 'course';

  let title;
  if (isCourse(item)) {
    title = item.level === 2 ? dict.courses_page.advanced_improv_title : dict.courses_page.beginner_improv_title;
  } else {
    title = item.name;
  }

  return (
     <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-xl text-gray-800">
        <h2 className="text-2xl font-russo text-gray-900">{title}</h2>
        {isCourse(item) ? (
          <>
            {item.day_of_week !== null && item.day_of_week !== undefined && item.time &&
              <p className="text-lg font-bold">{getDayOfWeek(item.day_of_week)}, {formatTime(item.time, null, dict)}</p>
            }
            <p className="text-lg font-bold">{process.env.NEXT_PUBLIC_COURSE_PRICE}{dict.lang==='en'? ' UAH': ' грн'}</p>
          </>
        ) : (
          <p className="text-lg font-bold">{formatEventDate(item.date, dict)}, {formatTime(item.time, (item as Event).duration, dict)}</p>
        )}
        <hr/>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">{dict.form.first_name} <span className="text-red-500">*</span></label>
          <input
            type="text"
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
          />
        </div>
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">{dict.form.last_name} <span className="text-red-500">*</span></label>
          <input
            type="text"
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
          />
        </div>
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">{dict.form.email} <span className="text-red-500">*</span></label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
        />
      </div>
      <div>
        <label htmlFor="number" className="block text-sm font-medium text-gray-700">{dict.form.number} <span className="text-red-500">*</span></label>
        <input
          type="text"
          id="number"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
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
          {dict.form.remember_me}
        </label>
      </div>
      <div>
            <Button type="submit" disabled={submitStatus === 'submitting'}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-yellow-400 hover:bg-yellow-500 disabled:opacity-50">
              {submitStatus === 'submitting' ? dict.form.processing : dict.form.proceed_to_payment}
            </Button>
      </div>
      {submitStatus === 'error' && <p className="text-red-600">{submitError}</p>}
    </form>
  );
}