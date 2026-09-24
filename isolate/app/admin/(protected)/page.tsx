'use client'

import React, { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import {
  Shield,
  LayoutDashboard,
  Users,
  Wallet,
  ArrowLeftRight,
  CreditCard,
  Sliders,
  DollarSign,
  Landmark,
  Crown,
  FileText,
  FileCheck,
  UserPlus,
  CheckSquare,
  Share2,
  FileSpreadsheet,
  TrendingUp,
  Coins,
  Radio,
  Server,
  UserCheck,
  GraduationCap,
  Inbox,
  LifeBuoy,
  MessageSquare,
  Megaphone,
  Mail,
  ShieldAlert,
  Star,
  Palette,
  Sun,
  FolderOpen,
  FileEdit,
  HelpCircle,
  ShieldCheck,
  Settings as SettingsIcon,
  Search,
  LogOut,
  ChevronDown,
  Menu,
  X,
  Lock,
  ExternalLink,
} from 'lucide-react'

import { adminStore } from '@/lib/admin/admin-store'
import OverviewModule from '@/components/admin/modules/overview-module'
import UsersModule from '@/components/admin/modules/users-module'
import KYCModule from '@/components/admin/modules/kyc-module'
import FinancialModules from '@/components/admin/modules/financial-modules'
import TradingModules from '@/components/admin/modules/trading-modules'
import EngagementModules from '@/components/admin/modules/engagement-modules'
import SystemModules from '@/components/admin/modules/system-modules'

// Sidebar Navigation Structure
interface NavCategory {
  title: string
  items: Array<{
    id: string // query param ?id=X
    name: string
    icon: React.ComponentType<{ className?: string }>
  }>
}

const NAV_CATEGORIES: NavCategory[] = [
  {
    title: 'OVERVIEW & PEOPLE',
    items: [
      { id: 'overview', name: 'Overview', icon: LayoutDashboard },
      { id: '2', name: 'Users', icon: Users },
      { id: '10', name: 'KYC', icon: FileCheck },
      { id: '11', name: 'Leads', icon: UserPlus },
      { id: '12', name: 'Tasks', icon: CheckSquare },
      { id: '13', name: 'Referrals', icon: Share2 },
      { id: '14', name: 'Import', icon: FileSpreadsheet },
    ],
  },
  {
    title: 'MONEY & FINANCIAL LEDGER',
    items: [
      { id: '0', name: 'Deposits', icon: Wallet },
      { id: '1', name: 'Withdrawals', icon: ArrowLeftRight },
      { id: '15', name: 'Transfers', icon: ArrowLeftRight },
      { id: '16', name: 'Payment Methods', icon: Landmark },
      { id: '17', name: 'Cards', icon: CreditCard },
      { id: '18', name: 'Card Setup', icon: Sliders },
      { id: '19', name: 'Currencies', icon: DollarSign },
      { id: '20', name: 'Loans', icon: Landmark },
      { id: '21', name: 'Grants', icon: Crown },
      { id: '22', name: 'IRS', icon: FileText },
      { id: '23', name: 'Membership', icon: Crown },
    ],
  },
  {
    title: 'TRADING & ENGAGEMENT',
    items: [
      { id: '24', name: 'Plans', icon: TrendingUp },
      { id: '25', name: 'Crypto', icon: Coins },
      { id: '26', name: 'Signals', icon: Radio },
      { id: '27', name: 'Providers', icon: Server },
      { id: '28', name: 'Copy Trading', icon: Users },
      { id: '29', name: 'Courses', icon: GraduationCap },
      { id: '30', name: 'Inbox', icon: Inbox },
      { id: '31', name: 'Tickets', icon: LifeBuoy },
      { id: '32', name: 'Live Chat', icon: MessageSquare },
      { id: '33', name: 'Broadcast', icon: Megaphone },
      { id: '34', name: 'Contact', icon: Mail },
      { id: '35', name: 'Agents', icon: ShieldAlert },
      { id: '36', name: 'Testimonials', icon: Star },
    ],
  },
  {
    title: 'SITE & SYSTEM CONFIGURATION',
    items: [
      { id: '37', name: 'Appearance', icon: Palette },
      { id: '38', name: 'Themes', icon: Sun },
      { id: '39', name: 'Assets', icon: FolderOpen },
      { id: '40', name: 'Content', icon: FileEdit },
      { id: '41', name: 'FAQ', icon: HelpCircle },
      { id: '42', name: 'Audit Log', icon: ShieldCheck },
      { id: '43', name: 'Settings', icon: SettingsIcon },
    ],
  },
]

function AdminConsoleContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const rawId = searchParams.get('id') || 'overview'

  const [activeModule, setActiveModule] = useState<string>(rawId)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [globalSearch, setGlobalSearch] = useState('')
  const [storeState, setStoreState] = useState({ ...adminStore })
  const [adminSession, setAdminSession] = useState<{
    name: string
    email: string
    role: string
  }>({
    name: 'Administrator',
    email: '',
    role: 'ADMIN',
  })

  // Sync active admin identity and verify session
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedName = sessionStorage.getItem('crestline_admin_name')
      const storedEmail = sessionStorage.getItem('crestline_admin_email')
      const storedRole = sessionStorage.getItem('crestline_admin_role')
      const storedSessionId = sessionStorage.getItem('crestline_admin_session_id')

      if (storedEmail) {
        setAdminSession({
          name: storedName || 'Administrator',
          email: storedEmail,
          role: storedRole || 'ADMIN',
        })
      } else {
        fetch('/api/admin/auth/session')
          .then((res) => res.json())
          .then((data) => {
            if (data.authenticated && data.session) {
              setAdminSession({
                name: data.session.name,
                email: data.session.email,
                role: data.session.role,
              })
              sessionStorage.setItem('crestline_admin_session_id', data.session.sessionId)
              sessionStorage.setItem('crestline_admin_role', data.session.role)
              sessionStorage.setItem('crestline_admin_email', data.session.email)
              sessionStorage.setItem('crestline_admin_name', data.session.name)
            }
          })
          .catch(() => {})
      }
    }
  }, [])

  // Keep search params in sync with activeModule
  useEffect(() => {
    if (rawId !== activeModule) {
      setActiveModule(rawId)
    }
  }, [rawId])

  const navigateToModule = (id: string) => {
    setActiveModule(id)
    setMobileMenuOpen(false)
    if (id === 'overview') {
      router.push('/admin')
    } else {
      router.push(`/admin?id=${id}`)
    }
  }

  // Force re-render after store updates
  const refreshStore = () => {
    setStoreState({ ...adminStore })
  }

  const handleToggleUserBlock = (userId: string) => {
    adminStore.toggleUserBlock(userId)
    refreshStore()
  }

  const handleAddUser = (user: any) => {
    adminStore.addUser(user)
    refreshStore()
  }

  const handleApproveKYC = (caseId: string) => {
    adminStore.approveKYC(caseId)
    refreshStore()
  }

  const handleRejectKYC = (caseId: string, reason: string) => {
    adminStore.rejectKYC(caseId, reason)
    refreshStore()
  }

  const handleApproveDeposit = (depositId: string) => {
    adminStore.approveDeposit(depositId)
    refreshStore()
  }

  const handleApproveWithdrawal = (withdrawalId: string) => {
    adminStore.approveWithdrawal(withdrawalId)
    refreshStore()
  }

  const handleIssueGrant = (title: string, recipient: string, amount: number, category: any) => {
    adminStore.issueGrant(title, recipient, amount, category)
    refreshStore()
  }

  const handleUpdateSettings = (newSettings: any) => {
    adminStore.siteSettings = newSettings
    refreshStore()
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth/logout', { method: 'POST' })
    } catch {}
    sessionStorage.removeItem('crestline_admin_session_id')
    router.push('/admin/login')
  }

  // Active module title & details lookup
  let currentNavTitle = 'Overview & Live Dashboard'
  for (const cat of NAV_CATEGORIES) {
    const found = cat.items.find((i) => i.id === activeModule)
    if (found) {
      currentNavTitle = found.name
      break
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col font-sans selection:bg-[#D71E28] selection:text-gray-900">
      {/* Top Universal Navbar */}
      <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-gray-500 hover:text-gray-900 rounded-xl hover:bg-gray-100"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link href="/admin" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#D71E28] to-[#818cf8] flex items-center justify-center shadow-[0_0_15px_rgba(215,30,40,0.3)]">
              <Shield className="w-4 h-4 text-gray-900" />
            </div>
            <div className="hidden sm:block">
              <span className="font-bold text-sm text-gray-900 tracking-tight block leading-none">
                Crestline Capital
              </span>
              <span className="text-[10px] text-[#D71E28] font-mono tracking-wider uppercase leading-none">
                Production Admin (v2.4)
              </span>
            </div>
          </Link>
        </div>

        {/* Global Search & Indicators */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 border border-gray-200 text-xs font-mono text-gray-500">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Sunday, August 30, 2026</span>
          </div>

          <div className="relative hidden sm:block w-48 lg:w-64">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              placeholder="Search module (or hotkey /)..."
              className="w-full pl-8 pr-3 py-1.5 bg-gray-100 border border-gray-200 rounded-xl text-xs text-gray-900 placeholder-[#64748b] focus:outline-none focus:border-[#D71E28]"
            />
          </div>

          <Link
            href="/dashboard"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-500 hover:text-gray-900 transition-colors"
          >
            <span>Customer Portal</span>
            <ExternalLink className="w-3 h-3" />
          </Link>

          {/* Authenticated Administrator Pill */}
          <div className="hidden xl:flex items-center gap-2.5 px-3 py-1 bg-gray-100 border border-gray-200 rounded-2xl">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#D71E28] to-[#818cf8] text-gray-900 font-bold text-[11px] flex items-center justify-center">
              {adminSession.name.charAt(0)}
            </div>
            <div className="text-left">
              <span className="text-xs font-semibold text-gray-900 block leading-tight">
                {adminSession.name}
              </span>
              <span className="text-[10px] text-[#D71E28] font-mono leading-none block">
                {adminSession.email}
              </span>
            </div>
            <span className="ml-1 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-[#D71E28]/10 text-[#D71E28] border border-[#D71E28]/20">
              {adminSession.role}
            </span>
          </div>

          <button
            onClick={handleLogout}
            id="btn-admin-header-logout"
            title="Lock & Terminate Admin Session"
            className="p-2 text-gray-500 hover:text-red-600 hover:bg-gray-100 rounded-xl transition-colors flex items-center gap-1 text-xs"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden lg:inline">Logout</span>
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar Drawer (Desktop & Mobile Drawer) */}
        <aside
          className={`fixed lg:static inset-y-16 left-0 z-30 w-72 bg-white border-r border-gray-200 flex flex-col justify-between overflow-y-auto transition-transform lg:translate-x-0 ${
            mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="p-4 space-y-6">
            {NAV_CATEGORIES.map((cat) => (
              <div key={cat.title} className="space-y-1">
                <span className="text-[10px] font-bold text-gray-400 tracking-wider uppercase px-3 block mb-2">
                  {cat.title}
                </span>
                <div className="space-y-0.5">
                  {cat.items.map((item) => {
                    const Icon = item.icon
                    const isActive = activeModule === item.id
                    return (
                      <button
                        key={item.id}
                        onClick={() => navigateToModule(item.id)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                          isActive
                            ? 'bg-[#D71E28]/10 text-[#D71E28] font-bold border border-[#D71E28]/20 shadow-sm'
                            : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className={`w-4 h-4 ${isActive ? 'text-[#D71E28]' : 'text-gray-400'}`} />
                          <span>{item.name}</span>
                        </div>
                        {item.id !== 'overview' && (
                          <span className="text-[9px] font-mono text-gray-400">?id={item.id}</span>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-gray-200 bg-gray-50/50 space-y-3 text-xs">
            {/* Admin User Card */}
            <div className="p-2.5 rounded-xl bg-[#111827] border border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="w-8 h-8 rounded-lg bg-[#D71E28]/10 border border-[#D71E28]/20 text-[#D71E28] font-bold flex items-center justify-center shrink-0">
                  {adminSession.name.charAt(0)}
                </div>
                <div className="overflow-hidden">
                  <span className="font-semibold text-gray-900 block text-xs truncate">
                    {adminSession.name}
                  </span>
                  <span className="text-[10px] text-gray-500 block truncate font-mono">
                    {adminSession.email}
                  </span>
                </div>
              </div>
              <button
                onClick={handleLogout}
                id="btn-admin-sidebar-logout"
                title="Log Out"
                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-gray-100 rounded-lg transition-colors shrink-0"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-2 text-green-600 font-mono text-[11px] pt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Ledger Balanced & Immutable</span>
            </div>
            <p className="text-[10px] text-gray-400">
              Double-Entry Core v2.4 • GAAP/IFRS Compliance Active
            </p>
          </div>
        </aside>

        {/* Overlay backdrop for mobile menu */}
        {mobileMenuOpen && (
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 z-20 bg-black/60 backdrop-blur-sm lg:hidden"
          />
        )}

        {/* Center Main Stage Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 bg-gray-50">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Active Module Header */}
            <div className="flex items-center justify-between border-b border-gray-200 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-[#D71E28]">
                    MODULE {activeModule.toUpperCase()}
                  </span>
                  <span className="text-gray-400">•</span>
                  <span className="text-xs text-gray-500 font-mono">
                    Sunday, August 30, 2026
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight mt-1">
                  {currentNavTitle}
                </h1>
              </div>

              <div className="hidden sm:flex items-center gap-2">
                <button
                  onClick={refreshStore}
                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-900 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Lock className="w-3.5 h-3.5 text-green-600" />
                  <span>Air-Gapped Sync</span>
                </button>
              </div>
            </div>

            {/* Dynamic Module Rendering */}
            {activeModule === 'overview' && (
              <OverviewModule
                users={storeState.users}
                totalDeposits={0}
                pendingDepositsCount={storeState.deposits.filter((d) => d.status === 'PENDING').length}
                totalTransfers={0}
                pendingTransfersCount={0}
                onNavigateModule={navigateToModule}
                onToggleUserBlock={handleToggleUserBlock}
              />
            )}

            {/* People Modules */}
            {['2', '11', '12', '13', '14'].includes(activeModule) && (
              <UsersModule
                users={storeState.users}
                leads={storeState.leads}
                tasks={storeState.tasks}
                referrals={storeState.referrals}
                activeSubModule={
                  activeModule === '2'
                    ? 'users'
                    : activeModule === '11'
                    ? 'leads'
                    : activeModule === '12'
                    ? 'tasks'
                    : activeModule === '13'
                    ? 'referrals'
                    : 'import'
                }
                onToggleUserBlock={handleToggleUserBlock}
                onAddUser={handleAddUser}
              />
            )}

            {/* KYC Module */}
            {activeModule === '10' && (
              <KYCModule
                cases={storeState.kycCases}
                onApprove={handleApproveKYC}
                onReject={handleRejectKYC}
              />
            )}

            {/* Money & Financial Ledger Modules */}
            {['0', '1', '15', '16', '17', '18', '19', '20', '21', '22', '23'].includes(activeModule) && (
              <FinancialModules
                activeModuleId={activeModule}
                deposits={storeState.deposits}
                withdrawals={storeState.withdrawals}
                transfers={storeState.transfers}
                cards={storeState.cards}
                loans={storeState.loans}
                grants={storeState.grants}
                currencies={storeState.currencies}
                onApproveDeposit={handleApproveDeposit}
                onApproveWithdrawal={handleApproveWithdrawal}
                onIssueGrant={handleIssueGrant}
              />
            )}

            {/* Trading Modules */}
            {['24', '25', '26', '27', '28', '29'].includes(activeModule) && (
              <TradingModules
                activeModuleId={activeModule}
                plans={storeState.plans}
                cryptoAssets={storeState.cryptoAssets}
                signals={storeState.signals}
              />
            )}

            {/* Engagement Modules */}
            {['30', '31', '32', '33', '34', '35', '36'].includes(activeModule) && (
              <EngagementModules
                activeModuleId={activeModule}
                tickets={storeState.tickets}
                agents={storeState.agents}
                testimonials={storeState.testimonials}
              />
            )}

            {/* Site & System Configuration Modules */}
            {['37', '38', '39', '40', '41', '42', '43'].includes(activeModule) && (
              <SystemModules
                activeModuleId={activeModule}
                siteSettings={storeState.siteSettings}
                onUpdateSettings={handleUpdateSettings}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

export default function AdminPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center text-[#D71E28] font-mono text-sm">
          Loading Crestline Capital Administration System...
        </div>
      }
    >
      <AdminConsoleContent />
    </Suspense>
  )
}
