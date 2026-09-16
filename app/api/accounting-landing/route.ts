import {env} from 'cloudflare:workers';
import {authorize,privateError} from '@/lib/admin-auth';
import {defaultAccountingLanding,normalizeAccountingLanding} from '@/lib/accounting-landing';

const SLUG='landing-contable';
function siteSlug(request:Request){const host=new URL(request.url).hostname.toLowerCase();const match=host.match(/^([a-z0-9][a-z0-9-]{1,43}[a-z0-9])\.sitioweb\.shop$/);return match&&!['www','creador'].includes(match[1])?match[1]:''}

export async function GET(request:Request){
 const slug=siteSlug(request)||SLUG;
 let row:Record<string,unknown>|null=null;try{row=await env.DB.prepare('SELECT category_settings FROM stores WHERE slug=?').bind(slug).first<Record<string,unknown>>()}catch{}
 let saved:unknown=null;try{saved=JSON.parse(String(row?.category_settings||'null'))}catch{}
 return Response.json({content:normalizeAccountingLanding(saved||defaultAccountingLanding)},{headers:{'Cache-Control':'public, max-age=15, stale-while-revalidate=120'}});
}

export async function PUT(request:Request){
 const admin=await authorize(request,env);if(admin instanceof Response)return admin;
 const tenant=siteSlug(request),slug=tenant||SLUG;
 if(tenant){if(!admin.owner&&admin.tenant!==tenant)return privateError(403,'forbidden')}else if(!admin.owner&&!admin.demo)return privateError(403,'forbidden');
 const body=await request.json().catch(()=>null) as {content?:unknown}|null;
 const content=normalizeAccountingLanding(body?.content);
 const existing=await env.DB.prepare('SELECT id FROM stores WHERE slug=?').bind(slug).first<{id:number}>();
 if(tenant&&!existing)return privateError(404,'site_not_found');
 await env.DB.prepare(`INSERT INTO stores (owner_id,owner_email,template_key,slug,name,whatsapp,category_settings,created_at)
  VALUES (?,?,?,?,?,?,?,?)
  ON CONFLICT(slug) DO UPDATE SET name=excluded.name,whatsapp=excluded.whatsapp,category_settings=excluded.category_settings`)
  .bind(tenant?'site-tenant:'+tenant:'public:catalog-demo',tenant?'':'publico@catalogo.demo',tenant?'site:accounting':'landing-contable',slug,content.brand,content.whatsapp,JSON.stringify(content),new Date().toISOString()).run();
 return Response.json({content},{headers:{'Cache-Control':'private, no-store'}});
}
