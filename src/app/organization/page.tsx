import Link from 'next/link'
import { Building, Users, CreditCard, Shield, Settings } from 'lucide-react'

export default function OrganizationPage() {
  const sections = [
    { name: 'Organization Audit', desc: 'View audit logs and security events', href: '/organization/audit', icon: Shield },
    { name: 'Billing', desc: 'Manage subscription and payments', href: '/organization/billing', icon: CreditCard },
    { name: 'Organization Settings', desc: 'Configure organization details', href: '/organization/settings', icon: Settings },
    { name: 'SSO / SAML', desc: 'Configure single sign-on', href: '/organization/sso', icon: Shield },
    { name: 'Users', desc: 'Manage team members', href: '/organization/users', icon: Users },
  ]

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
        <div className="flex items-center gap-3 mb-8">
          <Building className="h-8 w-8 text-purple-600" />
          <h1 className="text-3xl font-bold text-gray-900">Organization</h1>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map((s) => (
            <Link key={s.name} href={s.href} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
              <s.icon className="h-10 w-10 text-purple-600 mb-4" />
              <h3 className="text-lg font-bold mb-2">{s.name}</h3>
              <p className="text-gray-600 text-sm">{s.desc}</p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}
