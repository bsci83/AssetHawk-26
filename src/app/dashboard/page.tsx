'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import QRCode from 'qrcode'
import { QrCode, Plus, Download, Edit2, Trash2, Eye, Copy, Check, Filter, Grid, List, TrendingUp, Package, MapPin, BarChart3 } from 'lucide-react'

interface Asset {
  id: string
  asset_tag: string
  name: string
  description: string
  status: string
  location?: string
  category?: string
  created_at: string
  qr_data?: string
  qr_url?: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [assets, setAssets] = useState<Asset[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'active' | 'maintenance' | 'retired'>('all')
  const [stats, setStats] = useState({
    totalScans: 0,
    activeAssets: 0,
    totalAssets: 0
  })

  useEffect(() => {
    checkUser()
  }, [])

  async function checkUser() {
    const stored = localStorage.getItem('assethawk_user')
    if (!stored) {
      router.push('/signin')
      return
    }

    try {
      const data = JSON.parse(stored)
      if (!data.user || !data.org) {
        router.push('/signin')
        return
      }
      setUser(data.user)
      loadAssets(data.org.id)
    } catch {
      router.push('/signin')
    }
  }

  async function loadAssets(orgId: string) {
    setLoading(true)
    try {
      const res = await fetch(`/api/assets?orgId=${orgId}`)
      const data = await res.json()
      setAssets(Array.isArray(data) ? data : [])
      
      const activeAssets = (Array.isArray(data) ? data : []).filter((a: Asset) => a.status === 'active').length
      setStats({
        totalScans: 0,
        activeAssets,
        totalAssets: Array.isArray(data) ? data.length : 0
      })
    } catch (error) {
      console.error('Error loading assets:', error)
    } finally {
      setLoading(false)
    }
  }

  async function deleteAsset(id: string) {
    if (!confirm('Delete this asset?')) return
    try {
      const res = await fetch(`/api/assets/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setAssets(assets.filter(a => a.id !== id))
      }
    } catch (error) {
      console.error('Error deleting asset:', error)
    }
  }

  async function downloadQr(asset: Asset) {
    try {
      const qrData = `assethawk://asset/${asset.id}`
      const canvas = document.createElement('canvas')
      await QRCode.toCanvas(canvas, qrData, { width: 1024, margin: 2 })
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.href = url
          link.download = `qr-${asset.name?.replace(/\s+/g, '-') || asset.id}.png`
          link.click()
          URL.revokeObjectURL(url)
        }
      })
    } catch (error) {
      console.error('Error downloading QR:', error)
    }
  }

  function copyToClipboard(asset: Asset) {
    const content = asset.qr_data || `assethawk://asset/${asset.id}`
    navigator.clipboard.writeText(content)
    setCopiedId(asset.id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  function handleSignOut() {
    localStorage.removeItem('assethawk_user')
    router.push('/signin')
  }

  const filteredAssets = filter === 'all' ? assets : assets.filter(a => a.status === filter)

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <Link href="/" className="flex items-center space-x-2">
                <QrCode className="h-8 w-8 text-purple-600" />
                <span className="text-2xl font-bold text-gray-900">AssetHawk</span>
              </Link>
            </div>
            <nav className="flex items-center space-x-4">
              <Link href="/assets" className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900">Assets</Link>
              <Link href="/scan" className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900">Scan</Link>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">{user.email}</span>
                <button onClick={handleSignOut} className="px-3 py-1 text-sm border rounded hover:bg-gray-50">Sign Out</button>
              </div>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Scans</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalScans.toLocaleString()}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Assets</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.activeAssets}</p>
              </div>
              <Package className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Assets</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalAssets}</p>
              </div>
              <Eye className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Organization</p>
                <p className="text-lg font-semibold text-purple-600 truncate">{user.org?.name || 'N/A'}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          {/* Controls */}
          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <Link href="/assets">
                  <button className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Add Asset
                  </button>
                </Link>

                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-gray-500" />
                  <select
                    className="border rounded px-3 py-1 text-sm"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value as any)}
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="retired">Retired</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-purple-100 text-purple-600' : 'text-gray-400'}`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-purple-100 text-purple-600' : 'text-gray-400'}`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Assets Grid/List */}
          {loading ? (
            <div className="bg-white rounded-lg shadow p-8">
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="h-32 bg-gray-100 rounded"></div>
              </div>
            </div>
          ) : filteredAssets.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Assets Yet</h3>
              <p className="text-gray-500 mb-4">Add your first asset to start tracking with QR codes</p>
              <Link href="/assets">
                <button className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700">
                  Add Your First Asset
                </button>
              </Link>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAssets.map((asset) => (
                <div key={asset.id} className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">{asset.name}</h3>
                      <p className="text-sm text-gray-500">{asset.asset_tag}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      asset.status === 'active'
                        ? 'bg-green-100 text-green-700'
                        : asset.status === 'maintenance'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {asset.status || 'active'}
                    </span>
                  </div>

                  {asset.description && (
                    <p className="text-sm text-gray-600 mb-3 truncate">{asset.description}</p>
                  )}

                  <div className="aspect-square bg-gray-100 rounded mb-3 flex items-center justify-center">
                    <QrCode className="h-16 w-16 text-gray-400" />
                  </div>

                  <div className="flex gap-1 pt-2">
                    <button
                      onClick={() => downloadQr(asset)}
                      className="flex-1 p-1.5 text-gray-600 hover:bg-gray-100 rounded flex items-center justify-center"
                      title="Download QR Code"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => copyToClipboard(asset)}
                      className="flex-1 p-1.5 text-gray-600 hover:bg-gray-100 rounded flex items-center justify-center"
                      title="Copy QR Code Data"
                    >
                      {copiedId === asset.id ?
                        <Check className="h-4 w-4 text-green-600" /> :
                        <Copy className="h-4 w-4" />
                      }
                    </button>
                    <button
                      onClick={() => deleteAsset(asset.id)}
                      className="flex-1 p-1.5 text-red-600 hover:bg-red-50 rounded flex items-center justify-center"
                      title="Delete Asset"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Asset</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tag</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredAssets.map((asset) => (
                    <tr key={asset.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center mr-3">
                            <QrCode className="h-5 w-5 text-gray-400" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{asset.name}</p>
                            {asset.description && (
                              <p className="text-xs text-gray-500 truncate max-w-xs">{asset.description}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">{asset.asset_tag}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          asset.status === 'active'
                            ? 'bg-green-100 text-green-700'
                            : asset.status === 'maintenance'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {asset.status || 'active'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <button onClick={() => downloadQr(asset)} className="p-1 text-gray-600 hover:bg-gray-100 rounded" title="Download QR">
                            <Download className="h-4 w-4" />
                          </button>
                          <button onClick={() => copyToClipboard(asset)} className="p-1 text-gray-600 hover:bg-gray-100 rounded" title="Copy">
                            {copiedId === asset.id ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                          </button>
                          <button onClick={() => deleteAsset(asset.id)} className="p-1 text-red-600 hover:bg-red-50 rounded" title="Delete">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
