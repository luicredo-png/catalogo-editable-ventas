import { env } from 'cloudflare:workers';
import { authorize, privateError } from '@/lib/admin-auth';
import { hashPassword } from '@/lib/passwords';
const RUBROS=['restaurantes','comida-rapida','detalles-romanticos','ropa','mujer','zapatos-mujer','perfumeria','postres','accesorios'];
function usernameFromBusiness(name:string){return name.normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase().trim().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'').slice(0,48)}
async function owner(request:Request){const admin=await authorize(request,env);return admin instanceof Response?admin:!admin.owner?privateError(403,'owner_required'):null}
export async function GET(request:Request){const denied=await owner(request);if(denied)return denied;const rows=await env.DB.prepare("SELECT s.id,s.slug,s.name,s.template_key AS templateKey,s.created_at AS createdAt,(SELECT a.email FROM catalog_admins a WHERE a.store_id=s.id AND a.active=1 LIMIT 1) AS username FROM stores s WHERE s.owner_id LIKE 'tenant:%' ORDER BY s.id DESC LIMIT 1000").all();return Response.json({clients:rows.results},{headers:{'Cache-Control':'private, no-store'}})}
export async function POST(request:Request){
 const denied=await owner(request);if(denied)return denied;
 let body:Record<string,unknown>;try{body=await request.json<Record<string,unknown>>()}catch{return privateError(400,'invalid_request')}
 if(!body||typeof body!=='object'||Array.isArray(body))return privateError(400,'invalid_request');
 const slug=String(body.slug||'').trim().toLowerCase(),name=String(body.name||'').trim(),password=String(body.password||''),templateKey=String(body.templateKey||''),username=usernameFromBusiness(name);
 if(!/^[a-z0-9][a-z0-9-]{1,43}[a-z0-9]$/.test(slug)||['www','creador','admin','api','login'].includes(slug))return privateError(400,'invalid_slug');
 if(!name||name.length>80||username.length<3||password.length<12||password.length>128||!RUBROS.includes(templateKey))return privateError(400,'invalid_fields');
 try{
  const source=await env.DB.prepare('SELECT * FROM stores WHERE owner_id=? AND template_key=?').bind('public:catalog-demo',templateKey).first<Record<string,unknown>>();
  if(!source)return privateError(404,'template_not_found');
  const passwordHash=await hashPassword(password),createdAt=new Date().toISOString();
  const record:Record<string,unknown>={...source,owner_id:'tenant:'+slug,owner_email:'',slug,name,created_at:createdAt};delete record.id;
  const columns=Object.keys(record).filter(k=>/^[a-z_]+$/.test(k));
  await env.DB.batch([
   env.DB.prepare('INSERT INTO stores ('+columns.join(',')+') VALUES ('+columns.map(()=>'?').join(',')+')').bind(...columns.map(k=>record[k]??'')),
   env.DB.prepare('INSERT INTO catalog_admins(id,store_id,email,password_hash,active,created_at) SELECT ?,id,?,?,1,? FROM stores WHERE slug=?').bind(crypto.randomUUID(),username,passwordHash,createdAt,slug),
   env.DB.prepare('INSERT INTO products (store_id,name,category,description,price,old_price,image,options_json,whatsapp_message,active,sort_order) SELECT (SELECT id FROM stores WHERE slug=?),name,category,description,price,old_price,image,options_json,whatsapp_message,active,sort_order FROM products WHERE store_id=?').bind(slug,Number(source.id)),
  ]);
  const row=await env.DB.prepare('SELECT id FROM stores WHERE slug=?').bind(slug).first<{id:number}>();
  if(!row?.id)return privateError(503,'creation_incomplete');
  return Response.json({client:{id:row.id,slug,name,username,templateKey,createdAt,catalogUrl:'https://'+slug+'.micatálogo.shop',adminUrl:'https://'+slug+'.micatálogo.shop/login'}},{status:201,headers:{'Cache-Control':'no-store'}});
 }catch(error){
  console.error(JSON.stringify({event:'tenant_creation_failed',slug,reason:error instanceof Error?error.message:'unknown'}));
  if(String(error).includes('UNIQUE'))return privateError(409,'slug_exists');
  return privateError(503,'creation_failed');
 }
}

export async function PATCH(request:Request){
 const denied=await owner(request);if(denied)return denied;
 let body:Record<string,unknown>;try{body=await request.json<Record<string,unknown>>()}catch{return privateError(400,'invalid_request')}
 const id=Number(body.id),slug=String(body.slug||'').trim().toLowerCase(),password=String(body.password||'');
 if(!Number.isInteger(id)||id<1||!/^[a-z0-9][a-z0-9-]{1,43}[a-z0-9]$/.test(slug)||password.length<12||password.length>128)return privateError(400,'invalid_fields');
 const tenant=await env.DB.prepare("SELECT id FROM stores WHERE id=? AND slug=? AND owner_id LIKE 'tenant:%'").bind(id,slug).first<{id:number}>();
 if(!tenant)return privateError(404,'client_not_found');
 const passwordHash=await hashPassword(password);
 await env.DB.batch([
  env.DB.prepare('UPDATE catalog_admins SET password_hash=? WHERE store_id=? AND active=1').bind(passwordHash,id),
  env.DB.prepare('DELETE FROM catalog_sessions WHERE user_id IN (SELECT id FROM catalog_admins WHERE store_id=?)').bind(id),
 ]);
 return Response.json({ok:true},{headers:{'Cache-Control':'private, no-store'}});
}

export async function DELETE(request:Request){
 const denied=await owner(request);if(denied)return denied;
 let body:Record<string,unknown>;try{body=await request.json<Record<string,unknown>>()}catch{return privateError(400,'invalid_request')}
 const id=Number(body.id),slug=String(body.slug||'').trim().toLowerCase();
 if(!Number.isInteger(id)||id<1||!/^[a-z0-9][a-z0-9-]{1,43}[a-z0-9]$/.test(slug))return privateError(400,'invalid_fields');
 const tenant=await env.DB.prepare("SELECT id FROM stores WHERE id=? AND slug=? AND owner_id LIKE 'tenant:%'").bind(id,slug).first<{id:number}>();
 if(!tenant)return privateError(404,'client_not_found');
 await env.DB.batch([
  env.DB.prepare('DELETE FROM catalog_sessions WHERE user_id IN (SELECT id FROM catalog_admins WHERE store_id=?)').bind(id),
  env.DB.prepare('DELETE FROM catalog_admins WHERE store_id=?').bind(id),
  env.DB.prepare('DELETE FROM products WHERE store_id=?').bind(id),
  env.DB.prepare("DELETE FROM stores WHERE id=? AND slug=? AND owner_id LIKE 'tenant:%'").bind(id,slug),
 ]);
 return Response.json({ok:true},{headers:{'Cache-Control':'private, no-store'}});
}
