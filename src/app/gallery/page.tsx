import Link from 'next/link'
import { Image, Grid, Layout as LayoutIcon } from 'lucide-react'

export default function GalleryPage() {
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

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Asset Gallery</h1>
          <div className="flex gap-2">
            <button className="p-2 bg-purple-100 text-purple-600 rounded"><Grid className="h-5 w-5" /></button>
            <button className="p-2 text-gray-400 hover:bg-gray-100 rounded"><LayoutIcon className="h-5 w-5" /></button>
          </div>
        </div>

        {/* Gallery Grid - placeholder assets */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array.from({ length: 24 }, (_, i) => (
            <div key={i} className="aspect-square bg-gray-100 rounded-lg flex flex-col items-center justify-center hover:bg-gray-200 transition-colors cursor-pointer">
              <div className="w-16 h-16 bg-purple-100 rounded flex items-center justify-center mb-2">
                <span className="text-purple-600 font-bold text-lg">{String(i + 1).padStart(2, '0')}</span>
              </div>
              <p className="text-xs text-gray-600">Asset #{i + 1}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center text-gray-500">
          <p>Your asset images will appear here once you add them.</p>
          <Link href="/assets" className="text-purple-600 hover:underline mt-2 inline-block">
            Go to Assets →
          </Link>
        </div>
      </main>
    </div>
  )
}
