import React from 'react';
import Link from 'next/link';
import { supabaseServer } from '@/lib/supabaseServerClient';
import type { Event } from '@/lib/supabaseClient';
import { getDictionary, Dictionary } from '@/lib/getDictionary'; // Import dictionary utility

export const revalidate = 60; // Revalidate page every 60 seconds

interface EventWithCount extends Event {
  participant_count: number;
}

async function getShowsData(lang: 'en' | 'ua'): Promise<{ // Specify exact types for lang
  showsWithCounts: EventWithCount[];
  error: string | null;
  dict: Dictionary; // Pass dictionary with explicit type
}> {
  try {
    const dict = await getDictionary(lang); // Load dictionary
    console.log("Server: Fetching shows data...");
    const today = new Date();
    const twoWeeksFromNow = new Date(today);
    twoWeeksFromNow.setDate(today.getDate() + 14);
    const todayStr = today.toISOString().split('T')[0];
    const twoWeeksStr = twoWeeksFromNow.toISOString().split('T')[0];

    const { data: eventsData, error: eventsError } = await supabaseServer
      .from('Events')
      .select('*')
      .eq('type', 'show') // Filter specifically for shows
      .gte('date', todayStr)
      .lte('date', twoWeeksStr)
      .order('date', { ascending: true });

    if (eventsError) throw eventsError;

    const eventIds = eventsData?.map(event => event.id) || [];
    let showsWithCounts: EventWithCount[] = [];

    if (eventIds.length > 0) {
      const { data: eventCountsData, error: eventCountsError } = await supabaseServer
        .from('Event Participants')
        .select('event_id, count: student_id(count)')
        .in('event_id', eventIds)
        .in('payment_status', ['pending', 'paid']);

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

      showsWithCounts = eventsData.map(event => ({
        ...event,
        participant_count: eventCountsMap.get(event.id) || 0,
      }));
    } else {
        console.log("Server: No shows found.");
    }

    console.log("Server: Fetched shows data successfully.");
    return { showsWithCounts, error: null, dict };

  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
    console.error("Server: Error fetching shows data:", errorMessage);
    return { showsWithCounts: [], error: `Failed to load shows data: ${errorMessage}`, dict: await getDictionary(lang) };
  }
}

interface PageProps {
  params: Promise<{
    lang: string;
  }>;
}

export default async function ShowsPage({ params }: PageProps) {
  const { lang } = await params;
  const typedLang = lang as 'en' | 'ua';
  const { showsWithCounts, error, dict } = await getShowsData(typedLang);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-russo text-accent-yellow text-center mb-12">{dict.shows_page.title}</h1>

      <section className="mb-12">
        <h2 className="text-3xl font-russo text-text-light mb-6 text-center">{dict.shows_page.public_performances}</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        {showsWithCounts.length === 0 && !error && <p className="text-text-light text-center">{dict.shows_page.no_upcoming_shows}</p>}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {showsWithCounts.map(event => (
            <div key={event.id} className="bg-primary-black border border-accent-yellow p-6 rounded-lg shadow-lg">
              <h3 className="text-2xl font-russo text-accent-yellow mb-2">{event.name}</h3>
              <p className="text-text-light text-sm mb-2">
                {new Date(event.date).toLocaleDateString(lang, { month: 'long', day: 'numeric' })} {event.time}
              </p>
              <p className="text-text-light mb-4">Price: {event.price} UAH</p>
              {typeof event.max_capacity === 'number' && (
                <p className="text-text-light text-sm mb-4">
                  {dict.homepage.spots}: {event.participant_count} / {event.max_capacity}
                  {event.participant_count >= event.max_capacity && <span className="ml-2 text-red-400">{dict.homepage.full}</span>}
                </p>
              )}
              <Link href={`/${lang}/events/${event.id}`} className={`inline-block bg-accent-yellow text-primary-black font-russo py-2 px-4 rounded hover:bg-yellow-600 transition-colors duration-200 ${typeof event.max_capacity === 'number' && event.participant_count >= event.max_capacity ? 'opacity-50 cursor-not-allowed' : ''}`}
                aria-disabled={typeof event.max_capacity === 'number' && event.participant_count >= event.max_capacity}
                tabIndex={typeof event.max_capacity === 'number' && event.participant_count >= event.max_capacity ? -1 : 0}
              >
                {dict.button.learn_more}
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
