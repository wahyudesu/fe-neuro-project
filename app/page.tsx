'use client'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden flex items-center justify-center bg-black">
      {/* Video Background dengan Transparansi - OPTIMIZED */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          poster="/poster.jpg"
          className="w-full h-full object-cover opacity-70"
          style={{
            // CSS Filters untuk manipulasi video
            // filter: 'brightness(0.8) contrast(1.1) saturate(1.2)'
          }}
        >
          <source src="/video.mp4" type="video/mp4" />
          {/* Fallback untuk browser yang tidak support video */}
          <div className="w-full h-full bg-linear-to-b from-blue-900 to-blue-950"></div>
        </video>
        {/* linear overlay (opsional) */}
        <div className="absolute inset-0 bg-linear-to-b from-blue-900/30 via-transparent to-blue-950/50"></div>
      </div>

      {/* Content */}
      <main className="relative z-10 max-w-7xl px-8 text-center animate-fadeInUp">
        <div className="flex flex-col items-center gap-8">
          {/* Title */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.5)] leading-tight animate-float">
            Neural Ocean Detection Research
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-2xl text-white/90 max-w-3xl leading-relaxed drop-shadow-[0_2px_10px_rgba(0,0,0,0.3)]">
            Jelajahi kedalaman pengetahuan maritim dan ekosistem laut dengan platform penelitian terintegrasi
          </p>

          {/* CTA Button dengan Gradient Hover */}
          <Link
            href="/dashboard"
            className="group relative inline-flex items-center gap-3 px-12 py-5 text-xl font-semibold text-[#001f3f] bg-white rounded-full transition-all duration-500 shadow-[0_10px_30px_rgba(0,0,0,0.3)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.5)] hover:-translate-y-1 active:translate-y-0 mt-4 overflow-hidden"
          >
            {/* Gradient yang muncul saat hover */}
            <span className="absolute inset-0 bg-linear-to-r from-cyan-400 via-blue-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></span>

            {/* Text yang berubah warna saat hover */}
            <span className="relative z-10 group-hover:text-white transition-colors duration-500">
              Lihat Hasil Penelitian
            </span>
            <span className="relative z-10 text-2xl transition-all duration-300 group-hover:translate-x-1 group-hover:text-white">→</span>
          </Link>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 w-full max-w-4xl">
            <div className="flex flex-col items-center gap-4 p-8 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 transition-all duration-300 hover:bg-white/15 hover:-translate-y-2">
              <span className="text-5xl drop-shadow-[0_2px_5px_rgba(0,0,0,0.3)]">🤖</span>
              <p className="text-white font-medium text-lg m-0">AI Detection</p>
            </div>

            <div className="flex flex-col items-center gap-4 p-8 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 transition-all duration-300 hover:bg-white/15 hover:-translate-y-2">
              <span className="text-5xl drop-shadow-[0_2px_5px_rgba(0,0,0,0.3)]">🐠</span>
              <p className="text-white font-medium text-lg m-0">Marine Life</p>
            </div>

            <div className="flex flex-col items-center gap-4 p-8 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 transition-all duration-300 hover:bg-white/15 hover:-translate-y-2">
              <span className="text-5xl drop-shadow-[0_2px_5px_rgba(0,0,0,0.3)]">📈</span>
              <p className="text-white font-medium text-lg m-0">Analytics</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
