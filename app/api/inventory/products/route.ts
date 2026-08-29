import { env } from 'cloudflare:workers';
import { initInventoryDB } from '@/lib/inventory-db';

export async function POST(request:Request){
 await initInventoryDB();
 const p=await request.json<Record<string,unknown>>();
 const sku=String(p.sku||'').trim().toUpperCase().slice(0,40),name=String(p.name||'').trim().slice(0,100),category=String(p.category||'General').trim().slice(0,60);
 const stock=Math.max(0,Math.floor(Number(p.stock)||0)),minStock=Math.max(0,Math.floor(Number(p.minStock)||0)),cost=Math.max(0,Number(p.cost)||0),salePrice=Math.max(0,Number(p.salePrice)||0);
 if(!sku||!name)return Response.json({error:'Completa el SKU y el nombre.'},{status:400});
 try{
  const result=await env.DB.prepare('INSERT INTO inventory_products (sku,name,category,stock,min_stock,cost,sale_price,active,created_at) VALUES (?,?,?,?,?,?,?,?,?)').bind(sku,name,category,stock,minStock,cost,salePrice,1,new Date().toISOString()).run();
  if(stock>0)await env.DB.prepare("INSERT INTO inventory_movements (product_id,type,quantity,unit_price,total,note,created_at) VALUES (?,'entrada',?,?,?,?,?)").bind(Number(result.meta.last_row_id),stock,cost,stock*cost,'Stock inicial',new Date().toISOString()).run();
  return Response.json({ok:true,id:Number(result.meta.last_row_id)});
 }catch{return Response.json({error:'Ese SKU ya existe.'},{status:409})}
}
