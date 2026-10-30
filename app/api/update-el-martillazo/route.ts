import { env } from 'cloudflare:workers';

const TOKEN='0c906b672a8e4d79b862da9127be747a';

export async function POST(request:Request){
  if(request.headers.get('x-bootstrap-token')!==TOKEN)return Response.json({error:'not_found'},{status:404});
  const store=await env.DB.prepare('SELECT id FROM stores WHERE slug=? AND owner_id=?').bind('elmartillazo','tenant:elmartillazo').first<{id:number}>();
  if(!store?.id)return Response.json({error:'store_not_found'},{status:404});
  await env.DB.batch([
    env.DB.prepare('UPDATE stores SET logo_url=?, hero_eyebrow=?, hero_description=? WHERE id=?').bind('/el-martillazo-logo.png','FERRETERÍA EN TINGO MARÍA','Pinturas, herramientas y materiales para cada proyecto. Visítanos en Jr. Cayumba N.° 284.',store.id),
    env.DB.prepare('UPDATE products SET image=? WHERE store_id=? AND category=?').bind('/el-martillazo/pinturas.jpg',store.id,'PINTURAS'),
    env.DB.prepare('UPDATE products SET image=? WHERE store_id=? AND category=?').bind('/el-martillazo/herramientas.jpg',store.id,'HERRAMIENTAS'),
    env.DB.prepare('UPDATE products SET image=? WHERE store_id=? AND category=?').bind('/el-martillazo/materiales.webp',store.id,'MATERIALES'),
    env.DB.prepare('UPDATE products SET image=? WHERE store_id=? AND category=?').bind('/el-martillazo/complementos.jpg',store.id,'COMPLEMENTOS'),
  ]);
  return Response.json({ok:true,id:store.id});
}
