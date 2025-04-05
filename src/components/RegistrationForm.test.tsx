import React from 'react';
import { render, screen } from '@testing-library/react';
import RegistrationForm from './RegistrationForm';
import type { Event } from '@/lib/supabaseClient'; // Assuming Event type is needed

// Define the extended type locally or import if shared
interface EventWithCount extends Event {
  participant_count: number;
}

// Mock data for testing
const mockEvents: EventWithCount[] = [
  { id: 1, name: 'Improv Basics', date: '2025-04-10T10:00:00Z', price: 100, max_capacity: 10, participant_count: 5, created_at: '', details: null, time: null },
  { id: 2, name: 'Advanced Scenes', date: '2025-04-12T14:00:00Z', price: 150, max_capacity: 2, participant_count: 2, created_at: '', details: null, time: null }, // Full event
];

const mockInitialError = null;

describe('RegistrationForm', () => {
  it('renders the form with initial events', () => {
    render(
      <RegistrationForm
        initialEvents={mockEvents}
        initialError={mockInitialError}
      />
    );

    // Check for key elements to ensure basic rendering
    expect(screen.getByLabelText(/First Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Last Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Instagram/i)).toBeInTheDocument(); // Check optional field too
    expect(screen.getByRole('heading', { name: /Select Event/i })).toBeInTheDocument();

    // Check if events are rendered (using text content)
    expect(screen.getByText(/Improv Basics/i)).toBeInTheDocument();
    expect(screen.getByText(/Advanced Scenes.*\(Full\)/i)).toBeInTheDocument(); // Check for full event indicator

    // Check for the submit button
    expect(screen.getByRole('button', { name: /Proceed to Payment/i })).toBeInTheDocument();
  });

  // More tests will go here...
});
