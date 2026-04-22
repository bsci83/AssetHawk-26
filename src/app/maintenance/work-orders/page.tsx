'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { FileText, Clock, CheckCircle, AlertCircle, Plus } from 'lucide-react'

interface WorkOrder {
  id: string
  asset_id: string
  title: string
  description: string
  priority: string
  status: string
  asset_name: string
  asset_tag: string
  created_at: string
}

export default function WorkOrders() {
  const [orders, setOrders] = useState<WorkOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ assetId: '', title: '', description: '', priority: 'medium' })

  useEffect(() => {
    const stored = localStorage.getItem('assethawk_user')
    if (stored) {
      const data = JSON.parse(stored)
      loadOrders(data.org?.id)
    }
  }, [])

  async function loadOrders(orgId: string) {
    if (!orgId) return
    try {
      const res = await fetch(`/api/work-orders?orgId=${orgId}`)
      const data = await res.json()
      setOrders(Array.isArray(data) ? data : [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    const stored = localStorage.getItem('assethawk_user')
    if (!stored) return
    const data = JSON.parse(stored)

    const res = await fetch('/api/work-orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, createdByUserId: data.user?.id })
    })

    if (res.ok) {
      setShowAdd(false)
      setForm({ assetId: '', title: '', description: '', priority: 'medium' })
      loadOrders(data.org?.id)
    }
  }

  async function handleStatusChange(id: string, status: string) {
    await fetch('/api/work-orders', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status, completedAt: status === 'completed' ? new Date().toISOString() : null })
    })
    setOrders(orders.map(o => o.id === id ? { ...o, status } : o))
  }

  const pending = orders.filter(o => o.status === 'pending').length
  const inProgress = orders.filter(o => o.status === 'in_progress').length
  const completed = orders.filter(o => o.status === 'completed').length

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link href="/maintenance/dashboard" className="text-purple-600 hover:underline">← Back to Maintenance</Link>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Work Orders</h1>
          <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
            <Plus className="h-4 w-4" /> New Work Order
          </button>
        </div>

        {showAdd && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-lg font-bold mb-4">Create Work Order</h2>
            <form onSubmit={handleAdd} className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Asset ID</label>
                <input type="text" value={form.assetId} onChange={e => setForm({...form, assetId: e.target.value})} className="w-full px-3 py-2 border rounded" placeholder="Asset ID" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Priority</label>
                <select value={form.priority} onChange={e => setForm({...form, priority: e.target.value})} className="w-full px-3 py-2 border rounded">
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Title</label>
                <input type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full px-3 py-2 border rounded" required />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full px-3 py-2 border rounded" rows={2} />
              </div>
              <div className="md:col-span-2 flex gap-2">
                <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">Create</button>
                <button type="button" onClick={() => setShowAdd(false)} className="px-4 py-2 border rounded hover:bg-gray-50">Cancel</button>
              </div>
            </form>
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-yellow-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-5 w-5 text-yellow-600" />
              <span className="font-medium">Pending</span>
            </div>
            <p className="text-2xl font-bold text-yellow-700">{pending}</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="h-5 w-5 text-blue-600" />
              <span className="font-medium">In Progress</span>
            </div>
            <p className="text-2xl font-bold text-blue-700">{inProgress}</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="font-medium">Completed</span>
            </div>
            <p className="text-2xl font-bold text-green-700">{completed}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">WO#</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Asset</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr><td colSpan={5} className="px-6 py-4 text-center">Loading...</td></tr>
              ) : orders.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-4 text-center text-gray-500">No work orders yet</td></tr>
              ) : orders.map((w) => (
                <tr key={w.id}>
                  <td className="px-6 py-4 text-sm font-mono">{w.id.substring(0, 8)}</td>
                  <td className="px-6 py-4 text-sm font-medium">{w.asset_tag || '-'}</td>
                  <td className="px-6 py-4 text-sm">{w.title}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs ${w.priority === 'high' ? 'bg-red-100 text-red-700' : w.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'}`}>
                      {w.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <select value={w.status} onChange={e => handleStatusChange(w.id, e.target.value)} className="text-sm border rounded px-2 py-1">
                      <option value="pending">Pending</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}
