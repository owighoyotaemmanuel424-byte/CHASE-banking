'use client'

import React, { useEffect, useState } from 'react'
import {
  Palette,
  Sun,
  Moon,
  FolderOpen,
  FileEdit,
  HelpCircle,
  ShieldCheck,
  Settings as SettingsIcon,
  CheckCircle2,
  Download,
  Search,
  Filter,
  RefreshCw,
  Lock,
  Mail,
  Send,
  Server,
  Key,
  Eye,
  EyeOff,
  Zap,
  AlertCircle,
  Shield,
  Clock,
} from 'lucide-react'
import { auditLogger, type AuditLogEntry } from '@/lib/audit/audit-logger'

interface SystemModulesProps {
  activeModuleId: string
  siteSettings: any
  onUpdateSettings: (newSettings: any) => void
}

const SMTP_PROVIDERS = [
  { id: 'sendgrid', name: 'SendGrid (Twilio)', host: 'smtp.sendgrid.net', port: '587', encryption: 'TLS', defaultUser: 'apikey', desc: 'Enterprise cloud transactional delivery' },
  { id: 'resend', name: 'Resend', host: 'smtp.resend.com', port: '465', encryption: 'SSL', defaultUser: 'resend', desc: 'Modern developer transactional email engine' },
  { id: 'mailgun', name: 'Mailgun', host: 'smtp.mailgun.org', port: '587', encryption: 'STARTTLS', defaultUser: 'postmaster', desc: 'High-volume routing & parsing gateway' },
  { id: 'ses', name: 'Amazon SES', host: 'email-smtp.us-east-1.amazonaws.com', port: '587', encryption: 'STARTTLS', defaultUser: '', desc: 'AWS scalable cloud mail relay' },
  { id: 'postmark', name: 'Postmark', host: 'smtp.postmarkapp.com', port: '587', encryption: 'TLS', defaultUser: '', desc: 'Dedicated transactional delivery' },
  { id: 'gmail', name: 'Google Workspace / Gmail', host: 'smtp.gmail.com', port: '587', encryption: 'TLS', defaultUser: '', desc: 'Google corporate SMTP authenticated relay' },
  { id: 'office365', name: 'Microsoft 365 Exchange', host: 'smtp.office365.com', port: '587', encryption: 'STARTTLS', defaultUser: '', desc: 'Exchange Online authenticated relay' },
  { id: 'custom', name: 'Custom Institutional SMTP', host: '', port: '587', encryption: 'TLS', defaultUser: '', desc: 'Self-hosted air-gapped mail server / Postfix' },
]

export default function SystemModules({
  activeModuleId,
  siteSettings,
  onUpdateSettings,
}: SystemModulesProps) {
  // Appearance state
  const [density, setDensity] = useState(siteSettings.theme?.density || 'comfortable')
  const [accentColor, setAccentColor] = useState(siteSettings.theme?.accentColor || '#D71E28')
  const [mode, setMode] = useState(siteSettings.theme?.mode || 'dark')

  // Settings State - General
  const [siteName, setSiteName] = useState(siteSettings.siteName || 'Crestline Capital')
  const [sessionTimeoutMinutes, setSessionTimeoutMinutes] = useState(
    (siteSettings.sessionTimeoutMinutes || 480).toString()
  )
  const [maxLoginAttempts, setMaxLoginAttempts] = useState(
    (siteSettings.maxLoginAttempts || 5).toString()
  )
  const [mfaEnforced, setMfaEnforced] = useState(siteSettings.mfaEnforced ?? true)
  const [maintenanceMode, setMaintenanceMode] = useState(siteSettings.maintenanceMode ?? false)

  // Settings State - Public Portal Content
  const [heroHeadline, setHeroHeadline] = useState(siteSettings.heroHeadline || '')
  const [heroSubheadline, setHeroSubheadline] = useState(siteSettings.heroSubheadline || '')

  // Security & Ledger Audit Trail State
  const [auditQuery, setAuditQuery] = useState('')
  const [auditEntries, setAuditEntries] = useState<AuditLogEntry[]>([])

  useEffect(() => {
    setAuditEntries(auditLogger.getLogs(100))
  }, [])

  const normalizedAuditQuery = auditQuery.trim().toLowerCase()
  const filteredAudits = normalizedAuditQuery
    ? auditEntries.filter((a) =>
        [a.action, a.actorId, a.actorRole, a.targetResource, a.targetId].some((field) =>
          String(field ?? '').toLowerCase().includes(normalizedAuditQuery),
        ),
      )
    : auditEntries

  // Settings State - SMTP Configuration
  const [smtpProvider, setSmtpProvider] = useState(siteSettings.smtpProvider || 'sendgrid')
  const [smtpHost, setSmtpHost] = useState(siteSettings.smtpHost || 'smtp.sendgrid.net')
  const [smtpPort, setSmtpPort] = useState((siteSettings.smtpPort || 587).toString())
  const [smtpEncryption, setSmtpEncryption] = useState(siteSettings.smtpEncryption || 'TLS')
  const [smtpAuthEnabled, setSmtpAuthEnabled] = useState(siteSettings.smtpAuthEnabled ?? true)
  const [smtpUser, setSmtpUser] = useState(siteSettings.smtpUser || 'apikey')
  const [smtpPassword, setSmtpPassword] = useState(siteSettings.smtpPassword || '')
  const [showSmtpPassword, setShowSmtpPassword] = useState(false)
  const [smtpFrom, setSmtpFrom] = useState(siteSettings.smtpFrom || 'notifications@crestlinecapital.com')
  const [smtpFromName, setSmtpFromName] = useState(siteSettings.smtpFromName || 'Crestline Capital Security & Treasury')
  const [smtpReplyTo, setSmtpReplyTo] = useState(siteSettings.smtpReplyTo || 'compliance@crestlinecapital.com')
  const [smtpTimeoutSeconds, setSmtpTimeoutSeconds] = useState((siteSettings.smtpTimeoutSeconds || 15).toString())

  // Automated Email Dispatch Matrix
  const [emailTriggers, setEmailTriggers] = useState({
    securityLoginAlerts: siteSettings.emailTriggers?.securityLoginAlerts ?? true,
    securityOtpVerification: siteSettings.emailTriggers?.securityOtpVerification ?? true,
    passwordResetTokens: siteSettings.emailTriggers?.passwordResetTokens ?? true,
    adminAuditEscalations: siteSettings.emailTriggers?.adminAuditEscalations ?? true,
    wireExecutionNotices: siteSettings.emailTriggers?.wireExecutionNotices ?? true,
    highValueDepositReceipts: siteSettings.emailTriggers?.highValueDepositReceipts ?? true,
    kycStatusNotifications: siteSettings.emailTriggers?.kycStatusNotifications ?? true,
    cardAuthorizations: siteSettings.emailTriggers?.cardAuthorizations ?? true,
  })

  // SMTP Test Diagnostics State
  const [testRecipientEmail, setTestRecipientEmail] = useState('')
  const [isTestingSmtp, setIsTestingSmtp] = useState(false)
  const [smtpTestResult, setSmtpTestResult] = useState<{
    success: boolean
    message: string
    details?: any
  } | null>(null)

  const [saveMessage, setSaveMessage] = useState<string | null>(null)

  const handleProviderSelect = (providerId: string) => {
    setSmtpProvider(providerId)
    const preset = SMTP_PROVIDERS.find((p) => p.id === providerId)
    if (preset && preset.id !== 'custom') {
      setSmtpHost(preset.host)
      setSmtpPort(preset.port)
      setSmtpEncryption(preset.encryption)
      if (preset.defaultUser && (!smtpUser || smtpUser === 'apikey' || smtpUser === 'resend')) {
        setSmtpUser(preset.defaultUser)
      }
    }
  }

  const handleTestSmtp = async () => {
    if (!testRecipientEmail || !testRecipientEmail.includes('@')) {
      alert('Please specify a valid test recipient email address.')
      return
    }
    setIsTestingSmtp(true)
    setSmtpTestResult(null)

    try {
      const res = await fetch('/api/admin/smtp/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientEmail: testRecipientEmail,
          smtpProvider,
          smtpHost,
          smtpPort: parseInt(smtpPort, 10) || 587,
          smtpEncryption,
          smtpUser,
          smtpFrom,
          smtpFromName,
        }),
      })

      const data = await res.json()
      if (res.ok && data.success) {
        setSmtpTestResult({
          success: true,
          message: data.message,
          details: data.details,
        })
      } else {
        setSmtpTestResult({
          success: false,
          message: data.error || 'Failed to dispatch SMTP test verification email',
        })
      }
    } catch (err: any) {
      setSmtpTestResult({
        success: false,
        message: err.message || 'Network error during SMTP socket handshake',
      })
    } finally {
      setIsTestingSmtp(false)
    }
  }

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault()
    onUpdateSettings({
      ...siteSettings,
      siteName,
      sessionTimeoutMinutes: parseInt(sessionTimeoutMinutes, 10) || 480,
      maxLoginAttempts: parseInt(maxLoginAttempts, 10) || 5,
      smtpProvider,
      smtpHost,
      smtpPort: parseInt(smtpPort, 10) || 587,
      smtpEncryption,
      smtpAuthEnabled,
      smtpUser,
      smtpPassword,
      smtpFrom,
      smtpFromName,
      smtpReplyTo,
      smtpTimeoutSeconds: parseInt(smtpTimeoutSeconds, 10) || 15,
      emailTriggers,
      mfaEnforced,
      maintenanceMode,
      theme: {
        ...siteSettings.theme,
        density,
        accentColor,
        mode,
      },
    })
    setSaveMessage('Master settings, SMTP configurations, and automated email triggers successfully committed.')
    setTimeout(() => setSaveMessage(null), 4000)
  }

  const handleExportAuditLogs = () => {
    const jsonStr = JSON.stringify(auditEntries, null, 2)
    const blob = new Blob([jsonStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `crestline_audit_log_${Date.now()}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-6">
      {/* 37. Appearance (?id=37) */}
      {activeModuleId === '37' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
              <Palette className="w-5 h-5 text-[#D71E28]" />
              <span>Visual Appearance & Density Controls (?id=37)</span>
            </h2>
            <p className="text-xs text-gray-500">
              Configure interface density, typography scale, and layout responsiveness.
            </p>
          </div>

          <div className="bg-gray-100 border border-gray-200 rounded-2xl p-6 space-y-4 text-xs">
            <div>
              <label className="text-gray-500 block mb-2 font-semibold">Layout Density</label>
              <div className="grid grid-cols-3 gap-3">
                {(['compact', 'comfortable', 'spacious'] as const).map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDensity(d)}
                    className={`p-3 rounded-xl border text-center capitalize transition-all ${
                      density === d
                        ? 'bg-[#D71E28]/10 border-[#D71E28] text-[#D71E28] font-bold'
                        : 'bg-white border-gray-200 text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => alert('Appearance presets applied.')}
                className="px-4 py-2 bg-[#D71E28] text-gray-900 font-bold rounded-xl"
              >
                Apply Density Setting
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 38. Themes (?id=38) */}
      {activeModuleId === '38' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
              <Sun className="w-5 h-5 text-amber-600" />
              <span>Theme Engine & Accent Colors (?id=38)</span>
            </h2>
            <p className="text-xs text-gray-500">
              Toggle dark/light mode and select institutional palette accents.
            </p>
          </div>

          <div className="bg-gray-100 border border-gray-200 rounded-2xl p-6 space-y-4 text-xs">
            <div>
              <label className="text-gray-500 block mb-2 font-semibold">Base Mode</label>
              <div className="grid grid-cols-2 gap-3 max-w-xs">
                <button
                  type="button"
                  onClick={() => setMode('dark')}
                  className={`p-3 rounded-xl border flex items-center justify-center gap-2 ${
                    mode === 'dark'
                      ? 'bg-white border-[#D71E28] text-[#D71E28] font-bold'
                      : 'bg-white border-gray-200 text-gray-500'
                  }`}
                >
                  <Moon className="w-4 h-4" />
                  <span>Dark Slate (Institutional)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMode('light')}
                  className={`p-3 rounded-xl border flex items-center justify-center gap-2 ${
                    mode === 'light'
                      ? 'bg-white border-[#D71E28] text-[#D71E28] font-bold'
                      : 'bg-white border-gray-200 text-gray-500'
                  }`}
                >
                  <Sun className="w-4 h-4" />
                  <span>Light Mode</span>
                </button>
              </div>
            </div>

            <div>
              <label className="text-gray-500 block mb-2 font-semibold">Accent Color</label>
              <div className="flex items-center gap-3">
                {[
                  { name: 'Sky Blue', hex: '#D71E28' },
                  { name: 'Emerald', hex: '#10b981' },
                  { name: 'Indigo', hex: '#6366f1' },
                  { name: 'Amber Gold', hex: '#f59e0b' },
                ].map((c) => (
                  <button
                    key={c.hex}
                    type="button"
                    onClick={() => setAccentColor(c.hex)}
                    style={{ borderColor: accentColor === c.hex ? c.hex : 'transparent' }}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl border-2 bg-white text-gray-900"
                  >
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: c.hex }}></span>
                    <span>{c.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 39. Assets (?id=39) */}
      {activeModuleId === '39' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
              <FolderOpen className="w-5 h-5 text-[#D71E28]" />
              <span>Asset Library & Brand Kit (?id=39)</span>
            </h2>
            <p className="text-xs text-gray-500">
              Manage vector logos, official watermarks, and cryptographic certificate stamps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { name: 'Crestline Shield Emblem (SVG)', type: 'Vector Brandmark', size: '14 KB' },
              { name: 'Official Institutional Seal', type: 'High-Res Stamp', size: '142 KB' },
              { name: 'Audit Certificate Template', type: 'PDF Spec', size: '280 KB' },
            ].map((a, i) => (
              <div key={i} className="bg-gray-100 border border-gray-200 rounded-2xl p-5 space-y-2">
                <span className="font-bold text-sm text-gray-900 block">{a.name}</span>
                <span className="text-xs text-gray-500 block">{a.type} • {a.size}</span>
                <button
                  onClick={() => alert(`Downloading asset: ${a.name}`)}
                  className="text-xs text-[#D71E28] hover:underline font-mono"
                >
                  Download Asset
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 40. Content (?id=40) */}
      {activeModuleId === '40' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
              <FileEdit className="w-5 h-5 text-green-600" />
              <span>Landing Page Content & Copy Editor (?id=40)</span>
            </h2>
            <p className="text-xs text-gray-500">
              Edit public portal headlines, hero copy, and regulatory disclaimers.
            </p>
          </div>

          <div className="bg-gray-100 border border-gray-200 rounded-2xl p-6 space-y-4 text-xs">
            <div>
              <label className="text-gray-500 block mb-1">Hero Main Headline</label>
              <input
                type="text"
                value={heroHeadline}
                onChange={(e) => setHeroHeadline(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-gray-900 font-medium"
              />
            </div>
            <div>
              <label className="text-gray-500 block mb-1">Hero Sub-Headline</label>
              <textarea
                rows={2}
                value={heroSubheadline}
                onChange={(e) => setHeroSubheadline(e.target.value)}
                className="w-full p-3 bg-white border border-gray-200 rounded-xl text-gray-900"
              />
            </div>
            <div className="flex justify-end pt-2">
              <button
                onClick={() => alert('Content modifications published to client-facing portal.')}
                className="px-4 py-2 bg-[#D71E28] text-gray-900 font-bold rounded-xl"
              >
                Publish Copy Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 41. FAQ (?id=41) */}
      {activeModuleId === '41' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-[#D71E28]" />
              <span>Knowledge Base & FAQ Management (?id=41)</span>
            </h2>
            <p className="text-xs text-gray-500">
              Maintain answers for institutional wire clearing, tax withholding, and yield rates.
            </p>
          </div>

          <div className="space-y-3">
            {[
              { q: 'How does Crestline Capital execute double-entry ledger settlement?', a: 'Every financial movement posts atomic balancing debit and credit entries to vault cash, customer liabilities, and interest equity.' },
              { q: 'What is the daily cutoff time for same-day Fedwire transactions?', a: 'Domestic Fedwire entries clear same day when initiated before 16:30 Eastern Standard Time.' },
            ].map((f, i) => (
              <div key={i} className="bg-gray-100 border border-gray-200 rounded-2xl p-5 space-y-1">
                <span className="font-bold text-sm text-gray-900 block">{f.q}</span>
                <p className="text-xs text-gray-500">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 42. Audit Log (?id=42) */}
      {activeModuleId === '42' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-purple-600" />
                <span>Security & Ledger Audit Trail (?id=42)</span>
              </h2>
              <p className="text-xs text-gray-500">
                Append-only, SHA-256 chained audit events tracking all administrative operations.
              </p>
            </div>

            <button
              onClick={handleExportAuditLogs}
              className="px-3.5 py-2 bg-gray-200 hover:bg-[#283548] text-gray-900 text-xs font-semibold rounded-xl flex items-center gap-2 self-start"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Audit Dossier (JSON)</span>
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={auditQuery}
              onChange={(e) => setAuditQuery(e.target.value)}
              placeholder="Search audit actions, actors, or resources..."
              className="w-full pl-9 pr-4 py-2 bg-gray-100 border border-gray-200 rounded-xl text-gray-900 text-xs placeholder-[#64748b]"
            />
          </div>

          <div className="bg-gray-100 border border-gray-200 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-gray-200 bg-[#111827]/50 text-gray-400 uppercase font-semibold">
                    <th className="py-3 px-4">Timestamp</th>
                    <th className="py-3 px-4">Action</th>
                    <th className="py-3 px-4">Actor</th>
                    <th className="py-3 px-4">Resource</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Entry ID</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredAudits.map((a) => (
                    <tr key={a.id} className="hover:bg-gray-200/30">
                      <td className="py-3 px-4 font-mono text-gray-500">
                        {new Date(a.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-[#D71E28]">{a.action}</td>
                      <td className="py-3 px-4 font-mono text-gray-900">{a.actorId}</td>
                      <td className="py-3 px-4 text-gray-600">{a.targetResource}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            a.status === 'SUCCESS'
                              ? 'bg-green-100 text-green-600'
                              : 'bg-red-100 text-red-600'
                          }`}
                        >
                          {a.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-[10px] text-gray-400 text-right">
                        {a.id.substring(0, 10)}...
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 43. Settings (?id=43) */}
      {activeModuleId === '43' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
                <SettingsIcon className="w-5 h-5 text-[#D71E28]" />
                <span>Master System Settings & Environment Configuration (?id=43)</span>
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Configure enterprise platform parameters, SMTP email service providers, automated security & transaction dispatchers, and system maintenance mode.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-100 border border-emerald-500/20 text-green-600 text-xs font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>SMTP Gateway: Ready</span>
              </span>
            </div>
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-6 text-xs">
            {/* 1. General Parameters */}
            <div className="bg-gray-100 border border-gray-200 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                <div className="flex items-center gap-2">
                  <Server className="w-4 h-4 text-[#D71E28]" />
                  <h3 className="font-bold text-gray-900 text-sm">General Platform Parameters</h3>
                </div>
                <span className="text-[11px] text-gray-400 font-mono">Production Environment</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="text-gray-500 block mb-1 font-medium">Platform Name</label>
                  <input
                    type="text"
                    value={siteName}
                    onChange={(e) => setSiteName(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-gray-900 font-medium focus:border-[#D71E28] focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="text-gray-500 block mb-1 font-medium">System Environment</label>
                  <input
                    type="text"
                    disabled
                    value={siteSettings.environment}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-gray-500 font-mono cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="text-gray-500 block mb-1 font-medium">Session Timeout (Minutes)</label>
                  <input
                    type="number"
                    value={sessionTimeoutMinutes}
                    onChange={(e) => setSessionTimeoutMinutes(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-gray-900 font-mono focus:border-[#D71E28] focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="text-gray-500 block mb-1 font-medium">Max Auth Failure Attempts</label>
                  <input
                    type="number"
                    value={maxLoginAttempts}
                    onChange={(e) => setMaxLoginAttempts(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-gray-900 font-mono focus:border-[#D71E28] focus:outline-none transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* 2. SMTP Service Provider & Delivery Transport */}
            <div className="bg-gray-100 border border-gray-200 rounded-2xl p-6 space-y-6">
              <div className="border-b border-gray-200 pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-[#D71E28]" />
                    <h3 className="font-bold text-gray-900 text-sm">SMTP Email Service Provider & Transport Settings</h3>
                  </div>
                  <span className="text-[#D71E28] text-[11px] font-mono">Configurable Provider Engine</span>
                </div>
                <p className="text-[11px] text-gray-500 mt-1">
                  Connect any transactional email service provider or private mail exchange server to deliver automated notifications.
                </p>
              </div>

              {/* Service Provider Selector Presets */}
              <div>
                <label className="text-gray-600 block mb-2 font-semibold">Select Email Service Provider Preset</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {SMTP_PROVIDERS.map((provider) => {
                    const isSelected = smtpProvider === provider.id
                    return (
                      <button
                        type="button"
                        key={provider.id}
                        onClick={() => handleProviderSelect(provider.id)}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          isSelected
                            ? 'bg-[#D71E28]/10 border-[#D71E28] shadow-[0_0_15px_rgba(215,30,40,0.15)]'
                            : 'bg-white border-gray-200 hover:border-gray-300 text-gray-500 hover:text-gray-900'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className={`font-semibold ${isSelected ? 'text-[#D71E28]' : 'text-gray-900'}`}>
                            {provider.name}
                          </span>
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#D71E28]" />}
                        </div>
                        <span className="text-[10px] text-gray-400 block line-clamp-1">{provider.desc}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Server Host & Port & Encryption */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="lg:col-span-2">
                  <label className="text-gray-500 block mb-1 font-medium">SMTP Server Host</label>
                  <input
                    type="text"
                    value={smtpHost}
                    onChange={(e) => setSmtpHost(e.target.value)}
                    placeholder="e.g. smtp.sendgrid.net"
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-gray-900 font-mono focus:border-[#D71E28] focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="text-gray-500 block mb-1 font-medium">SMTP Port</label>
                  <input
                    type="number"
                    value={smtpPort}
                    onChange={(e) => setSmtpPort(e.target.value)}
                    placeholder="587 / 465 / 25"
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-gray-900 font-mono focus:border-[#D71E28] focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="text-gray-500 block mb-1 font-medium">Transport Encryption</label>
                  <select
                    value={smtpEncryption}
                    onChange={(e) => setSmtpEncryption(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-gray-900 font-medium focus:border-[#D71E28] focus:outline-none transition-colors"
                  >
                    <option value="TLS">TLS (STARTTLS - Port 587)</option>
                    <option value="SSL">SSL / TLS (Direct - Port 465)</option>
                    <option value="STARTTLS">STARTTLS (Opportunistic)</option>
                    <option value="NONE">None / Plaintext (Local Testing)</option>
                  </select>
                </div>
              </div>

              {/* Authentication Credentials */}
              <div className="p-4 bg-white border border-gray-200 rounded-xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Key className="w-3.5 h-3.5 text-amber-600" />
                    <span className="font-semibold text-gray-900 text-xs">SMTP Authentication Credentials</span>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={smtpAuthEnabled}
                      onChange={(e) => setSmtpAuthEnabled(e.target.checked)}
                      className="w-3.5 h-3.5 rounded text-[#D71E28]"
                    />
                    <span className="text-gray-500 text-[11px]">Require SMTP Auth</span>
                  </label>
                </div>

                {smtpAuthEnabled && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-gray-500 block mb-1 font-medium">SMTP Username / API Key</label>
                      <input
                        type="text"
                        value={smtpUser}
                        onChange={(e) => setSmtpUser(e.target.value)}
                        placeholder="e.g. apikey or postmaster@domain.com"
                        className="w-full px-3 py-2 bg-[#111827] border border-gray-200 rounded-xl text-gray-900 font-mono focus:border-[#D71E28] focus:outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-gray-500 block mb-1 font-medium">SMTP Password / API Secret Key</label>
                      <div className="relative">
                        <input
                          type={showSmtpPassword ? 'text' : 'password'}
                          value={smtpPassword}
                          onChange={(e) => setSmtpPassword(e.target.value)}
                          placeholder="••••••••••••••••••••••••"
                          className="w-full px-3 py-2 bg-[#111827] border border-gray-200 rounded-xl text-gray-900 font-mono pr-10 focus:border-[#D71E28] focus:outline-none transition-colors"
                        />
                        <button
                          type="button"
                          onClick={() => setShowSmtpPassword(!showSmtpPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-900 transition-colors"
                        >
                          {showSmtpPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Sender Addresses */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="text-gray-500 block mb-1 font-medium">From Sender Email</label>
                  <input
                    type="email"
                    value={smtpFrom}
                    onChange={(e) => setSmtpFrom(e.target.value)}
                    placeholder="notifications@crestlinecapital.com"
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-gray-900 font-mono focus:border-[#D71E28] focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="text-gray-500 block mb-1 font-medium">From Display Name</label>
                  <input
                    type="text"
                    value={smtpFromName}
                    onChange={(e) => setSmtpFromName(e.target.value)}
                    placeholder="Crestline Capital Security & Treasury"
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-gray-900 font-medium focus:border-[#D71E28] focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="text-gray-500 block mb-1 font-medium">Reply-To Address</label>
                  <input
                    type="email"
                    value={smtpReplyTo}
                    onChange={(e) => setSmtpReplyTo(e.target.value)}
                    placeholder="compliance@crestlinecapital.com"
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-gray-900 font-mono focus:border-[#D71E28] focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="text-gray-500 block mb-1 font-medium">Socket Timeout (Seconds)</label>
                  <input
                    type="number"
                    value={smtpTimeoutSeconds}
                    onChange={(e) => setSmtpTimeoutSeconds(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-gray-900 font-mono focus:border-[#D71E28] focus:outline-none transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* 3. Automated Email Notification Dispatch Matrix */}
            <div className="bg-gray-100 border border-gray-200 rounded-2xl p-6 space-y-6">
              <div className="border-b border-gray-200 pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-green-600" />
                    <h3 className="font-bold text-gray-900 text-sm">Automated Security & Transaction Email Triggers</h3>
                  </div>
                  <span className="text-green-600 text-[11px] font-mono">Real-Time Dispatch Matrix</span>
                </div>
                <p className="text-[11px] text-gray-500 mt-1">
                  Specify which platform actions automatically trigger transactional emails via the active SMTP service provider.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Security Category */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5 pb-1 border-b border-gray-200/70">
                    <Shield className="w-3.5 h-3.5 text-[#D71E28]" />
                    <span>Automated Security Emails</span>
                  </h4>

                  <label className="flex items-start gap-3 p-3 bg-white border border-gray-200 rounded-xl cursor-pointer hover:border-gray-300 transition-colors">
                    <input
                      type="checkbox"
                      checked={emailTriggers.securityLoginAlerts}
                      onChange={(e) =>
                        setEmailTriggers({ ...emailTriggers, securityLoginAlerts: e.target.checked })
                      }
                      className="w-4 h-4 mt-0.5 rounded text-[#D71E28]"
                    />
                    <div>
                      <span className="font-bold text-gray-900 block">Unrecognized Device & IP Sign-In Alerts</span>
                      <span className="text-gray-400 block text-[11px] leading-relaxed">
                        Immediately notifies the user and security team when an account is accessed from a novel IP or device.
                      </span>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-3 bg-white border border-gray-200 rounded-xl cursor-pointer hover:border-gray-300 transition-colors">
                    <input
                      type="checkbox"
                      checked={emailTriggers.securityOtpVerification}
                      onChange={(e) =>
                        setEmailTriggers({ ...emailTriggers, securityOtpVerification: e.target.checked })
                      }
                      className="w-4 h-4 mt-0.5 rounded text-[#D71E28]"
                    />
                    <div>
                      <span className="font-bold text-gray-900 block">Multi-Factor Authentication (MFA) & OTP Delivery</span>
                      <span className="text-gray-400 block text-[11px] leading-relaxed">
                        Transmits time-sensitive 6-digit numeric authentication tokens for client login and wire authorizations.
                      </span>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-3 bg-white border border-gray-200 rounded-xl cursor-pointer hover:border-gray-300 transition-colors">
                    <input
                      type="checkbox"
                      checked={emailTriggers.passwordResetTokens}
                      onChange={(e) =>
                        setEmailTriggers({ ...emailTriggers, passwordResetTokens: e.target.checked })
                      }
                      className="w-4 h-4 mt-0.5 rounded text-[#D71E28]"
                    />
                    <div>
                      <span className="font-bold text-gray-900 block">Password Reset & Security Token Tokens</span>
                      <span className="text-gray-400 block text-[11px] leading-relaxed">
                        Sends cryptographically secure recovery links and tokens to the verified account email.
                      </span>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-3 bg-white border border-gray-200 rounded-xl cursor-pointer hover:border-gray-300 transition-colors">
                    <input
                      type="checkbox"
                      checked={emailTriggers.adminAuditEscalations}
                      onChange={(e) =>
                        setEmailTriggers({ ...emailTriggers, adminAuditEscalations: e.target.checked })
                      }
                      className="w-4 h-4 mt-0.5 rounded text-[#D71E28]"
                    />
                    <div>
                      <span className="font-bold text-gray-900 block">Super Admin Audit & Threat Escalations</span>
                      <span className="text-gray-400 block text-[11px] leading-relaxed">
                        Dispatches instant security audit reports to the compliance officer on duty upon abnormal ledger adjustments.
                      </span>
                    </div>
                  </label>
                </div>

                {/* Transaction Category */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5 pb-1 border-b border-gray-200/70">
                    <Zap className="w-3.5 h-3.5 text-green-600" />
                    <span>Automated Transaction Emails</span>
                  </h4>

                  <label className="flex items-start gap-3 p-3 bg-white border border-gray-200 rounded-xl cursor-pointer hover:border-gray-300 transition-colors">
                    <input
                      type="checkbox"
                      checked={emailTriggers.wireExecutionNotices}
                      onChange={(e) =>
                        setEmailTriggers({ ...emailTriggers, wireExecutionNotices: e.target.checked })
                      }
                      className="w-4 h-4 mt-0.5 rounded text-green-600"
                    />
                    <div>
                      <span className="font-bold text-gray-900 block">Fedwire & SWIFT Wire Transfer Dispatches</span>
                      <span className="text-gray-400 block text-[11px] leading-relaxed">
                        Delivers payment advice with IMAD/OMAD trace identifiers as soon as clearing rails accept the transfer.
                      </span>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-3 bg-white border border-gray-200 rounded-xl cursor-pointer hover:border-gray-300 transition-colors">
                    <input
                      type="checkbox"
                      checked={emailTriggers.highValueDepositReceipts}
                      onChange={(e) =>
                        setEmailTriggers({ ...emailTriggers, highValueDepositReceipts: e.target.checked })
                      }
                      className="w-4 h-4 mt-0.5 rounded text-green-600"
                    />
                    <div>
                      <span className="font-bold text-gray-900 block">Deposit Receipts & High-Yield Sweeps Credited</span>
                      <span className="text-gray-400 block text-[11px] leading-relaxed">
                        Sends itemized ledger confirmation receipts whenever incoming cash is booked to a checking or sweep vault.
                      </span>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-3 bg-white border border-gray-200 rounded-xl cursor-pointer hover:border-gray-300 transition-colors">
                    <input
                      type="checkbox"
                      checked={emailTriggers.kycStatusNotifications}
                      onChange={(e) =>
                        setEmailTriggers({ ...emailTriggers, kycStatusNotifications: e.target.checked })
                      }
                      className="w-4 h-4 mt-0.5 rounded text-green-600"
                    />
                    <div>
                      <span className="font-bold text-gray-900 block">AML / KYC Compliance Status Updates</span>
                      <span className="text-gray-400 block text-[11px] leading-relaxed">
                        Notifies customers when regulatory identity documentation is verified, cleared, or requires remediation.
                      </span>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-3 bg-white border border-gray-200 rounded-xl cursor-pointer hover:border-gray-300 transition-colors">
                    <input
                      type="checkbox"
                      checked={emailTriggers.cardAuthorizations}
                      onChange={(e) =>
                        setEmailTriggers({ ...emailTriggers, cardAuthorizations: e.target.checked })
                      }
                      className="w-4 h-4 mt-0.5 rounded text-green-600"
                    />
                    <div>
                      <span className="font-bold text-gray-900 block">Visa Platinum Card Authorizations & Freezes</span>
                      <span className="text-gray-400 block text-[11px] leading-relaxed">
                        Sends transaction alerts for card point-of-sale swipes, ATM withdrawals, and emergency freeze actions.
                      </span>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* 4. Live Interactive SMTP Diagnostic Test Suite */}
            <div className="bg-gray-100 border border-gray-200 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                <div className="flex items-center gap-2">
                  <Send className="w-4 h-4 text-[#D71E28]" />
                  <h3 className="font-bold text-gray-900 text-sm">SMTP Socket & Deliverability Diagnostic Test</h3>
                </div>
                <span className="text-gray-400 font-mono text-[11px]">RFC 5321 Handshake Verification</span>
              </div>

              <p className="text-[11px] text-gray-500">
                Verify connectivity with the configured SMTP host by sending a diagnostic security notification email to any address.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="flex-1">
                  <input
                    type="email"
                    value={testRecipientEmail}
                    onChange={(e) => setTestRecipientEmail(e.target.value)}
                    placeholder="Recipient email address for test"
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-gray-900 font-mono focus:border-[#D71E28] focus:outline-none transition-colors"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleTestSmtp}
                  disabled={isTestingSmtp}
                  className="px-4 py-2 bg-gray-200 hover:bg-[#283548] text-[#D71E28] font-bold rounded-xl border border-[#D71E28]/30 transition-all flex items-center justify-center gap-2 shrink-0 disabled:opacity-50"
                >
                  {isTestingSmtp ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Initiating TLS Socket...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Send Diagnostic Verification Email</span>
                    </>
                  )}
                </button>
              </div>

              {smtpTestResult && (
                <div
                  className={`p-4 rounded-xl border transition-all ${
                    smtpTestResult.success
                      ? 'bg-green-100 border-emerald-500/30 text-green-600'
                      : 'bg-red-100 border-red-500/30 text-red-600'
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold mb-1">
                    {smtpTestResult.success ? (
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-600" />
                    )}
                    <span>{smtpTestResult.message}</span>
                  </div>
                  {smtpTestResult.details && (
                    <div className="mt-2 text-[10px] font-mono grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-emerald-500/20 text-gray-600">
                      <div>
                        <span className="text-gray-400 block">Handshake Latency:</span>
                        <span className="text-green-600 font-bold">{smtpTestResult.details.handshakeLatencyMs}ms</span>
                      </div>
                      <div>
                        <span className="text-gray-400 block">Gateway Status:</span>
                        <span>{smtpTestResult.details.status}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 block">Trace ID:</span>
                        <span className="truncate block">{smtpTestResult.details.traceId}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 block">Transport Protocol:</span>
                        <span>{smtpTestResult.details.encryption} (Port {smtpTestResult.details.port})</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 5. Security & Maintenance Toggles */}
            <div className="bg-gray-100 border border-gray-200 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-amber-600" />
                  <h3 className="font-bold text-gray-900 text-sm">Security & Air-Gap Maintenance Controls</h3>
                </div>
                <span className="text-amber-600 font-mono text-[11px]">Hardened Policy Enforcer</span>
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-xl cursor-pointer hover:border-gray-300 transition-colors">
                  <input
                    type="checkbox"
                    checked={mfaEnforced}
                    onChange={(e) => setMfaEnforced(e.target.checked)}
                    className="w-4 h-4 rounded text-[#D71E28]"
                  />
                  <div>
                    <span className="font-bold text-gray-900 block">Enforce Universal Multi-Factor Authentication (MFA)</span>
                    <span className="text-gray-400">Mandate TOTP hardware tokens or email OTP for all administrative access.</span>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-xl cursor-pointer hover:border-gray-300 transition-colors">
                  <input
                    type="checkbox"
                    checked={maintenanceMode}
                    onChange={(e) => setMaintenanceMode(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-600"
                  />
                  <div>
                    <span className="font-bold text-amber-600 block">Maintenance Mode (Air-Gap Protection)</span>
                    <span className="text-gray-400">Suspend public API endpoints and queue external client transfers in clearing buffer.</span>
                  </div>
                </label>
              </div>
            </div>

            {saveMessage && (
              <div className="p-3 bg-green-100 border border-emerald-500/20 text-green-600 rounded-xl flex items-center gap-2 animate-in fade-in duration-300">
                <CheckCircle2 className="w-4 h-4" />
                <span className="font-semibold">{saveMessage}</span>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-6 py-3 bg-[#D71E28] text-gray-900 font-bold text-xs rounded-xl hover:bg-[#A31620] shadow-[0_0_20px_rgba(215,30,40,0.25)] transition-all flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Commit System Settings & SMTP Transport</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
