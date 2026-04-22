import Link from 'next/link'
import { Film } from 'lucide-react'

export default function FilmIndustryPage() {
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
          <Film className="h-12 w-12 text-purple-600" />
          <h1 className="text-4xl font-bold text-gray-900">Film & TV Production</h1>
        </div>

        <p className="text-xl text-gray-600 mb-8">Track equipment, props, and crew locations across multiple sets.</p>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-xl font-bold mb-3">Equipment Tracking</h3>
            <p className="text-gray-600">Track cameras, lighting, sound equipment, and more with durable QR codes that survive the rigors of production.</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-xl font-bold mb-3">Prop Management</h3>
            <p className="text-gray-600">Keep track of thousands of props across multiple scenes and locations. Never lose a critical prop again.</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-xl font-bold mb-3">Location Tracking</h3>
            <p className="text-gray-600">Know exactly where equipment is across sound stages, locations, and rental houses.</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-xl font-bold mb-3">Crew Management</h3>
            <p className="text-gray-600">Assign assets to crew members and track responsibility throughout production.</p>
          </div>
        </div>

        <div className="text-center">
          <Link href="/auth/signup" className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium">
            Start Free Trial
          </Link>
        </div>
      </main>
    </div>
  )
}
