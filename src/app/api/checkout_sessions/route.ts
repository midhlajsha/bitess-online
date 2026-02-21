import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock', {
    apiVersion: '2026-01-28.clover',
});

export async function POST(req: Request) {
    try {
        const { items } = await req.json();

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
            success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/?canceled=true`,
        });

        return NextResponse.json({ sessionId: session.id });
    } catch (err: any) {
        console.error('Stripe Error:', err.message);
        return NextResponse.json({ error: err.message }, { status: err.statusCode || 500 });
    }
}
