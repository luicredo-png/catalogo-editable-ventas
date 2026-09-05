import { env } from 'cloudflare:workers';
import { authConfigured, privateError, SESSION_COOKIE, tenantFromHost } from '@/lib/admin-auth';
import { verifyPassword, randomSession, sessionDigest } from '@/lib/passwords';
export async function POST(request: Request) {
 if (!authConfigured(env)) return privateError(503,'admin_auth_not_configured');
 const url=new URL(request.url); if(url.protocol!=='https:'||request.headers.get('origin')!==url.origin)return privateError(403,'invalid_origin');
 const body=await request.json() as {email?:string,password?:string}; const email=String(body.email||'').trim().toLowerCase(),password=String(body.password||'');
 const owner=email===env.OWNER_EMAIL!.toLowerCase(),slug=tenantFromHost(url.hostname); const user=!owner&&slug?await env.DB.prepare('SELECT u.id,u.password_hash FROM catalog_admins u JOIN stores s ON s.id=u.store_id WHERE s.slug=? AND u.email=? AND u.active=1').bind(slug,email).first<{id:string,password_hash:string}>():null;
 if(!await verifyPassword(password,owner?env.OWNER_PASSWORD_HASH!:user?.password_hash||'')||(!owner&&!user))return privateError(401,'invalid_credentials');
 const token=randomSession(),now=Date.now(); await env.DB.prepare('INSERT INTO catalog_sessions(token_hash,user_id,owner_email,owner_version,host,expires_at) VALUES (?,?,?,?,?,?)').bind(sessionDigest(token,env.AUTH_SECRET!),user?.id||null,owner?email:null,owner?sessionDigest(env.OWNER_PASSWORD_HASH!,env.AUTH_SECRET!):null,url.hostname,now+28800000).run();
 return Response.json({ok:true},{headers:{'Cache-Control':'no-store','Set-Cookie':SESSION_COOKIE+'='+token+'; Path=/; Secure; HttpOnly; SameSite=Strict; Max-Age=28800'}});
}
