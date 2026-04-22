'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { QrCode, FileText, Clock } from 'lucide-react'

export default function TextDisplayPage() {
  const params = useParams()
  const id = params.id as string
  const [content, setContent] = useState<string | null>(null)
  const [createdAt, setCreatedAt] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchContent() {
      try {
        const res = await fetch(`/api/qr/text?id=${id}`)
        const data = await res.json()
        
        if (data.error) {
          setError(data.error)
        } else {
          setContent(data.content)
          setCreatedAt(data.createdAt)
        }
      } catch (err) {
        setError('Failed to load content')
      } finally {
        setLoading(false)
      }
    }
    
    if (id) {
      fetchContent()
    }
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <QrCode className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Content Not Found</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <p className="text-sm text-gray-500">
            This QR code may have been deleted or never existed.
          </p>
          <a 
            href="https://assethawk.sageaaa.com"
            className="mt-6 inline-block px-6 py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition-colors"
          >
            Go to AssetHawk
          </a>
        </div>
      </div>
    )
  }

  const formattedDate = createdAt 
    ? new Date(createdAt).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    : null

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-lg w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-2xl mb-4">
            <FileText className="w-8 h-8 text-purple-600" />
          </div>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-2">
            <QrCode className="w-4 h-4" />
            <span>Scanned with AssetHawk</span>
          </div>
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4">
            <h2 className="text-white font-semibold text-lg">Text Content</h2>
          </div>
          
          <div className="p-6">
            <div className="bg-gray-50 rounded-xl p-4 mb-4">
              <p className="text-gray-800 text-lg leading-relaxed whitespace-pre-wrap">
                {content}
              </p>
            </div>
            
            {formattedDate && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Clock className="w-4 h-4" />
                <span>Created {formattedDate}</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <a 
            href="https://assethawk.sageaaa.com/generator"
            className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium transition-colors"
          >
            <QrCode className="w-5 h-5" />
            Create your own QR codes with AssetHawk
          </a>
        </div>
      </div>
    </div>
  )
}
