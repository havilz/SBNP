# 📂 Frontend Project Structure

Struktur direktori frontend SBNP Monitoring dibangun dengan memadukan **Clean Architecture** untuk skalabilitas aplikasi React masa depan dan **Tauri v2** untuk fungsionalitas native desktop.

`frontend/`
├── `dist/` # Output kompilasi dari Vite (HTML, CSS, JS ter-minify). Tidak di-track Git.
├── `node_modules/` # Dependensi pihak ketiga. Tidak di-track Git.
├── `doc/` # Dokumentasi teknis spesifik frontend (task list, rules, arsitektur).
├── `src-tauri/` # Bagian Native Desktop (Rust) dari Tauri.
│   ├── `icons/` # Ikon aplikasi desktop untuk berbagai OS (.ico, .icns, .png).
│   ├── `src/`
│   │   ├── `main.rs` # Titik masuk eksekusi utama aplikasi Rust.
│   │   └── `lib.rs` # Konfigurasi inti Tauri, System Tray, dan kontrol menu native OS.
│   ├── `tauri.conf.json` # Konfigurasi meta aplikasi desktop (nama produk, versi, dll).
│   └── `Cargo.toml` # Pengaturan dependensi Rust dan Tauri v2.
├── `src/` # Source code utama aplikasi React.
│   ├── `assets/` # File statis (gambar, svg) spesifik frontend.
│   ├── `domain/` # Lapisan Inti Bisnis. Menampung tipe data/interface murni tanpa framework.
│   │   └── `models/` # Definisi entiti seperti `station.model.ts`.
│   ├── `data/` # Lapisan Data. Tempat integrasi dengan API eksternal.
│   │   └── `services/` # Servis seperti `station.service.ts` & `auth.service.ts`.
│   ├── `infrastructure/` # Lapisan Konfigurasi Eksternal. 
│   │   └── `clients/` # Konfigurasi inti `axios` dan _singleton_ `socket.io-client`.
│   ├── `presentation/` # Lapisan UI. Semua yang bersentuhan dengan tampilan visual.
│   │   ├── `components/` # Komponen React kecil & independen (Map, Feed, Modal Auth).
│   │   ├── `hooks/` # Fungsionalitas custom React (seperti `useSocketSync.ts`).
│   │   ├── `pages/` # Komponen tingkat layar penuh (DashboardPage, AdminPage).
│   │   ├── `state/` # Pengelola state global menggunakan Zustand (seperti `auth.store.ts`).
│   │   └── `App.tsx` # Titik masuk komponen React & pengatur *Routing* (`react-router-dom`).
│   ├── `index.css` # File CSS Utama, tempat masuknya *TailwindCSS v4*.
│   ├── `main.tsx` # Endpoint root rekayasa DOM React.
│   └── `vite-env.d.ts` # Deklarasi tipe lingkungan spesifik untuk bundler Vite.
├── `.env` # Variabel lingkungan (API & Websocket URL). Konfigurasi non-git.
├── `index.html` # Kerangka dasar HTML utama dan titik kait (mounting) Vite.
├── `package.json` # Daftar library Node dan perintah pemicu eksekusi program.
├── `postcss.config.js` # Konfigurasi pemrosesan CSS modern pendukung Tailwind v4.
├── `tailwind.config.js` # Tema, token desain (seperti *maritime-dark*), & pengaturan warna.
├── `tsconfig.json` # Peraturan ketat kompilasi TypeScript global.
└── `vite.config.ts` # Konfigurasi mesin pemroses bundler cepat Vite.
