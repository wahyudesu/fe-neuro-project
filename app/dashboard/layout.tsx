import Sidebar from '@/components/Sidebar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-slate-200">
      <Sidebar />
      <main className="flex-1 p-4 md:p-8 lg:p-12 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
