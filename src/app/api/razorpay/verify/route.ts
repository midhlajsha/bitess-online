import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: Request) {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();

        const secret = process.env.RAZORPAY_KEY_SECRET || 'mock_key_secret';

        if (process.env.RAZORPAY_KEY_SECRET === undefined) {
            // Mock verification success
            return NextResponse.json({ status: 'success' });
        }

        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', secret)
            .update(body.toString())
            .digest('hex');

        if (expectedSignature === razorpay_signature) {
            return NextResponse.json({ status: 'success' });
        } else {
            return NextResponse.json({ status: 'failure', message: 'Invalid signature' }, { status: 400 });
        }
    } catch (err: any) {
        console.error('Razorpay Verify Error:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
