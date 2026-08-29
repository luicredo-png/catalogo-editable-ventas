import { env } from 'cloudflare:workers';
import { initInventoryDB } from '@/lib/inventory-db';

export async function POST(request:Request){
 await initInventoryDB();
 const m=await request.json<Record<string,unknown>>();
 const productId=Number(m.productId),type=String(m.type)==='venta'?'venta':'entrada',quantity=Math.floor(Number(m.quantity)||0),note=String(m.note||'').trim().slice(0,160);
 if(!productId||quantity<=0)return Response.json({error:'Indica una cantidad válida.'},{status:400});
 const product=await env.DB.prepare('SELECT id,name,stock,cost,sale_price AS salePrice FROM inventory_products WHERE id=? AND active=1').bind(productId).first<Record<string,unknown>>();
 if(!product)return Response.json({error:'Producto no encontrado.'},{status:404});
 const currentStock=Number(product.stock||0);
 if(type==='venta'&&quantity>currentStock)return Response.json({error:`Stock insuficiente. Disponible: ${currentStock}.`},{status:409});
 const unitPrice=Math.max(0,Number(m.unitPrice)||(type==='venta'?Number(product.salePrice):Number(product.cost))||0),delta=type==='venta'?-quantity:quantity,now=new Date().toISOString();
 await env.DB.batch([
  env.DB.prepare('UPDATE inventory_products SET stock=stock+? WHERE id=?').bind(delta,productId),
  env.DB.prepare('INSERT INTO inventory_movements (product_id,type,quantity,unit_price,total,note,created_at) VALUES (?,?,?,?,?,?,?)').bind(productId,type,quantity,unitPrice,quantity*unitPrice,note,now)
 ]);
 return Response.json({ok:true,newStock:currentStock+delta});
}
