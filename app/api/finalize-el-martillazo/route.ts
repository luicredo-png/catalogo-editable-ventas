import { env } from 'cloudflare:workers';

const TOKEN='5d3fb7ca91b044ddaa57e414f27cd4040f61c5727a9c42e1b541f375684a83d2';
const SLUG='elmartillazo';

export async function POST(request:Request){
 if(request.headers.get('x-bootstrap-token')!==TOKEN)return Response.json({error:'not_found'},{status:404});
 const store=await env.DB.prepare('SELECT id FROM stores WHERE slug=? AND owner_id=?').bind(SLUG,'tenant:'+SLUG).first<{id:number}>();
 if(!store?.id)return Response.json({error:'store_not_found'},{status:404});
 const banner='/ferreteria-el-martillazo-banner.png';
 const settings=[
  {key:'TODOS',label:'Todo',image:banner,color:'#ffcc00'},
  {key:'PINTURAS',label:'Pinturas',image:banner,color:'#f04a23'},
  {key:'HERRAMIENTAS',label:'Herramientas',image:banner,color:'#ffcc00'},
  {key:'MATERIALES',label:'Materiales',image:banner,color:'#123a7a'},
  {key:'COMPLEMENTOS',label:'Complementos',image:banner,color:'#f04a23'},
  {key:'__CATEGORY_BACKGROUND__',label:'',image:'',color:'#0d2455'},
  {key:'__PRODUCT_DISPLAY__',label:'',image:JSON.stringify({sizesEnabled:false,galleryButtonLabel:'Ver opciones'}),color:''},
 ];
 const option=(name:string)=>JSON.stringify([{name,values:['Consultar disponibilidad']}]);
 await env.DB.batch([
  env.DB.prepare('UPDATE stores SET category_settings=? WHERE id=?').bind(JSON.stringify(settings),store.id),
  env.DB.prepare('UPDATE products SET options_json=? WHERE store_id=? AND category=?').bind(option('Presentación'),store.id,'PINTURAS'),
  env.DB.prepare('UPDATE products SET options_json=? WHERE store_id=? AND category=?').bind(option('Marca'),store.id,'HERRAMIENTAS'),
  env.DB.prepare('UPDATE products SET options_json=? WHERE store_id=? AND category=?').bind(option('Tipo'),store.id,'MATERIALES'),
  env.DB.prepare('UPDATE products SET options_json=? WHERE store_id=? AND category=?').bind(option('Marca'),store.id,'COMPLEMENTOS'),
 ]);
 return Response.json({ok:true,id:store.id});
}
