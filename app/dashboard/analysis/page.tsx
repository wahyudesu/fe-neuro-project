'use client'
import { useState } from 'react'

// Sample data
const sampleAnalysis = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400',
    species: 'Ikan Badut (Clownfish)',
    confidence: 95.8,
    date: '2025-11-18',
    status: 'completed',
    details: {
      habitat: 'Terumbu Karang',
      size: 'Sedang (10-15 cm)',
      behavior: 'Simbiosis dengan anemon',
    },
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1535591273668-578e31182c4f?w=400',
    species: 'Pari Manta (Manta Ray)',
    confidence: 92.3,
    date: '2025-11-17',
    status: 'completed',
    details: {
      habitat: 'Perairan Terbuka',
      size: 'Besar (3-5 meter)',
      behavior: 'Perenang aktif',
    },
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=400',
    species: 'Hiu Paus (Whale Shark)',
    confidence: 89.5,
    date: '2025-11-16',
    status: 'completed',
    details: {
      habitat: 'Perairan Tropis',
      size: 'Sangat Besar (8-12 meter)',
      behavior: 'Filter feeder',
    },
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400',
    species: 'Penyu Hijau (Green Turtle)',
    confidence: 97.2,
    date: '2025-11-15',
    status: 'completed',
    details: {
      habitat: 'Perairan Dangkal',
      size: 'Besar (80-150 cm)',
      behavior: 'Herbivora',
    },
  },
]

export default function AnalysisPage() {
  const [selectedAnalysis, setSelectedAnalysis] = useState<number | null>(null)
  const [filter, setFilter] = useState<'all' | 'high' | 'medium'>('all')

  const filteredAnalysis = sampleAnalysis.filter((item) => {
    if (filter === 'high') return item.confidence >= 90
    if (filter === 'medium') return item.confidence >= 80 && item.confidence < 90
    return true
  })

  const selectedItem = sampleAnalysis.find((item) => item.id === selectedAnalysis)

  return (
    <div>
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-[#001f3f] mb-2 m-0">
          Hasil Analisis
        </h1>
        <p className="text-slate-600 text-lg m-0">
          Lihat hasil deteksi dan analisis gambar
        </p>
      </header>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <div className="text-3xl mb-2">📊</div>
          <div className="text-2xl font-bold text-[#001f3f]">
            {sampleAnalysis.length}
          </div>
          <div className="text-sm text-slate-500">Total Analisis</div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <div className="text-3xl mb-2">✅</div>
          <div className="text-2xl font-bold text-green-600">
            {sampleAnalysis.filter((a) => a.confidence >= 90).length}
          </div>
          <div className="text-sm text-slate-500">High Confidence</div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <div className="text-3xl mb-2">🐠</div>
          <div className="text-2xl font-bold text-blue-600">
            {new Set(sampleAnalysis.map((a) => a.species)).size}
          </div>
          <div className="text-sm text-slate-500">Spesies Unik</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 md:p-6 rounded-2xl shadow-lg mb-6">
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setFilter('all')}
            className={`
              px-4 py-2 rounded-lg font-medium transition-all duration-300
              ${
                filter === 'all'
                  ? 'bg-[#001f3f] text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }
            `}
          >
            Semua ({sampleAnalysis.length})
          </button>
          <button
            onClick={() => setFilter('high')}
            className={`
              px-4 py-2 rounded-lg font-medium transition-all duration-300
              ${
                filter === 'high'
                  ? 'bg-green-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }
            `}
          >
            High Confidence (≥90%)
          </button>
          <button
            onClick={() => setFilter('medium')}
            className={`
              px-4 py-2 rounded-lg font-medium transition-all duration-300
              ${
                filter === 'medium'
                  ? 'bg-yellow-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }
            `}
          >
            Medium Confidence (80-90%)
          </button>
        </div>
      </div>

      {/* Analysis Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* List */}
        <div className="space-y-4">
          {filteredAnalysis.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedAnalysis(item.id)}
              className={`
                bg-white p-4 md:p-6 rounded-2xl shadow-lg
                cursor-pointer transition-all duration-300
                hover:-translate-y-1 hover:shadow-xl
                ${selectedAnalysis === item.id ? 'ring-2 ring-[#001f3f]' : ''}
              `}
            >
              <div className="flex gap-4">
                <div className="w-24 h-24 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                  <img
                    src={item.image}
                    alt={item.species}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-[#001f3f] mb-1 m-0 truncate">
                    {item.species}
                  </h3>
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className={`
                      px-3 py-1 rounded-full text-xs font-semibold
                      ${
                        item.confidence >= 90
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }
                    `}
                    >
                      {item.confidence}% Confidence
                    </div>
                  </div>
                  <p className="text-sm text-slate-500 m-0">
                    📅 {new Date(item.date).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Detail Panel */}
        <div className="lg:sticky lg:top-4 h-fit">
          {selectedItem ? (
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg">
              <div className="aspect-video rounded-xl overflow-hidden bg-slate-100 mb-6">
                <img
                  src={selectedItem.image}
                  alt={selectedItem.species}
                  className="w-full h-full object-cover"
                />
              </div>

              <h2 className="text-2xl font-bold text-[#001f3f] mb-4 m-0">
                {selectedItem.species}
              </h2>

              <div className="space-y-4 mb-6">
                <div>
                  <div className="text-sm text-slate-500 mb-1">Confidence Level</div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-3 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${
                          selectedItem.confidence >= 90
                            ? 'bg-green-500'
                            : 'bg-yellow-500'
                        }`}
                        style={{ width: `${selectedItem.confidence}%` }}
                      />
                    </div>
                    <span className="text-lg font-bold text-[#001f3f]">
                      {selectedItem.confidence}%
                    </span>
                  </div>
                </div>

                <div>
                  <div className="text-sm text-slate-500 mb-2">Detail Informasi</div>
                  <div className="space-y-2">
                    <div className="flex justify-between p-3 bg-slate-50 rounded-lg">
                      <span className="text-slate-600">Habitat</span>
                      <span className="font-semibold text-[#001f3f]">
                        {selectedItem.details.habitat}
                      </span>
                    </div>
                    <div className="flex justify-between p-3 bg-slate-50 rounded-lg">
                      <span className="text-slate-600">Ukuran</span>
                      <span className="font-semibold text-[#001f3f]">
                        {selectedItem.details.size}
                      </span>
                    </div>
                    <div className="flex justify-between p-3 bg-slate-50 rounded-lg">
                      <span className="text-slate-600">Perilaku</span>
                      <span className="font-semibold text-[#001f3f]">
                        {selectedItem.details.behavior}
                      </span>
                    </div>
                    <div className="flex justify-between p-3 bg-slate-50 rounded-lg">
                      <span className="text-slate-600">Tanggal Analisis</span>
                      <span className="font-semibold text-[#001f3f]">
                        {new Date(selectedItem.date).toLocaleDateString('id-ID')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button className="flex-1 px-4 py-3 bg-[#001f3f] text-white rounded-xl font-medium transition-all duration-300 hover:bg-[#003d5c] hover:-translate-y-1">
                  Download Report
                </button>
                <button className="px-4 py-3 bg-slate-100 text-slate-600 rounded-xl font-medium transition-all duration-300 hover:bg-slate-200">
                  Share
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white p-12 rounded-2xl shadow-lg text-center">
              <div className="text-6xl mb-4">👈</div>
              <p className="text-slate-500 text-lg m-0">
                Pilih hasil analisis untuk melihat detail
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
