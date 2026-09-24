'use client'

import React, { useState } from 'react'
import {
  Wallet,
  ArrowLeftRight,
  CreditCard,
  Building,
  DollarSign,
  FileSpreadsheet,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  Send,
  Plus,
  TrendingUp,
  Percent,
  Sliders,
  Landmark,
  FileText,
  Crown,
} from 'lucide-react'
import {
  AdminDepositItem,
  AdminWithdrawalItem,
  AdminTransferRecord,
  AdminCardItem,
  AdminLoanApplication,
  AdminGrant,
  AdminCurrency,
} from '@/lib/admin/admin-store'

interface FinancialModulesProps {
  activeModuleId: string
  deposits: AdminDepositItem[]
  withdrawals: AdminWithdrawalItem[]
  transfers: AdminTransferRecord[]
  cards: AdminCardItem[]
  loans: AdminLoanApplication[]
  grants: AdminGrant[]
  currencies: AdminCurrency[]
  onApproveDeposit: (id: string) => void
  onApproveWithdrawal: (id: string) => void
  onIssueGrant: (title: string, recipient: string, amount: number, category: any) => void
}

export default function FinancialModules({
  activeModuleId,
  deposits,
  withdrawals,
  transfers,
  cards,
  loans,
  grants,
  currencies,
  onApproveDeposit,
  onApproveWithdrawal,
  onIssueGrant,
}: FinancialModulesProps) {
  // New Grant Form State
  const [showGrantModal, setShowGrantModal] = useState(false)
  const [grantTitle, setGrantTitle] = useState('')
  const [grantRecipient, setGrantRecipient] = useState('')
  const [grantAmount, setGrantAmount] = useState('5000')
  const [grantCategory, setGrantCategory] = useState<'INNOVATION' | 'TREASURY_BONUS' | 'FOUNDER_CREDIT'>('INNOVATION')

  // New Deposit entry form
  const [showNewDepositModal, setShowNewDepositModal] = useState(false)
  const [depUserEmail, setDepUserEmail] = useState('paulogla61@gmail.com')
  const [depAmount, setDepAmount] = useState('25000')
  const [depMethod, setDepMethod] = useState<'WIRE' | 'ACH' | 'CRYPTO_BTC' | 'CRYPTO_USDT'>('WIRE')

  // Payment Methods State
  const [wireRouting, setWireRouting] = useState('026009593')
  const [wireSwift, setWireSwift] = useState('CRSTUS33XXX')
  const [btcAddress, setBtcAddress] = useState('bc1q9crestline98institutionalledger9821')
  const [ethAddress, setEthAddress] = useState('0x38bdf8CrestlineCapitalTreasuryVault01')
  const [paymentSaveMessage, setPaymentSaveMessage] = useState<string | null>(null)

  // Card Setup State
  const [binRange, setBinRange] = useState('4841 89')
  const [interchangeRate, setInterchangeRate] = useState('1.65%')
  const [contactlessLimit, setContactlessLimit] = useState('$250.00')

  // IRS Settings State
  const [withholdingRate, setWithholdingRate] = useState('24')
  const [tinVerificationStatus, setTinVerificationStatus] = useState('CONNECTED')
  const [irsSaveMsg, setIrsSaveMsg] = useState<string | null>(null)

  const handleGrantSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!grantTitle || !grantRecipient || !grantAmount) return
    onIssueGrant(grantTitle, grantRecipient, parseFloat(grantAmount), grantCategory)
    setShowGrantModal(false)
    setGrantTitle('')
    setGrantRecipient('')
  }

  return (
    <div className="space-y-6">
      {/* 0. Deposits Queue (?id=0) */}
      {activeModuleId === '0' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
                <Wallet className="w-5 h-5 text-green-600" />
                <span>Deposits Queue (?id=0)</span>
              </h2>
              <p className="text-xs text-gray-500">
                Incoming funds verification with double-entry general ledger clearing.
              </p>
            </div>
            <button
              onClick={() => setShowNewDepositModal(true)}
              className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-600 text-gray-900 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Simulate Inbound Deposit</span>
            </button>
          </div>

          <div className="bg-gray-100 border border-gray-200 rounded-2xl overflow-hidden shadow-xl">
            {deposits.length === 0 ? (
              <div className="p-8 text-center text-xs text-gray-500">
                <Clock className="w-8 h-8 text-gray-400 mx-auto mb-2 opacity-50" />
                No pending deposits in the clearing queue.
              </div>
            ) : (
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-gray-200 bg-[#111827]/50 text-gray-400 uppercase font-semibold">
                    <th className="py-3 px-4">Client</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Method</th>
                    <th className="py-3 px-4">Reference</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Ledger Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {deposits.map((dep) => (
                    <tr key={dep.id} className="hover:bg-gray-200/30">
                      <td className="py-3 px-4 font-mono text-gray-900 font-medium">{dep.userEmail}</td>
                      <td className="py-3 px-4 font-mono font-bold text-green-600">
                        ${dep.amount.toLocaleString()} {dep.currency}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded bg-white text-gray-500 font-mono text-[10px]">
                          {dep.method}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-gray-500">{dep.reference}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            dep.status === 'APPROVED'
                              ? 'bg-green-100 text-green-600 border border-emerald-500/20'
                              : 'bg-amber-100 text-amber-600 border border-amber-500/20'
                          }`}
                        >
                          {dep.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        {dep.status === 'PENDING' ? (
                          <button
                            onClick={() => onApproveDeposit(dep.id)}
                            className="px-3 py-1 bg-emerald-500 hover:bg-emerald-600 text-gray-900 font-bold rounded-lg text-xs transition-colors"
                          >
                            Approve Deposit
                          </button>
                        ) : (
                          <span className="text-[11px] text-gray-400 font-mono">Ledger Committed</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* 1. Withdrawals Queue (?id=1) */}
      {activeModuleId === '1' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
                <ArrowLeftRight className="w-5 h-5 text-amber-600" />
                <span>Withdrawals Queue (?id=1)</span>
              </h2>
              <p className="text-xs text-gray-500">
                Outbound payout verification, sanction risk scores, and debited liability clearing.
              </p>
            </div>
          </div>

          <div className="bg-gray-100 border border-gray-200 rounded-2xl overflow-hidden shadow-xl">
            {withdrawals.length === 0 ? (
              <div className="p-8 text-center text-xs text-gray-500">
                <Clock className="w-8 h-8 text-gray-400 mx-auto mb-2 opacity-50" />
                No pending withdrawals in the payout queue.
              </div>
            ) : (
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-gray-200 bg-[#111827]/50 text-gray-400 uppercase font-semibold">
                    <th className="py-3 px-4">Client</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Destination</th>
                    <th className="py-3 px-4">Risk Score</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {withdrawals.map((wth) => (
                    <tr key={wth.id} className="hover:bg-gray-200/30">
                      <td className="py-3 px-4 font-mono text-gray-900">{wth.userEmail}</td>
                      <td className="py-3 px-4 font-mono font-bold text-amber-600">
                        ${wth.amount.toLocaleString()} {wth.currency}
                      </td>
                      <td className="py-3 px-4 font-mono text-gray-500">{wth.destination}</td>
                      <td className="py-3 px-4 font-mono text-green-600">{wth.riskScore}/100</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-600 border border-amber-500/20">
                          {wth.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        {wth.status === 'PENDING' && (
                          <button
                            onClick={() => onApproveWithdrawal(wth.id)}
                            className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-gray-900 font-bold rounded-lg text-xs"
                          >
                            Approve Payout
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* 15. Transfers Module (?id=15) */}
      {activeModuleId === '15' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
              <ArrowLeftRight className="w-5 h-5 text-[#D71E28]" />
              <span>Transfers & Ledger Journals (?id=15)</span>
            </h2>
            <p className="text-xs text-gray-500">
              Account-to-account transfer transactions with immutable double-entry journal hashes.
            </p>
          </div>

          <div className="bg-gray-100 border border-gray-200 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-4">
              <div>
                <span className="text-xs text-gray-500">Double-Entry Balancing State</span>
                <div className="text-base font-bold font-mono text-green-600">
                  DEBITS == CREDITS (100.00% Balanced)
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-green-100 text-green-600 font-mono text-xs border border-emerald-500/20">
                Ledger Core Active
              </span>
            </div>

            <p className="text-xs text-gray-500">
              Every internal transfer updates asset, liability, and equity ledgers in accordance with GAAP and sovereign banking standards.
            </p>
          </div>
        </div>
      )}

      {/* 16. Payment Methods Module (?id=16) */}
      {activeModuleId === '16' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
              <Landmark className="w-5 h-5 text-[#D71E28]" />
              <span>Payment Methods & Settlement Gateways (?id=16)</span>
            </h2>
            <p className="text-xs text-gray-500">
              Treasury deposit addresses, Fedwire routing details, and SWIFT parameters.
            </p>
          </div>

          <div className="bg-gray-100 border border-gray-200 rounded-2xl p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="text-gray-500 block mb-1">Fedwire Routing Number</label>
                <input
                  type="text"
                  value={wireRouting}
                  onChange={(e) => setWireRouting(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-gray-900 font-mono"
                />
              </div>
              <div>
                <label className="text-gray-500 block mb-1">SWIFT / BIC Code</label>
                <input
                  type="text"
                  value={wireSwift}
                  onChange={(e) => setWireSwift(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-gray-900 font-mono"
                />
              </div>
              <div>
                <label className="text-gray-500 block mb-1">BTC Treasury Deposit Address</label>
                <input
                  type="text"
                  value={btcAddress}
                  onChange={(e) => setBtcAddress(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-gray-900 font-mono"
                />
              </div>
              <div>
                <label className="text-gray-500 block mb-1">ETH/ERC-20 Treasury Vault</label>
                <input
                  type="text"
                  value={ethAddress}
                  onChange={(e) => setEthAddress(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-gray-900 font-mono"
                />
              </div>
            </div>

            {paymentSaveMessage && (
              <div className="p-3 bg-green-100 border border-emerald-500/20 text-green-600 rounded-xl text-xs">
                {paymentSaveMessage}
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                onClick={() => {
                  setPaymentSaveMessage('Payment settlement parameters updated and propagated to customer portals.')
                  setTimeout(() => setPaymentSaveMessage(null), 3000)
                }}
                className="px-4 py-2 bg-[#D71E28] text-gray-900 font-bold rounded-xl text-xs hover:bg-[#A31620]"
              >
                Save Gateway Configurations
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 17. Cards (?id=17) */}
      {activeModuleId === '17' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-[#D71E28]" />
              <span>Card Issuing & Controls (?id=17)</span>
            </h2>
            <p className="text-xs text-gray-500">
              Virtual & physical corporate card limits, PAN tokenization, and instant freeze controls.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {cards.map((card) => (
              <div key={card.id} className="bg-gray-100 border border-gray-200 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-gray-900">{card.holderName}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      card.status === 'ACTIVE'
                        ? 'bg-green-100 text-green-600 border border-emerald-500/20'
                        : 'bg-red-100 text-red-600 border border-red-500/20'
                    }`}
                  >
                    {card.status}
                  </span>
                </div>
                <div className="font-mono text-lg text-[#D71E28] tracking-widest">{card.maskedPan}</div>
                <div className="text-xs text-gray-500 space-y-1">
                  <div>Monthly Limit: <span className="text-gray-900 font-mono">${card.spendingLimitMonthly.toLocaleString()}</span></div>
                  <div>Spent This Month: <span className="text-gray-900 font-mono">${card.spentThisMonth.toLocaleString()}</span></div>
                  <div>Type: <span className="text-gray-900">{card.type}</span> • Exp: <span className="text-gray-900 font-mono">{card.expiry}</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 18. Card Setup (?id=18) */}
      {activeModuleId === '18' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
              <Sliders className="w-5 h-5 text-[#D71E28]" />
              <span>Card Program & Issuer Setup (?id=18)</span>
            </h2>
            <p className="text-xs text-gray-500">
              Visa / Mastercard interchange parameters, BIN ranges, and tokenized limits.
            </p>
          </div>

          <div className="bg-gray-100 border border-gray-200 rounded-2xl p-6 space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-gray-500 block mb-1">Assigned Issuer BIN Range</label>
                <input
                  type="text"
                  value={binRange}
                  onChange={(e) => setBinRange(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-gray-900 font-mono"
                />
              </div>
              <div>
                <label className="text-gray-500 block mb-1">Domestic Interchange Fee</label>
                <input
                  type="text"
                  value={interchangeRate}
                  onChange={(e) => setInterchangeRate(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-gray-900 font-mono"
                />
              </div>
              <div>
                <label className="text-gray-500 block mb-1">Max Contactless Tap Limit</label>
                <input
                  type="text"
                  value={contactlessLimit}
                  onChange={(e) => setContactlessLimit(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-gray-900 font-mono"
                />
              </div>
            </div>
            <button
              onClick={() => alert('Card Program configurations committed.')}
              className="px-4 py-2 bg-[#D71E28] text-gray-900 font-bold rounded-xl"
            >
              Update Program Controls
            </button>
          </div>
        </div>
      )}

      {/* 19. Currencies (?id=19) */}
      {activeModuleId === '19' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-[#D71E28]" />
              <span>Multi-Currency Exchange Rates (?id=19)</span>
            </h2>
            <p className="text-xs text-gray-500">
              Foreign exchange parity rates, liquidity spreads, and currency enablement.
            </p>
          </div>

          <div className="bg-gray-100 border border-gray-200 rounded-2xl overflow-hidden shadow-xl">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-200 bg-[#111827]/50 text-gray-400 uppercase font-semibold">
                  <th className="py-3 px-4">Currency</th>
                  <th className="py-3 px-4">Code</th>
                  <th className="py-3 px-4">Rate vs USD</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Last Updated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currencies.map((curr) => (
                  <tr key={curr.code} className="hover:bg-gray-200/30">
                    <td className="py-3 px-4 font-bold text-gray-900">
                      {curr.symbol} {curr.name}
                    </td>
                    <td className="py-3 px-4 font-mono text-[#D71E28]">{curr.code}</td>
                    <td className="py-3 px-4 font-mono font-bold text-gray-900">{curr.rateAgainstUSD}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-600 border border-emerald-500/20">
                        {curr.enabled ? 'ENABLED' : 'DISABLED'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-500 font-mono">{curr.lastUpdated}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 20. Loans (?id=20) */}
      {activeModuleId === '20' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
              <Landmark className="w-5 h-5 text-[#D71E28]" />
              <span>Credit Allocation & Loan Underwriting (?id=20)</span>
            </h2>
            <p className="text-xs text-gray-500">
              Commercial loan applications, debt-service coverage, and amortized schedules.
            </p>
          </div>

          <div className="space-y-4">
            {loans.map((loan) => (
              <div key={loan.id} className="bg-gray-100 border border-gray-200 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-base text-gray-900">{loan.applicantName}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#D71E28]/10 text-[#D71E28]">
                      FICO {loan.creditScore}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1 space-x-3">
                    <span>Principal: <strong className="text-gray-900 font-mono">${loan.principal.toLocaleString()}</strong></span>
                    <span>APR: <strong className="text-green-600 font-mono">{loan.apr}%</strong></span>
                    <span>Term: <strong className="text-gray-900">{loan.termMonths} Mos</strong></span>
                    <span>Monthly: <strong className="text-gray-900 font-mono">${loan.monthlyPayment.toFixed(2)}</strong></span>
                  </div>
                  <div className="text-xs text-gray-400 mt-1">Purpose: {loan.purpose}</div>
                </div>

                <span className="px-3 py-1 rounded-full text-xs font-bold font-mono bg-green-100 text-green-600 border border-emerald-500/20 self-start md:self-auto">
                  {loan.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 21. Grants (?id=21) */}
      {activeModuleId === '21' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
                <Crown className="w-5 h-5 text-amber-600" />
                <span>Promotional & Institutional Grants (?id=21)</span>
              </h2>
              <p className="text-xs text-gray-500">
                Disburse treasury grants and welcome incentives backed by promotional expense ledgers.
              </p>
            </div>
            <button
              onClick={() => setShowGrantModal(true)}
              className="px-3.5 py-2 bg-amber-400 hover:bg-amber-500 text-gray-900 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Issue New Grant</span>
            </button>
          </div>

          <div className="bg-gray-100 border border-gray-200 rounded-2xl overflow-hidden shadow-xl">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-200 bg-[#111827]/50 text-gray-400 uppercase font-semibold">
                  <th className="py-3 px-4">Grant Title</th>
                  <th className="py-3 px-4">Recipient</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Issued Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {grants.map((g) => (
                  <tr key={g.id} className="hover:bg-gray-200/30">
                    <td className="py-3 px-4 font-bold text-gray-900">{g.title}</td>
                    <td className="py-3 px-4 font-mono text-[#D71E28]">{g.recipientEmail}</td>
                    <td className="py-3 px-4 font-mono font-bold text-green-600">
                      ${g.amount.toLocaleString()} {g.currency}
                    </td>
                    <td className="py-3 px-4 text-gray-500">{g.category}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-600 border border-emerald-500/20">
                        {g.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-500 font-mono">{g.issuedAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 22. IRS (?id=22) */}
      {activeModuleId === '22' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#D71E28]" />
              <span>IRS Compliance & Tax Holdback Manager (?id=22)</span>
            </h2>
            <p className="text-xs text-gray-500">
              W-9/W-8BEN status verification, 1099-INT reporting, and automated withholding holdback.
            </p>
          </div>

          <div className="bg-gray-100 border border-gray-200 rounded-2xl p-6 space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-gray-500 block mb-1">Statutory Backup Withholding Rate (%)</label>
                <input
                  type="number"
                  value={withholdingRate}
                  onChange={(e) => setWithholdingRate(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-gray-900 font-mono"
                />
              </div>
              <div>
                <label className="text-gray-500 block mb-1">IRS TIN Matching Gateway Status</label>
                <div className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-green-600 font-mono flex items-center justify-between">
                  <span>{tinVerificationStatus}</span>
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>
            </div>

            {irsSaveMsg && (
              <div className="p-3 bg-green-100 border border-emerald-500/20 text-green-600 rounded-xl">
                {irsSaveMsg}
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                onClick={() => {
                  setIrsSaveMsg('IRS tax compliance parameters synchronized with banking ledger.')
                  setTimeout(() => setIrsSaveMsg(null), 3000)
                }}
                className="px-4 py-2 bg-[#D71E28] text-gray-900 font-bold rounded-xl"
              >
                Save Compliance Parameters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 23. Membership (?id=23) */}
      {activeModuleId === '23' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
              <Crown className="w-5 h-5 text-amber-600" />
              <span>VIP Tier & Membership Governance (?id=23)</span>
            </h2>
            <p className="text-xs text-gray-500">
              Tier threshold definitions, interest rate boosts, and dedicated desk allocations.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { tier: 'STANDARD', min: '$0', boost: '0.00%', fee: '$0/mo', color: 'text-gray-500' },
              { tier: 'GOLD', min: '$25,000', boost: '+0.25%', fee: '$49/mo', color: 'text-amber-600' },
              { tier: 'PLATINUM', min: '$100,000', boost: '+0.60%', fee: '$149/mo', color: 'text-[#D71E28]' },
              { tier: 'SOVEREIGN', min: '$1,000,000', boost: '+1.40%', fee: 'Bespoke', color: 'text-purple-600' },
            ].map((m) => (
              <div key={m.tier} className="bg-gray-100 border border-gray-200 rounded-2xl p-5 space-y-2">
                <span className={`text-xs font-bold ${m.color}`}>{m.tier}</span>
                <div className="text-xs text-gray-500 space-y-1">
                  <div>Min Balance: <strong className="text-gray-900 font-mono">{m.min}</strong></div>
                  <div>APY Boost: <strong className="text-green-600 font-mono">{m.boost}</strong></div>
                  <div>Maintenance: <strong className="text-gray-900">{m.fee}</strong></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Grant Creation Modal */}
      {showGrantModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-gray-100 border border-gray-200 rounded-3xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-base font-bold text-gray-900">Disburse Institutional Grant</h3>
            <form onSubmit={handleGrantSubmit} className="space-y-3 text-xs">
              <div>
                <label className="text-gray-500 block mb-1">Grant Title / Initiative</label>
                <input
                  type="text"
                  required
                  value={grantTitle}
                  onChange={(e) => setGrantTitle(e.target.value)}
                  placeholder="e.g. Q3 High-Net-Worth Founder Allocation"
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-gray-900"
                />
              </div>
              <div>
                <label className="text-gray-500 block mb-1">Recipient Client Email</label>
                <input
                  type="email"
                  required
                  value={grantRecipient}
                  onChange={(e) => setGrantRecipient(e.target.value)}
                  placeholder="e.g. guruogle89@gmail.com"
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-gray-900 font-mono"
                />
              </div>
              <div>
                <label className="text-gray-500 block mb-1">Grant Amount (USD)</label>
                <input
                  type="number"
                  required
                  value={grantAmount}
                  onChange={(e) => setGrantAmount(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-gray-900 font-mono"
                />
              </div>
              <div>
                <label className="text-gray-500 block mb-1">Category</label>
                <select
                  value={grantCategory}
                  onChange={(e) => setGrantCategory(e.target.value as any)}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-gray-900"
                >
                  <option value="INNOVATION">INNOVATION</option>
                  <option value="TREASURY_BONUS">TREASURY BONUS</option>
                  <option value="FOUNDER_CREDIT">FOUNDER CREDIT</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowGrantModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-900 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-400 text-gray-900 font-bold rounded-xl"
                >
                  Confirm Ledger Disbursement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Simulate Inbound Deposit Modal */}
      {showNewDepositModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-gray-100 border border-gray-200 rounded-3xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-base font-bold text-gray-900">Simulate Inbound Client Deposit</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-gray-500 block mb-1">Client Email</label>
                <input
                  type="email"
                  value={depUserEmail}
                  onChange={(e) => setDepUserEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-gray-900 font-mono"
                />
              </div>
              <div>
                <label className="text-gray-500 block mb-1">Deposit Amount (USD)</label>
                <input
                  type="number"
                  value={depAmount}
                  onChange={(e) => setDepAmount(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-gray-900 font-mono"
                />
              </div>
              <div>
                <label className="text-gray-500 block mb-1">Payment Method</label>
                <select
                  value={depMethod}
                  onChange={(e) => setDepMethod(e.target.value as any)}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-gray-900"
                >
                  <option value="WIRE">WIRE TRANSFER</option>
                  <option value="ACH">ACH CLEARING</option>
                  <option value="CRYPTO_BTC">BITCOIN (BTC)</option>
                  <option value="CRYPTO_USDT">USDT (TRC-20)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-200">
                <button
                  onClick={() => setShowNewDepositModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-900 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    deposits.unshift({
                      id: `dep_${Date.now()}`,
                      userId: 'usr_101',
                      userEmail: depUserEmail,
                      userName: 'Paulo Gla',
                      amount: parseFloat(depAmount) || 1000,
                      currency: 'USD',
                      method: depMethod,
                      status: 'PENDING',
                      reference: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
                      createdAt: new Date().toISOString(),
                    })
                    setShowNewDepositModal(false)
                  }}
                  className="px-4 py-2 bg-emerald-500 text-gray-900 font-bold rounded-xl"
                >
                  Queue Pending Deposit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
