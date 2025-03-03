import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const SECRET_KEY = 'your_secret_key';

export function middleware(req) {
  const adminToken = req.cookies.get('admin_token')?.value;  // Lấy token admin
  const url = req.nextUrl.pathname;

  if (url.startsWith('/admin')) {
    if (!adminToken) {
      return NextResponse.redirect(new URL('/login', req.url));  // Không có token thì về login
    }

    try {
      const user = jwt.verify(adminToken, SECRET_KEY);
      if (user.role !== 1) {
        return NextResponse.redirect(new URL('/', req.url));  // Không phải admin thì về homepage
      }
    } catch (err) {
      return NextResponse.redirect(new URL('/login', req.url));  // Token sai thì về login
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],  
};
