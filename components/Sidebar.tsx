'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const menuItems = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: '🏠',
  },
  {
    name: 'Upload Gambar',
    href: '/dashboard/upload',
    icon: '📤',
  },
  {
    name: 'Hasil Analisis',
    href: '/dashboard/analysis',
    icon: '📊',
  },
  {
    name: 'Data',
    href: '/dashboard/data',
    icon: '📋',
  },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-[#001f3f] text-white rounded-xl shadow-lg"
      >
        {isMobileMenuOpen ? '✕' : '☰'}
      </button>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky top-0 left-0 h-screen
          w-64 bg-white shadow-xl
          transform transition-transform duration-300 ease-in-out z-40
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo/Header */}
          <div className="p-6 border-b border-slate-200">
            <Link href="/" className="no-underline">
              <h2 className="text-xl font-bold text-[#001f3f] m-0">
                Neural Ocean
              </h2>
              <p className="text-xs text-slate-500 mt-1 m-0">Detection Research</p>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 overflow-y-auto">
            <ul className="space-y-2 list-none p-0 m-0">
              {menuItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`
                        flex items-center gap-3 px-4 py-3 rounded-xl
                        transition-all duration-200 no-underline
                        ${
                          isActive
                            ? 'bg-[#001f3f] text-white shadow-md'
                            : 'text-slate-700 hover:bg-slate-100'
                        }
                      `}
                    >
                      <span className="text-2xl">{item.icon}</span>
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-slate-200">
            <Link
              href="/"
              className="flex items-center gap-2 px-4 py-3 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors no-underline"
            >
              <span className="text-xl">←</span>
              <span className="font-medium">Kembali ke Home</span>
            </Link>
          </div>
        </div>
      </aside>
    </>
  )
}
