'use client'

import { useState } from 'react'
import QRCode from 'qrcode'
import { Download, Copy, Check, Wifi, Home, Key, Clock } from 'lucide-react'

export default function PropertyPalPage() {
  const [property, setProperty] = useState({
    name: '',
    address: '',
    wifiSsid: '',
    wifiPassword: '',
    wifiType: 'WPA',
    checkIn: '3:00 PM',
    checkOut: '11:00 AM',
    accessCode: '',
    listingUrl: ''
  })
  const [qrUrls, setQrUrls] = useState<Record<string, string>>({})
  const [copied, setCopied] = useState<string | null>(null)

  async function generateQrs() {
    if (!property.name) return

    const baseUrl = `https://propertypal.com/p/${property.name.toLowerCase().replace(/\s+/g, '-')}`
    const params = new URLSearchParams()
    if (property.wifiSsid) params.set('wifi_ssid', property.wifiSsid)
    if (property.wifiPassword) params.set('wifi_pass', property.wifiPassword)
    if (property.accessCode) params.set('code', property.accessCode)

    const propertyUrl = `${baseUrl}?${params.toString()}`

    // Generate property QR
    const propertyQr = await QRCode.toDataURL(propertyUrl, { width: 300, margin: 2 })

    // Generate WiFi QR
    let wifiQr = ''
    if (property.wifiSsid) {
      const wifiContent = `WIFI:T:${property.wifiType};S:${property.wifiSsid};P:${property.wifiPassword};;`
      wifiQr = await QRCode.toDataURL(wifiContent, { width: 300, margin: 2 })
    }

    setQrUrls({ property: propertyQr, wifi: wifiQr })
  }

  async function handleDownload(key: string) {
    if (!qrUrls[key]) return
    const link = document.createElement('a')
    link.href = qrUrls[key]
    link.download = `qr-${key}-${Date.now()}.png`
    link.click()
  }

  async function handleCopy(text: string, key: string) {
    await navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }

  const slug = (property.name || '').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    const propertyUrl = `https://propertypal.com/p/${slug}`

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <Home className="h-8 w-8 text-purple-600" />
          <h1 className="text-2xl font-bold">PropertyPal QR Codes</h1>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Property Details</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Property Name *</label>
              <input
                type="text"
                value={property.name}
                onChange={e => setProperty({ ...property, name: e.target.value })}
                className="w-full px-3 py-2 border rounded"
                placeholder="Beach House Getaway"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Address</label>
              <input
                type="text"
                value={property.address}
                onChange={e => setProperty({ ...property, address: e.target.value })}
                className="w-full px-3 py-2 border rounded"
                placeholder="123 Ocean Drive"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Listing URL</label>
              <input
                type="url"
                value={property.listingUrl}
                onChange={e => setProperty({ ...property, listingUrl: e.target.value })}
                className="w-full px-3 py-2 border rounded"
                placeholder="https://airbnb.com/rooms/..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Access Code</label>
              <input
                type="text"
                value={property.accessCode}
                onChange={e => setProperty({ ...property, accessCode: e.target.value })}
                className="w-full px-3 py-2 border rounded"
                placeholder="1234"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Wifi className="h-5 w-5 text-purple-600" />
            <h2 className="text-lg font-semibold">WiFi Details</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Network Name (SSID)</label>
              <input
                type="text"
                value={property.wifiSsid}
                onChange={e => setProperty({ ...property, wifiSsid: e.target.value })}
                className="w-full px-3 py-2 border rounded"
                placeholder="MyNetwork"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type="text"
                value={property.wifiPassword}
                onChange={e => setProperty({ ...property, wifiPassword: e.target.value })}
                className="w-full px-3 py-2 border rounded"
                placeholder="password123"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Security Type</label>
              <select
                value={property.wifiType}
                onChange={e => setProperty({ ...property, wifiType: e.target.value })}
                className="w-full px-3 py-2 border rounded"
              >
                <option value="WPA">WPA/WPA2</option>
                <option value="WEP">WEP</option>
                <option value="nopass">None</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="h-5 w-5 text-purple-600" />
            <h2 className="text-lg font-semibold">Check-in / Check-out</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Check-in Time</label>
              <input
                type="text"
                value={property.checkIn}
                onChange={e => setProperty({ ...property, checkIn: e.target.value })}
                className="w-full px-3 py-2 border rounded"
                placeholder="3:00 PM"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Check-out Time</label>
              <input
                type="text"
                value={property.checkOut}
                onChange={e => setProperty({ ...property, checkOut: e.target.value })}
                className="w-full px-3 py-2 border rounded"
                placeholder="11:00 AM"
              />
            </div>
          </div>
        </div>

        <button
          onClick={generateQrs}
          disabled={!property.name}
          className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 font-medium mb-6"
        >
          Generate QR Codes
        </button>

        {qrUrls.property && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <h3 className="font-semibold mb-4">Property QR Code</h3>
              <div className="bg-gray-100 rounded-lg p-4 inline-block mb-4">
                <img src={qrUrls.property} alt="Property QR" className="w-48 h-48" />
              </div>
              <p className="text-sm text-gray-500 mb-2">Scans to: {propertyUrl}</p>
              <div className="flex justify-center gap-2">
                <button
                  onClick={() => handleDownload('property')}
                  className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 text-sm"
                >
                  Download
                </button>
                <button
                  onClick={() => handleCopy(propertyUrl, 'property')}
                  className="px-4 py-2 border rounded hover:bg-gray-50 text-sm flex items-center gap-1"
                >
                  {copied === 'property' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied === 'property' ? 'Copied!' : 'Copy URL'}
                </button>
              </div>
            </div>

            {qrUrls.wifi && (
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <h3 className="font-semibold mb-4">WiFi QR Code</h3>
                <div className="bg-gray-100 rounded-lg p-4 inline-block mb-4">
                  <img src={qrUrls.wifi} alt="WiFi QR" className="w-48 h-48" />
                </div>
                <p className="text-sm text-gray-500 mb-2">Network: {property.wifiSsid}</p>
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => handleDownload('wifi')}
                    className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 text-sm"
                  >
                    Download
                  </button>
                  <button
                    onClick={() => handleCopy(`${property.wifiSsid}:${property.wifiPassword}`, 'wifi')}
                    className="px-4 py-2 border rounded hover:bg-gray-50 text-sm flex items-center gap-1"
                  >
                    {copied === 'wifi' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    {copied === 'wifi' ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="mt-8 bg-purple-50 rounded-lg p-6">
          <h3 className="font-semibold mb-2">Property Info Card</h3>
          <p className="text-sm text-gray-600 mb-4">
            Print this card and leave it in the property for guests
          </p>
          <div className="bg-white rounded border p-4 text-sm">
            <p className="font-bold text-lg">{property.name || 'Property Name'}</p>
            {property.address && <p className="text-gray-600">{property.address}</p>}
            {property.accessCode && <p className="mt-2"><Key className="h-4 w-4 inline mr-1" />Access Code: {property.accessCode}</p>}
            <div className="grid grid-cols-2 gap-4 mt-3">
              <p><Clock className="h-4 w-4 inline mr-1" />Check-in: {property.checkIn}</p>
              <p><Clock className="h-4 w-4 inline mr-1" />Check-out: {property.checkOut}</p>
            </div>
            {property.wifiSsid && (
              <p className="mt-2"><Wifi className="h-4 w-4 inline mr-1" />WiFi: {property.wifiSsid}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
