'use client'

import { useState, useRef } from 'react'
import { QrCode, Wifi, Link, FileText, Download, Copy, Check, Image, X } from 'lucide-react'
import QRCode from 'qrcode'

type QrType = 'url' | 'wifi' | 'text'

export default function QRGeneratorPage() {
  const [activeTab, setActiveTab] = useState<QrType>('url')
  const [qrUrl, setQrUrl] = useState('')
  const [wifiSsid, setWifiSsid] = useState('')
  const [wifiPassword, setWifiPassword] = useState('')
  const [wifiType, setWifiType] = useState('WPA')
  const [textContent, setTextContent] = useState('')
  const [color, setColor] = useState('#6d28d9')
  const [bgColor, setBgColor] = useState('#ffffff')
  const [size, setSize] = useState(400)
  const [logoImage, setLogoImage] = useState<string | null>(null)
  const [logoSize, setLogoSize] = useState(60)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [qrDataUrl, setQrDataUrl] = useState('')
  const [copied, setCopied] = useState(false)

  function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    
    const reader = new FileReader()
    reader.onload = (ev) => {
      setLogoImage(ev.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  function removeLogo() {
    setLogoImage(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  async function generateQR() {
    let content = ''
    
    switch (activeTab) {
      case 'url':
        content = qrUrl.startsWith('http') ? qrUrl : `https://${qrUrl}`
        break
      case 'wifi':
        content = `WIFI:T:${wifiType};S:${wifiSsid};P:${wifiPassword};;`
        break
      case 'text': {
        if (!textContent.trim()) return
        // For text QR codes, store in DB and use display URL
        try {
          const res = await fetch('/api/qr/text', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: textContent })
          })
          const data = await res.json()
          if (data.error) {
            console.error('Text QR API error:', data.error)
            return
          }
          // QR points to the display page URL
          content = data.qrUrl
        } catch (e) {
          console.error('Failed to create text QR:', e)
          return
        }
        break
      }
    }

    if (!content) return

    try {
      const canvas = document.createElement('canvas')
      const sizePx = size * 2 // Higher res for better quality
      
      await QRCode.toCanvas(canvas, content, {
        width: sizePx,
        margin: 2,
        color: {
          dark: color,
          light: bgColor
        },
        errorCorrectionLevel: 'H' // High error correction for logo overlay
      })

      // If logo, draw it in center
      if (logoImage) {
        const ctx = canvas.getContext('2d')
        if (ctx) {
          const logoPx = logoSize * 2
          const logoX = (sizePx - logoPx) / 2
          const logoY = (sizePx - logoPx) / 2
          
          // Draw white background for logo
          ctx.fillStyle = bgColor
          ctx.fillRect(logoX, logoY, logoPx, logoPx)
          
          // Draw logo
          const img = document.createElement('img')
          img.src = logoImage
          await new Promise<void>(resolve => { img.onload = () => resolve() })
          ctx.drawImage(img, logoX, logoY, logoPx, logoPx)
        }
      }

      setQrDataUrl(canvas.toDataURL('image/png'))
    } catch (e) {
      console.error('Failed to generate QR:', e)
    }
  }

  async function downloadQr() {
    if (!qrDataUrl) return
    const link = document.createElement('a')
    link.href = qrDataUrl
    link.download = `qr-${activeTab}-${Date.now()}.png`
    link.click()
  }

  function copyContent() {
    let content = ''
    switch (activeTab) {
      case 'url':
        content = qrUrl
        break
      case 'wifi':
        content = `WIFI:T:${wifiType};S:${wifiSsid};P:${wifiPassword};;`
        break
      case 'text':
        content = textContent
        break
    }
    navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const tabs = [
    { id: 'url' as QrType, label: 'URL', icon: Link },
    { id: 'wifi' as QrType, label: 'WiFi', icon: Wifi },
    { id: 'text' as QrType, label: 'Text', icon: FileText },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <QrCode className="h-8 w-8 text-purple-600" />
          <h1 className="text-2xl font-bold">QR Code Generator</h1>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setQrDataUrl(''); }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                  activeTab === tab.id 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Input Side */}
            <div className="space-y-4">
              {activeTab === 'url' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">URL / Website</label>
                  <input
                    type="url"
                    value={qrUrl}
                    onChange={e => setQrUrl(e.target.value)}
                    placeholder="https://example.com"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              )}

              {activeTab === 'wifi' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Network Name (SSID)</label>
                    <input
                      type="text"
                      value={wifiSsid}
                      onChange={e => setWifiSsid(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg"
                      placeholder="MyNetwork"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                    <input
                      type="text"
                      value={wifiPassword}
                      onChange={e => setWifiPassword(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg"
                      placeholder="password123"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Security</label>
                    <select
                      value={wifiType}
                      onChange={e => setWifiType(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg"
                    >
                      <option value="WPA">WPA/WPA2</option>
                      <option value="WEP">WEP</option>
                      <option value="nopass">None</option>
                    </select>
                  </div>
                </div>
              )}

              {activeTab === 'text' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Text Content</label>
                  <textarea
                    value={textContent}
                    onChange={e => setTextContent(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="Any text content..."
                  />
                </div>
              )}

              {/* Color Options */}
              <div className="border-t pt-4">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Colors</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">QR Color</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={color}
                        onChange={e => setColor(e.target.value)}
                        className="w-10 h-10 border rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={color}
                        onChange={e => setColor(e.target.value)}
                        className="flex-1 px-3 py-2 border rounded text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">Background</label>
                    <div className="flex gap-2">
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
                        className="flex-1 px-3 py-2 border rounded text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Size */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Size: {size}px</label>
                <input
                  type="range"
                  min="150"
                  max="600"
                  value={size}
                  onChange={e => setSize(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>

              {/* Logo Upload */}
              <div className="border-t pt-4">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Custom Logo (Optional)</h3>
                {logoImage ? (
                  <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                    <img src={logoImage} alt="Logo" className="w-16 h-16 object-contain rounded" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Logo uploaded</p>
                      <p className="text-xs text-gray-500">Size: {logoSize}px</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="range"
                        min="30"
                        max="120"
                        value={logoSize}
                        onChange={e => setLogoSize(parseInt(e.target.value))}
                        className="w-20"
                      />
                      <button
                        onClick={removeLogo}
                        className="p-2 text-red-500 hover:bg-red-50 rounded"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg w-full hover:border-purple-400 hover:bg-purple-50 transition-colors"
                  >
                    <Image className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-600">Upload logo/image</span>
                  </button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
                <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 2MB. Logo will be centered in QR code.</p>
              </div>

              <button
                onClick={generateQR}
                className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium"
              >
                Generate QR Code
              </button>
            </div>

            {/* Preview Side */}
            <div className="flex flex-col items-center">
              <h3 className="text-sm font-medium text-gray-700 mb-4">Preview</h3>
              <div className="bg-gray-100 rounded-xl p-8 flex items-center justify-center w-full">
                {qrDataUrl ? (
                  <img src={qrDataUrl} alt="QR Code" className="w-64 h-64 object-contain" />
                ) : (
                  <div className="text-gray-400 text-center">
                    <QrCode className="h-24 w-24 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">QR code will appear here</p>
                  </div>
                )}
              </div>
              {qrDataUrl && (
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={downloadQr}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                  >
                    <Download className="h-4 w-4" />
                    Download PNG
                  </button>
                  <button
                    onClick={copyContent}
                    className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    {copied ? 'Copied!' : 'Copy Content'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
