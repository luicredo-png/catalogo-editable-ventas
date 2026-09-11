"use client";

import { useEffect, useState, type FormEvent } from "react";

type Client = { id: number; slug: string; name: string; username?: string; templateKey: string; createdAt: string };
type ApiPayload = { clients?: Client[]; client?: Client };
const rubros = [["restaurantes","Restaurante"],["comida-rapida","Fast food"],["detalles-romanticos","Detalles"],["ropa","Ropa"],["mujer","Mujer"],["zapatos-mujer","Zapatos"],["perfumeria","Perfumería"],["postres","Postres"],["accesorios","Accesorios"]];

async function readApiPayload(response: Response): Promise<ApiPayload | null> {
  if (!(response.headers.get("content-type") || "").includes("application/json")) return null;
  return response.json().catch(() => null);
}

export default function CreatorPanel() {
  const [clients, setClients] = useState<Client[]>([]), [message, setMessage] = useState(""), [busy, setBusy] = useState(false);
  const [passwordClientId, setPasswordClientId] = useState<number | null>(null);
  async function load() {
    const response = await fetch("/api/tenants", { cache: "no-store" }), payload = await readApiPayload(response);
    if (response.status === 401) { location.href = "/login?next=%2Fadmin"; return; }
    if (!response.ok || !payload?.clients) throw new Error("No se pudo consultar los clientes.");
    setClients(payload.clients);
  }
  useEffect(() => { load().catch(() => setMessage("No se pudo consultar los clientes.")); }, []);
  async function create(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget, fields = Object.fromEntries(new FormData(form));
    fields.slug = String(fields.slug || "").toLowerCase().replace(/[^a-z0-9-]/g, "").replace(/^-+|-+$/g, "");
    setBusy(true); setMessage("");
    try {
      const response = await fetch("/api/tenants", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(fields) });
      const payload = await readApiPayload(response);
      if (!response.ok) throw new Error(response.status === 409 ? "Ese subdominio ya existe." : response.status === 400 ? "Revisa nombre, subdominio y contraseña (mínimo 12 caracteres)." : "No se pudo crear el cliente. Inténtalo nuevamente.");
      if (!payload?.client) throw new Error("El servidor no terminó la creación. Inténtalo nuevamente.");
      form.reset(); setMessage(`Cuenta creada. Usuario: ${payload.client.username || payload.client.name}`); await load();
    } catch (error) {
      setMessage(error instanceof Error && !error.message.includes("JSON") ? error.message : "No se pudo crear el cliente. Inténtalo nuevamente.");
    } finally { setBusy(false); }
  }
  async function remove(client: Client) {
    if (!confirm(`¿Eliminar definitivamente ${client.name}?\n\nSe borrarán su subdominio, usuario y productos. Esta acción no se puede deshacer.`)) return;
    setBusy(true); setMessage("");
    try {
      const response = await fetch("/api/tenants", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: client.id, slug: client.slug }) });
      if (!response.ok) throw new Error("No se pudo eliminar el cliente.");
      setClients((current) => current.filter((item) => item.id !== client.id)); setMessage(`${client.name} y su subdominio fueron eliminados.`);
    } catch (error) { setMessage(error instanceof Error ? error.message : "No se pudo eliminar el cliente."); }
    finally { setBusy(false); }
  }
  async function changePassword(event: FormEvent<HTMLFormElement>, client: Client) {
    event.preventDefault();
    const form = event.currentTarget, data = new FormData(form);
    const password = String(data.get("password") || ""), confirmation = String(data.get("confirmation") || "");
    if (password !== confirmation) { setMessage("Las contraseñas no coinciden."); return; }
    setBusy(true); setMessage("");
    try {
      const response = await fetch("/api/tenants", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: client.id, slug: client.slug, password }) });
      if (!response.ok) throw new Error(response.status === 400 ? "La nueva contraseña debe tener entre 12 y 128 caracteres." : "No se pudo cambiar la contraseña.");
      form.reset(); setPasswordClientId(null); setMessage(`Contraseña actualizada para ${client.name}. Sus sesiones anteriores fueron cerradas.`);
    } catch (error) { setMessage(error instanceof Error ? error.message : "No se pudo cambiar la contraseña."); }
    finally { setBusy(false); }
  }
  return <main className="creator-only">
    <header><h1>Clientes y subdominios</h1><button onClick={async()=>{await fetch('/api/auth/logout',{method:'POST'});location.href='/login'}}>Cerrar sesión</button></header>
    <section><h2>Crear catálogo para un cliente</h2><form onSubmit={create}><label>Nombre del negocio<input name="name" required maxLength={80}/><small>También será su usuario, en minúsculas y sin espacios.</small></label><label>Subdominio<input name="slug" required pattern="[A-Za-z0-9][A-Za-z0-9-]{1,43}[A-Za-z0-9]" placeholder="cliente"/><small>.micatálogo.shop</small></label><label>Rubro<select name="templateKey">{rubros.map(([key,label])=><option key={key} value={key}>{label}</option>)}</select></label><label>Contraseña inicial<input name="password" type="password" minLength={12} maxLength={128} autoComplete="new-password" required/><small>Mínimo 12 caracteres.</small></label><button disabled={busy}>{busy?'Creando…':'Crear cliente y subdominio'}</button></form><p role="status">{message}</p></section>
    <section><h2>Clientes creados</h2>{clients.map(client=><article key={client.id}><h3>{client.name}</h3><p>Usuario: <strong>{client.username||client.name}</strong> · {client.templateKey}</p><div className="client-actions"><a href={`https://${client.slug}.micatálogo.shop`} target="_blank">Ver catálogo</a><a href={`https://${client.slug}.micatálogo.shop/login`} target="_blank">Acceso del cliente</a><button disabled={busy} onClick={()=>setPasswordClientId(passwordClientId===client.id?null:client.id)}>Cambiar contraseña</button><button className="delete-client" disabled={busy} onClick={()=>remove(client)}>Eliminar</button></div>{passwordClientId===client.id&&<form className="password-reset" onSubmit={(event)=>changePassword(event,client)}><h4>Nueva contraseña para {client.name}</h4><label>Nueva contraseña<input name="password" type="password" minLength={12} maxLength={128} autoComplete="new-password" required/></label><label>Confirmar contraseña<input name="confirmation" type="password" minLength={12} maxLength={128} autoComplete="new-password" required/></label><button disabled={busy}>{busy?'Guardando…':'Guardar nueva contraseña'}</button></form>}</article>)}</section>
    <style>{'.creator-only{min-height:100vh;padding:32px max(20px,calc((100vw - 1000px)/2));background:linear-gradient(125deg,#e0f1ff,#eee5ff);color:#182538;font-family:Arial,sans-serif}.creator-only header{display:flex;gap:20px;align-items:center;justify-content:space-between}.creator-only section{padding:28px;background:#ffffffd9;border-radius:24px;margin:22px 0}.creator-only form,.creator-only label{display:grid;gap:12px}.creator-only form{gap:18px}.creator-only label{font-weight:700}.creator-only input,.creator-only select{box-sizing:border-box;width:100%;padding:14px;border:1px solid #a3b4cc;border-radius:12px;font:inherit}.creator-only button{padding:15px;border:0;border-radius:16px;color:white;background:linear-gradient(90deg,#087ffe,#6b4eff);font-weight:700}.creator-only article{border-top:1px solid #cbd7e4;padding:18px 0}.creator-only .client-actions{display:flex;align-items:center;flex-wrap:wrap;gap:10px}.creator-only .client-actions a{font-weight:700;color:#075dbd}.creator-only .client-actions button{padding:10px 14px}.creator-only .delete-client{background:#c52d38}.creator-only .password-reset{margin-top:16px;padding:18px;border:1px solid #b7c8dd;border-radius:16px;background:#f5f9ff}.creator-only .password-reset h4{margin:0}.creator-only [role=status]{min-height:22px;font-weight:700;color:#b42318}@media(max-width:620px){.creator-only{padding:18px}.creator-only section{padding:20px}.creator-only .client-actions>*{width:100%;text-align:center}}'}</style>
  </main>;
}
