import React from 'react';
import Link from 'next/link';
import { supabaseServer } from '@/lib/supabaseServerClient';
import type { Course } from '@/lib/supabaseClient';
import { getDictionary, Dictionary } from '@/lib/getDictionary'; // Import dictionary utility

export const revalidate = 60; // Revalidate page every 60 seconds

interface CourseWithCount extends Course {
  participant_count: number;
}

async function getJamsWorkshopsData(lang: 'en' | 'ua'): Promise<{ // Specify exact types for lang
  jamsWorkshopsWithCounts: CourseWithCount[];
  error: string | null;
  dict: Dictionary; // Pass dictionary
}> {
  try {
    const dict = await getDictionary(lang); // Load dictionary
    console.log("Server: Fetching jams & workshops data...");
    const today = new Date();
    const twoWeeksFromNow = new Date(today);
    twoWeeksFromNow.setDate(today.getDate() + 14);
    const todayStr = today.toISOString().split('T')[0];
    const twoWeeksStr = twoWeeksFromNow.toISOString().split('T')[0];

    const { data: coursesData, error: coursesError } = await supabaseServer
      .from('Courses')
      .select('*')
      .in('type', ['jam', 'workshop']) // Filter specifically for jams and workshops
      .gte('start_date', todayStr)
      .lte('start_date', twoWeeksStr)
      .order('start_date', { ascending: true });

    if (coursesError) throw coursesError;

    const courseIds = coursesData?.map(course => course.id) || [];
    let jamsWorkshopsWithCounts: CourseWithCount[] = [];

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

      jamsWorkshopsWithCounts = coursesData.map(course => ({
        ...course,
        participant_count: courseCountsMap.get(course.id) || 0,
      }));
    } else {
        console.log("Server: No jams or workshops found.");
    }

    console.log("Server: Fetched jams & workshops data successfully.");
    return { jamsWorkshopsWithCounts, error: null, dict };

  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
    console.error("Server: Error fetching jams & workshops data:", errorMessage);
    return { jamsWorkshopsWithCounts: [], error: `Failed to load jams & workshops data: ${errorMessage}`, dict: await getDictionary(lang) };
  }
}

interface PageProps {
  params: Promise<{
    lang: string;
  }>;
}

export default async function JamsWorkshopsPage({ params }: PageProps) {
  const { lang } = await params;
  const typedLang = lang as 'en' | 'ua';
  const { jamsWorkshopsWithCounts, error, dict } = await getJamsWorkshopsData(typedLang);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-russo text-accent-yellow text-center mb-12">{dict.jams_workshops_page.title}</h1>

      <section className="mb-12">
        <h2 className="text-3xl font-russo text-text-light mb-6 text-center">{dict.jams_workshops_page.upcoming_sessions}</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        {jamsWorkshopsWithCounts.length === 0 && !error && <p className="text-text-light text-center">{dict.jams_workshops_page.no_upcoming_sessions}</p>}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jamsWorkshopsWithCounts.map(course => (
            <div key={course.id} className="bg-primary-black border border-accent-yellow p-6 rounded-lg shadow-lg">
              <h3 className="text-2xl font-russo text-accent-yellow mb-2">{course.name} ({course.type})</h3>
              <p className="text-text-light text-sm mb-2">
                {new Date(course.start_date).toLocaleDateString(lang, { month: 'long', day: 'numeric' })} - {new Date(course['end date']).toLocaleDateString(lang, { month: 'long', day: 'numeric' })}
              </p>
              <p className="text-text-light mb-4">{dict.courses_page.price}: {course.price} UAH</p>
              {typeof course.max_capacity === 'number' && (
                <p className="text-text-light text-sm mb-4">
                  {dict.homepage.spots}: {course.participant_count} / {course.max_capacity}
                  {course.participant_count >= course.max_capacity && <span className="ml-2 text-red-400">{dict.homepage.full}</span>}
                </p>
              )}
              <Link href={`/${lang}/?courseId=${course.id}`} className={`inline-block bg-accent-yellow text-primary-black font-russo py-2 px-4 rounded hover:bg-yellow-600 transition-colors duration-200 ${typeof course.max_capacity === 'number' && course.participant_count >= course.max_capacity ? 'opacity-50 cursor-not-allowed' : ''}`}
                aria-disabled={typeof course.max_capacity === 'number' && course.participant_count >= course.max_capacity}
                tabIndex={typeof course.max_capacity === 'number' && course.participant_count >= course.max_capacity ? -1 : 0}
              >
                {dict.button.sign_up}
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
