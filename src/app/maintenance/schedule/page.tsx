'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Calendar, Clock, Plus, Trash2 } from 'lucide-react'

interface Schedule {
  id: string
  asset_id: string
  name: string
  description: string
  frequency_days: number
  next_maintenance: string
  asset_name: string
  asset_tag: string
}

export default function MaintenanceSchedule() {
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ assetId: '', name: '', description: '', frequencyDays: 30 })

  useEffect(() => {
    const stored = localStorage.getItem('assethawk_user')
    if (stored) {
      const data = JSON.parse(stored)
      loadSchedules(data.org?.id)
    }
  }, [])

  async function loadSchedules(orgId: string) {
    if (!orgId) return
    try {
      const res = await fetch(`/api/maintenance?orgId=${orgId}`)
      const data = await res.json()
      setSchedules(Array.isArray(data) ? data : [])
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
    
    const res = await fetch('/api/maintenance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    
    if (res.ok) {
      setShowAdd(false)
      setForm({ assetId: '', name: '', description: '', frequencyDays: 30 })
      const data = JSON.parse(stored)
      loadSchedules(data.org.id)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this schedule?')) return
    await fetch(`/api/maintenance?id=${id}`, { method: 'DELETE' })
    setSchedules(schedules.filter(s => s.id !== id))
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString()
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link href="/maintenance/dashboard" className="text-purple-600 hover:underline">← Back to Maintenance</Link>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Maintenance Schedule</h1>
          <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
            <Plus className="h-4 w-4" /> New Schedule
          </button>
        </div>

        {showAdd && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-lg font-bold mb-4">Add Maintenance Schedule</h2>
            <form onSubmit={handleAdd} className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Asset ID</label>
                <input type="text" value={form.assetId} onChange={e => setForm({...form, assetId: e.target.value})} className="w-full px-3 py-2 border rounded" placeholder="Asset ID" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Task Name</label>
                <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full px-3 py-2 border rounded" placeholder="e.g., Filter Replacement" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Frequency (days)</label>
                <input type="number" value={form.frequencyDays} onChange={e => setForm({...form, frequencyDays: parseInt(e.target.value)})} className="w-full px-3 py-2 border rounded" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <input type="text" value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full px-3 py-2 border rounded" />
              </div>
              <div className="md:col-span-2 flex gap-2">
                <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">Add Schedule</button>
                <button type="button" onClick={() => setShowAdd(false)} className="px-4 py-2 border rounded hover:bg-gray-50">Cancel</button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Asset</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Task</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Frequency</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Next Due</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr><td colSpan={5} className="px-6 py-4 text-center text-gray-500">Loading...</td></tr>
              ) : schedules.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-4 text-center text-gray-500">No schedules yet. Add one above.</td></tr>
              ) : schedules.map((s) => (
                <tr key={s.id}>
                  <td className="px-6 py-4 text-sm font-medium">{s.asset_tag || s.asset_id?.substring(0,8)}</td>
                  <td className="px-6 py-4 text-sm">{s.name}</td>
                  <td className="px-6 py-4 text-sm">Every {s.frequency_days} days</td>
                  <td className="px-6 py-4 text-sm">{s.next_maintenance ? formatDate(s.next_maintenance) : '-'}</td>
                  <td className="px-6 py-4">
                    <button onClick={() => handleDelete(s.id)} className="text-red-600 hover:text-red-700"><Trash2 className="h-4 w-4" /></button>
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
