'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'

// Define the analysis type
type AnalysisItem = {
  id: number
  image_name: string
  image_url: string | null
  predicted_class: string
  confidence: number
  probability_bleached: number
  probability_healthy: number
  created_at: string
}

export default function AnalysisPage() {
  const [analyses, setAnalyses] = useState<AnalysisItem[]>([])
  const [selectedAnalysis, setSelectedAnalysis] = useState<number | null>(null)
  const [filter, setFilter] = useState<'all' | 'high' | 'medium'>('all')
  const [loading, setLoading] = useState(true)

  // Fetch analyses from API
  useEffect(() => {
    const fetchAnalyses = async () => {
      try {
        const response = await fetch('/api/predictions')
        const data = await response.json()
        if (data.success) {
          setAnalyses(data.data)
        }
      } catch (error) {
        console.error('Failed to fetch analyses:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalyses()
  }, [])

  const filteredAnalysis = analyses.filter((item) => {
    if (filter === 'high') return item.confidence >= 90
    if (filter === 'medium') return item.confidence >= 80 && item.confidence < 90
    return true
  })

  const selectedItem = analyses.find((item) => item.id === selectedAnalysis)

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
            {analyses.length}
          </div>
          <div className="text-sm text-slate-500">Total Analisis</div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <div className="text-3xl mb-2">✅</div>
          <div className="text-2xl font-bold text-green-600">
            {analyses.filter((a) => a.confidence >= 90).length}
          </div>
          <div className="text-sm text-slate-500">High Confidence</div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <div className="text-3xl mb-2">🐠</div>
          <div className="text-2xl font-bold text-blue-600">
            {new Set(analyses.map((a) => a.predicted_class)).size}
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
            Semua ({analyses.length})
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
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#001f3f]"></div>
              <p className="mt-2 text-slate-600">Memuat data...</p>
            </div>
          ) : filteredAnalysis.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-slate-600">Belum ada data analisis</p>
            </div>
          ) : (
            filteredAnalysis.map((item) => (
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
                    <div className="relative w-full h-full">
                      <Image
                        src={item.image_url || 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400'}
                        alt={item.predicted_class}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 50vw, 33vw"
                      />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-[#001f3f] mb-1 m-0 truncate">
                      {item.predicted_class}
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
                        {item.confidence.toFixed(1)}% Confidence
                      </div>
                    </div>
                    <p className="text-sm text-slate-500 m-0">
                      📅 {new Date(item.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Detail Panel */}
        <div className="lg:sticky lg:top-4 h-fit">
          {selectedItem ? (
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg">
              <div className="aspect-video rounded-xl overflow-hidden bg-slate-100 mb-6">
                <div className="relative w-full h-full">
                  <Image
                    src={selectedItem.image_url || 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400'}
                    alt={selectedItem.predicted_class}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 50vw"
                  />
                </div>
              </div>

              <h2 className="text-2xl font-bold text-[#001f3f] mb-4 m-0">
                {selectedItem.predicted_class}
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
                      {selectedItem.confidence.toFixed(1)}%
                    </span>
                  </div>
                </div>

                <div>
                  <div className="text-sm text-slate-500 mb-2">Detail Informasi</div>
                  <div className="space-y-2">
                    <div className="flex justify-between p-3 bg-slate-50 rounded-lg">
                      <span className="text-slate-600">Confidence</span>
                      <span className="font-semibold text-[#001f3f]">
                        {selectedItem.confidence.toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between p-3 bg-slate-50 rounded-lg">
                      <span className="text-slate-600">Probabilitas Bleached</span>
                      <span className="font-semibold text-[#001f3f]">
                        {(selectedItem.probability_bleached * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between p-3 bg-slate-50 rounded-lg">
                      <span className="text-slate-600">Probabilitas Healthy</span>
                      <span className="font-semibold text-[#001f3f]">
                        {(selectedItem.probability_healthy * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between p-3 bg-slate-50 rounded-lg">
                      <span className="text-slate-600">Tanggal Analisis</span>
                      <span className="font-semibold text-[#001f3f]">
                        {new Date(selectedItem.created_at).toLocaleDateString('id-ID')}
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