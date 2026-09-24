"use client"

import Link from "next/link"

export default function SavingsInvestmentsPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <nav className="landing-nav-glass fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D71E28] to-[#818cf8] flex items-center justify-center"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18" /><path d="M7 16l4-8 4 4 4-6" /></svg></div>
              <span className="font-bold text-lg">Crestline Capital</span>
            </Link>
            <div className="flex items-center gap-3">
              <Link href="/" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Home</Link>
              <Link href="/login" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Sign in</Link>
              <Link href="/register" className="rounded-lg bg-[#D71E28] px-4 py-2 text-sm font-semibold text-gray-900 transition-all hover:bg-[#A31620] hover:shadow-[0_0_20px_rgba(215,30,40,0.3)]">Open account</Link>
            </div>
          </div>
        </div>
      </nav>

      <section className="pt-32 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">Savings & <span className="crest-text-gradient">Investments</span></h1>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">Grow your wealth with high-yield savings and smart investment options.</p>
          </div>

          {/* Savings */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-8">High-Yield Savings</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { name: "Standard Savings", apy: "3.50%", min: "$0", icon: "🏦" },
                { name: "Premium Savings", apy: "4.25%", min: "$10,000", icon: "💎" },
                { name: "CD (12-month)", apy: "4.75%", min: "$1,000", icon: "📀" },
              ].map((account, i) => (
                <div key={i} className="p-6 rounded-2xl bg-gray-100/60 border border-gray-200 text-center">
                  <div className="text-3xl mb-3">{account.icon}</div>
                  <h3 className="font-semibold text-gray-900 mb-2">{account.name}</h3>
                  <p className="text-3xl font-bold text-[#10b981] mb-1">{account.apy}</p>
                  <p className="text-xs text-gray-500">APY • Min: {account.min}</p>
                  <button className="mt-4 w-full py-2 rounded-lg bg-[#10b981]/10 text-[#10b981] text-sm font-semibold hover:bg-[#10b981]/20 transition-colors">Open Account</button>
                </div>
              ))}
            </div>
          </div>

          {/* Investments */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Investment Options</h2>
            <p className="text-gray-500 mb-8">Build long-term wealth with our curated investment solutions.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { name: "Index Funds", desc: "Diversified market exposure with low fees.", risk: "Medium", return: "~8-10%" },
                { name: "Bond Portfolio", desc: "Stable income with government and corporate bonds.", risk: "Low", return: "~4-6%" },
                { name: "Growth Fund", desc: "High-growth tech and innovation stocks.", risk: "High", return: "~12-15%" },
                { name: "Retirement (IRA)", desc: "Tax-advantaged retirement savings.", risk: "Varies", return: "Tax benefits" },
              ].map((fund, i) => (
                <div key={i} className="feature-card">
                  <h3 className="font-semibold text-gray-900 mb-2">{fund.name}</h3>
                  <p className="text-sm text-gray-500 mb-3">{fund.desc}</p>
                  <div className="flex justify-between text-xs">
                    <span className="text-[#f59e0b]">Risk: {fund.risk}</span>
                    <span className="text-[#10b981]">Return: {fund.return}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-3 italic">* Past performance does not guarantee future results</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-gray-200 py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center gap-2 mb-4 md:mb-0"><div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#D71E28] to-[#818cf8] flex items-center justify-center"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M3 3v18h18" /><path d="M7 16l4-8 4 4 4-6" /></svg></div><span className="font-semibold">Crestline Capital</span></div>
          <p className="text-xs text-gray-500">© 2026 Crestline Capital. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
