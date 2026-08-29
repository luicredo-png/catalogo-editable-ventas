import { getChatGPTUser, type ChatGPTUser } from '@/app/chatgpt-auth';

const SESSION_COOKIE='catalog_demo_session';
const SESSION_PATTERN=/^[a-f0-9-]{36}$/;

export type CatalogIdentity={user:ChatGPTUser;setCookie?:string};

export async function getCatalogIdentity(request:Request,createGuest=false):Promise<CatalogIdentity|null>{
 const account=await getChatGPTUser();
 if(account)return{user:account};
 const sharedKey=new URL(request.url).searchParams.get('llave')||new URL(request.url).searchParams.get('admin_key')||'';
 const cookie=request.headers.get('cookie')||'';
 const found=cookie.split(';').map(v=>v.trim()).find(v=>v.startsWith(`${SESSION_COOKIE}=`));
 let session=SESSION_PATTERN.test(sharedKey)?sharedKey:(found?.slice(SESSION_COOKIE.length+1)||'');
 let setCookie:string|undefined;
 if(SESSION_PATTERN.test(sharedKey))setCookie=`${SESSION_COOKIE}=${session}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=31536000`;
 if(!SESSION_PATTERN.test(session)){
  if(!createGuest)return null;
  session=crypto.randomUUID();
  setCookie=`${SESSION_COOKIE}=${session}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=31536000`;
 }
 return{user:{userId:`guest:${session}`,email:'invitado@catalogo.demo',displayName:'Invitado',fullName:'Invitado'},setCookie};
}
