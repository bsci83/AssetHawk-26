'use client'

import React, { useState } from 'react'
import { Link2, Edit2, Globe, Wifi, FileText, Plus, ExternalLink, MousePointer, BarChart3 } from 'lucide-react'

export default function DynamicQRPage() {
  const [qrcodes, setQrcodes] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedQR, setSelectedQR] = useState<any>(null)
  const [editUrl, setEditUrl] = useState('')

  const fetchQRCodes = async () => {
    setLoading(true)
    try {
      const orgId = localStorage.getItem('orgId')
      if (!orgId) return
      
      const res = await fetch(`/api/qr/dynamic?orgId=${orgId}`)
      const data = await res.json()
      setQrcodes(data)
    } catch (e) {
      console.error(e)
    }
    setLoading(false)
  }

  const updateQRUrl = async (qrId: string, newUrl: string) => {
    await fetch('/api/qr/dynamic', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ qrId, newUrl })
    })
    setSelectedQR(null)
    fetchQRCodes()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dynamic QR Codes</h1>
              <p className="text-gray-600 mt-1">
                Change where QR codes point — without reprinting
              </p>
            </div>
            <button
              onClick={fetchQRCodes}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
            >
              <MousePointer className="w-4 h-4" />
              Load My QR Codes
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Info Box */}
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-xl p-6 mb-8">
          <h2 className="font-semibold text-purple-900 mb-2">How Dynamic QR Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-purple-600 text-white rounded-lg flex items-center justify-center text-sm font-bold">1</div>
              <div>
                <p className="font-medium text-gray-900">Print Once</p>
                <p className="text-sm text-gray-600">QR contains your resolve URL — never changes</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-purple-600 text-white rounded-lg flex items-center justify-center text-sm font-bold">2</div>
              <div>
                <p className="font-medium text-gray-900">Update Forever</p>
                <p className="text-sm text-gray-600">Change the content — QR still works</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-purple-600 text-white rounded-lg flex items-center justify-center text-sm font-bold">3</div>
              <div>
                <p className="font-medium text-gray-900">Track Scans</p>
                <p className="text-sm text-gray-600">See who's scanning your codes</p>
              </div>
            </div>
          </div>
        </div>

        {/* QR Codes List */}
        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading...</div>
        ) : qrcodes.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
            <Link2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No dynamic QR codes yet</p>
            <p className="text-sm text-gray-400 mt-1">Create one from the Properties or Assets page</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {qrcodes.map((qr) => (
              <div key={qr.id} className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">{qr.name}</h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {qr.entity_type === 'property' ? 'Property' : 'Asset'} • {qr.click_count || 0} scans
                    </p>
                  </div>
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">Dynamic</span>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-3 mb-3">
                  <p className="text-xs text-gray-500 mb-1">Resolves to:</p>
                  <p className="text-sm text-gray-700 truncate font-mono">{qr.resolved_url}</p>
                </div>

                <button
                  onClick={() => { setSelectedQR(qr); setEditUrl(qr.resolved_url); }}
                  className="w-full px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm flex items-center justify-center gap-2"
                >
                  <Edit2 className="w-4 h-4" />
                  Update Target
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {selectedQR && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h2 className="text-lg font-bold mb-4">Update QR Target</h2>
            <p className="text-sm text-gray-500 mb-4">
              Change where "{selectedQR.name}" points to. No need to reprint!
            </p>
            <input
              type="url"
              value={editUrl}
              onChange={(e) => setEditUrl(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 font-mono text-sm"
              placeholder="https://..."
            />
            <div className="flex gap-3">
              <button
                onClick={() => setSelectedQR(null)}
                className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => updateQRUrl(selectedQR.id, editUrl)}
                className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
