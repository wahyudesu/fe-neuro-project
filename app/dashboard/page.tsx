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

      {/* Main Sections */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/dashboard/analysis"
          className="bg-linear-to-br from-blue-500 to-blue-600 p-8 rounded-3xl shadow-lg text-white hover:-translate-y-2 transition-all duration-300 hover:shadow-xl no-underline group"
        >
          <div className="text-5xl mb-4">📊</div>
          <h3 className="text-2xl font-bold mb-2 m-0">Analysis</h3>
          <p className="text-blue-100 m-0">
            Lihat dan kelola hasil analisis
          </p>
        </Link>

        <Link
          href="/dashboard/data"
          className="bg-linear-to-br from-green-500 to-green-600 p-8 rounded-3xl shadow-lg text-white hover:-translate-y-2 transition-all duration-300 hover:shadow-xl no-underline group"
        >
          <div className="text-5xl mb-4">📁</div>
          <h3 className="text-2xl font-bold mb-2 m-0">Data</h3>
          <p className="text-green-100 m-0">
            Kelola data penelitian
          </p>
        </Link>

        <Link
          href="/dashboard/upload"
          className="bg-linear-to-br from-purple-500 to-purple-600 p-8 rounded-3xl shadow-lg text-white hover:-translate-y-2 transition-all duration-300 hover:shadow-xl no-underline group"
        >
          <div className="text-5xl mb-4">📤</div>
          <h3 className="text-2xl font-bold mb-2 m-0">Upload</h3>
          <p className="text-purple-100 m-0">
            Unggah gambar untuk dianalisis
          </p>
        </Link>
      </div>
    </div>
  )
}
