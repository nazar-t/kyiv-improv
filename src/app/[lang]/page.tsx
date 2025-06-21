import React from 'react';
import Card from '@/components/Card';
import SectionWrapper from '@/components/SectionWrapper';
import { supabaseServer } from '@/lib/supabaseServerClient';
import type { Event, Course } from '@/lib/supabaseClient'; // Import both Event and Course types
import { getDictionary } from '@/lib/getDictionary'; // Import getDictionary

export const revalidate = 60; // Revalidate page every 60 seconds

// Interface for combined event data with participant count (for spectator events)
interface EventWithCount extends Event {
  participant_count: number;
}

// Interface for combined course data with participant count (for student offerings)
interface CourseWithCount extends Course {
  participant_count: number;
}

async function getHomepageData(): Promise<{
  eventsWithCounts: EventWithCount[];
  coursesWithCounts: CourseWithCount[];
  error: string | null;
}> {
  try {
    console.log("Server: Fetching homepage data...");

    // --- Fetch Spectator Events ---
    const today = new Date();
    const twoWeeksFromNow = new Date(today);
    twoWeeksFromNow.setDate(today.getDate() + 14);
    const todayStr = today.toISOString().split('T')[0];
    const twoWeeksStr = twoWeeksFromNow.toISOString().split('T')[0];

    const { data: eventsData, error: eventsError } = await supabaseServer.from('Events').select('*').gte('date', todayStr).lte('date', twoWeeksStr).order('date', { ascending: true });
    if (eventsError) throw eventsError;

    const eventIds = eventsData?.map(event => event.id) || [];
    let eventsWithCounts: EventWithCount[] = [];

    if (eventIds.length > 0) {
      const { data: eventCountsData, error: eventCountsError } = await supabaseServer.from('Event Participants').select('event_id, count: student_id(count)').in('event_id', eventIds).in('payment_status', ['pending', 'paid']);
      if (eventCountsError) throw eventCountsError;

      const eventCountsMap = new Map<number, number>();
      eventCountsData?.forEach((value: { event_id: number; count: { count: number; }[] | number | null }) => {
        let count = 0;
        if (typeof value.count === 'number') {
            count = value.count;
        } else if (Array.isArray(value.count) && value.count.length > 0 && typeof value.count[0]?.count === 'number') {
            count = value.count[0].count;
        }
        eventCountsMap.set(value.event_id, count);
      });

      eventsWithCounts = eventsData.map(event => ({
        ...event,
        participant_count: eventCountsMap.get(event.id) || 0,
      }));
    } else {
        console.log("Server: No spectator events found.");
    }


    // --- Fetch Student Courses (Jams, Workshops, Courses) ---
    const { data: coursesData, error: coursesError } = await supabaseServer.from('Courses').select('*').gte('start date', todayStr).lte('start date', twoWeeksStr).order('start date', { ascending: true });
    if (coursesError) throw coursesError;

    const courseIds = coursesData?.map(course => course.id) || [];
    let coursesWithCounts: CourseWithCount[] = [];

    if (courseIds.length > 0) {
      const { data: courseCountsData, error: courseCountsError } = await supabaseServer.from('Course Participants').select('course_id, count: student_id(count)').in('course_id', courseIds).in('payment_status', ['pending', 'paid']);
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
        console.log("Server: No student courses found.");
    }

    console.log("Server: Fetched homepage data successfully.");
    return { eventsWithCounts, coursesWithCounts, error: null };

  } catch (err: unknown) {
    let errorMessage = 'An unknown error occurred';
    if (err instanceof Error) {
      errorMessage = err.message;
      console.error("Server: Detailed error object:", err); // Log the full error object
    } else if (typeof err === 'object' && err !== null && 'message' in err) {
      errorMessage = (err as { message: string }).message;
      console.error("Server: Detailed error object (non-Error instance):", err);
    }
    console.error("Server: Error fetching homepage data:", errorMessage);
    return { eventsWithCounts: [], coursesWithCounts: [], error: `Failed to load data: ${errorMessage}` };
  }
}

interface PageProps {
  params: Promise<{
    lang: string;
  }>;
}

export default async function HomePage({ params }: PageProps) {
  const { lang } = await params;
  const dict = await getDictionary(lang); // Fetch dictionary for the page
  const { eventsWithCounts, coursesWithCounts, error } = await getHomepageData();

  return (
    <div className="container mx-auto">
      
      <h1 className="text-4xl font-bold text-accent-yellow text-center mb-12">{dict.homepage.welcome_title}</h1>

      {/* Highlights Carousel Section */}
      <SectionWrapper>
        <div className="py-8"> {/* Added padding to content */}
          <h2 className="text-3xl font-bold text-text-light mb-6 text-center">{dict.homepage.highlights_carousel_title}</h2>
          <div className="bg-gray-700 h-64 flex items-center justify-center text-text-light text-xl rounded-lg">
            [Placeholder for Carousel Component]
          </div>
        </div>
      </SectionWrapper>

      {/* Event Calendar Section (from Events table) */}
      <SectionWrapper>
        <div className="py-8"> {/* Added padding to content */}
          <h2 className="text-3xl font-bold text-text-light mb-6 text-center">{dict.homepage.upcoming_spectator_events}</h2>
          {error && <p className="text-red-500 text-center">{error}</p>}
          {eventsWithCounts.length === 0 && !error && <p className="text-text-light text-center">{dict.homepage.no_upcoming_spectator_events}</p>}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {eventsWithCounts.map(event => (
              <Card
                key={event.id}
                title={event.name}
                description={`${event.date} ${event.time}\n${event.details}\n${dict.courses_page.price}: ${event.price} UAH\n${dict.homepage.spots}: ${event.participant_count} / ${event.max_capacity || 'N/A'}${typeof event.max_capacity === 'number' && event.participant_count >= event.max_capacity ? ` (${dict.homepage.full})` : ''}`}
                buttonText={dict.homepage.view_details}
                buttonLink={`/${lang}/events/${event.id}`}
                className={typeof event.max_capacity === 'number' && event.participant_count >= event.max_capacity ? 'opacity-50 cursor-not-allowed' : ''}
              />
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* Courses Section (Jams, Workshops, Courses from Courses table) */}
      <SectionWrapper>
        <div className="py-8"> {/* Added padding to content */}
          <h2 className="text-3xl font-bold text-text-light mb-6 text-center">{dict.homepage.upcoming_student_offerings}</h2>
          {error && <p className="text-red-500 text-center">{error}</p>}
          {coursesWithCounts.length === 0 && !error && <p className="text-text-light text-center">{dict.homepage.no_upcoming_student_offerings}</p>}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coursesWithCounts.map(course => (
              <Card
                key={course.id}
                title={`${course.name} (${course.type})`}
                description={`${course.start_date} - ${course.end_date}\n${dict.courses_page.price}: ${course.price} UAH\n${dict.homepage.spots}: ${course.participant_count} / ${course.max_capacity || 'N/A'}${typeof course.max_capacity === 'number' && course.participant_count >= course.max_capacity ? ` (${dict.homepage.full})` : ''}`}
                buttonText={dict.homepage.sign_up}
                buttonLink={`/${lang}/courses?courseId=${course.id}`}
                className={typeof course.max_capacity === 'number' && course.participant_count >= course.max_capacity ? 'opacity-50 cursor-not-allowed' : ''}
              />
            ))}
            {/* Hardcoded core courses can be added here if still desired, or removed */}
            <Card
              title={dict.homepage.beginner_improv_title}
              description={dict.homepage.beginner_improv_description}
              buttonText={dict.homepage.learn_more}
              buttonLink={`/${lang}/courses`}
            />
            <Card
              title={dict.homepage.advanced_improv_title}
              description={dict.homepage.advanced_improv_description}
              buttonText={dict.homepage.learn_more}
              buttonLink={`/${lang}/courses`}
            />
          </div>
        </div>
      </SectionWrapper>

      {/* FAQ Section */}
      <SectionWrapper>
        <div className="py-8"> {/* Added padding to content */}
          <h2 className="text-3xl font-bold text-text-light mb-6 text-center">{dict.faq_page.title}</h2>
          <div className="bg-gray-700 h-48 flex items-center justify-center text-text-light text-xl rounded-lg">
            [Placeholder for FAQ Content]
          </div>
        </div>
      </SectionWrapper>

      {/* Contacts Section */}
      <SectionWrapper>
        <div className="py-8"> {/* Added padding to content */}
          <h2 className="text-3xl font-bold text-text-light mb-6 text-center">{dict.homepage.contact_us_title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-700 p-6 rounded-lg text-text-light">
              <h3 className="text-xl font-bold mb-2">{dict.homepage.location_info_title}</h3>
              <p>{dict.homepage.address}: [Your Address Here]</p>
              <p>{dict.homepage.phone}: [Your Phone Here]</p>
              <p>{dict.homepage.email}: [Your Email Here]</p>
            </div>
            <div className="bg-gray-700 p-6 rounded-lg text-text-light">
              <h3 className="text-xl font-bold mb-2">{dict.homepage.newsletter_signup_title}</h3>
              <p>{dict.homepage.newsletter_signup_description}</p>
              {/* Placeholder for a simple newsletter form */}
              <form className="mt-4">
                <input
                  type="email"
                  placeholder={dict.homepage.your_email_placeholder}
                  className="w-full p-2 rounded bg-gray-800 text-text-light border border-gray-600 focus:outline-none focus:border-accent-yellow"
                />
                <button
                  type="submit"
                  className="mt-2 w-full bg-accent-yellow text-primary-black font-bold py-2 px-4 rounded hover:bg-yellow-600 transition-colors duration-200"
                >
                  {dict.homepage.subscribe_button}
                </button>
              </form>
            </div>
          </div>
        </div>
      </SectionWrapper>
    </div>
  );
}
