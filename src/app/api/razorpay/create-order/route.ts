import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export async function POST(req: Request) {
    try {
        const { items } = await req.json();
        const total = items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);

        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID || 'mock_key_id',
            key_secret: process.env.RAZORPAY_KEY_SECRET || 'mock_key_secret',
        });

        if (process.env.RAZORPAY_KEY_ID === undefined) {
            // Return mock if keys aren't set
            return NextResponse.json({ id: 'order_mock_123', amount: Math.round(total * 100), currency: 'USD' });
        }

        const options = {
            amount: Math.round(total * 100), // amount in cents
            currency: 'USD',
            receipt: `receipt_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);
        return NextResponse.json(order);
    } catch (err: any) {
        console.error('Razorpay Create Order Error:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
