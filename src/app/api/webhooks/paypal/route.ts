import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
    const body = await req.json();

    console.log('PayPal Webhook received:', body);

    // TODO: Verify PayPal signature
    // if (body.event_type === 'CHECKOUT.ORDER.APPROVED') { ... }

    return NextResponse.json({ received: true });
}
