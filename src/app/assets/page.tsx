'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import QRCode from 'qrcode'
import { QrCode, Plus, Download, Trash2, Eye, Copy, MapPin, Package, Search, Grid, List } from 'lucide-react'

interface Asset {
  id: string
  asset_tag: string
  name: string
  description: string
  status: string
  category?: string
  location?: string
  purchase_date?: string
  purchase_price?: number
  current_value?: number
  created_at: string
  qr_data?: string
}

export default function AssetsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [assets, setAssets] = useState<Asset[]>([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null)
  const [qrCodes, setQrCodes] = useState<Record<string, string>>({})
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list')
  const [saving, setSaving] = useState(false)

  const [form, setForm] = useState({
    assetTag: '',
    name: '',
    description: '',
    category: '',
    location: '',
    status: 'active',
    purchaseDate: '',
    purchasePrice: '',
    currentValue: ''
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
      setUser(data)
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
    } catch (error) {
      console.error('Error loading assets:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!user?.org?.id) return

    setSaving(true)
    try {
      const res = await fetch('/api/assets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orgId: user.org.id,
          assetTag: form.assetTag,
          name: form.name,
          description: form.description,
          category: form.category,
          location: form.location,
          status: form.status,
          purchaseDate: form.purchaseDate,
          purchasePrice: form.purchasePrice ? parseFloat(form.purchasePrice) : undefined,
          currentValue: form.currentValue ? parseFloat(form.currentValue) : undefined
        }),
      })

      if (res.ok) {
        resetForm()
        setShowAdd(false)
        loadAssets(user.org.id)
      }
    } catch (error) {
      console.error('Error adding asset:', error)
    } finally {
      setSaving(false)
    }
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault()
    if (!editingAsset || !user?.org?.id) return

    setSaving(true)
    try {
      const res = await fetch(`/api/assets/${editingAsset.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          category: form.category,
          location: form.location,
          status: form.status,
          purchaseDate: form.purchaseDate,
          purchasePrice: form.purchasePrice ? parseFloat(form.purchasePrice) : undefined,
          currentValue: form.currentValue ? parseFloat(form.currentValue) : undefined
        }),
      })

      if (res.ok) {
        setEditingAsset(null)
        loadAssets(user.org.id)
      }
    } catch (error) {
      console.error('Error updating asset:', error)
    } finally {
      setSaving(false)
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

  function openEdit(asset: Asset) {
    setForm({
      assetTag: asset.asset_tag || '',
      name: asset.name || '',
      description: asset.description || '',
      category: asset.category || '',
      location: asset.location || '',
      status: asset.status || 'active',
      purchaseDate: asset.purchase_date ? asset.purchase_date.split('T')[0] : '',
      purchasePrice: asset.purchase_price?.toString() || '',
      currentValue: asset.current_value?.toString() || ''
    })
    setEditingAsset(asset)
  }

  function resetForm() {
    setForm({
      assetTag: '',
      name: '',
      description: '',
      category: '',
      location: '',
      status: 'active',
      purchaseDate: '',
      purchasePrice: '',
      currentValue: ''
    })
  }

  async function generateQR(asset: Asset) {
    const qrData = `assethawk://asset/${asset.id}`
    const url = await QRCode.toDataURL(qrData, { width: 200, margin: 2 })
    setQrCodes(prev => ({ ...prev, [asset.id]: url }))
  }

  async function downloadQr(asset: Asset) {
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
  }

  function copyQrData(asset: Asset) {
    const content = `assethawk://asset/${asset.id}`
    navigator.clipboard.writeText(content)
  }

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = !searchQuery ||
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.asset_tag?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.category?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || asset.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const stats = {
    total: assets.length,
    active: assets.filter(a => a.status === 'active').length,
    maintenance: assets.filter(a => a.status === 'maintenance').length,
    categories: [...new Set(assets.map(a => a.category).filter(Boolean))]
  }

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
              <Link href="/dashboard" className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900">Dashboard</Link>
              <Link href="/scan" className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900">Scan</Link>
              <button onClick={() => {
                localStorage.removeItem('assethawk_user')
                router.push('/signin')
              }} className="px-3 py-1 text-sm border rounded hover:bg-gray-50">Sign Out</button>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center gap-3">
              <Package className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-sm text-gray-500">Total Assets</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-sm font-bold">{stats.active}</span>
              </div>
              <div>
                <p className="text-sm text-gray-500">Active</p>
                <p className="text-2xl font-bold">{stats.active}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <span className="text-yellow-600 text-sm font-bold">{stats.maintenance}</span>
              </div>
              <div>
                <p className="text-sm text-gray-500">Maintenance</p>
                <p className="text-2xl font-bold">{stats.maintenance}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center gap-3">
              <Grid className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-sm text-gray-500">Categories</p>
                <p className="text-2xl font-bold">{stats.categories.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters & Controls */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search assets..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border rounded-lg w-64"
                />
              </div>
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="border rounded-lg px-3 py-2"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="maintenance">Maintenance</option>
                <option value="retired">Retired</option>
              </select>
            </div>
            <div className="flex gap-2">
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
              <button
                onClick={() => { resetForm(); setShowAdd(true); setEditingAsset(null); }}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Asset
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="bg-white rounded-lg shadow p-8">
            <div className="animate-pulse space-y-4">
              <div className="h-20 bg-gray-100 rounded"></div>
              <div className="h-20 bg-gray-100 rounded"></div>
            </div>
          </div>
        ) : filteredAssets.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Assets Found</h3>
            <p className="text-gray-500 mb-4">
              {searchQuery || statusFilter !== 'all' ? 'Try adjusting your search or filters' : 'Create your first asset to generate a QR code'}
            </p>
            <button onClick={() => { resetForm(); setShowAdd(true); }} className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700">
              Add Your First Asset
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAssets.map(asset => (
              <div key={asset.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{asset.name}</h3>
                    <p className="text-sm text-gray-500">{asset.category || 'Uncategorized'}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    asset.status === 'active' ? 'bg-green-100 text-green-700' :
                    asset.status === 'maintenance' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {asset.status}
                  </span>
                </div>
                {asset.description && <p className="text-sm text-gray-600 mb-3 line-clamp-2">{asset.description}</p>}
                <div className="space-y-2 text-sm text-gray-500 mb-4">
                  {asset.location && <div className="flex items-center gap-2"><MapPin className="h-4 w-4" />{asset.location}</div>}
                  {asset.purchase_price && <div>Value: ${asset.purchase_price.toLocaleString()}</div>}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => generateQR(asset)} className="flex-1 py-1.5 border rounded text-sm hover:bg-gray-50">
                    {qrCodes[asset.id] ? <img src={qrCodes[asset.id]} alt="QR" className="w-8 h-8 mx-auto" /> : 'QR'}
                  </button>
                  <button onClick={() => openEdit(asset)} className="flex-1 py-1.5 border rounded text-sm hover:bg-gray-50">Edit</button>
                  <button onClick={() => deleteAsset(asset.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tag</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Value</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">QR</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredAssets.map(asset => (
                  <tr key={asset.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-gray-900">{asset.name}</p>
                      {asset.description && <p className="text-xs text-gray-500 truncate max-w-xs">{asset.description}</p>}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">{asset.asset_tag}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{asset.category || '-'}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{asset.location || '-'}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        asset.status === 'active' ? 'bg-green-100 text-green-700' :
                        asset.status === 'maintenance' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>{asset.status}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">{asset.purchase_price ? `$${asset.purchase_price.toLocaleString()}` : '-'}</td>
                    <td className="px-4 py-3">
                      {qrCodes[asset.id] ? (
                        <img src={qrCodes[asset.id]} alt="QR" className="w-10 h-10 cursor-pointer" onClick={() => downloadQr(asset)} />
                      ) : (
                        <button onClick={() => generateQR(asset)} className="text-xs px-2 py-1 border rounded hover:bg-gray-50">Generate</button>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        {qrCodes[asset.id] && (
                          <>
                            <button onClick={() => downloadQr(asset)} className="p-1.5 text-gray-600 hover:bg-gray-100 rounded" title="Download QR"><Download className="h-4 w-4" /></button>
                            <button onClick={() => copyQrData(asset)} className="p-1.5 text-gray-600 hover:bg-gray-100 rounded" title="Copy URL"><Copy className="h-4 w-4" /></button>
                          </>
                        )}
                        <button onClick={() => openEdit(asset)} className="p-1.5 text-gray-600 hover:bg-gray-100 rounded" title="Edit"><Eye className="h-4 w-4" /></button>
                        <button onClick={() => deleteAsset(asset.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded" title="Delete"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Asset Modal */}
      {(showAdd || editingAsset) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">{editingAsset ? 'Edit Asset' : 'Add New Asset'}</h2>
            <form onSubmit={editingAsset ? handleUpdate : handleAdd} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Asset Tag *</label>
                  <input type="text" value={form.assetTag} onChange={e => setForm({ ...form, assetTag: e.target.value })} className="w-full px-3 py-2 border rounded-md" placeholder="LAPTOP-001" required={!editingAsset} disabled={!!editingAsset} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="w-full px-3 py-2 border rounded-md">
                    <option value="active">Active</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="retired">Retired</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 border rounded-md" placeholder="MacBook Pro 16" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <input type="text" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full px-3 py-2 border rounded-md" placeholder="Electronics" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input type="text" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} className="w-full px-3 py-2 border rounded-md" placeholder="Office 101" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full px-3 py-2 border rounded-md" rows={3} placeholder="Serial number, model, notes..." />
              </div>
              <div className="border-t pt-4">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Financial Information</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Date</label>
                    <input type="date" value={form.purchaseDate} onChange={e => setForm({ ...form, purchaseDate: e.target.value })} className="w-full px-3 py-2 border rounded-md" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Price</label>
                    <input type="number" value={form.purchasePrice} onChange={e => setForm({ ...form, purchasePrice: e.target.value })} className="w-full px-3 py-2 border rounded-md" placeholder="0.00" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Value</label>
                    <input type="number" value={form.currentValue} onChange={e => setForm({ ...form, currentValue: e.target.value })} className="w-full px-3 py-2 border rounded-md" placeholder="0.00" />
                  </div>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="submit" disabled={saving} className="flex-1 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50">
                  {saving ? (editingAsset ? 'Saving...' : 'Adding...') : (editingAsset ? 'Save Changes' : 'Add Asset')}
                </button>
                <button type="button" onClick={() => { setShowAdd(false); setEditingAsset(null); resetForm(); }} className="flex-1 py-2 border rounded-md hover:bg-gray-50">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
