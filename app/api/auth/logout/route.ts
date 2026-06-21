import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const nextResponse = NextResponse.json({ message: 'Logged out successfully' });

  // Hapus Cookie
  nextResponse.cookies.set('auth_token', '', {
    httpOnly: true,
    path: '/',
    expires: new Date(0)
  });

  return nextResponse;
}
