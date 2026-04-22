'use client'

import { Film, ShoppingCart, Truck, Building } from 'lucide-react'
import Link from 'next/link'

const industries = [
  { name: 'Film & TV Production', icon: Film, desc: 'Track equipment, props, and crew locations across multiple sets', href: '/industries/film' },
  { name: 'Retail & E-commerce', icon: ShoppingCart, desc: 'Connect physical products to digital experiences and inventory', href: '/industries/retail', color: 'text-green-600' },
  { name: 'Logistics & Shipping', icon: Truck, desc: 'Monitor containers and shipments throughout the supply chain', href: '/industries/logistics', color: 'text-blue-600' },
  { name: 'Enterprise Assets', icon: Building, desc: 'Manage IT equipment, facilities, and corporate resources', href: '/industries/enterprise', color: 'text-orange-600' },
]

export default function IndustriesSection() {
  return (
    <section id="industries" className="py-20 bg-white">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Built for Every Industry</h2>
          <p className="text-xl text-gray-600">From film production to retail, AssetHawk scales to your needs</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {industries.map((ind) => (
            <Link key={ind.name} href={ind.href} className="text-center p-6 border rounded-lg hover:shadow-lg transition-shadow group">
              <ind.icon className={`h-12 w-12 mx-auto mb-4 ${ind.color || 'text-purple-600'}`} />
              <h3 className="font-semibold mb-2 group-hover:text-purple-600 transition-colors">{ind.name}</h3>
              <p className="text-sm text-gray-600">{ind.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
