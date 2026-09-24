"use client"

import Link from "next/link"

export default function CardsPage() {
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
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">Card <span className="crest-text-gradient">Products</span></h1>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">Choose the card that fits your lifestyle.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Crestline Platinum Card", type: "Credit Card", limit: "$25,000 limit", apr: "19.99% APR", rewards: "3x points on travel & dining", features: ["No annual fee", "0% intro APR 15 months", "Cell phone protection", "Travel insurance", "Contactless payments"], gradient: "from-[#D71E28] to-[#0ea5e9]" },
              { name: "Crestline Rewards Card", type: "Debit Card", limit: "Your balance", apr: "No interest", rewards: "1% cash back on all purchases", features: ["No fees", "Free ATM worldwide", "Real-time alerts", "Freeze/unfreeze", "Virtual card available"], gradient: "from-[#10b981] to-[#059669]" },
              { name: "Crestline Virtual Card", type: "Virtual Card", limit: "Customizable", apr: "N/A", rewards: "Perfect for online shopping", features: ["Instant creation", "Single-use option", "Spending limits", "Merchant locks", "Full control"], gradient: "from-[#8b5cf6] to-[#6d28d9]" },
            ].map((card, i) => (
              <div key={i} className="rounded-2xl overflow-hidden border border-gray-200 bg-gray-100/60">
                <div className={`h-32 bg-gradient-to-br ${card.gradient} p-6 flex flex-col justify-between`}>
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-medium text-gray-900/70">{card.type}</span>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="opacity-70"><rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" /></svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900/90">**** **** **** {(4501 + i).toString().padStart(4, '0')}</p>
                    <p className="text-xs text-gray-900/60 mt-1">Cardholder</p>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{card.name}</h3>
                  <div className="flex gap-3 mb-4">
                    <span className="text-xs text-[#D71E28]">{card.limit}</span>
                    <span className="text-xs text-gray-500">•</span>
                    <span className="text-xs text-gray-500">{card.apr}</span>
                  </div>
                  <p className="text-sm text-[#10b981] font-medium mb-4">{card.rewards}</p>
                  <ul className="space-y-2">
                    {card.features.map((f, j) => (
                      <li key={j} className="flex items-center gap-2 text-sm text-gray-500">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D71E28" strokeWidth="2"><path d="M20 6L9 17l-5-5" /></svg>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <button className="mt-6 w-full py-2.5 rounded-xl bg-[#D71E28]/10 text-[#D71E28] text-sm font-semibold hover:bg-[#D71E28]/20 transition-colors">
                    Apply Now
                  </button>
                </div>
              </div>
            ))}
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
