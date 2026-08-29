import { env } from 'cloudflare:workers';

export async function POST(request:Request){
 const form=await request.formData();
 const file=form.get('file');
 if(!(file instanceof File))return Response.json({error:'file_required'},{status:400});
 const allowed=['image/png','image/jpeg','image/webp','image/gif','video/mp4'];
 const maxSize=file.type==='video/mp4'?50_000_000:file.type==='image/gif'?12_000_000:5_000_000;
 if(!allowed.includes(file.type)||file.size>maxSize)return Response.json({error:'invalid_file'},{status:400});
 const ext=file.type==='image/jpeg'?'jpg':file.type.split('/')[1];
 const key=`asset-public-${crypto.randomUUID()}.${ext}`;
 await env.FILES.put(key,file.stream(),{httpMetadata:{contentType:file.type}});
 return Response.json({url:`/api/media/${key}`});
}
