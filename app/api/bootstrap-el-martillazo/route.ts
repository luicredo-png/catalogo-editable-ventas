import { env } from 'cloudflare:workers';
import { hashPassword } from '@/lib/passwords';

const TOKEN='a94c8f16d2e74393a2b773e66e2dc01b5db76ce82fa048d89456c79c6f5064b3';
const SLUG='elmartillazo';

export async function POST(request:Request){
 if(request.headers.get('x-bootstrap-token')!==TOKEN)return Response.json({error:'not_found'},{status:404});
 const existing=await env.DB.prepare('SELECT id FROM stores WHERE slug=?').bind(SLUG).first<{id:number}>();
 if(existing?.id)return Response.json({ok:true,id:existing.id,existing:true});
 const source=await env.DB.prepare('SELECT * FROM stores WHERE owner_id=? AND template_key=?').bind('public:catalog-demo','perfumeria').first<Record<string,unknown>>();
 if(!source)return Response.json({error:'template_not_found'},{status:404});
 const passwordHash=await hashPassword('Martillazo#2026'),createdAt=new Date().toISOString();
 const record:Record<string,unknown>={
  ...source,
  owner_id:'tenant:'+SLUG,
  owner_email:'',
  slug:SLUG,
  name:'Ferretería El Martillazo',
  whatsapp:'51927554379',
  whatsapp_message:'Hola, quiero consultar por {producto}.\n{opciones}\nFerretería El Martillazo · Jr. Cayumba N.º 284',
  accent:'#ffcc00',
  secondary_color:'#f04a23',
  hero_button_color:'#f04a23',
  button_color:'#25d366',
  background_color:'#07173b',
  collection_background_color:'#07173b',
  surface_color:'#0d2455',
  text_color:'#ffffff',
  promo_text:'🔨 FERRETERÍA EL MARTILLAZO · PINTURAS Y HERRAMIENTAS · WHATSAPP 927 554 379',
  catalog_title:'TODO PARA TU PROYECTO',
  hero_image:'/ferreteria-el-martillazo-banner.png',
  hero_eyebrow:'FERRETERÍA EN PUCALLPA',
  hero_highlight:'EL MARTILLAZO',
  hero_description:'Pinturas en general, herramientas y productos de marcas líderes. Visítanos en Jr. Cayumba N.º 284 o escríbenos al 927 554 379.',
  hero_cta_label:'Ver productos',
  created_at:createdAt,
 };
 delete record.id;
 const columns=Object.keys(record).filter(key=>/^[a-z_]+$/.test(key));
 await env.DB.batch([
  env.DB.prepare('INSERT INTO stores ('+columns.join(',')+') VALUES ('+columns.map(()=>'?').join(',')+')').bind(...columns.map(key=>record[key]??'')),
  env.DB.prepare('INSERT INTO catalog_admins(id,store_id,email,password_hash,active,created_at) SELECT ?,id,?,?,1,? FROM stores WHERE slug=?').bind(crypto.randomUUID(),'ferreteria-el-martillazo',passwordHash,createdAt,SLUG),
 ]);
 const store=await env.DB.prepare('SELECT id FROM stores WHERE slug=?').bind(SLUG).first<{id:number}>();
 if(!store?.id)return Response.json({error:'creation_incomplete'},{status:503});
 const image='/ferreteria-el-martillazo-banner.png';
 const items=[
  ['Pinturas en general','PINTURAS','Colores Fast, Velsat, CPP, Anypsa y más. Consulta presentaciones, tonos y disponibilidad.'],
  ['Herramientas para tu proyecto','HERRAMIENTAS','Truper, Bellota, Total, Italgir y otras marcas para obra, taller y hogar.'],
  ['Materiales y accesorios','MATERIALES','Soluciones para construcción, reparación, instalación y mantenimiento.'],
  ['Adhesivos y complementos','COMPLEMENTOS','Sika, 3M, Opalux, Payco y más productos para un acabado profesional.'],
 ];
 await env.DB.batch(items.map((item,index)=>env.DB.prepare('INSERT INTO products(store_id,name,category,description,price,old_price,image,options_json,whatsapp_message,active,audience,sort_order) VALUES(?,?,?,?,0,0,?,\'[]\',\'\',1,\'all\',?)').bind(store.id,item[0],item[1],item[2],image,index)));
 return Response.json({ok:true,id:store.id,slug:SLUG});
}
