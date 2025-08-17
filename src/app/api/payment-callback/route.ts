import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServerClient';
import crypto from 'crypto-js';

// Helper function to create the LiqPay signature for verification
const createSignature = (privateKey: string, data: string): string => {
    const sha1 = crypto.SHA1(privateKey + data + privateKey);
    return crypto.enc.Base64.stringify(sha1);
};

export async function POST(request: Request) {
    console.log("Received LiqPay callback request...");

    try {
        const formData = await request.formData();
        const data = formData.get('data') as string;
        const signature = formData.get('signature') as string;

        if (!data || !signature) {
            console.error("LiqPay callback: Missing data or signature.");
            return NextResponse.json({ error: 'Missing data or signature' }, { status: 400 });
        }

        // 1. Verify the signature
        const expectedSignature = createSignature(process.env.LIQPAY_PRIVATE_KEY!, data);
        if (expectedSignature !== signature) {
            console.error("LiqPay callback: Invalid signature.");
            return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
        }

        // 2. Decode the data
        const decodedData = JSON.parse(Buffer.from(data, 'base64').toString('utf-8'));
        console.log("LiqPay callback data:", decodedData);

        const { order_id, status } = decodedData;

        if (!order_id || !status) {
            console.error("LiqPay callback: Missing order_id or status in decoded data.");
            return NextResponse.json({ error: 'Missing order_id or status' }, { status: 400 });
        }
        
        // 3. Determine if it's a course or event and update the database
        const [type, customerId, itemId] = order_id.split('_');
        const dbStatus = (status === 'success' || status === 'subscribed') ? 'paid' : status;
        
        let updateError = null;

        if (type === 'course') {
            const { error } = await supabaseServer
                .from('Course Participants')
                .update({ payment_status: dbStatus })
                .eq('customer_id', parseInt(customerId, 10))
                .eq('course_id', parseInt(itemId, 10));
            updateError = error;

        } else if (type === 'event') {
            const { error } = await supabaseServer
                .from('Event Participants')
                .update({ payment_status: dbStatus })
                .eq('customer_id', parseInt(customerId, 10))
                .eq('event_id', parseInt(itemId, 10));
            updateError = error;
        } else {
            console.error(`LiqPay callback: Unknown order_id type: ${type}`);
        }

        if (updateError) {
            console.error(`LiqPay callback: Error updating database for order ${order_id}:`, updateError);
            // Even if DB update fails, we should still acknowledge LiqPay
        } else {
            console.log(`Successfully updated status for order ${order_id} to ${status}`);
        }

        // 4. Acknowledge receipt to LiqPay
        return NextResponse.json({ status: 'ok' }, { status: 200 });

    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'An unexpected error occurred.';
        console.error("Unhandled error in LiqPay callback:", error);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
