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
        
        if (status === 'success' || status === 'subscribed') {
            const tableName = type === 'course' ? 'Course Participants' : 'Event Participants';
            const idColumn = type === 'course' ? 'course_id' : 'event_id';

            const { error } = await supabaseServer
                .from(tableName)
                .update({ payment_status: 'paid' })
                .eq('customer_id', parseInt(customerId, 10))
                .eq(idColumn, parseInt(itemId, 10));

            if (error) {
                console.error(`LiqPay callback: Error updating database for order ${order_id}:`, error);
            } else {
                console.log(`Successfully updated status for order ${order_id} to paid`);
            }
        } else if (status === 'failure') {
            const tableName = type === 'course' ? 'Course Participants' : 'Event Participants';
            const idColumn = type === 'course' ? 'course_id' : 'event_id';

            const { error } = await supabaseServer
                .from(tableName)
                .delete()
                .eq('customer_id', parseInt(customerId, 10))
                .eq(idColumn, parseInt(itemId, 10));

            if (error) {
                console.error(`LiqPay callback: Error deleting participant for order ${order_id}:`, error);
            } else {
                console.log(`Successfully deleted participant for order ${order_id}`);
            }
        }

        // 4. Acknowledge receipt to LiqPay
        return NextResponse.json({ status: 'ok' }, { status: 200 });

    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'An unexpected error occurred.';
        console.error("Unhandled error in LiqPay callback:", error);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}