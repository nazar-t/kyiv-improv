import React from 'react';
import RegistrationForm from '@/components/RegistrationForm';
import { supabaseServer } from '@/lib/supabaseServerClient'; // Use server client
import type { Event } from '@/lib/supabaseClient'; // Import base Event type

// Define the combined type needed for the form
interface EventWithCount extends Event {
  participant_count: number;
}

// Function to fetch data on the server
async function getEventsWithCounts(): Promise<{ eventsWithCounts: EventWithCount[]; error: string | null }> {
  try {
    console.log("Server: Fetching events...");
    // Calculate date range (today to 14 days from now)
    const today = new Date();
    const twoWeeksFromNow = new Date(today);
    twoWeeksFromNow.setDate(today.getDate() + 14);
    const todayStr = today.toISOString().split('T')[0];
    const twoWeeksStr = twoWeeksFromNow.toISOString().split('T')[0];

    // Fetch events within the date range using the server client (bypasses RLS)
    const { data: eventsData, error: eventsError } = await supabaseServer
      .from('Events')
      .select('*')
      .gte('date', todayStr)
      .lte('date', twoWeeksStr)
      .order('date', { ascending: true });

    if (eventsError) throw eventsError;
    if (!eventsData) return { eventsWithCounts: [], error: null }; // No events found is not an error

    console.log(`Server: Found ${eventsData.length} events.`);

    // Fetch participant counts for these events using the server client
    const eventIds = eventsData.map(event => event.id);
    if (eventIds.length === 0) {
        return { eventsWithCounts: [], error: null }; // No events, no need to fetch counts
    }

    console.log("Server: Fetching participant counts for event IDs:", eventIds);
    // Use the efficient count method
    const { data: countsData, error: countsError } = await supabaseServer
      .from('Event Participants')
      .select('event_id, count: student_id(count)') // Adjust if count syntax differs
      .in('event_id', eventIds)
      .in('payment_status', ['pending', 'paid']);

    if (countsError) throw countsError;
    console.log("Server: Raw counts data:", countsData);

    // Process counts into a Map
    const countsMap = new Map<number, number>();
     countsData?.forEach((value: { event_id: number; count: { count: number; }[] | number | null }) => {
        // Handle potential variations in count structure from Supabase
        let count = 0;
        if (typeof value.count === 'number') {
            count = value.count;
        } else if (Array.isArray(value.count) && value.count.length > 0 && typeof value.count[0]?.count === 'number') {
            count = value.count[0].count;
        }
        countsMap.set(value.event_id, count);
    });
    console.log("Server: Processed counts map:", countsMap);


    // Combine event data with counts
    const eventsWithCounts: EventWithCount[] = eventsData.map(event => ({
      ...event,
      participant_count: countsMap.get(event.id) || 0,
    }));

    console.log("Server: Combined events with counts:", eventsWithCounts.length);
    return { eventsWithCounts, error: null };

  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
    console.error("Server: Error fetching events data:", errorMessage);
    // Return empty array and error message to display on the page
    return { eventsWithCounts: [], error: `Failed to load event data: ${errorMessage}` };
  }
}


// Make the Page component async to fetch data
export default async function HomePage() {
  // Fetch data on the server before rendering
  const { eventsWithCounts, error } = await getEventsWithCounts();

  return (
    <main className="flex min-h-screen flex-col items-center justify-start pt-12 px-4 sm:px-8 bg-gray-100">
      <div className="w-full max-w-2xl bg-white p-6 sm:p-8 rounded-lg shadow-md">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-gray-800">
          Improv & Debate Club Registration
        </h1>
        {/* Pass fetched data and error status to the client component */}
        <RegistrationForm initialEvents={eventsWithCounts} initialError={error} />
      </div>
    </main>
  );
}
