'use client';

import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';

type Product={id:number;sku:string;name:string;category:string;stock:number;minStock:number;cost:number;salePrice:number;image?:string;color?:string;size?:string;model?:string;catalogUrl?:string;active:boolean};
type Movement={id:number;productId:number;productName:string;sku:string;type:'entrada'|'venta';quantity:number;unitPrice:number;total:number;note:string;createdAt:string};
type Snapshot={products:Product[];movements:Movement[];metrics:{totalUnits:number;inventoryValue:number;lowStockCount:number;salesToday:number;unitsSoldToday:number}};
type MovementDraft={type:'entrada'|'venta';productId:string;quantity:string;unitPrice:string;note:string};

const money=new Intl.NumberFormat('es-PE',{style:'currency',currency:'PEN',maximumFractionDigits:2});
const dateTime=new Intl.DateTimeFormat('es-PE',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'});
const emptySnapshot:Snapshot={products:[],movements:[],metrics:{totalUnits:0,inventoryValue:0,lowStockCount:0,salesToday:0,unitsSoldToday:0}};

export default function InventoryPage(){
 const [data,setData]=useState<Snapshot>(emptySnapshot);
 const [loading,setLoading]=useState(true);
 const [working,setWorking]=useState(false);
 const [error,setError]=useState('');
 const [toast,setToast]=useState('');
 const [query,setQuery]=useState('');
 const [movement,setMovement]=useState<MovementDraft|null>(null);
 const [newProduct,setNewProduct]=useState(false);
 const [catalogUrl,setCatalogUrl]=useState('');

 const refresh=useCallback(async()=>{
  try{
   const response=await fetch('/api/inventory/overview',{cache:'no-store'});
   const payload=await response.json();
   if(!response.ok)throw new Error(payload.error||'No se pudo cargar el inventario.');
   setData(payload);setError('');
  }catch(reason){setError(reason instanceof Error?reason.message:'No se pudo cargar el inventario.');}
  finally{setLoading(false);}
 },[]);

 useEffect(()=>{void refresh();},[refresh]);
 useEffect(()=>{if(!toast)return;const timer=setTimeout(()=>setToast(''),3200);return()=>clearTimeout(timer);},[toast]);

 const filtered=useMemo(()=>{
  const normalized=query.trim().toLowerCase();
  if(!normalized)return data.products;
  return data.products.filter(product=>`${product.name} ${product.sku} ${product.category}`.toLowerCase().includes(normalized));
 },[data.products,query]);

 const selectedProduct=data.products.find(product=>String(product.id)===movement?.productId);

 function openMovement(type:'entrada'|'venta',product?:Product){
  const selected=product||data.products[0];
  setMovement({type,productId:selected?String(selected.id):'',quantity:'1',unitPrice:String(type==='venta'?(selected?.salePrice||0):(selected?.cost||0)),note:''});
 }

 function selectMovementProduct(productId:string){
  const product=data.products.find(item=>String(item.id)===productId);
  setMovement(current=>current?{...current,productId,unitPrice:String(current.type==='venta'?(product?.salePrice||0):(product?.cost||0))}:current);
 }

 async function saveMovement(event:FormEvent){
  event.preventDefault();if(!movement)return;setWorking(true);setError('');
  try{
   const response=await fetch('/api/inventory/movements',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...movement,productId:Number(movement.productId),quantity:Number(movement.quantity),unitPrice:Number(movement.unitPrice)})});
   const payload=await response.json();
   if(!response.ok)throw new Error(payload.error||'No se pudo registrar el movimiento.');
   setMovement(null);setToast(movement.type==='entrada'?`Entrada registrada. Nuevo stock: ${payload.newStock}.`:`Venta registrada. Quedan ${payload.newStock} unidades.`);await refresh();
  }catch(reason){setError(reason instanceof Error?reason.message:'No se pudo registrar el movimiento.');}
  finally{setWorking(false);}
 }

 async function saveProduct(event:FormEvent<HTMLFormElement>){
  event.preventDefault();setWorking(true);setError('');
  const form=new FormData(event.currentTarget);
  const payload=Object.fromEntries(form.entries());
  try{
   const response=await fetch('/api/inventory/products',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
   const result=await response.json();
   if(!response.ok)throw new Error(result.error||'No se pudo crear el producto.');
   setNewProduct(false);setToast('Producto agregado al inventario.');await refresh();
  }catch(reason){setError(reason instanceof Error?reason.message:'No se pudo crear el producto.');}
  finally{setWorking(false);}
 }

 async function importCatalog(event:FormEvent){
  event.preventDefault();setWorking(true);setError('');
  try{
   const response=await fetch('/api/inventory/import-catalog',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({url:catalogUrl})});
   const result=await response.json();
   if(!response.ok)throw new Error(result.error||'No se pudo importar el catálogo.');
   setToast(`${result.imported} variantes importadas desde ${result.store}.`);await refresh();
  }catch(reason){setError(reason instanceof Error?reason.message:'No se pudo importar el catálogo.');}
  finally{setWorking(false);}
 }

 return <main className="inv-shell">
  <aside className="inv-sidebar">
   <div className="inv-brand"><span className="inv-brand-mark">S</span><span>STOCKA<small>Inventario simple</small></span></div>
   <nav className="inv-nav" aria-label="Menú de inventario">
    <button className="active"><span>⌂</span>Resumen</button>
    <button><span>▦</span>Productos</button>
    <button><span>↕</span>Movimientos</button>
    <button><span>◎</span>Reportes</button>
   </nav>
   <div className="inv-sidebar-card"><span className="inv-pulse"/><strong>Control activo</strong><p>Cada ingreso suma. Cada venta descuenta.</p></div>
   <div className="inv-account"><span>CM</span><div><strong>Comercial Moda</strong><small>Administrador</small></div></div>
  </aside>

  <section className="inv-main">
   <header className="inv-header">
    <div><p className="inv-eyebrow">RESUMEN GENERAL</p><h1>Control de inventario</h1><p>Tu negocio, claro y bajo control.</p></div>
    <div className="inv-header-actions"><button className="inv-ghost" onClick={()=>setNewProduct(true)}>＋ Nuevo producto</button><button className="inv-primary" onClick={()=>openMovement('venta')}>Registrar venta <span>→</span></button></div>
   </header>

   {error&&<div className="inv-alert"><span>!</span>{error}<button onClick={()=>setError('')}>×</button></div>}
   {toast&&<div className="inv-toast"><span>✓</span>{toast}</div>}

   <form className="inv-catalog-import" onSubmit={importCatalog}><div><span className="inv-import-icon">↗</span><div><p className="inv-eyebrow">CONECTAR CATÁLOGO</p><h2>Importa productos, colores, tallas, modelos y fotos</h2><p>Pega el enlace público de tu catálogo. Puedes repetir la importación para actualizarlo sin duplicar variantes ni perder el stock.</p></div></div><div className="inv-import-action"><input type="url" required value={catalogUrl} onChange={event=>setCatalogUrl(event.target.value)} placeholder={`${typeof location==='undefined'?'https://tu-catalogo.com':location.origin}/ropa`}/><button disabled={working}>{working?'Importando…':'Importar catálogo'}</button></div></form>

   <section className="inv-metrics" aria-label="Indicadores principales">
    <article className="inv-metric purple"><div className="inv-icon">▦</div><div><span>Unidades disponibles</span><strong>{loading?'—':data.metrics.totalUnits}</strong><small>En todos tus productos</small></div></article>
    <article className="inv-metric mint"><div className="inv-icon">S/</div><div><span>Valor del inventario</span><strong>{loading?'—':money.format(data.metrics.inventoryValue)}</strong><small>Calculado al costo</small></div></article>
    <article className="inv-metric blue"><div className="inv-icon">↗</div><div><span>Ventas de hoy</span><strong>{loading?'—':money.format(data.metrics.salesToday)}</strong><small>{data.metrics.unitsSoldToday} unidades vendidas</small></div></article>
    <article className={`inv-metric ${data.metrics.lowStockCount?'coral':'green'}`}><div className="inv-icon">!</div><div><span>Stock bajo</span><strong>{loading?'—':data.metrics.lowStockCount}</strong><small>{data.metrics.lowStockCount?'Requieren reposición':'Todo en orden'}</small></div></article>
   </section>

   <section className="inv-quick">
    <div><p className="inv-eyebrow">MOVIMIENTO RÁPIDO</p><h2>¿Qué deseas registrar?</h2><p>El stock se actualiza automáticamente al confirmar.</p></div>
    <button className="inv-quick-action entry" onClick={()=>openMovement('entrada')}><span className="inv-action-icon">＋</span><span><strong>Ingreso de mercadería</strong><small>Suma unidades al stock</small></span><b>→</b></button>
    <button className="inv-quick-action sale" onClick={()=>openMovement('venta')}><span className="inv-action-icon">−</span><span><strong>Registrar una venta</strong><small>Descuenta unidades y suma ventas</small></span><b>→</b></button>
   </section>

   <div className="inv-grid">
    <section className="inv-panel inv-products">
     <div className="inv-panel-head"><div><p className="inv-eyebrow">EXISTENCIAS</p><h2>Productos</h2></div><label className="inv-search"><span>⌕</span><input value={query} onChange={event=>setQuery(event.target.value)} placeholder="Buscar producto o SKU"/></label></div>
     <div className="inv-table-wrap"><table><thead><tr><th>Producto</th><th>Categoría</th><th>Stock</th><th>Precio</th><th>Estado</th><th></th></tr></thead><tbody>
      {filtered.map(product=>{const low=product.stock<=product.minStock;return <tr key={product.id}>
       <td><div className="inv-product-name">{product.image?<img src={product.image} alt=""/>:<span>{product.name.slice(0,1)}</span>}<div><strong>{product.name}</strong><small>{[product.color,product.size&&`Talla ${product.size}`,product.model&&product.model!==product.name?product.model:''].filter(Boolean).join(' · ')||product.sku}</small><small>{product.sku}</small></div></div></td>
       <td><span className="inv-category">{product.category}</span></td><td><strong className="inv-stock">{product.stock}</strong><small className="inv-min">mín. {product.minStock}</small></td><td><strong>{money.format(product.salePrice)}</strong></td>
       <td><span className={`inv-status ${low?'low':'ok'}`}><i/>{low?'Stock bajo':'Disponible'}</span></td>
       <td><div className="inv-row-actions"><button title="Registrar entrada" onClick={()=>openMovement('entrada',product)}>＋</button><button title="Registrar venta" onClick={()=>openMovement('venta',product)}>−</button></div></td>
      </tr>})}
      {!loading&&filtered.length===0&&<tr><td className="inv-empty" colSpan={6}>No encontramos productos con esa búsqueda.</td></tr>}
     </tbody></table></div>
    </section>

    <section className="inv-panel inv-history">
     <div className="inv-panel-head"><div><p className="inv-eyebrow">ACTIVIDAD</p><h2>Últimos movimientos</h2></div><span className="inv-live"><i/> En vivo</span></div>
     <div className="inv-movement-list">
      {data.movements.map(item=><article key={item.id}><span className={`inv-movement-icon ${item.type}`}>{item.type==='entrada'?'＋':'−'}</span><div><strong>{item.productName}</strong><small>{item.type==='entrada'?'Ingreso de stock':'Venta'} · {dateTime.format(new Date(item.createdAt))}</small></div><div className="inv-movement-total"><strong className={item.type}>{item.type==='entrada'?'+':'−'}{item.quantity}</strong><small>{money.format(item.total)}</small></div></article>)}
      {!loading&&data.movements.length===0&&<div className="inv-history-empty"><span>↕</span><strong>Aún no hay movimientos</strong><p>Registra una entrada o una venta y aparecerá aquí.</p></div>}
     </div>
    </section>
   </div>
  </section>

  {movement&&<div className="inv-modal-backdrop" onMouseDown={event=>{if(event.target===event.currentTarget)setMovement(null)}}><form className="inv-modal" onSubmit={saveMovement}>
   <button type="button" className="inv-modal-close" onClick={()=>setMovement(null)}>×</button>
   <div className={`inv-modal-symbol ${movement.type}`}>{movement.type==='entrada'?'＋':'−'}</div>
   <p className="inv-eyebrow">{movement.type==='entrada'?'SUMAR EXISTENCIAS':'DESCONTAR EXISTENCIAS'}</p><h2>{movement.type==='entrada'?'Ingreso de mercadería':'Registrar venta'}</h2>
   <p className="inv-modal-copy">{movement.type==='entrada'?'Las unidades se agregarán al stock actual.':'La venta descontará unidades y se sumará al total vendido.'}</p>
   <label>Producto<select required value={movement.productId} onChange={event=>selectMovementProduct(event.target.value)}><option value="">Selecciona un producto</option>{data.products.map(product=><option key={product.id} value={product.id}>{product.name} · {product.stock} disponibles</option>)}</select></label>
   {selectedProduct&&<div className="inv-stock-preview"><span>Stock actual <strong>{selectedProduct.stock}</strong></span><b>→</b><span>Stock resultante <strong>{Math.max(0,selectedProduct.stock+(movement.type==='entrada'?1:-1)*(Number(movement.quantity)||0))}</strong></span></div>}
   <div className="inv-form-grid"><label>Cantidad<input required min="1" type="number" value={movement.quantity} onChange={event=>setMovement({...movement,quantity:event.target.value})}/></label><label>{movement.type==='venta'?'Precio de venta':'Costo unitario'}<input required min="0" step="0.01" type="number" value={movement.unitPrice} onChange={event=>setMovement({...movement,unitPrice:event.target.value})}/></label></div>
   <label>Nota opcional<input maxLength={160} value={movement.note} onChange={event=>setMovement({...movement,note:event.target.value})} placeholder={movement.type==='venta'?'Ej. Pedido por WhatsApp':'Ej. Compra a proveedor'}/></label>
   <button className={`inv-submit ${movement.type}`} disabled={working}>{working?'Guardando…':movement.type==='entrada'?'Confirmar ingreso':'Confirmar venta'}</button>
  </form></div>}

  {newProduct&&<div className="inv-modal-backdrop" onMouseDown={event=>{if(event.target===event.currentTarget)setNewProduct(false)}}><form className="inv-modal inv-product-modal" onSubmit={saveProduct}>
   <button type="button" className="inv-modal-close" onClick={()=>setNewProduct(false)}>×</button><div className="inv-modal-symbol product">▦</div><p className="inv-eyebrow">NUEVO REGISTRO</p><h2>Agregar producto</h2><p className="inv-modal-copy">Define sus datos y el stock inicial quedará registrado como ingreso.</p>
   <div className="inv-form-grid"><label>Nombre<input required name="name" placeholder="Ej. Polo Essential"/></label><label>SKU / Código<input required name="sku" placeholder="ROP-003"/></label></div>
   <label>Categoría<input required name="category" placeholder="Ropa, Accesorios, Calzado…"/></label>
   <div className="inv-form-grid three"><label>Stock inicial<input required min="0" name="stock" type="number" defaultValue="0"/></label><label>Stock mínimo<input required min="0" name="minStock" type="number" defaultValue="5"/></label><label>Costo (S/)<input required min="0" step="0.01" name="cost" type="number" defaultValue="0"/></label></div>
   <label>Precio de venta (S/)<input required min="0" step="0.01" name="salePrice" type="number" defaultValue="0"/></label>
   <button className="inv-submit product" disabled={working}>{working?'Guardando…':'Crear producto'}</button>
  </form></div>}
 </main>;
}
