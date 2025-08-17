'use client';

import React, { useState, useEffect } from 'react';
import { Dictionary } from '@/lib/getDictionary';
import { supabase } from '@/lib/supabaseClient';
import { ClockIcon, MapPinIcon, UserIcon } from '@heroicons/react/24/outline';
import Button from './Button';
import { Course } from '@/lib/supabaseClient';

interface AvailableClassesModalProps {
  courseType: string | null;
  onClose: () => void;
  onSelectClass: (selectedClass: Course) => void;
  dict: Dictionary;
}

export default function AvailableClassesModal({ courseType, onClose, onSelectClass, dict }: AvailableClassesModalProps) {
  const [availableClasses, setAvailableClasses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedClassId, setSelectedClassId] = useState<number | null>(null);

  useEffect(() => {
    let isMounted = true;
    if (courseType) {
      const fetchClasses = async () => {
        setLoading(true);
        const currentDate = new Date().toISOString().split('T')[0];
        const { data, error } = await supabase
          .from('Courses')
          .select('*')
          .eq('level', courseType === 'beginner' ? 1 : 2)
          .gte('end date', currentDate);

        if (isMounted) {
          if (error) {
            console.error('Error fetching classes:', error);
          } else {
            setAvailableClasses(data);
          }
          setLoading(false);
        }
      };

      fetchClasses();
    }

    return () => {
      isMounted = false;
    };
  }, [courseType]);

  if (!courseType) return null;

  const handleSelect = () => {
    const selectedClass = availableClasses.find(c => c.id === selectedClassId);
    if (selectedClass) {
      onSelectClass(selectedClass);
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

  const getEndTime = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    const date = new Date();
    date.setHours(hours + 3, minutes);
    return date.toTimeString().slice(0, 5);
  };

  const formatTime = (time: string) => {
    return time.slice(0, 5);
  }

  return (
    <div className="fixed inset-0 backdrop-blur-sm z-50 flex justify-center items-center"
         onClick={onClose}>
      <div className="relative bg-white p-6 rounded-lg shadow-xl text-gray-800 max-w-lg w-full" onClick={e => e.stopPropagation()}>
        <h2 className="text-2xl font-russo text-gray-900 mb-4">{dict.courses_page.available_classes}</h2>
        {loading ? (
          <p>Loading classes...</p>
        ) : availableClasses.length > 0 ? (
          <ul className="space-y-4">
            {availableClasses.map((c) => (
              <li key={c.id}
                  className={`border p-4 rounded-lg cursor-pointer hover:bg-yellow-100 ${selectedClassId === c.id ? 'bg-yellow-200' : ''}`}
                  onClick={() => setSelectedClassId(c.id)}>
                <div className="flex items-center mb-2 font-bold">
                  <ClockIcon className="h-6 w-6 mr-2" />
                  <p>{dict.lang === 'ua' ? getDayOfWeek(c.day_of_week) : `Every ${getDayOfWeek(c.day_of_week)}`}, {formatTime(c.time)}-{getEndTime(c.time)}</p>
                </div>
                <div className="flex items-center">
                  <MapPinIcon className="h-6 w-6 mr-2 text-red-500" />
                  <p>{c.location}</p>
                  <UserIcon className="h-6 w-6 mx-2" />
                  <p>{c.instructor}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>{dict.courses_page.no_upcoming_courses}</p>
        )}
        <div className="flex justify-end mt-4">
          <Button onClick={handleSelect}
                  disabled={!selectedClassId}
                  className="bg-accent-yellow text-primary-black font-russo py-2 px-4 rounded hover:bg-yellow-600 transition-colors duration-200 disabled:opacity-50">
            {dict.courses_page.select_class}
          </Button>
        </div>
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-600 hover:text-gray-900">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>
    </div>
  );
}