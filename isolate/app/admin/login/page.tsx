'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Shield,
  KeyRound,
  Lock,
  Mail,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  Cpu,
  RefreshCw,
  Eye,
  EyeOff,
  Sparkles,
  Terminal,
} from 'lucide-react'

export default function AdminLoginPage() {
  const router = useRouter()
  const [authMode, setAuthMode] = useState<'credentials' | 'master_key'>('credentials')

  // Email & Password credentials state — never pre-fill credentials
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)

  // Master key state (fallback)
  const [masterKey, setMasterKey] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successInfo, setSuccessInfo] = useState<string | null>(null)
  const [remainingAttempts, setRemainingAttempts] = useState<number | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccessInfo(null)
    setLoading(true)

    try {
      const payload =
        authMode === 'credentials'
          ? { email: email.trim(), password }
          : { masterKey: masterKey.trim().toLowerCase() }

      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        setError(data.error || 'Administrative authentication failed.')
        if (data.remainingAttempts !== undefined) {
          setRemainingAttempts(data.remainingAttempts)
        }
        setLoading(false)
        return
      }

      // Successful authentication
      setSuccessInfo(`Access Authorized: Welcome, ${data.session.name} (${data.session.role})`)

      // Store session attributes in client session storage
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('crestline_admin_session_id', data.session.sessionId)
        sessionStorage.setItem('crestline_admin_role', data.session.role)
        sessionStorage.setItem('crestline_admin_email', data.session.email)
        sessionStorage.setItem('crestline_admin_name', data.session.name)
      }

      setTimeout(() => {
        router.push('/admin')
      }, 600)
    } catch (err: any) {
      setError(err.message || 'Network communication error during authentication.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col justify-between p-4 sm:p-8 font-sans selection:bg-[#D71E28] selection:text-gray-900">
      {/* Top Header */}
      <header className="flex items-center justify-between max-w-5xl mx-auto w-full py-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#D71E28] to-[#818cf8] flex items-center justify-center shadow-[0_0_20px_rgba(215,30,40,0.3)]">
            <Shield className="w-5 h-5 text-gray-900" />
          </div>
          <div>
            <span className="font-bold text-base text-gray-900 tracking-tight block">Crestline Capital</span>
            <span className="text-[10px] text-[#D71E28] font-mono tracking-wider uppercase">
              Administrative Gatekeeper
            </span>
          </div>
        </Link>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-xs font-mono text-gray-500">Air-Gapped Core Online</span>
        </div>
      </header>

      {/* Main Admin Gatekeeper Card */}
      <main className="max-w-xl mx-auto w-full my-auto py-8">
        <div className="bg-[#111827]/90 border border-gray-200 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl relative overflow-hidden">
          {/* Subtle Ambient Glow */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#D71E28]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-[#818cf8]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            {/* Header Status Badge */}
            <div className="flex items-center justify-between mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D71E28]/10 border border-[#D71E28]/20 text-[#D71E28] text-xs font-mono">
                <Shield className="w-3.5 h-3.5" />
                <span>SUPER ADMIN ACCESS PORTAL</span>
              </div>
              <span className="text-[11px] font-mono text-gray-400">v2.4 Production</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight mb-2">
              System Administration Access
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mb-6 leading-relaxed">
              Authenticate with authorized administrative credentials to manage institutional ledger reserves, treasury sweeps, and member compliance.
            </p>

            {/* Auth Mode Toggle Tabs */}
            <div className="grid grid-cols-2 p-1 bg-gray-50 border border-gray-200 rounded-2xl mb-6 text-xs font-medium">
              <button
                type="button"
                id="btn-tab-credentials"
                onClick={() => {
                  setAuthMode('credentials')
                  setError(null)
                }}
                className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 ${
                  authMode === 'credentials'
                    ? 'bg-gray-100 text-gray-900 font-semibold shadow-sm border border-gray-200'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                <Mail className="w-3.5 h-3.5 text-[#D71E28]" />
                <span>Email & Password</span>
              </button>
              <button
                type="button"
                id="btn-tab-masterkey"
                onClick={() => {
                  setAuthMode('master_key')
                  setError(null)
                }}
                className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 ${
                  authMode === 'master_key'
                    ? 'bg-gray-100 text-gray-900 font-semibold shadow-sm border border-gray-200'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                <KeyRound className="w-3.5 h-3.5 text-purple-600" />
                <span>Master Hex Key</span>
              </button>
            </div>

            {/* Error Message Alert */}
            {error && (
              <div
                id="admin-login-error"
                className="mb-6 p-4 bg-red-100 border border-red-500/30 rounded-2xl flex items-start gap-3 text-xs text-red-300"
              >
                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-red-200">{error}</p>
                  {remainingAttempts !== null && (
                    <p className="mt-1 text-[11px] text-red-600">
                      Remaining attempts before security lockout:{' '}
                      <span className="font-bold font-mono">{remainingAttempts}</span>
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Success Message Alert */}
            {successInfo && (
              <div
                id="admin-login-success"
                className="mb-6 p-4 bg-green-100 border border-emerald-500/30 rounded-2xl flex items-center gap-3 text-xs text-emerald-300"
              >
                <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                <div>
                  <p className="font-semibold text-emerald-200">{successInfo}</p>
                  <p className="text-[11px] text-green-600/80">
                    Redirecting to institutional risk console...
                  </p>
                </div>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              {authMode === 'credentials' ? (
                <>
                  {/* Admin Email Input */}
                  <div>
                    <label
                      htmlFor="admin-email-input"
                      className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2"
                    >
                      Admin Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        id="admin-email-input"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="admin@yourdomain.com"
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 font-mono text-xs sm:text-sm focus:outline-none focus:border-[#D71E28] focus:ring-1 focus:ring-[#D71E28] transition-all"
                      />
                    </div>
                  </div>

                  {/* Admin Password Input */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label
                        htmlFor="admin-password-input"
                        className="block text-xs font-semibold uppercase tracking-wider text-gray-500"
                      >
                        Admin Password
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setAuthMode('master_key')
                          setError(null)
                        }}
                        className="text-[11px] text-[#D71E28] hover:underline flex items-center gap-1 font-mono"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>Use master key instead</span>
                      </button>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        id="admin-password-input"
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 font-mono text-xs sm:text-sm focus:outline-none focus:border-[#D71E28] focus:ring-1 focus:ring-[#D71E28] transition-all tracking-wider"
                      />
                      <button
                        type="button"
                        id="btn-toggle-password-visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-500 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Admin identity is confirmed server-side at authentication time. */}

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 rounded bg-gray-50 border-gray-200 text-[#D71E28] focus:ring-0"
                      />
                      <span>Keep administrative session active for 12 hours</span>
                    </label>
                  </div>
                </>
              ) : (
                <>
                  {/* Master Key Input */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label
                        htmlFor="admin-masterkey-input"
                        className="text-xs font-semibold uppercase tracking-wider text-gray-500 flex items-center gap-1.5"
                      >
                        <Terminal className="w-3.5 h-3.5 text-purple-600" />
                        <span>Master Hexadecimal Key (48 characters)</span>
                      </label>
                      <span className="text-[11px] font-mono text-gray-400">
                        {masterKey.length}/48
                      </span>
                    </div>

                    <div className="relative">
                      <input
                        id="admin-masterkey-input"
                        type="password"
                        required
                        maxLength={64}
                        value={masterKey}
                        onChange={(e) =>
                          setMasterKey(e.target.value.replace(/[^0-9a-fA-F]/g, '').toLowerCase())
                        }
                        placeholder="Enter your 48-character hexadecimal key"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 font-mono text-xs sm:text-sm tracking-widest focus:outline-none focus:border-[#D71E28] focus:ring-1 focus:ring-[#D71E28] transition-all"
                      />
                      <div className="absolute right-3 top-3 flex items-center gap-1 text-[11px] font-mono text-gray-400">
                        {masterKey.length === 48 ? (
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                        ) : (
                          <Lock className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                    </div>

                    <div className="mt-2 flex items-center justify-between text-[11px] text-gray-400">
                      <span>192-Bit Cryptographic Ledger Authority</span>
                      <button
                        type="button"
                        disabled
                        title="Enter your master key manually"
                        className="text-[#D71E28]/50 font-mono cursor-not-allowed"
                      >
                        Enter key manually
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  id="btn-admin-submit"
                  disabled={
                    loading ||
                    (authMode === 'credentials'
                      ? !email || !password
                      : masterKey.length < 10)
                  }
                  className="w-full py-3.5 bg-[#D71E28] hover:bg-[#A31620] text-gray-900 font-bold text-sm rounded-2xl shadow-[0_0_25px_rgba(215,30,40,0.3)] hover:shadow-[0_0_35px_rgba(215,30,40,0.45)] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Authenticating Credentials...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In as Super Admin</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Security & Access Info Footer */}
            <div className="mt-8 pt-6 border-t border-gray-200/60 flex items-center justify-between text-xs text-gray-400">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-[#D71E28]" />
                <span>TLS 1.3 / AES-256 Audit Logged</span>
              </div>
              <Link href="/dashboard" className="text-gray-500 hover:text-gray-900 transition-colors">
                Customer Banking Portal →
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto w-full py-4 text-center text-xs text-gray-400">
        Crestline Capital Institutional Administration Portal • Authorized Access Only
      </footer>
    </div>
  )
}

