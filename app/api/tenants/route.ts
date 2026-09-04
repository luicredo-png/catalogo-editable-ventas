import { env } from 'cloudflare:workers';

const PUBLIC_OWNER = 'public:catalog-demo';
const RUBROS = ['restaurantes','comida-rapida','detalles-romanticos','ropa','zapatos-mujer','perfumeria','postres','accesorios'];

export async function GET() {
  const rows = await env.DB.prepare("SELECT id,slug,name,template_key AS templateKey,owner_email AS adminKey,created_at AS createdAt FROM stores WHERE owner_id LIKE 'tenant:%' ORDER BY id DESC").all();
  return Response.json({ clients: rows.results });
}

export async function POST(request: Request) {
  const body = await request.json<Record<string, unknown>>();
  const slug = String(body.slug || '').toLowerCase().trim().replace(/[^a-z0-9-]/g, '').replace(/^-+|-+$/g, '').slice(0, 45);
  const templateKey = RUBROS.includes(String(body.templateKey)) ? String(body.templateKey) : 'ropa';
  const name = String(body.name || slug).trim().slice(0, 80);
  if (slug.length < 3) return Response.json({ error: 'invalid_slug' }, { status: 400 });
  if (await env.DB.prepare('SELECT id FROM stores WHERE slug=?').bind(slug).first()) return Response.json({ error: 'slug_exists' }, { status: 409 });
  const source = await env.DB.prepare('SELECT * FROM stores WHERE owner_id=? AND template_key=?').bind(PUBLIC_OWNER, templateKey).first<Record<string, unknown>>();
  if (!source) return Response.json({ error: 'template_not_found' }, { status: 404 });
  const adminKey = crypto.randomUUID();
  const record = { ...source, owner_id: `tenant:${slug}`, owner_email: adminKey, slug, name, created_at: new Date().toISOString() };
  delete record.id;
  const columns = Object.keys(record).filter((key) => /^[a-z_]+$/.test(key));
  const result = await env.DB.prepare(`INSERT INTO stores (${columns.join(',')}) VALUES (${columns.map(() => '?').join(',')})`).bind(...columns.map((key) => record[key] ?? '')).run();
  const id = Number(result.meta.last_row_id);
  await env.DB.prepare('INSERT INTO products (store_id,name,category,description,price,old_price,image,options_json,whatsapp_message,active,sort_order) SELECT ?,name,category,description,price,old_price,image,options_json,whatsapp_message,active,sort_order FROM products WHERE store_id=?').bind(id, Number(source.id)).run();
  return Response.json({ client: { id, slug, name, templateKey, adminKey, catalogUrl: `https://${slug}.micatalogo.shop`, adminUrl: `https://${slug}.micatalogo.shop/admin?llave=${adminKey}` } });
}
