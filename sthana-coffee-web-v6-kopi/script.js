/* ==========================================================
   Sthana Coffee Madiun - script.js
   Isi: 1 Data | 2 Helper | 3 Render | 4 Menu | 5 Keranjang | 6 Animasi | 7 Inisialisasi
   ========================================================== */

/* 1. DATA ------------------------------------------------- */
const businessInfo = {
  name: 'Sthana Coffee',
  address: 'Jl. Setiaki No. 27, Kelurahan Oro-oro Ombo, Kecamatan Kartoharjo, Kota Madiun, Jawa Timur 63119',
  whatsapp: '6289633504040',          // format internasional
  whatsappLabel: '089633504040',
  grabfood: 'https://app.grab.com/s/3jzXe5SR',
  hours: '08.00 - 00.00 WIB',         // sesuaikan bila berubah
  reserveStartMin: 8 * 60,            // jam reservasi pertama: 08.00 pagi
  reserveEndMin: 23 * 60 + 30,        // jam reservasi terakhir: 23.30
  kitchenCloseWeekdayMin: 22 * 60 + 30, // close order kitchen weekday (Sen-Jum): 22.30
  kitchenCloseWeekendMin: 23 * 60 + 30, // close order kitchen weekend (Sab-Min): 23.30
  drinkCloseMin: 23 * 60 + 30         // close order minuman setiap hari: 23.30
};

const categories = [
  { key: 'all', label: 'Semua' },
  { key: 'coffee', label: 'Kopi' },
  { key: 'non-coffee', label: 'Non-Kopi' },
  { key: 'makanan-berat', label: 'Makanan Berat' },
  { key: 'snack', label: 'Camilan' }
];

// featured: true = tampil di "Menu Pilihan" pada Home
const menuData = [
  { id: 1, name: 'Palm Sugar', category: 'coffee', price: 23000, featured: true, image: 'images/menu/palm-sugar.jpg', description: 'Kopi susu lembut dengan aroma khas gula aren yang harum.' },
  { id: 2, name: 'Raisin Aren Latte', category: 'coffee', price: 23000, image: 'images/menu/raisin-aren-latte.jpg', description: 'Perpaduan espresso, susu, dan sentuhan aroma raisin aren istimewa.' },
  { id: 3, name: 'Hazelnut Latte', category: 'coffee', price: 23000, image: 'images/menu/hazelnut-latte.jpg', description: 'Kopi susu nikmat dengan sentuhan gurih hazelnut yang lembut.' },
  { id: 4, name: 'Caramel Latte', category: 'coffee', price: 23000, image: 'images/menu/caramel-latte.jpg', description: 'Espresso dan susu berpadu saus karamel manis legit.' },
  { id: 5, name: 'Butterscotch Latte', category: 'coffee', price: 23000, image: 'images/menu/butterscotch-latte.jpg', description: 'Kelembutan latte dengan sensasi rasa butterscotch yang kaya.' },
  { id: 6, name: 'Coklat', category: 'non-coffee', price: 22000, image: 'images/menu/coklat.jpg', description: 'Minuman cokelat pekat yang kaya rasa dan memanjakan lidah.' },
  { id: 7, name: 'Greentea', category: 'non-coffee', price: 22000, featured: true, image: 'images/menu/greentea.jpg', description: 'Matcha greentea creamy dengan aroma khas menenangkan.' },
  { id: 8, name: 'Nasi Ayam Kremes', category: 'makanan-berat', price: 25000, image: 'images/menu/nasi-ayam-kremes.jpg', description: 'Nasi hangat dengan ayam goreng berbumbu dan taburan kremes renyah.' },
  { id: 9, name: 'Nasi Lidah Sapi', category: 'makanan-berat', price: 29000, image: 'images/menu/nasi-lidah-sapi.jpg', description: 'Nasi istimewa dengan olahan lidah sapi empuk berempah sedap.' },
  { id: 10, name: 'Nasi Goreng Sthana', category: 'makanan-berat', price: 28000, featured: true, image: 'images/menu/nasi-goreng-sthana.jpg', description: 'Nasi goreng racikan khas Sthana dengan bumbu gurih mantap.' },
  { id: 11, name: 'Tahu Cabe Garam', category: 'snack', price: 18000, image: 'images/menu/tahu-cabe-garam.jpg', description: 'Tahu goreng renyah berpadu tumisan cabai dan bawang gurih pedas.' },
  { id: 12, name: 'Karage', category: 'snack', price: 25000, featured: true, image: 'images/menu/karage.jpg', description: 'Ayam berbumbu berbalut tepung renyah, garing di luar juicy di dalam.' },
  { id: 13, name: 'Chicken Wings Gochujang', category: 'snack', price: 25000, image: 'images/menu/chicken-wings-gochujang.jpg', description: 'Sayap ayam goreng dibalut saus gochujang pedas manis.' },
  { id: 14, name: 'Taichan', category: 'snack', price: 20000, image: 'images/menu/taichan.jpg', description: 'Sate ayam gurih dengan sambal taichan pedas segar.' },
  { id: 15, name: 'Mendoan', category: 'snack', price: 17000, image: 'images/menu/mendoan.jpg', description: 'Tempe mendoan hangat dengan balutan tepung lembut dan sambal kecap.' }
];

const galleryData = [
  { image: 'images/gallery/gallery-1.jpg', alt: 'Es kopi susu topping crumble Sthana Coffee', type: 'produk' },
  { image: 'images/gallery/gallery-2.jpg', alt: 'Area barista Sthana Coffee', type: 'suasana' },
  { image: 'images/gallery/gallery-3.jpg', alt: 'Nasi ayam kremes Sthana Coffee', type: 'produk' },
  { image: 'images/gallery/gallery-4.jpg', alt: 'Sudut duduk di dalam ruangan', type: 'suasana' },
  { image: 'images/gallery/gallery-5.jpg', alt: 'Es kopi susu karamel', type: 'produk' },
  { image: 'images/gallery/gallery-6.jpg', alt: 'Area duduk di luar ruangan', type: 'suasana' }
];

/* 2. HELPER ----------------------------------------------- */
const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

const formatPrice = (value) => 'Rp' + value.toLocaleString('id-ID');
const waLink = (text = '') =>
  `https://wa.me/${businessInfo.whatsapp}` + (text ? `?text=${encodeURIComponent(text)}` : '');
const orderText = (item) => `Halo Sthana Coffee, saya ingin memesan ${item.name} (${formatPrice(item.price)}).`;

/* 3. RENDER ----------------------------------------------- */
function productCard(item) {
  return `
    <article class="card product">
      <div class="media"><img src="${item.image}" alt="${item.name}" loading="lazy"></div>
      <div class="product__head">
        <h3 class="product__name">${item.name}</h3>
        <span class="product__price">${formatPrice(item.price)}</span>
      </div>
      <p class="product__desc">${item.description}</p>
      <button class="btn btn--primary" type="button" data-order="${item.id}">
        <span class="material-symbols-outlined">add_shopping_cart</span>Tambah
      </button>
    </article>`;
}

function renderFeatured() {
  if (!$('#featuredGrid')) return;
  $('#featuredGrid').innerHTML = menuData.filter((m) => m.featured).map(productCard).join('');
}

function renderMenu(list) {
  const wrapper = $('#menuList');
  if (!wrapper) return;
  const groups = categories.filter((c) => c.key !== 'all').map((c) => ({
    ...c, items: list.filter((m) => m.category === c.key)
  })).filter((g) => g.items.length);

  wrapper.innerHTML = groups.map((g) => `
    <h3 class="category-title">${g.label}<small>${g.items.length} Pilihan</small></h3>
    <div class="grid grid--products">${g.items.map(productCard).join('')}</div>`).join('');
  $('#menuEmpty').hidden = list.length > 0;
}

function renderGallery(filter = 'all') {
  if (!$('#galleryGrid')) return;
  const items = galleryData.filter((g) => filter === 'all' || g.type === filter);
  $('#galleryGrid').innerHTML = items.map((g) =>
    `<div class="media gallery__item"><img src="${g.image}" alt="${g.alt}" loading="lazy"></div>`).join('');
}

function renderPills(container, list, onSelect) {
  container.innerHTML = list.map((c, i) =>
    `<button type="button" class="pill" data-key="${c.key}" aria-pressed="${i === 0}">${c.label}</button>`).join('');
  container.addEventListener('click', (e) => {
    const pill = e.target.closest('.pill');
    if (!pill) return;
    $$('.pill', container).forEach((p) => p.setAttribute('aria-pressed', p === pill));
    onSelect(pill.dataset.key);
  });
}

/* 4. INTERAKSI MENU --------------------------------------- */
const menuState = { category: 'all', query: '' };
function applyMenuFilter() {
  const q = menuState.query.trim().toLowerCase();
  renderMenu(menuData.filter((m) =>
    (menuState.category === 'all' || m.category === menuState.category) && m.name.toLowerCase().includes(q)));
}
function resetMenuFilter() {
  menuState.category = 'all'; menuState.query = '';
  $('#menuSearch').value = '';
  $$('#menuFilters .pill').forEach((p) => p.setAttribute('aria-pressed', p.dataset.key === 'all'));
  applyMenuFilter();
}

/* 5. KERANJANG PESANAN (bisa lebih dari 1 menu) ------------- */
const CART_KEY = 'sthana-keranjang-v1';
const isDrink = (item) => ['coffee', 'non-coffee'].includes(item.category);
const itemOf = (id) => menuData.find((m) => m.id === Number(id));
let cart = [];
try { cart = (JSON.parse(localStorage.getItem(CART_KEY)) || []).filter((l) => itemOf(l.id) && l.qty > 0); } catch (e) { cart = []; }
const saveCart = () => { try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch (e) {} };
const cartCount = () => cart.reduce((n, l) => n + l.qty, 0);
const cartTotal = () => cart.reduce((n, l) => n + l.qty * itemOf(l.id).price, 0);
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const orderState = { item: null, qty: 1 };

function injectUI() {
  document.body.insertAdjacentHTML('beforeend', `
  <button class="cart-bar" type="button" data-open-cart hidden>
    <span class="material-symbols-outlined">shopping_bag</span>
    <span id="barText"></span><strong>Lihat Keranjang</strong>
  </button>
  <div class="toast" id="toast" role="status" aria-live="polite" hidden></div>

  <div class="modal" id="orderModal" hidden>
    <div class="modal__sheet" role="dialog" aria-modal="true" aria-labelledby="orderTitle">
      <button class="modal__close" data-close type="button" aria-label="Tutup"><span class="material-symbols-outlined">close</span></button>
      <p class="modal__label">Tambah ke keranjang</p>
      <h3 id="orderTitle">Nama Menu</h3>
      <p class="modal__price" id="orderPrice"></p>
      <fieldset class="opt" id="optTemp">
        <legend>Pilihan minuman</legend>
        <div class="chips">
          <label class="chip"><input type="radio" name="temp" value="Dingin" checked><span>Dingin</span></label>
          <label class="chip"><input type="radio" name="temp" value="Panas"><span>Panas</span></label>
        </div>
      </fieldset>
      <div class="opt opt--row">
        <span class="opt__label" id="qtyLabel">Jumlah</span>
        <div class="qty" role="group" aria-labelledby="qtyLabel">
          <button type="button" id="qtyMinus" aria-label="Kurangi jumlah">&minus;</button>
          <output id="qtyValue" aria-live="polite">1</output>
          <button type="button" id="qtyPlus" aria-label="Tambah jumlah">+</button>
        </div>
      </div>
      <label class="opt field"><span class="opt__label">Catatan (opsional)</span>
        <input type="text" id="itemNote" maxlength="80" placeholder="Contoh: less sugar, tanpa es"></label>
      <div class="order__total"><span>Subtotal</span><strong id="orderTotal">Rp0</strong></div>
      <button class="btn btn--primary btn--block" type="button" id="addToCart"><span class="material-symbols-outlined">add_shopping_cart</span>Tambah ke Keranjang</button>
    </div>
  </div>

  <div class="modal" id="cartModal" hidden>
    <div class="modal__sheet" role="dialog" aria-modal="true" aria-labelledby="cartTitle">
      <button class="modal__close" data-close type="button" aria-label="Tutup"><span class="material-symbols-outlined">close</span></button>
      <h3 id="cartTitle">Keranjang Pesanan</h3>
      <ul class="lines" id="cartList"></ul>
      <div class="empty empty--cart" id="cartEmpty" hidden>
        <span class="material-symbols-outlined">shopping_bag</span>
        <p>Keranjang masih kosong. Pilih menu favorit Anda dulu.</p>
        <a class="btn btn--soft" href="menu.html">Lihat Menu</a>
      </div>
      <div id="cartForm">
        <label class="opt field"><span class="opt__label">Nama pemesan</span>
          <input type="text" id="custName" maxlength="40" placeholder="Nama Anda" autocomplete="name"></label>
        <fieldset class="opt"><legend>Makan di tempat atau bawa pulang</legend>
          <div class="chips">
            <label class="chip"><input type="radio" name="service" value="Makan di Tempat" checked><span>Makan di Tempat</span></label>
            <label class="chip"><input type="radio" name="service" value="Bawa Pulang"><span>Bawa Pulang</span></label>
          </div></fieldset>
        <fieldset class="opt"><legend>Pembayaran</legend>
          <div class="chips">
            <label class="chip"><input type="radio" name="pay" value="Tunai" checked><span>Tunai</span></label>
            <label class="chip"><input type="radio" name="pay" value="QRIS"><span>QRIS</span></label>
          </div></fieldset>
        <label class="opt field"><span class="opt__label">Catatan tambahan (opsional)</span>
          <input type="text" id="memo" maxlength="120" placeholder="Contoh: duduk di area luar"></label>
        <div class="order__total"><span>Total</span><strong id="cartTotal">Rp0</strong></div>
        <div class="cta__actions">
          <a class="btn btn--wa" id="cartWa" target="_blank" rel="noopener noreferrer"><span class="material-symbols-outlined">chat</span>Pesan via WhatsApp</a>
          <a class="btn btn--soft" data-grab target="_blank" rel="noopener noreferrer"><span class="material-symbols-outlined">delivery_dining</span>Buka GrabFood</a>
        </div>
        <button class="linkbtn" type="button" data-clear>Kosongkan keranjang</button>
      </div>
    </div>
  </div>`);
}

const formVal = (name) => $(`#cartModal input[name="${name}"]:checked`).value;

function cartMessage() {
  const name = $('#custName').value.trim(), memo = $('#memo').value.trim();
  const lines = ['Halo Sthana Coffee, saya ingin memesan:', ''];
  if (name) lines.push(`Nama: ${name}`, '');
  lines.push('*Pesanan*');
  cart.forEach((l, i) => {
    const m = itemOf(l.id);
    lines.push(`${i + 1}. ${m.name}${l.temp ? ` (${l.temp})` : ''} x${l.qty} = ${formatPrice(m.price * l.qty)}`);
    if (l.note) lines.push(`   Catatan: ${l.note}`);
  });
  lines.push('', `*Total: ${formatPrice(cartTotal())}* (${cartCount()} item)`, '',
    `Pesan untuk: ${formVal('service')}`, `Pembayaran: ${formVal('pay')}`);
  if (memo) lines.push(`Catatan tambahan: ${memo}`);
  lines.push('', 'Terima kasih.');
  return lines.join('\n');
}

function renderCart() {
  const n = cartCount(), empty = n === 0;
  $$('[data-cart-badge]').forEach((b) => { b.textContent = n; b.hidden = empty; });
  const bar = $('.cart-bar');
  bar.hidden = empty;
  $('#barText').textContent = `${n} item · ${formatPrice(cartTotal())}`;
  $('#cartEmpty').hidden = !empty;
  $('#cartForm').hidden = empty;
  $('#cartList').innerHTML = cart.map((l, i) => {
    const m = itemOf(l.id);
    const meta = [l.temp, l.note].filter(Boolean).map(esc).join(' · ');
    return `<li class="line">
      <img src="${m.image}" alt="" width="56" height="56">
      <div class="line__info"><strong>${m.name}</strong>${meta ? `<small>${meta}</small>` : ''}<span>${formatPrice(m.price * l.qty)}</span></div>
      <div class="qty qty--sm">
        <button type="button" data-dec="${i}" aria-label="Kurangi ${m.name}">&minus;</button>
        <output>${l.qty}</output>
        <button type="button" data-inc="${i}" aria-label="Tambah ${m.name}">+</button>
      </div></li>`;
  }).join('');
  $('#cartTotal').textContent = formatPrice(cartTotal());
  const wa = $('#cartWa');
  if (empty) wa.removeAttribute('href'); else wa.href = waLink(cartMessage());
  wa.classList.toggle('is-disabled', empty);
}

function changeQty(i, delta) {
  if (!cart[i]) return;
  cart[i].qty += delta;
  if (cart[i].qty <= 0) cart.splice(i, 1);
  saveCart(); renderCart();
}

const CUTE = ['Yummy! {n} masuk keranjang', 'Mantap! {n} sudah di keranjang', 'Siap! {n} menunggu di keranjang', 'Horee! {n} berhasil ditambahkan'];
function showToast(text) {
  const t = $('#toast');
  t.hidden = true; t.textContent = '';
  const ico = document.createElement('span');
  ico.className = 'material-symbols-outlined toast__ico'; ico.textContent = 'local_cafe';
  t.append(ico, text);
  void t.offsetWidth; t.hidden = false;
  clearTimeout(showToast.id);
  showToast.id = setTimeout(() => { t.hidden = true; }, 2400);
}

/* Animasi lucu: foto menu terbang ke keranjang, ikon bergoyang, percikan muncul */
function flyToCart(item, from) {
  const cartBtn = $('.navbar__cart');
  const badges = $$('[data-cart-badge]');
  const bump = () => {
    [cartBtn, ...badges].forEach((el) => el.classList.remove('bump'));
    void cartBtn.offsetWidth;
    [cartBtn, ...badges].forEach((el) => el.classList.add('bump'));
  };
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !cartBtn.animate) return bump();
  const to = cartBtn.getBoundingClientRect();
  const sx = from.left + from.width / 2 - 32, sy = from.top + from.height / 2 - 32;
  const dx = to.left + to.width / 2 - 32 - sx, dy = to.top + to.height / 2 - 32 - sy;
  const fly = document.createElement('div');
  fly.className = 'fly';
  fly.innerHTML = `<img src="${item.image}" alt="">`;
  fly.style.cssText = `left:${sx}px;top:${sy}px`;
  document.body.appendChild(fly);
  fly.animate([
    { transform: 'translate(0,0) scale(.6)', opacity: 0 },
    { transform: `translate(${dx * .15}px,${dy * .15 - 70}px) scale(1.2)`, opacity: 1, offset: .25 },
    { transform: `translate(${dx}px,${dy}px) scale(.25)`, opacity: .8 }
  ], { duration: 800, easing: 'cubic-bezier(.45,.05,.55,.95)' }).onfinish = () => {
    fly.remove(); bump();
    const cx = to.left + to.width / 2 - 4, cy = to.top + to.height / 2 - 4;
    for (let i = 0; i < 8; i++) {
      const sp = document.createElement('span');
      sp.className = 'spark'; sp.style.cssText = `left:${cx}px;top:${cy}px`;
      document.body.appendChild(sp);
      const a = (Math.PI * 2 * i) / 8, r = 28 + Math.random() * 14;
      sp.animate([{ transform: 'translate(0,0) scale(1)', opacity: 1 },
        { transform: `translate(${Math.cos(a) * r}px,${Math.sin(a) * r}px) scale(0)`, opacity: 0 }],
        { duration: 550, easing: 'ease-out' }).onfinish = () => sp.remove();
    }
  };
}

const openModal = (id) => { $(id).hidden = false; document.body.style.overflow = 'hidden'; };
const closeModals = () => { $$('.modal').forEach((m) => { m.hidden = true; }); document.body.style.overflow = ''; };

function updateItemModal() {
  const { item, qty } = orderState;
  $('#qtyValue').textContent = qty;
  $('#orderTotal').textContent = formatPrice(item.price * qty);
}
function openOrder(id) {
  const item = itemOf(id);
  if (!item) return;
  orderState.item = item; orderState.qty = 1;
  $$('#orderModal input[type="radio"]').forEach((r) => { r.checked = r.defaultChecked; });
  $('#itemNote').value = '';
  $('#orderTitle').textContent = item.name;
  $('#orderPrice').textContent = formatPrice(item.price);
  $('#optTemp').hidden = !isDrink(item);
  updateItemModal();
  openModal('#orderModal');
}
function addToCart() {
  const { item, qty } = orderState;
  const temp = isDrink(item) ? $('#orderModal input[name="temp"]:checked').value : '';
  const note = $('#itemNote').value.trim();
  const same = cart.find((l) => l.id === item.id && l.temp === temp && l.note === note);
  if (same) same.qty = Math.min(99, same.qty + qty); else cart.push({ id: item.id, qty, temp, note });
  const from = $('#addToCart').getBoundingClientRect();
  saveCart(); renderCart(); closeModals();
  flyToCart(item, from);
  showToast(CUTE[Math.floor(Math.random() * CUTE.length)].replace('{n}', item.name));
}

function setupEvents() {
  document.addEventListener('click', (e) => {
    const t = e.target;
    const order = t.closest('[data-order]');
    if (order) return openOrder(order.dataset.order);
    if (t.closest('[data-open-cart]')) { renderCart(); return openModal('#cartModal'); }
    if (t.closest('[data-open-more]')) return openModal('#moreModal');
    if (t.closest('[data-close]') || t.classList.contains('modal')) return closeModals();
    const inc = t.closest('[data-inc]'), dec = t.closest('[data-dec]');
    if (inc) changeQty(Number(inc.dataset.inc), 1);
    if (dec) changeQty(Number(dec.dataset.dec), -1);
    if (t.closest('[data-clear]') && confirm('Kosongkan semua pesanan di keranjang?')) { cart = []; saveCart(); renderCart(); }
    if (t.closest('#cartWa.is-disabled')) e.preventDefault();
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModals(); });
  $('#qtyMinus').addEventListener('click', () => { orderState.qty = Math.max(1, orderState.qty - 1); updateItemModal(); });
  $('#qtyPlus').addEventListener('click', () => { orderState.qty = Math.min(99, orderState.qty + 1); updateItemModal(); });
  $('#addToCart').addEventListener('click', addToCart);
  $('#cartModal').addEventListener('input', renderCart);
  $('#cartModal').addEventListener('change', renderCart);
  $('#menuSearch')?.addEventListener('input', (e) => { menuState.query = e.target.value; applyMenuFilter(); });
  $('#menuReset')?.addEventListener('click', resetMenuFilter);
  document.addEventListener('error', (e) => {
    if (e.target.tagName === 'IMG') e.target.classList.add('img-missing');
  }, true);
}

function fillBusinessInfo() {
  $$('[data-address]').forEach((el) => { el.textContent = businessInfo.address; });
  $$('[data-hours]').forEach((el) => { el.textContent = businessInfo.hours; });
  $$('[data-wa-label]').forEach((el) => { el.textContent = businessInfo.whatsappLabel; });
  const clock = (m) => `${String(Math.floor(m / 60)).padStart(2, '0')}.${String(m % 60).padStart(2, '0')} WIB`;
  const fill = (sel, val) => $$(sel).forEach((el) => { el.textContent = val; });
  fill('[data-kitchen-weekday]', clock(businessInfo.kitchenCloseWeekdayMin));
  fill('[data-kitchen-weekend]', clock(businessInfo.kitchenCloseWeekendMin));
  fill('[data-drink-close]', clock(businessInfo.drinkCloseMin));
  fill('[data-reserve-start]', clock(businessInfo.reserveStartMin));
  fill('[data-reserve-end]', clock(businessInfo.reserveEndMin));
  $$('[data-wa]').forEach((el) => { el.href = waLink(el.dataset.waText || ''); });
  $$('[data-grab]').forEach((el) => { el.href = businessInfo.grabfood; });
  const query = encodeURIComponent(businessInfo.address);
  if ($('#mapFrame')) {
    $('#mapFrame').src = `https://maps.google.com/maps?q=${query}&output=embed`;
    $('#mapDirections').href = `https://www.google.com/maps/dir/?api=1&destination=${query}`;
  }
}

/* 6. ANIMASI ---------------------------------------------- */
function setupAnimations() {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Preloader: hilang setelah halaman selesai dimuat
  const loader = $('#preloader');
  try { sessionStorage.setItem('sthana-seen', '1'); } catch (e) {}
  const hideLoader = () => loader && loader.classList.add('is-hidden');
  if (document.readyState === 'complete') setTimeout(hideLoader, 600);
  else window.addEventListener('load', () => setTimeout(hideLoader, 600));
  setTimeout(hideLoader, 3500);

  // Progress bar scroll + bayangan navbar
  const bar = document.createElement('div');
  bar.className = 'scroll-progress';
  document.body.appendChild(bar);
  const nav = $('.navbar');
  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const max = document.documentElement.scrollHeight - innerHeight;
      bar.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
      nav.classList.toggle('is-scrolled', scrollY > 10);
      ticking = false;
    });
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (reduce || !('IntersectionObserver' in window)) return;

  // Biji kopi melayang di hero
  const fx = document.createElement('div');
  fx.className = 'hero__fx';
  fx.setAttribute('aria-hidden', 'true');
  for (let i = 0; i < 14; i++) {
    const b = document.createElement('span');
    b.className = 'bean';
    b.style.cssText = `left:${Math.random() * 100}%;--s:${8 + Math.random() * 10}px;--x:${Math.random() * 80 - 40}px;--t:${7 + Math.random() * 7}s;--dl:${-Math.random() * 10}s`;
    fx.appendChild(b);
  }
  $('#hero')?.appendChild(fx);

  // Elemen muncul halus saat masuk layar (termasuk kartu hasil render/filter)
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      const el = en.target;
      io.unobserve(el);
      el.classList.add('is-inview');
      const d = parseFloat(el.style.getPropertyValue('--d')) || 0;
      setTimeout(() => el.classList.remove('reveal'), 1000 + d * 1000); // lepas agar efek hover tidak terganggu
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  const targets = '.section__title,.section__lead,.subtitle,.search,.pills,.card,.about p,.about .media,.category-title,.empty,.gallery__item';
  const scan = () => $$(targets).forEach((el) => {
    if (el.dataset.rv) return;
    el.dataset.rv = '1';
    const i = [...el.parentElement.children].indexOf(el);
    el.style.setProperty('--d', Math.min(i % 4, 3) * 0.1 + 's');
    el.classList.add('reveal');
    io.observe(el);
  });
  scan();
  ['#featuredGrid', '#menuList', '#galleryGrid'].forEach((sel) =>
    $(sel) && new MutationObserver(scan).observe($(sel), { childList: true }));
}

/* 6b. RESERVASI ------------------------------------------- */
function setupReserve() {
  const form = $('#reserveForm');
  if (!form) return;
  const dateEl = $('#rDate'), timeEl = $('#rTime'), err = $('#rErr');
  const pad = (n) => String(n).padStart(2, '0');
  const now = new Date();
  const today = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
  dateEl.min = today; dateEl.value = today;
  let people = 2;
  const fmtMin = (m) => `${pad(Math.floor(m / 60))}.${pad(m % 60)}`;
  const hint = $('#rHint');
  const updateHint = () => {
    if (!hint) return;
    const d = dateEl.value ? new Date(dateEl.value + 'T00:00:00') : null;
    const weekend = d ? (d.getDay() === 0 || d.getDay() === 6) : false;
    const kitchen = weekend ? businessInfo.kitchenCloseWeekendMin : businessInfo.kitchenCloseWeekdayMin;
    let text = d
      ? `Close order kitchen ${fmtMin(kitchen)} WIB (${weekend ? 'weekend' : 'weekday'}) · Close order minuman ${fmtMin(businessInfo.drinkCloseMin)} WIB.`
      : `Close order kitchen ${fmtMin(businessInfo.kitchenCloseWeekdayMin)} WIB (weekday) dan ${fmtMin(businessInfo.kitchenCloseWeekendMin)} WIB (weekend) · Close order minuman ${fmtMin(businessInfo.drinkCloseMin)} WIB.`;
    if (timeEl.value) {
      const [h, mm] = timeEl.value.split('.').map(Number);
      if (h * 60 + mm > kitchen) text += ' Pada jam ini kitchen sudah close order, hanya minuman yang tersedia.';
    }
    hint.textContent = text;
  };
  const fillTimes = () => {
    const isToday = dateEl.value === today;
    const nowMin = now.getHours() * 60 + now.getMinutes();
    const opts = [];
    let enabled = 0;
    for (let m = businessInfo.reserveStartMin; m <= businessInfo.reserveEndMin; m += 30) {
      const t = fmtMin(m);
      const past = isToday && m <= nowMin;          /* jam yang sudah lewat hari ini: tetap tampil, tidak bisa dipilih */
      if (!past) enabled++;
      opts.push(`<option value="${t}"${past ? ' disabled' : ''}>${t} WIB${past ? ' (sudah lewat)' : ''}</option>`);
    }
    if (!enabled) opts.unshift('<option value="" selected disabled>Hari ini sudah tutup, pilih tanggal lain</option>');
    timeEl.innerHTML = opts.join('');
    const first = Array.from(timeEl.options).find((o) => !o.disabled);
    timeEl.value = first ? first.value : '';
    updateHint();
  };
  fillTimes();
  dateEl.addEventListener('change', fillTimes);
  timeEl.addEventListener('change', updateHint);
  const setPeople = (n) => { people = Math.min(20, Math.max(1, n)); $('#rpValue').textContent = people; };
  $('#rpMinus').addEventListener('click', () => setPeople(people - 1));
  $('#rpPlus').addEventListener('click', () => setPeople(people + 1));
  const syncCart = () => {
    $('#rCartWrap').hidden = cartCount() === 0;
    $('#rCartText').textContent = `Sertakan pesanan di keranjang (${cartCount()} item, ${formatPrice(cartTotal())})`;
  };
  syncCart();
  document.addEventListener('click', () => setTimeout(syncCart, 50));
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = $('#rName').value.trim();
    const problem = !name ? 'Isi nama pemesan dulu.' : !dateEl.value ? 'Pilih tanggal kedatangan.' : !timeEl.value ? 'Pilih jam kedatangan.' : '';
    err.hidden = !problem; err.textContent = problem;
    $('#rName').setAttribute('aria-invalid', String(!name));
    if (problem) return;
    const d = new Date(dateEl.value + 'T00:00:00').toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    const note = $('#rNote').value.trim();
    const lines = ['Halo Sthana Coffee, saya ingin reservasi tempat:', '', '*Reservasi*', `Nama: ${name}`, `Tanggal: ${d}`, `Jam: ${timeEl.value} WIB`,
      `Jumlah orang: ${people}`, `Area: ${$('#reserveForm input[name="area"]:checked').value}`, `Keperluan: ${$('#rPurpose').value}`];
    if (note) lines.push(`Catatan: ${note}`);
    if (cartCount() > 0 && $('#rCart').checked) {
      lines.push('', '*Pesanan awal*');
      cart.forEach((l, i) => { const m = itemOf(l.id); lines.push(`${i + 1}. ${m.name}${l.temp ? ` (${l.temp})` : ''} x${l.qty}${l.note ? ` - ${l.note}` : ''}`); });
      lines.push(`*Total: ${formatPrice(cartTotal())}*`);
    }
    lines.push('', 'Mohon konfirmasi ketersediaan tempat. Terima kasih.');
    window.open(waLink(lines.join('\n')), '_blank', 'noopener');
    showToast('Reservasi siap dikirim lewat WhatsApp');
  });
}

/* 6c. GERAK TAMBAHAN -------------------------------------- */
function setupMotion() {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const root = document.documentElement;
  addEventListener('pageshow', () => { document.body.classList.remove('leaving'); root.classList.remove('trans-out'); });
  // Tiba dari halaman lain: logo Sthana tampil sebentar, lalu memudar
  if (root.classList.contains('trans-in')) {
    let finished = false;
    const finish = () => {
      if (finished) return; finished = true;
      setTimeout(() => { root.classList.add('trans-done'); setTimeout(() => root.classList.remove('trans-in', 'trans-done'), 1000); }, 500);
    };
    if (document.readyState === 'complete') finish(); else addEventListener('load', finish, { once: true });
    setTimeout(finish, 2500);
  }
  if (reduce) return;

  // Transisi halus saat pindah halaman
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href]');
    if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0 || a.target === '_blank') return;
    const url = new URL(a.href, location.href);
    if (url.origin !== location.origin || !/\.html$/.test(url.pathname) || url.pathname === location.pathname) return;
    e.preventDefault();
    try { sessionStorage.setItem('sthana-nav', '1'); } catch (err) { /* abaikan */ }
    root.classList.add('trans-out');   // logo Sthana + biji kopi berjatuhan menutup layar
    setTimeout(() => { location.href = a.href; }, 450);
  });

  // Kartu menu miring mengikuti kursor
  if (matchMedia('(hover: hover)').matches) {
    document.addEventListener('pointermove', (e) => {
      const c = e.target.closest && e.target.closest('.product');
      $$('.product.is-tilt').forEach((p) => { if (p !== c) { p.classList.remove('is-tilt'); p.style.transform = ''; } });
      if (!c) return;
      const r = c.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      c.classList.add('is-tilt');
      c.style.transform = `perspective(800px) rotateX(${(-y * 7).toFixed(2)}deg) rotateY(${(x * 7).toFixed(2)}deg) translateY(-4px)`;
    });
  }

  // Khusus Beranda: judul muncul per kata, cangkir beruap, pita menu berjalan, parallax
  const hero = $('#hero');
  if (!hero) return;
  const h1 = $('h1', hero);
  h1.innerHTML = h1.textContent.trim().split(/\s+/).map((w, i) => `<span class="w" style="--i:${i}">${w}</span>`).join(' ');
  hero.insertAdjacentHTML('beforeend', '<div class="hero__cup" aria-hidden="true"><span class="material-symbols-outlined">coffee</span><i></i><i></i><i></i></div>');
  const strip = menuData.map((m) => `<span class="marquee__item">${m.name}<span class="material-symbols-outlined">local_cafe</span></span>`).join('');
  hero.insertAdjacentHTML('afterend', `<div class="marquee" aria-hidden="true"><div class="marquee__track">${strip}${strip}</div></div>`);
  const content = $('.hero__content', hero);
  let raf = 0;
  addEventListener('scroll', () => {
    if (raf) return;
    raf = requestAnimationFrame(() => { raf = 0; if (scrollY < innerHeight) content.style.translate = `0 ${scrollY * .18}px`; });
  }, { passive: true });
}

/* 7. INISIALISASI ----------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  injectUI();
  fillBusinessInfo();
  renderFeatured();
  if ($('#menuFilters')) {
    renderPills($('#menuFilters'), categories, (key) => { menuState.category = key; applyMenuFilter(); });
    renderMenu(menuData);
  }
  if ($('#galleryGrid')) renderGallery();
  setupEvents();
  renderCart();
  setupAnimations();
  setupReserve();
  setupMotion();
});
