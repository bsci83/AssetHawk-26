import Link from 'next/link'
import { BarChart3, Shield } from 'lucide-react'

export default function OrgAuditPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white shadow-sm border-b"><div className="max-w-7xl mx-auto px-4 py-4"><Link href="/organization" className="text-purple-600 hover:underline">← Organization</Link></div></header>
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Organization Audit</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600">Audit logs for your organization appear here.</p>
        </div>
      </main>
    </div>
  )
}
