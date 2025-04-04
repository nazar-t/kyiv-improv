'use client'; // This component is now a Client Component receiving props

import React, { useState, FormEvent } from 'react';
// No longer need supabase client here
import type { Event } from '@/lib/supabaseClient'; // Keep Event type if needed, remove EventParticipant

// Interface for combined event data (remains the same)
interface EventWithCount extends Event {
  participant_count: number;
}

// Define props expected from the server component
interface RegistrationFormProps {
  initialEvents: EventWithCount[];
  initialError: string | null;
}

export default function RegistrationForm({ initialEvents, initialError }: RegistrationFormProps) {
  // State for form inputs (remains the same)
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [instagram, setInstagram] = useState('');
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);

  // Initialize state from props, remove client-side loading state
  const [events] = useState<EventWithCount[]>(initialEvents); // Use initialEvents directly
  const [error] = useState<string | null>(initialError); // Use initialError directly
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Remove the useEffect hook for client-side data fetching

  // Format date helper (remove unused 'options' variable)
  const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      // const options: Intl.DateTimeFormatOptions = { // Removed unused variable
      //   weekday: 'short',
      //   day: '2-digit',
      //   month: '2-digit',
      // };
      return `${date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit' })} (${date.toLocaleDateString('en-US', { weekday: 'short' })})`;
    } catch (e) {
      console.error("Error formatting date:", dateString, e);
      return dateString; // Fallback
    }
  };

  // Handle form submission (update catch block type)
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

    } catch (err: unknown) { // Use unknown instead of any
      const message = err instanceof Error ? err.message : 'An unexpected error occurred during submission.';
      console.error('Submission failed:', err);
      setSubmitError(message);
      setSubmitStatus('error');
    }
  };

  // Determine loading state based on initial props (no client-side loading needed)
  const isLoading = false; // Data is pre-fetched

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
