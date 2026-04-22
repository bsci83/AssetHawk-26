'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Settings } from 'lucide-react'

export default function OrgSettingsPage() {
  const [form, setForm] = useState({ name: '', description: '' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('assethawk_user')
    if (stored) {
      const data = JSON.parse(stored)
      loadOrg(data.org?.id)
    }
  }, [])

  async function loadOrg(orgId: string) {
    if (!orgId) return
    try {
      const res = await fetch(`/api/organizations/${orgId}`)
      if (res.ok) {
        const data = await res.json()
        setForm({ name: data.name || '', description: data.description || '' })
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    const stored = localStorage.getItem('assethawk_user')
    if (!stored) return
    const data = JSON.parse(stored)
    
    setSaving(true)
    try {
      await fetch(`/api/organizations/${data.org?.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (e) {
      console.error(e)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link href="/organization" className="text-purple-600 hover:underline">← Organization</Link>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Organization Settings</h1>
        
        <form onSubmit={handleSave} className="bg-white rounded-lg shadow p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Organization Name</label>
            <input
              type="text"
              value={form.name}
              onChange={e => setForm({...form, name: e.target.value})}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="My Organization"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={e => setForm({...form, description: e.target.value})}
              className="w-full px-3 py-2 border rounded-md"
              rows={3}
              placeholder="Brief description of your organization"
            />
          </div>

          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            {saved && <span className="text-green-600 text-sm">Saved!</span>}
          </div>
        </form>
      </main>
    </div>
  )
}
