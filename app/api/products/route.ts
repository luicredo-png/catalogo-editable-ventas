import { env } from 'cloudflare:workers';

const PUBLIC_OWNER='public:catalog-demo';

export async function POST(request:Request){
 const p=await request.json<Record<string,unknown>>();
 const storeId=Number(p.storeId);
 const store=await env.DB.prepare('SELECT id FROM stores WHERE id=? AND owner_id=?').bind(storeId,PUBLIC_OWNER).first<{id:number}>();
 if(!store)return Response.json({error:'store_not_found'},{status:404});
 const options=JSON.stringify(Array.isArray(p.options)?p.options:[]);
 const result=await env.DB.prepare('INSERT INTO products (store_id,name,category,description,price,old_price,image,options_json,whatsapp_message,active,sort_order) VALUES (?,?,?,?,?,?,?,?,?,?,(SELECT COALESCE(MAX(sort_order),0)+1 FROM products WHERE store_id=?))').bind(store.id,String(p.name),String(p.category),String(p.description),Number(p.price),Number(p.oldPrice),String(p.image),options,String(p.whatsappMessage||'').slice(0,1200),p.active?1:0,store.id).run();
 return Response.json({product:{...p,id:Number(result.meta.last_row_id)}});
}
