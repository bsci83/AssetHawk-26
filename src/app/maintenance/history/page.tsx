import Link from 'next/link'
import { CheckCircle, Clock, Wrench } from 'lucide-react'

export default function MaintenanceHistory() {
  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link href="/maintenance/dashboard" className="text-purple-600 hover:underline">← Back to Maintenance</Link>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Maintenance History</h1>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Asset</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Task</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Technician</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {[
                { date: '2026-04-18', asset: 'HVAC-001', task: 'Filter Replacement', tech: 'Mike Johnson', status: 'Completed' },
                { date: '2026-04-15', asset: 'LAPTOP-042', task: 'Battery Replacement', tech: 'Sarah Chen', status: 'Completed' },
                { date: '2026-04-10', asset: 'SERVER-003', task: 'Memory Upgrade', tech: 'Dave Wilson', status: 'Completed' },
              ].map((h, i) => (
                <tr key={i}>
                  <td className="px-6 py-4 text-sm">{h.date}</td>
                  <td className="px-6 py-4 text-sm font-medium">{h.asset}</td>
                  <td className="px-6 py-4 text-sm">{h.task}</td>
                  <td className="px-6 py-4 text-sm">{h.tech}</td>
                  <td className="px-6 py-4"><span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs flex items-center gap-1 w-fit"><CheckCircle className="h-3 w-3" />{h.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}
