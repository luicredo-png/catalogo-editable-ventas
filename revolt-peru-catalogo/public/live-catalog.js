(() => {
  const state = { data: null, gender: 'TODOS', brand: 'TODOS', query: '', selected: new Map(), modal: null, modalIndex: 0, showVideo: false };
  const esc = (value = '') => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
  const mediaUrl = (url) => !url ? '/assets/logo.png' : url.startsWith('/media/') ? `https://revoltperu.shop${url}` : url;
  const photos = (product) => (product.images || []).filter(Boolean).map(mediaUrl);
  const orderFor = (product) => state.gender === 'HOMBRE' ? (product.sortOrderHombre ?? product.sortOrder ?? 9999) : state.gender === 'MUJER' ? (product.sortOrderMujer ?? product.sortOrder ?? 9999) : (product.sortOrder ?? 9999);
  const applyTheme = () => {
    const id = 'gender-theme-live';
    document.getElementById(id)?.remove();
    if (state.gender !== 'MUJER') return;
    const style = document.createElement('style');
    style.id = id;
    style.textContent = `
      html[data-live-gender="MUJER"],html[data-live-gender="MUJER"] body{background:#fff;color:#241b20}
      html[data-live-gender="MUJER"] body{background:radial-gradient(circle at 12% 8%,#ffe7f1 0,transparent 34%),radial-gradient(circle at 92% 18%,#fff0f6 0,transparent 30%),#fff}
      html[data-live-gender="MUJER"] .catalog-page{background:linear-gradient(180deg,#fff7fa 0%,#fff 30%,#fff 100%)!important;color:#241b20}
      html[data-live-gender="MUJER"] .catalog-header{background:linear-gradient(135deg,#fff 0%,#fff5f9 58%,#ffd9e8 100%);border-bottom:1px solid #f3c1d4}
      html[data-live-gender="MUJER"] .promo-pill{background:#fff;border-color:#f2b7cc;color:#6c3047}
      html[data-live-gender="MUJER"] .catalog-controls,html[data-live-gender="MUJER"] .catalog-intro{background:transparent!important}
      html[data-live-gender="MUJER"] .catalog-search{background:#fff;border-color:#efbfd1;box-shadow:0 8px 20px #d94f8212}
      html[data-live-gender="MUJER"] .catalog-search input{color:#542338}
      html[data-live-gender="MUJER"] .catalog-meta span{color:#9b6078}
      html[data-live-gender="MUJER"] .product-grid{background:transparent}
      html[data-live-gender="MUJER"] .catalog-heading{color:#7b3152}
      html[data-live-gender="MUJER"] .gender-tabs button.active,html[data-live-gender="MUJER"] .brand-strip button.active{background:#d94f82;border-color:#d94f82;color:#fff}
      html[data-live-gender="MUJER"] .gender-tabs button,html[data-live-gender="MUJER"] .brand-strip button{border-color:#e8b4c8;color:#7b3152;background:#fff}
      html[data-live-gender="MUJER"] .product-card{background:#fff;border-color:#f0c7d7;box-shadow:0 14px 35px #d94f821c}
      html[data-live-gender="MUJER"] .product-card-body h2,html[data-live-gender="MUJER"] .product-brand{color:#542338}
      html[data-live-gender="MUJER"] .models-button{background:linear-gradient(90deg,#c83f73,#ed7ca4);color:#fff}
      html[data-live-gender="MUJER"] .catalog-meta{color:#7b3152}
    `;
    document.head.appendChild(style);
    document.documentElement.dataset.liveGender = 'MUJER';
  };
  const whatsapp = (product, index) => {
    const number = String(state.data.settings.whatsapp || '51981395069').replace(/\D/g, '');
    const text = ['Quiero pedir este modelo:', '', `Modelo: ${product.name}`, `Color elegido: Foto ${index + 1}`, `Precio: S/${Math.round(product.price)}`, 'Talla: (por confirmar)'].join('\n');
    return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
  };
  const filtered = () => {
    const q = state.query.trim().toLowerCase();
    return state.data.products
      .filter(p => state.gender === 'TODOS' || p.gender === state.gender || p.gender === 'TODOS')
      .filter(p => state.brand === 'TODOS' || p.brand === state.brand)
      .filter(p => !q || `${p.name} ${p.brand}`.toLowerCase().includes(q))
      .sort((a, b) => orderFor(a) - orderFor(b));
  };
  const card = (product, position) => {
    const imgs = photos(product);
    const index = Math.min(state.selected.get(product.id) || 0, Math.max(0, imgs.length - 1));
    const image = imgs[index] || '/assets/logo.png';
    return `<article class="product-card" data-live-id="${product.id}"><button class="product-image-button" type="button" data-open="${product.id}" aria-label="Ver colores de ${esc(product.name)}"><img src="${esc(image)}" alt="${esc(product.name)}" loading="${position < 4 ? 'eager' : 'lazy'}">${product.soldOut ? '<span class="soldout-badge">AGOTADO</span>' : ''}</button>${imgs.length > 1 ? `<div class="card-color-thumbs card-color-carousel" aria-label="Modelos y colores disponibles">${imgs.map((src, i) => `<button type="button" data-thumb="${product.id}:${i}" class="${index === i ? 'active' : ''}" aria-label="Ver modelo ${i + 1}"><img src="${esc(src)}" alt="" loading="lazy"></button>`).join('')}</div>` : ''}<div class="card-models"><button class="models-button" type="button" data-open="${product.id}"><span>Ver colores</span><span class="models-arrow" aria-hidden="true">→</span></button></div><div class="product-card-body"><p class="product-brand">${esc(product.brand)}</p><h2>${esc(product.name)}</h2><p class="card-sizes"><span>TALLAS</span>${esc(product.sizes || 'Consultar')}</p><div class="card-actions"><a class="whatsapp-button" href="${whatsapp(product, index)}" target="_blank" rel="noreferrer"><span class="whatsapp-icon-image" aria-hidden="true"></span><span>PEDIR POR WHATSAPP</span></a></div></div></article>`;
  };
  const renderModal = () => {
    document.getElementById('live-product-modal')?.remove();
    const product = state.modal;
    if (!product) { document.body.classList.remove('modal-open'); return; }
    const imgs = photos(product);
    const index = Math.min(state.modalIndex, Math.max(0, imgs.length - 1));
    const image = imgs[index] || '/assets/logo.png';
    const video = product.videoUrl ? mediaUrl(product.videoUrl) : '';
    const media = state.showVideo && video ? `<video src="${esc(video)}" controls autoplay playsinline preload="metadata"></video>` : `<img src="${esc(image)}" alt="${esc(product.name)}">`;
    document.body.insertAdjacentHTML('beforeend', `<div class="modal" id="live-product-modal" role="dialog" aria-modal="true" aria-labelledby="live-modal-name"><button class="modal-backdrop" type="button" data-close aria-label="Cerrar ficha"></button><article class="product-modal-card"><button class="modal-close" type="button" data-close aria-label="Cerrar">×</button><button class="modal-media live-modal-media" type="button" data-toggle-media aria-label="${video ? 'Alternar foto y video' : 'Foto del producto'}">${media}${product.soldOut ? '<span class="soldout-badge">AGOTADO</span>' : ''}${video ? `<span class="live-video-hint">${state.showVideo ? 'VER FOTO' : '▶ VER VIDEO'}</span>` : ''}</button><div class="modal-thumbs">${imgs.map((src, i) => `<button type="button" data-modal-thumb="${i}" class="${index === i && !state.showVideo ? 'active' : ''}"><img src="${esc(src)}" alt=""></button>`).join('')}</div><div class="modal-content"><p class="modal-brand">${esc(product.brand)}</p><h2 id="live-modal-name">${esc(product.name)}</h2><p class="modal-sizes"><span>TALLAS</span><strong>${esc(product.sizes || 'Consultar')}</strong></p>${product.review ? `<p class="modal-review">${esc(product.review)}</p>` : ''}<div class="modal-actions"><a class="whatsapp-button" href="${whatsapp(product, index)}" target="_blank" rel="noreferrer"><span class="whatsapp-icon-image" aria-hidden="true"></span><span>PEDIR POR WHATSAPP</span></a></div></div></article></div>`);
    document.body.classList.add('modal-open');
  };
  const render = () => {
    if (!state.data) return;
    const visible = filtered();
    const allForGender = state.data.products.filter(p => state.gender === 'TODOS' || p.gender === state.gender || p.gender === 'TODOS');
    const brands = ['TODOS', ...new Set(allForGender.map(p => p.brand).filter(Boolean))];
    const grid = document.querySelector('.product-grid');
    if (grid) grid.innerHTML = visible.map(card).join('');
    const meta = document.querySelector('.catalog-meta strong');
    if (meta) meta.textContent = `${visible.length} ${visible.length === 1 ? 'MODELO' : 'MODELOS'}`;
    const brandStrip = document.querySelector('.brand-strip');
    if (brandStrip) brandStrip.innerHTML = brands.map(brand => `<button type="button" data-brand="${esc(brand)}" class="${state.brand === brand ? 'active' : ''}">${esc(brand)}</button>`).join('');
    document.querySelectorAll('.gender-tabs button').forEach(button => button.classList.toggle('active', button.dataset.gender === state.gender));
    document.querySelector('.empty-state')?.remove();
    if (!visible.length && grid) grid.insertAdjacentHTML('afterend', '<div class="empty-state"><strong>No encontramos ese modelo</strong><span>Prueba otra marca o búsqueda.</span></div>');
  };
  const bind = () => {
    document.addEventListener('click', event => {
      const controlled = event.target.closest('[data-brand], .gender-tabs [data-gender], [data-thumb], [data-open], [data-close], [data-modal-thumb], [data-toggle-media]');
      if (controlled) { event.preventDefault(); event.stopPropagation(); event.stopImmediatePropagation(); }
      const brand = event.target.closest('[data-brand]');
      if (brand) { state.brand = brand.dataset.brand; render(); return; }
      const gender = event.target.closest('.gender-tabs [data-gender]');
      if (gender) { state.gender = gender.dataset.gender; state.brand = 'TODOS'; history.replaceState({}, '', state.gender === 'MUJER' ? '/mujer' : state.gender === 'HOMBRE' ? '/hombre' : '/'); applyTheme(); render(); return; }
      const thumb = event.target.closest('[data-thumb]');
      if (thumb) { const [id, index] = thumb.dataset.thumb.split(':').map(Number); state.selected.set(id, index); render(); return; }
      const open = event.target.closest('[data-open]');
      if (open) { state.modal = state.data.products.find(p => p.id === Number(open.dataset.open)); state.modalIndex = state.selected.get(state.modal.id) || 0; state.showVideo = false; renderModal(); return; }
      if (event.target.closest('[data-close]')) { state.modal = null; renderModal(); return; }
      const modalThumb = event.target.closest('[data-modal-thumb]');
      if (modalThumb) { state.modalIndex = Number(modalThumb.dataset.modalThumb); state.showVideo = false; renderModal(); return; }
      if (event.target.closest('[data-toggle-media]') && state.modal?.videoUrl) { state.showVideo = !state.showVideo; renderModal(); }
    }, true);
    document.querySelector('.catalog-search input')?.addEventListener('input', event => { state.query = event.target.value; render(); });
  };
  const start = async () => {
    try {
      const response = await fetch(`/api/catalog?slug=revolt&fresh=${Date.now()}`, { cache: 'no-store', headers: { Accept: 'application/json' } });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      state.data = await response.json();
      state.gender = location.pathname.startsWith('/mujer') ? 'MUJER' : location.pathname.startsWith('/hombre') ? 'HOMBRE' : 'TODOS';
      applyTheme(); bind(); render(); document.documentElement.dataset.liveCatalog = 'ready';
    } catch (error) { console.error('No se pudo cargar el catálogo en vivo', error); }
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true }); else start();
})();
