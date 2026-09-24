'use client'

import Link from 'next/link'
import { Building2, ShieldCheck, CreditCard, ArrowRight, CheckCircle2, Users, FileSpreadsheet } from 'lucide-react'

export default function BusinessPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D71E28] to-[#818cf8] flex items-center justify-center">
                <Building2 className="w-5 h-5 text-gray-900" />
              </div>
              <span className="font-bold text-lg text-gray-900">Crestline Capital</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                Home
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 bg-[#D71E28] hover:bg-[#A31620] text-gray-900 font-bold text-xs rounded-xl"
              >
                Open Business Account
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-32 pb-20 px-4 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-[#D71E28] mb-2 block">
            Commercial & Treasury Solutions
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
            Next-Generation Corporate Banking
          </h1>
          <p className="text-base text-gray-500 leading-relaxed">
            Manage startup operating cash, mid-market enterprise payroll, and corporate spend cards with granular controls and multi-user RBAC.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-gray-100 border border-gray-200 rounded-2xl p-7 shadow-xl">
            <div className="w-12 h-12 rounded-xl bg-[#D71E28]/10 text-[#D71E28] flex items-center justify-center mb-4">
              <Users className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-gray-900 mb-2">Team Permissions & Dual Sign-Off</h2>
            <p className="text-xs text-gray-500 leading-relaxed">
              Define custom roles: View-Only, Bookkeeper, Operator, Treasury Manager, and Executive Signer. High-value wire transfers require dual executive approvals.
            </p>
          </div>

          <div className="bg-gray-100 border border-gray-200 rounded-2xl p-7 shadow-xl">
            <div className="w-12 h-12 rounded-xl bg-green-100 text-green-600 flex items-center justify-center mb-4">
              <CreditCard className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-gray-900 mb-2">Unlimited Employee Spend Cards</h2>
            <p className="text-xs text-gray-500 leading-relaxed">
              Issue virtual and physical corporate charge cards with customizable daily, monthly, and merchant-category spending caps.
            </p>
          </div>

          <div className="bg-gray-100 border border-gray-200 rounded-2xl p-7 shadow-xl">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-4">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-gray-900 mb-2">Real-Time ERP & Ledger Sync</h2>
            <p className="text-xs text-gray-500 leading-relaxed">
              Sync automatically into QuickBooks, Xero, and NetSuite. Direct programmatic API access with full developer documentation.
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-[#D71E28] via-[#A31620] to-[#D71E28] border border-gray-200 rounded-3xl p-8 sm:p-12 text-center max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">Upgrade your company’s treasury</h2>
          <p className="text-sm text-gray-500 max-w-lg mx-auto mb-6">
            Accounts protected up to $5,000,000 via our FDIC Insured Sweep Network.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#D71E28] hover:bg-[#A31620] text-gray-900 font-bold text-sm rounded-xl"
          >
            <span>Apply for Business Banking</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
