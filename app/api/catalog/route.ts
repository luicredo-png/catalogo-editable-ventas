import { env } from 'cloudflare:workers';

const GMPAONYX_PRODUCTS = [
 ['03','DULCINEA'],['04','HEROE'],['05','MODELO'],['06','LANZA'],
 ['07','ESCUDO'],['08','CASCO'],['09','ARMADURA'],['10','ESPUELA'],
 ['11','FANTASMA'],['12','SOMBRA'],['13','DEMON'],['14','VISION'],
 ['15','MODELO'],['16','LOCURA'],['17','GASTA'],['18','HONOR'],
 ['19','REBELDE'],['20','HAZANA'],['21','LA_META'],['22','ABISMO'],
 ['23','POLVO'],['24','ASPAS'],['25','CAMPEON'],['26','LA_MANCHA'],
] as const;

async function ensureGmpaonyxProducts(storeId:number){
 const description='Algodón 20/1 · Cuello reforzado';
 await env.DB.batch(GMPAONYX_PRODUCTS.map(([number,label],index)=>{
  const image=`/gmpaonyx-products/GMP-${number}_${label}.jpg`;
  const name=`GMP-${number}: ${label.replaceAll('_',' ')}`;
  const options=JSON.stringify([
   {name:'Color',values:[`Color 1::#8d96a5::${image}`]},
   {name:'Talla',values:['S','M','L','XL']},
  ]);
  return env.DB.prepare(`INSERT INTO products
   (store_id,name,category,description,price,old_price,image,options_json,whatsapp_message,active,sort_order)
   SELECT ?,?,?,?,?,?,?,?,?,?,?
   WHERE NOT EXISTS (SELECT 1 FROM products WHERE store_id=? AND name=?)`)
   .bind(storeId,name,'NUEVO',description,0,0,image,options,'',1,index+2,storeId,name);
 }));
}

export async function GET(request:Request){
 const slug=new URL(request.url).searchParams.get('slug');
 if(!slug)return Response.json({error:'slug_required'},{status:400});
 const store=await env.DB.prepare('SELECT id,template_key,slug,name,whatsapp,whatsapp_message,instagram,facebook,accent,background_color,background_image,collection_background_color,collection_background_image,collection_motion,collection_overlay_strength,mobile_columns,promo_text,category_settings,font_family,heading_font,hero_font,store_name_font,hero_eyebrow_font,hero_highlight_font,hero_description_font,hero_cta_font,product_font,price_font,button_font,button_color,secondary_color,hero_button_color,button_style,secondary_button_style,hero_button_style,store_appearance,text_color,surface_color,surface_style,surface_background_image,overlay_strength,catalog_title,logo_url,hero_image,hero_eyebrow,hero_description,hero_highlight,hero_cta_label FROM stores WHERE slug=?').bind(slug).first<Record<string,unknown>>();
 if(!store)return Response.json({error:'not_found'},{status:404});
 if(slug==='gmpaonyx')await ensureGmpaonyxProducts(Number(store.id));
 const rows=await env.DB.prepare('SELECT id,name,category,description,price,old_price AS oldPrice,image,options_json AS optionsJson,whatsapp_message AS whatsappMessage,active FROM products WHERE store_id=? AND active=1 ORDER BY sort_order,id').bind(store.id).all();
 return Response.json({store,products:rows.results.map(p=>{let options=[];try{options=JSON.parse(String((p as Record<string,unknown>).optionsJson||'[]'))}catch{}return{...p,options,active:Boolean(p.active)}})});
}
