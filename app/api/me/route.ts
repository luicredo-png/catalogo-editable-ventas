import { env } from 'cloudflare:workers';
import { authorize, privateError } from '@/lib/admin-auth';
import { templates, type TemplateKey } from '../../../lib/catalog-templates';
import {generatedBusinessHeroDefaults,isGeneratedBusinessKey} from '../../../lib/generated-business-catalogs';

const PUBLIC_OWNER='public:catalog-demo';

function defaultOptions(key:TemplateKey){
 if(key==='restaurantes')return [{name:'Presentación',values:['Clásico','Generoso']},{name:'Acompañamiento',values:['Papas doradas','Ensalada','Arroz']},{name:'Extras',values:['Sin extras','Huevo + S/ 3','Salsa extra + S/ 2']}];
 if(key==='comida-rapida')return [{name:'Tamaño',values:['Personal','Mediano','Grande']},{name:'Combo',values:['Solo producto','Con papas','Papas + bebida']},{name:'Extras',values:['Sin extras','Queso + S/ 3','Bebida + S/ 5']}];
 if(key==='detalles-romanticos')return [{name:'Presentación',values:['Clásica','Premium']},{name:'Dedicatoria',values:['Sin tarjeta','Con tarjeta personalizada']}];
 if(key==='perfumeria')return [{name:'Tamaño',values:['30 ml','50 ml','100 ml']},{name:'Presentación',values:['Perfume','Perfume + caja de regalo']}];
 if(key==='postres')return [{name:'Tamaño',values:['Personal','Mediano','Grande']},{name:'Dedicatoria',values:['Sin dedicatoria','Con dedicatoria']}];
 if(key==='accesorios')return [{name:'Color',values:['Rosa','Dorado','Negro']}];
 if(key==='zapatos-mujer')return [{name:'Color',values:['Negro','Nude','Rosa']},{name:'Talla',values:['35','36','37','38','39','40']}];
 return [{name:'Color',values:['Negro','Beige','Rosa']},{name:'Talla',values:['S','M','L']}];
}

function productRow(p:Record<string,unknown>){let options=[];try{options=JSON.parse(String(p.optionsJson||'[]'))}catch{}return{...p,options,active:Boolean(p.active)}}

export async function GET(request:Request){
 const admin=await authorize(request,env);
 if(admin instanceof Response)return admin;
 const user={userId:PUBLIC_OWNER};
 const url=new URL(request.url);
 const tenantSlug=String(url.searchParams.get('slug')||'');
 if(tenantSlug){
  if(!admin.owner&&(admin.demo||admin.tenant!==tenantSlug))return privateError(403,'forbidden');
  const tenant=await env.DB.prepare("SELECT * FROM stores WHERE slug=? AND owner_id LIKE 'tenant:%'").bind(tenantSlug).first<Record<string,unknown>>();
  if(!tenant)return privateError(404,'store_not_found');
  const rows=await env.DB.prepare('SELECT id,name,category,description,price,old_price AS oldPrice,image,options_json AS optionsJson,whatsapp_message AS whatsappMessage,active FROM products WHERE store_id=? ORDER BY sort_order,id').bind(tenant.id).all();
  return Response.json({user:{email:admin.email,displayName:String(tenant.name),guest:false},adminKey:'',store:tenant,products:rows.results.map(p=>productRow(p as Record<string,unknown>))},{headers:{'Cache-Control':'private, no-store'}});
 }
 if(!admin.owner&&!admin.demo)return privateError(403,'forbidden');
 const requested=new URL(request.url).searchParams.get('template') as TemplateKey|null;
 const key:TemplateKey=requested&&requested in templates?requested:'ropa';
 const template=templates[key];
 let store=await env.DB.prepare('SELECT * FROM stores WHERE owner_id=? AND template_key=?').bind(PUBLIC_OWNER,key).first<Record<string,unknown>>();
 const ownStore=await env.DB.prepare('SELECT * FROM stores WHERE owner_id=? AND template_key=?').bind(user.userId,key).first<Record<string,unknown>>();
 const legacyStore=await env.DB.prepare("SELECT * FROM stores WHERE template_key=? AND owner_id<>? AND owner_id NOT LIKE 'guest:%' ORDER BY id LIMIT 1").bind(key,PUBLIC_OWNER).first<Record<string,unknown>>();
 const personal=ownStore||legacyStore;
 if(store&&personal&&!String(personal.owner_id).startsWith('guest:')&&Number(store.id)!==Number(personal.id)){
  const sharedId=Number(store.id),personalId=Number(personal.id);
  await env.DB.batch([
   env.DB.prepare('DELETE FROM products WHERE store_id=?').bind(sharedId),
   env.DB.prepare('UPDATE products SET store_id=? WHERE store_id=?').bind(sharedId,personalId),
   env.DB.prepare('UPDATE stores SET name=?,whatsapp=?,accent=?,background_color=?,background_image=?,collection_background_color=?,collection_background_image=?,collection_motion=?,collection_overlay_strength=?,mobile_columns=?,promo_text=?,category_settings=?,font_family=?,heading_font=?,hero_font=?,product_font=?,price_font=?,button_font=?,button_color=?,secondary_color=?,hero_button_color=?,text_color=?,surface_color=?,surface_style=?,surface_background_image=?,overlay_strength=?,catalog_title=?,logo_url=?,hero_image=?,hero_eyebrow=?,hero_description=?,hero_highlight=?,hero_cta_label=? WHERE id=?').bind(personal.name,personal.whatsapp,personal.accent,personal.background_color,personal.background_image,personal.collection_background_color||personal.background_color,personal.collection_background_image||'',personal.collection_motion||'none',personal.collection_overlay_strength??.35,Number(personal.mobile_columns)===2?2:1,String(personal.promo_text||'🔥 OFERTA ESPECIAL · PIDE HOY POR WHATSAPP · NUEVOS MODELOS DISPONIBLES'),String(personal.category_settings||''),personal.font_family,personal.heading_font,personal.hero_font||personal.heading_font,personal.product_font||personal.font_family,personal.price_font||personal.heading_font,personal.button_font||personal.font_family,personal.button_color,personal.secondary_color,personal.hero_button_color||personal.secondary_color,personal.text_color,personal.surface_color,personal.surface_style||'solid',personal.surface_background_image||'',personal.overlay_strength,personal.catalog_title,personal.logo_url,personal.hero_image,personal.hero_eyebrow,personal.hero_description,personal.hero_highlight,personal.hero_cta_label,sharedId),
   env.DB.prepare('DELETE FROM stores WHERE id=?').bind(personalId)
  ]);
  store=await env.DB.prepare('SELECT * FROM stores WHERE id=?').bind(sharedId).first<Record<string,unknown>>();
 }
 if(!store){
  if(personal){
   await env.DB.prepare('UPDATE stores SET owner_id=?,owner_email=?,slug=? WHERE id=?').bind(PUBLIC_OWNER,'publico@catalogo.demo',key,personal.id).run();
   store=await env.DB.prepare('SELECT * FROM stores WHERE id=?').bind(personal.id).first<Record<string,unknown>>();
  }else{
   const s=template.store;
   const defaults=designDefaults(key),hero=heroDefaults(key);
   const result=await env.DB.prepare('INSERT INTO stores (owner_id,owner_email,template_key,slug,name,whatsapp,accent,background_color,background_image,collection_background_color,collection_background_image,collection_motion,collection_overlay_strength,mobile_columns,promo_text,category_settings,font_family,heading_font,hero_font,product_font,price_font,button_font,button_color,secondary_color,hero_button_color,text_color,surface_color,surface_style,surface_background_image,overlay_strength,catalog_title,logo_url,hero_image,hero_eyebrow,hero_description,hero_highlight,hero_cta_label,created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)').bind(PUBLIC_OWNER,'publico@catalogo.demo',key,key,s.name,s.whatsapp,s.accent,s.backgroundColor,s.backgroundImage,s.backgroundColor,'','none',.35,1,'🔥 OFERTA ESPECIAL · PIDE HOY POR WHATSAPP · NUEVOS MODELOS DISPONIBLES','',defaults.fontFamily,defaults.headingFont,defaults.headingFont,defaults.fontFamily,defaults.headingFont,defaults.fontFamily,defaults.buttonColor,defaults.secondaryColor,defaults.secondaryColor,defaults.textColor,defaults.surfaceColor,'solid','',defaults.overlayStrength,s.catalogTitle,s.logoUrl,hero.image,hero.eyebrow,hero.description,hero.highlight,hero.cta,new Date().toISOString()).run();
   const id=Number(result.meta.last_row_id);
   await env.DB.batch(template.products.map((p,i)=>env.DB.prepare('INSERT INTO products (store_id,name,category,description,price,old_price,image,options_json,whatsapp_message,active,sort_order) VALUES (?,?,?,?,?,?,?,?,?,?,?)').bind(id,p.name,p.category,p.description,p.price,p.oldPrice,p.image,JSON.stringify(p.options||defaultOptions(key)),p.whatsappMessage||'',p.active?1:0,i)));
   store=await env.DB.prepare('SELECT * FROM stores WHERE id=?').bind(id).first<Record<string,unknown>>();
  }
 }
 const rows=await env.DB.prepare('SELECT id,name,category,description,price,old_price AS oldPrice,image,options_json AS optionsJson,whatsapp_message AS whatsappMessage,active FROM products WHERE store_id=? ORDER BY sort_order,id').bind(store!.id).all();
 return Response.json({user:{email:admin.email,displayName:'Editor demo',guest:admin.demo},adminKey:'',store,products:rows.results.map(p=>productRow(p as Record<string,unknown>))},{headers:{'Cache-Control':'private, no-store'}});
}

function designDefaults(key:TemplateKey){
 if(key==='detalles-romanticos')return{fontFamily:'var(--font-outfit)',headingFont:'var(--font-cormorant)',buttonColor:'#25d366',secondaryColor:'#ee668d',textColor:'#fff7fa',surfaceColor:'#3b1725',overlayStrength:.42};
 if(key==='perfumeria')return{fontFamily:'var(--font-outfit)',headingFont:'var(--font-playfair)',buttonColor:'#25d366',secondaryColor:'#78aef8',textColor:'#f5f9ff',surfaceColor:'#09182b',overlayStrength:.44};
 if(key==='postres')return{fontFamily:'var(--font-outfit)',headingFont:'var(--font-playfair)',buttonColor:'#25d366',secondaryColor:'#e7829e',textColor:'#fff8f8',surfaceColor:'#3b2025',overlayStrength:.38};
 if(key==='restaurantes')return{fontFamily:'var(--font-outfit)',headingFont:'var(--font-playfair)',buttonColor:'#25d366',secondaryColor:'#d6a85f',textColor:'#fffaf0',surfaceColor:'#101c17',overlayStrength:.48};
 if(key==='comida-rapida')return{fontFamily:'var(--font-outfit)',headingFont:'var(--font-space)',buttonColor:'#25d366',secondaryColor:'#ffcf24',textColor:'#ffffff',surfaceColor:'#250d09',overlayStrength:.42};
 if(key==='mujer'||key==='zapatos-mujer')return{fontFamily:'var(--font-outfit)',headingFont:'var(--font-playfair)',buttonColor:'#25d366',secondaryColor:'#ff74a6',textColor:'#fff7fb',surfaceColor:'#351826',overlayStrength:.42};
 if(key==='accesorios')return{fontFamily:'var(--font-outfit)',headingFont:'var(--font-cormorant)',buttonColor:'#25d366',secondaryColor:'#ff74a6',textColor:'#fff7fb',surfaceColor:'#351826',overlayStrength:.38};
 return{fontFamily:'var(--font-outfit)',headingFont:'var(--font-space)',buttonColor:'#25d366',secondaryColor:'#8fa7ff',textColor:'#ffffff',surfaceColor:'#10131c',overlayStrength:.56};
}

function heroDefaults(key:TemplateKey){
 if(isGeneratedBusinessKey(key)){const hero=generatedBusinessHeroDefaults[key];return{image:hero.heroImage,eyebrow:hero.heroEyebrow,description:hero.heroDescription,highlight:hero.heroHighlight,cta:hero.heroCtaLabel}}
 if(key==='restaurantes')return{image:'https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=1800&q=88',eyebrow:'SABORES DE AUTOR',description:'Una experiencia especial, preparada para disfrutar.',highlight:'RESERVA Y PIDE',cta:'Ver la carta'};
 if(key==='comida-rapida')return{image:'https://images.unsplash.com/photo-1565299507177-b0ac66763828?auto=format&fit=crop&w=1800&q=88',eyebrow:'ANTOJO DEL DÍA',description:'Combos irresistibles, listos para pedir sin esperar.',highlight:'RÁPIDO Y DELICIOSO',cta:'Ver el menú'};
 if(key==='mujer')return{image:'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1800&q=88',eyebrow:'NUEVA TEMPORADA',description:'Prendas que celebran tu estilo y tu personalidad.',highlight:'2026',cta:'Ver colección'};
 if(key==='zapatos-mujer')return{image:'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=1800&q=88',eyebrow:'NUEVA TEMPORADA',description:'Tacones, zapatillas, botines y sandalias para vender por WhatsApp.',highlight:'2026',cta:'Ver zapatos'};
 if(key==='accesorios')return{image:'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=1800&q=88',eyebrow:'DETALLES ÚNICOS',description:'Accesorios elegidos para transformar cada look.',highlight:'NUEVOS FAVORITOS',cta:'Descubrir accesorios'};
 return{image:'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1800&q=88',eyebrow:'NUEVA TEMPORADA',description:'Estilo, comodidad y tendencia en cada prenda.',highlight:'2026',cta:'Ver colección'};
}

