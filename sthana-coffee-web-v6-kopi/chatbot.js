/* ==========================================================
   Sthana Coffee - Chatbot FAQ "Barista Sthana" (chatbot.js)
   - Tampil di semua halaman: tombol logo barista beranimasi di pojok kanan bawah.
   - Jawaban diambil dari FAQ (faq.html) + data di businessInfo (script.js).
   - Tanpa server: pertanyaan dicocokkan dengan kata kunci.
   - Riwayat chat disimpan di sessionStorage agar tetap ada saat pindah halaman.
   ========================================================== */
(function () {
  'use strict';
  if (window.__sthanaBot) return;
  window.__sthanaBot = true;

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Data bisnis (ikut businessInfo dari script.js bila ada) ---------- */
  var base = (typeof businessInfo !== 'undefined' && businessInfo) ? businessInfo : {};
  var info = {
    address: base.address || 'Jl. Setiaki No. 27, Kelurahan Oro-oro Ombo, Kecamatan Kartoharjo, Kota Madiun, Jawa Timur 63119',
    whatsapp: base.whatsapp || '6289633504040',
    whatsappLabel: base.whatsappLabel || '089633504040',
    grabfood: base.grabfood || '',
    hours: base.hours || '08.00 - 00.00 WIB',
    reserveStartMin: base.reserveStartMin || 8 * 60,       /* reservasi mulai 08.00 */
    reserveEndMin: base.reserveEndMin || 23 * 60 + 30,
    kitchenCloseWeekdayMin: base.kitchenCloseWeekdayMin || 22 * 60 + 30,
    kitchenCloseWeekendMin: base.kitchenCloseWeekendMin || 23 * 60 + 30,
    drinkCloseMin: base.drinkCloseMin || 23 * 60 + 30
  };
  var OPEN_MIN = 8 * 60;                                      /* jam buka 08.00 (tutup 00.00) */

  function pad(n) { return String(n).padStart(2, '0'); }
  function fmt(min) { return pad(Math.floor(min / 60)) + '.' + pad(min % 60); }
  function waUrl(text) { return 'https://wa.me/' + info.whatsapp + '?text=' + encodeURIComponent(text); }
  function mapsUrl() { return 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(info.address); }

  /* Waktu sekarang di Madiun (WIB), tidak bergantung zona waktu perangkat */
  function wibMinutes() {
    try {
      var parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Jakarta', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(new Date());
      var h = 0, m = 0;
      parts.forEach(function (p) { if (p.type === 'hour') h = +p.value; if (p.type === 'minute') m = +p.value; });
      return h * 60 + m;
    } catch (e) { var d = new Date(); return d.getHours() * 60 + d.getMinutes(); }
  }
  function isOpenNow() { return wibMinutes() >= OPEN_MIN; }

  /* ---------- Penyimpanan sesi ---------- */
  var KEY = 'sthana-bot';
  function load() { try { return JSON.parse(sessionStorage.getItem(KEY)) || null; } catch (e) { return null; } }
  var state = load() || { open: false, teased: false, log: [] };
  if (!Array.isArray(state.log)) state.log = [];
  function save() { try { sessionStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* abaikan */ } }

  /* ---------- Logo barista (SVG beranimasi) ---------- */
  function avatarSVG() {
    var INK = '#241b17';
    return '<svg class="sb-avatar" viewBox="0 0 100 100" aria-hidden="true" focusable="false">' +
      '<rect width="100" height="100" fill="#d2b48c"/>' +
      '<g class="sb-bob" stroke="' + INK + '" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round">' +
        '<circle cx="50" cy="16" r="9" fill="#2a1c16"/>' +
        '<path d="M8 104 Q8 75 36 69 L64 69 Q92 75 92 104 Z" fill="#efe3d0"/>' +
        '<path d="M33 72 L67 72 L72 104 L28 104 Z" fill="#6f4f36"/>' +
        '<path d="M39 70 L37 84 M61 70 L63 84" fill="none" stroke-width="1.8"/>' +
        '<rect x="42" y="85" width="16" height="9" rx="2" fill="#8f6849"/>' +
        '<rect x="44" y="58" width="12" height="15" rx="5" fill="#f0a58f"/>' +
        '<ellipse cx="29.5" cy="46" rx="4" ry="5.5" fill="#f0a58f"/><ellipse cx="70.5" cy="46" rx="4" ry="5.5" fill="#f0a58f"/>' +
        '<ellipse cx="50" cy="44" rx="21" ry="23" fill="#f0a58f"/>' +
        '<path d="M28 44 Q24 18 50 18 Q76 18 72 44 Q66 30 52 31 Q38 34 33 29 Q29 34 28 44 Z" fill="#2a1c16"/>' +
        '<path d="M30 31 Q50 21 70 31" fill="none" stroke="#8f6849" stroke-width="4.5"/>' +
        '<ellipse class="sb-eye" cx="42" cy="46" rx="2.2" ry="2.9" fill="' + INK + '" stroke="none"/>' +
        '<ellipse class="sb-eye" cx="58" cy="46" rx="2.2" ry="2.9" fill="' + INK + '" stroke="none"/>' +
        '<path d="M37 40 Q42 37 47 40 M53 40 Q58 37 63 40" fill="none" stroke-width="1.8"/>' +
        '<path d="M43 56 Q50 62 57 56" fill="none" stroke-width="2.2"/>' +
        '<ellipse cx="36" cy="53" rx="4" ry="2.4" fill="#ff7f6e" opacity=".4" stroke="none"/><ellipse cx="64" cy="53" rx="4" ry="2.4" fill="#ff7f6e" opacity=".4" stroke="none"/>' +
        '<g class="sb-arm">' +
          '<path d="M70 82 L82 67" stroke="' + INK + '" stroke-width="13" fill="none"/>' +
          '<path d="M70 82 L82 67" stroke="#efe3d0" stroke-width="8.5" fill="none"/>' +
          '<path d="M80 50 L96 50 L94 65 Q88 68 82 65 Z" fill="#fff"/>' +
          '<path d="M81 56 L95 56" stroke="#8f6849" stroke-width="3" fill="none"/>' +
          '<circle cx="83" cy="65" r="4.6" fill="#f0a58f"/>' +
          '<path class="sb-steam" d="M86 46 Q83 41 87 36" fill="none" stroke="#fffaf3" stroke-width="2.2"/>' +
          '<path class="sb-steam sb-steam--2" d="M92 46 Q89 41 93 36" fill="none" stroke="#fffaf3" stroke-width="2.2"/>' +
        '</g>' +
      '</g></svg>';
  }

  /* ---------- Basis jawaban FAQ ---------- */
  /* Sintaks tautan di teks: [label](alamat) */
  var INTENTS = [
    { key: 'jam', label: 'Jam buka', q: 'Jam berapa Sthana Coffee buka?',
      kw: ['jam buka', 'buka jam', 'jam operasional', 'jam tutup', 'tutup jam', 'buka sampai', 'sampai jam', 'jam berapa', 'operasional', 'buka', 'tutup', 'open'],
      next: ['reservasi_jam', 'reservasi', 'lokasi', 'antar'],
      make: function () {
        return { t: 'Kami buka pukul ' + info.hours + '.\n' + (isOpenNow() ? 'Saat ini kami sedang buka. Yuk mampir ☕' : 'Saat ini kami belum buka. Kami buka lagi pukul ' + fmt(OPEN_MIN) + ' WIB.') };
      } },
    { key: 'reservasi_jam', label: 'Jam reservasi', q: 'Reservasi mulai jam berapa?',
      kw: ['jam reservasi', 'reservasi jam', 'mulai reservasi', 'reservasi mulai', 'reservasi dari jam', 'jam booking', 'booking jam', 'jam berapa reservasi', 'reservasi buka', 'reservasi dimulai'],
      next: ['reservasi', 'jam', 'lokasi', 'kontak'],
      make: function () {
        return { t: 'Reservasi bisa dipilih mulai pukul ' + fmt(info.reserveStartMin) + ' WIB, dengan pilihan setiap 30 menit sampai pukul ' + fmt(info.reserveEndMin) + ' WIB.\nIsi tanggal dan jamnya di halaman [Reservasi](reservasi.html).',
          acts: [{ label: 'Buka halaman Reservasi', href: 'reservasi.html', icon: 'event_seat' }] };
      } },
    { key: 'closeorder', label: 'Close order', q: 'Jam berapa close order kitchen dan minuman?',
      kw: ['close order', 'closeorder', 'last order', 'order terakhir', 'pesan terakhir', 'terakhir pesan', 'closing', 'kitchen', 'dapur'],
      next: ['jam', 'reservasi_jam', 'reservasi', 'pesan'],
      make: function () {
        return { t: 'Close order kitchen pukul ' + fmt(info.kitchenCloseWeekdayMin) + ' WIB pada weekday (Senin-Jumat) dan ' + fmt(info.kitchenCloseWeekendMin) + ' WIB pada weekend (Sabtu-Minggu).\nClose order minuman pukul ' + fmt(info.drinkCloseMin) + ' WIB setiap hari.' };
      } },
    { key: 'reservasi', label: 'Reservasi tempat', q: 'Apakah bisa reservasi tempat?',
      kw: ['reservasi tempat', 'reservasi', 'reserve', 'booking', 'book', 'pesan tempat', 'pesan meja', 'booking meja', 'booking tempat'],
      next: ['reservasi_jam', 'jam', 'lokasi', 'buatevent'],
      make: function () {
        return { t: 'Bisa. Isi formulir di halaman [Reservasi](reservasi.html), kirim lewat WhatsApp, lalu tunggu konfirmasi dari tim kami.\nJam reservasi mulai pukul ' + fmt(info.reserveStartMin) + ' WIB. Untuk rombongan lebih dari 20 orang, hubungi kami langsung lewat WhatsApp.',
          acts: [{ label: 'Reservasi sekarang', href: 'reservasi.html', icon: 'event_seat' },
                 { label: 'Rombongan? Chat WhatsApp', href: waUrl('Halo Sthana Coffee, saya ingin reservasi untuk rombongan.'), ext: true, icon: 'chat' }] };
      } },
    { key: 'pesan', label: 'Cara memesan', q: 'Bagaimana cara memesan lewat website?',
      kw: ['cara pesan', 'cara memesan', 'memesan', 'pesan lewat website', 'pesan online', 'lewat website', 'via website', 'pesan makanan', 'pesan minum', 'pesan kopi', 'mau pesan', 'ingin memesan', 'keranjang', 'order', 'checkout', 'lebih dari satu', 'banyak menu', 'sekaligus', 'beberapa menu'],
      next: ['bayar', 'antar', 'menu', 'promo'],
      make: function () {
        return { t: 'Buka halaman [Menu](menu.html), tekan Tambah pada menu yang Anda inginkan, lalu buka keranjang dan kirim pesanan lewat WhatsApp.\nBisa memesan lebih dari satu menu sekaligus. Semua menu di keranjang terkirim dalam satu pesan WhatsApp, lengkap dengan jumlah dan total harganya.',
          acts: [{ label: 'Lihat Menu', href: 'menu.html', icon: 'local_cafe' }] };
      } },
    { key: 'bayar', label: 'Pembayaran', q: 'Pembayaran apa saja yang tersedia?',
      kw: ['bayar', 'pembayaran', 'qris', 'tunai', 'cash', 'debit', 'kartu', 'transfer', 'ewallet', 'e wallet', 'gopay', 'ovo', 'dana'],
      next: ['pesan', 'antar', 'promo', 'jam'],
      make: function () { return { t: 'Anda bisa membayar dengan tunai atau QRIS.' }; } },
    { key: 'antar', label: 'Pesan antar', q: 'Apakah bisa pesan antar?',
      kw: ['pesan antar', 'antar', 'diantar', 'delivery', 'grab', 'grabfood', 'gofood', 'go food', 'shopeefood', 'shopee food', 'kirim', 'dikirim', 'ojol'],
      next: ['pesan', 'bayar', 'menu', 'kontak'],
      make: function () {
        var acts = info.grabfood ? [{ label: 'Pesan lewat GrabFood', href: info.grabfood, ext: true, icon: 'delivery_dining' }] : [];
        return { t: 'Bisa lewat GrabFood. Tekan tombol Pesan lewat GrabFood di website ini.', acts: acts };
      } },
    { key: 'lokasi', label: 'Lokasi', q: 'Di mana lokasi Sthana Coffee?',
      kw: ['lokasi', 'alamat', 'dimana', 'di mana', 'maps', 'google maps', 'peta', 'arah', 'rute', 'letak', 'petunjuk', 'madiun'],
      next: ['jam', 'reservasi', 'antar', 'kontak'],
      make: function () {
        return { t: info.address + '\nLihat petunjuk arahnya di halaman [Lokasi](lokasi.html).',
          acts: [{ label: 'Buka di Google Maps', href: mapsUrl(), ext: true, icon: 'near_me' }] };
      } },
    { key: 'promo', label: 'Promo', q: 'Apakah ada promo?',
      kw: ['promo', 'diskon', 'potongan', 'murah', 'hemat', 'voucher', 'makan siang'],
      next: ['pesan', 'menu', 'bayar', 'event'],
      make: function () {
        return { t: 'Ada. Promo makan siang dengan diskon hingga 25%. Detailnya ada di halaman [Menu](menu.html#promo).',
          acts: [{ label: 'Lihat Promo', href: 'menu.html#promo', icon: 'sell' }] };
      } },
    { key: 'event', label: 'Event', q: 'Apakah Sthana Coffee sering mengadakan event?',
      kw: ['event', 'acara', 'musik', 'live music', 'stand up', 'komedi', 'manual brew', 'open mic', 'kompetisi'],
      next: ['buatevent', 'reservasi', 'promo', 'jam'],
      make: function () {
        return { t: 'Ya. Kami pernah menggelar musik, stand up comedy, dan kompetisi manual brew. Lihat di halaman [Event](event.html).',
          acts: [{ label: 'Lihat Event', href: 'event.html', icon: 'celebration' }] };
      } },
    { key: 'buatevent', label: 'Buat event', q: 'Bagaimana jika saya ingin membuat event di Sthana Coffee?',
      kw: ['buat event', 'bikin event', 'membuat event', 'mengadakan event', 'adakan event', 'event sendiri', 'event di sthana', 'sewa tempat', 'kerja sama', 'kerjasama', 'acara pribadi', 'private event'],
      next: ['reservasi', 'event', 'kontak', 'lokasi'],
      make: function () {
        return { t: 'Silakan hubungi kami lewat WhatsApp untuk membahas rencana event Anda.',
          acts: [{ label: 'Bahas event via WhatsApp', href: waUrl('Halo Sthana Coffee, saya ingin membuat event di Sthana Coffee.'), ext: true, icon: 'chat' }] };
      } },
    { key: 'luar', label: 'Bawa makanan luar', q: 'Apakah boleh membawa makanan dari luar?',
      kw: ['makanan luar', 'makanan dari luar', 'minuman luar', 'bawa makanan', 'bawa minuman', 'bawa makan', 'bawa sendiri', 'membawa makanan', 'membawa minuman', 'boleh bawa', 'dari luar', 'makanan sendiri'],
      next: ['menu', 'pesan', 'antar', 'jam'],
      make: function () {
        return { t: 'Mohon maaf, tidak boleh. Silakan nikmati makanan dan minuman dari menu Sthana Coffee.',
          acts: [{ label: 'Lihat Menu', href: 'menu.html', icon: 'local_cafe' }] };
      } },
    { key: 'kontak', label: 'Hubungi kami', q: 'Bagaimana cara menghubungi Sthana Coffee?', hideChip: true,
      kw: ['whatsapp', 'wa', 'hubungi', 'kontak', 'telepon', 'telpon', 'nomor', 'admin', 'cs', 'customer service', 'hp'],
      next: ['reservasi', 'antar', 'buatevent', 'lokasi'],
      make: function () {
        return { t: 'Tanyakan langsung kepada kami lewat WhatsApp di ' + info.whatsappLabel + '.',
          acts: [{ label: 'Tanya via WhatsApp', href: waUrl('Halo Sthana Coffee, saya ingin bertanya.'), ext: true, icon: 'chat' }] };
      } },
    { key: 'menu', label: 'Menu', q: 'Ada menu apa saja?', hideChip: true,
      kw: ['menu', 'harga', 'kopi apa', 'minuman apa', 'makanan apa', 'rekomendasi', 'best seller', 'terlaris', 'daftar menu', 'latte', 'non kopi', 'snack', 'camilan'],
      next: ['pesan', 'promo', 'bayar', 'luar'],
      make: function () {
        return { t: 'Daftar menu lengkap beserta harganya ada di halaman [Menu](menu.html): kopi, non-kopi, makanan berat, dan camilan.',
          acts: [{ label: 'Lihat Menu', href: 'menu.html', icon: 'local_cafe' }] };
      } },
    { key: 'sapa', hidden: true,
      kw: ['halo', 'hai', 'hi', 'hello', 'hei', 'selamat pagi', 'selamat siang', 'selamat sore', 'selamat malam', 'permisi', 'assalamualaikum'],
      make: function () { return { t: 'Halo! ☕ Ada yang ingin Anda tanyakan tentang Sthana Coffee? Pilih topik di bawah atau ketik pertanyaan Anda.' }; } },
    { key: 'makasih', hidden: true,
      kw: ['terima kasih', 'terimakasih', 'makasih', 'thanks', 'thank you', 'trims'],
      next: ['reservasi', 'pesan', 'promo', 'lokasi'],
      make: function () { return { t: 'Sama-sama! Kalau ada yang ingin ditanyakan lagi, saya siap bantu ☕' }; } },
    { key: 'greet', hidden: true,
      make: function () { return { t: 'Halo, selamat datang di Sthana Coffee! ☕\nSaya Barista Sthana. Mau tanya soal apa? Pilih topik di bawah atau ketik pertanyaan Anda.' }; } },
    { key: 'fallback', hidden: true,
      make: function () {
        return { t: 'Maaf, saya belum menemukan jawabannya. Coba pilih salah satu topik di bawah, atau tanyakan langsung ke tim kami lewat WhatsApp.',
          acts: [{ label: 'Tanya via WhatsApp', href: waUrl('Halo Sthana Coffee, saya ingin bertanya.'), ext: true, icon: 'chat' }] };
      } }
  ];
  var BY_KEY = {};
  INTENTS.forEach(function (it) { BY_KEY[it.key] = it; });
  var TOPICS = INTENTS.filter(function (it) { return !it.hidden && !it.hideChip; }).map(function (it) { return it.key; });

  /* ---------- Pencocokan pertanyaan ---------- */
  function normalize(s) {
    return ' ' + String(s).toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim() + ' ';
  }
  function match(raw) {
    var text = normalize(raw);
    var tokens = text.trim().split(' ');
    var best = 'fallback', bestScore = 0;
    var scores = {};
    INTENTS.forEach(function (it) {
      if (!it.kw) return;
      var s = 0;
      it.kw.forEach(function (k) {
        if (k.indexOf(' ') > -1) { if (text.indexOf(' ' + k) > -1) s += 3 + k.split(' ').length; }
        else if (k.length <= 3) { if (tokens.indexOf(k) > -1) s += 1.5; }
        else if (text.indexOf(' ' + k) > -1) s += 1.5;
      });
      scores[it.key] = s;
    });
    /* "reservasi/booking" + kata waktu -> pertanyaan jam reservasi */
    if (/ (reserv|booking|book )/.test(text) && / (jam|pukul|mulai|dimulai) /.test(text)) scores.reservasi_jam = (scores.reservasi_jam || 0) + 4;
    /* kitchen / dapur / close order -> pertanyaan close order */
    if (/ (kitchen|dapur|close order|closeorder|last order|order terakhir) /.test(text) || / (kitchen|dapur) /.test(text)) { var top = 0; for (var k in scores) top = Math.max(top, scores[k]); scores.closeorder = top + 1; }
    INTENTS.forEach(function (it) {
      if (scores[it.key] > bestScore) { bestScore = scores[it.key]; best = it.key; }
    });
    return bestScore >= 1.5 ? best : 'fallback';
  }

  /* ---------- Membangun elemen ---------- */
  var launch = document.createElement('div');
  launch.className = 'sbot-launch';
  launch.id = 'sthBotLaunch';
  launch.innerHTML =
    '<div class="sbot-teaser" id="sthBotTeaser" hidden>' +
      '<button type="button" class="sbot-teaser__text" id="sthBotTeaserOpen">Halo! Ada yang mau ditanyakan? ☕</button>' +
      '<button type="button" class="sbot-teaser__x" id="sthBotTeaserX" aria-label="Tutup sapaan">&times;</button>' +
    '</div>' +
    '<div class="sbot-fabwrap">' +
      '<button type="button" class="sbot-fab" id="sthBotFab" aria-label="Buka chat FAQ dengan Barista Sthana" aria-haspopup="dialog" aria-expanded="false" aria-controls="sthBot">' + avatarSVG() + '</button>' +
      '<span class="sbot-tag" aria-hidden="true">FAQ</span>' +
    '</div>';

  var panel = document.createElement('section');
  panel.className = 'sbot';
  panel.id = 'sthBot';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-label', 'Chat FAQ Barista Sthana');
  panel.hidden = true;
  panel.innerHTML =
    '<header class="sbot__head">' +
      '<span class="sbot__hav">' + avatarSVG() + '</span>' +
      '<div class="sbot__who"><strong>Barista Sthana</strong><span class="sbot__status"><i class="sbot__dot" id="sthBotDot"></i><span id="sthBotStatus"></span></span></div>' +
      '<button type="button" class="sbot__ic" id="sthBotReset" aria-label="Mulai percakapan baru" title="Mulai ulang"><span class="material-symbols-outlined">restart_alt</span></button>' +
      '<button type="button" class="sbot__ic" id="sthBotClose" aria-label="Tutup chat"><span class="material-symbols-outlined">close</span></button>' +
    '</header>' +
    '<div class="sbot__log" id="sthBotLog" role="log" aria-live="polite" aria-relevant="additions"></div>' +
    '<form class="sbot__form" id="sthBotForm" autocomplete="off">' +
      '<input id="sthBotInput" type="text" maxlength="120" placeholder="Ketik pertanyaan Anda..." aria-label="Ketik pertanyaan Anda" enterkeyhint="send">' +
      '<button type="submit" class="sbot__send" aria-label="Kirim pertanyaan"><span class="material-symbols-outlined">send</span></button>' +
    '</form>' +
    '<p class="sbot__foot">Jawaban otomatis dari FAQ. Butuh bantuan lain? <a href="' + waUrl('Halo Sthana Coffee, saya ingin bertanya.') + '" target="_blank" rel="noopener noreferrer">Chat WhatsApp</a></p>';

  document.body.appendChild(launch);
  document.body.appendChild(panel);

  var fab = document.getElementById('sthBotFab');
  var teaser = document.getElementById('sthBotTeaser');
  var log = document.getElementById('sthBotLog');
  var form = document.getElementById('sthBotForm');
  var input = document.getElementById('sthBotInput');
  var statusEl = document.getElementById('sthBotStatus');
  var dotEl = document.getElementById('sthBotDot');

  /* ---------- Tampilan pesan ---------- */
  function scrollEnd() { log.scrollTop = log.scrollHeight; }

  function richText(el, str) {
    String(str).split('\n').forEach(function (line) {
      var p = document.createElement('p');
      var re = /\[([^\]]+)\]\(([^)]+)\)/g, last = 0, m;
      while ((m = re.exec(line))) {
        if (m.index > last) p.appendChild(document.createTextNode(line.slice(last, m.index)));
        var a = document.createElement('a');
        a.href = m[2]; a.textContent = m[1];
        if (/^https?:/.test(m[2])) { a.target = '_blank'; a.rel = 'noopener noreferrer'; }
        p.appendChild(a);
        last = re.lastIndex;
      }
      if (last < line.length) p.appendChild(document.createTextNode(line.slice(last)));
      el.appendChild(p);
    });
  }

  function clearChips() {
    var old = log.querySelectorAll('.sbot__chips');
    for (var i = 0; i < old.length; i++) old[i].remove();
  }

  function addUser(text) {
    var row = document.createElement('div');
    row.className = 'sbot__row sbot__row--user';
    var msg = document.createElement('div');
    msg.className = 'sbot__msg';
    msg.textContent = text;
    row.appendChild(msg);
    log.appendChild(row);
    scrollEnd();
  }

  function addBot(key) {
    var it = BY_KEY[key] || BY_KEY.fallback;
    var ans = it.make();
    var row = document.createElement('div');
    row.className = 'sbot__row sbot__row--bot';
    var av = document.createElement('span');
    av.className = 'sbot__av';
    av.innerHTML = avatarSVG();
    var msg = document.createElement('div');
    msg.className = 'sbot__msg';
    richText(msg, ans.t);
    if (ans.acts && ans.acts.length) {
      var wrap = document.createElement('div');
      wrap.className = 'sbot__acts';
      ans.acts.forEach(function (a) {
        var l = document.createElement('a');
        l.className = 'sbot__act';
        l.href = a.href;
        if (a.ext) { l.target = '_blank'; l.rel = 'noopener noreferrer'; }
        var ic = document.createElement('span');
        ic.className = 'material-symbols-outlined';
        ic.textContent = a.icon || 'arrow_forward';
        l.appendChild(ic);
        l.appendChild(document.createTextNode(a.label));
        wrap.appendChild(l);
      });
      msg.appendChild(wrap);
    }
    row.appendChild(av);
    row.appendChild(msg);
    log.appendChild(row);
    scrollEnd();
  }

  function addChips(keys) {
    clearChips();
    var wrap = document.createElement('div');
    wrap.className = 'sbot__chips';
    keys.forEach(function (k) {
      var it = BY_KEY[k];
      if (!it || !it.label) return;
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'sbot__chip';
      b.textContent = it.label;
      b.addEventListener('click', function () { ask(it.q, it.key); });
      wrap.appendChild(b);
    });
    if (keys.length < TOPICS.length) {
      var more = document.createElement('button');
      more.type = 'button';
      more.className = 'sbot__chip sbot__chip--more';
      more.textContent = 'Topik lain';
      more.addEventListener('click', function () { addChips(TOPICS); });
      wrap.appendChild(more);
    }
    log.appendChild(wrap);
    scrollEnd();
  }

  function chipsAfter(key) {
    var it = BY_KEY[key];
    return (it && it.next) ? it.next : TOPICS;
  }

  var busy = false;
  function typingRow() {
    var row = document.createElement('div');
    row.className = 'sbot__row sbot__row--bot sbot__row--typing';
    row.innerHTML = '<span class="sbot__av">' + avatarSVG() + '</span><div class="sbot__msg sbot__dots" aria-label="Barista sedang mengetik"><i></i><i></i><i></i></div>';
    log.appendChild(row);
    scrollEnd();
    return row;
  }

  function reply(key) {
    busy = true;
    clearChips();
    var t = typingRow();
    setTimeout(function () {
      t.remove();
      addBot(key);
      state.log.push({ r: 'b', k: key });
      if (state.log.length > 30) state.log = state.log.slice(-30);
      save();
      addChips(chipsAfter(key));
      busy = false;
    }, reduceMotion ? 120 : 650 + Math.random() * 350);
  }

  function ask(text, forcedKey) {
    text = String(text || '').trim();
    if (!text || busy) return;
    addUser(text);
    state.log.push({ r: 'u', t: text });
    save();
    reply(forcedKey || match(text));
  }

  function greet() {
    state.log = [];
    reply('greet');
  }

  function replay() {
    var lastKey = null;
    state.log.forEach(function (e) {
      if (e.r === 'u') addUser(e.t);
      else if (BY_KEY[e.k]) { addBot(e.k); lastKey = e.k; }
    });
    if (lastKey) addChips(chipsAfter(lastKey));
  }

  /* ---------- Buka / tutup ---------- */
  function updateStatus() {
    var open = isOpenNow();
    dotEl.className = 'sbot__dot' + (open ? ' is-on' : '');
    statusEl.textContent = open ? 'Buka · ' + info.hours : 'Belum buka · buka ' + fmt(OPEN_MIN) + ' WIB';
  }

  function hideTeaser() { teaser.hidden = true; }

  function openBot(focusInput) {
    panel.hidden = false;
    requestAnimationFrame(function () { panel.classList.add('is-open'); });
    launch.classList.add('is-hidden');
    fab.setAttribute('aria-expanded', 'true');
    hideTeaser();
    updateStatus();
    state.open = true; state.teased = true; save();
    if (!state.log.length && !log.children.length) greet();
    scrollEnd();
    if (focusInput) setTimeout(function () { input.focus({ preventScroll: true }); }, 280);
  }

  function closeBot(returnFocus) {
    panel.classList.remove('is-open');
    launch.classList.remove('is-hidden');
    fab.setAttribute('aria-expanded', 'false');
    state.open = false; save();
    setTimeout(function () { if (!state.open) panel.hidden = true; }, 240);
    if (returnFocus) fab.focus({ preventScroll: true });
  }

  fab.addEventListener('click', function () { openBot(true); });
  document.getElementById('sthBotClose').addEventListener('click', function () { closeBot(true); });
  document.getElementById('sthBotReset').addEventListener('click', function () {
    if (busy) return;
    log.innerHTML = '';
    greet();
  });
  document.getElementById('sthBotTeaserOpen').addEventListener('click', function () { openBot(true); });
  document.getElementById('sthBotTeaserX').addEventListener('click', hideTeaser);
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var v = input.value;
    input.value = '';
    ask(v);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && state.open) closeBot(true);
  });
  /* Tombol di halaman mana pun dengan atribut data-open-bot akan membuka chat */
  document.addEventListener('click', function (e) {
    var t = e.target.closest && e.target.closest('[data-open-bot]');
    if (t) { e.preventDefault(); openBot(true); }
  });

  /* ---------- Mulai ---------- */
  if (state.log.length) replay();
  if (state.open) openBot(false);
  else if (!state.teased) {
    setTimeout(function () {
      if (state.open || state.teased) return;
      teaser.hidden = false;
      state.teased = true; save();
      setTimeout(hideTeaser, 9000);
    }, 3500);
  }

  window.sthanaBot = { open: function () { openBot(true); }, close: function () { closeBot(false); } };
})();
