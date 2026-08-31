import { env } from 'cloudflare:workers';
import { initInventoryDB } from '@/lib/inventory-db';

type Option={name:string;values:string[]};
type CatalogProduct={id:number;name:string;category:string;price:number;image:string;options?:Option[]};

function optionParts(value:string){const match=value.match(/^(.*?)::(#[0-9a-f]{6})(?:::(.*))?$/i);return{label:(match?.[1]||value).trim(),image:(match?.[3]||'').trim()}}
function slugPart(value:string){return value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-zA-Z0-9]+/g,'-').replace(/^-|-$/g,'').toUpperCase().slice(0,12)||'UNICO'}

export async function POST(request:Request){
 await initInventoryDB();
 const body=await request.json<{url?:string}>();
 let catalogUrl:URL;
 try{catalogUrl=new URL(String(body.url||''),request.url)}catch{return Response.json({error:'Pega un enlace válido del catálogo.'},{status:400})}
 const current=new URL(request.url);
 if(catalogUrl.origin!==current.origin)return Response.json({error:'El enlace debe pertenecer a este creador de catálogos.'},{status:400});
 const slug=catalogUrl.pathname.split('/').filter(Boolean)[0]||'';
 if(!slug||slug==='admin'||slug==='inventario')return Response.json({error:'Usa el enlace público del catálogo, por ejemplo /ropa.'},{status:400});
 const store=await env.DB.prepare('SELECT id,name FROM stores WHERE slug=?').bind(slug).first<{id:number;name:string}>();
 if(!store)return Response.json({error:'No encontré un catálogo publicado con ese enlace.'},{status:404});
 const result=await env.DB.prepare('SELECT id,name,category,price,image,options_json AS optionsJson FROM products WHERE store_id=? AND active=1 ORDER BY sort_order,id').bind(store.id).all<Record<string,unknown>>();
 let imported=0;
 for(const row of result.results){
  let options:Option[]=[];try{options=JSON.parse(String(row.optionsJson||'[]'))}catch{}
  const colors=options.find(option=>option.name.toLowerCase().includes('color'))?.values||[''];
  const sizes=options.find(option=>/talla|size/i.test(option.name))?.values||[''];
  const models=options.find(option=>/modelo|model/i.test(option.name))?.values||[''];
  for(const colorValue of colors)for(const sizeValue of sizes)for(const modelValue of models){
   const color=optionParts(colorValue),size=optionParts(sizeValue),model=optionParts(modelValue);
   const sourceKey=`${slug}:${row.id}:${color.label}:${size.label}:${model.label}`;
   const sku=`CAT-${row.id}-${slugPart(color.label)}-${slugPart(size.label)}-${slugPart(model.label)}`.slice(0,40);
   const displayModel=model.label||String(row.name);
   await env.DB.prepare(`INSERT INTO inventory_products (sku,name,category,stock,min_stock,cost,sale_price,image,color,size,model,catalog_url,source_key,active,created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) ON CONFLICT(source_key) DO UPDATE SET sku=excluded.sku,name=excluded.name,category=excluded.category,sale_price=excluded.sale_price,image=excluded.image,color=excluded.color,size=excluded.size,model=excluded.model,catalog_url=excluded.catalog_url,active=1`).bind(sku,String(row.name),String(row.category),0,5,0,Number(row.price)||0,color.image||String(row.image||''),color.label,size.label,displayModel,catalogUrl.toString(),sourceKey,1,new Date().toISOString()).run();
   imported++;
  }
 }
 return Response.json({ok:true,imported,products:result.results.length,store:store.name});
}
