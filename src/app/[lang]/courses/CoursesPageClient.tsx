'use client';
import React, { useState } from 'react';
import Button from '@/components/Button';
import SectionWrapper from '@/components/SectionWrapper';
import RegistrationModal from '@/components/RegistrationModal';
import AvailableClassesModal from '@/components/AvailableClassesModal';
import { Course } from '@/lib/supabaseClient';

interface CoursesPageClientProps {
  courses: Course[];
  dict: any;
}

export default function CoursesPageClient({ courses, dict }: CoursesPageClientProps) {
  const [selectedCourseType, setSelectedCourseType] = useState<string | null>(null);
  const [showAvailableClasses, setShowAvailableClasses] = useState<boolean>(false);
  const [selectedClass, setSelectedClass] = useState<any | null>(null);

  const handleSelectClass = (c: any) => {
    setSelectedClass(c);
    setShowAvailableClasses(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {courses.map((course, index) => (
        <SectionWrapper key={course.id} className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="flex flex-col">
              <img src={} alt={} className="rounded-lg mb-4" />
              <h2 className="text-3xl font-russo text-accent-yellow mb-4">{}</h2>
              <p className="text-text-light mb-4">{course.description}</p>
              <p className="text-text-light mb-4"><span className="font-bold">{dict.courses_page.price}:</span> 4999 UAH</p>
              <p className="text-text-light mb-4"><span className="font-bold">{dict.courses_page.duration}:</span> {course.duration}</p>
              {course.type === 'advanced' ? (
                <Button className="bg-gray-400 text-gray-800 cursor-not-allowed" disabled>{dict.courses_page.coming_soon}</Button>
              ) : (
                <Button onClick={() => {
                  setSelectedCourseType(course.type);
                  setShowAvailableClasses(true);
                }} className="bg-accent-yellow text-primary-black">
                  {dict.courses_page.see_classes}
                </Button>
              )}
            </div>

            {/* Right Column */}
            <div>
              <h3 className="text-2xl font-russo text-accent-yellow mb-4">{dict.courses_page.curriculum}:</h3>
              <ul className="list-disc list-inside text-text-light">
                {course.curriculum.map((item: string, index: number) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </SectionWrapper>
      ))}

      {showAvailableClasses && (
        <AvailableClassesModal
          courseType={selectedCourseType}
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
