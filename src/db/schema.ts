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
  sapId: varchar('sap_id', { length: 100 }).unique(), // SAP ID untuk rekonsiliasi data antara sistem SAP dan ITAM
  name: varchar('name', { length: 255 }).notNull(),
  category: mysqlEnum('category', ['laptop', 'monitor', 'license', 'router']).notNull(), // Kategori Aset
  acquisitionType: mysqlEnum('acquisition_type', ['dibeli', 'disewa']).notNull(), // Status Kepemilikan
  serialNumber: varchar('serial_number', { length: 150 }),
  status: mysqlEnum('status', ['available', 'in_use', 'maintenance', 'retired', 'lost']).default('available'),
  assignedTo: int('assigned_to').references(() => users.id), // Foreign Key ke pengguna
  purchaseDate: timestamp('purchase_date'),
  leaseEndDate: timestamp('lease_end_date'), // Tanggal akhir penyewaan
  cost: int('cost'), // Nilai atau Harga aset
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
});
