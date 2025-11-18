'use client'
import Link from 'next/link'

export default function Dashboard() {
  return (
    <div>
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-[#001f3f] mb-2 m-0">
          Dashboard
        </h1>
        <p className="text-slate-600 text-lg m-0">
          Selamat datang di platform penelitian maritim
        </p>
      </header>

      {/* Welcome Card */}
      <div className="bg-white p-6 md:p-8 rounded-3xl shadow-lg mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-[#001f3f] mb-3 m-0">
          Neural Ocean Detection Research
        </h2>
        <p className="text-gray-600 text-base md:text-lg m-0">
          Platform untuk mengelola dan menganalisis data penelitian maritim menggunakan AI
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl shadow-lg text-white">
          <div className="text-4xl mb-2">📊</div>
          <div className="text-3xl font-bold mb-1">125</div>
          <div className="text-blue-100">Total Analisis</div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-2xl shadow-lg text-white">
          <div className="text-4xl mb-2">🖼️</div>
          <div className="text-3xl font-bold mb-1">48</div>
          <div className="text-green-100">Gambar Terupload</div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-2xl shadow-lg text-white">
          <div className="text-4xl mb-2">🐠</div>
          <div className="text-3xl font-bold mb-1">32</div>
          <div className="text-purple-100">Spesies Terdeteksi</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 md:p-8 rounded-3xl shadow-lg">
        <h3 className="text-xl md:text-2xl font-bold text-[#001f3f] mb-6 m-0">
          Aksi Cepat
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href="/dashboard/upload"
            className="flex items-center gap-4 p-6 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-md no-underline group"
          >
            <div className="text-4xl">📤</div>
            <div>
              <div className="text-lg font-bold text-[#001f3f] group-hover:text-blue-600 transition-colors">
                Upload Gambar
              </div>
              <div className="text-sm text-slate-500">
                Unggah gambar untuk dianalisis
              </div>
            </div>
          </Link>
          <Link
            href="/dashboard/analysis"
            className="flex items-center gap-4 p-6 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-md no-underline group"
          >
            <div className="text-4xl">📊</div>
            <div>
              <div className="text-lg font-bold text-[#001f3f] group-hover:text-blue-600 transition-colors">
                Lihat Hasil
              </div>
              <div className="text-sm text-slate-500">
                Cek hasil analisis terbaru
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
