'use client';
import React, { useState } from 'react';
import Button from '@/components/Button';
import SectionWrapper from '@/components/SectionWrapper';
import RegistrationModal from '@/components/RegistrationModal';
import AvailableClassesModal from '@/components/AvailableClassesModal';

interface CoursesPageClientProps {
  dict: any;
}

export default function CoursesPageClient({ dict }: CoursesPageClientProps) {
  const [showAvailableClasses, setShowAvailableClasses] = useState<boolean>(false);
  const [selectedClass, setSelectedClass] = useState<any | null>(null);

  const handleSelectClass = (c: any) => {
    setSelectedClass(c);
    setShowAvailableClasses(false);
  };

  const beginnerCurriculum = Object.keys(dict.courses_page)
    .filter(key => key.startsWith('beginner_curriculum_week'))
    .map(key => dict.courses_page[key]);

  const advancedCurriculum = Object.keys(dict.courses_page)
    .filter(key => key.startsWith('advanced_curriculum_week'))
    .map(key => dict.courses_page[key]);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Beginner Improv */}
      <SectionWrapper className="mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="flex flex-col bg-gray-200 text-text-dark p-6 rounded-lg h-96">
            <h2 className="text-3xl font-russo text-accent-yellow mb-4">{dict.courses_page.beginner_improv_title}</h2>
            <p className="mb-4">{dict.homepage.beginner_improv_description}</p>
            <p className="mb-4"><span className="font-bold">{dict.courses_page.price}:</span> 4999 ₴</p>
            <p className="mb-4"><span className="font-bold">{dict.courses_page.duration}:</span> 8 weeks</p>
            <Button onClick={() => setShowAvailableClasses(true)} className="bg-accent-yellow text-primary-black mt-auto">
              {dict.courses_page.available_classes}
            </Button>
          </div>
          <img src="https://picsum.photos/600/400" alt={dict.courses_page.beginner_improv_title} className="rounded-lg mb-4 h-96 object-cover" />
        </div>
      </SectionWrapper>

      {/* Advanced Improv */}
      <SectionWrapper className="mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <img src="https://picsum.photos/600/400" alt={dict.courses_page.advanced_improv_title} className="rounded-lg mb-4 h-96 object-cover" />
          <div className="flex flex-col bg-gray-200 text-text-dark p-6 rounded-lg h-96">
            <h2 className="text-3xl font-russo text-accent-yellow mb-4">{dict.courses_page.advanced_improv_title}</h2>
            <p className="mb-4">{dict.homepage.advanced_improv_description}</p>
            <p className="mb-4"><span className="font-bold">{dict.courses_page.price}:</span> 4999 ₴</p>
            <p className="mb-4"><span className="font-bold">{dict.courses_page.duration}:</span> 8 weeks</p>
            <Button className="bg-gray-400 text-gray-800 cursor-not-allowed mt-auto" disabled>{dict.courses_page.coming_soon}</Button>
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
