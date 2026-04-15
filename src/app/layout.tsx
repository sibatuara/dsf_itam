import './globals.css'
import type { Metadata } from 'next'

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
      <body className={`bg-slate-50 text-slate-900`}>
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
