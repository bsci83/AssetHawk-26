'use client'

import { useState, useRef } from 'react'
import { QrCode, Download, Upload, FileText, X, Check, AlertCircle, Link as LinkIcon, Wifi, Zap, FileSpreadsheet } from 'lucide-react'
import QRCode from 'qrcode'
import JSZip from 'jszip'

type QrType = 'url' | 'text' | 'wifi' | 'dynamic'

interface BulkAsset {
  id: string
  name: string
  assetTag: string
  type: QrType
  content: string
  url?: string
  text?: string
  wifiSsid?: string
  wifiPassword?: string
  wifiType?: string
  qrDataUrl?: string
  status: 'pending' | 'generating' | 'done' | 'error'
  error?: string
}

export default function BulkQRPage() {
  const [assets, setAssets] = useState<BulkAsset[]>([])
  const [generating, setGenerating] = useState(false)
  const [progress, setProgress] = useState({ current: 0, total: 0 })
  const [batchCount, setBatchCount] = useState(10)
  const [batchType, setBatchType] = useState<QrType>('text')
  const [batchPrefix, setBatchPrefix] = useState('QR')
  const [batchUrl, setBatchUrl] = useState('')
  const [batchText, setBatchText] = useState('')
  const [batchWifiSsid, setBatchWifiSsid] = useState('')
  const [batchWifiPassword, setBatchWifiPassword] = useState('')
  const [batchWifiType, setBatchWifiType] = useState('WPA')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [tab, setTab] = useState<'quick' | 'csv'>('quick')

  function buildContent(type: QrType, index: number, baseUrl?: string): string {
    switch (type) {
      case 'url':
        return baseUrl || 'https://example.com'
      case 'text':
        return `Text QR ${index}`
      case 'wifi':
        return `WIFI:T:${batchWifiType};S:${batchWifiSsid};P:${batchWifiPassword};;`
      case 'dynamic':
        return baseUrl || 'https://example.com'
      default:
        return 'https://example.com'
    }
  }

  function handleQuickBatch() {
    const newAssets: BulkAsset[] = []
    for (let i = 1; i <= batchCount; i++) {
      const id = `batch-${Date.now()}-${i}`
      const name = `${batchPrefix}-${i.toString().padStart(4, '0')}`
      const assetTag = `${batchPrefix}-${i.toString().padStart(4, '0')}`
      newAssets.push({
        id,
        name,
        assetTag,
        type: batchType,
        content: buildContent(batchType, i, batchUrl),
        url: batchType === 'url' || batchType === 'dynamic' ? batchUrl : undefined,
        text: batchType === 'text' ? `${batchText} ${i}` : undefined,
        wifiSsid: batchType === 'wifi' ? batchWifiSsid : undefined,
        wifiPassword: batchType === 'wifi' ? batchWifiPassword : undefined,
        wifiType: batchType === 'wifi' ? batchWifiType : undefined,
        status: 'pending'
      })
    }
    setAssets(newAssets)
  }

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
        const type = (obj.type || 'url') as QrType
        const content = obj.url || obj.text || buildContent(type, i, obj.url)
        
        assets.push({
          id: `csv-${Date.now()}-${i}`,
          name: obj.name || obj.asset || `Asset ${i}`,
          assetTag: obj.tag || obj.asset || `TAG-${i.toString().padStart(4, '0')}`,
          type,
          content,
          url: type === 'url' || type === 'dynamic' ? (obj.url || '') : undefined,
          text: type === 'text' ? (obj.text || '') : undefined,
          wifiSsid: type === 'wifi' ? (obj.ssid || '') : undefined,
          wifiPassword: type === 'wifi' ? (obj.password || '') : undefined,
          wifiType: type === 'wifi' ? (obj.wifi_type || 'WPA') : undefined,
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
    reader.onload = (event) => {
      const text = event.target?.result as string
      const parsed = parseCSV(text)
      setAssets(parsed)
    }
    reader.readAsText(file)
  }

  async function generateAllQRCodes() {
    setGenerating(true)
    setProgress({ current: 0, total: assets.length })

    const zip = new JSZip()
    const updatedAssets = [...assets]

    for (let i = 0; i < assets.length; i++) {
      const asset = assets[i]
      updatedAssets[i] = { ...asset, status: 'generating' }
      setAssets(updatedAssets)

      try {
        const canvas = document.createElement('canvas')
        await QRCode.toCanvas(canvas, asset.content, {
          width: 1024,
          margin: 2,
          color: { dark: '#6d28d9', light: '#ffffff' }
        })

        const dataUrl = canvas.toDataURL('image/png')
        updatedAssets[i] = { ...updatedAssets[i], qrDataUrl: dataUrl, status: 'done' }

        // Add to ZIP
        const blob = await (await fetch(dataUrl)).blob()
        zip.file(`qr-${asset.assetTag}.png`, blob)

      } catch (err) {
        updatedAssets[i] = { ...updatedAssets[i], status: 'error', error: String(err) }
      }

      setProgress({ current: i + 1, total: assets.length })
      setAssets(updatedAssets)
    }

    // Download ZIP
    const zipBlob = await zip.generateAsync({ type: 'blob' })
    const url = URL.createObjectURL(zipBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `bulk-qr-${Date.now()}.zip`
    link.click()
    URL.revokeObjectURL(url)

    setGenerating(false)
  }

  function clearAssets() {
    setAssets([])
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const doneCount = assets.filter(a => a.status === 'done').length
  const errorCount = assets.filter(a => a.status === 'error').length

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <QrCode className="h-8 w-8 text-purple-600" />
          <h1 className="text-2xl font-bold">Bulk QR Generator</h1>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setTab('quick')}
            className={`px-4 py-2 rounded-lg font-medium ${tab === 'quick' ? 'bg-purple-600 text-white' : 'bg-white text-gray-600 border'}`}
          >
            <Zap className="h-4 w-4 inline mr-2" />
            Quick Batch
          </button>
          <button
            onClick={() => setTab('csv')}
            className={`px-4 py-2 rounded-lg font-medium ${tab === 'csv' ? 'bg-purple-600 text-white' : 'bg-white text-gray-600 border'}`}
          >
            <FileSpreadsheet className="h-4 w-4 inline mr-2" />
            CSV Upload
          </button>
        </div>

        {/* Quick Batch Tab */}
        {tab === 'quick' && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Create Multiple QR Codes at Once</h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              {/* Count */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">How Many QR Codes?</label>
                <input
                  type="number"
                  min="1"
                  max="10000"
                  value={batchCount}
                  onChange={e => setBatchCount(Math.min(10000, Math.max(1, parseInt(e.target.value) || 1)))}
                  className="w-full px-3 py-2 border rounded-lg"
                />
                <p className="text-xs text-gray-500 mt-1">Max 10,000 at once</p>
              </div>

              {/* Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">QR Code Type</label>
                <select
                  value={batchType}
                  onChange={e => setBatchType(e.target.value as QrType)}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="text">Text QR</option>
                  <option value="url">URL QR</option>
                  <option value="wifi">WiFi QR</option>
                  <option value="dynamic">Dynamic QR</option>
                </select>
              </div>

              {/* Prefix */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name Prefix</label>
                <input
                  type="text"
                  value={batchPrefix}
                  onChange={e => setBatchPrefix(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="QR"
                />
              </div>
            </div>

            {/* Type-specific fields */}
            <div className="mt-4 space-y-4">
              {batchType === 'url' || batchType === 'dynamic' ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Base URL</label>
                  <input
                    type="url"
                    value={batchUrl}
                    onChange={e => setBatchUrl(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="https://yoursite.com/page"
                  />
                  <p className="text-xs text-gray-500 mt-1">All QR codes will link to this URL</p>
                </div>
              ) : batchType === 'text' ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Base Text</label>
                  <textarea
                    value={batchText}
                    onChange={e => setBatchText(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                    rows={2}
                    placeholder="e.g., Clue 1, Step 1, Item 1..."
                  />
                  <p className="text-xs text-gray-500 mt-1">Each QR will have " 1", " 2", " 3" appended</p>
                </div>
              ) : batchType === 'wifi' ? (
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Network Name (SSID)</label>
                    <input
                      type="text"
                      value={batchWifiSsid}
                      onChange={e => setBatchWifiSsid(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg"
                      placeholder="MyNetwork"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                    <input
                      type="text"
                      value={batchWifiPassword}
                      onChange={e => setBatchWifiPassword(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg"
                      placeholder="password"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Security</label>
                    <select
                      value={batchWifiType}
                      onChange={e => setBatchWifiType(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg"
                    >
                      <option value="WPA">WPA/WPA2</option>
                      <option value="WEP">WEP</option>
                      <option value="nopass">None</option>
                    </select>
                  </div>
                </div>
              ) : null}
            </div>

            <button
              onClick={handleQuickBatch}
              className="mt-6 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium"
            >
              Generate {batchCount} QR Codes
            </button>
          </div>
        )}

        {/* CSV Upload Tab */}
        {tab === 'csv' && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Upload CSV with QR Data</h2>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">Upload a CSV file with columns: name, tag, type, url/text/ssid/password</p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium"
              >
                Choose CSV File
              </button>
            </div>

            <div className="mt-4 bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium mb-2">CSV Format Example:</h3>
              <code className="text-sm text-gray-600 block">
                name,tag,type,url,text,ssid,password,wifi_type{`\n`}
                Welcome QR,QR-001,text,,Welcome to our store!,{`\n`}
                Website QR,QR-002,url,https://yoursite.com,,,{`\n`}
                Office WiFi,QR-003,wifi,,,,mypassword,WPA
              </code>
            </div>
          </div>
        )}

        {/* Asset List & Actions */}
        {assets.length > 0 && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b flex items-center justify-between">
              <div>
                <h2 className="font-semibold">{assets.length} QR Codes</h2>
                {doneCount > 0 && <p className="text-sm text-green-600">{doneCount} generated</p>}
                {errorCount > 0 && <p className="text-sm text-red-600">{errorCount} errors</p>}
              </div>
              <div className="flex gap-3">
                {progress.total > 0 && generating && (
                  <span className="text-sm text-gray-500">
                    {progress.current} / {progress.total}
                  </span>
                )}
                <button
                  onClick={clearAssets}
                  disabled={generating}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  Clear
                </button>
                <button
                  onClick={generateAllQRCodes}
                  disabled={generating || assets.length === 0}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2"
                >
                  {generating ? (
                    <>Generating...</>
                  ) : (
                    <>
                      <Download className="h-4 w-4" />
                      Generate & Download ZIP
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Progress Bar */}
            {generating && (
              <div className="h-1 bg-gray-100">
                <div 
                  className="h-1 bg-purple-600 transition-all"
                  style={{ width: `${(progress.current / progress.total) * 100}%` }}
                />
              </div>
            )}

            {/* Preview Grid */}
            <div className="p-4 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 max-h-96 overflow-y-auto">
              {assets.map(asset => (
                <div key={asset.id} className="border rounded-lg p-3 text-center">
                  <div className="w-20 h-20 mx-auto mb-2 bg-gray-100 rounded flex items-center justify-center">
                    {asset.qrDataUrl ? (
                      <img src={asset.qrDataUrl} alt={asset.name} className="w-full h-full object-contain" />
                    ) : asset.status === 'generating' ? (
                      <div className="animate-pulse text-sm text-gray-400">Generating...</div>
                    ) : asset.status === 'error' ? (
                      <AlertCircle className="h-8 w-8 text-red-400" />
                    ) : (
                      <QrCode className="h-8 w-8 text-gray-300" />
                    )}
                  </div>
                  <p className="text-xs font-medium truncate">{asset.name}</p>
                  <p className="text-xs text-gray-500">{asset.assetTag}</p>
                  {asset.status === 'done' && <Check className="h-4 w-4 text-green-500 mx-auto mt-1" />}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
