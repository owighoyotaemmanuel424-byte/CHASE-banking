'use client'

import Link from 'next/link'
import { CustomerLayout } from '@/components/customer/customer-layout'
import { useBanking } from '@/hooks/use-banking'
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  ArrowLeftRight,
  Plus,
  CreditCard,
  PiggyBank,
  Receipt,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react'

export default function DashboardPage() {
  const {
    accounts,
    transactions,
    creditCards,
    formatCurrency,
    getTotalBalance,
    userProfile,
  } = useBanking()

  const totalBalance = getTotalBalance()
  const checkingAccount = accounts.find((a) => a.type === 'checking') || accounts[0]
  const savingsAccount = accounts.find((a) => a.type === 'savings')

  const recentTransactions = transactions.slice(0, 6)

  return (
    <CustomerLayout>
      <div className="space-y-6">
        {/* Welcome Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-[#D71E28] via-[#A31620] to-[#D71E28] border border-gray-200 rounded-2xl p-6 shadow-xl">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold text-[#D71E28] uppercase tracking-wider">Verified Customer</span>
              <ShieldCheck className="w-4 h-4 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back{userProfile?.name ? `, ${userProfile.name}` : ''}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Here is your financial overview and active ledger status.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/transfers"
              className="px-4 py-2.5 bg-[#D71E28] hover:bg-[#A31620] text-gray-900 font-semibold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              <ArrowLeftRight className="w-4 h-4" />
              <span>Send Funds</span>
            </Link>
          </div>
        </div>

        {/* Financial KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gray-100 border border-gray-200 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-500 uppercase">Total Liquidity</span>
              <Wallet className="w-4 h-4 text-[#D71E28]" />
            </div>
            <div className="text-2xl font-bold font-mono text-gray-900 mb-1">
              {formatCurrency(totalBalance)}
            </div>
            <span className="text-[11px] text-green-600 font-medium">Available across all accounts</span>
          </div>

          <div className="bg-gray-100 border border-gray-200 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-500 uppercase">Checking Pool</span>
              <span className="text-[10px] text-gray-400 font-mono">{checkingAccount?.accountNumber || '•••• 4821'}</span>
            </div>
            <div className="text-2xl font-bold font-mono text-gray-900 mb-1">
              {formatCurrency(checkingAccount?.balance || 0)}
            </div>
            <span className="text-[11px] text-gray-500">Primary operating account</span>
          </div>

          <div className="bg-gray-100 border border-gray-200 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-500 uppercase">High-Yield Savings</span>
              <PiggyBank className="w-4 h-4 text-green-600" />
            </div>
            <div className="text-2xl font-bold font-mono text-green-600 mb-1">
              {formatCurrency(savingsAccount?.balance || 0)}
            </div>
            <span className="text-[11px] text-gray-500">4.85% APY Compounding</span>
          </div>

          <div className="bg-gray-100 border border-gray-200 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-500 uppercase">Active Cards</span>
              <CreditCard className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="text-2xl font-bold font-mono text-gray-900 mb-1">
              {creditCards.length} Cards
            </div>
            <span className="text-[11px] text-gray-500">All networks operational</span>
          </div>
        </div>

        {/* Quick Action Matrix */}
        <div className="bg-gray-100 border border-gray-200 rounded-2xl p-6 shadow-lg">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Quick Financial Actions</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
            {[
              { label: 'Send Money', href: '/transfers', icon: ArrowUpRight, color: 'text-sky-400' },
              { label: 'Deposit', href: '/deposits', icon: ArrowDownLeft, color: 'text-green-600' },
              { label: 'Withdraw', href: '/withdrawals', icon: ArrowLeftRight, color: 'text-amber-600' },
              { label: 'Pay Bills', href: '/payments', icon: Receipt, color: 'text-violet-400' },
              { label: 'Manage Cards', href: '/cards', icon: CreditCard, color: 'text-pink-400' },
              { label: 'Savings Goals', href: '/savings', icon: PiggyBank, color: 'text-teal-400' },
              { label: 'Investments', href: '/investments', icon: TrendingUp, color: 'text-blue-400' },
            ].map((action) => {
              const Icon = action.icon
              return (
                <Link
                  key={action.label}
                  href={action.href}
                  className="flex flex-col items-center justify-center p-3 rounded-xl bg-white hover:bg-gray-200 border border-gray-200 transition-all hover:border-[#D71E28]/40 group"
                >
                  <div className={`p-2.5 rounded-lg bg-gray-100 mb-2 group-hover:scale-110 transition-transform ${action.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-medium text-gray-900 text-center">{action.label}</span>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Account Cards & Recent Transactions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Accounts Breakdown */}
          <div className="lg:col-span-1 bg-gray-100 border border-gray-200 rounded-2xl p-6 shadow-lg flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-gray-900">Your Accounts</h2>
                <Link href="/accounts" className="text-xs text-[#D71E28] hover:underline">
                  View All
                </Link>
              </div>

              <div className="space-y-3">
                {accounts.map((acc) => (
                  <div
                    key={acc.id}
                    className="p-3.5 rounded-xl bg-white border border-gray-200 flex items-center justify-between"
                  >
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">{acc.name}</h3>
                      <p className="text-xs text-gray-400 font-mono">{acc.accountNumber}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold font-mono text-gray-900 block">
                        {formatCurrency(acc.balance)}
                      </span>
                      <span className="text-[10px] text-green-600">Available</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <Link
                href="/accounts"
                className="w-full py-2.5 bg-white hover:bg-gray-200 text-gray-900 border border-gray-200 text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors"
              >
                <Plus className="w-3.5 h-3.5 text-[#D71E28]" />
                <span>Open New Account Product</span>
              </Link>
            </div>
          </div>

          {/* Recent Activity Table */}
          <div className="lg:col-span-2 bg-gray-100 border border-gray-200 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-gray-900">Recent Transactions</h2>
                <p className="text-xs text-gray-500">Real-time ledger audit trail</p>
              </div>
              <Link href="/transactions" className="text-xs text-[#D71E28] hover:underline">
                Full History
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-400 uppercase">
                    <th className="pb-3 font-semibold">Description</th>
                    <th className="pb-3 font-semibold">Category</th>
                    <th className="pb-3 font-semibold">Date</th>
                    <th className="pb-3 font-semibold text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {recentTransactions.map((tx) => {
                    const isPositive = tx.amount > 0
                    return (
                      <tr key={tx.id} className="hover:bg-white/40 transition-colors">
                        <td className="py-3 font-medium text-gray-900 flex items-center gap-2">
                          <div
                            className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                              isPositive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                            }`}
                          >
                            {isPositive ? <ArrowDownLeft className="w-3.5 h-3.5" /> : <ArrowUpRight className="w-3.5 h-3.5" />}
                          </div>
                          <span className="truncate max-w-[160px] sm:max-w-xs">{tx.description}</span>
                        </td>
                        <td className="py-3 text-gray-500">{tx.category || 'General'}</td>
                        <td className="py-3 text-gray-400">{tx.date}</td>
                        <td
                          className={`py-3 text-right font-mono font-bold ${
                            isPositive ? 'text-green-600' : 'text-gray-900'
                          }`}
                        >
                          {isPositive ? '+' : ''}
                          {formatCurrency(tx.amount)}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </CustomerLayout>
  )
}
