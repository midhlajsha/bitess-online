import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { prisma } from '@/lib/prisma';
import { calculateTotal } from '@/lib/payment-utils';

export async function POST(req: Request) {
    try {
        const { items } = await req.json();
        const total = calculateTotal(items);

        // 1. Create a Pending Order in the database
        const order = await prisma.order.create({
            data: {
                total,
                status: 'PENDING',
                gateway: 'RAZORPAY',
                items: JSON.stringify(items),
            },
        });

        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID || 'mock_key_id',
            key_secret: process.env.RAZORPAY_KEY_SECRET || 'mock_key_secret',
        });

        const amountInCents = Math.round(total * 100);

        if (process.env.RAZORPAY_KEY_ID === undefined || process.env.RAZORPAY_KEY_ID === 'mock_key_id') {
            return NextResponse.json({
                id: 'order_mock_' + order.id,
                amount: amountInCents,
                currency: 'USD',
                order_id: order.id
            });
        }

        const options = {
            amount: amountInCents,
            currency: 'USD',
            receipt: order.id,
        };

        const r_order = await razorpay.orders.create(options);
        return NextResponse.json({ ...r_order, order_id: order.id });
    } catch (err: any) {
        console.error('Razorpay Create Order Error:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

