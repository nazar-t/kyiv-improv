import React from 'react';
import { getDictionary } from '@/lib/getDictionary';
import { supabaseServer } from '@/lib/supabaseServerClient';
import type { Event } from '@/lib/supabaseClient';
import HomePageClient from "@/app/[lang]/HomePageClient";

export const revalidate = 300;

import type { EventWithCount } from '@/lib/supabaseClient';

async function getHomepageData(lang: string): Promise<EventWithCount[]> {
  try {
    const { data: eventsData, error: eventsError } = await supabaseServer
      .from('Events')
      .select('*')
      .gte('date', new Date().toISOString().slice(0, 10))
      .order('date', { ascending: true });

    if (eventsError) throw eventsError;
    if (!eventsData) return [];

    const items: EventWithCount[] = await Promise.all(
      eventsData.map(async (event) => {
        const { data: participantCount, error } = await supabaseServer.rpc('get_participant_count', { p_event_id: event.id });
        if (error) {
          console.error(`Failed to get participant count for event ${event.id}:`, error);
          // Depending on desired behavior, you could return a default or skip this event
        }

        const isSoldOut = event.max_capacity !== null && (participantCount || 0) >= event.max_capacity;
        const translatedDetails = (event.details && typeof event.details === 'object' && event.details[lang])
          ? event.details[lang]
          : (event.details && typeof event.details === 'object' && Object.values(event.details)[0]) || 'Details not available.';

        return {
          ...event,
          details: translatedDetails,
          participant_count: participantCount || 0,
          isSoldOut: isSoldOut,
          itemType: 'event',
          date: event.date,
        };
      })
    );

    console.log("Server: Fetched and processed homepage events successfully.");
    return items;

  } catch (err) {
    console.error("Server: An error occurred fetching homepage data:", err);
    return [];
  }
}

interface PageProps {
  params: Promise<{
    lang: string;
  }>;
}

export default async function HomePage({ params }: PageProps) {
  const { lang } = await params;
  const [dict, items] = await Promise.all([
    getDictionary(lang),
    getHomepageData(lang)
  ]);
  return (
    <HomePageClient items={items} dict={dict} />
  );
}