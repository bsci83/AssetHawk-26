import Link from 'next/link'
import { QrCode, Shield, MapPin, Activity, BarChart3, Clock, Package, ArrowRight, Check } from 'lucide-react'
import IndustriesSection from '@/components/sections/IndustriesSection'
import PricingSection from '@/components/sections/PricingSection'
import QRGenerator from '@/components/qr/QRGenerator'

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <QrCode className="h-8 w-8 text-purple-600" />
              <span className="text-2xl font-bold text-gray-900">AssetHawk</span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="#features" className="text-gray-600 hover:text-gray-900 font-medium">Features</Link>
              <Link href="#industries" className="text-gray-600 hover:text-gray-900 font-medium">Industries</Link>
              <Link href="#pricing" className="text-gray-600 hover:text-gray-900 font-medium">Pricing</Link>
            </nav>
            <div className="space-x-4">
              <Link href="/signin" className="text-gray-600 hover:text-gray-900 font-medium">Sign In</Link>
              <Link href="/signup" className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 font-medium">Get Started Free</Link>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-purple-600 to-indigo-700 py-20 md:py-32">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 md:grid-cols-2 items-center">
              <div className="space-y-6">
                <h1 className="text-4xl md:text-5xl font-bold text-white">
                  Asset Tracking with Secure QR Codes
                </h1>
                <p className="text-lg text-white/90 max-w-md">
                  Manage your assets with advanced QR tracking technology. Generate secure QR codes, track scan events,
                  and monitor your assets' location in real-time.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/dashboard" className="bg-white text-purple-700 px-6 py-3 rounded-lg hover:bg-white/90 font-medium text-center">
                    <Package className="inline mr-2 h-5 w-5" />
                    Manage Assets
                  </Link>
                  <Link href="/scan" className="border border-purple-600 text-purple-600 px-6 py-3 rounded-lg hover:bg-purple-600 hover:text-white font-medium text-center">
                    <QrCode className="inline mr-2 h-5 w-5" />
                    Scan QR Code
                  </Link>
                </div>
              </div>
              <div className="flex justify-center">
                <div className="relative w-64 h-64 md:w-80 md:h-80 bg-purple-800/50 rounded-lg flex items-center justify-center">
                  <QrCode className="w-full h-full text-white/90" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-gray-950 text-white">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Key Features</h2>
              <p className="text-white/70 max-w-2xl mx-auto">Powerful tools for asset management</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-6">
                <div className="mb-4"><QrCode className="h-10 w-10 text-purple-400" /></div>
                <h3 className="text-xl font-bold mb-2">Secure QR Codes</h3>
                <p className="text-white/70">Generate QR codes with digital signatures for enhanced security.</p>
              </div>
              <div className="p-6">
                <div className="mb-4"><MapPin className="h-10 w-10 text-purple-400" /></div>
                <h3 className="text-xl font-bold mb-2">Geolocation Validation</h3>
                <p className="text-white/70">Ensure assets are scanned in the correct location.</p>
              </div>
              <div className="p-6">
                <div className="mb-4"><Activity className="h-10 w-10 text-purple-400" /></div>
                <h3 className="text-xl font-bold mb-2">Scan Events</h3>
                <p className="text-white/70">Track and monitor all scan events with detailed data.</p>
              </div>
              <div className="p-6">
                <div className="mb-4"><Shield className="h-10 w-10 text-purple-400" /></div>
                <h3 className="text-xl font-bold mb-2">Enhanced Security</h3>
                <p className="text-white/70">Protect your assets with encrypted QR codes.</p>
              </div>
              <div className="p-6">
                <div className="mb-4"><BarChart3 className="h-10 w-10 text-purple-400" /></div>
                <h3 className="text-xl font-bold mb-2">Advanced Analytics</h3>
                <p className="text-white/70">Gain insights into asset movement patterns.</p>
              </div>
              <div className="p-6">
                <div className="mb-4"><Clock className="h-10 w-10 text-purple-400" /></div>
                <h3 className="text-xl font-bold mb-2">Real-time Tracking</h3>
                <p className="text-white/70">Monitor asset location and status in real-time.</p>
              </div>
            </div>
          </div>
        </section>

        {/* QR Generator Section */}
        <section className="py-20 bg-gray-50">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Create Your QR Code</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">Generate secure QR codes instantly - no signup required</p>
            </div>
            <QRGenerator />
          </div>
        </section>

        {/* Industries */}
        <IndustriesSection />

        {/* How It Works */}
        <section id="how-it-works" className="py-20 bg-white">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">How It Works</h2>
              <p className="text-gray-600">Simple steps to get started</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-purple-600">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Create an Account</h3>
                <p className="text-gray-600">Sign up for free and set up your organization</p>
              </div>
              <div className="text-center">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-purple-600">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Add Your Assets</h3>
                <p className="text-gray-600">Import or create assets with unique QR codes</p>
              </div>
              <div className="text-center">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-purple-600">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Scan & Track</h3>
                <p className="text-gray-600">Scan QR codes to view and update asset info</p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <PricingSection />

        {/* CTA */}
        <section className="py-20 bg-purple-600">
          <div className="container max-w-7xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
            <p className="text-white/90 mb-8 max-w-xl mx-auto">Join thousands of businesses tracking their assets with AssetHawk</p>
            <Link href="/signup" className="bg-white text-purple-700 px-8 py-3 rounded-lg hover:bg-white/90 font-medium inline-flex items-center gap-2">
              Start Free Today <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-950 text-white py-12">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <QrCode className="h-6 w-6 text-purple-400" />
                <span className="text-lg font-bold">AssetHawk</span>
              </div>
              <p className="text-gray-400 text-sm">Advanced asset tracking with secure QR codes for modern businesses.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="#features" className="hover:text-white">Features</Link></li>
                <li><Link href="#pricing" className="hover:text-white">Pricing</Link></li>
                <li><Link href="/api" className="hover:text-white">API</Link></li>
                <li><Link href="/integrations" className="hover:text-white">Integrations</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Industries</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/industries/film" className="hover:text-white">Film Production</Link></li>
                <li><Link href="/industries/retail" className="hover:text-white">Retail</Link></li>
                <li><Link href="/industries/logistics" className="hover:text-white">Logistics</Link></li>
                <li><Link href="/industries/enterprise" className="hover:text-white">Enterprise</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/about" className="hover:text-white">About</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
                <li><Link href="/support" className="hover:text-white">Support</Link></li>
                <li><Link href="/privacy" className="hover:text-white">Privacy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
            <span>© 2025 AssetHawk. All rights reserved.</span>
            <div className="flex gap-4 mt-4 md:mt-0">
              <Link href="/terms" className="hover:text-white">Terms</Link>
              <Link href="/privacy" className="hover:text-white">Privacy</Link>
              <Link href="/security" className="hover:text-white">Security</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
