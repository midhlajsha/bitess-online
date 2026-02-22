import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
    const body = await req.json();

    console.log('Razorpay Webhook received:', body);

    // TODO: Verify Razorpay signature
    // if (body.event === 'order.paid') { ... }

    return NextResponse.json({ received: true });
}
