'use client';
import {useState,type FormEvent} from 'react';
export default function Login(){
 const [error,setError]=useState(''),[busy,setBusy]=useState(false);
 async function submit(event:FormEvent<HTMLFormElement>){event.preventDefault();setBusy(true);setError('');const form=new FormData(event.currentTarget);try{const response=await fetch('/api/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({identifier:form.get('identifier'),password:form.get('password')})});if(!response.ok){setError(response.status===503?'Falta configurar el acceso seguro. Contacta al propietario.':response.status===429?'Demasiados intentos. Espera 15 minutos.':'Usuario o contraseña incorrectos.');return}const requested=new URLSearchParams(location.search).get('next')||'/admin';const next=requested.startsWith('/')&&!requested.startsWith('//')?requested:'/admin';location.replace(next)}catch{setError('No se pudo conectar. Inténtalo nuevamente.')}finally{setBusy(false)}}
 return <main className="login-page">
  <form className="shine-login-card" onSubmit={submit}>
   <div className="login-heading">
    <small>ACCESO SEGURO</small>
    <h1>Administrar mi catálogo</h1>
    <p>Ingresa con el usuario y la contraseña de tu catálogo.</p>
   </div>
   <label>Usuario<input name="identifier" type="text" autoComplete="username" placeholder="Tu usuario" required /></label>
   <label>Contraseña<input name="password" type="password" autoComplete="current-password" placeholder="Tu contraseña" required maxLength={128}/></label>
   <p className="login-error" role="alert">{error}</p>
   <button disabled={busy}>{busy?'Ingresando…':'Iniciar sesión'}</button>
   <a href="/">Ver catálogo</a>
  </form>
  <style>{`
   @property --shine-angle{syntax:'<angle>';initial-value:0deg;inherits:false}
   .login-page{min-height:100vh;display:grid;place-items:center;padding:24px;color:#17243b;background:radial-gradient(circle at 18% 12%,#18376a 0,transparent 34%),radial-gradient(circle at 86% 82%,#422d75 0,transparent 30%),#07152b;font-family:Arial,sans-serif}
   .shine-login-card{position:relative;isolation:isolate;width:min(100%,420px);display:grid;gap:20px;padding:34px;border:1px solid transparent;border-radius:24px;background:linear-gradient(#fff,#fff) padding-box,conic-gradient(from var(--shine-angle),#a07cfe,#fe8fb5,#ffbe7b,#70ddff,#a07cfe) border-box;box-shadow:0 28px 80px #0008;animation:login-shine 4s linear infinite}
   .shine-login-card:before{content:'';position:absolute;z-index:-1;inset:-8px;border-radius:30px;background:conic-gradient(from var(--shine-angle),#a07cfe55,#fe8fb555,#ffbe7b55,#70ddff44,#a07cfe55);filter:blur(18px);opacity:.7;animation:login-shine 4s linear infinite}
   .login-heading{display:grid;gap:8px}.login-heading small{color:#7258d8;font-size:11px;font-weight:900;letter-spacing:.16em}.login-heading h1{margin:0;font-size:30px;line-height:1.08;letter-spacing:-.035em}.login-heading p{margin:0;color:#667085;font-size:14px;line-height:1.45}
   .shine-login-card label{display:grid;gap:8px;font-size:14px;font-weight:800}.shine-login-card input{width:100%;min-height:50px;padding:0 15px;border:1px solid #bdc8d9;border-radius:12px;background:#f9fbff;color:#17243b;font:inherit;outline:none;transition:.2s}.shine-login-card input:focus{border-color:#805dff;box-shadow:0 0 0 4px #805dff20;background:#fff}.shine-login-card input::placeholder{color:#98a2b3}
   .login-error{min-height:20px;margin:0;color:#b42318;font-size:14px;font-weight:700}.shine-login-card button{min-height:54px;border:0;border-radius:13px;background:linear-gradient(100deg,#1677ff,#7255ff);color:#fff;font-size:16px;font-weight:900;box-shadow:0 12px 26px #315fff38;cursor:pointer;transition:.2s}.shine-login-card button:hover{transform:translateY(-1px);box-shadow:0 16px 32px #315fff50}.shine-login-card button:disabled{opacity:.65;cursor:wait;transform:none}.shine-login-card>a{justify-self:center;color:#263754;font-size:14px;font-weight:800;text-decoration:none}.shine-login-card>a:hover{text-decoration:underline}
   @keyframes login-shine{to{--shine-angle:360deg}}
   @media(prefers-reduced-motion:reduce){.shine-login-card,.shine-login-card:before{animation:none}}
   @media(max-width:520px){.login-page{padding:18px}.shine-login-card{padding:28px 22px;border-radius:21px}.login-heading h1{font-size:27px}}
  `}</style>
 </main>;
}
