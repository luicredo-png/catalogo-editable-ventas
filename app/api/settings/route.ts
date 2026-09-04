import { env } from 'cloudflare:workers';
import {ensureButtonStyleColumns} from '@/lib/button-styles-db';

const PUBLIC_OWNER='public:catalog-demo';

export async function PUT(request:Request){
 await ensureButtonStyleColumns(env.DB);
 const s=await request.json<Record<string,unknown>>();
 const color=(v:unknown,f:string)=>/^#[0-9a-f]{6}$/i.test(String(v))?String(v):f;
 const whatsapp=String(s.whatsapp||'').replace(/\D/g,'');
 if(whatsapp.length<8)return Response.json({error:'invalid_whatsapp'},{status:400});
 const overlay=Math.max(0,Math.min(.92,Number(s.overlayStrength??.62)));
 const collectionOverlay=Math.max(0,Math.min(.85,Number(s.collectionOverlayStrength??.35)));
 const mobileColumns=Number(s.mobileColumns)===2?2:1;
 const promoText=String(s.promoText||'').slice(0,180);
 const categorySettings=String(s.categorySettings||'').slice(0,5000);
 const motion=['none','gradient','float','zoom','aurora','waves','grid','blinking-squares','pulse','drift'].includes(String(s.collectionMotion))?String(s.collectionMotion):'none';
 const surfaceStyle=['solid','gradient','glass','media','transparent'].includes(String(s.surfaceStyle))?String(s.surfaceStyle):'solid';
 const surfaceBackgroundImage=String(s.surfaceBackgroundImage||'').slice(0,1000);
 const buttonStyle=(value:unknown,fallback:string)=>['glow','silver','dark','flash','gradient'].includes(String(value))?String(value):fallback;
 const whatsappMessage=String(s.whatsappMessage||'Hola, quiero pedir {producto}.\n{opciones}\nPrecio: S/ {precio}\nCatálogo: {catalogo}').slice(0,1600);
 const instagram=String(s.instagram||'').trim().slice(0,500);
 const facebook=String(s.facebook||'').trim().slice(0,500);
 const adminKey=String(s.adminKey||'');
 const result=await env.DB.prepare('UPDATE stores SET name=?,whatsapp=?,accent=?,background_color=?,background_image=?,collection_background_color=?,collection_background_image=?,collection_motion=?,collection_overlay_strength=?,mobile_columns=?,promo_text=?,category_settings=?,font_family=?,heading_font=?,hero_font=?,store_name_font=?,hero_eyebrow_font=?,hero_highlight_font=?,hero_description_font=?,hero_cta_font=?,product_font=?,price_font=?,button_font=?,button_color=?,secondary_color=?,hero_button_color=?,text_color=?,surface_color=?,surface_style=?,surface_background_image=?,overlay_strength=?,catalog_title=?,logo_url=?,hero_image=?,hero_eyebrow=?,hero_description=?,hero_highlight=?,hero_cta_label=? WHERE id=? AND (owner_id=? OR owner_email=?)').bind(String(s.name).slice(0,80),whatsapp,color(s.accent,'#168cff'),color(s.backgroundColor,'#050b14'),String(s.backgroundImage||'').slice(0,1000),color(s.collectionBackgroundColor,'#050b14'),String(s.collectionBackgroundImage||'').slice(0,1000),motion,collectionOverlay,mobileColumns,promoText,categorySettings,String(s.fontFamily||'var(--font-outfit)').slice(0,60),String(s.headingFont||'var(--font-space)').slice(0,60),String(s.heroFont||s.headingFont||'var(--font-space)').slice(0,60),String(s.storeNameFont||s.headingFont||'var(--font-space)').slice(0,60),String(s.heroEyebrowFont||s.headingFont||'var(--font-space)').slice(0,60),String(s.heroHighlightFont||s.headingFont||'var(--font-space)').slice(0,60),String(s.heroDescriptionFont||s.fontFamily||'var(--font-outfit)').slice(0,60),String(s.heroCtaFont||s.buttonFont||s.fontFamily||'var(--font-outfit)').slice(0,60),String(s.productFont||s.fontFamily||'var(--font-outfit)').slice(0,60),String(s.priceFont||s.headingFont||'var(--font-space)').slice(0,60),String(s.buttonFont||s.fontFamily||'var(--font-outfit)').slice(0,60),color(s.buttonColor,'#25d366'),color(s.secondaryColor,'#168cff'),color(s.heroButtonColor,'#168cff'),color(s.textColor,'#ffffff'),color(s.surfaceColor,'#07111e'),surfaceStyle,surfaceBackgroundImage,overlay,String(s.catalogTitle||'ÚLTIMOS MODELOS').slice(0,100),String(s.logoUrl||'').slice(0,1000),String(s.heroImage||'').slice(0,1000),String(s.heroEyebrow||'').slice(0,80),String(s.heroDescription||'').slice(0,240),String(s.heroHighlight||'').slice(0,80),String(s.heroCtaLabel||'Ver catálogo').slice(0,50),Number(s.id),PUBLIC_OWNER,adminKey).run();
 if(result.meta.changes)await env.DB.prepare('UPDATE stores SET whatsapp_message=?,instagram=?,facebook=? WHERE id=? AND (owner_id=? OR owner_email=?)').bind(whatsappMessage,instagram,facebook,Number(s.id),PUBLIC_OWNER,adminKey).run();
 if(result.meta.changes)await env.DB.prepare('UPDATE stores SET button_style=?,secondary_button_style=?,hero_button_style=? WHERE id=? AND (owner_id=? OR owner_email=?)').bind(buttonStyle(s.buttonStyle,'gradient'),buttonStyle(s.secondaryButtonStyle,'glow'),buttonStyle(s.heroButtonStyle,'glow'),Number(s.id),PUBLIC_OWNER,adminKey).run();
 if(result.meta.changes)await env.DB.prepare('UPDATE stores SET store_appearance=? WHERE id=? AND (owner_id=? OR owner_email=?)').bind(String(s.storeAppearance)==='light'?'light':'dark',Number(s.id),PUBLIC_OWNER,adminKey).run();
 return result.meta.changes?Response.json({ok:true}):Response.json({error:'store_not_found'},{status:404});
}
