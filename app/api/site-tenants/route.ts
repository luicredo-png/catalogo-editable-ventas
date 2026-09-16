import {env} from 'cloudflare:workers';
import {authorize,privateError} from '@/lib/admin-auth';
import {hashPassword} from '@/lib/passwords';
import {defaultAccountingLanding,normalizeAccountingLanding} from '@/lib/accounting-landing';

function usernameFromBusiness(name:string){return name.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'').slice(0,48)}
async function owner(request:Request){const admin=await authorize(request,env);return admin instanceof Response?admin:!admin.owner?privateError(403,'owner_required'):null}

export async function GET(request:Request){
 const denied=await owner(request);if(denied)return denied;
 const rows=await env.DB.prepare("SELECT s.id,s.slug,s.name,s.template_key AS templateKey,s.created_at AS createdAt,(SELECT a.email FROM catalog_admins a WHERE a.store_id=s.id AND a.active=1 LIMIT 1) AS username FROM stores s WHERE s.owner_id LIKE 'site-tenant:%' ORDER BY s.id DESC LIMIT 1000").all();
 return Response.json({clients:rows.results},{headers:{'Cache-Control':'private, no-store'}});
}

export async function POST(request:Request){
 const denied=await owner(request);if(denied)return denied;
 let body:Record<string,unknown>;try{body=await request.json<Record<string,unknown>>()}catch{return privateError(400,'invalid_request')}
 const slug=String(body.slug||'').trim().toLowerCase(),name=String(body.name||'').trim(),password=String(body.password||''),username=usernameFromBusiness(name);
 if(!/^[a-z0-9][a-z0-9-]{1,43}[a-z0-9]$/.test(slug)||['www','creador','admin','api','login'].includes(slug))return privateError(400,'invalid_slug');
 if(!name||name.length>80||username.length<3||password.length<12||password.length>128)return privateError(400,'invalid_fields');
 try{
  const source=await env.DB.prepare('SELECT * FROM stores WHERE slug=?').bind('landing-contable').first<Record<string,unknown>>();
  let saved:unknown=defaultAccountingLanding;try{saved=source?.category_settings?JSON.parse(String(source.category_settings)):defaultAccountingLanding}catch{}
  const content=normalizeAccountingLanding(saved);
  content.brand=name;
  const passwordHash=await hashPassword(password),createdAt=new Date().toISOString();
  if(source){
   const record:Record<string,unknown>={...source,owner_id:'site-tenant:'+slug,owner_email:'',template_key:'site:accounting',slug,name,category_settings:JSON.stringify(content),created_at:createdAt};delete record.id;
   const columns=Object.keys(record).filter(key=>/^[a-z_]+$/.test(key));
   await env.DB.batch([
    env.DB.prepare('INSERT INTO stores ('+columns.join(',')+') VALUES ('+columns.map(()=>'?').join(',')+')').bind(...columns.map(key=>record[key]??'')),
    env.DB.prepare('INSERT INTO catalog_admins(id,store_id,email,password_hash,active,created_at) SELECT ?,id,?,?,1,? FROM stores WHERE slug=?').bind(crypto.randomUUID(),username,passwordHash,createdAt,slug),
   ]);
  }else{
   await env.DB.batch([
    env.DB.prepare('INSERT INTO stores(owner_id,owner_email,template_key,slug,name,whatsapp,category_settings,created_at) VALUES(?,?,?,?,?,?,?,?)').bind('site-tenant:'+slug,'','site:accounting',slug,name,content.whatsapp,JSON.stringify(content),createdAt),
    env.DB.prepare('INSERT INTO catalog_admins(id,store_id,email,password_hash,active,created_at) SELECT ?,id,?,?,1,? FROM stores WHERE slug=?').bind(crypto.randomUUID(),username,passwordHash,createdAt,slug),
   ]);
  }
  const row=await env.DB.prepare('SELECT id FROM stores WHERE slug=?').bind(slug).first<{id:number}>();
  if(!row?.id)return privateError(503,'creation_incomplete');
  return Response.json({client:{id:row.id,slug,name,username,templateKey:'site:accounting',createdAt,siteUrl:'https://'+slug+'.sitioweb.shop',adminUrl:'https://'+slug+'.sitioweb.shop/login?next=%2Fadmin'}},{status:201,headers:{'Cache-Control':'no-store'}});
 }catch(error){
  console.error(JSON.stringify({event:'site_tenant_creation_failed',slug,reason:error instanceof Error?error.message:'unknown'}));
  if(String(error).includes('UNIQUE'))return privateError(409,'slug_exists');
  return privateError(503,'creation_failed');
 }
}

export async function PATCH(request:Request){
 const denied=await owner(request);if(denied)return denied;
 let body:Record<string,unknown>;try{body=await request.json<Record<string,unknown>>()}catch{return privateError(400,'invalid_request')}
 const id=Number(body.id),slug=String(body.slug||'').trim().toLowerCase(),password=String(body.password||'');
 if(!Number.isInteger(id)||id<1||!/^[a-z0-9][a-z0-9-]{1,43}[a-z0-9]$/.test(slug)||password.length<12||password.length>128)return privateError(400,'invalid_fields');
 const tenant=await env.DB.prepare("SELECT id FROM stores WHERE id=? AND slug=? AND owner_id LIKE 'site-tenant:%'").bind(id,slug).first<{id:number}>();
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
 const tenant=await env.DB.prepare("SELECT id FROM stores WHERE id=? AND slug=? AND owner_id LIKE 'site-tenant:%'").bind(id,slug).first<{id:number}>();
 if(!tenant)return privateError(404,'client_not_found');
 await env.DB.batch([
  env.DB.prepare('DELETE FROM catalog_sessions WHERE user_id IN (SELECT id FROM catalog_admins WHERE store_id=?)').bind(id),
  env.DB.prepare('DELETE FROM catalog_admins WHERE store_id=?').bind(id),
  env.DB.prepare("DELETE FROM stores WHERE id=? AND slug=? AND owner_id LIKE 'site-tenant:%'").bind(id,slug),
 ]);
 return Response.json({ok:true},{headers:{'Cache-Control':'private, no-store'}});
}
