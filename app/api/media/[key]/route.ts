import { env } from 'cloudflare:workers';

export async function GET(request:Request,{params}:{params:Promise<{key:string}>}){
 const {key}=await params;
 if(!/^(?:logo|asset)-[a-zA-Z0-9._-]+$/.test(key))return new Response('Not found',{status:404});
 const rangeHeader=request.headers.get('range');
 const head=rangeHeader?await env.FILES.head(key):null;
 const match=rangeHeader?.match(/^bytes=(\d*)-(\d*)$/);
 let requestedRange:{offset:number;length:number}|undefined;
 if(head&&match){
  const first=match[1],last=match[2];
  const start=first?Number(first):Math.max(0,head.size-Number(last||0));
  const end=last&&first?Math.min(head.size-1,Number(last)):head.size-1;
  if(Number.isFinite(start)&&Number.isFinite(end)&&start>=0&&end>=start)requestedRange={offset:start,length:end-start+1};
 }
 const object=await env.FILES.get(key,requestedRange?{range:requestedRange}:undefined);
 if(!object)return new Response('Not found',{status:404});
 const headers=new Headers();
 object.writeHttpMetadata(headers);
 headers.set('etag',object.httpEtag);
 headers.set('cache-control','public, max-age=31536000, immutable');
 headers.set('x-content-type-options','nosniff');
 headers.set('accept-ranges','bytes');
 if(requestedRange&&head){
  const start=requestedRange.offset;
  const end=start+requestedRange.length-1;
  headers.set('content-range',`bytes ${start}-${end}/${head.size}`);
  headers.set('content-length',String(requestedRange.length));
  return new Response(object.body,{status:206,headers});
 }
 return new Response(object.body,{headers});
}
