'use client';
import {useState,type FormEvent} from 'react';
export default function Login(){
const [error,setError]=useState(''),[busy,setBusy]=useState(false);
async function submit(e:FormEvent<HTMLFormElement>){e.preventDefault();setBusy(true);setError('');const f=new FormData(e.currentTarget);try{const r=await fetch('/api/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:f.get('email'),password:f.get('password')})});if(!r.ok){setError(r.status===503?'Falta configurar el acceso seguro.':'Correo o contraseña incorrectos.');return}location.replace('/admin')}catch{setError('No se pudo conectar.')}finally{setBusy(false)}}
return <main style={{minHeight:'100vh',display:'grid',placeItems:'center',background:'#081831',padding:24}}><form onSubmit={submit} style={{width:'min(100%,420px)',display:'grid',gap:18,padding:32,borderRadius:24,background:'#fff',color:'#17243b'}}><h1>Administrar mi catálogo</h1><label>Correo<input name="email" type="email" required style={{display:'block',width:'100%',padding:12}}/></label><label>Contraseña<input name="password" type="password" required style={{display:'block',width:'100%',padding:12}}/></label><p role="alert">{error}</p><button disabled={busy}>{busy?'Ingresando…':'Iniciar sesión'}</button><a href="/">Ver catálogo</a></form></main>;
}
