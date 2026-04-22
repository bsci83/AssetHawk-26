'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { CreditCard } from 'lucide-react'

interface BillingInfo {
  plan: string
  status: string
  currentPeriodEnd: string
}

const plans = {
  starter: { name: 'Starter', price: 0 },
  professional: { name: 'Professional', price: 29 },
  enterprise: { name: 'Enterprise', price: 99 }
}

export default function OrgBillingPage() {
  const [billing, setBilling] = useState<BillingInfo | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('assethawk_user')
    if (stored) {
      const data = JSON.parse(stored)
      loadBilling(data.org?.id)
    }
  }, [])

  async function loadBilling(orgId: string) {
    if (!orgId) return
    try {
      const res = await fetch(`/api/billing?orgId=${orgId}`)
      const data = await res.json()
      setBilling(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link href="/organization" className="text-purple-600 hover:underline">← Organization</Link>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Billing</h1>

        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading...</div>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-500">Current Plan</p>
                  <p className="text-xl font-bold">{plans[billing?.plan as keyof typeof plans]?.name || 'Starter'}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-purple-600">
                    ${plans[billing?.plan as keyof typeof plans]?.price || 0}
                    <span className="text-sm text-gray-500">/mo</span>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-green-600">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                {billing?.status === 'active' ? 'Active' : 'Inactive'}
              </div>
              {billing?.currentPeriodEnd && (
                <p className="text-sm text-gray-500 mt-2">
                  {billing.plan === 'starter' ? 'Free forever' : `Renews ${new Date(billing.currentPeriodEnd).toLocaleDateString()}`}
                </p>
              )}
            </div>

            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-lg font-bold mb-4">Payment Method</h2>
              {billing?.plan === 'starter' ? (
                <p className="text-gray-500">No payment method on file (Free plan)</p>
              ) : (
                <div className="flex items-center gap-3">
                  <CreditCard className="h-8 w-8 text-gray-400" />
                  <div>
                    <p className="font-medium">**** **** **** 4242</p>
                    <p className="text-sm text-gray-500">Expires 12/27</p>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-bold mb-4">Billing History</h2>
              {billing?.plan === 'starter' ? (
                <p className="text-gray-500">No billing history (Free plan)</p>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-sm text-gray-500">
                      <th className="pb-2">Date</th>
                      <th className="pb-2">Amount</th>
                      <th className="pb-2">Status</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    <tr className="border-t">
                      <td className="py-2">Apr 1, 2026</td>
                      <td className="py-2">$29.00</td>
                      <td className="py-2"><span className="text-green-600">Paid</span></td>
                    </tr>
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  )
}
