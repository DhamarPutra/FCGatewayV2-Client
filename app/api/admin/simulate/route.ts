import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: Request) {
  const body = await request.json();
  const { api_key, api_secret, product_slug } = body;

  if (!api_key || !api_secret || !product_slug) {
    return NextResponse.json({ message: 'Missing credentials or slug' }, { status: 400 });
  }

  // 1. Siapkan Payload
  const payload = {
    product_id: product_slug,
    client_order_id: 'SIMULATE-' + Date.now(),
    quantity: 1
  };

  const payloadString = JSON.stringify(payload);

  // 2. Generate HMAC Signature (Pake Secret Merchant)
  const signature = crypto
    .createHmac('sha256', api_secret)
    .update(payloadString)
    .digest('hex');

  try {
    // 3. Tembak ke API Gateway kita sendiri (Laravel)
    const response = await fetch('http://localhost:8000/api/create-transaction', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': api_key,
        'X-SIGNATURE': signature,
        'Accept': 'application/json'
      },
      body: payloadString
    });

    const data = await response.json();
    return NextResponse.json({
      request_payload: payload,
      signature_used: signature,
      gateway_response: data
    }, { status: response.status });

  } catch (error) {
    return NextResponse.json({ message: 'Gateway Connection Failed' }, { status: 500 });
  }
}
