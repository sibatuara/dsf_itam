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
