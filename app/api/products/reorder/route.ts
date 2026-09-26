import { env } from "cloudflare:workers";

const PUBLIC_OWNER = "public:catalog-demo";

export async function POST(request: Request) {
  const payload = await request.json<{ storeId?: number; ids?: number[]; adminKey?: string }>();
  const storeId = Number(payload.storeId);
  const ids = Array.isArray(payload.ids) ? payload.ids.map(Number).filter(Number.isFinite) : [];
  const store = await env.DB.prepare(
    "SELECT id FROM stores WHERE id=? AND (owner_id=? OR owner_email=?)",
  ).bind(storeId, PUBLIC_OWNER, String(payload.adminKey || "")).first<{ id: number }>();
  if (!store) return Response.json({ error: "store_not_found" }, { status: 404 });
  const owned = await env.DB.prepare("SELECT id FROM products WHERE store_id=?").bind(storeId).all<{ id: number }>();
  const allowed = new Set((owned.results || []).map((row) => Number(row.id)));
  const ordered = ids.filter((id) => allowed.has(id));
  if (ordered.length !== allowed.size) return Response.json({ error: "invalid_order" }, { status: 400 });
  await env.DB.batch(ordered.map((id, index) => env.DB.prepare(
    "UPDATE products SET sort_order=? WHERE id=? AND store_id=?",
  ).bind(index + 1, id, storeId)));
  return Response.json({ ok: true });
}
