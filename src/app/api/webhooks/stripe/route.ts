import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
    const payload = await req.text();
    const signature = req.headers.get('stripe-signature');

    console.log('Stripe Webhook received:', payload);

    // TODO: Verify signature with STRIPE_WEBHOOK_SECRET
    // For now, we'll assume it's valid if it hits this endpoint in dev

    // Example: const event = stripe.webhooks.constructEvent(payload, signature, secret);
    // if (event.type === 'checkout.session.completed') {
    //    const orderId = event.data.object.metadata.orderId;
    //    await prisma.order.update({ where: { id: orderId }, data: { status: 'COMPLETED' } });
    // }

    return NextResponse.json({ received: true });
}
