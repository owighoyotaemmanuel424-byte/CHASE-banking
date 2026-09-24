'use client'

import React, { useState, useEffect, useId } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { fetchCustomerSession } from '@/lib/customer/client'
import {
  Shield,
  LayoutDashboard,
  Building2,
  Globe,
  Lock,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Layers,
  FileCheck,
  CreditCard,
  TrendingUp,
  Landmark,
  ArrowLeftRight,
  DollarSign,
  ChevronRight,
  ChevronDown,
  ShieldCheck,
  Activity,
  Zap,
  Clock,
  Eye,
  EyeOff,
  Sliders,
  Check,
  X,
  Menu,
  HelpCircle,
  ExternalLink,
  Wallet,
  Coins,
  Radio,
  FileText,
} from 'lucide-react'
import DashboardPage from '@/app/dashboard/page'

type ActiveTab = 'treasury' | 'wires' | 'card' | 'ledger'
type ViewMode = 'landing' | 'banking'

export default function LandingPage() {
  const router = useRouter()
  const [viewMode, setViewMode] = useState<ViewMode>('landing')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // '/' is a public marketing page that also hosts the signed-in portal. The
  // server session cookie decides which one an arrival sees, so no client-side
  // flag can open the banking view.
  useEffect(() => {
    let cancelled = false

    // Uses the session helper so the token fallback applies when the browser
    // withholds the cookie (cross-site iframe previews).
    void fetchCustomerSession().then((customer) => {
      if (cancelled) return
      setIsAuthenticated(Boolean(customer))
      if (customer) setViewMode('banking')
    })

    return () => {
      cancelled = true
    }
  }, [])

  // Every banking entry point goes through the real sign-in flow; the requested
  // destination is preserved so signing in lands back here.
  const handleEnterBanking = () => {
    setMobileMenuOpen(false)
    if (isAuthenticated) {
      setViewMode('banking')
      return
    }
    router.push('/login?returnTo=/')
  }

  // Yield Calculator State
  const [depositAmount, setDepositAmount] = useState<number>(100000)
  const [termYears, setTermYears] = useState<number>(1)

  // Interactive Product Simulator State
  const [activeTab, setActiveTab] = useState<ActiveTab>('treasury')
  const [cardFrozen, setCardFrozen] = useState<boolean>(false)
  const [showCvv, setShowCvv] = useState<boolean>(false)
  const [wireAmount, setWireAmount] = useState<string>('25000')

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  // Computed Yield Math (4.85% APY Crestline Capital vs 0.45% National Average)
  const crestlineRate = 0.0485
  const nationalAvgRate = 0.0045

  const crestlineReturn = Math.round(
    depositAmount * (Math.pow(1 + crestlineRate / 365, 365 * termYears) - 1)
  )
  const nationalReturn = Math.round(
    depositAmount * (Math.pow(1 + nationalAvgRate / 365, 365 * termYears) - 1)
  )
  const netAdvantage = crestlineReturn - nationalReturn

  const depositPresets = [25000, 50000, 100000, 250000, 500000, 1000000]

  const faqs = [
    {
      q: 'How does Crestline Capital provide a 4.85% APY return on liquid balances?',
      a: 'Through our automated liquidity sweep network, idle balances are swept nightly into diversified short-term U.S. Treasury bills and high-grade institutional reverse repurchase facilities through partner banks. You enjoy daily compounding interest while retaining 100% immediate liquidity for same-day wires and debit transactions.',
    },
    {
      q: 'Are deposits protected by FDIC insurance?',
      a: 'Yes. Funds deposited through Crestline Capital are eligible for pass-through FDIC insurance up to $250,000 for individual accounts and up to $2,500,000 for commercial multi-bank cash sweep accounts through our FDIC-insured partner bank network.',
    },
    {
      q: 'What are the fees for domestic and international wire transfers?',
      a: 'Crestline Capital does not charge incoming or outgoing wire fees for domestic Fedwire or standard SEPA transactions on verified accounts. High-volume commercial accounts also receive unlimited zero-fee international SWIFT settlements.',
    },
    {
      q: 'What is the double-entry accounting ledger and how does it protect my funds?',
      a: 'Unlike traditional black-box core banking software, Crestline Capital uses an immutable, mathematically balanced double-entry ledger. Every single credit to a customer liability account is balanced by an atomic debit to vault cash or clearing accounts. Every transaction is cryptographically signed and verifiable.',
    },
    {
      q: 'How quickly can I open an account and issue cards?',
      a: 'Digital onboarding takes under 4 minutes with automated biometric identity verification. Once approved, you can instantly generate virtual Visa Platinum debit cards with customizable spending limits and dynamic CVVs, and order an engraved metal card delivered via expedited courier.',
    },
  ]

  // If in interactive mode test:
  if (viewMode === 'banking') {
    return (
      <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col">
        <div className="bg-gray-100 border-b border-gray-200 px-4 py-2 flex items-center justify-between sticky top-0 z-50">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-green-600 bg-green-100 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
              Live Customer Portal Preview
            </span>
          </div>
          <button
            onClick={() => setViewMode('landing')}
            className="text-xs px-3 py-1.5 bg-[#D71E28] text-gray-900 font-bold rounded-lg hover:bg-[#A31620] transition-all flex items-center gap-1"
          >
            ← Return to Landing Page
          </button>
        </div>
        <DashboardPage />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col selection:bg-[#D71E28] selection:text-gray-900">
      {/* Top Universal Regulatory & Navigation Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200">
        {/* Subtle Regulatory Strip */}
        <div className="hidden sm:flex items-center justify-between px-6 py-1 bg-gray-50 border-b border-gray-200/60 text-[11px] text-gray-500">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 font-mono text-green-600">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              FEDWIRE & SWIFT RAILS ONLINE
            </span>
            <span className="text-gray-300">•</span>
            <span>MEMBER FDIC PASS-THROUGH INSURED UP TO $250,000</span>
          </div>
          <div className="flex items-center gap-4 text-[10px] font-mono">
            <span>HIGH-YIELD TREASURY SWEEPS: 4.85% APY</span>
            <span className="text-gray-300">•</span>
            <Link href="/security" className="text-gray-500 hover:text-[#D71E28] transition-colors flex items-center gap-1">
              <Shield className="w-3 h-3 text-green-600" />
              <span>Security Center</span>
            </Link>
          </div>
        </div>

        {/* Main Navbar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#D71E28] to-[#FFB500] flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <Shield className="w-5 h-5 text-gray-900" />
            </div>
            <div>
              <span className="font-bold text-base text-gray-900 tracking-tight block leading-none">
                Crestline Capital
              </span>
              <span className="text-[10px] text-[#D71E28] font-mono tracking-wider uppercase leading-none">
                Digital Banking
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-xs font-medium text-gray-500">
            <a href="#yield-calculator" className="hover:text-gray-900 transition-colors">
              Yield Calculator
            </a>
            <a href="#capabilities" className="hover:text-gray-900 transition-colors">
              Capabilities
            </a>
            <a href="#simulator" className="hover:text-gray-900 transition-colors">
              Platform Preview
            </a>
            <a href="#comparison" className="hover:text-gray-900 transition-colors">
              Institutional Comparison
            </a>
            <a href="#security" className="hover:text-gray-900 transition-colors">
              Security Architecture
            </a>
            <a href="#faq" className="hover:text-gray-900 transition-colors">
              FAQ
            </a>
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Quick Live Preview Switcher Pill */}
            <div className="flex items-center bg-gray-100 border border-gray-200 p-1 rounded-xl text-xs">
              <button
                onClick={handleEnterBanking}
                title="Preview Customer Banking Suite"
                className="px-2.5 py-1 rounded-lg text-gray-500 hover:text-gray-900 font-medium hover:bg-gray-200 flex items-center gap-1 transition-all"
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-green-600" />
                <span className="hidden md:inline">Customer Portal</span>
              </button>
            </div>

            <Link
              href="/login"
              className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded-xl transition-all"
            >
              Sign In
            </Link>

            <Link
              href="/register"
              className="px-4 py-2 text-xs font-bold text-gray-900 bg-[#D71E28] hover:bg-[#A31620] rounded-xl shadow-[0_0_15px_rgba(215,30,40,0.3)] transition-all flex items-center gap-1.5"
            >
              <span>Open Account</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-gray-500 hover:text-gray-900 rounded-xl hover:bg-gray-100"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-4 space-y-3 text-xs">
            <a
              href="#yield-calculator"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-gray-500 hover:text-gray-900"
            >
              Yield Calculator
            </a>
            <a
              href="#capabilities"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-gray-500 hover:text-gray-900"
            >
              Capabilities
            </a>
            <a
              href="#simulator"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-gray-500 hover:text-gray-900"
            >
              Platform Preview
            </a>
            <a
              href="#comparison"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-gray-500 hover:text-gray-900"
            >
              Comparison
            </a>
            <a
              href="#security"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-gray-500 hover:text-gray-900"
            >
              Security
            </a>
            <div className="pt-3 border-t border-gray-200 flex flex-col gap-2">
              <button
                onClick={handleEnterBanking}
                className="w-full py-2.5 bg-gray-100 text-green-600 font-semibold rounded-xl text-center"
              >
                Customer Portal
              </button>
              <Link
                href="/login"
                className="w-full py-2.5 bg-gray-200 text-gray-900 font-semibold rounded-xl text-center block"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="w-full py-2.5 bg-[#D71E28] text-gray-900 font-bold rounded-xl text-center block"
              >
                Open Free Account
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-gray-200">
        {/* Ambient Glow Elements */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#D71E28]/10 blur-[130px] rounded-full pointer-events-none"></div>
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[250px] bg-[#6366f1]/10 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Institutional Trust Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gray-100 border border-gray-200 text-xs font-semibold mb-6 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-gray-600">SOC2 Type II Certified</span>
            <span className="text-gray-300">•</span>
            <span className="text-[#D71E28] font-mono">4.85% APY Daily Compounding</span>
          </div>

          {/* Main Display Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-gray-900 mb-6 max-w-5xl mx-auto leading-[1.08]">
            Intelligent Banking for <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D71E28] via-[#818cf8] to-[#c084fc]">
              Modern Capital
            </span>
          </h1>

          {/* Lead Subtitle */}
          <p className="text-base sm:text-lg text-gray-500 max-w-3xl mx-auto mb-10 leading-relaxed">
            High-yield automated cash sweeps at 4.85% APY, instant multi-currency Fedwire and SWIFT rails, virtual and physical Visa Platinum cards, and an immutable double-entry ledger.
          </p>

          {/* Primary Hero CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
            <Link
              href="/register"
              className="px-7 py-4 bg-[#D71E28] hover:bg-[#A31620] text-gray-900 font-bold text-sm rounded-xl shadow-lg hover:shadow-[0_0_40px_rgba(215,30,40,0.5)] transition-all flex items-center gap-2"
            >
              <span>Open An Account in 3 Minutes</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <button
              onClick={handleEnterBanking}
              className="px-7 py-4 bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-200 font-semibold text-sm rounded-xl transition-all flex items-center gap-2"
            >
              <LayoutDashboard className="w-4 h-4 text-green-600" />
              <span>Explore Online Banking</span>
            </button>
          </div>

          {/* High-Impact Institutional Metrics Ribbon */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 max-w-5xl mx-auto">
            <div className="bg-gray-100/80 border border-gray-200 rounded-2xl p-4 text-center">
              <span className="text-2xl lg:text-3xl font-bold font-mono text-gray-900 block">
                $4.85B+
              </span>
              <span className="text-[11px] text-gray-500 tracking-tight">Settled Volume</span>
            </div>

            <div className="bg-gray-100/80 border border-gray-200 rounded-2xl p-4 text-center">
              <span className="text-2xl lg:text-3xl font-bold font-mono text-green-600 block">
                4.85%
              </span>
              <span className="text-[11px] text-gray-500 tracking-tight">High-Yield APY</span>
            </div>

            <div className="bg-gray-100/80 border border-gray-200 rounded-2xl p-4 text-center">
              <span className="text-2xl lg:text-3xl font-bold font-mono text-[#D71E28] block">
                $250K
              </span>
              <span className="text-[11px] text-gray-500 tracking-tight">FDIC Insured Pass-Through</span>
            </div>

            <div className="bg-gray-100/80 border border-gray-200 rounded-2xl p-4 text-center">
              <span className="text-2xl lg:text-3xl font-bold font-mono text-gray-900 block">
                99.999%
              </span>
              <span className="text-[11px] text-gray-500 tracking-tight">Ledger Uptime</span>
            </div>

            <div className="col-span-2 md:col-span-1 bg-gray-100/80 border border-gray-200 rounded-2xl p-4 text-center">
              <span className="text-2xl lg:text-3xl font-bold font-mono text-purple-600 block">
                &lt;15ms
              </span>
              <span className="text-[11px] text-gray-500 tracking-tight">Execution Latency</span>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Yield Calculator Section */}
      <section id="yield-calculator" className="py-20 bg-gray-50 border-b border-gray-200 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-mono font-bold text-green-600 uppercase tracking-widest block mb-2">
              Automated Treasury Optimization
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight mb-4">
              Calculate Your Real Cash Sweeps Return
            </h2>
            <p className="text-sm text-gray-500">
              Traditional mega-banks pay an average of 0.45% APY while lending your deposits at 7%+. Crestline Capital sweeps your idle funds into high-grade Treasury repos earning 4.85% APY with daily compounding.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-gray-50 border border-gray-200 rounded-3xl p-6 sm:p-10 shadow-2xl">
            {/* Left Controls */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Deposit Balance
                  </label>
                  <span className="text-xl sm:text-2xl font-bold font-mono text-gray-900">
                    ${depositAmount.toLocaleString()}
                  </span>
                </div>

                <input
                  type="range"
                  min="5000"
                  max="1000000"
                  step="5000"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#D71E28]"
                />

                {/* Preset Chips */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {depositPresets.map((amount) => (
                    <button
                      key={amount}
                      onClick={() => setDepositAmount(amount)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all ${
                        depositAmount === amount
                          ? 'bg-[#D71E28] text-gray-900 font-bold shadow-sm'
                          : 'bg-gray-100 text-gray-500 hover:text-gray-900 border border-gray-200'
                      }`}
                    >
                      ${amount >= 1000000 ? `${amount / 1000000}M` : `${amount / 1000}k`}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">
                  Time Horizon
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: '1 Year', years: 1 },
                    { label: '3 Years', years: 3 },
                    { label: '5 Years', years: 5 },
                  ].map((t) => (
                    <button
                      key={t.years}
                      onClick={() => setTermYears(t.years)}
                      className={`p-3 rounded-xl border text-center transition-all ${
                        termYears === t.years
                          ? 'bg-[#D71E28]/10 border-[#D71E28] text-[#D71E28] font-bold'
                          : 'bg-gray-100 border-gray-200 text-gray-500 hover:text-gray-900'
                      }`}
                    >
                      <span className="text-sm block">{t.label}</span>
                      <span className="text-[10px] text-gray-400">Daily compound</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-gray-100 rounded-2xl border border-gray-200 text-xs text-gray-500 flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                <span>
                  Funds remain 100% liquid. Zero withdrawal lockups or penalties. Interest posts daily at 00:00 UTC.
                </span>
              </div>
            </div>

            {/* Right Return Comparison Card */}
            <div className="lg:col-span-5 bg-gray-100 border border-gray-200 rounded-2xl p-6 space-y-5">
              <div className="border-b border-gray-200 pb-4">
                <span className="text-xs text-gray-500 block mb-1">
                  Estimated Total Earnings ({termYears} Year{termYears > 1 ? 's' : ''})
                </span>
                <div className="text-3xl sm:text-4xl font-black font-mono text-green-600">
                  +${crestlineReturn.toLocaleString()}
                </div>
                <div className="text-xs text-[#D71E28] font-mono mt-1">
                  Crestline Capital @ 4.85% APY
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between text-gray-500">
                  <span>National Average Bank (0.45% APY):</span>
                  <span className="font-mono text-gray-900">+${nationalReturn.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-gray-600 font-semibold pt-2 border-t border-gray-200">
                  <span>Your Additional Yield with Crestline Capital:</span>
                  <span className="font-mono text-green-600 font-bold">
                    +${netAdvantage.toLocaleString()}
                  </span>
                </div>
              </div>

              <Link
                href="/register"
                className="w-full py-3.5 bg-[#D71E28] hover:bg-[#A31620] text-gray-900 font-bold text-xs rounded-xl text-center block shadow-md transition-all"
              >
                Lock in 4.85% APY on Your Capital →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Platform Preview Simulator Section */}
      <section id="simulator" className="py-20 bg-white border-b border-gray-200 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-mono font-bold text-[#D71E28] uppercase tracking-widest block mb-2">
              The Crestline Capital Experience
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight mb-4">
              Engineered for Institutional Precision
            </h2>
            <p className="text-sm text-gray-500">
              Test-drive our core interfaces below. Every button is interactive.
            </p>
          </div>

          {/* Simulator Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
            {[
              { id: 'treasury', label: 'Treasury Dashboard', icon: LayoutDashboard },
              { id: 'wires', label: 'Global Wire Rails', icon: ArrowLeftRight },
              { id: 'card', label: 'Platinum Visa Card', icon: CreditCard },
              { id: 'ledger', label: 'Double-Entry Core', icon: Layers },
            ].map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as ActiveTab)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[#D71E28] text-gray-900 shadow-[0_0_15px_rgba(215,30,40,0.3)]'
                      : 'bg-gray-100 text-gray-500 hover:text-gray-900 border border-gray-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </div>

          {/* Interactive Screen Display */}
          <div className="bg-gray-50 border border-gray-200 rounded-3xl p-6 sm:p-8 max-w-5xl mx-auto shadow-2xl min-h-[440px]">
            {/* 1. Treasury Dashboard View */}
            {activeTab === 'treasury' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-200 pb-4">
                  <div>
                    <span className="text-xs text-gray-500">Treasury Portfolio Balance</span>
                    <div className="text-3xl font-extrabold font-mono text-gray-900 mt-1">
                      $1,428,950.42
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-green-100 text-green-600 border border-emerald-500/20 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                      4.85% APY Active
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-mono text-[#D71E28] bg-[#D71E28]/10 border border-[#D71E28]/20">
                      +$189.72 Yield Today
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-white rounded-2xl border border-gray-200">
                    <span className="text-xs text-gray-400 block">Operating Checking</span>
                    <span className="text-xl font-bold font-mono text-gray-900 block mt-1">
                      $245,000.00
                    </span>
                    <span className="text-[10px] text-green-600 mt-1 block">
                      Liquid for instant wire dispatch
                    </span>
                  </div>
                  <div className="p-4 bg-white rounded-2xl border border-gray-200">
                    <span className="text-xs text-gray-400 block">Overnight Treasury Repo Sweep</span>
                    <span className="text-xl font-bold font-mono text-green-600 block mt-1">
                      $1,183,950.42
                    </span>
                    <span className="text-[10px] text-gray-500 mt-1 block">
                      Compounding daily at 4.85%
                    </span>
                  </div>
                  <div className="p-4 bg-white rounded-2xl border border-gray-200">
                    <span className="text-xs text-gray-400 block">Total FDIC Coverage</span>
                    <span className="text-xl font-bold font-mono text-[#D71E28] block mt-1">
                      $2,500,000.00
                    </span>
                    <span className="text-[10px] text-gray-500 mt-1 block">
                      Multi-bank custodial sweep
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">
                    Recent Verified Ledger Activity
                  </span>
                  {[
                    { desc: 'Inbound Domestic Fedwire (Morgan Stanley Clearing)', amt: '+$250,000.00', status: 'SETTLED', time: '14:23 UTC' },
                    { desc: 'Daily Treasury Sweep Interest Credit (4.85% APY)', amt: '+$189.72', status: 'POSTED', time: '00:00 UTC' },
                    { desc: 'Crestline Platinum Visa — Amazon Web Services Direct', amt: '-$12,450.00', status: 'SETTLED', time: 'Yesterday' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-200 text-xs">
                      <div>
                        <span className="text-gray-900 font-medium block">{item.desc}</span>
                        <span className="text-[10px] text-gray-400 font-mono">{item.time}</span>
                      </div>
                      <div className="text-right">
                        <span className={`font-mono font-bold ${item.amt.startsWith('+') ? 'text-green-600' : 'text-gray-900'}`}>
                          {item.amt}
                        </span>
                        <span className="text-[10px] text-green-600 block">{item.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 2. Global Wire Rails */}
            {activeTab === 'wires' && (
              <div className="space-y-6">
                <div className="border-b border-gray-200 pb-3">
                  <h3 className="text-base font-bold text-gray-900">Institutional Wire Dispatcher</h3>
                  <p className="text-xs text-gray-500">Same-day domestic Fedwire and direct international SWIFT rail routing.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="text-gray-500 block mb-1">Transfer Amount (USD)</label>
                      <input
                        type="text"
                        value={wireAmount}
                        onChange={(e) => setWireAmount(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-gray-900 font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-gray-500 block mb-1">Routing Network</label>
                      <select className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-gray-900">
                        <option>Federal Reserve Fedwire (Instant Clearing - $0 Fee)</option>
                        <option>SWIFT International Wire (Sub-Minute Settlement)</option>
                        <option>SEPA Instant (Eurozone Interbank)</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-gray-500 block mb-1">Recipient Account / IBAN</label>
                      <input
                        type="text"
                        disabled
                        value="US03CREST89412389104812"
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-gray-400 font-mono cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-gray-200 space-y-4">
                    <span className="text-xs font-semibold text-[#D71E28] uppercase tracking-wider block">
                      Settlement Speed & Fee Transparency
                    </span>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Crestline Wire Fee:</span>
                        <span className="font-mono text-green-600 font-bold">$0.00 (Zero Fee)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Traditional Bank Fee:</span>
                        <span className="font-mono text-red-600 line-through">$45.00</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Settlement SLA:</span>
                        <span className="font-mono text-gray-900">Under 15 Minutes</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Fedline Confirmation:</span>
                        <span className="font-mono text-purple-600">IMAD/OMAD Cryptographic</span>
                      </div>
                    </div>

                    <button
                      onClick={() => alert(`Simulated wire dispatch for $${wireAmount} queued on Fedwire rails.`)}
                      className="w-full py-2.5 bg-[#D71E28] text-gray-900 font-bold text-xs rounded-xl hover:bg-[#A31620] transition-all"
                    >
                      Authorize Test Wire Dispatch
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 3. Platinum Visa Card */}
            {activeTab === 'card' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                {/* Visual Card */}
                <div className="relative aspect-[1.586] rounded-3xl p-6 bg-gradient-to-br from-gray-100 via-gray-50 to-white border border-gray-300 shadow-2xl flex flex-col justify-between overflow-hidden">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-[#D71E28]/10 rounded-full blur-3xl pointer-events-none"></div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Shield className="w-5 h-5 text-[#D71E28]" />
                      <span className="font-bold text-xs text-gray-900 uppercase tracking-wider">
                        Crestline Platinum
                      </span>
                    </div>
                    <span className="font-mono text-[10px] text-green-600 bg-green-100 px-2 py-0.5 rounded border border-emerald-500/20">
                      {cardFrozen ? 'LOCKED' : 'ACTIVE'}
                    </span>
                  </div>

                  <div className="my-auto space-y-2">
                    <span className="text-lg sm:text-xl font-mono text-gray-900 tracking-[0.25em] block">
                      4829 •••• •••• 9210
                    </span>
                    <div className="flex items-center gap-4 text-[10px] font-mono text-gray-500">
                      <span>EXP: 08/29</span>
                      <span>CVV: {showCvv ? '842' : '•••'}</span>
                      <button
                        onClick={() => setShowCvv(!showCvv)}
                        className="text-[#D71E28] underline"
                      >
                        {showCvv ? 'Hide' : 'Reveal Dynamic CVV'}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-900 tracking-widest">
                      MARCUS VANCE
                    </span>
                    <span className="text-sm font-bold italic tracking-wider text-gray-900">VISA</span>
                  </div>
                </div>

                {/* Card Controls */}
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 mb-1">Granular Card Controls</h4>
                    <p className="text-xs text-gray-500">
                      Manage physical and virtual corporate debit cards with instant zero-liability locking.
                    </p>
                  </div>

                  <div className="space-y-2 text-xs">
                    <button
                      onClick={() => setCardFrozen(!cardFrozen)}
                      className={`w-full p-3 rounded-xl border flex items-center justify-between transition-all ${
                        cardFrozen
                          ? 'bg-red-100 border-red-500/30 text-red-600'
                          : 'bg-white border-gray-200 text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Lock className="w-4 h-4" />
                        <span>{cardFrozen ? 'Card Frozen (Click to Unlock)' : 'Instant Card Freeze'}</span>
                      </div>
                      <span className="font-mono text-[10px]">{cardFrozen ? 'OFF' : 'ARMED'}</span>
                    </button>

                    <div className="p-3 bg-white rounded-xl border border-gray-200 space-y-1">
                      <div className="flex justify-between text-gray-500">
                        <span>Daily Spending Limit:</span>
                        <span className="text-gray-900 font-mono font-bold">$25,000 / day</span>
                      </div>
                      <div className="text-[10px] text-gray-400">
                        Configurable per cardholder with auto-blocking on foreign suspicious merchants.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 4. Double-Entry Ledger Core */}
            {activeTab === 'ledger' && (
              <div className="space-y-4">
                <div className="border-b border-gray-200 pb-3 flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-gray-900">Double-Entry General Ledger</h3>
                    <p className="text-xs text-gray-500">
                      Mathematical balance verified in real-time. Debits must equal credits.
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-green-100 text-green-600 border border-emerald-500/20">
                    GAAP Balanced: $0.00 Imbalance
                  </span>
                </div>

                <div className="bg-white rounded-2xl border border-gray-200 p-4 font-mono text-xs overflow-x-auto space-y-3">
                  <div className="text-gray-400 text-[11px] flex justify-between border-b border-gray-200 pb-2">
                    <span>ACCOUNT CLASSIFICATION</span>
                    <span>DEBIT</span>
                    <span>CREDIT</span>
                  </div>

                  <div className="flex justify-between text-gray-900">
                    <span className="text-[#D71E28]">1010 • Federal Reserve Vault Cash (Asset)</span>
                    <span className="text-green-600 font-bold">$50,000.00</span>
                    <span className="text-gray-400">—</span>
                  </div>

                  <div className="flex justify-between text-gray-900">
                    <span className="text-purple-600">2010 • Customer Deposit Liability (Liability)</span>
                    <span className="text-gray-400">—</span>
                    <span className="text-green-600 font-bold">$50,000.00</span>
                  </div>

                  <div className="pt-2 border-t border-gray-200 flex justify-between font-bold text-gray-900">
                    <span>TOTAL ATOMIC SETTLEMENT</span>
                    <span className="text-green-600">$50,000.00</span>
                    <span className="text-green-600">$50,000.00</span>
                  </div>
                </div>

                <div className="text-[11px] text-gray-400 font-mono flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                  <span>SHA-256 Ledger Block Hash: e8f90123456789abcd4a8f9b2c3d4e5f60718293a4</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Core Capabilities Section */}
      <section id="capabilities" className="py-20 bg-gray-50 border-b border-gray-200 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-mono font-bold text-green-600 uppercase tracking-widest block mb-2">
              Full-Stack Financial Architecture
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight mb-4">
              Pillars of Institutional Banking
            </h2>
            <p className="text-sm text-gray-500">
              Engineered from first principles with double-entry ledgers, air-gapped security, and real-time clearing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Pillar 1 */}
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 hover:border-[#D71E28]/40 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-green-100 text-green-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-2">
                4.85% APY High-Yield Cash Sweeps
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Idle balances sweep into short-term U.S. Treasury bills and reverse repurchase facilities. Compounded daily with zero lockup periods or minimum balance penalties.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 hover:border-[#D71E28]/40 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-[#D71E28]/10 text-[#D71E28] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <ArrowLeftRight className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-2">
                Instant Global Wire Settlement
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Direct integration with the Federal Reserve Fedwire service, SWIFT, and SEPA. Dispatches execute with sub-15-minute confirmation and zero hidden markups.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 hover:border-[#D71E28]/40 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <CreditCard className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-2">
                Crestline Platinum Visa Cards
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Issue unlimited virtual cards for subscriptions and physical engraved metal cards for executives. Dynamic CVVs, 0% foreign transaction fees, and instant freeze.
              </p>
            </div>

            {/* Pillar 4 */}
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 hover:border-[#D71E28]/40 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-2">
                GAAP Double-Entry Ledger Core
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Every financial transaction posts balanced debit and credit journal entries to chart accounts. Zero mathematical discrepancies, fully auditable by third-party CPAs.
              </p>
            </div>

            {/* Pillar 5 */}
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 hover:border-[#D71E28]/40 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Landmark className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-2">
                Bespoke Credit & Treasury Facilities
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Access liquidity against diversified portfolios and corporate receivables. Flexible revolving lines with competitive prime-linked interest structures.
              </p>
            </div>

            {/* Pillar 6 */}
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 hover:border-[#D71E28]/40 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-red-100 text-red-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-2">
                Air-Gapped Institutional Security
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Hardware MFA token integration, 192-bit cryptographic master gatekeeper keys, behavioral fraud heuristics, and automated FinCEN sanctions screening.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Institutional Comparison Table Section */}
      <section id="comparison" className="py-20 bg-white border-b border-gray-200 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-mono font-bold text-[#D71E28] uppercase tracking-widest block mb-2">
              Market Benchmarking
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight mb-4">
              How Crestline Capital Compares
            </h2>
            <p className="text-sm text-gray-500">
              See why private clients, high-growth startups, and corporate treasurers choose Crestline Capital over legacy institutions.
            </p>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-3xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50/60 text-gray-400 uppercase font-semibold">
                    <th className="py-4 px-6 text-gray-900 font-bold">Feature / Standard</th>
                    <th className="py-4 px-6 text-[#D71E28] font-bold bg-[#D71E28]/5">
                      Crestline Capital
                    </th>
                    <th className="py-4 px-6">Traditional Mega-Banks</th>
                    <th className="py-4 px-6">Standard Retail Neobanks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 font-medium">
                  <tr>
                    <td className="py-4 px-6 text-gray-900 font-semibold">
                      Liquid Cash Yield (APY)
                    </td>
                    <td className="py-4 px-6 text-green-600 font-mono font-bold bg-[#D71E28]/5">
                      4.85% APY (Daily Sweeps)
                    </td>
                    <td className="py-4 px-6 text-gray-500 font-mono">0.01% - 0.45%</td>
                    <td className="py-4 px-6 text-gray-500 font-mono">1.25% - 2.50%</td>
                  </tr>

                  <tr>
                    <td className="py-4 px-6 text-gray-900 font-semibold">
                      Domestic & Global Wire Fees
                    </td>
                    <td className="py-4 px-6 text-green-600 font-mono font-bold bg-[#D71E28]/5">
                      $0.00 Zero Wire Fees
                    </td>
                    <td className="py-4 px-6 text-red-600 font-mono">$35 - $50 / wire</td>
                    <td className="py-4 px-6 text-gray-500 font-mono">$10 - $25 / wire</td>
                  </tr>

                  <tr>
                    <td className="py-4 px-6 text-gray-900 font-semibold">
                      Double-Entry Accounting Verification
                    </td>
                    <td className="py-4 px-6 text-green-600 bg-[#D71E28]/5 flex items-center gap-1.5 font-bold">
                      <Check className="w-4 h-4 text-green-600" />
                      <span>Cryptographic Real-Time</span>
                    </td>
                    <td className="py-4 px-6 text-gray-400">Monthly Batch Closes Only</td>
                    <td className="py-4 px-6 text-gray-400">Black-box Third Party Core</td>
                  </tr>

                  <tr>
                    <td className="py-4 px-6 text-gray-900 font-semibold">
                      Account Opening Velocity
                    </td>
                    <td className="py-4 px-6 text-gray-900 font-mono font-bold bg-[#D71E28]/5">
                      Under 4 Minutes (Digital)
                    </td>
                    <td className="py-4 px-6 text-gray-500">3 - 7 Business Days (Branch)</td>
                    <td className="py-4 px-6 text-gray-500">1 - 2 Business Days</td>
                  </tr>

                  <tr>
                    <td className="py-4 px-6 text-gray-900 font-semibold">
                      FDIC Pass-Through Protection
                    </td>
                    <td className="py-4 px-6 text-gray-900 font-mono font-bold bg-[#D71E28]/5">
                      Up to $2.5M (Multi-bank Sweep)
                    </td>
                    <td className="py-4 px-6 text-gray-500 font-mono">$250,000 Standard</td>
                    <td className="py-4 px-6 text-gray-500 font-mono">$250,000 Standard</td>
                  </tr>

                  <tr>
                    <td className="py-4 px-6 text-gray-900 font-semibold">
                      Multi-Signature Air-Gapped Vault Security
                    </td>
                    <td className="py-4 px-6 text-green-600 bg-[#D71E28]/5 flex items-center gap-1.5 font-bold">
                      <Check className="w-4 h-4 text-green-600" />
                      <span>192-bit Hardware Security Module Protection</span>
                    </td>
                    <td className="py-4 px-6 text-gray-400">Legacy Passwords & VPNs</td>
                    <td className="py-4 px-6 text-gray-400">Standard Cloud SSO</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Security & Regulatory Accreditations Section */}
      <section id="security" className="py-20 bg-gray-50 border-b border-gray-200 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-mono font-bold text-green-600 uppercase tracking-widest block mb-2">
              Zero-Trust Architecture
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight mb-4">
              Security Built for Sovereign Capital
            </h2>
            <p className="text-sm text-gray-500">
              We treat security as a mathematical proof, not a checklist.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 bg-gray-50 border border-gray-200 rounded-2xl space-y-3">
              <Shield className="w-8 h-8 text-green-600" />
              <h4 className="font-bold text-sm text-gray-900">FDIC Pass-Through</h4>
              <p className="text-xs text-gray-500">
                Protected up to $250,000 individually and up to $2.5M for corporate treasury sweep accounts via our partner banking network.
              </p>
            </div>

            <div className="p-6 bg-gray-50 border border-gray-200 rounded-2xl space-y-3">
              <Lock className="w-8 h-8 text-[#D71E28]" />
              <h4 className="font-bold text-sm text-gray-900">256-Bit Cryptography</h4>
              <p className="text-xs text-gray-500">
                Military-grade AES-256 encryption for data at rest, TLS 1.3 for data in flight, and hardware security modules (HSM) for keys.
              </p>
            </div>

            <div className="p-6 bg-gray-50 border border-gray-200 rounded-2xl space-y-3">
              <Activity className="w-8 h-8 text-purple-600" />
              <h4 className="font-bold text-sm text-gray-900">SOC 2 Type II Certified</h4>
              <p className="text-xs text-gray-500">
                Independently audited controls verifying availability, confidentiality, and financial system integrity with zero exceptions.
              </p>
            </div>

            <div className="p-6 bg-gray-50 border border-gray-200 rounded-2xl space-y-3">
              <ShieldCheck className="w-8 h-8 text-amber-600" />
              <h4 className="font-bold text-sm text-gray-900">BSA/AML Screening</h4>
              <p className="text-xs text-gray-500">
                Continuous real-time sanctions and fraud heuristic monitoring across OFAC, FinCEN, and international compliance databases.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions (Accordion) */}
      <section id="faq" className="py-20 bg-white border-b border-gray-200 scroll-mt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-xs font-mono font-bold text-[#D71E28] uppercase tracking-widest block mb-2">
              Institutional Transparency
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-gray-500">
              Direct answers regarding yield generation, insurance, and wire clearing.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index
              return (
                <div
                  key={index}
                  className="bg-gray-50 border border-gray-200 rounded-2xl overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-gray-100/50"
                  >
                    <span className="text-sm font-bold text-gray-900">{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#D71E28] transition-transform duration-200 shrink-0 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs text-gray-500 leading-relaxed border-t border-gray-200/50 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* High-Conversion Pre-Footer Call to Action */}
      <section className="py-20 bg-gradient-to-b from-[#070a11] via-[#0c1322] to-[#070a11] border-b border-gray-200 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#D71E28] to-[#818cf8] flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(215,30,40,0.4)]">
            <Shield className="w-6 h-6 text-gray-900" />
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-gray-900 tracking-tight">
            Ready to Modernize Your Capital?
          </h2>

          <p className="text-sm sm:text-base text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Open a digital account in under 4 minutes. Enjoy 4.85% APY cash sweeps, zero-fee global wires, and verified double-entry ledgers today.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/register"
              className="px-8 py-4 bg-[#D71E28] hover:bg-[#A31620] text-gray-900 font-bold text-sm rounded-xl shadow-[0_0_25px_rgba(215,30,40,0.35)] transition-all flex items-center gap-2"
            >
              <span>Get Started Immediately</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <button
              onClick={handleEnterBanking}
              className="px-8 py-4 bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-200 font-semibold text-sm rounded-xl transition-all"
            >
              Launch Customer Banking Portal
            </button>
          </div>
        </div>
      </section>

      {/* Comprehensive Institutional Regulatory Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 pt-16 pb-12 text-xs text-gray-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Top Footer Navigation Columns */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            {/* Brand Column */}
            <div className="col-span-2 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#D71E28] to-[#818cf8] flex items-center justify-center">
                  <Shield className="w-4 h-4 text-gray-900" />
                </div>
                <span className="font-bold text-sm text-gray-900 tracking-tight">
                  Crestline Capital
                </span>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed max-w-sm">
                Next-generation financial technology platform providing automated high-yield Treasury cash sweeps, multi-currency wire rails, and mathematical double-entry accounting.
              </p>
              <div className="text-[11px] font-mono text-[#D71E28] space-y-1">
                <div>HQ: 55 Wall Street, New York, NY 10005</div>
                <div>Regulatory Desk: institutional@crestlinecapital.com</div>
              </div>
            </div>

            {/* Products Column */}
            <div className="space-y-3">
              <span className="font-bold text-gray-900 uppercase text-[10px] tracking-wider block">
                Products & Rails
              </span>
              <ul className="space-y-2 text-gray-500">
                <li><Link href="/accounts" className="hover:text-gray-900">Commercial Checking</Link></li>
                <li><Link href="/savings" className="hover:text-gray-900">4.85% APY Treasury Sweeps</Link></li>
                <li><Link href="/cards" className="hover:text-gray-900">Platinum Visa Cards</Link></li>
                <li><Link href="/transfers" className="hover:text-gray-900">Fedwire & SWIFT Settlement</Link></li>
                <li><Link href="/loans" className="hover:text-gray-900">Credit & Margin Lines</Link></li>
              </ul>
            </div>

            {/* Resources Column */}
            <div className="space-y-3">
              <span className="font-bold text-gray-900 uppercase text-[10px] tracking-wider block">
                Resources
              </span>
              <ul className="space-y-2 text-gray-500">
                <li><Link href="/security" className="hover:text-gray-900">Security Architecture</Link></li>
                <li><Link href="/faq" className="hover:text-gray-900">Knowledge Base</Link></li>
                <li><Link href="/pricing" className="hover:text-gray-900">Fee Transparency</Link></li>
                <li><Link href="/contact" className="hover:text-gray-900">Support & Inquiries</Link></li>
                <li><Link href="/about" className="hover:text-gray-900">About Crestline Capital</Link></li>
              </ul>
            </div>

            {/* Legal Column */}
            <div className="space-y-3">
              <span className="font-bold text-gray-900 uppercase text-[10px] tracking-wider block">
                Regulatory & Legal
              </span>
              <ul className="space-y-2 text-gray-500">
                <li><Link href="/terms" className="hover:text-gray-900">Terms of Service</Link></li>
                <li><Link href="/privacy" className="hover:text-gray-900">Privacy Policy</Link></li>
                <li><Link href="/legal" className="hover:text-gray-900">FDIC Insurance Disclosures</Link></li>
                <li><Link href="/contact" className="hover:text-gray-900">BSA / AML Statements</Link></li>
              </ul>
            </div>
          </div>

          {/* Mandatory Institutional Disclosures */}
          <div className="border-t border-gray-200 pt-8 space-y-4 text-[11px] text-gray-400 leading-relaxed">
            <p>
              Crestline Capital is a financial technology company and not an FDIC-insured bank. Banking services provided by our FDIC-insured partner banks, Members FDIC. The Crestline Platinum Visa Debit Card is issued by our partner bank pursuant to a license from Visa U.S.A. Inc. and may be used everywhere Visa debit cards are accepted.
            </p>
            <p>
              Investment and Treasury sweep products: Are Not FDIC Insured • Have No Bank Guarantee • May Lose Value. Yield rates (including 4.85% APY) reflect annual percentage yield on cash balances swept into short-term U.S. government obligations and are variable and subject to Federal Open Market Committee (FOMC) rate adjustments.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-200/60 text-gray-500">
              <div>© 2026 Crestline Capital Financial Technologies Inc. All rights reserved. Equal Housing Lender.</div>
              <div className="flex items-center gap-4 text-xs font-mono">
                <span className="text-green-600">● 100% Core Service Uptime</span>
                <span>TLS 1.3 / AES-256</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
