import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;
  const body = await request.json(); // { id, status }

  if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  try {
    const response = await fetch(`http://localhost:8000/api/admin/products/${body.id}/validate`, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`, 
        'Content-Type': 'application/json',
        'Accept': 'application/json' 
      },
      body: JSON.stringify({ status: body.status })
    });
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json({ message: 'Error' }, { status: 500 });
  }
}
