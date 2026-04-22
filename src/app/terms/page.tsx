import Link from 'next/link'

export default function TermsPage() {
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
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Terms of Service</h1>
        <p className="text-sm text-gray-500 mb-8">Last updated: January 1, 2026</p>

        <div className="prose prose-lg max-w-none space-y-6 text-gray-600">
          <h2 className="text-2xl font-bold text-gray-900">1. Acceptance of Terms</h2>
          <p>By accessing or using AssetHawk's services, you agree to be bound by these Terms of Service.</p>

          <h2 className="text-2xl font-bold text-gray-900">2. Use of Service</h2>
          <p>You agree to use AssetHawk only for lawful purposes and in accordance with these Terms.</p>

          <h2 className="text-2xl font-bold text-gray-900">3. Account Responsibilities</h2>
          <p>You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account.</p>

          <h2 className="text-2xl font-bold text-gray-900">4. Intellectual Property</h2>
          <p>AssetHawk retains all rights to its services, software, and trademarks. You retain rights to your content.</p>

          <h2 className="text-2xl font-bold text-gray-900">5. Limitation of Liability</h2>
          <p>AssetHawk shall not be liable for any indirect, incidental, or consequential damages arising from your use of the service.</p>

          <h2 className="text-2xl font-bold text-gray-900">6. Changes to Terms</h2>
          <p>We reserve the right to modify these terms at any time. Continued use of the service constitutes acceptance of modified terms.</p>
        </div>
      </main>
    </div>
  )
}
