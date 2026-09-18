import { NextResponse, type NextRequest } from 'next/server';
import { env } from 'cloudflare:workers';
import { authorize, privateError } from './lib/admin-auth';

export async function middleware(request: NextRequest) {
  const { pathname, hostname } = new URL(request.url);
  const siteRoot=hostname==='sitioweb.shop'||hostname==='www.sitioweb.shop';
  const siteCreator=hostname==='creador.sitioweb.shop';
  const siteMatch=hostname.match(/^([a-z0-9][a-z0-9-]{1,43}[a-z0-9])\.sitioweb\.shop$/);
  const siteTenant=siteMatch&&!['www','creador'].includes(siteMatch[1])?siteMatch[1]:'';
  const siteAdminRoot=Boolean(siteTenant)&&(pathname==='/admin'||pathname.startsWith('/admin/'));
  if (pathname === '/api/auth/login' || pathname === '/api/auth/logout') return NextResponse.next();
  // Only catalog and media reads are anonymous. New APIs are private by default.
  const publicRead = ['GET','HEAD'].includes(request.method) &&
    (pathname === '/api/catalog' || pathname === '/api/accounting-landing' || pathname === '/api/demo-sites' || pathname.startsWith('/api/media/'));
  // /admin is a static client shell. Its data and every mutation remain protected
  // by /api/me and the private API middleware. Avoiding a D1 lookup while serving
  // the shell keeps the Worker below the 10 ms CPU limit.
  const selfAuthorizedApi = pathname === '/api/me' || pathname.startsWith('/api/tenants') || pathname.startsWith('/api/site-tenants');
  const privateRoute = (pathname.startsWith('/api/') && !publicRead && !selfAuthorizedApi) ||
    pathname === '/inventario' || pathname.startsWith('/inventario/') ||
    pathname === '/estudio-contable/admin' || pathname.startsWith('/estudio-contable/admin/') ||
    (hostname === 'creador.xn--micatlogo-41a.shop' && pathname === '/') ||
    (siteCreator && pathname === '/') || siteAdminRoot;
  if (!privateRoute) {
    const response = siteRoot&&pathname==='/'?NextResponse.rewrite(new URL('/sitios-web',request.url)):siteTenant==='demo'&&pathname==='/'?NextResponse.rewrite(new URL('/demo-sitios',request.url)):siteTenant&&pathname==='/'?NextResponse.rewrite(new URL('/estudio-contable',request.url)):NextResponse.next();
    if (hostname === 'gmpaonyx.xn--micatlogo-41a.shop' && pathname === '/') {
      response.headers.set('Link','</gmpaonyx-collection-background.webp>; rel=preload; as=image; type=image/webp; fetchpriority=high');
    }
    if (pathname === '/gmpaonyx-collection-background.webp') {
      response.headers.set('Cache-Control','public, max-age=31536000, immutable');
    }
    return response;
  }
  const admin = await authorize(request, env);
  if (admin instanceof Response) {
    if (!pathname.startsWith('/api/') && admin.status === 401) {
      const login=new URL('/login',request.url);login.searchParams.set('next',`${pathname}${new URL(request.url).search}`);return NextResponse.redirect(login);
    }
    return admin;
  }
  if (!admin.owner && (pathname.startsWith('/api/tenants') || pathname.startsWith('/api/site-tenants') || pathname.startsWith('/api/inventory') || pathname.startsWith('/inventario'))) return privateError(403, 'owner_required');
  const response = siteAdminRoot?NextResponse.rewrite(new URL(siteTenant==='demo'?'/demo-sitios/admin':'/estudio-contable/admin',request.url)):NextResponse.next();
  if ((hostname === 'creador.xn--micatlogo-41a.shop'||siteCreator) && pathname === '/') return NextResponse.redirect(new URL('/admin',request.url));
  response.headers.set('Cache-Control', 'private, no-store');
  response.headers.set('Referrer-Policy', 'no-referrer');
  return response;
}
export const config = { matcher: ['/((?!_next/static|_next/image|assets/|favicon.ico).*)'] };
