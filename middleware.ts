import { NextResponse, type NextRequest } from 'next/server';
import { env } from 'cloudflare:workers';
import { authorize, privateError } from './lib/admin-auth';

export async function middleware(request: NextRequest) {
  const { pathname, hostname } = new URL(request.url);
  if (pathname === '/api/auth/login' || pathname === '/api/auth/logout') return NextResponse.next();
  // Only catalog and media reads are anonymous. New APIs are private by default.
  const publicRead = ['GET','HEAD'].includes(request.method) &&
    (pathname === '/api/catalog' || pathname.startsWith('/api/media/'));
  const privateRoute = (pathname.startsWith('/api/') && !publicRead) ||
    pathname === '/admin' || pathname.startsWith('/admin/') ||
    pathname === '/inventario' || pathname.startsWith('/inventario/') ||
    (hostname === 'creador.xn--micatlogo-41a.shop' && pathname === '/');
  if (!privateRoute) return NextResponse.next();
  const admin = await authorize(request, env);
  if (admin instanceof Response) {
    if (!pathname.startsWith('/api/') && admin.status === 401) return NextResponse.redirect(new URL('/login',request.url));
    return admin;
  }
  if (!admin.owner && (pathname.startsWith('/api/tenants') || pathname.startsWith('/api/inventory') || pathname.startsWith('/inventario'))) return privateError(403, 'owner_required');
  const response = NextResponse.next();
  if (hostname === 'creador.xn--micatlogo-41a.shop' && pathname === '/') return NextResponse.redirect(new URL('/admin',request.url));
  response.headers.set('Cache-Control', 'private, no-store');
  response.headers.set('Referrer-Policy', 'no-referrer');
  return response;
}
export const config = { matcher: ['/((?!_next/static|_next/image|assets/|favicon.ico).*)'] };
