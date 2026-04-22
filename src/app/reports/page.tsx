'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { BarChart3, Download, TrendingUp, TrendingDown, Package, QrCode } from 'lucide-react'

interface Stats {
  totalAssets: number
  activeAssets: number
  maintenanceAssets: number
  retiredAssets: number
  maintenanceDue: number
  pendingWorkOrders: number
  scansThisWeek: number
}

export default function ReportsPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('assethawk_user')
    if (stored) {
      const data = JSON.parse(stored)
      loadStats(data.org?.id)
    }
  }, [])

  async function loadStats(orgId: string) {
    if (!orgId) return
    try {
      const res = await fetch(`/api/reports/stats?orgId=${orgId}`)
      const data = await res.json()
      setStats(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-500">Loading reports...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-purple-600"><rect width="5" height="5" x="3" y="3" rx="1"/><rect width="5" height="5" x="16" y="3" rx="1"/><rect width="5" height="5" x="3" y="16" rx="1"/><path d="M21 16h-3a2 2 0 0 0-2 2v3"/><path d="M21 21v.01"/><path d="M12 7v3a2 2 0 0 1-2 2H7"/><path d="M3 12h.01"/><path d="M12 3h.01"/><path d="M12 16v.01"/><path d="M16 12h1"/><path d="M21 12v.01"/><path d="M12 21v-1"/></svg>
            <span className="text-2xl font-bold text-gray-900">AssetHawk</span>
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-500">Total Assets</span>
              <Package className="h-5 w-5 text-purple-600" />
            </div>
            <p className="text-3xl font-bold">{stats?.totalAssets || 0}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-500">Scans This Week</span>
              <QrCode className="h-5 w-5 text-blue-600" />
            </div>
            <p className="text-3xl font-bold">{stats?.scansThisWeek || 0}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-500">Active Assets</span>
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
            <p className="text-3xl font-bold">{stats?.activeAssets || 0}</p>
            <p className="text-sm text-gray-500 mt-1">
              {stats?.totalAssets ? Math.round((stats.activeAssets / stats.totalAssets) * 100) : 0}% of total
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-500">Maintenance Due</span>
              <TrendingDown className="h-5 w-5 text-orange-600" />
            </div>
            <p className="text-3xl font-bold">{stats?.maintenanceDue || 0}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold mb-4">Asset Status Distribution</h2>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Active</span>
                  <span>{stats?.activeAssets || 0}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded">
                  <div className="h-2 bg-green-500 rounded" style={{ width: `${stats?.totalAssets ? (stats.activeAssets / stats.totalAssets) * 100 : 0}%` }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Maintenance</span>
                  <span>{stats?.maintenanceAssets || 0}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded">
                  <div className="h-2 bg-yellow-500 rounded" style={{ width: `${stats?.totalAssets ? (stats.maintenanceAssets / stats.totalAssets) * 100 : 0}%` }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Retired</span>
                  <span>{stats?.retiredAssets || 0}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded">
                  <div className="h-2 bg-gray-400 rounded" style={{ width: `${stats?.totalAssets ? (stats.retiredAssets / stats.totalAssets) * 100 : 0}%` }} />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold mb-4">Work Orders</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-yellow-50 rounded">
                <span className="text-sm font-medium">Pending</span>
                <span className="text-lg font-bold text-yellow-700">{stats?.pendingWorkOrders || 0}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
                <span className="text-sm font-medium">In Progress</span>
                <span className="text-lg font-bold text-blue-700">0</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                <span className="text-sm font-medium">Completed</span>
                <span className="text-lg font-bold text-green-700">0</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
