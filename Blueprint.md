# Blueprint: dsf_itam (IT Asset Management)

Dokumen ini adalah panduan teknis (Blueprint) terperinci untuk membangun aplikasi IT Asset Management bernama **dsf_itam**. Dokumen ini dirancang khusus agar dapat dipahami dan dieksekusi langkah demi langkah oleh Junior AI Agent.

## 1. Spesifikasi Tech Stack
- **Runtime:** Bun
- **Framework:** Next.js (App Router)
- **Database ORM:** Drizzle ORM
- **Database Server:** MySQL
- **Styling:** Tailwind CSS

---

## 2. Struktur Direktori Utama
Aplikasi akan menggunakan folder `src` dengan struktur di bawah ini. Pastikan Anda menginisialisasi Next.js dengan pengaturan direktori `src`.

```text
dsf_itam/
├── package.json
├── bun.lockb
├── drizzle.config.ts
├── .env
├── src/
│   ├── actions/       # Berisi Next.js Server Actions untuk mutasi data (CREATE, UPDATE, DELETE)
│   ├── components/    # Reusable UI components (Tombol, Tabel, Modal, Kartu, dll)
│   ├── db/            # Konfigurasi koneksi Drizzle & definisi skema database
│   │   ├── index.ts   # Koneksi dan instance database MySQL
│   │   └── schema.ts  # Definisi tabel (misal: users, assets, categories)
│   ├── lib/           # Utility functions (formatter, helpers, auth tools)
│   └── app/           # Next.js App Router (Pages, Layout, dan API Routes)
```

---

## 3. Langkah-Langkah Implementasi (Implementation Steps)

Bagi Junior Agent, ikuti langkah-langkah di bawah ini secara persis dan berurutan. Perhatikan bahwa instruksi mengharuskan eksekusi menggunakan perintah `sudo` untuk proses instalasi yang relevan.

### Langkah 1: Inisialisasi Proyek
Gunakan perintah `bun` untuk menginisialisasi proyek Next.js dengan opsi Tailwind CSS secara default.

```bash
# Jalankan inisialisasi aplikasi menggunakan bun create dengan sudo
sudo bun create next-app dsf_itam --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

# Pindah ke dalam direktori aplikasi
cd dsf_itam
```

### Langkah 2: Instalasi Dependensi Database
Instalasi module/library terkait database (Drizzle ORM & MySQL driver).
*Catatan Penting:* Meskipun referensi awal mungkin menyebut `pg` (PostgreSQL), kita akan menginstal `mysql2` karena database server yang ditetapkan adalah MySQL.

```bash
# Instal dependensi utama aplikasi
sudo bun add drizzle-orm mysql2 dotenv

# Instal dependensi pengembangan (DevDependencies) seperti drizzle-kit
sudo bun add -d drizzle-kit @types/node
```

### Langkah 3: Konfigurasi Database (Drizzle & Schema)

1. **Buat file Environment Variables (`.env`)** di root aplikasi:
```env
# Sesuaikan credential 'root', 'password', dan host MySQL
DATABASE_URL="mysql://root:password@localhost:3306/dsf_itam"
```

2. **Buat konfigurasi file Drizzle (`drizzle.config.ts`)** di root aplikasi:
```typescript
import 'dotenv/config';
import type { Config } from 'drizzle-kit';

export default {
  schema: './src/db/schema.ts',
  out: './drizzle',
  driver: 'mysql2', // Gunakan Drizzle driver MySQL
  dbCredentials: {
    uri: process.env.DATABASE_URL!,
  },
} satisfies Config;
```

3. **Buat file koneksi database (`src/db/index.ts`)**:
```typescript
import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './schema';
import 'dotenv/config';

// Membuat koneksi database MySQL menggunakan instance pool
const connection = mysql.createPool({
  uri: process.env.DATABASE_URL,
});

export const db = drizzle(connection, { mode: 'default', schema });
```

4. **Buat file definisi skema awal (`src/db/schema.ts`)**:
```typescript
import { mysqlTable, serial, varchar, timestamp, mysqlEnum, int } from 'drizzle-orm/mysql-core';

// Tabel Users untuk Autentikasi Login & Data Karyawan
export const users = mysqlTable('users', {
  id: serial('id').primaryKey(),
  employeeId: varchar('employee_id', { length: 50 }).unique().notNull(), // NIK atau ID Karyawan
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  role: mysqlEnum('role', ['admin', 'employee', 'manager']).default('employee'),
  department: varchar('department', { length: 100 }),
  status: mysqlEnum('status', ['active', 'inactive']).default('active'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
});

// Tabel Assets (IT Asset Management) berskala Enterprise
export const assets = mysqlTable('assets', {
  id: serial('id').primaryKey(),
  assetTag: varchar('asset_tag', { length: 100 }).unique().notNull(), // Kode Aset Unik / QR
  sapId: varchar('sap_id', { length: 100 }).unique(), // SAP ID untuk rekonsiliasi data antara sistem SAP dan ITAM (data Employee vs SAP)
  name: varchar('name', { length: 255 }).notNull(),
  category: mysqlEnum('category', ['laptop', 'monitor', 'license', 'router']).notNull(), // Kategori Aset yang tersedia
  acquisitionType: mysqlEnum('acquisition_type', ['dibeli', 'disewa']).notNull(), // Status Kepemilikan (Bought / Leased)
  serialNumber: varchar('serial_number', { length: 150 }),
  status: mysqlEnum('status', ['available', 'in_use', 'maintenance', 'retired', 'lost']).default('available'),
  assignedTo: int('assigned_to').references(() => users.id), // Foreign Key ke Karyawan yang menggunakan Aset
  purchaseDate: timestamp('purchase_date'),
  leaseEndDate: timestamp('lease_end_date'), // Tanggal akhir penyewaan jika 'disewa'
  cost: int('cost'), // Nilai atau Harga aset
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
});
```

### Langkah 4: Setup Dasar Layout Dashboard dengan Tailwind CSS

1. **Konfigurasi `src/app/layout.tsx`** untuk menambahkan pembungkus UI dashboard global:
```tsx
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'dsf_itam - IT Asset Management',
  description: 'Dashboard Sistem IT Asset Management Terpusat',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body className={`${inter.className} bg-slate-50 text-slate-900`}>
        <div className="min-h-screen flex">
          {/* Sidebar Navigation */}
          <aside className="w-64 bg-slate-900 text-white flex-col p-6 hidden md:flex">
            <h1 className="text-2xl font-bold mb-10 text-blue-400">DSF ITAM</h1>
            <nav className="flex flex-col gap-2">
              <a href="#" className="bg-slate-800 p-3 rounded-md font-medium">Dashboard</a>
              <a href="#" className="hover:bg-slate-800 p-3 rounded-md text-slate-300 transition-colors">Assets</a>
              <a href="#" className="hover:bg-slate-800 p-3 rounded-md text-slate-300 transition-colors">Settings</a>
            </nav>
          </aside>
          
          {/* Main Workspace */}
          <main className="flex-1 flex flex-col min-h-screen">
            <header className="h-16 bg-white border-b border-slate-200 flex items-center px-8 shadow-sm">
              <h2 className="text-xl font-semibold">Overview</h2>
            </header>
            <div className="p-8 flex-1 overflow-auto">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  )
}
```

2. **Setup halaman index/home di `src/app/page.tsx`**:
```tsx
// Komponen Dashboard yang menampilkan kartu laporan statistik aset
export default function Home() {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {/* Stats Card: Total Assets */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Total Assets</h3>
        <p className="text-4xl font-bold text-slate-900 mt-3">1,245</p>
      </div>
      
      {/* Stats Card: Active Assets */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Active Assets</h3>
        <p className="text-4xl font-bold text-blue-600 mt-3">1,023</p>
      </div>
      
      {/* Stats Card: Under Maintenance */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Under Maintenance</h3>
        <p className="text-4xl font-bold text-amber-500 mt-3">42</p>
      </div>
    </div>
  )
}
```

---

## 4. Aturan Eksekusi Tambahan (Kode Etik Agen Junior)

1. **Jalankan Perintah Sesuai Skrip**: Eksekusi semua command di terminal pada langkah-langkah di atas sebelum beralih ke pembuatan file.
2. **Kesesuaian Database**: Pastikan Drizzle schema file (`drizzle-orm/mysql-core`) memakai utilitas MySQL, *bukan* utilitas PostgreSQL atau SQLite.
3. **Pemisahan Logika**: Pastikan *Server Actions* untuk menambah (Insert), mengubah (Update), dan menghapus (Delete) dipisahkan ke dalam file-file TypeScript (`.ts`) khusus di direktori `/src/actions` (misal: `src/actions/assetActions.ts`) dan ditandai dengan directive `"use server"`.
4. **Validasi Tipe Data**: Selalu manfaatkan ketegasan *types* pada TypeScript di seluruh komponen dan koneksi data.
