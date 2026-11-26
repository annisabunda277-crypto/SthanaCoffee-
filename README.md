# Sthana Coffee Madiun — Website

Website statis untuk **Sthana Coffee Madiun**: kedai kopi, makanan, dan tempat berkumpul yang nyaman. Dibuat dengan HTML, CSS, dan JavaScript murni (tanpa framework dan tanpa server), sehingga bisa langsung dibuka di browser atau di-hosting di layanan statis mana pun.

Versi folder: `sthana-coffee-web-v6-kopi`

---

## Fitur Utama

- **Beranda** dengan hero, menu pilihan, pita menu berjalan, cangkir beruap, dan animasi biji kopi melayang.
- **Suasana Bar interaktif** di beranda: foto bar dengan karakter kartun yang berpatroli, bergeser ke samping mengikuti kursor (di HP mengikuti jari), dan melompat saat diklik/diketuk.
- **Menu** dengan filter kategori: Semua, Kopi, Non-Kopi, Makanan Berat, Camilan.
- **Keranjang pesanan**: pilih lebih dari satu menu, lalu kirim pesanan lewat **WhatsApp**. Isi keranjang tersimpan di `localStorage` browser.
- **Chatbot FAQ "Barista Sthana"** di semua halaman. Jawaban dicocokkan lewat kata kunci, tanpa server, dan riwayat chat tersimpan di `sessionStorage` agar tidak hilang saat pindah halaman.
- **Reservasi tempat** lewat WhatsApp, lengkap dengan informasi jam reservasi dan close order.
- **Halaman FAQ** dengan animasi bertema kopi.
- **Event**, **Galeri (Ambience)**, **Lokasi & Kontak**, dan **Tentang Kami**.
- Preloader, progress bar scroll, transisi antarhalaman, dan efek muncul halus saat scroll.
- Menghormati pengaturan `prefers-reduced-motion` pada animasi.

## Halaman

| File | Isi |
|------|-----|
| `index.html` | Beranda |
| `menu.html` | Daftar menu dan keranjang pesanan |
| `reservasi.html` | Reservasi tempat dan jam operasional pemesanan |
| `event.html` | Event Sthana Coffee |
| `galeri.html` | Galeri foto (Ambience) |
| `lokasi.html` | Alamat, peta, dan kontak |
| `tentang.html` | Tentang Sthana Coffee |
| `faq.html` | Pertanyaan yang sering diajukan |

## Struktur Folder

```
sthana-coffee-web-v6-kopi/
├── index.html
├── menu.html
├── reservasi.html
├── event.html
├── galeri.html
├── lokasi.html
├── tentang.html
├── faq.html
├── style.css          # gaya utama
├── warm.css           # tema warna hangat
├── chatbot.css        # gaya chatbot
├── faq.css            # gaya halaman FAQ
├── bar-scene.css      # gaya animasi bar di beranda
├── script.js          # data bisnis, menu, keranjang, animasi umum
├── chatbot.js         # chatbot FAQ "Barista Sthana"
├── bar-scene.js       # animasi suasana bar interaktif
└── images/
    ├── hero.jpg, bar.jpg, about.jpg, logo.png
    ├── events/        # foto event
    ├── gallery/       # foto galeri (gallery-1 s.d. gallery-6)
    └── menu/          # foto menu
```

## Cara Menjalankan

Tidak perlu instalasi apa pun.

1. Ekstrak file zip.
2. Buka `index.html` di browser (klik dua kali).

Opsional, jalankan dengan server lokal agar perilaku sama seperti saat online:

```bash
cd sthana-coffee-web-v6-kopi
python -m http.server 8000
# lalu buka http://localhost:8000
```

> Font (Fraunces, Outfit, Caveat) dan ikon (Material Symbols) dimuat dari Google Fonts, jadi dibutuhkan koneksi internet agar tampilan tampil sempurna.

## Konfigurasi Data Bisnis

Semua data bisnis ada di objek `businessInfo` pada bagian atas **`script.js`**, dan dipakai juga oleh chatbot. Ubah di satu tempat saja:

| Properti | Fungsi |
|----------|--------|
| `address` | Alamat kedai |
| `whatsapp` / `whatsappLabel` | Nomor WhatsApp (format internasional) dan tampilannya |
| `grabfood` | Tautan pemesanan GrabFood |
| `hours` | Jam buka |
| `reserveStartMin` / `reserveEndMin` | Jam reservasi pertama dan terakhir (dalam menit sejak 00.00) |
| `kitchenCloseWeekdayMin` | Close order kitchen weekday (Sen–Jum) |
| `kitchenCloseWeekendMin` | Close order kitchen weekend (Sab–Min) |
| `drinkCloseMin` | Close order minuman (setiap hari) |

Jam operasional saat ini:

- Buka: **08.00 – 00.00 WIB**
- Reservasi mulai: **08.00 WIB**
- Close order kitchen: **22.30** (weekday), **23.30** (weekend)
- Close order minuman: **23.30** (setiap hari)

> Jam di `reservasi.html` ditulis langsung di HTML. Jika jam berubah, perbarui juga teks di halaman tersebut.

## Mengubah Konten

- **Menu**: tambah atau ubah item pada daftar menu di `script.js` (kategori: `coffee`, `non-coffee`, `makanan-berat`, `snack`). Beri `featured: true` agar tampil di "Menu Pilihan" beranda. Simpan foto di `images/menu/`.
- **Jawaban chatbot**: sunting daftar pertanyaan/kata kunci di `chatbot.js`.
- **Pertanyaan FAQ**: sunting langsung di `faq.html`.
- **Foto galeri dan event**: ganti file di `images/gallery/` dan `images/events/`.
- **Titik animasi bar**: koordinat karakter pada foto bar ada di `SPOTS` dalam `bar-scene.js` (memakai piksel foto asli 1280×960).

## Kontak dan Media Sosial

- Alamat: Jl. Setiaki No. 27, Kelurahan Oro-oro Ombo, Kecamatan Kartoharjo, Kota Madiun, Jawa Timur 63119
- WhatsApp: 0896-3350-4040
- Instagram: [@sthana_coffee](https://www.instagram.com/sthana_coffee)
- TikTok: [@sthana_coffee](https://www.tiktok.com/@sthana_coffee)

## Teknologi

HTML5, CSS3, JavaScript (vanilla), Google Fonts, Material Symbols. Tanpa build tools dan tanpa dependensi.
