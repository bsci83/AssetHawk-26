'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Shield, Key, Trash2 } from 'lucide-react'

interface SSOConfig {
  enabled: boolean
  provider: string | null
  domain: string | null
  entityId: string | null
}

export default function OrgSSOPage() {
  const [sso, setSSO] = useState<SSOConfig | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ provider: 'saml', domain: '', clientId: '' })

  useEffect(() => {
    const stored = localStorage.getItem('assethawk_user')
    if (stored) {
      const data = JSON.parse(stored)
      loadSSO(data.org?.id)
    }
  }, [])

  async function loadSSO(orgId: string) {
    if (!orgId) return
    try {
      const res = await fetch(`/api/sso?orgId=${orgId}`)
      const data = await res.json()
      setSSO(data)
      if (data.domain) setForm({ ...form, domain: data.domain, clientId: data.clientId || '' })
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
      await fetch('/api/sso', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orgId: data.org?.id, ...form })
      })
      loadSSO(data.org?.id)
    } catch (e) {
      console.error(e)
    } finally {
      setSaving(false)
    }
  }

  async function handleDisable() {
    if (!confirm('Disable SSO for this organization?')) return
    const stored = localStorage.getItem('assethawk_user')
    if (!stored) return
    const data = JSON.parse(stored)
    
    await fetch(`/api/sso?orgId=${data.org?.id}`, { method: 'DELETE' })
    setSSO({ enabled: false, provider: null, domain: null, entityId: null })
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
        <h1 className="text-3xl font-bold mb-8">SSO / SAML Configuration</h1>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="h-6 w-6 text-purple-600" />
            <div>
              <h2 className="text-lg font-bold">Single Sign-On</h2>
              <p className="text-sm text-gray-500">Configure SAML 2.0 or OIDC providers</p>
            </div>
          </div>

          {sso?.enabled ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <p className="text-green-700 font-medium">✓ SSO is enabled</p>
              <p className="text-sm text-green-600">Provider: {sso.provider?.toUpperCase()}</p>
              <p className="text-sm text-green-600">Domain: {sso.domain}</p>
              <p className="text-sm text-green-600 mt-2">Entity ID: <code className="bg-green-100 px-1 rounded">{sso.entityId}</code></p>
            </div>
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
              <p className="text-gray-600">SSO is not configured</p>
            </div>
          )}
        </div>

        <form onSubmit={handleSave} className="bg-white rounded-lg shadow p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Provider Type</label>
            <select 
              value={form.provider} 
              onChange={e => setForm({...form, provider: e.target.value})}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="saml">SAML 2.0</option>
              <option value="oidc">OpenID Connect (OIDC)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Domain</label>
            <input 
              type="text" 
              value={form.domain} 
              onChange={e => setForm({...form, domain: e.target.value})}
              placeholder="company.com"
              className="w-full px-3 py-2 border rounded-md"
              required
            />
            <p className="text-xs text-gray-500 mt-1">Users with email addresses in this domain will be prompted to use SSO</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Client ID / App ID</label>
            <input 
              type="text" 
              value={form.clientId} 
              onChange={e => setForm({...form, clientId: e.target.value})}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-medium text-blue-800 mb-2">SAML Configuration</h3>
            <div className="text-sm text-blue-700 space-y-1">
              <p><strong>Entity ID:</strong> <code className="bg-blue-100 px-1 rounded">assethawk-{sso?.entityId?.substring(0, 8) || 'your-org'}</code></p>
              <p><strong>ACS URL:</strong> <code className="bg-blue-100 px-1 rounded">https://assethawk.com/auth/saml/callback</code></p>
              <p><strong>Metadata URL:</strong> <code className="bg-blue-100 px-1 rounded">https://assethawk.com/auth/saml/{sso?.entityId?.substring(0, 8) || 'org'}/metadata</code></p>
            </div>
          </div>

          <div className="flex gap-3">
            <button 
              type="submit" 
              disabled={saving}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Configuration'}
            </button>
            {sso?.enabled && (
              <button 
                type="button" 
                onClick={handleDisable}
                className="px-4 py-2 border border-red-300 text-red-600 rounded-md hover:bg-red-50"
              >
                Disable SSO
              </button>
            )}
          </div>
        </form>
      </main>
    </div>
  )
}
