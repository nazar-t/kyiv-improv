'use client';

import React from 'react';
import type { Event } from '@/lib/supabaseClient';
import { Dictionary } from '@/lib/getDictionary';

interface InfoModalProps {
  item: Event | null;
  onClose: () => void;
  dict: Dictionary;
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

export default function InfoModal({ item, onClose, dict }: InfoModalProps) {
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
        <p className="text-lg text-gray-700">{formatEventDate(item.date, dict)}, {formatTime(item.time, item.duration, dict)}</p>
        <p className="text-lg text-gray-700 mb-4">{item.price} {dict.courses_page.currency}</p>
        <hr className="mb-4" />
        <div className="text-gray-800 space-y-2">
                    <p>{item.details || dict.info_modal.details_soon}</p>
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