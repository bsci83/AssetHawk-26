import Link from 'next/link'
import { Code, ExternalLink } from 'lucide-react'

export default function ApiPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-purple-600"><rect width="5" height="5" x="3" y="3" rx="1"/><rect width="5" height="5" x="16" y="3" rx="1"/><rect width="5" height="5" x="3" y="16" rx="1"/><path d="M21 16h-3a2 2 0 0 0-2 2v3"/><path d="M21 21v.01"/><path d="M12 7v3a2 2 0 0 1-2 2H7"/><path d="M3 12h.01"/><path d="M12 3h.01"/><path d="M12 16v.01"/><path d="M16 12h1"/><path d="M21 12v.01"/><path d="M12 21v-1"/></svg>
            <span className="text-2xl font-bold text-gray-900">AssetHawk</span>
          </Link>
          <nav className="flex items-center space-x-4">
            <Link href="/auth/signin" className="text-gray-600 hover:text-gray-900">Sign In</Link>
            <Link href="/auth/signup" className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">Get Started</Link>
          </nav>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-16">
        <div className="flex items-center gap-4 mb-6">
          <Code className="h-12 w-12 text-purple-600" />
          <h1 className="text-4xl font-bold text-gray-900">API Documentation</h1>
        </div>

        <p className="text-xl text-gray-600 mb-8">Build custom integrations with the AssetHawk REST API.</p>

        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Base URL</h2>
          <code className="bg-gray-200 px-3 py-1 rounded text-sm">https://api.assethawk.com</code>
        </div>

        <div className="space-y-8">
          <div>
            <h3 className="text-xl font-bold mb-3">Authentication</h3>
            <p className="text-gray-600 mb-4">All API requests require an API key passed in the Authorization header.</p>
            <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
Authorization: Bearer YOUR_API_KEY
            </pre>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-3">Assets API</h3>
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">GET</span>
                  <code className="text-sm">/api/assets?orgId={'{orgId}'}</code>
                </div>
                <p className="text-gray-600 text-sm mb-2">List all assets for an organization</p>
                <p className="text-xs text-gray-500">Query params: orgId (required), status (optional)</p>
              </div>
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold">POST</span>
                  <code className="text-sm">/api/assets</code>
                </div>
                <p className="text-gray-600 text-sm mb-2">Create a new asset</p>
                <p className="text-xs text-gray-500">Body: orgId, assetTag, name, description, status</p>
              </div>
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs font-bold">GET</span>
                  <code className="text-sm">/api/assets/{'{id}'}</code>
                </div>
                <p className="text-gray-600 text-sm mb-2">Get asset by ID</p>
              </div>
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold">DELETE</span>
                  <code className="text-sm">/api/assets/{'{id}'}</code>
                </div>
                <p className="text-gray-600 text-sm mb-2">Delete an asset</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-3">Audit API</h3>
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">GET</span>
                  <code className="text-sm">/api/audit?orgId={'{orgId}'}</code>
                </div>
                <p className="text-gray-600 text-sm">Get audit log for organization</p>
              </div>
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold">POST</span>
                  <code className="text-sm">/api/audit</code>
                </div>
                <p className="text-gray-600 text-sm">Create audit log entry</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-3">Maintenance API</h3>
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">GET</span>
                  <code className="text-sm">/api/maintenance?orgId={'{orgId}'}</code>
                </div>
                <p className="text-gray-600 text-sm">Get maintenance schedules</p>
              </div>
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold">POST</span>
                  <code className="text-sm">/api/maintenance</code>
                </div>
                <p className="text-gray-600 text-sm">Create maintenance schedule</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-3">Work Orders API</h3>
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">GET</span>
                  <code className="text-sm">/api/work-orders?orgId={'{orgId}'}</code>
                </div>
                <p className="text-gray-600 text-sm">List work orders</p>
              </div>
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold">POST</span>
                  <code className="text-sm">/api/work-orders</code>
                </div>
                <p className="text-gray-600 text-sm">Create work order</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Link href="/contact" className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium">
            Get API Key <ExternalLink className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </main>
    </div>
  )
}
