'use client'; // This component will run on the client side

import React, { useState, useEffect, FormEvent } from 'react';
import { supabase } from '@/lib/supabaseClient';
import type { Event, EventParticipant } from '@/lib/supabaseClient'; // Assuming types are defined here

// Interface to hold combined event data with participant count
interface EventWithCount extends Event {
  participant_count: number;
}

export default function RegistrationForm() {
  // State for form inputs
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [instagram, setInstagram] = useState('');
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);

  // State for events data, loading, and errors
  const [events, setEvents] = useState<EventWithCount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Fetch events and participant counts on component mount
  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Calculate date range (today to 14 days from now)
        const today = new Date();
        const twoWeeksFromNow = new Date(today);
        twoWeeksFromNow.setDate(today.getDate() + 14);

        // Format dates for Supabase query (YYYY-MM-DD)
        const todayStr = today.toISOString().split('T')[0];
        const twoWeeksStr = twoWeeksFromNow.toISOString().split('T')[0];

        // Fetch events within the date range
        const { data: eventsData, error: eventsError } = await supabase
          .from('Events') // Use your actual table name 'Events'
          .select('*')
          .gte('date', todayStr) // Greater than or equal to today
          .lte('date', twoWeeksStr) // Less than or equal to two weeks from now
          .order('date', { ascending: true });

        if (eventsError) throw eventsError;
        if (!eventsData) throw new Error('No events found.');

        // Fetch participant counts for these events
        const eventIds = eventsData.map(event => event.id);
        const { data: countsData, error: countsError } = await supabase
          .from('Event Participants') // Use your actual table name 'Event Participants'
          .select('event_id, count: student_id(count)') // Count participants per event
          .in('event_id', eventIds)
          .in('payment_status', ['pending', 'paid']); // Count pending and paid participants towards capacity

        if (countsError) throw countsError;

        // Process the counts data into a Map
        const countsMap = new Map<number, number>();
        // Adjust based on actual Supabase response structure for aggregate counts if needed
        // Assuming Supabase returns something like: [{ event_id: 1, count: 5 }, { event_id: 2, count: 10 }]
        // If the structure is different (e.g., nested), this logic needs adjustment.
        // Let's assume a simple structure for now. A common pattern might involve grouping.
        // A safer approach might be to fetch all relevant participants and count client-side,
        // or use an RPC function in Supabase for aggregation.
        // For now, let's *assume* the .select() gives us a usable count directly or needs minimal processing.
        // **REVISIT THIS LOGIC if counts are not working as expected.**
        // Process the count data based on the inferred structure { event_id: any; count: { count: number; }[]; }
        countsData?.forEach((value: { event_id: number; count: { count: number; }[] }) => {
             // Access the count from the nested array
             const count = value.count?.[0]?.count ?? 0;
             countsMap.set(value.event_id, count);
        });


        // Combine event data with counts
        const eventsWithCounts: EventWithCount[] = eventsData.map(event => ({
          ...event,
          participant_count: countsMap.get(event.id) || 0, // Use the map here
        }));

        setEvents(eventsWithCounts);

      } catch (err: any) {
        console.error("Error fetching events:", err);
        setError(err.message || 'Failed to load events. Please try refreshing.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []); // Empty dependency array means this runs once on mount

  // Format date helper
  const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      const options: Intl.DateTimeFormatOptions = {
        weekday: 'short', // e.g., 'Sat'
        day: '2-digit',   // e.g., '25'
        month: '2-digit', // e.g., '04'
      };
      // Adjust locale if needed, e.g., 'en-GB' for DD.MM
      return `${date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit' })} (${date.toLocaleDateString('en-US', { weekday: 'short' })})`;
    } catch (e) {
      console.error("Error formatting date:", dateString, e);
      return dateString; // Fallback
    }
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitStatus('submitting');
    setSubmitError(null);

    if (!selectedEventId) {
        setSubmitError('Please select an event.');
        setSubmitStatus('error');
        return;
    }

    // Find the selected event details (needed for price later)
    const selectedEvent = events.find(event => event.id === selectedEventId);
    if (!selectedEvent) {
        setSubmitError('Selected event not found.');
        setSubmitStatus('error');
        return;
    }

    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          // Clean instagram input: remove leading @ or #, trim whitespace
          instagram: instagram ? instagram.replace(/^[#@]/, '').trim() : null,
          selectedEventId,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        // Handle errors from the API (validation, capacity, etc.)
        throw new Error(result.error || `HTTP error! status: ${response.status}`);
      }

      console.log('API Success:', result);
      setSubmitStatus('success');
      // TODO: Handle successful registration (e.g., redirect to LiqPay using result.participantId and selectedEvent.price)
      // For now, we just show the success message.

      // Optionally reset form fields after successful submission
      // setFirstName('');
      // setLastName('');
      // setEmail('');
      // setInstagram('');
      // setSelectedEventId(null);

    } catch (err: any) {
      console.error('Submission failed:', err);
      setSubmitError(err.message || 'An unexpected error occurred during submission.');
      setSubmitStatus('error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Student Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name <span className="text-red-500">*</span></label>
          <input
            type="text"
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900" // Added text-gray-900
          />
        </div>
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name <span className="text-red-500">*</span></label>
          <input
            type="text"
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900" // Added text-gray-900
          />
        </div>
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email <span className="text-red-500">*</span></label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900" // Added text-gray-900
        />
      </div>
      <div>
        <label htmlFor="instagram" className="block text-sm font-medium text-gray-700">Instagram (Optional)</label> {/* Changed label */}
        <input
          type="text"
          id="instagram"
          value={instagram}
          onChange={(e) => setInstagram(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900" // Added text-gray-900
        />
      </div>

      {/* Event Selection */}
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-2">Select Event <span className="text-red-500">*</span></h2>
        {isLoading && <p className="text-gray-500">Loading events...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!isLoading && !error && events.length === 0 && <p className="text-gray-500">No upcoming events found in the next two weeks.</p>}
        {!isLoading && !error && events.length > 0 && (
          <div className="space-y-3">
            {events.map((event) => {
              // Check if max_capacity is a number before comparing
              const isFull = typeof event.max_capacity === 'number' && event.participant_count >= event.max_capacity;
              const label = `${formatDate(event.date)} ${event.name} - ${event.price} UAH ${isFull ? '(Full)' : ''}`;
              return (
                <div key={event.id} className={`flex items-center p-3 border rounded-md ${isFull ? 'bg-gray-200 opacity-70 cursor-not-allowed' : 'bg-white hover:bg-gray-50'} ${selectedEventId === event.id ? 'border-indigo-500 ring-2 ring-indigo-200' : 'border-gray-300'}`}>
                  <input
                    type="radio"
                    id={`event-${event.id}`}
                    name="eventSelection"
                    value={event.id}
                    checked={selectedEventId === event.id}
                    onChange={() => setSelectedEventId(event.id)}
                    disabled={isFull}
                    required // Ensures one option must be selected
                    className={`h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 ${isFull ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                  />
                  <label
                    htmlFor={`event-${event.id}`}
                    className={`ml-3 block text-sm font-medium ${isFull ? 'text-gray-500 cursor-not-allowed' : 'text-gray-700 cursor-pointer'}`}
                  >
                    {label}
                  </label>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Submission Button & Status */}
      <div>
        <button
          type="submit"
          disabled={isLoading || submitStatus === 'submitting' || !selectedEventId}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed" // Changed to yellow bg, black text
        >
          {submitStatus === 'submitting' ? 'Processing...' : 'Proceed to Payment'}
        </button>
        {submitStatus === 'success' && <p className="mt-2 text-center text-green-600">Registration data ready. Redirecting to payment...</p>}
        {submitStatus === 'error' && <p className="mt-2 text-center text-red-600">{submitError || 'An error occurred during submission.'}</p>}
      </div>
    </form>
  );
}
