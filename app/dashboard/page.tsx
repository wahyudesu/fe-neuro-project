'use client'
import Link from 'next/link'

export default function Dashboard() {
  return (
    <div className="min-h-screen from-slate-50 to-slate-200 p-4 md:p-8">
      {/* Header */}
      <header className="flex flex-wrap justify-between items-center mb-12 gap-4">
        <h1 className="text-4xl md:text-5xl font-bold text-[#001f3f] m-0">
          Neural Ocean Detection Research
        </h1>
        <Link
          href="/"
          className="px-6 py-3 bg-[#001f3f] text-white rounded-xl font-medium transition-all duration-300 hover:bg-[#003d5c] hover:-translate-y-1 hover:shadow-lg no-underline"
        >
          ← Kembali ke Home
        </Link>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto">
        {/* Welcome Card */}
        <div className="bg-white p-8 rounded-3xl shadow-lg mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-[#001f3f] mb-4 m-0">
            Selamat Datang di Dashboard Penelitian Lautan
          </h2>
          <p className="text-gray-600 text-lg m-0">
            Platform untuk mengelola dan menganalisis data penelitian maritim Anda.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Statistik Card */}
          <div className="bg-white p-8 rounded-3xl shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl cursor-pointer">
            <div className="text-5xl mb-4">📈</div>
            <h3 className="text-2xl font-bold text-[#001f3f] mb-2 m-0">
              Statistik
            </h3>
            <p className="text-gray-600 leading-relaxed m-0">
              Lihat analisis data penelitian
            </p>
          </div>

          {/* Proyek Card */}
          <div className="bg-white p-8 rounded-3xl shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl cursor-pointer">
            <div className="text-5xl mb-4">🗂️</div>
            <h3 className="text-2xl font-bold text-[#001f3f] mb-2 m-0">
              Proyek
            </h3>
            <p className="text-gray-600 leading-relaxed m-0">
              Kelola proyek penelitian Anda
            </p>
          </div>

          {/* Tim Card */}
          <div className="bg-white p-8 rounded-3xl shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl cursor-pointer">
            <div className="text-5xl mb-4">👥</div>
            <h3 className="text-2xl font-bold text-[#001f3f] mb-2 m-0">
              Tim
            </h3>
            <p className="text-gray-600 leading-relaxed m-0">
              Kolaborasi dengan peneliti lain
            </p>
          </div>

          {/* Laporan Card */}
          <div className="bg-white p-8 rounded-3xl shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl cursor-pointer">
            <div className="text-5xl mb-4">📄</div>
            <h3 className="text-2xl font-bold text-[#001f3f] mb-2 m-0">
              Laporan
            </h3>
            <p className="text-gray-600 leading-relaxed m-0">
              Generate laporan penelitian
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
