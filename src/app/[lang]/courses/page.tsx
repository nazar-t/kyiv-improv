import React from 'react';
import Link from 'next/link';
import { supabaseServer } from '@/lib/supabaseServerClient';
import type { Course } from '@/lib/supabaseClient';
import { getDictionary } from '@/lib/getDictionary'; // Import dictionary utility

export const revalidate = 60; // Revalidate page every 60 seconds

// Interface for combined course data with participant count
interface CourseWithCount extends Course {
  participant_count: number;
}

// Function to fetch course data for the courses page
async function getCoursesPageData(lang: 'en' | 'ua'): Promise<{ // Specify exact types for lang
  coursesWithCounts: CourseWithCount[];
  error: string | null;
  dict: Awaited<ReturnType<typeof getDictionary>>; // Pass dictionary
}> {
  try {
    const dict = await getDictionary(lang); // Load dictionary
    console.log("Server: Fetching courses page data...");
    const today = new Date();
    const twoWeeksFromNow = new Date(today);
    twoWeeksFromNow.setDate(today.getDate() + 14);
    const todayStr = today.toISOString().split('T')[0];
    const twoWeeksStr = twoWeeksFromNow.toISOString().split('T')[0];

    const { data: coursesData, error: coursesError } = await supabaseServer
      .from('Courses')
      .select('*')
      .gte('start_date', todayStr)
      .lte('start_date', twoWeeksStr)
      .order('start_date', { ascending: true });

    if (coursesError) throw coursesError;

    const courseIds = coursesData?.map(course => course.id) || [];
    let coursesWithCounts: CourseWithCount[] = [];

    if (courseIds.length > 0) {
      const { data: courseCountsData, error: courseCountsError } = await supabaseServer
        .from('Course Participants')
        .select('course_id, count: student_id(count)')
        .in('course_id', courseIds)
        .in('payment_status', ['pending', 'paid']);

      if (courseCountsError) throw courseCountsError;

      const courseCountsMap = new Map<number, number>();
      courseCountsData?.forEach((value: { course_id: number; count: { count: number; }[] | number | null }) => {
        let count = 0;
        if (typeof value.count === 'number') {
            count = value.count;
        } else if (Array.isArray(value.count) && value.count.length > 0 && typeof value.count[0]?.count === 'number') {
            count = value.count[0].count;
        }
        courseCountsMap.set(value.course_id, count);
      });

      coursesWithCounts = coursesData.map(course => ({
        ...course,
        participant_count: courseCountsMap.get(course.id) || 0,
      }));
    } else {
        console.log("Server: No courses found for courses page.");
    }

    console.log("Server: Fetched courses page data successfully.");
    return { coursesWithCounts, error: null, dict };

  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
    console.error("Server: Error fetching courses page data:", errorMessage);
    return { coursesWithCounts: [], error: `Failed to load courses data: ${errorMessage}`, dict: await getDictionary(lang) };
  }
}

export default async function CoursesPage({ params: { lang } }: { params: { lang: 'en' | 'ua' } }) {
  const { coursesWithCounts, error, dict } = await getCoursesPageData(lang);

  // Hardcoded course details (as per plan)
  const coreCourses = [
    {
      id: 1, // Placeholder ID, adjust if you have actual IDs for these
      name: dict.courses_page.beginner_improv_title,
      description: dict.homepage.beginner_improv_description,
      curriculum: [
        dict.courses_page.beginner_curriculum_week_1,
        dict.courses_page.beginner_curriculum_week_2,
        dict.courses_page.beginner_curriculum_week_3,
        dict.courses_page.beginner_curriculum_week_4,
        dict.courses_page.beginner_curriculum_week_5,
        dict.courses_page.beginner_curriculum_week_6
      ],
      price: 2500, // Example price
      times: dict.courses_page.beginner_times,
    },
    {
      id: 2, // Placeholder ID
      name: dict.courses_page.advanced_improv_title,
      description: dict.homepage.advanced_improv_description,
      curriculum: [
        dict.courses_page.advanced_curriculum_week_1,
        dict.courses_page.advanced_curriculum_week_2,
        dict.courses_page.advanced_curriculum_week_3,
        dict.courses_page.advanced_curriculum_week_4,
        dict.courses_page.advanced_curriculum_week_5,
        dict.courses_page.advanced_curriculum_week_6
      ],
      price: 3500, // Example price
      times: dict.courses_page.advanced_times,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-accent-yellow text-center mb-12">{dict.courses_page.title}</h1>

      {/* Core Courses Section (Hardcoded details) */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-text-light mb-6 text-center">{dict.courses_page.core_curriculum}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {coreCourses.map(course => (
            <div key={course.id} className="bg-primary-black border border-accent-yellow p-6 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold text-accent-yellow mb-4">{course.name}</h3>
              <p className="text-text-light mb-4">{course.description}</p>
              <h4 className="text-xl font-bold text-accent-yellow mb-2">{dict.courses_page.curriculum}:</h4>
              <ul className="list-disc list-inside text-text-light mb-4">
                {course.curriculum.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
              <p className="text-text-light mb-2">**{dict.courses_page.price}:** {course.price} UAH</p>
              <p className="text-text-light mb-4">**{dict.courses_page.times}:** {course.times}</p>
              {/* Link to main registration form, potentially pre-selecting a course if we implement that */}
              <Link href={`/${lang}/`} className="inline-block bg-accent-yellow text-primary-black font-bold py-2 px-4 rounded hover:bg-yellow-600 transition-colors duration-200">
                {dict.courses_page.sign_up_for_this_course}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Upcoming Jams & Workshops (from Courses table, dynamic) */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-text-light mb-6 text-center">{dict.courses_page.upcoming_jams_workshops}</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        {coursesWithCounts.length === 0 && !error && <p className="text-text-light text-center">{dict.courses_page.no_upcoming_jams_workshops}</p>}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coursesWithCounts
            .filter(course => course.type === 'jam' || course.type === 'workshop') // Filter by type
            .map(course => (
            <div key={course.id} className="bg-primary-black border border-accent-yellow p-6 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold text-accent-yellow mb-2">{course.name} ({course.type})</h3>
              <p className="text-text-light text-sm mb-2">
                {course.start_date} - {course.end_date}
              </p>
              <p className="text-text-light mb-4">{dict.courses_page.price}: {course.price} UAH</p>
              {typeof course.max_capacity === 'number' && (
                <p className="text-text-light text-sm mb-4">
                  {dict.homepage.spots}: {course.participant_count} / {course.max_capacity}
                  {course.participant_count >= course.max_capacity && <span className="ml-2 text-red-400">{dict.homepage.full}</span>}
                </p>
              )}
              {/* Link to main registration form, potentially pre-selecting this course */}
              <Link href={`/${lang}/?courseId=${course.id}`} className={`inline-block bg-accent-yellow text-primary-black font-bold py-2 px-4 rounded hover:bg-yellow-600 transition-colors duration-200 ${typeof course.max_capacity === 'number' && course.participant_count >= course.max_capacity ? 'opacity-50 cursor-not-allowed' : ''}`}
                aria-disabled={typeof course.max_capacity === 'number' && course.participant_count >= course.max_capacity}
                tabIndex={typeof course.max_capacity === 'number' && course.participant_count >= course.max_capacity ? -1 : 0}
              >
                {dict.homepage.sign_up}
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
