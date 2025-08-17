import React from 'react';
import Link from 'next/link';
import { supabaseServer } from '@/lib/supabaseServerClient';
import type { Course } from '@/lib/supabaseClient';
import { getDictionary, Dictionary } from '@/lib/getDictionary'; 
/*
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
        .select('course_id, count: customer_id(count)')
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
*/
interface PageProps {
  params: Promise<{
    dict: Dictionary;
    lang: string;
  }>;
}

export default async function JamsWorkshopsPage({ params }: PageProps) {
  const { dict,lang } = await params;
  const typedLang = lang as 'en' | 'ua';
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-russo text-accent-yellow text-center mb-12">{dict.jams_workshops_page.title}</h1>
    </div>
  );
}
