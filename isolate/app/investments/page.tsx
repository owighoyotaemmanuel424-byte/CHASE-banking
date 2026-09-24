'use client'

import { useState } from 'react'
import { CustomerLayout } from '@/components/customer/customer-layout'
import { useBanking } from '@/hooks/use-banking'
import { TrendingUp, AlertTriangle, PieChart, ArrowUpRight, ShieldAlert, DollarSign } from 'lucide-react'

export default function InvestmentsPage() {
  const { formatCurrency } = useBanking()

  const portfolioHoldings = [
    { symbol: 'VTI', name: 'Vanguard Total Stock Market ETF', allocation: '40%', value: 84200, returnPct: '+14.2%', shares: 320 },
    { symbol: 'QQQ', name: 'Invesco QQQ Trust Nasdaq 100', allocation: '30%', value: 63150, returnPct: '+22.8%', shares: 135 },
    { symbol: 'BND', name: 'Vanguard Total Bond Market ETF', allocation: '20%', value: 42100, returnPct: '+4.1%', shares: 580 },
    { symbol: 'GLD', name: 'SPDR Gold Shares', allocation: '10%', value: 21050, returnPct: '+11.5%', shares: 92 },
  ]

  const totalPortfolioValue = portfolioHoldings.reduce((sum, h) => sum + h.value, 0)

  return (
    <CustomerLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Investment Treasury & Wealth</h1>
          <p className="text-sm text-gray-500 mt-1">
            Automated index portfolio allocations, institutional rebalancing, and tax-loss harvesting.
          </p>
        </div>

        {/* Investment disclosure */}
        <div className="bg-amber-100 border border-amber-500/30 rounded-2xl p-4 text-xs text-amber-300 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block uppercase tracking-wider text-amber-600 mb-0.5">
              Investment Disclosure
            </span>
            <span>
              Investment products are not FDIC insured, are not bank guaranteed, and may lose value. Crestline Capital offers brokerage services through licensed partner firms. Past performance does not guarantee future results.
            </span>
          </div>
        </div>

        {/* Portfolio Summary Card */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-gray-100 border border-gray-200 rounded-2xl p-6 shadow-xl">
            <span className="text-xs font-medium text-gray-500 uppercase">Portfolio Value</span>
            <div className="text-3xl font-bold font-mono text-gray-900 mt-1">
              {formatCurrency(totalPortfolioValue)}
            </div>
            <span className="text-xs text-green-600 font-medium flex items-center gap-1 mt-1">
              <ArrowUpRight className="w-3.5 h-3.5" /> +16.4% All-Time Gain
            </span>
          </div>

          <div className="bg-gray-100 border border-gray-200 rounded-2xl p-6 shadow-xl">
            <span className="text-xs font-medium text-gray-500 uppercase">Unrealized P&L</span>
            <div className="text-3xl font-bold font-mono text-green-600 mt-1">
              +$29,840.00
            </div>
            <span className="text-xs text-gray-500 mt-1 block">Dividend reinvestment active</span>
          </div>

          <div className="bg-gray-100 border border-gray-200 rounded-2xl p-6 shadow-xl">
            <span className="text-xs font-medium text-gray-500 uppercase">Risk Profile</span>
            <div className="text-2xl font-bold text-[#D71E28] mt-1">
              Moderate Growth
            </div>
            <span className="text-xs text-gray-500 mt-1 block">Quarterly automated rebalancing</span>
          </div>
        </div>

        {/* Holdings Table */}
        <div className="bg-gray-100 border border-gray-200 rounded-2xl shadow-xl overflow-hidden p-6">
          <h2 className="text-base font-bold text-gray-900 mb-4">Core Portfolio Holdings</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-200 text-gray-400 uppercase">
                  <th className="pb-3 font-semibold">Asset / Symbol</th>
                  <th className="pb-3 font-semibold">Weight</th>
                  <th className="pb-3 font-semibold">Shares</th>
                  <th className="pb-3 font-semibold">Total Value</th>
                  <th className="pb-3 font-semibold text-right">Return</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {portfolioHoldings.map((h) => (
                  <tr key={h.symbol} className="hover:bg-white/30 transition-colors">
                    <td className="py-3.5 font-medium text-gray-900">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-[#D71E28] bg-[#D71E28]/10 px-2 py-0.5 rounded">
                          {h.symbol}
                        </span>
                        <span className="text-gray-500 truncate max-w-xs">{h.name}</span>
                      </div>
                    </td>
                    <td className="py-3.5 text-gray-900 font-mono">{h.allocation}</td>
                    <td className="py-3.5 text-gray-500 font-mono">{h.shares}</td>
                    <td className="py-3.5 font-mono font-bold text-gray-900">{formatCurrency(h.value)}</td>
                    <td className="py-3.5 text-right font-mono font-bold text-green-600">{h.returnPct}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </CustomerLayout>
  )
}
