'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface Prediction {
  id: number;
  image_name: string;
  image_url?: string;
  predicted_class: string;
  confidence: number;
  probability_bleached: number;
  probability_healthy: number;
  created_at: string;
}

interface Stats {
  total: number;
  healthy: number;
  bleached: number;
}

export default function DataPage() {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch predictions
      const predictionsRes = await fetch('/api/predictions');
      const predictionsData = await predictionsRes.json();

      // Fetch stats
      const statsRes = await fetch('/api/predictions/stats');
      const statsData = await statsRes.json();

      if (predictionsData.success) {
        setPredictions(predictionsData.data);
      }

      if (statsData.success) {
        setStats(statsData.data);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl">
        {error}
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-[#001f3f] mb-2 m-0">
          Prediction Data
        </h1>
        <p className="text-slate-600 text-lg m-0">
          Semua data hasil prediksi coral reef
        </p>
      </header>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl shadow-lg text-white">
            <div className="text-4xl mb-2">📊</div>
            <div className="text-3xl font-bold mb-1">{stats.total}</div>
            <div className="text-blue-100">Total Predictions</div>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-2xl shadow-lg text-white">
            <div className="text-4xl mb-2">🌊</div>
            <div className="text-3xl font-bold mb-1">{stats.healthy}</div>
            <div className="text-green-100">Healthy Corals</div>
          </div>
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-2xl shadow-lg text-white">
            <div className="text-4xl mb-2">⚠️</div>
            <div className="text-3xl font-bold mb-1">{stats.bleached}</div>
            <div className="text-orange-100">Bleached Corals</div>
          </div>
        </div>
      )}

      {/* Data Table */}
      <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-[#001f3f] m-0">
            Prediction History
          </h2>
        </div>

        {predictions.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-lg">Belum ada data prediksi</p>
            <p className="text-sm mt-2">
              Mulai dengan melakukan prediksi di halaman Predict
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Image
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Result
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Confidence
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Probabilities
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {predictions.map((pred) => (
                  <tr key={pred.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      #{pred.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {pred.image_url ? (
                        <div className="flex items-center gap-2">
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden">
                            <Image
                              src={pred.image_url as string}
                              alt={pred.image_name}
                              fill
                              className="object-cover"
                              sizes="48px"
                              unoptimized
                            />
                          </div>
                          <span className="truncate max-w-[150px]">
                            {pred.image_name}
                          </span>
                        </div>
                      ) : (
                        pred.image_name
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                          pred.predicted_class === 'Healthy'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-orange-100 text-orange-800'
                        }`}
                      >
                        {pred.predicted_class === 'Healthy' ? '🌊' : '⚠️'}{' '}
                        {pred.predicted_class}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {pred.confidence.toFixed(2)}%
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs w-16">Healthy:</span>
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-green-500 h-2 rounded-full"
                              style={{
                                width: `${pred.probability_healthy}%`,
                              }}
                            ></div>
                          </div>
                          <span className="text-xs">
                            {pred.probability_healthy.toFixed(1)}%
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs w-16">Bleached:</span>
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-orange-500 h-2 rounded-full"
                              style={{
                                width: `${pred.probability_bleached}%`,
                              }}
                            ></div>
                          </div>
                          <span className="text-xs">
                            {pred.probability_bleached.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(pred.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
