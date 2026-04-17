# Development Rules — SBNP Frontend Desktop

Dokumen ini berisi aturan wajib dalam proses pembangunan aplikasi desktop SBNP Monitoring System.

Tujuan:

- Menjaga integritas data (Realtime vs Cache)
- Memastikan performa aplikasi native tetap optimal (Tauri)
- Menjamin pemisahan logika bisnis dan tampilan UI (Clean Architecture)
- Mempermudah integrasi fitur desktop dimasa depan

---

## 1. General Rules

- Dilarang membuat fitur di luar cakupan `task.md`.
- Dilarang menghapus logika yang sudah direncanakan tanpa revisi dokumen.
- Semua pengerjaan harus merujuk pada:
  - `doc/task.md`
  - `doc/implementation.md`
  - `infrastructure/config/config.ts`

---

## 2. Architecture Discipline (Clean Architecture)

Pemisahan layer WAJIB diikuti secara kaku:

### Layer 1: Presentation (`src/presentation`)

- Hanya berisi komponen UI, styling, dan hooks penangan Interaksi.
- **DILARANG** melakukan `fetch` atau `axios` langsung dari dalam komponen.
- Gunakan State Management (Zustand) untuk data yang dipakai bersama.

### Layer 2: Domain (`src/domain`)

- Berisi cetak biru data (Interface & Model).
- Benar-benar murni TypeScript, dilarang ada library UI di sini.

### Layer 3: Data (`src/data`)

- Tempat implementasi pengambilan data nyata (Repository/Service).
- Menghubungkan API backend dengan Domain model.

### Layer 4: Infrastructure (`src/infrastructure`)

- Tempat konfigurasi library (Axios, Client Socket.io).
- Mengelola variabel global dari `.env`.

---

## 3. Communication & Data Flow

- **Single Point of API Access**: Semua panggilan API harus melalui `src/data/services`.
- **Error Handling**: Setiap request wajib memiliki penanganan error yang jelas dan ditampilkan ke user via UI.
- **Realtime Priority**: Data yang datang dari WebSocket harus secara otomatis memperbarui state global atau marker di peta tanpa refresh.

---

## 4. UI/UX & Styling Rules

- **Maritime Theme**: Gunakan skema warna Deep Blue/Dark Mode sesuai standar monitoring laut.
- **Component Reuse**: Buat komponen kecil yang dapat digunakan kembali (Atoms/Molecules).
- **Responsive Window**: Aplikasi harus tetap rapi meski jendela Tauri di-resize oleh pengguna.
- **Micro-Animations**: Gunakan animasi halus untuk penanda _PADAM_ agar menarik perhatian operator dengan cepat.

---

## 5. Tauri & Desktop Rules

- **Native Efficiency**: Gunakan API Tauri (seperti `notifications` atau `dialog`) sesedikit mungkin namun seefektif mungkin.
- **Build Target**: Pastikan konfigurasi `src-tauri` selalu sinkron dengan versi build Windows (.exe).
- **System Resource**: Hindari memory leak dengan selalu membersihkan listener WebSocket di `useEffect` cleanup.

---

## 6. Documentation Sync

Setiap kali menyelesaikan task atau menambah library:

1. Update `doc/task.md` (Checklist).
2. Jika ada teknologi baru, tambahkan ke `doc/implementation.md`.
3. Jika ada library sensitif, tambahkan ke `.gitignore`.

---

## 7. Violation & Quality Control

- Kode yang melanggar Clean Architecture (misal: API call di dalam Component) **WAJIB DIREFACTOR**.
- Tidak boleh lanjut ke Phase pengerjaan berikutnya jika fase sebelumnya belum tuntas secara dokumentasi.

## JANGAN SENTUH BACKEND SAMA SEKALI

---

## Final Rule

> "Logic lives in Data/Services, Beauty lives in Presentation, Truth lives in Domain."
