'use client'

import { useState, useEffect } from 'react'
import QRCode from 'qrcode'
import { Download, Share2, Check } from 'lucide-react'

type Tab = 'url' | 'text' | 'wifi'

interface WifiConfig {
  ssid: string
  password: string
  type: 'WPA' | 'WEP' | 'nopass'
}

export default function QRGenerator() {
  const [tab, setTab] = useState<Tab>('url')
  const [text, setText] = useState('')
  const [qrUrl, setQrUrl] = useState('')
  const [size, setSize] = useState(200)
  const [qrColor, setQrColor] = useState('#6d28d9')
  const [bgColor, setBgColor] = useState('#ffffff')
  const [copied, setCopied] = useState(false)
  const [wifi, setWifi] = useState<WifiConfig>({ ssid: '', password: '', type: 'WPA' })

  function buildContent(): string {
    if (tab === 'wifi') {
      return wifi.ssid ? `WIFI:T:${wifi.type};S:${wifi.ssid};P:${wifi.password};;` : ''
    }
    if (tab === 'text') return text
    return text
  }

  // Auto-generate as user types
  useEffect(() => {
    const content = buildContent()
    if (!content) {
      setQrUrl('')
      return
    }
    
    const timer = setTimeout(async () => {
      try {
        const url = await QRCode.toDataURL(content, {
          width: Math.min(size, 200), // Smaller in preview
          margin: 2,
          color: { dark: qrColor, light: bgColor }
        })
        setQrUrl(url)
      } catch (e) {
        // Ignore errors while typing
      }
    }, 300) // Debounce 300ms

    return () => clearTimeout(timer)
  }, [text, wifi, tab, size, qrColor, bgColor])

  async function handleShare() {
    if (!qrUrl) return
    if (navigator.share) {
      try {
        const blob = await fetch(qrUrl).then(r => r.blob())
        const file = new File([blob], `qr-${Date.now()}.png`, { type: 'image/png' })
        await navigator.share({ files: [file], title: 'My QR Code' })
        return
      } catch (e) { /* Fall through */ }
    }
    
    try {
      const blob = await fetch(qrUrl).then(r => r.blob())
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (e) {
      console.error(e)
    }
  }

  async function handleDownload() {
    if (!qrUrl) return
    const link = document.createElement('a')
    link.href = qrUrl
    link.download = `qr-${Date.now()}.png`
    link.click()
  }

  const hasContent = tab === 'wifi' ? wifi.ssid : text

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white p-6 rounded-lg shadow">
        {/* Desktop: side by side. Mobile: stacked */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Left: Form */}
          <div>
            {/* Tabs */}
            <div className="flex gap-2 mb-4">
              {(['url', 'text', 'wifi'] as Tab[]).map(t => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`px-4 py-2 rounded font-medium ${tab === t ? 'bg-purple-600 text-white' : 'bg-gray-100'}`}
                >
                  {t === 'url' ? 'URL' : t === 'wifi' ? 'WiFi' : 'Text'}
                </button>
              ))}
            </div>

            {/* URL/Text Input */}
            {tab !== 'wifi' && (
              <input
                type={tab === 'url' ? 'url' : 'text'}
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder={tab === 'url' ? 'https://example.com' : 'Enter text...'}
                className="w-full px-4 py-2 border rounded mb-4"
              />
            )}

            {/* WiFi Input */}
            {tab === 'wifi' && (
              <div className="space-y-3 mb-4">
                <input
                  type="text"
                  value={wifi.ssid}
                  onChange={e => setWifi({ ...wifi, ssid: e.target.value })}
                  placeholder="Network name (SSID)"
                  className="w-full px-4 py-2 border rounded"
                />
                <input
                  type="password"
                  value={wifi.password}
                  onChange={e => setWifi({ ...wifi, password: e.target.value })}
                  placeholder="Password"
                  className="w-full px-4 py-2 border rounded"
                />
                <select
                  value={wifi.type}
                  onChange={e => setWifi({ ...wifi, type: e.target.value as WifiConfig['type'] })}
                  className="w-full px-4 py-2 border rounded"
                >
                  <option value="WPA">WPA/WPA2</option>
                  <option value="WEP">WEP</option>
                  <option value="nopass">None</option>
                </select>
              </div>
            )}

            {/* Options Row */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-xs text-gray-500 block mb-1">QR Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={qrColor}
                    onChange={e => setQrColor(e.target.value)}
                    className="w-10 h-10 border rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={qrColor}
                    onChange={e => setQrColor(e.target.value)}
                    className="flex-1 px-2 py-1 border rounded text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">Background</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={bgColor}
                    onChange={e => setBgColor(e.target.value)}
                    className="w-10 h-10 border rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={bgColor}
                    onChange={e => setBgColor(e.target.value)}
                    className="flex-1 px-2 py-1 border rounded text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Size Slider */}
            <div className="mb-4">
              <label className="text-xs text-gray-500 block mb-1">Size: {size}px</label>
              <input
                type="range"
                min={100}
                max={400}
                value={size}
                onChange={e => setSize(Number(e.target.value))}
                className="w-full"
              />
            </div>

            {/* Download & Share buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleDownload}
                disabled={!qrUrl}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50 text-sm"
              >
                <Download className="h-4 w-4" />
                Download
              </button>
              <button
                onClick={handleShare}
                disabled={!qrUrl}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-purple-600 text-purple-600 rounded hover:bg-purple-50 text-sm disabled:opacity-50"
              >
                {copied ? <Check className="h-4 w-4 text-green-600" /> : <Share2 className="h-4 w-4" />}
                {copied ? 'Copied!' : 'Share'}
              </button>
            </div>
          </div>

          {/* Right: Live Preview */}
          <div className="flex items-center justify-center">
            <div 
              className="inline-block p-4 rounded-lg border-2 border-dashed border-gray-300"
              style={{ backgroundColor: bgColor }}
            >
              {qrUrl ? (
                <img src={qrUrl} alt="QR Preview" style={{ width: Math.min(size, 200), height: Math.min(size, 200) }} />
              ) : (
                <div 
                  className="flex items-center justify-center text-gray-400 text-sm"
                  style={{ width: 150, height: 150 }}
                >
                  Preview updates as you type
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
