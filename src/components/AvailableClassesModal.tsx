'use client';

import React, { useState, useEffect } from 'react';
import { Dictionary } from '@/lib/getDictionary';
import { createClient } from '@/lib/supabaseClient';

interface AvailableClassesModalProps {
  courseType: string | null;
  onClose: () => void;
  onSelectClass: (selectedClass: any) => void;
  dict: Dictionary;
}

export default function AvailableClassesModal({ courseType, onClose, onSelectClass, dict }: AvailableClassesModalProps) {
  const [availableClasses, setAvailableClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const supabase = createClient();
  useEffect(() => {
    if (courseType) {
      const fetchClasses = async () => {
        setLoading(true);
        console.log('Fetching classes for course type:', courseType);
        const { data, error } = await supabase
          .from('Courses')
          .select('*')
          .eq('type', courseType);

        if (error) {
          console.error('Error fetching classes:', error);
        } else {
          console.log('Fetched classes:', data);
          setAvailableClasses(data);
        }
        setLoading(false);
      };

      fetchClasses();
    }
  }, [courseType]);

  if (!courseType) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm z-50 flex justify-center items-center"
         onClick={onClose}>
      <div className="relative bg-white p-6 rounded-lg shadow-xl text-gray-800" onClick={e => e.stopPropagation()}>
        <h2 className="text-2xl font-russo text-gray-900 mb-4">{dict.courses_page.available_classes}</h2>
        {loading ? (
          <p>Loading classes...</p>
        ) : (
          <ul className="space-y-4">
            {availableClasses.map((c) => (
              <li key={c.id} className="border p-4 rounded-lg cursor-pointer hover:bg-gray-100" onClick={() => onSelectClass(c)}>
                <p>Every {c.day_of_week} | {c.time} | {c.instructor} | {c.location}</p>
              </li>
            ))}
          </ul>
        )}
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-600 hover:text-gray-900">
            {/* Simple SVG for a close icon */}
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>
    </div>
  );
}