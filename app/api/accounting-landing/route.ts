import {env} from 'cloudflare:workers';
import {authorize,privateError} from '@/lib/admin-auth';
import {defaultAccountingLanding,normalizeAccountingLanding} from '@/lib/accounting-landing';

const SLUG='landing-contable';

export async function GET(){
 let row:Record<string,unknown>|null=null;try{row=await env.DB.prepare('SELECT category_settings FROM stores WHERE slug=?').bind(SLUG).first<Record<string,unknown>>()}catch{}
 let saved:unknown=null;try{saved=JSON.parse(String(row?.category_settings||'null'))}catch{}
 return Response.json({content:normalizeAccountingLanding(saved||defaultAccountingLanding)},{headers:{'Cache-Control':'public, max-age=15, stale-while-revalidate=120'}});
}

export async function PUT(request:Request){
 const admin=await authorize(request,env);if(admin instanceof Response)return admin;
 if(!admin.owner&&!admin.demo)return privateError(403,'forbidden');
 const body=await request.json().catch(()=>null) as {content?:unknown}|null;
 const content=normalizeAccountingLanding(body?.content);
 await env.DB.prepare(`INSERT INTO stores (owner_id,owner_email,template_key,slug,name,whatsapp,category_settings,created_at)
  VALUES (?,?,?,?,?,?,?,?)
  ON CONFLICT(slug) DO UPDATE SET name=excluded.name,whatsapp=excluded.whatsapp,category_settings=excluded.category_settings`)
  .bind('public:catalog-demo','publico@catalogo.demo','landing-contable',SLUG,content.brand,content.whatsapp,JSON.stringify(content),new Date().toISOString()).run();
 return Response.json({content},{headers:{'Cache-Control':'private, no-store'}});
}
