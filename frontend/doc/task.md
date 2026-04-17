# SBNP Frontend Desktop Application Tasks

Daftar tugas pembangunan aplikasi desktop monitoring SBNP menggunakan React + Tauri v2.

---

## Phase 1: Foundation & Infrastructure

- [x] Inisialisasi Project (React + Vite + Tauri v2)
- [x] Konfigurasi environment variables (`.env`)
- [x] Mapping konfigurasi aplikasi (`src/infrastructure/config/config.ts`)
- [x] Implementasi API Client (Axios)
- [x] Implementasi Realtime Client (Socket.io)

## Phase 2: Domain & Data Layer

- [x] Definisi Entity/Model Stasiun (`src/domain/models`)
- [x] Service untuk pengambilan data stasiun (`src/data/services`)
- [x] State management setup (Zustand/React Context)

## Phase 3: UI & Presentation

- [x] Setup Styling Framework (TailwindCSS)
- [x] Dashboard Layout (Maritime Dark Mode Theme)
- [x] Komponen Peta Interaktif (Leaflet Integration)
- [x] Komponen List Stasiun & Realtime Feed
- [x] Animasi Status Stasiun (Pulsing effect for _PADAM_)

## Phase 4: Desktop Features (Tauri)

- [x] Window Customization (Title, Icon)
- [x] System Tray Integration
- [x] OS Native Notifications (for Station Alerts)
- [ ] Build & Packaging untuk Windows pakai inosetup dan signed (.exe)

## Phase 5: Authentication & Admin Panel

- [x] Setup Routing (`react-router-dom`)
- [x] Buat Komponen Login Modal (`AuthModal.tsx`)
- [x] Buat Layanan & Store JWT (`auth.service.ts` & `auth.store.ts`)
- [x] Buat Halaman Dasar Panel Admin (`AdminPage.tsx`)
- [x] Sambungkan *Profile Icon Dashboard* ke Login Modal

---

## Catatan Perkembangan

- **2026-04-16**: Meluncurkan backend di Railway dan berhasil menghubungkan `.env` frontend ke server produksi.
