import type {D1Database} from '@cloudflare/workers-types';
import {templates} from './catalog-templates';

const legacyNames=[
 'Overshirt Essential','Denim Relaxed','Set Monocromo','Bomber Urbana',
 'Bolso Siena','Set Aura','Vela Ámbar'
];

export async function ensureRopaCollection(db:D1Database,storeId:number){
 const state=await db.prepare(`SELECT COUNT(*) AS total,
  SUM(CASE WHEN name='Polo Azul Marino' THEN 1 ELSE 0 END) AS current_count,
  SUM(CASE WHEN name IN (${legacyNames.map(()=>'?').join(',')}) THEN 1 ELSE 0 END) AS legacy_count
  FROM products WHERE store_id=?`).bind(...legacyNames,storeId).first<{total:number;current_count:number;legacy_count:number}>();
 if(Number(state?.current_count||0)>0)return;
 const total=Number(state?.total||0),legacy=Number(state?.legacy_count||0);
 if(total>6&&legacy===0)return;
 const statements=[db.prepare('DELETE FROM products WHERE store_id=?').bind(storeId)];
 templates.ropa.products.forEach((p,index)=>statements.push(db.prepare('INSERT INTO products (store_id,name,category,description,price,old_price,image,options_json,whatsapp_message,active,sort_order) VALUES (?,?,?,?,?,?,?,?,?,?,?)').bind(storeId,p.name,p.category,p.description,p.price,p.oldPrice,p.image,JSON.stringify(p.options||[]),p.whatsappMessage||'',p.active?1:0,index)));
 await db.batch(statements);
}
