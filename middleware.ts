import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/request';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;

  // Jika mencoba akses dashboard tapi tidak ada token
  if (request.nextUrl.pathname.startsWith('/dashboard') && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Jika sudah ada token tapi mau akses login/register, lempar ke dashboard
  if ((request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/register') && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

// Hanya jalankan middleware di path tertentu
export const config = {
  matcher: ['/dashboard/:path*', '/login', '/register'],
};
