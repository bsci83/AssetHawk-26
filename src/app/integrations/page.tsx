'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Zap, Globe, Key, Code, ArrowRight } from 'lucide-react'

const integrations = [
  {
    name: 'YourGreenBook',
    desc: 'QR codes on Black-owned business profiles',
    icon: '🌿',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    docs: '/api/v1/assets',
    useCase: 'Generate QR codes for YGB business listings'
  },
  {
    name: 'SlateFusion',
    desc: 'Track film equipment with QR codes',
    icon: '🎬',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    docs: '/api/v1/assets',
    useCase: 'Track cameras, props, equipment across productions'
  },
  {
    name: 'OrangeBlossom',
    desc: 'QR codes for food trucks and restaurants',
    icon: '🍊',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    docs: '/api/v1/properties',
    useCase: 'Menu QR codes, ordering, truck tracking'
  },
  {
    name: 'PropertyPal',
    desc: 'Rental property management (NEW)',
    icon: '🏠',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    docs: '/api/v1/properties',
    useCase: 'WiFi QR, check-in codes, property info for guests',
    badge: 'NEW'
  },
  {
    name: 'ARIA Listings',
    desc: 'AI-powered real estate listings',
    icon: '🏢',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
    docs: '/api/v1/assets',
    useCase: 'Property asset tracking and management'
  },
  {
    name: 'ctrl-a Agents',
    desc: 'AI agents that use AssetHawk',
    icon: '🤖',
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-50',
    docs: '/api/mcp',
    useCase: 'Agents can create assets, scan, generate reports'
  }
]

export default function IntegrationsPage() {
  const [showKeyForm, setShowKeyForm] = useState(false)
  const [apiKeys, setApiKeys] = useState<any[]>([])
  const [newKey, setNewKey] = useState<{name: string, key: string} | null>(null)

  async function createApiKey(e: React.FormEvent) {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const name = (form.elements.namedItem('keyName') as HTMLInputElement).value
    
    const res = await fetch('/api/v1/keys', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orgId: 'demo', name })
    })
    const data = await res.json()
    if (data.key) {
      setNewKey({ name, key: data.key })
      setShowKeyForm(false)
    }
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

      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Integrations</h1>
          <p className="text-xl text-gray-600">Connect AssetHawk to your apps and AI agents</p>
        </div>

        {/* API Access */}
        <div className="bg-purple-50 rounded-xl p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Key className="h-6 w-6 text-purple-600" />
            <h2 className="text-xl font-bold">API Access</h2>
          </div>
          <p className="text-gray-600 mb-4">Generate API keys to access AssetHawk from other applications.</p>
          
          {newKey ? (
            <div className="bg-white rounded-lg p-4 border">
              <p className="text-sm text-gray-500 mb-2">Your new API key:</p>
              <code className="block bg-gray-100 p-2 rounded text-sm break-all">{newKey.key}</code>
              <p className="text-xs text-red-500 mt-2">⚠️ Copy this now - it won't be shown again!</p>
              <button onClick={() => setNewKey(null)} className="mt-2 text-purple-600 text-sm hover:underline">Create another</button>
            </div>
          ) : showKeyForm ? (
            <form onSubmit={createApiKey} className="bg-white rounded-lg p-4 border">
              <div className="flex gap-2">
                <input name="keyName" type="text" placeholder="Key name (e.g., YGB Production)" className="flex-1 px-3 py-2 border rounded" required />
                <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">Create Key</button>
                <button type="button" onClick={() => setShowKeyForm(false)} className="px-4 py-2 border rounded hover:bg-gray-50">Cancel</button>
              </div>
            </form>
          ) : (
            <button onClick={() => setShowKeyForm(true)} className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">
              Generate API Key
            </button>
          )}
        </div>

        {/* MCP Support */}
        <div className="bg-cyan-50 rounded-xl p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Zap className="h-6 w-6 text-cyan-600" />
            <h2 className="text-xl font-bold">MCP Server</h2>
            <span className="bg-cyan-200 text-cyan-800 text-xs px-2 py-1 rounded">BETA</span>
          </div>
          <p className="text-gray-600 mb-4">AI agents can use AssetHawk through the Model Context Protocol.</p>
          <code className="block bg-white p-3 rounded text-sm">POST /api/mcp</code>
          <p className="text-sm text-gray-500 mt-2">Tools: create_asset, get_asset, list_assets, scan_asset, generate_qr, create_property, get_audit_log</p>
        </div>

        {/* App Integrations */}
        <h2 className="text-2xl font-bold mb-6">Connected Apps</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {integrations.map((app) => (
            <div key={app.name} className="bg-white rounded-xl border shadow-sm overflow-hidden">
              <div className={`${app.bgColor} p-4 flex items-center justify-between`}>
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{app.icon}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold">{app.name}</h3>
                      {app.badge && <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded">{app.badge}</span>}
                    </div>
                    <p className={`text-sm ${app.color}`}>{app.desc}</p>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <p className="text-sm text-gray-600 mb-3">{app.useCase}</p>
                <div className="flex items-center justify-between">
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded">{app.docs}</code>
                  <Link href={app.docs} className="text-purple-600 text-sm flex items-center gap-1 hover:underline">
                    Docs <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Webhooks */}
        <div className="mt-12 bg-gray-50 rounded-xl p-6">
          <h2 className="text-xl font-bold mb-4">Webhooks</h2>
          <p className="text-gray-600 mb-4">Get notified when assets are scanned or updated.</p>
          <div className="bg-white rounded border p-4">
            <p className="text-sm text-gray-500 mb-2">Supported events:</p>
            <ul className="text-sm space-y-1">
              <li>• asset.created</li>
              <li>• asset.scanned</li>
              <li>• asset.updated</li>
              <li>• property.created</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  )
}
