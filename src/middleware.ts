// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';


const PUBLIC_ROUTES = ['/login'];

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token');

  
  if (PUBLIC_ROUTES.includes(req.nextUrl.pathname)) {
    return NextResponse.next();
  }

  
  if (!token) {
    
    return NextResponse.redirect(new URL('/login', req.url));
  }

  
  return NextResponse.next();
}


export const config = {
  matcher: ['/', '/painel', '/banco', '/qrcodeinformacao', '/tabela'], 
};
