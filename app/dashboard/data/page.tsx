'use client'
import { useState } from 'react'

// Dummy data
const researchData = [
  {
    id: 1,
    date: '2025-11-18',
    location: 'Raja Ampat, Papua Barat',
    species: 'Ikan Badut (Clownfish)',
    scientificName: 'Amphiprioninae',
    count: 45,
    depth: '5-15 meter',
    temperature: '27°C',
    status: 'Sehat',
    researcher: 'Dr. Dea Kayla',
  },
  {
    id: 2,
    date: '2025-11-17',
    location: 'Kepulauan Seribu, Jakarta',
    species: 'Pari Manta (Manta Ray)',
    scientificName: 'Manta birostris',
    count: 8,
    depth: '20-40 meter',
    temperature: '26°C',
    status: 'Sehat',
    researcher: 'Dr. Wahyu Ikbal',
  },
  {
    id: 3,
    date: '2025-11-16',
    location: 'Bunaken, Sulawesi Utara',
    species: 'Hiu Paus (Whale Shark)',
    scientificName: 'Rhincodon typus',
    count: 3,
    depth: '10-30 meter',
    temperature: '28°C',
    status: 'Sehat',
    researcher: 'Dr. Izza Karimah',
  },
  {
    id: 4,
    date: '2025-11-15',
    location: 'Wakatobi, Sulawesi Tenggara',
    species: 'Penyu Hijau (Green Turtle)',
    scientificName: 'Chelonia mydas',
    count: 12,
    depth: '2-10 meter',
    temperature: '27°C',
    status: 'Terancam',
    researcher: 'Dr. Dinda Ayu',
  },
  {
    id: 5,
    date: '2025-11-14',
    location: 'Derawan, Kalimantan Timur',
    species: 'Kuda Laut (Seahorse)',
    scientificName: 'Hippocampus',
    count: 28,
    depth: '3-8 meter',
    temperature: '26°C',
    status: 'Sehat',
    researcher: 'Dr. Aulia Laifa',
  },
  {
    id: 6,
    date: '2025-11-13',
    location: 'Gili Trawangan, Lombok',
    species: 'Ikan Napoleon (Napoleon Wrasse)',
    scientificName: 'Cheilinus undulatus',
    count: 6,
    depth: '15-25 meter',
    temperature: '27°C',
    status: 'Terancam',
    researcher: 'Dr. Dea Kayla',
  },
  {
    id: 7,
    date: '2025-11-12',
    location: 'Nusa Penida, Bali',
    species: 'Ikan Mola-Mola (Ocean Sunfish)',
    scientificName: 'Mola mola',
    count: 4,
    depth: '25-50 meter',
    temperature: '25°C',
    status: 'Sehat',
    researcher: 'Dr. Wahyu Ikbal',
  },
  {
    id: 8,
    date: '2025-11-11',
    location: 'Pulau Komodo, NTT',
    species: 'Lumba-lumba (Dolphin)',
    scientificName: 'Delphinus delphis',
    count: 35,
    depth: '5-20 meter',
    temperature: '28°C',
    status: 'Sehat',
    researcher: 'Dr. Izza Karimah',
  },
  {
    id: 9,
    date: '2025-11-10',
    location: 'Karimunjawa, Jawa Tengah',
    species: 'Terumbu Karang (Coral Reef)',
    scientificName: 'Acropora',
    count: 150,
    depth: '1-15 meter',
    temperature: '27°C',
    status: 'Rusak Sebagian',
    researcher: 'Dr. Dinda Ayu',
  },
  {
    id: 10,
    date: '2025-11-09',
    location: 'Anyer, Banten',
    species: 'Ubur-ubur (Jellyfish)',
    scientificName: 'Aurelia aurita',
    count: 67,
    depth: '0-10 meter',
    temperature: '26°C',
    status: 'Sehat',
    researcher: 'Dr. Aulia Laifa',
  },
  {
    id: 11,
    date: '2025-11-08',
    location: 'Morotai, Maluku Utara',
    species: 'Ikan Pari Elang (Eagle Ray)',
    scientificName: 'Aetobatus narinari',
    count: 11,
    depth: '10-30 meter',
    temperature: '27°C',
    status: 'Sehat',
    researcher: 'Dr. Dea Kayla',
  },
  {
    id: 12,
    date: '2025-11-07',
    location: 'Biak, Papua',
    species: 'Ikan Kakap Merah (Red Snapper)',
    scientificName: 'Lutjanus campechanus',
    count: 52,
    depth: '20-40 meter',
    temperature: '28°C',
    status: 'Sehat',
    researcher: 'Dr. Wahyu Ikbal',
  },
]

export default function DataPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'Sehat' | 'Terancam' | 'Rusak Sebagian'>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8

  // Filter data
  const filteredData = researchData.filter((item) => {
    const matchesSearch =
      item.species.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.scientificName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage)

  // Download function
  const handleDownloadCSV = () => {
    const headers = [
      'ID',
      'Tanggal',
      'Lokasi',
      'Spesies',
      'Nama Ilmiah',
      'Jumlah',
      'Kedalaman',
      'Suhu',
      'Status',
      'Peneliti',
    ]

    const csvContent = [
      headers.join(','),
      ...filteredData.map((item) =>
        [
          item.id,
          item.date,
          `"${item.location}"`,
          `"${item.species}"`,
          `"${item.scientificName}"`,
          item.count,
          `"${item.depth}"`,
          item.temperature,
          item.status,
          `"${item.researcher}"`,
        ].join(',')
      ),
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `data-penelitian-${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleDownloadJSON = () => {
    const jsonContent = JSON.stringify(filteredData, null, 2)
    const blob = new Blob([jsonContent], { type: 'application/json' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `data-penelitian-${new Date().toISOString().split('T')[0]}.json`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div>
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-[#001f3f] mb-2 m-0">
          Data Penelitian
        </h1>
        <p className="text-slate-600 text-lg m-0">
          Database lengkap hasil penelitian maritim
        </p>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <div className="text-3xl mb-2">📊</div>
          <div className="text-2xl font-bold text-[#001f3f]">{researchData.length}</div>
          <div className="text-sm text-slate-500">Total Data</div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <div className="text-3xl mb-2">🌊</div>
          <div className="text-2xl font-bold text-blue-600">
            {new Set(researchData.map((d) => d.location)).size}
          </div>
          <div className="text-sm text-slate-500">Lokasi Penelitian</div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <div className="text-3xl mb-2">🐠</div>
          <div className="text-2xl font-bold text-green-600">
            {new Set(researchData.map((d) => d.species)).size}
          </div>
          <div className="text-sm text-slate-500">Spesies Berbeda</div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <div className="text-3xl mb-2">👨‍🔬</div>
          <div className="text-2xl font-bold text-purple-600">
            {new Set(researchData.map((d) => d.researcher)).size}
          </div>
          <div className="text-sm text-slate-500">Peneliti</div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white p-4 md:p-6 rounded-2xl shadow-lg mb-6">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          {/* Search */}
          <div className="flex-1">
            <input
              type="text"
              placeholder="Cari spesies, lokasi, atau nama ilmiah..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#001f3f] focus:border-transparent"
            />
          </div>

          {/* Download Buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleDownloadCSV}
              className="px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition-all duration-300 hover:-translate-y-1 hover:shadow-lg flex items-center gap-2"
            >
              <span>📥</span>
              <span className="hidden sm:inline">CSV</span>
            </button>
            <button
              onClick={handleDownloadJSON}
              className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all duration-300 hover:-translate-y-1 hover:shadow-lg flex items-center gap-2"
            >
              <span>📥</span>
              <span className="hidden sm:inline">JSON</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              statusFilter === 'all'
                ? 'bg-[#001f3f] text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Semua ({researchData.length})
          </button>
          <button
            onClick={() => setStatusFilter('Sehat')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              statusFilter === 'Sehat'
                ? 'bg-green-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Sehat ({researchData.filter((d) => d.status === 'Sehat').length})
          </button>
          <button
            onClick={() => setStatusFilter('Terancam')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              statusFilter === 'Terancam'
                ? 'bg-yellow-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Terancam ({researchData.filter((d) => d.status === 'Terancam').length})
          </button>
          <button
            onClick={() => setStatusFilter('Rusak Sebagian')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              statusFilter === 'Rusak Sebagian'
                ? 'bg-red-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Rusak Sebagian ({researchData.filter((d) => d.status === 'Rusak Sebagian').length})
          </button>
        </div>
      </div>

      {/* Table - Desktop View */}
      <div className="hidden lg:block bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-4 text-left text-sm font-semibold text-slate-700">ID</th>
                <th className="px-4 py-4 text-left text-sm font-semibold text-slate-700">Tanggal</th>
                <th className="px-4 py-4 text-left text-sm font-semibold text-slate-700">Lokasi</th>
                <th className="px-4 py-4 text-left text-sm font-semibold text-slate-700">Spesies</th>
                <th className="px-4 py-4 text-left text-sm font-semibold text-slate-700">Nama Ilmiah</th>
                <th className="px-4 py-4 text-left text-sm font-semibold text-slate-700">Jumlah</th>
                <th className="px-4 py-4 text-left text-sm font-semibold text-slate-700">Kedalaman</th>
                <th className="px-4 py-4 text-left text-sm font-semibold text-slate-700">Suhu</th>
                <th className="px-4 py-4 text-left text-sm font-semibold text-slate-700">Status</th>
                <th className="px-4 py-4 text-left text-sm font-semibold text-slate-700">Peneliti</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {paginatedData.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-4 text-sm text-slate-700">{item.id}</td>
                  <td className="px-4 py-4 text-sm text-slate-700 whitespace-nowrap">
                    {new Date(item.date).toLocaleDateString('id-ID')}
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-700">{item.location}</td>
                  <td className="px-4 py-4 text-sm font-medium text-[#001f3f]">{item.species}</td>
                  <td className="px-4 py-4 text-sm text-slate-600 italic">{item.scientificName}</td>
                  <td className="px-4 py-4 text-sm text-slate-700 text-center">{item.count}</td>
                  <td className="px-4 py-4 text-sm text-slate-700 whitespace-nowrap">{item.depth}</td>
                  <td className="px-4 py-4 text-sm text-slate-700">{item.temperature}</td>
                  <td className="px-4 py-4 text-sm">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                        item.status === 'Sehat'
                          ? 'bg-green-100 text-green-700'
                          : item.status === 'Terancam'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-700 whitespace-nowrap">
                    {item.researcher}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
            <div className="text-sm text-slate-600">
              Menampilkan {startIndex + 1} - {Math.min(startIndex + itemsPerPage, filteredData.length)} dari{' '}
              {filteredData.length} data
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  currentPage === 1
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                ← Prev
              </button>
              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 rounded-lg font-medium transition-all ${
                      currentPage === page
                        ? 'bg-[#001f3f] text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  currentPage === totalPages
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Card View - Mobile/Tablet */}
      <div className="lg:hidden space-y-4 mb-6">
        {paginatedData.map((item) => (
          <div key={item.id} className="bg-white p-5 rounded-2xl shadow-lg">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="text-xs text-slate-500 mb-1">ID #{item.id}</div>
                <h3 className="text-lg font-bold text-[#001f3f] mb-1 m-0">{item.species}</h3>
                <p className="text-sm text-slate-600 italic m-0">{item.scientificName}</p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                  item.status === 'Sehat'
                    ? 'bg-green-100 text-green-700'
                    : item.status === 'Terancam'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {item.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <div className="text-slate-500 text-xs mb-1">📅 Tanggal</div>
                <div className="font-medium text-slate-700">
                  {new Date(item.date).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
                </div>
              </div>
              <div>
                <div className="text-slate-500 text-xs mb-1">📍 Lokasi</div>
                <div className="font-medium text-slate-700">{item.location}</div>
              </div>
              <div>
                <div className="text-slate-500 text-xs mb-1">🔢 Jumlah</div>
                <div className="font-medium text-slate-700">{item.count} individu</div>
              </div>
              <div>
                <div className="text-slate-500 text-xs mb-1">🌊 Kedalaman</div>
                <div className="font-medium text-slate-700">{item.depth}</div>
              </div>
              <div>
                <div className="text-slate-500 text-xs mb-1">🌡️ Suhu</div>
                <div className="font-medium text-slate-700">{item.temperature}</div>
              </div>
              <div>
                <div className="text-slate-500 text-xs mb-1">👨‍🔬 Peneliti</div>
                <div className="font-medium text-slate-700">{item.researcher}</div>
              </div>
            </div>
          </div>
        ))}

        {/* Mobile Pagination */}
        {totalPages > 1 && (
          <div className="bg-white p-4 rounded-2xl shadow-lg">
            <div className="text-sm text-slate-600 text-center mb-4">
              Halaman {currentPage} dari {totalPages}
            </div>
            <div className="flex gap-2 justify-center">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all ${
                  currentPage === 1
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                ← Prev
              </button>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all ${
                  currentPage === totalPages
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Info */}
      {filteredData.length === 0 && (
        <div className="bg-white p-12 rounded-2xl shadow-lg text-center">
          <div className="text-6xl mb-4">🔍</div>
          <p className="text-slate-500 text-lg m-0">Tidak ada data yang sesuai dengan pencarian</p>
        </div>
      )}
    </div>
  )
}
