import Link from 'next/link'

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-purple-600"><rect width="5" height="5" x="3" y="3" rx="1"/><rect width="5" height="5" x="16" y="3" rx="1"/><rect width="5" height="5" x="3" y="16" rx="1"/><path d="M21 16h-3a2 2 0 0 0-2 2v3"/><path d="M21 21v.01"/><path d="M12 7v3a2 2 0 0 1-2 2H7"/><path d="M3 12h.01"/><path d="M12 3h.01"/><path d="M12 16v.01"/><path d="M16 12h1"/><path d="M21 12v.01"/><path d="M12 21v-1"/></svg>
            <span className="text-2xl font-bold text-gray-900">AssetHawk</span>
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Security</h1>
        <p className="text-xl text-gray-600 mb-8">Your data security is our top priority.</p>

        <div className="space-y-8">
          <div className="border-b pb-8">
            <h2 className="text-2xl font-bold mb-4">🔒 Encryption</h2>
            <p className="text-gray-600">All data is encrypted in transit using TLS 1.3 and at rest using AES-256 encryption.</p>
          </div>
          <div className="border-b pb-8">
            <h2 className="text-2xl font-bold mb-4">🔑 Authentication</h2>
            <p className="text-gray-600">Secure authentication with bcrypt password hashing. Multi-factor authentication available for enhanced security.</p>
          </div>
          <div className="border-b pb-8">
            <h2 className="text-2xl font-bold mb-4">📋 Access Controls</h2>
            <p className="text-gray-600">Role-based access control ensures users only have access to what they need.</p>
          </div>
          <div className="border-b pb-8">
            <h2 className="text-2xl font-bold mb-4">🛡️ QR Code Security</h2>
            <p className="text-gray-600">QR codes can include digital signatures and expiration dates for enhanced security.</p>
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-4">📝 Compliance</h2>
            <p className="text-gray-600">We comply with applicable data protection regulations including GDPR.</p>
          </div>
        </div>
      </main>
    </div>
  )
}
