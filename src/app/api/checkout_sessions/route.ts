import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock', {
    apiVersion: '2025-01-27.ac' as any,
});

export async function POST(req: Request) {
    try {
        const { items } = await req.json();
        const total = items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);

        // 1. Create a Pending Order in the database
        const order = await prisma.order.create({
            data: {
                total,
                status: 'PENDING',
                gateway: 'STRIPE',
                items: JSON.stringify(items),
            },
        });

        const lineItems = items.map((item: any) => ({
            price_data: {
                currency: 'usd',
                product_data: {
                    name: item.name,
                    images: [item.image],
                },
                unit_amount: Math.round(item.price * 100),
            },
            quantity: item.quantity,
        }));

        const origin = req.headers.get('origin') || 'http://localhost:3000';

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}&order_id=${order.id}`,
            cancel_url: `${origin}/?canceled=true`,
            metadata: {
                orderId: order.id,
            },
        });

        return NextResponse.json({ sessionId: session.id });
    } catch (err: any) {
        console.error('Stripe Error:', err.message);
        return NextResponse.json({ error: err.message }, { status: err.statusCode || 500 });
    }
}

