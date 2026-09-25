(() => {
  document.documentElement.dataset.liveCatalog = 'loading';
  const bootStyle = document.createElement('style');
  bootStyle.id = 'revolt-live-boot';
  bootStyle.textContent = `html[data-live-catalog="loading"] body::after{content:"Cargando catálogo…";position:fixed;inset:0;z-index:99999;display:grid;place-items:center;background:#05090d;color:#ffd51f;font:900 18px Arial;letter-spacing:.04em}html[data-live-catalog="loading"] body>*{visibility:hidden}html[data-live-catalog="loading"] body::after{visibility:visible}`;
  document.head.appendChild(bootStyle);
  const state = { data: null, gender: 'TODOS', brand: 'TODOS', query: '', selected: new Map(), modal: null, modalIndex: 0, showVideo: false, cart: [] };
  const esc = (value = '') => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
  const mediaUrl = (url) => !url ? '/assets/logo.png' : url.startsWith('/media/') ? `https://revoltperu.shop${url}` : url;
  const photos = (product) => (product.images || []).filter(Boolean).map(mediaUrl);
  const anglesFor = (product, index) => [photos(product)[index], ...((product.angleImagesByColor || {})[index] || (product.angleImagesByColor || {})[String(index)] || []).map(mediaUrl)].filter(Boolean);
  const videoFor = (product, index) => {
    const byColor = product.videoByColor || {};
    const url = byColor[index] || byColor[String(index)] || '';
    return url ? mediaUrl(url) : '';
  };
  const orderFor = (product) => { const order = state.data?.orders?.[state.gender] || []; const i = order.indexOf(product.id); if (i >= 0) return i; return 10000 + (state.gender === 'HOMBRE' ? (product.sortOrderHombre ?? product.sortOrder ?? 9999) : state.gender === 'MUJER' ? (product.sortOrderMujer ?? product.sortOrder ?? 9999) : (product.sortOrder ?? 9999)); };
  const applyTheme = () => {
    const id = 'gender-theme-live';
    document.getElementById(id)?.remove();
    document.body.classList.toggle('gender-mujer', state.gender === 'MUJER');
    document.documentElement.dataset.liveGender = state.gender;
  };
  const applyMobileType = () => {
    if (document.getElementById('mobile-type-live')) return;
    const style = document.createElement('style');
    style.id = 'mobile-type-live';
    style.textContent = `
    .catalog-controls{position:relative!important;top:auto!important}.catalog-intro{display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important}.catalog-intro .catalog-search{width:min(760px,92vw)!important;margin-left:auto!important;margin-right:auto!important}.revoluciona-hero{display:block;width:min(760px,92vw);max-height:230px;object-fit:contain;margin:4px auto 12px;align-self:center;filter:drop-shadow(0 10px 24px #0008)}
    .brand-scroll-shell{position:sticky;top:0;z-index:62;display:flex;align-items:flex-end;gap:4px;padding:7px max(10px,calc((100vw - 1840px)/2));background:#070a0deF;border-bottom:1px solid #ffffff16;backdrop-filter:blur(12px)}.brand-scroll-shell .brand-strip{flex:1;min-width:0;scroll-behavior:smooth}
    .brand-scroll-arrow{display:none;border:0;background:#262626;color:#fff;border-radius:2px;width:28px;height:8px;flex:0 0 28px;padding:0;font-size:9px;font-weight:900;align-items:center;justify-content:center;line-height:8px;margin-bottom:1px}.brand-scroll-shell.is-start [data-brand-scroll="-1"],.brand-scroll-shell.is-end [data-brand-scroll="1"]{visibility:hidden;pointer-events:none}
    .angle-cycle{transition:opacity .55s ease,transform .55s ease}.angle-cycle.angle-changing{opacity:.22;transform:scale(.985)}
    .cart-add-button{width:100%;margin-top:8px;min-height:42px;border:1px solid #ffd21c;border-radius:8px;background:#151515;color:#ffd21c;font-weight:900;letter-spacing:.03em;cursor:pointer}
    .card-price,.modal-price{display:flex;align-items:center;justify-content:space-between;gap:12px;margin:10px 0;padding:10px 12px;border:1px solid #ffd21c55;border-radius:9px;background:#ffd21c0d;color:#ffd21c;font-weight:900}.card-price span,.modal-price span{font-size:10px;letter-spacing:.13em}.card-price strong,.modal-price strong{font-size:20px;color:#fff}.price-change-toast{position:fixed;left:50%;top:18px;z-index:10000;transform:translateX(-50%);padding:12px 18px;border:1px solid #ffd21c;border-radius:999px;background:#0c0c0cf2;color:#fff;font-weight:900;box-shadow:0 12px 40px #000b;animation:priceToast 2.4s ease both}@keyframes priceToast{0%{opacity:0;transform:translate(-50%,-18px) scale(.92)}15%,78%{opacity:1;transform:translate(-50%,0) scale(1)}100%{opacity:0;transform:translate(-50%,-8px) scale(.98)}}
    .revolt-dock{position:fixed;right:18px;bottom:18px;z-index:70;display:flex;gap:9px}.revolt-dock button{border:1px solid #ffd21c;background:#101010;color:#fff;border-radius:999px;padding:12px 16px;font-weight:900;box-shadow:0 8px 30px #0009}.revolt-dock .cart-count{display:inline-grid;place-items:center;margin-left:6px;background:#ffd21c;color:#111;border-radius:50%;min-width:22px;height:22px}
    .revolt-dock [data-cart-open].cart-hit{animation:cartHit .5s cubic-bezier(.2,.85,.3,1)}.fly-to-cart{position:fixed;z-index:9999;pointer-events:none;object-fit:cover;border:3px solid #ffd21c;border-radius:16px;box-shadow:0 16px 38px #000c;transition:transform .78s cubic-bezier(.2,.75,.25,1),opacity .78s ease,filter .78s ease}@keyframes cartHit{40%{transform:scale(1.16);box-shadow:0 0 0 12px #ffd21c22}100%{transform:none}}
    .revolt-panel{position:fixed;inset:0;z-index:100;background:#000b;display:grid;place-items:center;padding:18px}.revolt-panel-card{width:min(720px,96vw);max-height:88vh;overflow:auto;background:linear-gradient(145deg,#171717,#080808);border:1px solid #ffd21c;border-radius:20px;padding:20px;color:#fff;box-shadow:0 24px 80px #000}.revolt-panel-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:15px}.revolt-panel-head h2{margin:0}.revolt-panel-close{border:0;background:#292929;color:#fff;border-radius:50%;width:38px;height:38px;font-size:22px}.cart-line{display:grid;grid-template-columns:70px 1fr auto;gap:12px;align-items:center;padding:12px 0;border-bottom:1px solid #333}.cart-line img{width:70px;height:70px;object-fit:cover;border-radius:10px}.cart-line button{background:#311;color:#ff8b8b;border:1px solid #733;border-radius:7px;padding:8px}.cart-send{display:block;text-align:center;margin-top:18px;padding:14px;border-radius:10px;background:#25d366;color:#071b0e;font-weight:900;text-decoration:none}
    .delivered-stage{overflow:hidden;border-radius:14px;background:#111;padding:14px}.delivered-track{display:flex;gap:14px;width:max-content;animation:deliveredMarquee var(--delivered-speed,34s) linear infinite;will-change:transform}.delivered-track:hover{animation-play-state:paused}.delivered-track img{width:260px;height:260px;object-fit:cover;border-radius:14px;border:1px solid #444;flex:0 0 auto}@keyframes deliveredMarquee{to{transform:translateX(-50%)}}
    .product-card{animation:premiumRise .65s cubic-bezier(.2,.75,.25,1) both}.product-card:nth-child(2n){animation-delay:.06s}.product-card:nth-child(3n){animation-delay:.12s}.catalog-heading,.catalog-meta,.gender-tabs,.brand-scroll-shell{animation:premiumRise .7s ease both}@keyframes premiumRise{from{opacity:0;transform:translateY(22px) scale(.985);filter:blur(4px)}to{opacity:1;transform:none;filter:none}}
    @media (max-width:600px){
      .product-card h2{font-size:18px!important;line-height:1.15!important;min-height:42px!important;font-weight:900!important}
      .product-brand{font-size:11px!important;letter-spacing:.12em!important;font-weight:900!important}
      .card-sizes{font-size:13px!important;line-height:1.35!important}
      .card-sizes span{font-size:10px!important;display:block!important;margin-bottom:3px}
      .models-button{font-size:13px!important;min-height:38px!important;font-weight:900!important}
      .whatsapp-button,.cart-add-button{font-family:inherit!important;font-size:11px!important;min-height:44px!important;font-weight:800!important;letter-spacing:.035em!important;justify-content:center!important;gap:8px!important}
      .whatsapp-icon-image{width:24px!important;height:24px!important;flex:0 0 24px!important}
      .catalog-meta strong{font-size:12px!important}.catalog-meta span{font-size:12px!important}
      .brand-strip button,.gender-tabs button{font-size:11px!important;font-weight:850!important;padding:8px 12px!important}
      .brand-strip{overflow-x:scroll!important;scrollbar-width:auto!important;scrollbar-color:#ffd21c #252525!important;padding-bottom:10px!important}
      .brand-strip::-webkit-scrollbar{display:block!important;height:7px!important}
      .brand-strip::-webkit-scrollbar-track{background:#252525!important;border-radius:10px!important}
      .brand-strip::-webkit-scrollbar-thumb{background:#ffd21c!important;border-radius:10px!important;border:1px solid #252525!important}
      .brand-scroll-arrow{display:flex!important}.revoluciona-hero{width:94vw;max-height:150px;margin-top:0}.revolt-dock{left:10px;right:10px;bottom:10px;justify-content:space-between}.revolt-dock button{padding:10px 12px;font-size:12px}.delivered-track img{width:210px;height:210px}
      .gender-mujer .gender-tabs button{background:#fff!important;color:#7b3152!important;border-color:#d3d3d6!important}
      .gender-mujer .gender-tabs button.active{background:#fff!important;color:#7b3152!important;border-color:#ff4f9a!important;box-shadow:inset 0 0 0 1px #ff4f9a!important}
      .gender-mujer .catalog-heading{color:#fff!important;text-shadow:0 1px #075cae,0 0 10px #168cff70,0 0 20px #168cff45!important;font-style:italic!important;font-weight:900!important}
    }`;
    document.head.appendChild(style);
  };
  const whatsapp = (product, index) => {
    const number = String(state.data.settings.whatsapp || '51981395069').replace(/\D/g, '');
    const text = ['Quiero pedir este modelo:', '', `Modelo: ${product.name}`, `Color elegido: Foto ${index + 1}`, `Precio: S/${catalogPrice(product)}`, 'Talla: (por confirmar)'].join('\n');
    return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
  };
  const basePrice = (product) => Math.round(Number(product.price)) === 99 ? 99 : 95;
  const cartQuantity = () => state.cart.reduce((sum, item) => sum + item.qty, 0);
  const catalogPrice = (product) => cartQuantity() >= 2 ? 70 : cartQuantity() === 1 ? 80 : basePrice(product);
  const refreshVisiblePrices = () => { document.querySelectorAll('[data-product-price]').forEach(node => { const product = state.data?.products?.find(item => item.id === Number(node.dataset.productPrice)); if (!product) return; const next = catalogPrice(product), previous = Number(node.dataset.currentPrice || String(node.textContent).replace(/\D/g,'')); node.textContent = `S/${next}`; node.dataset.currentPrice = next; if (previous && previous !== next && !matchMedia('(prefers-reduced-motion: reduce)').matches) node.animate([{opacity:.2,transform:'translateY(-8px) scale(.86)',filter:'blur(3px)'},{opacity:1,transform:'translateY(0) scale(1.12)',filter:'blur(0)'},{transform:'scale(1)'}],{duration:650,easing:'cubic-bezier(.2,.8,.2,1)'}); }); document.querySelectorAll('.product-card[data-live-id]').forEach(card => { const product = state.data?.products?.find(item => item.id === Number(card.dataset.liveId)), link = card.querySelector('.whatsapp-button'); if (product && link) link.href = whatsapp(product, state.selected.get(product.id) || 0); }); if (state.modal) { const link = document.querySelector('#live-product-modal .whatsapp-button'); if (link) link.href = whatsapp(state.modal, state.modalIndex); } };
  const saveCart = () => { localStorage.setItem('revolt-cart', JSON.stringify(state.cart)); renderDock(); refreshVisiblePrices(); };
  const flyToCart = (source) => {
    const origin = source?.closest('.product-card,.product-modal-card')?.querySelector('.product-image-button img,.live-modal-media img');
    const target = document.querySelector('[data-cart-open]');
    if (!origin || !target) return;
    const from = origin.getBoundingClientRect(), to = target.getBoundingClientRect(), size = Math.min(110, from.width, from.height);
    const flying = origin.cloneNode(); flying.className = 'fly-to-cart';
    Object.assign(flying.style,{left:`${from.left + from.width / 2 - size / 2}px`,top:`${from.top + from.height / 2 - size / 2}px`,width:`${size}px`,height:`${size}px`,transform:'translate3d(0,0,0) scale(1)',opacity:'1'});
    document.body.appendChild(flying);
    requestAnimationFrame(()=>requestAnimationFrame(()=>{flying.style.transform=`translate3d(${to.left + to.width / 2 - (from.left + from.width / 2)}px,${to.top + to.height / 2 - (from.top + from.height / 2)}px,0) scale(.16) rotate(10deg)`;flying.style.opacity='.15';flying.style.filter='blur(2px)'}));
    flying.addEventListener('transitionend',()=>{flying.remove();target.classList.remove('cart-hit');void target.offsetWidth;target.classList.add('cart-hit')},{once:true});
  };
  const addToCart = (product, index, source) => {
    const selectedPrice = catalogPrice(product), key = `${product.id}:${index}:${Date.now()}:${Math.random().toString(36).slice(2,7)}`;
    state.cart.push({ key, id: product.id, index, qty: 1, name: product.name, brand: product.brand, price: selectedPrice, image: photos(product)[index] || '/assets/logo.png' });
    saveCart();
    flyToCart(source);
    const after = cartQuantity();
    if (after <= 3) { document.querySelector('.price-change-toast')?.remove(); const notice = after === 1 ? '¡El siguiente producto baja a S/80!' : after === 2 ? '¡Desde el tercero, cada producto a S/70!' : '¡Producto agregado a S/70!'; document.body.insertAdjacentHTML('beforeend', `<div class="price-change-toast">${notice}</div>`); setTimeout(()=>document.querySelector('.price-change-toast')?.remove(),2500); }
  };
  const renderDock = () => {
    let dock = document.getElementById('revolt-dock');
    if (!dock) {
      document.body.insertAdjacentHTML('beforeend', '<nav class="revolt-dock" id="revolt-dock" aria-label="Acciones rápidas"><button type="button" data-cart-open>🛒 Carrito <span class="cart-count">0</span></button><button type="button" data-delivered-open>✓ Pedidos enviados</button></nav>');
      dock = document.getElementById('revolt-dock');
    }
    const count = cartQuantity();
    dock.querySelector('.cart-count').textContent = count;
  };
  const closePanel = () => document.getElementById('revolt-panel')?.remove();
  const renderCartPanel = () => {
    closePanel();
    const number = String(state.data.settings.whatsapp || '51981395069').replace(/\D/g, '');
    const total = state.cart.reduce((sum,item)=>sum + item.qty * item.price,0);
    const itemPrice = item => item.price;
    const message = ['Hola, quiero pedir:', ...state.cart.map(item => `• ${item.qty}x ${item.name} - color ${item.index + 1} - S/${itemPrice(item)} c/u`), '', `Total: S/${total}`].join('\n');
    const lines = state.cart.length ? state.cart.map(item => `<div class="cart-line"><img src="${esc(item.image)}" alt=""><div><strong>${esc(item.name)}</strong><small>${esc(item.brand)} · Color ${item.index + 1} · Cant. ${item.qty} · S/${itemPrice(item)} c/u</small></div><button type="button" data-cart-remove="${esc(item.key)}">Quitar</button></div>`).join('') : '<p>Tu carrito está vacío.</p>';
    document.body.insertAdjacentHTML('beforeend', `<div class="revolt-panel" id="revolt-panel"><section class="revolt-panel-card"><header class="revolt-panel-head"><h2>Tu carrito</h2><button class="revolt-panel-close" type="button" data-panel-close>×</button></header>${lines}${state.cart.length ? `<p class="modal-price"><span>PRIMER PRODUCTO ORIGINAL · SEGUNDO S/80 · DESDE EL TERCERO S/70</span><strong data-cart-total>Total S/${total}</strong></p><a class="cart-send" href="https://wa.me/${number}?text=${encodeURIComponent(message)}" target="_blank">Pedir carrito por Whatsapp</a>` : ''}</section></div>`);
  };
  const renderDeliveredPanel = () => {
    closePanel();
    const allImages = (state.data.settings.deliveredImages || []).filter(Boolean).map(mediaUrl);
    const shuffled = [...allImages];
    for (let i = shuffled.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; }
    const limits = { 1: 8, 2: 15, 3: 25, 4: 35, 5: 45, 6: Infinity, 0: Infinity };
    const images = shuffled.slice(0, limits[new Date().getDay()]);
    const show = images.length ? [...images, ...images].map(src => `<img src="${esc(src)}" alt="Pedido enviado en la semana">`).join('') : '<p>Aquí aparecerán los pedidos enviados durante la semana.</p>';
    const speed = Math.max(28, images.length * 3.4);
    document.body.insertAdjacentHTML('beforeend', `<div class="revolt-panel" id="revolt-panel"><section class="revolt-panel-card"><header class="revolt-panel-head"><h2>Pedidos enviados en la semana</h2><button class="revolt-panel-close" type="button" data-panel-close>×</button></header><div class="delivered-stage"><div class="delivered-track" style="--delivered-speed:${speed}s">${show}</div></div></section></div>`);
  };
  const setupBrandScroller = () => {
    const strip = document.querySelector('.brand-strip');
    if (!strip) return;
    let shell = strip.parentElement?.classList.contains('brand-scroll-shell') ? strip.parentElement : null;
    if (!shell) { shell = document.createElement('div'); shell.className = 'brand-scroll-shell'; strip.parentNode.insertBefore(shell, strip); shell.appendChild(strip); shell.insertAdjacentHTML('afterbegin', '<button class="brand-scroll-arrow" type="button" data-brand-scroll="-1" aria-label="Ver marcas anteriores">‹</button>'); shell.insertAdjacentHTML('beforeend', '<button class="brand-scroll-arrow" type="button" data-brand-scroll="1" aria-label="Ver más marcas">›</button>'); }
    const controls = document.querySelector('.catalog-controls'); if (controls && shell.parentElement === controls) controls.insertAdjacentElement('afterend', shell);
    const update = () => { const max = Math.max(0, strip.scrollWidth - strip.clientWidth); shell.classList.toggle('is-start', strip.scrollLeft <= 2); shell.classList.toggle('is-end', strip.scrollLeft >= max - 2); };
    if (!strip.dataset.arrowBound) { strip.addEventListener('scroll', update, { passive:true }); addEventListener('resize', update); new ResizeObserver(update).observe(strip); strip.dataset.arrowBound = '1'; }
    requestAnimationFrame(update);
  };
  const setupHero = () => {
    const intro = document.querySelector('.catalog-intro'), search = intro?.querySelector('.catalog-search');
    if (!intro || !search || intro.querySelector('.revoluciona-hero')) return;
    search.insertAdjacentHTML('beforebegin', '<img class="revoluciona-hero" src="/assets/revoluciona-tu-estilo.png" alt="REVOLUCIONA Tu estilo">');
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
    const hasVideos = imgs.some((_, i) => Boolean(videoFor(product, i)));
    return `<article class="product-card" data-live-id="${product.id}"><button class="product-image-button" type="button" data-open="${product.id}" aria-label="Ver colores de ${esc(product.name)}"><img class="angle-cycle" data-angle-product="${product.id}" data-angle-index="${index}" src="${esc(image)}" alt="${esc(product.name)}" loading="${position < 4 ? 'eager' : 'lazy'}">${product.soldOut ? '<span class="soldout-badge">AGOTADO</span>' : ''}</button>${imgs.length > 1 ? `<div class="card-color-thumbs card-color-carousel" aria-label="Modelos y colores disponibles">${imgs.map((src, i) => `<button type="button" data-thumb="${product.id}:${i}" class="${index === i ? 'active' : ''}" aria-label="Ver modelo ${i + 1}"><img src="${esc(src)}" alt="" loading="lazy"></button>`).join('')}</div>` : ''}<div class="card-models"><button class="models-button" type="button" data-open="${product.id}"><span>${hasVideos ? 'Ver colores y videos' : 'Ver colores'}</span><span class="models-arrow" aria-hidden="true">→</span></button></div><div class="product-card-body"><p class="product-brand">${esc(product.brand)}</p><h2>${esc(product.name)}</h2><p class="card-price"><span>PRECIO</span><strong data-product-price="${product.id}">S/${catalogPrice(product)}</strong></p><p class="card-sizes"><span>TALLAS</span>${esc(product.sizes || 'Consultar')}</p><div class="card-actions"><a class="whatsapp-button" href="${whatsapp(product, index)}" target="_blank" rel="noreferrer"><span class="whatsapp-icon-image" aria-hidden="true"></span><span>Pedir por Whatsapp</span></a><button class="cart-add-button" type="button" data-add-cart="${product.id}:${index}">🛒 Agregar al carrito</button></div></div></article>`;
  };
  const renderModal = () => {
    document.getElementById('live-product-modal')?.remove();
    const product = state.modal;
    if (!product) { document.body.classList.remove('modal-open'); return; }
    const imgs = photos(product);
    const index = Math.min(state.modalIndex, Math.max(0, imgs.length - 1));
    const image = imgs[index] || '/assets/logo.png';
    const video = videoFor(product, index);
    const media = state.showVideo && video ? `<video src="${esc(video)}" autoplay muted loop playsinline preload="auto"></video>` : `<img src="${esc(image)}" alt="${esc(product.name)}">`;
    document.body.insertAdjacentHTML('beforeend', `<div class="modal" id="live-product-modal" role="dialog" aria-modal="true" aria-labelledby="live-modal-name"><button class="modal-backdrop" type="button" data-close aria-label="Cerrar ficha"></button><article class="product-modal-card"><button class="modal-close" type="button" data-close aria-label="Cerrar">×</button><button class="modal-media live-modal-media" type="button" data-toggle-media aria-label="${video ? 'Alternar foto y video' : 'Foto del producto'}">${media}${product.soldOut ? '<span class="soldout-badge">AGOTADO</span>' : ''}${video ? `<span class="live-video-hint">${state.showVideo ? 'VER FOTO' : '▶ VER VIDEO'}</span>` : ''}</button><div class="modal-thumbs">${imgs.map((src, i) => `<button type="button" data-modal-thumb="${i}" class="${index === i && !state.showVideo ? 'active' : ''}"><img src="${esc(src)}" alt=""></button>`).join('')}</div><div class="modal-content"><p class="modal-brand">${esc(product.brand)}</p><h2 id="live-modal-name">${esc(product.name)}</h2><p class="modal-sizes"><span>TALLAS</span><strong>${esc(product.sizes || 'Consultar')}</strong></p>${product.review ? `<p class="modal-review">${esc(product.review)}</p>` : ''}<div class="modal-actions"><a class="whatsapp-button" href="${whatsapp(product, index)}" target="_blank" rel="noreferrer"><span class="whatsapp-icon-image" aria-hidden="true"></span><span>Pedir por Whatsapp</span></a><button class="cart-add-button" type="button" data-add-cart="${product.id}:${index}">🛒 Agregar al carrito</button></div></div></article></div>`);
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
    setupBrandScroller();
    document.querySelectorAll('.gender-tabs button').forEach(button => button.classList.toggle('active', button.dataset.gender === state.gender));
    document.querySelector('.empty-state')?.remove();
    if (!visible.length && grid) grid.insertAdjacentHTML('afterend', '<div class="empty-state"><strong>No encontramos ese modelo</strong><span>Prueba otra marca o búsqueda.</span></div>');
    renderDock();
  };
  const bind = () => {
    document.addEventListener('click', event => {
      const controlled = event.target.closest('[data-brand], .gender-tabs [data-gender], [data-thumb], [data-open], [data-close], [data-modal-thumb], [data-toggle-media], [data-add-cart], [data-cart-open], [data-delivered-open], [data-panel-close], [data-cart-remove], [data-brand-scroll]');
      if (controlled) { event.preventDefault(); event.stopPropagation(); event.stopImmediatePropagation(); }
      const brand = event.target.closest('[data-brand]');
      if (brand) { state.brand = brand.dataset.brand; render(); return; }
      const scroll = event.target.closest('[data-brand-scroll]');
      if (scroll) { document.querySelector('.brand-strip')?.scrollBy({ left: Number(scroll.dataset.brandScroll) * Math.max(220, innerWidth * .55), behavior: 'smooth' }); return; }
      const gender = event.target.closest('.gender-tabs [data-gender]');
      if (gender) { state.gender = gender.dataset.gender; state.brand = 'TODOS'; history.replaceState({}, '', state.gender === 'MUJER' ? '/mujer' : state.gender === 'HOMBRE' ? '/hombre' : '/'); applyTheme(); render(); return; }
      const thumb = event.target.closest('[data-thumb]');
      if (thumb) { const [id, index] = thumb.dataset.thumb.split(':').map(Number); state.selected.set(id, index); render(); return; }
      const open = event.target.closest('[data-open]');
      if (open) { state.modal = state.data.products.find(p => p.id === Number(open.dataset.open)); state.modalIndex = state.selected.get(state.modal.id) || 0; state.showVideo = false; renderModal(); return; }
      if (event.target.closest('[data-close]')) { state.modal = null; renderModal(); return; }
      const modalThumb = event.target.closest('[data-modal-thumb]');
      if (modalThumb) { state.modalIndex = Number(modalThumb.dataset.modalThumb); state.showVideo = false; renderModal(); return; }
      if (event.target.closest('[data-toggle-media]') && videoFor(state.modal, state.modalIndex)) { state.showVideo = !state.showVideo; renderModal(); }
      const add = event.target.closest('[data-add-cart]');
      if (add) { const [id, index] = add.dataset.addCart.split(':').map(Number); const product = state.data.products.find(p => p.id === id); if (product) addToCart(product, index, add); return; }
      if (event.target.closest('[data-cart-open]')) { renderCartPanel(); return; }
      if (event.target.closest('[data-delivered-open]')) { renderDeliveredPanel(); return; }
      if (event.target.closest('[data-panel-close]')) { closePanel(); return; }
      const remove = event.target.closest('[data-cart-remove]');
      if (remove) { state.cart = state.cart.filter(item => item.key !== remove.dataset.cartRemove); saveCart(); renderCartPanel(); }
    }, true);
    document.querySelector('.catalog-search input')?.addEventListener('input', event => { state.query = event.target.value; render(); });
  };
  const start = async () => {
    try {
      const response = await fetch(`/api/catalog?slug=revolt&fresh=${Date.now()}`, { cache: 'no-store', headers: { Accept: 'application/json' } });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      state.data = await response.json();
      try { state.cart = JSON.parse(localStorage.getItem('revolt-cart') || '[]'); } catch { state.cart = []; }
      state.gender = location.pathname.startsWith('/mujer') ? 'MUJER' : location.pathname.startsWith('/hombre') ? 'HOMBRE' : 'TODOS';
      applyTheme(); applyMobileType(); setupHero(); setupBrandScroller(); bind(); render();
      setInterval(() => document.querySelectorAll('[data-angle-product]').forEach(img => { const product = state.data.products.find(p => p.id === Number(img.dataset.angleProduct)); const list = product ? anglesFor(product, Number(img.dataset.angleIndex)) : []; if (list.length < 2) return; const next = (Number(img.dataset.anglePosition || 0) + 1) % list.length; img.classList.add('angle-changing'); setTimeout(() => { if (!img.isConnected) return; img.src = list[next]; img.dataset.anglePosition = next; img.classList.remove('angle-changing'); }, 280); }), 4200);
      document.documentElement.dataset.liveCatalog = 'ready'; bootStyle.remove();
    } catch (error) { console.error('No se pudo cargar el catálogo en vivo', error); }
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true }); else start();
})();
