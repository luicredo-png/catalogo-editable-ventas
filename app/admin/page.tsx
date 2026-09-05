'use client';
import { useEffect, useState } from 'react';
import Catalog from '../page';
import CreatorPanel from '../creator-panel';
import { templates, type TemplateKey } from '@/lib/catalog-templates';
export default function AdminPage(){
 const [ready,setReady]=useState(false);
 useEffect(()=>setReady(true),[]);
 if(!ready)return <main style={{minHeight:'100vh',background:'#081831'}}/>;
 if(location.hostname==='creador.xn--micatlogo-41a.shop')return <CreatorPanel/>;
 const raw=new URLSearchParams(location.search).get('catalogo')||'ropa';
 const template=(raw in templates?raw:'ropa') as TemplateKey;
 return <Catalog template={template} startAdmin/>;
}
