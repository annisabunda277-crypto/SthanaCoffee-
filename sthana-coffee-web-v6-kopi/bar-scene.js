/* ==========================================================
   Sthana Coffee - Suasana Bar Interaktif (bar-scene.js)
   - Foto bar diam; karakter kartun muncul di tiap titik, lalu teks tulisan
     tangan "tertulis" dan panah tergambar.
   - Karakter BERJALAN / BERGESER KE SAMPING mengikuti kursor (di HP: ikut jari),
     menoleh ke arah jalan, lalu balik ke tempat semula saat kursor pergi.
   - Sebelum disentuh, karakter berpatroli sendiri ke kiri-kanan.
   - Klik / ketuk: karakter melompat kecil + emoji beterbangan.
   - Tiap karakter punya gelembung ucapan yang berganti-ganti.
   ========================================================== */
(function () {
  'use strict';

  var stage = document.getElementById('barStage');
  var scene = document.getElementById('barScene');
  if (!stage || !scene) return;

  var arrowsSvg = scene.querySelector('.bar-scene__arrows');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var NS = 'http://www.w3.org/2000/svg';

  /* Ukuran foto asli (semua koordinat di bawah memakai piksel foto ini) */
  var IMG_W = 1280, IMG_H = 960;

  /* ---------- Data titik animasi (sesuai foto bar) ----------
     x, y   : titik tengah-bawah karakter pada foto
     w      : lebar karakter (piksel foto)
     label  : teks, lx/ly = posisi kiri-atas teks
     arrow  : [x1,y1, cx,cy, x2,y2] kurva panah (piksel foto)           */
  var SPOTS = [
    { id: 'barista', type: 'barista', x: 845, y: 390, w: 265, range: 150, follow: 1,
      label: 'Kopi diseduh segar', lx: 470, ly: 128,
      arrow: [690, 150, 705, 225, 622, 276],
      bdx: 40, bby: 126,
      say: ['Halo! Mau kopi apa hari ini?', 'Satu latte segera datang!', 'Silakan duduk, ya!'],
      fx: ['\u2615', '\u2728', '\uD83D\uDC9B'] },
    { id: 'rider', type: 'rider', x: 650, y: 940, w: 215, range: 280, follow: 1,
      label: 'Pesan antar via GrabFood', lx: 500, ly: 470, right: false,
      arrow: [770, 492, 790, 556, 712, 596],
      bdx: 150, bby: 450,
      say: ['Pesanan GrabFood meluncur!', 'Antar cepat sampai rumah!', 'Ada yang pesan antar?'],
      fx: ['\uD83D\uDEF5', '\uD83D\uDCA8', '\uD83D\uDCE6'] },
    { id: 'sofa', type: 'person', x: 985, y: 575, w: 215, flip: true, seated: true, range: 45, follow: .55,
      look: { skin: '#e8a58a', hair: '#2a1c16', style: 'short', top: '#4b5d7a' },
      label: 'Sofa empuk untuk santai', lx: 860, ly: 300,
      arrow: [960, 332, 1010, 360, 985, 395],
      bdx: -150, bby: 410,
      say: ['Sofanya empuk banget~', 'Santai dulu, yuk!', 'Kopinya enak, nih!'],
      fx: ['\uD83D\uDE0C', '\u2728', '\u2615'] },
    { id: 'meja', type: 'person', x: 330, y: 605, w: 210, seated: true, range: 55, follow: .55,
      look: { skin: '#d79a74', hair: '#3a2418', style: 'long', top: '#c9a37a', laptop: true },
      label: 'Meja kayu, nyaman buat ngobrol', lx: 58, ly: 372,
      arrow: [226, 408, 262, 424, 296, 470],
      bdx: 230, bby: 432,
      say: ['Kerja sambil ngopi, mantap!', 'Ngobrol di sini enak banget', 'Meja kayu favoritku!'],
      fx: ['\uD83D\uDCAC', '\uD83D\uDCBB', '\u2728'] }
  ];

  /* ---------- Pembuat karakter (SVG datar bergaya kartun) ---------- */
  var INK = '#241b17';
  function svgWrap(vb, inner) {
    return '<svg viewBox="' + vb + '" aria-hidden="true"><g stroke="' + INK + '" stroke-width="3.5" stroke-linejoin="round" stroke-linecap="round">' + inner + '</g></svg>';
  }

  function face(skin) {
    return '<ellipse cx="47" cy="78" rx="6" ry="8" fill="' + skin + '"/><ellipse cx="113" cy="78" rx="6" ry="8" fill="' + skin + '"/>' +
      '<ellipse cx="80" cy="74" rx="33" ry="36" fill="' + skin + '"/>';
  }
  function features() {
    return '<ellipse class="eye" cx="67" cy="77" rx="3.2" ry="4" fill="' + INK + '" stroke="none"/>' +
      '<ellipse class="eye" cx="93" cy="77" rx="3.2" ry="4" fill="' + INK + '" stroke="none"/>' +
      '<path d="M60 67 Q67 63 74 67 M86 67 Q93 63 100 67" fill="none" stroke-width="2.6"/>' +
      '<path d="M71 90 Q80 98 89 90" fill="none" stroke-width="3"/>' +
      '<ellipse cx="58" cy="87" rx="6" ry="3.5" fill="#ff7f6e" opacity=".4" stroke="none"/>' +
      '<ellipse cx="102" cy="87" rx="6" ry="3.5" fill="#ff7f6e" opacity=".4" stroke="none"/>';
  }
  function cup(withSteam) {
    return (withSteam ? '<path class="steam" d="M146 72 Q141 64 147 57" fill="none" stroke="#fff" stroke-width="3" opacity=".8"/><path class="steam" d="M158 72 Q153 64 159 57" fill="none" stroke="#fff" stroke-width="3"/>' : '') +
      '<path d="M140 80 L164 80 L161 104 Q152 108 143 104 Z" fill="#fff"/><path d="M141 88 L163 88" stroke="#8f6849" stroke-width="5" fill="none"/>';
  }

  function buildPerson(look, isBarista) {
    var skin = look.skin, hair = look.hair, top = look.top;
    var back = '', front = '';
    if (look.style === 'long') {
      back = '<path d="M44 72 Q38 26 80 26 Q122 26 116 72 L124 154 Q102 160 98 132 L62 132 Q58 160 36 154 Z" fill="' + hair + '"/>';
      front = '<path d="M46 72 Q44 34 80 34 Q116 34 114 72 Q104 50 86 54 Q70 58 62 50 Q52 56 46 72 Z" fill="' + hair + '"/>';
    } else if (look.style === 'bun') {
      back = '<circle cx="80" cy="24" r="14" fill="' + hair + '"/>';
      front = '<path d="M46 72 Q42 32 80 32 Q118 32 114 72 Q104 52 80 54 Q56 52 46 72 Z" fill="' + hair + '"/>';
    } else {
      front = '<path d="M45 74 Q40 28 80 28 Q120 28 115 74 Q108 54 90 52 Q66 56 56 50 Q48 58 45 74 Z" fill="' + hair + '"/>';
    }
    var body = '<path d="M20 200 Q20 134 62 122 L98 122 Q140 134 140 200 Z" fill="' + top + '"/>' +
      '<rect x="72" y="104" width="16" height="24" rx="6" fill="' + skin + '"/>';
    if (isBarista) {
      body += '<path d="M54 130 L106 130 L112 200 L48 200 Z" fill="#6f4f36"/>' +
        '<path d="M58 128 L66 118 M102 128 L94 118" fill="none"/>' +
        '<rect x="66" y="162" width="28" height="20" rx="4" fill="#8f6849"/>';
    }
    var arm = '';
    if (look.laptop) {
      /* Laptop di depan badan, tangan di atas keyboard */
      arm = '<path d="M26 200 L36 160 Q80 148 124 160 L134 200 Z" fill="#3b3d44"/>' +
        '<circle cx="80" cy="178" r="6" fill="#e6e6e6" stroke="none"/>' +
        '<circle cx="52" cy="158" r="8" fill="' + skin + '"/><circle cx="108" cy="158" r="8" fill="' + skin + '"/>';
    } else {
      arm = '<g class="arm-wave" style="--ox:128px;--oy:150px">' +
        cup(true) +
        '<path d="M128 152 L147 114" stroke="' + INK + '" stroke-width="26" fill="none"/>' +
        '<path d="M128 152 L147 114" stroke="' + top + '" stroke-width="19" fill="none"/>' +
        '<circle cx="150" cy="104" r="10" fill="' + skin + '"/></g>';
    }
    return svgWrap('0 0 190 200', back + body + face(skin) + front + features() + arm);
  }

  function buildRider() {
    var green = '#2f7d3b', skin = '#b57448';
    var s = '';
    s += '<ellipse cx="100" cy="412" rx="64" ry="8" fill="rgba(0,0,0,.25)" stroke="none"/>';
    s += '<ellipse cx="80" cy="402" rx="24" ry="10" fill="#1f1f1f"/><ellipse cx="126" cy="402" rx="24" ry="10" fill="#1f1f1f"/>';
    s += '<rect x="64" y="258" width="35" height="140" rx="8" fill="#77735f"/><rect x="102" y="258" width="35" height="140" rx="8" fill="#77735f"/>';
    /* lengan kiri membawa tas */
    s += '<path d="M56 148 L34 208 L40 262" stroke="' + INK + '" stroke-width="28" fill="none"/><path d="M56 148 L34 208 L40 262" stroke="' + green + '" stroke-width="21" fill="none"/>';
    s += '<path d="M18 264 L64 264 L58 338 L24 338 Z" fill="#f3ece0"/><path d="M30 264 Q41 242 52 264" fill="none"/>';
    s += '<path d="M28 296 L54 296" stroke="' + green + '" stroke-width="6" fill="none"/>';
    s += '<circle cx="41" cy="268" r="11" fill="' + skin + '"/>';
    /* badan */
    s += '<path d="M52 140 Q100 118 148 140 L158 272 L42 272 Z" fill="' + green + '"/>';
    s += '<path d="M84 128 L116 128 L120 272 L80 272 Z" fill="#1b1b1b"/><path d="M100 132 L100 272" stroke="#6b6b6b" stroke-width="2.5" fill="none"/>';
    s += '<rect x="88" y="112" width="24" height="24" rx="8" fill="' + skin + '"/>';
    /* kepala + helm */
    s += '<ellipse cx="66" cy="94" rx="6" ry="8" fill="' + skin + '"/><ellipse cx="134" cy="94" rx="6" ry="8" fill="' + skin + '"/>';
    s += '<circle cx="100" cy="90" r="33" fill="' + skin + '"/>';
    s += '<ellipse class="eye" cx="88" cy="96" rx="3" ry="3.8" fill="' + INK + '" stroke="none"/><ellipse class="eye" cx="112" cy="96" rx="3" ry="3.8" fill="' + INK + '" stroke="none"/>';
    s += '<path d="M90 107 Q100 116 110 107" fill="none" stroke-width="3"/>';
    s += '<path d="M64 88 Q60 40 100 40 Q140 40 136 88 L130 80 Q100 70 70 80 Z" fill="#2f9a45"/>';
    s += '<path d="M70 82 Q100 72 130 82 L132 90 Q100 80 68 90 Z" fill="#1d6b2e"/>';
    s += '<circle cx="100" cy="55" r="7" fill="#fff"/>';
    /* lengan kanan memegang HP */
    s += '<g class="arm-wave" style="--ox:146px;--oy:148px">';
    s += '<g transform="rotate(-8 168 100)"><rect x="156" y="70" width="26" height="44" rx="5" fill="#fff"/><rect x="160" y="76" width="18" height="28" rx="2" fill="#bfe3c9" stroke="none"/></g>';
    s += '<path d="M146 148 L180 192 L168 134" stroke="' + INK + '" stroke-width="28" fill="none"/><path d="M146 148 L180 192 L168 134" stroke="' + green + '" stroke-width="21" fill="none"/>';
    s += '<circle cx="167" cy="118" r="11" fill="' + skin + '"/></g>';
    return svgWrap('0 0 200 420', s);
  }

  /* ---------- Susun elemen ke dalam scene ---------- */
  var nodes = [];
  function pct(v, total) { return (v / total * 100).toFixed(3) + '%'; }
  function clamp(v, a, b) { return Math.min(b, Math.max(a, v)); }

  SPOTS.forEach(function (sp) {
    var ratio = sp.type === 'rider' ? 420 / 200 : 200 / 190;
    var h = sp.w * ratio;
    sp.h = h;
    var face = sp.flip ? -1 : 1;

    /* .bar-char > .bar-char__flip (menoleh) > .bar-char__body (langkah / miring) > svg */
    var ch = document.createElement('div');
    ch.className = 'bar-char' + (sp.seated ? ' is-seated' : '');
    ch.style.left = pct(sp.x - sp.w / 2, IMG_W);
    ch.style.top = pct(sp.y - h, IMG_H);
    ch.style.width = pct(sp.w, IMG_W);
    var flip = document.createElement('div');
    flip.className = 'bar-char__flip';
    flip.style.setProperty('--face', face);
    var body = document.createElement('div');
    body.className = 'bar-char__body';
    body.innerHTML = sp.type === 'rider' ? buildRider() : buildPerson(sp.look || { skin: '#f0a58f', hair: '#2a1c16', style: 'bun', top: '#efe3d0' }, sp.type === 'barista');
    flip.appendChild(body);
    ch.appendChild(flip);
    scene.appendChild(ch);

    var lb = document.createElement('p');
    lb.className = 'bar-label';
    lb.textContent = sp.label;
    lb.style.left = pct(sp.lx, IMG_W);
    lb.style.top = pct(sp.ly, IMG_H);
    scene.appendChild(lb);

    /* Gelembung ucapan */
    var bub = document.createElement('p');
    bub.className = 'bar-bubble';
    bub.setAttribute('aria-hidden', 'true');
    bub.style.left = pct(sp.x + sp.bdx, IMG_W);
    bub.style.top = pct(sp.bby, IMG_H);
    bub.style.setProperty('--tail', clamp(50 - sp.bdx * 0.18, 12, 88).toFixed(0) + '%');   /* ekor mengarah ke karakter */
    scene.appendChild(bub);

    /* Panah melengkung + kepala panah */
    var a = sp.arrow;
    var line = document.createElementNS(NS, 'path');
    line.setAttribute('d', 'M' + a[0] + ' ' + a[1] + ' Q' + a[2] + ' ' + a[3] + ' ' + a[4] + ' ' + a[5]);
    var ang = Math.atan2(a[5] - a[3], a[4] - a[2]);
    var L = 20, sp1 = 0.5;
    var h1x = a[4] - L * Math.cos(ang - sp1), h1y = a[5] - L * Math.sin(ang - sp1);
    var h2x = a[4] - L * Math.cos(ang + sp1), h2y = a[5] - L * Math.sin(ang + sp1);
    var head = document.createElementNS(NS, 'path');
    head.setAttribute('d', 'M' + h1x.toFixed(1) + ' ' + h1y.toFixed(1) + ' L' + a[4] + ' ' + a[5] + ' L' + h2x.toFixed(1) + ' ' + h2y.toFixed(1));
    [line, head].forEach(function (p) { p.setAttribute('class', 'bar-arrow'); p.setAttribute('pathLength', '1'); arrowsSvg.appendChild(p); });
    head.style.transitionDelay = '1.6s';

    nodes.push({ sp: sp, ch: ch, flip: flip, bub: bub, lb: lb, line: line, head: head,
      els: [ch, lb, line, head],              /* yang diberi kelas is-active */
      active: false, pos: 0, target: 0, face: face, walking: false, lean: 0,
      sayIdx: Math.floor(Math.random() * sp.say.length), talkT: 0,
      /* titik pemicu: sekitar dada karakter */
      cx: sp.x, cy: sp.y - h * 0.55 });
  });

  /* ---------- Ukuran, gerak, dan karakter aktif ---------- */
  var scale = 1;
  var userMoved = false, visible = false, current = -1, autoTimer = 0, patrolTimer = 0;

  function measure() {
    var sw = stage.getBoundingClientRect().width;
    scale = sw / IMG_W;
    scene.style.setProperty('--u', (sw / 100) + 'px');
  }

  /* Loop animasi: berjalan hanya selama ada karakter yang masih bergeser */
  var running = false;
  function kick() { if (!running) { running = true; requestAnimationFrame(tick); } }

  function tick() {
    var again = false;
    nodes.forEach(function (n) {
      var rest = n.target - n.pos;
      if (reduceMotion) n.pos = n.target;
      else n.pos += rest * 0.085;                       /* melambat saat mendekati tujuan */
      if (Math.abs(n.target - n.pos) < 0.4) n.pos = n.target;
      var v = n.target - n.pos;                         /* sisa jarak = "kecepatan" */
      if (Math.abs(v) > 0.4) again = true;

      /* Menoleh ke arah berjalan (orang yang duduk tidak berbalik badan) */
      if (!n.sp.seated && Math.abs(v) > 3) {
        var f = v > 0 ? 1 : -1;
        if (f !== n.face) { n.face = f; n.flip.style.setProperty('--face', f); }
      }
      var walking = n.active && Math.abs(v) > 5 && !reduceMotion;
      if (walking !== n.walking) { n.walking = walking; n.ch.classList.toggle('is-walking', walking); }

      /* Badan condong ke arah gerak; yang duduk juga condong ke arah kursor */
      var lean = clamp(v * (n.sp.seated ? 0.16 : 0.06), -8, 8);
      if (n.sp.seated) lean += clamp(n.target / n.sp.range, -1, 1) * 5;
      lean = Math.round(lean * 10) / 10;
      if (lean !== n.lean) { n.lean = lean; n.ch.style.setProperty('--lean', lean); }

      n.ch.style.translate = (n.pos / n.sp.w * 100).toFixed(2) + '% 0';
      var px = (n.pos * scale).toFixed(1) + 'px';
      n.lb.style.setProperty('--dx', px);
      n.bub.style.setProperty('--dx', px);
      var tr = 'translateX(' + n.pos.toFixed(1) + 'px)';
      n.line.style.transform = tr; n.head.style.transform = tr;   /* label & panah ikut karakter */
    });
    if (again) requestAnimationFrame(tick); else running = false;
  }

  function setTarget(n, t) { n.target = clamp(t, -n.sp.range, n.sp.range); kick(); }

  /* ---------- Gelembung ucapan ---------- */
  function scheduleSay(n, delay) {
    clearTimeout(n.talkT);
    n.talkT = setTimeout(function () {
      if (!n.active) return;
      n.bub.textContent = n.sp.say[n.sayIdx++ % n.sp.say.length];
      n.bub.classList.add('is-talk');
      n.talkT = setTimeout(function () {
        n.bub.classList.remove('is-talk');
        scheduleSay(n, 2600);
      }, 3300);
    }, delay);
  }
  function stopSay(n) { clearTimeout(n.talkT); n.bub.classList.remove('is-talk'); }

  /* ---------- Lompat kecil + emoji beterbangan ---------- */
  function hop(n) {
    if (reduceMotion) return;
    n.flip.classList.remove('is-hop');
    void n.flip.offsetWidth;
    n.flip.classList.add('is-hop');
    clearTimeout(n.hopT);
    n.hopT = setTimeout(function () { n.flip.classList.remove('is-hop'); }, 650);
    if (scene.querySelectorAll('.bar-fx').length > 10) return;
    for (var i = 0; i < 3; i++) {
      var fx = document.createElement('span');
      fx.className = 'bar-fx';
      fx.setAttribute('aria-hidden', 'true');
      fx.textContent = n.sp.fx[i % n.sp.fx.length];
      fx.style.left = pct(n.sp.x + n.pos + (i - 1) * 34, IMG_W);
      fx.style.top = pct(n.sp.y - n.sp.h * 0.78, IMG_H);
      fx.style.setProperty('--fx', ((i - 1) * 46 + (Math.random() * 20 - 10)).toFixed(0) + 'px');
      fx.style.setProperty('--fy', (-70 - Math.random() * 40).toFixed(0) + 'px');
      fx.style.setProperty('--fr', ((i - 1) * 18) + 'deg');
      fx.style.animationDelay = (i * 0.07) + 's';
      fx.addEventListener('animationend', function (e) { e.currentTarget.remove(); });
      scene.appendChild(fx);
    }
  }

  function setActive(idx) {
    if (idx === current) return;
    current = idx;
    nodes.forEach(function (n, i) {
      var on = i === idx;
      n.active = on;
      n.els.forEach(function (e) { e.classList.toggle('is-active', on); });
      if (on) scheduleSay(n, 900); else { stopSay(n); setTarget(n, 0); }
    });
  }

  /* Titik terdekat dengan kursor jadi aktif dan berjalan ke arah kursor */
  function follow(px, py) {
    var best = -1, bd = Infinity;
    nodes.forEach(function (n, i) {
      var dx = px - n.sp.x, dy = (py - n.cy) * 1.3;
      var d = dx * dx + dy * dy;
      if (i === current) d *= 0.6;              /* histeresis: tahan sebentar */
      if (d < bd) { bd = d; best = i; }
    });
    setActive(best);
    nodes.forEach(function (n, i) {
      setTarget(n, i === best ? (px - n.sp.x) * n.sp.follow : 0);
    });
  }

  function touched() {
    if (!userMoved) {
      userMoved = true; stage.classList.add('is-touched');
      clearInterval(autoTimer); clearInterval(patrolTimer);
    }
  }
  function toPhoto(e) {
    var r = stage.getBoundingClientRect();
    return [(e.clientX - r.left) / r.width * IMG_W, (e.clientY - r.top) / r.height * IMG_H];
  }

  stage.addEventListener('pointermove', function (e) {
    touched(); var p = toPhoto(e); follow(p[0], p[1]);
  });
  stage.addEventListener('pointerdown', function (e) {
    touched(); var p = toPhoto(e); follow(p[0], p[1]);
    if (current > -1) hop(nodes[current]);
  });
  /* Kursor keluar dari foto: karakter balik ke tempat semula */
  stage.addEventListener('pointerleave', function (e) {
    if (e.pointerType === 'mouse') nodes.forEach(function (n) { setTarget(n, 0); });
  });
  stage.addEventListener('keydown', function (e) {
    var k = e.key;
    if (k === 'Enter' || k === ' ') { e.preventDefault(); touched(); if (current > -1) hop(nodes[current]); return; }
    if (k !== 'ArrowLeft' && k !== 'ArrowRight') return;
    e.preventDefault(); touched();
    var order = nodes.map(function (n, i) { return i; }).sort(function (a, b) { return nodes[a].sp.x - nodes[b].sp.x; });
    var pos = order.indexOf(current < 0 ? order[0] : current);
    pos = clamp(pos + (k === 'ArrowRight' ? 1 : -1), 0, order.length - 1);
    setActive(order[pos]);
    var n = nodes[order[pos]];
    setTarget(n, (k === 'ArrowRight' ? 1 : -1) * n.sp.range * 0.6);   /* melangkah sedikit ke arah panah */
  });

  /* Sebelum pengguna menggerakkan kursor/menyentuh: berganti karakter + berpatroli sendiri */
  function startAuto() {
    if (reduceMotion) return;
    var k = 0;
    autoTimer = setInterval(function () {
      if (!visible || userMoved) return;
      k = (k + 1) % nodes.length; setActive(k);
    }, 5200);
    patrolTimer = setInterval(function () {
      if (!visible || userMoved || current < 0) return;
      var n = nodes[current];
      setTarget(n, (Math.random() * 2 - 1) * n.sp.range * 0.9);   /* jalan ke kiri / kanan */
    }, 1900);
  }

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) { visible = entries[0].isIntersecting; }, { threshold: 0.2 }).observe(stage);
  } else { visible = true; }

  window.addEventListener('resize', function () { measure(); kick(); });
  measure();
  setActive(0);           /* barista langsung tampil */
  startAuto();
})();
