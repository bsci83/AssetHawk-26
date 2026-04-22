'use client'

import { Check, ArrowRight } from 'lucide-react'
import Link from 'next/link'

const plans = [
  {
    name: 'Starter',
    price: 'Free',
    desc: 'For individuals and small teams',
    features: ['10 Static QR codes', '5 Dynamic QR codes', 'Basic analytics', 'Email support'],
    cta: 'Get Started',
    href: '/signup',
    popular: false,
  },
  {
    name: 'Professional',
    price: '$29',
    period: '/month',
    desc: 'For growing businesses',
    features: ['Unlimited QR codes', 'Advanced analytics', 'Geolocation validation', 'Priority support'],
    cta: 'Start Free Trial',
    href: '/signup?plan=pro',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    desc: 'For large organizations',
    features: ['Everything in Professional', 'Custom integrations', 'Dedicated account manager', 'SLA & premium support'],
    cta: 'Contact Sales',
    href: '/contact',
    popular: false,
  },
]

export default function PricingSection() {
  return (
    <section id="pricing" className="py-20 bg-white">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Simple, Transparent Pricing</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Choose the plan that fits your needs. All plans include access to our core features.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div key={plan.name} className={`bg-white rounded-lg border p-6 ${plan.popular ? 'border-purple-600 shadow-md relative' : 'shadow-sm'}`}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Popular
                </div>
              )}
              <div className="mb-4">
                <h3 className="text-xl font-bold">{plan.name}</h3>
                <p className="text-3xl font-bold mt-2">
                  {plan.price}
                  {plan.period && <span className="text-base font-normal text-gray-500">{plan.period}</span>}
                </p>
                <p className="text-gray-500 mt-1">{plan.desc}</p>
              </div>
              <ul className="space-y-2 mb-6">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <ArrowRight className="h-4 w-4 text-purple-600" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Link href={plan.href} className={`block w-full text-center py-2 rounded font-medium ${plan.popular ? 'bg-purple-600 text-white hover:bg-purple-700' : 'border border-purple-600 text-purple-600 hover:bg-purple-50'}`}>
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
