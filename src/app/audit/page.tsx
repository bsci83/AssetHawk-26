'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { BarChart3, Shield, AlertTriangle, CheckCircle, Clock, TrendingUp, QrCode } from 'lucide-react'

interface AuditEvent {
  id: string
  action: string
  entity_type: string
  entity_id: string
  description: string
  user_id: string
  created_at: string
}

export default function AuditPage() {
  const [events, setEvents] = useState<AuditEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ total: 0, scans: 0, security: 0 })

  useEffect(() => {
    const stored = localStorage.getItem('assethawk_user')
    if (stored) {
      const data = JSON.parse(stored)
      loadAudit(data.org?.id)
      loadStats(data.org?.id)
    }
  }, [])

  async function loadAudit(orgId: string) {
    if (!orgId) return
    try {
      const res = await fetch(`/api/audit?orgId=${orgId}`)
      const data = await res.json()
      setEvents(Array.isArray(data) ? data : [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  async function loadStats(orgId: string) {
    if (!orgId) return
    try {
      const res = await fetch(`/api/reports/stats?orgId=${orgId}`)
      const data = await res.json()
      setStats({ total: data.totalAssets || 0, scans: data.scansThisWeek || 0, security: 0 })
    } catch (e) {
      console.error(e)
    }
  }

  function getActionIcon(type: string) {
    switch (type) {
      case 'create': return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'scan': return <QrCode className="h-5 w-5 text-blue-500" />
      case 'update': return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      case 'delete': return <AlertTriangle className="h-5 w-5 text-red-500" />
      default: return <Shield className="h-5 w-5 text-gray-500" />
    }
  }

  function formatTime(dateStr: string) {
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    if (diffMins < 1) return 'just now'
    if (diffMins < 60) return `${diffMins} min ago`
    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
    return date.toLocaleDateString()
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
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Audit Trail</h1>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Events</p>
                <p className="text-2xl font-semibold text-gray-900">{events.length || stats.total}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Scans This Week</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.scans}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Security Events</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.security}</p>
              </div>
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Response</p>
                <p className="text-2xl font-semibold text-gray-900">&lt;1s</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-semibold">Recent Activity</h2>
          </div>
          {loading ? (
            <div className="p-6 text-center text-gray-500">Loading...</div>
          ) : events.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <p>No activity yet. Start by scanning a QR code or creating an asset.</p>
              <Link href="/assets" className="text-purple-600 hover:underline mt-2 inline-block">Go to Assets →</Link>
            </div>
          ) : (
            <div className="divide-y">
              {events.map((event) => (
                <div key={event.id} className="px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {getActionIcon(event.action)}
                    <div>
                      <p className="text-sm font-medium text-gray-900">{event.description || event.action}</p>
                      <p className="text-xs text-gray-500">{event.entity_type}</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-400">{formatTime(event.created_at)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
