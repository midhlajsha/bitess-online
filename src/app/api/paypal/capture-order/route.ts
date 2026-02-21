import { NextResponse } from 'next/server';

const PAYPAL_API_BASE = process.env.PAYPAL_API_BASE || 'https://api-m.sandbox.paypal.com';

async function generateAccessToken() {
    const clientId = process.env.PAYPAL_CLIENT_ID || 'mock_client_id';
    const appSecret = process.env.PAYPAL_APP_SECRET || 'mock_app_secret';

    if (clientId === 'mock_client_id') {
        return 'mock_access_token';
    }

    const auth = Buffer.from(`${clientId}:${appSecret}`).toString('base64');
    const response = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'grant_type=client_credentials',
    });

    const data = await response.json();
    return data.access_token;
}

export async function POST(req: Request) {
    try {
        const { orderID } = await req.json();
        const accessToken = await generateAccessToken();

        if (accessToken === 'mock_access_token') {
            return NextResponse.json({ status: 'COMPLETED', id: orderID });
        }

        const url = `${PAYPAL_API_BASE}/v2/checkout/orders/${orderID}/capture`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
        });

        const data = await response.json();
        return NextResponse.json(data);
    } catch (err: any) {
        console.error('PayPal Capture Order Error:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
