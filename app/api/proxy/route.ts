import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const endpoint = req.nextUrl.searchParams.get('endpoint');

    if (!endpoint) {
      return NextResponse.json({ error: 'Endpoint is required' }, { status: 400 });
    }

    const API_KEY = 'fujiwaracreative_client';
    const SECRET = process.env.API_SECRET_KEY || 'your_secret_key_here_change_me';
    const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000/api';

    const payload = JSON.stringify(body);
    const signature = crypto
      .createHmac('sha256', SECRET)
      .update(payload)
      .digest('hex');

    const response = await fetch(`${BACKEND_URL}/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': API_KEY,
        'X-SIGNATURE': signature,
      },
      body: payload,
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
