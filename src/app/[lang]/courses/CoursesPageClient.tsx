"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import { Dictionary } from '@/lib/getDictionary';
import { Course } from '@/lib/supabaseClient';
import Button from '@/components/Button';
import SectionWrapper from '@/components/SectionWrapper';
import RegistrationModal from '@/components/RegistrationModal';
import AvailableClassesModal from '@/components/AvailableClassesModal';

interface CoursesPageClientProps {
  dict: Dictionary;
}

export default function CoursesPageClient({ dict }: CoursesPageClientProps) {
  const [showAvailableClasses, setShowAvailableClasses] = useState<boolean>(false);
  const [selectedClass, setSelectedClass] = useState<Course | null>(null);

  const handleSelectClass = (c: Course) => {
    setSelectedClass(c);
    setShowAvailableClasses(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Beginner Improv */}
      <SectionWrapper className="mb-16">
  {/* Apply background and padding here. Use a grid for the main layout. */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-gray-200 p-6 rounded-lg">
    <div className="flex flex-col text-text-dark">
      <h2 className="text-3xl font-russo text-red-600 mb-4">{dict.courses_page.beginner_improv_title}</h2>
      <p className="mb-4">{dict.homepage.beginner_improv_description}</p>
      <p className="mb-4"><span className="font-bold">{dict.courses_page.price}:</span> {process.env.NEXT_PUBLIC_COURSE_PRICE} ₴</p>
      <p className="mb-4"><span className="font-bold">{dict.courses_page.duration}:</span> {dict.courses_page.duration_weeks}</p>
      <Button onClick={() => setShowAvailableClasses(true)} className="mt-auto">
        {dict.courses_page.available_classes}
      </Button>
    </div>
    <div className="relative h-96">
      <Image 
        src="https://picsum.photos/600/400" 
        alt={dict.courses_page.beginner_improv_title}
        fill
        className="rounded-lg object-cover" 
      />
    </div>

  </div>
</SectionWrapper>

      {/* Advanced Improv */}
      <SectionWrapper className="mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <Image src="https://picsum.photos/600/400" alt={dict.courses_page.advanced_improv_title} className="rounded-lg mb-4 h-96 object-cover" width={600} height={400} />
          <div className="flex flex-col p-6 rounded-lg h-96">
            <h2 className="text-3xl font-russo text-red-600 mb-4">{dict.courses_page.advanced_improv_title}</h2>
            <p className="mb-4">{dict.homepage.advanced_improv_description}</p>
            <p className="mb-4"><span className="font-bold">{dict.courses_page.price}:</span> {process.env.NEXT_PUBLIC_COURSE_PRICE} {dict.courses_page.currency}</p>
            <p className="mb-4"><span className="font-bold">{dict.courses_page.duration}:</span> {dict.courses_page.duration_weeks}</p>
            <Button className="bg-gray-400 text-gray-800 mt-auto" disabled>{dict.courses_page.coming_soon}</Button>
          </div>
        </div>
      </SectionWrapper>

      {showAvailableClasses && (
        <AvailableClassesModal
          courseType="beginner"
          onClose={() => setShowAvailableClasses(false)}
          onSelectClass={handleSelectClass}
          dict={dict}
        />
      )}

      {selectedClass && (
        <RegistrationModal
          item={selectedClass}
          onClose={() => setSelectedClass(null)}
          dict={dict}
          registrationType="course"
        />
      )}
    </div>
  );
}