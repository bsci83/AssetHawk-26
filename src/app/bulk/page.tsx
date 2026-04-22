'use client'

import { useState, useRef } from 'react'
import { QrCode, Download, Upload, FileText, X, Check, AlertCircle } from 'lucide-react'
import QRCode from 'qrcode'
import JSZip from 'jszip'

interface BulkAsset {
  id: string
  name: string
  assetTag: string
  qrDataUrl?: string
  status: 'pending' | 'generating' | 'done' | 'error'
}

export default function BulkQRPage() {
  const [assets, setAssets] = useState<BulkAsset[]>([])
  const [generating, setGenerating] = useState(false)
  const [progress, setProgress] = useState({ current: 0, total: 0 })
  const fileInputRef = useRef<HTMLInputElement>(null)

  function parseCSV(text: string) {
    const lines = text.split('\n').filter(l => l.trim())
    if (lines.length < 2) return []

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase())
    const assets: BulkAsset[] = []

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim())
      const obj: Record<string, string> = {}
      headers.forEach((h, idx) => { obj[h] = values[idx] || '' })

      if (obj.name || obj.asset || obj.tag) {
        assets.push({
          id: `bulk-${Date.now()}-${i}`,
          name: obj.name || obj.asset || obj.tag || `Asset ${i}`,
          assetTag: obj.tag || obj.asset || `TAG-${i.toString().padStart(4, '0')}`,
          status: 'pending'
        })
      }
    }
    return assets
  }

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (ev) => {
      const text = ev.target?.result as string
      const parsed = parseCSV(text)
      setAssets(parsed)
    }
    reader.readAsText(file)
  }

  async function generateAllQRs() {
    if (assets.length === 0) return

    setGenerating(true)
    setProgress({ current: 0, total: assets.length })

    const updated = [...assets]
    for (let i = 0; i < updated.length; i++) {
      updated[i].status = 'generating'
      setAssets([...updated])
      setProgress({ current: i + 1, total: assets.length })

      try {
        const qrData = `assethawk://asset/${updated[i].id}`
        const dataUrl = await QRCode.toDataURL(qrData, { width: 400, margin: 2 })
        updated[i].qrDataUrl = dataUrl
        updated[i].status = 'done'
      } catch (e) {
        updated[i].status = 'error'
      }

      setAssets([...updated])
    }

    setGenerating(false)
  }

  async function downloadAll() {
    const zip = new JSZip()
    const folder = zip.folder('qr-codes')

    assets.forEach(asset => {
      if (asset.qrDataUrl) {
        const base64 = asset.qrDataUrl.split(',')[1]
        const name = asset.assetTag.replace(/[^a-zA-Z0-9]/g, '_')
        folder?.file(`${name}.png`, base64, { base64: true })
      }
    })

    const blob = await zip.generateAsync({ type: 'blob' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `qr-codes-${Date.now()}.zip`
    link.click()
  }

  function downloadSingle(asset: BulkAsset) {
    if (!asset.qrDataUrl) return
    const link = document.createElement('a')
    link.href = asset.qrDataUrl
    link.download = `qr-${asset.assetTag}.png`
    link.click()
  }

  function removeAsset(id: string) {
    setAssets(assets.filter(a => a.id !== id))
  }

  function clearAll() {
    setAssets([])
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const doneCount = assets.filter(a => a.status === 'done').length
  const hasQrs = doneCount > 0

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <QrCode className="h-8 w-8 text-purple-600" />
          <h1 className="text-2xl font-bold">Bulk QR Generator</h1>
        </div>

        {/* Upload Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Assets
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Upload a CSV with columns: <code className="bg-gray-100 px-1 rounded">name, tag</code> (or any columns containing "name" and "tag")
          </p>
          
          <div className="flex gap-4 items-center">
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50 flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              Choose CSV File
            </button>
            {assets.length > 0 && (
              <button
                onClick={clearAll}
                className="px-4 py-2 text-red-600 border border-red-200 rounded-lg hover:bg-red-50"
              >
                Clear All
              </button>
            )}
          </div>

          <div className="mt-4 bg-blue-50 rounded-lg p-4">
            <p className="text-sm text-blue-800 font-medium mb-2">CSV Format Example:</p>
            <code className="text-xs text-blue-700 block">
              name,tag,category,location{'\n'}
              MacBook Pro 16,MAC-001,Electronics,Office 101{'\n'}
              Sony A7 Camera,CAM-002,Equipment,Studio A
            </code>
          </div>
        </div>

        {/* Progress */}
        {generating && (
          <div className="bg-purple-50 rounded-lg p-4 mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span>Generating QR codes...</span>
              <span>{progress.current} / {progress.total}</span>
            </div>
            <div className="w-full bg-purple-200 rounded-full h-2">
              <div
                className="bg-purple-600 h-2 rounded-full transition-all"
                style={{ width: `${(progress.current / progress.total) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Asset List */}
        {assets.length > 0 && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b flex justify-between items-center">
              <div>
                <h2 className="font-semibold">{assets.length} Assets</h2>
                <p className="text-sm text-gray-500">{doneCount} QR codes ready</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={generateAllQRs}
                  disabled={generating}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                >
                  {generating ? 'Generating...' : 'Generate All QR Codes'}
                </button>
                {hasQrs && (
                  <button
                    onClick={downloadAll}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Download ZIP
                  </button>
                )}
              </div>
            </div>

            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Asset</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tag</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">QR</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {assets.map(asset => (
                  <tr key={asset.id}>
                    <td className="px-6 py-3">
                      <p className="font-medium">{asset.name}</p>
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-600">{asset.assetTag}</td>
                    <td className="px-6 py-3">
                      {asset.status === 'done' && asset.qrDataUrl ? (
                        <img src={asset.qrDataUrl} alt="QR" className="w-12 h-12" />
                      ) : asset.status === 'generating' ? (
                        <span className="text-purple-600">Generating...</span>
                      ) : asset.status === 'error' ? (
                        <span className="text-red-600 flex items-center gap-1">
                          <AlertCircle className="h-4 w-4" /> Error
                        </span>
                      ) : (
                        <span className="text-gray-400">Pending</span>
                      )}
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex gap-2">
                        {asset.status === 'done' && (
                          <button
                            onClick={() => downloadSingle(asset)}
                            className="p-1.5 text-gray-600 hover:bg-gray-100 rounded"
                            title="Download"
                          >
                            <Download className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={() => removeAsset(asset.id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                          title="Remove"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {assets.length === 0 && (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <QrCode className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Assets Yet</h3>
            <p className="text-gray-500 mb-4">Upload a CSV file to generate QR codes in bulk</p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Upload CSV
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
