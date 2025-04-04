import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import type { Student, EventParticipant } from '@/lib/supabaseClient';

// Define the expected request body structure
interface SubmitRequestBody {
    firstName: string;
    lastName: string;
    email: string;
    instagram?: string; // Optional
    selectedEventId: number;
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

    const { firstName, lastName, email, instagram, selectedEventId } = requestBody;

    // Basic validation
    if (!firstName || !lastName || !email || !selectedEventId) {
        console.warn("Validation failed: Missing required fields");
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    try {
        console.log(`Processing registration for email: ${email}, event: ${selectedEventId}`);

        // 1. Find or Create Student
        let studentId: number;

        // Check if student exists
        const { data: existingStudent, error: findError } = await supabase
            .from('Students') // Use your actual table name
            .select('id')
            .eq('email', email)
            .maybeSingle(); // Use maybeSingle to handle 0 or 1 result without error

        if (findError) {
            console.error("Error finding student:", findError);
            throw new Error(`Error checking for existing student: ${findError.message}`);
        }

        if (existingStudent) {
            console.log(`Found existing student with ID: ${existingStudent.id}`);
            studentId = existingStudent.id;
            // Optionally, update name/instagram if they changed? For now, just use existing ID.
            // const { error: updateError } = await supabase
            //     .from('Students')
            //     .update({ first_name: firstName, last_name: lastName, instagram: instagram || null })
            //     .eq('id', studentId);
            // if (updateError) console.warn("Could not update existing student info:", updateError);

        } else {
            console.log(`Creating new student for email: ${email}`);
            // Clean instagram input before inserting
            const cleanedInstagram = instagram ? instagram.replace(/^[#@]/, '').trim() : null;
            console.log(`Creating new student for email: ${email} with cleaned instagram: ${cleanedInstagram}`);
            // Create new student if not found
            const { data: newStudent, error: createError } = await supabase
                .from('Students')
                .insert({
                    first_name: firstName,
                    last_name: lastName,
                    email: email,
                    instagram: cleanedInstagram // Use cleaned value
                })
                .select('id')
                .single(); // Expect exactly one row back

            if (createError) {
                console.error("Error creating student:", createError);
                throw new Error(`Error creating new student: ${createError.message}`);
            }
            if (!newStudent) {
                 console.error("Student creation returned no data");
                 throw new Error('Failed to create student record.');
            }
            studentId = newStudent.id;
            console.log(`Created new student with ID: ${studentId}`);
        }

        // 2. Check Event Capacity (Server-side check for race conditions)
        console.log(`Checking capacity for event ID: ${selectedEventId}`);
        const { data: eventData, error: eventError } = await supabase
            .from('Events')
            .select('max_capacity')
            .eq('id', selectedEventId)
            .single();

        if (eventError || !eventData) {
            console.error("Error fetching event capacity:", eventError);
            throw new Error(`Could not fetch event details: ${eventError?.message || 'Event not found'}`);
        }

        if (typeof eventData.max_capacity === 'number') {
            const { count: currentParticipants, error: countError } = await supabase
                .from('Event Participants')
                .select('*', { count: 'exact', head: true }) // Efficiently get count
                .eq('event_id', selectedEventId)
                .in('payment_status', ['pending', 'paid']);

            if (countError) {
                 console.error("Error counting participants:", countError);
                 throw new Error(`Could not count participants: ${countError.message}`);
            }

            console.log(`Event ${selectedEventId} capacity: ${eventData.max_capacity}, current participants: ${currentParticipants}`);
            if (currentParticipants !== null && currentParticipants >= eventData.max_capacity) {
                console.warn(`Event ${selectedEventId} is full. Capacity: ${eventData.max_capacity}, Current: ${currentParticipants}`);
                return NextResponse.json({ error: 'Sorry, this event is now full.' }, { status: 409 }); // 409 Conflict
            }
        } else {
             console.log(`Event ${selectedEventId} has no capacity limit.`);
        }


        // 3. Create Event Participant record
        console.log(`Creating participant record for student ${studentId}, event ${selectedEventId}`);
        const participantData: Omit<EventParticipant, 'id' | 'registered_at'> = {
            student_id: studentId,
            event_id: selectedEventId,
            payment_status: 'pending' // Initial status
        };

        const { data: newParticipant, error: participantError } = await supabase
            .from('Event Participants') // Use your actual table name
            .insert(participantData)
            .select() // Select the newly created record
            .single();

        if (participantError) {
            // Handle potential unique constraint violation (user already registered)
            if (participantError.code === '23505') { // PostgreSQL unique violation code
                 console.warn(`Student ${studentId} already registered for event ${selectedEventId}`);
                 return NextResponse.json({ error: 'You are already registered for this event.' }, { status: 409 });
            }
            console.error("Error creating participant record:", participantError);
            throw new Error(`Error creating participant record: ${participantError.message}`);
        }
        if (!newParticipant) {
             console.error("Participant creation returned no data");
             throw new Error('Failed to create participant record.');
        }

        console.log("Successfully created participant record:", newParticipant);

        // TODO: Add LiqPay integration here
        // 1. Get event price from eventData (fetched earlier or fetch again)
        // 2. Generate LiqPay payment parameters (amount, currency, order_id (use newParticipant.id), description, etc.)
        // 3. Generate LiqPay signature
        // 4. Return LiqPay data/signature to the frontend

        // For now, just return success
        return NextResponse.json({
            message: 'Registration successful, proceed to payment.',
            participantId: newParticipant.id // Send back the ID for reference
        }, { status: 201 }); // 201 Created

    } catch (error: any) {
        console.error("Unhandled error during submission:", error);
        return NextResponse.json({ error: error.message || 'An unexpected error occurred.' }, { status: 500 });
    }
}
