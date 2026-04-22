import Link from 'next/link'

export default function PrivacyPage() {
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
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
        <p className="text-sm text-gray-500 mb-8">Last updated: January 1, 2026</p>

        <div className="prose prose-lg max-w-none space-y-6 text-gray-600">
          <h2 className="text-2xl font-bold text-gray-900">1. Information We Collect</h2>
          <p>We collect information you provide directly, including account registration details, asset data you create, and scan event information.</p>

          <h2 className="text-2xl font-bold text-gray-900">2. How We Use Your Information</h2>
          <p>We use your information to provide and improve our services, process transactions, and communicate with you about your account.</p>

          <h2 className="text-2xl font-bold text-gray-900">3. Information Sharing</h2>
          <p>We do not sell your personal information. We may share information with service providers who assist in operating our platform.</p>

          <h2 className="text-2xl font-bold text-gray-900">4. Data Security</h2>
          <p>We implement appropriate technical and organizational measures to protect your personal information against unauthorized access.</p>

          <h2 className="text-2xl font-bold text-gray-900">5. Contact</h2>
          <p>For privacy-related questions, contact us at <a href="mailto:privacy@assethawk.com" className="text-purple-600 hover:underline">privacy@assethawk.com</a></p>
        </div>
      </main>
    </div>
  )
}
