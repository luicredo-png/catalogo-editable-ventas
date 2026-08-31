import { env } from 'cloudflare:workers';
import {ensureRopaCollection} from '@/lib/ropa-collection';
import {ensureButtonStyleColumns} from '@/lib/button-styles-db';

export async function GET(request:Request){
 const slug=new URL(request.url).searchParams.get('slug');
 if(!slug)return Response.json({error:'slug_required'},{status:400});
 await ensureButtonStyleColumns(env.DB);
 const store=await env.DB.prepare('SELECT id,template_key,slug,name,whatsapp,whatsapp_message,instagram,facebook,accent,background_color,background_image,collection_background_color,collection_background_image,collection_motion,collection_overlay_strength,mobile_columns,promo_text,category_settings,font_family,heading_font,hero_font,store_name_font,hero_eyebrow_font,hero_highlight_font,hero_description_font,hero_cta_font,product_font,price_font,button_font,button_color,secondary_color,hero_button_color,button_style,secondary_button_style,hero_button_style,text_color,surface_color,surface_style,surface_background_image,overlay_strength,catalog_title,logo_url,hero_image,hero_eyebrow,hero_description,hero_highlight,hero_cta_label FROM stores WHERE slug=?').bind(slug).first<Record<string,unknown>>();
 if(!store)return Response.json({error:'not_found'},{status:404});
 if(store.template_key==='ropa')await ensureRopaCollection(env.DB,Number(store.id));
 const rows=await env.DB.prepare('SELECT id,name,category,description,price,old_price AS oldPrice,image,options_json AS optionsJson,whatsapp_message AS whatsappMessage,active FROM products WHERE store_id=? AND active=1 ORDER BY sort_order,id').bind(store.id).all();
 return Response.json({store,products:rows.results.map(p=>{let options=[];try{options=JSON.parse(String((p as Record<string,unknown>).optionsJson||'[]'))}catch{}return{...p,options,active:Boolean(p.active)}})});
}
