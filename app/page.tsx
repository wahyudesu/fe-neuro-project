'use client'
import Link from 'next/link'
import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'

export default function Home() {
  const [isExpanding, setIsExpanding] = useState(false)
  const [showAbout, setShowAbout] = useState(false)
  const [showTeam, setShowTeam] = useState(false)
  const buttonRef = useRef<HTMLAnchorElement>(null)
  const router = useRouter()

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    setIsExpanding(true)

    // Navigate after animation completes
    setTimeout(() => {
      router.push('/dashboard')
    }, 800)
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden flex items-center justify-center bg-black">
      {/* Navigation Buttons - Top Right */}
      <div className="absolute top-4 right-4 md:top-8 md:right-8 z-20 flex flex-col sm:flex-row gap-2 sm:gap-4">
        <button
          onClick={() => setShowAbout(true)}
          className="px-4 py-2 md:px-6 md:py-3 bg-white/10 backdrop-blur-md text-white text-sm md:text-base rounded-full font-medium transition-all duration-300 hover:bg-white/20 hover:-translate-y-1 border border-white/20"
        >
          About
        </button>
        <button
          onClick={() => setShowTeam(true)}
          className="px-4 py-2 md:px-6 md:py-3 bg-white/10 backdrop-blur-md text-white text-sm md:text-base rounded-full font-medium transition-all duration-300 hover:bg-white/20 hover:-translate-y-1 border border-white/20"
        >
          Team
        </button>
      </div>

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
      <main className="relative z-10 max-w-7xl px-4 sm:px-6 md:px-8 text-center animate-fadeInUp">
        <div className="flex flex-col items-center gap-4 sm:gap-6 md:gap-8">
          {/* Title */}
          <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.5)] leading-tight animate-float px-2">
            Neural Ocean Detection Research
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 max-w-3xl leading-relaxed drop-shadow-[0_2px_10px_rgba(0,0,0,0.3)] px-4">
            Jelajahi kedalaman pengetahuan maritim dan ekosistem laut dengan platform penelitian terintegrasi
          </p>

          {/* CTA Button */}
          <Link
            ref={buttonRef}
            href="/dashboard"
            onClick={handleClick}
            className="group relative inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-8 md:px-12 py-3 sm:py-4 md:py-5 text-base sm:text-lg md:text-xl font-semibold text-[#001f3f] bg-white rounded-full transition-all duration-500 shadow-[0_10px_30px_rgba(0,0,0,0.3)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.5)] hover:-translate-y-1 active:translate-y-0 mt-2 sm:mt-4"
          >
            <span>Lihat Hasil Penelitian</span>
            <span className="text-xl sm:text-2xl transition-all duration-300 group-hover:translate-x-1">→</span>
          </Link>

          {/* Expanding Animation Overlay */}
          <AnimatePresence>
            {isExpanding && (
              <motion.div
                initial={{
                  position: 'fixed',
                  top: buttonRef.current?.getBoundingClientRect().top,
                  left: buttonRef.current?.getBoundingClientRect().left,
                  width: buttonRef.current?.offsetWidth,
                  height: buttonRef.current?.offsetHeight,
                  borderRadius: '9999px',
                }}
                animate={{
                  top: 0,
                  left: 0,
                  width: '100vw',
                  height: '100vh',
                  borderRadius: '0px',
                }}
                transition={{
                  duration: 0.2,
                  ease: [0.43, 0.13, 0.23, 0.96]
                }}
                className="bg-white z-9999"
              />
            )}
          </AnimatePresence>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mt-6 sm:mt-8 md:mt-12 w-full max-w-4xl px-2">
            <div className="flex flex-col items-center gap-3 sm:gap-4 p-5 sm:p-6 md:p-8 bg-white/10 backdrop-blur-md rounded-2xl sm:rounded-3xl border border-white/20 transition-all duration-300 hover:bg-white/15 hover:-translate-y-2">
              <span className="text-4xl sm:text-5xl drop-shadow-[0_2px_5px_rgba(0,0,0,0.3)]">🤖</span>
              <p className="text-white font-medium text-base sm:text-lg m-0">AI Detection</p>
            </div>

            <div className="flex flex-col items-center gap-3 sm:gap-4 p-5 sm:p-6 md:p-8 bg-white/10 backdrop-blur-md rounded-2xl sm:rounded-3xl border border-white/20 transition-all duration-300 hover:bg-white/15 hover:-translate-y-2">
              <span className="text-4xl sm:text-5xl drop-shadow-[0_2px_5px_rgba(0,0,0,0.3)]">🐠</span>
              <p className="text-white font-medium text-base sm:text-lg m-0">Marine Life</p>
            </div>

            <div className="flex flex-col items-center gap-3 sm:gap-4 p-5 sm:p-6 md:p-8 bg-white/10 backdrop-blur-md rounded-2xl sm:rounded-3xl border border-white/20 transition-all duration-300 hover:bg-white/15 hover:-translate-y-2 sm:col-span-2 md:col-span-1">
              <span className="text-4xl sm:text-5xl drop-shadow-[0_2px_5px_rgba(0,0,0,0.3)]">📈</span>
              <p className="text-white font-medium text-base sm:text-lg m-0">Analytics</p>
            </div>
          </div>
        </div>
      </main>

      {/* About Modal */}
      <AnimatePresence>
        {showAbout && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAbout(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-100"
            />
            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-4xl md:max-h-[90vh] bg-white rounded-3xl shadow-2xl z-101 overflow-y-auto"
            >
              <div className="p-6 md:p-12">
                {/* Close Button */}
                <button
                  onClick={() => setShowAbout(false)}
                  className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center bg-slate-100 hover:bg-slate-200 rounded-full transition-colors"
                >
                  ✕
                </button>

                {/* Content */}
                <h2 className="text-3xl md:text-4xl font-bold text-[#001f3f] mb-6 m-0">
                  About Us
                </h2>
                <p className="text-gray-700 text-lg leading-relaxed mb-8">
                  Platform penelitian maritim yang mengintegrasikan teknologi kecerdasan buatan
                  untuk deteksi dan analisis ekosistem laut. Kami berkomitmen untuk memajukan
                  pemahaman tentang kehidupan laut melalui pendekatan berbasis data dan teknologi modern.
                </p>

                {/* Mission & Vision */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="p-6 bg-slate-50 rounded-2xl">
                    <div className="text-4xl mb-3">🎯</div>
                    <h3 className="text-xl font-bold text-[#001f3f] mb-3 m-0">Misi Kami</h3>
                    <p className="text-gray-600 text-sm leading-relaxed m-0">
                      Mengembangkan solusi teknologi untuk penelitian maritim yang berkelanjutan,
                      membantu pelestarian ekosistem laut, dan mendukung komunitas peneliti.
                    </p>
                  </div>
                  <div className="p-6 bg-slate-50 rounded-2xl">
                    <div className="text-4xl mb-3">🔭</div>
                    <h3 className="text-xl font-bold text-[#001f3f] mb-3 m-0">Visi Kami</h3>
                    <p className="text-gray-600 text-sm leading-relaxed m-0">
                      Menjadi platform terdepan dalam penelitian maritim berbasis AI,
                      mendorong inovasi dalam konservasi laut.
                    </p>
                  </div>
                </div>

                {/* Features */}
                <h3 className="text-2xl font-bold text-[#001f3f] mb-6 m-0">Keunggulan Platform</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-slate-50 rounded-xl">
                    <div className="text-3xl mb-2">🤖</div>
                    <h4 className="text-lg font-bold text-[#001f3f] mb-1 m-0">AI Detection</h4>
                    <p className="text-gray-600 text-xs m-0">Deteksi otomatis spesies laut</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl">
                    <div className="text-3xl mb-2">📊</div>
                    <h4 className="text-lg font-bold text-[#001f3f] mb-1 m-0">Data Analytics</h4>
                    <p className="text-gray-600 text-xs m-0">Analisis data kompleks</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl">
                    <div className="text-3xl mb-2">🌊</div>
                    <h4 className="text-lg font-bold text-[#001f3f] mb-1 m-0">Marine Database</h4>
                    <p className="text-gray-600 text-xs m-0">Database ekosistem laut</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Team Modal */}
      <AnimatePresence>
        {showTeam && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowTeam(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-100"
            />
            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-5xl md:max-h-[90vh] bg-white rounded-3xl shadow-2xl z-101 overflow-y-auto"
            >
              <div className="p-6 md:p-12">
                {/* Close Button */}
                <button
                  onClick={() => setShowTeam(false)}
                  className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center bg-slate-100 hover:bg-slate-200 rounded-full transition-colors"
                >
                  ✕
                </button>

                {/* Content */}
                <h2 className="text-3xl md:text-4xl font-bold text-[#001f3f] mb-4 m-0">
                  Our Team
                </h2>
                <p className="text-gray-700 text-lg leading-relaxed mb-8">
                  Tim multidisiplin yang terdiri dari para ahli di bidang biologi kelautan,
                  data science, dan teknologi informasi.
                </p>

                {/* Team Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-4xl mx-auto">
                  {[
                    { name: 'Dea Kayla P D', role: 'Lead Researcher', emoji: '👩‍🔬' },
                    { name: 'Dinda Ayu P', role: 'Data Scientist', emoji: '👨‍💻' },
                    { name: 'Izza karimah', role: 'Marine Ecologist', emoji: '🌊' },
                    { name: 'Aulia Laifa K', role: 'Software Engineer', emoji: '⚙️' },
                    { name: 'Wahyu Ikbal M', role: 'Oceanographer', emoji: '🔬' },
                  ].map((member, index) => (
                    <div key={index} className="p-4 md:p-6 bg-slate-50 rounded-2xl text-center">
                      <div className="text-4xl md:text-5xl mb-2">{member.emoji}</div>
                      <h3 className="text-base md:text-lg font-bold text-[#001f3f] mb-1 m-0">
                        {member.name}
                      </h3>
                      <p className="text-cyan-600 text-xs md:text-sm font-semibold m-0">
                        {member.role}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
