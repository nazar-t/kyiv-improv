import React from 'react';
import { getDictionary } from '@/lib/getDictionary';
import { supabaseServer } from '@/lib/supabaseServerClient';
import type { RegistrableItem } from '@/lib/supabaseClient';
import HomePageClient from "@/app/[lang]/HomePageClient"

async function getHomepageData(): Promise<RegistrableItem[]> {
  try {
    const { data: eventsData, error: eventsError } = await supabaseServer
      .from('Events')
      .select('*')
      .gte('date', new Date().toISOString().slice(0, 10))
      .order('date', { ascending: true });

    if (eventsError) throw eventsError;
    if (!eventsData) return []; 
    const countPromises = eventsData.map(event =>
      supabaseServer.rpc('get_participant_count', { p_event_id: event.id })
    );
    const countResults = await Promise.all(countPromises);
    const items: RegistrableItem[] = eventsData.map((event, index) => {
      const participantCount = countResults[index].data ?? 0;
      return {
        ...event,
        participant_count: participantCount,
        itemType: 'event',
        date: event.date,
      };
    });
    console.log("Server: Fetched and processed homepage events successfully.");
    return items;

  } catch (err) {
    console.error("Server: An error occurred fetching homepage data:", err);
    return [];
  }
}

interface PageProps {
  params: {
    lang: string;
  };
}

export default async function HomePage({ params }: PageProps) {
  const { lang } = params;
  const [dict, items] = await Promise.all([
    getDictionary(lang),
    getHomepageData()
  ]);
  return (
    <HomePageClient items={items} dict={dict} />
  );
}