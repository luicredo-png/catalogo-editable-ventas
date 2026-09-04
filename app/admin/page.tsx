import Catalog from '../page';
import CreatorPanel from '../creator-panel';
import { headers } from 'next/headers';
import { templates, type TemplateKey } from '@/lib/catalog-templates';
export default async function AdminPage({searchParams}:{searchParams:Promise<{catalogo?:string}>}){const host=(await headers()).get('host')?.split(':')[0];if(host==='creador.xn--micatlogo-41a.shop')return <CreatorPanel/>;const params=await searchParams;const raw=params.catalogo||'ropa';const template=(raw in templates?raw:'ropa') as TemplateKey;return <Catalog template={template} startAdmin/>}
