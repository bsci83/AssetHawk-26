'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import { QrCode, Scan, Package } from 'lucide-react'
import LightweightScanner from '@/components/scanner/LightweightScanner'

interface Asset {
  id: string
  asset_tag: string
  name: string
  description: string
  status: string
  created_at: string
}

export default function ScanPage() {
  const [scanResult, setScanResult] = useState<string | null>(null)
  const [asset, setAsset] = useState<Asset | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleScanSuccess = useCallback(async (result: string) => {
    console.log('QR Scan Result:', result)
    setScanResult(result)
    setError(null)
    setLoading(true)

    // Parse asset ID from QR data (assethawk://asset/[id])
    const id = result.replace('assethawk://asset/', '').trim()
    
    if (!id) {
      setError('Invalid QR code format')
      setLoading(false)
      return
    }

    try {
      const res = await fetch(`/api/assets/${id}`)
      if (res.ok) {
        const data = await res.json()
        setAsset(data)
      } else {
        setError('Asset not found')
        setAsset(null)
      }
    } catch (err) {
      setError('Error looking up asset')
      setAsset(null)
    } finally {
      setLoading(false)
    }
  }, [])

  const handleScanError = useCallback((error: string) => {
    console.error('QR Scan Error:', error)
    setError(error)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <Link href="/" className="flex items-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-purple-600"><rect width="5" height="5" x="3" y="3" rx="1"/><rect width="5" height="5" x="16" y="3" rx="1"/><rect width="5" height="5" x="3" y="16" rx="1"/><path d="M21 16h-3a2 2 0 0 0-2 2v3"/><path d="M21 21v.01"/><path d="M12 7v3a2 2 0 0 1-2 2H7"/><path d="M3 12h.01"/><path d="M12 3h.01"/><path d="M12 16v.01"/><path d="M16 12h1"/><path d="M21 12v.01"/><path d="M12 21v-1"/></svg>
                <span className="text-2xl font-bold text-gray-900">AssetHawk</span>
              </Link>
            </div>
            <nav className="flex items-center space-x-4">
              <Link href="/dashboard" className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900">Dashboard</Link>
              <Link href="/assets" className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900">Assets</Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <Scan className="h-12 w-12 text-purple-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900">QR Scanner</h1>
          <p className="text-gray-600 mt-2">Scan QR codes to look up asset information</p>
        </div>

        {/* Camera Scanner */}
        <LightweightScanner
          onScanSuccess={handleScanSuccess}
          onScanError={handleScanError}
        />

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <p className="text-gray-600">Looking up asset...</p>
          </div>
        )}

        {/* Asset Result */}
        {asset && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{asset.name}</h2>
                <p className="text-gray-500">{asset.asset_tag}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm ${
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
              <p className="text-gray-600 mb-4">{asset.description}</p>
            )}

            <div className="border-t pt-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Asset Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Asset Tag</p>
                  <p className="text-sm font-medium">{asset.asset_tag}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Created</p>
                  <p className="text-sm">{new Date(asset.created_at).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Status</p>
                  <p className="text-sm capitalize">{asset.status || 'active'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Asset ID</p>
                  <p className="text-xs font-mono">{asset.id}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t flex gap-2">
              <Link
                href="/assets"
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-center"
              >
                View in Assets
              </Link>
            </div>
          </div>
        )}

        {/* Scan Result Raw (for debugging) */}
        {scanResult && !asset && !loading && !error && (
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600">Scanned: {scanResult}</p>
            <p className="text-sm text-gray-500 mt-2">This QR code is not linked to an asset in the system.</p>
          </div>
        )}
      </div>
    </div>
  )
}
