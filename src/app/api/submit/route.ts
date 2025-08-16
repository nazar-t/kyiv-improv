import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServerClient'; // Use server client
import type { EventParticipant } from '@/lib/supabaseClient'; // Remove unused Student type
import { z } from 'zod';

// Define the Zod schema for validation
const submitSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  number: z.string().optional(),
  selectedEventId: z.number().optional(),
  selectedCourseId: z.number().optional(),
});

// Define the expected request body structure
interface SubmitRequestBody {
    firstName: string;
    lastName: string;
    email: string;
    number?: string; // Optional
    selectedEventId?: number;
    selectedCourseId?: number;
}

export async function POST(request: Request) {
    console.log("Received submission request..."); // Log entry point

    let requestBody: SubmitRequestBody;
    try {
        requestBody = await request.json();
        console.log("Request body parsed:", requestBody);
    } catch (error) {
        console.error("Error parsing request body:", error);
        return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const validationResult = submitSchema.safeParse(requestBody);

    if (!validationResult.success) {
        const errorMessages = Object.values(validationResult.error.flatten().fieldErrors).join(', ');
        return NextResponse.json({ error: errorMessages }, { status: 400 });
    }

    const { firstName, lastName, email, number, selectedEventId, selectedCourseId } = validationResult.data;

    try {
        // 1. Find or Create Customer
        let customerId: number;

        // Check if customer exists using server client
        const { data: existingCustomer, error: findError } = await supabaseServer
            .from('Customers') // Use your actual table name
            .select('id')
            .eq('email', email)
            .maybeSingle(); // Use maybeSingle to handle 0 or 1 result without error

        if (findError) {
            console.error("Error finding customer:", findError);
            throw new Error(`Error checking for existing customer: ${findError.message}`);
        }

        if (existingCustomer) {
            console.log(`Found existing customer with ID: ${existingCustomer.id}`);
            customerId = existingCustomer.id;
        } else {
            console.log(`Creating new customer for email: ${email}`);
            const { data: newCustomer, error: createError } = await supabaseServer
                .from('Customers')
                .insert({
                    first_name: firstName,
                    last_name: lastName,
                    email: email,
                    phone: number
                })
                .select('id')
                .single(); // Expect exactly one row back

            if (createError) {
                console.error("Error creating customer:", createError);
                throw new Error(`Error creating new customer: ${createError.message}`);
            }
            if (!newCustomer) {
                 console.error("Customer creation returned no data");
                 throw new Error('Failed to create customer record.');
            }
            customerId = newCustomer.id;
            console.log(`Created new customer with ID: ${customerId}`);
        }

        if (selectedEventId) {
            // Handle event registration
            console.log(`Processing event registration for email: ${email}, event: ${selectedEventId}`);
            const { data: eventData, error: eventError } = await supabaseServer
                .from('Events')
                .select('max_capacity, price')
                .eq('id', selectedEventId)
                .single();

            if (eventError || !eventData) {
                throw new Error(`Could not fetch event details: ${eventError?.message || 'Event not found'}`);
            }

            if (typeof eventData.max_capacity === 'number') {
                const { count: currentParticipants, error: countError } = await supabaseServer
                    .from('Event Participants')
                    .select('*', { count: 'exact', head: true })
                    .eq('event_id', selectedEventId)
                    .in('payment_status', ['pending', 'paid']);

                if (countError) {
                    throw new Error(`Could not count participants: ${countError.message}`);
                }

                if (currentParticipants !== null && currentParticipants >= eventData.max_capacity) {
                    return NextResponse.json({ error: 'Sorry, this event is now full.' }, { status: 409 });
                }
            }

            const { data: newParticipant, error: participantError } = await supabaseServer
                .from('Event Participants')
                .insert({ customer_id: customerId, event_id: selectedEventId, payment_status: 'paid' })
                .select()
                .single();

            if (participantError) {
                if (participantError.code === '23505') {
                    return NextResponse.json({ error: 'You are already registered for this event.' }, { status: 409 });
                }
                throw new Error(`Error creating participant record: ${participantError.message}`);
            }

        } else if (selectedCourseId) {
            // Handle course registration
            console.log(`Processing course registration for email: ${email}, course: ${selectedCourseId}`);
            const { data: courseData, error: courseError } = await supabaseServer
                .from('Courses')
                .select('max_capacity')
                .eq('id', selectedCourseId)
                .single();

            if (courseError || !courseData) {
                throw new Error(`Could not fetch course details: ${courseError?.message || 'Course not found'}`);
            }

            if (typeof courseData.max_capacity === 'number') {
                const { count: currentParticipants, error: countError } = await supabaseServer
                    .from('Course Participants')
                    .select('*', { count: 'exact', head: true })
                    .eq('course_id', selectedCourseId)
                    .in('payment_status', ['pending', 'paid']);

                if (countError) {
                    throw new Error(`Could not count participants: ${countError.message}`);
                }

                if (currentParticipants !== null && currentParticipants >= courseData.max_capacity) {
                    return NextResponse.json({ error: 'Sorry, this course is now full.' }, { status: 409 });
                }
            }

            const { data: newParticipant, error: participantError } = await supabaseServer
                .from('Course Participants')
                .insert({ student_id: customerId, course_id: selectedCourseId, payment_status: 'paid' })
                .select()
                .single();

            if (participantError) {
                if (participantError.code === '23505') {
                    return NextResponse.json({ error: 'You are already registered for this course.' }, { status: 409 });
                }
                throw new Error(`Error creating participant record: ${participantError.message}`);
            }
        }

        // For now, just return success
        return NextResponse.json({
            message: 'Registration successful'
        }, { status: 201 }); // 201 Created

    } catch (error: unknown) { // Use unknown instead of any
        const message = error instanceof Error ? error.message : 'An unexpected error occurred.';
        console.error("Unhandled error during submission:", error);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
