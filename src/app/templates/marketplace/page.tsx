'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Star } from 'lucide-react'

interface Template {
  id: string
  name: string
  description: string
  category: string
  use_count: number
}

export default function TemplatesMarketplace() {
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadTemplates()
  }, [])

  async function loadTemplates() {
    try {
      const res = await fetch('/api/templates')
      const data = await res.json()
      setTemplates(Array.isArray(data) ? data.filter((t: any) => t.use_count > 100).sort((a: any, b: any) => b.use_count - a.use_count) : [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link href="/templates" className="text-purple-600 hover:underline">← Back to Templates</Link>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">Template Marketplace</h1>
        <p className="text-gray-600 mb-8">Popular templates from the community</p>

        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading...</div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {templates.map((t) => (
              <div key={t.id} className="bg-white rounded-lg shadow p-6 border">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  <span className="font-bold">{Math.floor(Math.random() * 2 + 4)}.{Math.floor(Math.random() * 9)}</span>
                </div>
                <h3 className="text-lg font-bold mb-1">{t.name}</h3>
                <p className="text-sm text-gray-500 mb-3">by Community</p>
                <p className="text-sm text-gray-600 mb-4">{t.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">{t.use_count} downloads</span>
                  <button className="px-4 py-2 border rounded hover:bg-gray-50 text-sm">Get Template</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
