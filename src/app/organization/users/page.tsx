'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Users, Plus, Mail, Trash2 } from 'lucide-react'

interface OrgUser {
  id: string
  email: string
  first_name: string
  last_name: string
  org_role: string
  is_active: number
  joined_at: string
}

export default function OrgUsersPage() {
  const [users, setUsers] = useState<OrgUser[]>([])
  const [loading, setLoading] = useState(true)
  const [showInvite, setShowInvite] = useState(false)
  const [form, setForm] = useState({ email: '', firstName: '', lastName: '', role: 'user' })

  useEffect(() => {
    const stored = localStorage.getItem('assethawk_user')
    if (stored) {
      const data = JSON.parse(stored)
      loadUsers(data.org?.id)
    }
  }, [])

  async function loadUsers(orgId: string) {
    if (!orgId) return
    try {
      const res = await fetch(`/api/users?orgId=${orgId}`)
      const data = await res.json()
      setUsers(Array.isArray(data) ? data : [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault()
    const stored = localStorage.getItem('assethawk_user')
    if (!stored) return
    const data = JSON.parse(stored)

    const res = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, orgId: data.org?.id })
    })

    if (res.ok) {
      setShowInvite(false)
      setForm({ email: '', firstName: '', lastName: '', role: 'user' })
      loadUsers(data.org?.id)
    }
  }

  async function handleRemove(userId: string) {
    if (!confirm('Remove this user from organization?')) return
    const stored = localStorage.getItem('assethawk_user')
    if (!stored) return
    const data = JSON.parse(stored)

    await fetch(`/api/users?userId=${userId}&orgId=${data.org?.id}`, { method: 'DELETE' })
    loadUsers(data.org?.id)
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link href="/organization" className="text-purple-600 hover:underline">← Organization</Link>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Team Members</h1>
          <button onClick={() => setShowInvite(true)} className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
            <Plus className="h-4 w-4" /> Invite User
          </button>
        </div>

        {showInvite && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-lg font-bold mb-4">Invite Team Member</h2>
            <form onSubmit={handleInvite} className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full px-3 py-2 border rounded" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Role</label>
                <select value={form.role} onChange={e => setForm({...form, role: e.target.value})} className="w-full px-3 py-2 border rounded">
                  <option value="user">User</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="md:col-span-2 flex gap-2">
                <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">Send Invite</button>
                <button type="button" onClick={() => setShowInvite(false)} className="px-4 py-2 border rounded hover:bg-gray-50">Cancel</button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr><td colSpan={5} className="px-6 py-4 text-center">Loading...</td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-4 text-center text-gray-500">No team members yet</td></tr>
              ) : users.map((u) => (
                <tr key={u.id}>
                  <td className="px-6 py-4 font-medium">{u.first_name} {u.last_name}</td>
                  <td className="px-6 py-4 text-sm">{u.email}</td>
                  <td className="px-6 py-4 text-sm capitalize">{u.org_role || 'user'}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs ${u.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                      {u.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button onClick={() => handleRemove(u.id)} className="text-red-600 hover:text-red-700">
                      <Trash2 className="h-4 w-4" />
                    </button>
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
