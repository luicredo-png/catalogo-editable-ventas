import { env } from 'cloudflare:workers';

const TOKEN='854b3c27aeb04fb7b35a6976075f2ec0';

export async function POST(request:Request){
  if(request.headers.get('x-bootstrap-token')!==TOKEN)return Response.json({error:'not_found'},{status:404});
  const store=await env.DB.prepare('SELECT id FROM stores WHERE slug=? AND owner_id=?').bind('elmartillazo','tenant:elmartillazo').first<{id:number}>();
  if(!store?.id)return Response.json({error:'store_not_found'},{status:404});
  const settings=[
    {key:'TODOS',label:'Todo',image:'/el-martillazo/fondos/herramientas.webp',color:'#ffcc00'},
    {key:'PINTURAS',label:'Pinturas',image:'/el-martillazo/fondos/pinturas.webp',color:'#f04a23'},
    {key:'HERRAMIENTAS',label:'Herramientas',image:'/el-martillazo/fondos/herramientas.webp',color:'#ffcc00'},
    {key:'MATERIALES',label:'Materiales',image:'/el-martillazo/fondos/materiales.webp',color:'#168cff'},
    {key:'COMPLEMENTOS',label:'Complementos',image:'/el-martillazo/fondos/complementos.webp',color:'#f04a23'},
    {key:'__CATEGORY_BACKGROUND__',label:'',image:'/el-martillazo/fondos/herramientas.webp',color:'#07111e'},
    {key:'__PRODUCT_DISPLAY__',label:'',image:JSON.stringify({sizesEnabled:false,galleryButtonLabel:'Ver opciones'}),color:''},
  ];
  await env.DB.prepare(`UPDATE stores SET category_settings=?, collection_background_color=?, collection_background_image=?, collection_motion=?, collection_overlay_strength=?, surface_color=?, surface_style=?, surface_background_image=?, overlay_strength=? WHERE id=?`).bind(JSON.stringify(settings),'#050b14','/el-martillazo/fondos/herramientas.webp','drift',0.68,'#080d14','media','/el-martillazo/fondos/complementos.webp',0.74,store.id).run();
  return Response.json({ok:true,id:store.id});
}
