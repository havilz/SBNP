# SBNP Frontend Technical Implementation

Dokumen ini menjelaskan detail teknis, arsitektur, dan standar pengembangan yang digunakan dalam membangun SBNP Desktop Application.

---

## Architecture Overview: Clean Architecture

Proyek ini menggunakan pola **Clean Architecture** untuk memastikan kode mudah diuji, dipelihara, dan independen dari framework luar.

### 1. Domain Layer (`src/domain`)

- **Tujuan**: Inti dari logika bisnis.
- **Isi**: Entity, Interface Model, dan abstraksi Repository.
- **Kaidah**: Tidak boleh bergantung pada library luar atau layer lain.

### 2. Data Layer (`src/data`)

- **Tujuan**: Implementasi pengambilan data.
- **Isi**: Remote Data Source, Service API, dan Mapper.
- **Kaidah**: Menghubungkan abstraksi di Domain dengan data nyata dari Infrastructure.

### 3. Infrastructure Layer (`src/infrastructure`)

- **Tujuan**: Detail teknis dan library pihak ketiga.
- **Isi**: Konfigurasi Axios, Socket.io client, Persistent storage, dan Config mapper.
- **Kaidah**: Tempat di mana detail implementasi seperti URL API didefinisikan.

### 4. Presentation Layer (`src/presentation`)

- **Tujuan**: Tampilan antarmuka pengguna (UI).
- **Isi**: Komponen React, Pages, Hooks, dan State Management (Zustand).
- **Kaidah**: Hanya fokus pada cara menampilkan data dan menangani interaksi pengguna.

---

## Tech Stack & Library

| Komponen           | Teknologi        | Alasan                                                        |
| :----------------- | :--------------- | :------------------------------------------------------------ |
| **Runtime**        | Tauri v2         | Performa native, ukuran file sangat kecil dibanding Electron. |
| **Framework**      | React 19         | UI library yang deklaratif dan ekosistem sangat luas.         |
| **Language**       | TypeScript       | Type-safety untuk mencegah error saat runtime.                |
| **Build Tool**     | Vite             | Proses development dan building yang sangat cepat.            |
| **HTTP Client**    | Axios            | Dukungan interceptor dan handling error yang matang.          |
| **Realtime**       | Socket.io Client | Sinkronisasi data stasiun secara instan dari backend.         |
| **Visual Library** | Leaflet          | Library peta yang ringan dan modular.                         |

---

## Configuration Management

Aplikasi menggunakan pendekatan **Centralized Configuration** melalui `src/infrastructure/config/config.ts`.

- Variabel lingkungan didefinisikan di `.env` dengan prefix `VITE_`.
- Mapper memastikan adanya nilai default jika variabel tidak ditemukan.
- Melindungi aplikasi dari "hardcoded strings" yang tersebar di banyak file.

---

## Security & Production

- **Environment Separation**: Membedakan URL API antara development dan production melalui file `.env`.
- **Desktop Signing**: Untuk rilis Windows, aplikasi akan dipackaging menggunakan **Inno Setup** dan ditandatangani untuk menghindari peringatan keamanan OS.
