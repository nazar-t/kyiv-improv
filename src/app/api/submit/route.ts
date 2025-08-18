import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServerClient';
import { z } from 'zod';
import crypto from 'crypto-js';

// Define the Zod schema for validation
const submitSchema = z.object({
  firstName: z.string().min(2, { message: "First name is required" }),
  lastName: z.string().min(2, { message: "Last name is required" }),
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
    number?: string;
    selectedEventId?: number;
    selectedCourseId?: number;
}

interface LiqpayParams {
  action: 'pay' | 'hold' | 'subscribe';
  amount: number;
  currency: 'UAH' | 'USD' | 'EUR';
  description: string;
  order_id: string;
  version: string;
  public_key: string;
  result_url: string;
  server_url: string;
}

// Liqpay helper function
const createSignature = (privateKey: string, data: string): string => {
    const sha1 = crypto.SHA1(privateKey + data + privateKey);
    return crypto.enc.Base64.stringify(sha1);
};

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL;
// const BASE_URL = process.env.NEXT_PUBLIC_VERCEL_URL 
//   ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` 
//   : `${process.env.NEXT_PUBLIC_BASE_URL}`;

async function handleRegistration(
    customerId: number,
    itemId: number,
    type: 'event' | 'course'
) {
    const tableName = type === 'course' ? 'Course Participants' : 'Event Participants';
    const idColumn = type === 'course' ? 'course_id' : 'event_id';

    // Check if the user is already registered with a 'paid' status
    const { data: existingPaidParticipant, error: existingPaidParticipantError } = await supabaseServer
        .from(tableName)
        .select('customer_id')
        .eq('customer_id', customerId)
        .eq(idColumn, itemId)
        .eq('payment_status', 'paid')
        .maybeSingle();

    if (existingPaidParticipantError) {
        throw new Error(`Could not check for existing participant: ${existingPaidParticipantError.message}`);
    }

    if (existingPaidParticipant) {
        return NextResponse.json({ error: `You are already registered for this ${type}.` }, { status: 409 });
    }

    // Clean up any previous pending registrations for this user and item
    await supabaseServer
        .from(tableName)
        .delete()
        .eq('customer_id', customerId)
        .eq(idColumn, itemId)
        .eq('payment_status', 'pending');

    // Insert the new participant record
    const { error: insertError } = await supabaseServer
        .from(tableName)
        .insert({ customer_id: customerId, [idColumn]: itemId, payment_status: 'pending' });

    if (insertError) {
        throw new Error(`Could not create participant: ${insertError.message}`);
    }
}

export async function POST(request: Request) {
    console.log("Received submission request...");

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
        const { data: existingCustomer, error: findError } = await supabaseServer
            .from('Customers')
            .select('id')
            .eq('email', email)
            .maybeSingle();

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
                .insert({ first_name: firstName, last_name: lastName, email: email, phone: number })
                .select('id')
                .single();

            if (createError) {
                console.error("Error creating customer:", createError);
                throw new Error(`Error creating new customer: ${createError.message}`);
            }
            if (!newCustomer) {
                 console.error("Customer creation returned no data");
                 throw new Error('Failed to create new record.');
            }
            customerId = newCustomer.id;
            console.log(`Created new customer with ID: ${customerId}`);
        }

        let liqpayParams: LiqpayParams;
        if (selectedEventId) {
            console.log(`Processing event registration for email: ${email}, event: ${selectedEventId}`);
            const { data: eventData, error: eventError } = await supabaseServer
                .from('Events')
                .select('name, price, max_capacity')
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
            
            const registrationResult = await handleRegistration(customerId, selectedEventId, 'event');
            if (registrationResult) {
                return registrationResult;
            }
            
            liqpayParams = {
                action: 'pay',
                amount: eventData.price,
                currency: 'UAH',
                description: eventData.name,
                order_id: `event_${customerId}_${selectedEventId}`,
                version: '3',
                public_key: (process.env.LIQPAY_PUBLIC_KEY!),
                result_url: `${BASE_URL}/payment-success`,
                server_url: `${BASE_URL}/api/payment-callback`,
            };

        } else if (selectedCourseId) {
            console.log(`Processing course registration for email: ${email}, course: ${selectedCourseId}`);
            const { data: courseData, error: courseError } = await supabaseServer
                .from('Courses')
                .select('max_capacity, level')
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

            const registrationResult = await handleRegistration(customerId, selectedCourseId, 'course');
            if (registrationResult) {
                return registrationResult;
            }
            
            liqpayParams = {
                action: 'pay',
                amount: parseFloat(process.env.NEXT_PUBLIC_COURSE_PRICE!),
                currency: 'UAH',
                description: `Курс імпровізації - Рівень ${courseData.level}`,
                order_id: `course_${customerId}_${selectedCourseId}`,
                version: '3',
                public_key: (process.env.LIQPAY_PUBLIC_KEY!),
                result_url: `${BASE_URL}/payment-success`,
                server_url: `${BASE_URL}/api/payment-callback`,
            };
        } else {
            throw new Error("A selectedEventId or selectedCourseId must be provided.");
        }

        const data = Buffer.from(JSON.stringify(liqpayParams)).toString('base64');
        const signature = createSignature(process.env.LIQPAY_PRIVATE_KEY!, data);

        return NextResponse.json({
            message: 'Registration successful, proceeding to payment.',
            data: data,
            signature: signature,
        }, { status: 201 });

    } catch (error: unknown) { 
        const message = error instanceof Error ? error.message : 'An unexpected error occurred.';
        console.error("Unhandled error during submission:", error);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}