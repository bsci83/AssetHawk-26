'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Wrench, Clock, AlertCircle, CheckCircle } from 'lucide-react'

interface Stats {
  dueThisWeek: number
  overdue: number
  completed: number
  total: number
}

export default function MaintenanceDashboard() {
  const [stats, setStats] = useState<Stats>({ dueThisWeek: 0, overdue: 0, completed: 0, total: 0 })
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
      setStats({
        dueThisWeek: data.maintenanceDue || 0,
        overdue: 0,
        completed: 0,
        total: data.maintenanceDue || 0
      })
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link href="/" className="flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-purple-600"><rect width="5" height="5" x="3" y="3" rx="1"/><rect width="5" height="5" x="16" y="3" rx="1"/><rect width="5" height="5" x="3" y="16" rx="1"/><path d="M21 16h-3a2 2 0 0 0-2 2v3"/><path d="M21 21v.01"/><path d="M12 7v3a2 2 0 0 1-2 2H7"/><path d="M3 12h.01"/><path d="M12 3h.01"/><path d="M12 16v.01"/><path d="M16 12h1"/><path d="M21 12v.01"/><path d="M12 21v-1"/></svg>
            <span className="text-2xl font-bold text-gray-900">AssetHawk</span>
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Maintenance</h1>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Due This Week</p>
                <p className="text-2xl font-semibold text-orange-600">{loading ? '-' : stats.dueThisWeek}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Overdue</p>
                <p className="text-2xl font-semibold text-red-600">{loading ? '-' : stats.overdue}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-semibold text-green-600">{loading ? '-' : stats.completed}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Schedules</p>
                <p className="text-2xl font-semibold text-purple-600">{loading ? '-' : stats.total}</p>
              </div>
              <Wrench className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Link href="/maintenance/schedule" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-bold mb-2">Schedule</h3>
            <p className="text-gray-600 text-sm">View and manage maintenance schedules</p>
          </Link>
          <Link href="/maintenance/history" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-bold mb-2">History</h3>
            <p className="text-gray-600 text-sm">View past maintenance records</p>
          </Link>
          <Link href="/maintenance/work-orders" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-bold mb-2">Work Orders</h3>
            <p className="text-gray-600 text-sm">Create and track work orders</p>
          </Link>
        </div>
      </main>
    </div>
  )
}
