import type {Metadata} from 'next';
import {headers} from 'next/headers';
import {env} from 'cloudflare:workers';
import './accounting.css';
const description='Asesoría empresarial, tributaria, contable y laboral para empresas que buscan claridad y crecimiento.';
export async function generateMetadata():Promise<Metadata>{
 const requestHeaders=await headers(),host=(requestHeaders.get('x-forwarded-host')||requestHeaders.get('host')||'').split(':')[0].toLowerCase();
 const match=host.match(/^([a-z0-9][a-z0-9-]{1,43}[a-z0-9])\.sitioweb\.shop$/);let company='FORCH LAU';
 if(match&&!['www','creador'].includes(match[1])){try{const row=await env.DB.prepare("SELECT name FROM stores WHERE slug=? AND owner_id LIKE 'site-tenant:%'").bind(match[1]).first<{name:string}>();if(row?.name)company=String(row.name).trim().slice(0,80)}catch{}}
 const title=`${company} | Estudio contable y asesoría empresarial`;
 return{title,description,openGraph:{title,description,type:'website'},twitter:{card:'summary_large_image',title,description}};
}
export default function Layout({children}:{children:React.ReactNode}){return children}
