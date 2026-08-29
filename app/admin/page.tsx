import Catalog from '../page';
import { templates, type TemplateKey } from '@/lib/catalog-templates';
export default async function AdminPage({searchParams}:{searchParams:Promise<{catalogo?:string}>}){const params=await searchParams;const raw=params.catalogo||'ropa';const template=(raw in templates?raw:'ropa') as TemplateKey;return <Catalog template={template} startAdmin/>}
