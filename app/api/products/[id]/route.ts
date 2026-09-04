import { env } from 'cloudflare:workers';

const PUBLIC_OWNER='public:catalog-demo';

export async function PUT(request:Request,{params}:{params:Promise<{id:string}>}){
 const {id}=await params;
 const p=await request.json<Record<string,unknown>>();
 const key=String(new URL(request.url).searchParams.get('clave')||'');
 const owned=await env.DB.prepare('SELECT products.id FROM products JOIN stores ON stores.id=products.store_id WHERE products.id=? AND (stores.owner_id=? OR stores.owner_email=?)').bind(Number(id),PUBLIC_OWNER,key).first();
 if(!owned)return Response.json({error:'forbidden'},{status:403});
 await env.DB.prepare('UPDATE products SET name=?,category=?,description=?,price=?,old_price=?,image=?,options_json=?,whatsapp_message=?,active=? WHERE id=?').bind(String(p.name),String(p.category),String(p.description),Number(p.price),Number(p.oldPrice),String(p.image),JSON.stringify(Array.isArray(p.options)?p.options:[]),String(p.whatsappMessage||'').slice(0,1200),p.active?1:0,Number(id)).run();
 return Response.json({ok:true});
}

export async function DELETE(request:Request,{params}:{params:Promise<{id:string}>}){
 const {id}=await params;
 const key=String(new URL(request.url).searchParams.get('clave')||'');
 const result=await env.DB.prepare('DELETE FROM products WHERE id=? AND store_id IN (SELECT id FROM stores WHERE owner_id=? OR owner_email=?)').bind(Number(id),PUBLIC_OWNER,key).run();
 return result.meta.changes?Response.json({ok:true}):Response.json({error:'forbidden'},{status:403});
}
