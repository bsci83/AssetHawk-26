import Link from 'next/link'

export default function AboutPage() {
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
        <h1 className="text-4xl font-bold text-gray-900 mb-6">About AssetHawk</h1>
        <div className="prose prose-lg max-w-none">
          <p className="text-xl text-gray-600 mb-8">
            AssetHawk is a modern asset tracking platform that helps businesses manage their physical assets through secure QR codes.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">Our Mission</h2>
          <p className="text-gray-600 mb-6">
            We believe every physical asset should have a digital identity. Our mission is to make asset tracking simple, secure, and accessible for businesses of all sizes.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">Our Team</h2>
          <p className="text-gray-600 mb-6">
            Built by a team of product designers and engineers passionate about simplifying asset management. We combine deep technical expertise with practical industry experience.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">Contact</h2>
          <p className="text-gray-600">
            Have questions? <Link href="/contact" className="text-purple-600 hover:underline">Get in touch</Link> with our team.
          </p>
        </div>
      </main>

      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-400">© 2026 AssetHawk. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
