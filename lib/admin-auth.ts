import { sessionDigest } from './passwords';
export type AuthConfig = { AUTH_SECRET?: string; OWNER_EMAIL?: string; OWNER_PASSWORD_HASH?: string; DB: D1Database };
export type Administrator = { email: string; subject: string; owner: boolean; tenant: string; storeId: number | null };
export const SESSION_COOKIE = '__Host-catalog_session';
export function authConfigured(config: AuthConfig) {
 return Boolean(config.AUTH_SECRET && config.AUTH_SECRET.length >= 32 && config.OWNER_EMAIL && /^scrypt-v1\$[a-f0-9]{32}\$[a-f0-9]{64}$/.test(config.OWNER_PASSWORD_HASH || ''));
}
export function tenantFromHost(host: string) {
 if (host === 'xn--micatlogo-41a.shop' || host === 'www.xn--micatlogo-41a.shop' || host === 'creador.xn--micatlogo-41a.shop') return '';
 const match = host.match(/^([a-z0-9][a-z0-9-]{1,43}[a-z0-9])\.xn--micatlogo-41a\.shop$/);
 return match?.[1] || '';
}
export function privateError(status: number, error: string) {
 return Response.json({error},{status,headers:{'Cache-Control':'private, no-store','Referrer-Policy':'no-referrer'}});
}
export async function authenticate(request: Request, config: AuthConfig): Promise<Administrator | null> {
 if (!authConfigured(config)) return null;
 const token = (request.headers.get('cookie') || '').split(';').map(x=>x.trim()).find(x=>x.startsWith(SESSION_COOKIE+'='))?.slice(SESSION_COOKIE.length+1) || '';
 if (!/^[a-f0-9]{64}$/.test(token)) return null;
 const host = new URL(request.url).hostname;
 const row = await config.DB.prepare('SELECT s.user_id,s.owner_email,s.owner_version,s.host,s.expires_at,u.email,u.store_id,u.active,t.slug FROM catalog_sessions s LEFT JOIN catalog_admins u ON u.id=s.user_id LEFT JOIN stores t ON t.id=u.store_id WHERE s.token_hash=? AND s.host=? AND s.expires_at>?').bind(sessionDigest(token,config.AUTH_SECRET!),host,Date.now()).first<Record<string,unknown>>();
 if (!row) return null;
 if (row.owner_email) {
  if (row.owner_email !== config.OWNER_EMAIL!.toLowerCase() || row.owner_version !== sessionDigest(config.OWNER_PASSWORD_HASH!, config.AUTH_SECRET!)) return null;
  return {email:String(row.owner_email),subject:'owner',owner:true,tenant:'',storeId:null};
 }
 if (!row.active || !row.slug || tenantFromHost(host) !== row.slug) return null;
 return {email:String(row.email),subject:String(row.user_id),owner:false,tenant:String(row.slug),storeId:Number(row.store_id)};
}
export async function authorize(request: Request, config: AuthConfig): Promise<Administrator | Response> {
 if (!authConfigured(config)) return privateError(503,'admin_auth_not_configured');
 if (!['GET','HEAD'].includes(request.method) && request.headers.get('origin') !== new URL(request.url).origin) return privateError(403,'invalid_origin');
 const admin = await authenticate(request, config);
 return admin || privateError(401,'authentication_required');
}
