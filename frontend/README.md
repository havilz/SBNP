# SBNP Monitor - Desktop App Setup

Aplikasi monitoring real-time SBNP (Sistem Berbasis Node Sensor) yang dibangun menggunakan **Tauri v2**, **React**, dan **TypeScript**.

## Persyaratan Sistem (Prerequisites)

Sebelum menjalankan proyek ini, pastikan Anda telah menginstal komponen berikut di lingkungan pengembangan Anda:

### 1. Rust (Wajib)
Tauri membutuhkan Rust compiler untuk membangun aplikasi native.
- Unduh dan instal [Rustup](https://rustup.rs/).
- Setelah instalasi, pastikan Rust terinstal dengan menjalankan:
  ```powershell
  rustc --version
  ```

### 2. Microsoft Visual Studio C++ Build Tools
Dibutuhkan untuk kompilasi Windows native.
- Unduh [Visual Studio Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/).
- Saat instalasi, centang **"Desktop development with C++"**.

### 3. WebView2 Runtime
Dibutuhkan untuk merender frontend di Windows.
- Biasanya sudah terinstal di Windows 10/11 terbaru. Jika belum, unduh [WebView2 Runtime](https://developer.microsoft.com/en-us/microsoft-edge/webview2/).

### 4. Node.js & NPM
- Gunakan versi LTS terbaru (rekomendasi Node.js v18 atau v20+).

---

## Langkah Instalasi

1. **Clone Repositori** (Jika belum):
   ```bash
   git clone <repository-url>
   cd SBNP/frontend
   ```

2. **Instal Dependensi NPM**:
   ```bash
   npm install
   ```

3. **Konfigurasi Environment**:
   Salin `.env.example` ke `.env` (atau pastikan `.env` sudah ada) dan sesuaikan URL API-nya:
   ```env
   VITE_API_URL=https://sbnp-production.up.railway.app/api
   VITE_WS_URL=https://sbnp-production.up.railway.app/sbnp
   ```

---

## Perintah Pengembangan (Development)

Untuk menjalankan aplikasi dalam mode pengembangan dengan *Hot Reload*:

```bash
# Menjalankan aplikasi desktop (Tauri)
npm run tauri dev
```

Ini akan menjalankan dua hal secara otomatis:
- Frontend Vite di `http://localhost:1420`
- Jendela native aplikasi Tauri yang memuat frontend tersebut.

---

## Membangun Installer (Production)

Untuk membuat file `.exe` atau installer Windows:

```bash
# Build aplikasi production
npm run tauri build
```

Hasil build akan tersedia di folder:
`src-tauri/target/release/bundle/msi/` atau `src-tauri/target/release/bundle/setup.exe`

---

## Folder Struktur

- `src/`: Berisi kode sumber React (frontend).
- `src-tauri/`: Berisi konfigurasi native Rust, ikon, dan manifest aplikasi.
- `public/`: Aset statis frontend.
- `dist/`: Hasil build frontend (dihasilkan secara otomatis).

---

## Tips & Troubleshooting

- **Error kompilasi Rust**: Jalankan `cargo clean` di dalam folder `src-tauri` jika terjadi error cache yang aneh.
- **Update Tauri CLI**: Jika ada pembaruan, gunakan `npm install @tauri-apps/cli@latest`.
- **Backend Connection**: Pastikan URL di `.env` sudah benar agar data sensor dapat muncul.

---

Developed for SBNP System.

