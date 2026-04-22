import Link from 'next/link'
import { Check, Zap } from 'lucide-react'

const plans = [
  { name: 'Starter', price: 'Free', desc: 'Perfect for individuals', features: ['10 QR codes/month', 'Basic analytics', 'Email support', 'Community access'] },
  { name: 'Professional', price: '$29/mo', desc: 'For growing teams', popular: true, features: ['Unlimited QR codes', 'Advanced analytics', 'Priority support', 'Custom branding', 'API access'] },
  { name: 'Enterprise', price: 'Custom', desc: 'For large organizations', features: ['Everything in Pro', 'SSO/SAML', 'Dedicated account manager', 'Custom SLA', 'On-premise option'] },
]

export default function PricingPage() {
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

      <main className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h1>
          <p className="text-xl text-gray-600">Choose the plan that fits your needs. Start free, upgrade anytime.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div key={plan.name} className={`bg-white rounded-xl border p-8 ${plan.popular ? 'border-purple-600 shadow-lg relative' : 'shadow-sm'}`}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                  <Zap className="h-3 w-3" /> Most Popular
                </div>
              )}
              <h3 className="text-xl font-bold">{plan.name}</h3>
              <p className="text-4xl font-bold my-4">{plan.price}</p>
              <p className="text-gray-600 mb-6">{plan.desc}</p>
              <ul className="space-y-3 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm"><Check className="h-4 w-4 text-green-500" /> {f}</li>
                ))}
              </ul>
              <button className={`w-full py-3 rounded-lg font-medium ${plan.popular ? 'bg-purple-600 text-white hover:bg-purple-700' : 'border border-purple-600 text-purple-600 hover:bg-purple-50'}`}>
                {plan.name === 'Enterprise' ? 'Contact Sales' : 'Get Started'}
              </button>
            </div>
          ))}
        </div>

        <p className="text-center text-gray-500 mt-12">All plans include SSL encryption, 99.9% uptime SLA, and 24/7 monitoring.</p>
      </main>
    </div>
  )
}
