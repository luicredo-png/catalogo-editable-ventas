import { env } from 'cloudflare:workers';
import { authorize, privateError } from '@/lib/admin-auth';
import { hashPassword } from '@/lib/passwords';
const RUBROS=['restaurantes','comida-rapida','detalles-romanticos','ropa','mujer','zapatos-mujer','perfumeria','postres','accesorios'];
async function owner(request:Request){
 const admin=await authorize(request,env);
 return admin instanceof Response ? admin : !admin.owner ? privateError(403,'owner_required') : null;
}
export async function GET(request:Request){
 const denied=await owner(request);if(denied)return denied;
 const rows=await env.DB.prepare("SELECT id,slug,name,template_key AS templateKey,created_at AS createdAt FROM stores WHERE owner_id LIKE 'tenant:%' ORDER BY id DESC LIMIT 1000").all();
 return Response.json({clients:rows.results},{headers:{'Cache-Control':'private, no-store'}});
}
export async function POST(request:Request){
 const denied=await owner(request);if(denied)return denied;
 let body;try{body=await request.json<Record<string,unknown>>()}catch{return privateError(400,'invalid_request')}
 if(!body || typeof body!=='object' || Array.isArray(body))return privateError(400,'invalid_request');
 const slug=String(body.slug||'').trim().toLowerCase(),name=String(body.name||'').trim(),email=String(body.email||'').trim().toLowerCase(),password=String(body.password||''),templateKey=String(body.templateKey||'');
 if(!/^[a-z0-9][a-z0-9-]{1,43}[a-z0-9]$/.test(slug)||['www','creador','admin','api','login'].includes(slug))return privateError(400,'invalid_slug');
 if(!name||name.length>80||!email.includes('@')||email.length>254||password.length<12||password.length>128||!RUBROS.includes(templateKey))return privateError(400,'invalid_fields');
 const source=await env.DB.prepare('SELECT * FROM stores WHERE owner_id=? AND template_key=?').bind('public:catalog-demo',templateKey).first<Record<string,unknown>>();
 if(!source)return privateError(404,'template_not_found');
 const passwordHash=await hashPassword(password),createdAt=new Date().toISOString();
 const record:Record<string,unknown>={...source,owner_id:'tenant:'+slug,owner_email:'',slug,name,created_at:createdAt}; delete record.id;
 const columns=Object.keys(record).filter(k=>/^[a-z_]+$/.test(k));
 try{
  await env.DB.batch([
   env.DB.prepare('INSERT INTO stores ('+columns.join(',')+') VALUES ('+columns.map(()=>'?').join(',')+')').bind(...columns.map(k=>record[k]??'')),
   env.DB.prepare('INSERT INTO catalog_admins(id,store_id,email,password_hash,active,created_at) SELECT ?,id,?,?,1,? FROM stores WHERE slug=?').bind(crypto.randomUUID(),email,passwordHash,createdAt,slug),
   env.DB.prepare('INSERT INTO products (store_id,name,category,description,price,old_price,image,options_json,whatsapp_message,active,sort_order) SELECT (SELECT id FROM stores WHERE slug=?),name,category,description,price,old_price,image,options_json,whatsapp_message,active,sort_order FROM products WHERE store_id=?').bind(slug,Number(source.id))
  ]);
 }catch(error){if(String(error).includes('UNIQUE'))return privateError(409,'slug_exists');return privateError(503,'creation_failed');}
 const row=await env.DB.prepare('SELECT id FROM stores WHERE slug=?').bind(slug).first<{id:number}>();
 return Response.json({client:{id:row?.id,slug,name,templateKey,createdAt,catalogUrl:'https://'+slug+'.xn--micatlogo-41a.shop',adminUrl:'https://'+slug+'.xn--micatlogo-41a.shop/login'}},{status:201,headers:{'Cache-Control':'no-store'}});
}
