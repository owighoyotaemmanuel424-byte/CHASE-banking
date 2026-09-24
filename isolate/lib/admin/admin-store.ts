/**
 * Crestline Capital - Admin Centralized Data Store & State Engine
 *
 * Provides typed data, ledger-backed mutations, and complete synchronization
 * across all 37 Admin Console modules as defined in the specification.
 */

import { ledgerEngine } from '@/lib/ledger/ledger-engine'
import { auditLogger } from '@/lib/audit/audit-logger'

export interface AdminUserRecord {
  id: string
  email: string
  name: string
  phone: string
  status: 'ACTIVE' | 'BLOCKED' | 'SUSPENDED'
  kycStatus: 'VERIFIED' | 'UNVERIFIED' | 'PENDING' | 'REJECTED'
  joinedDate: string // DD/MM/YYYY format as in spec
  accountNumber: string
  routingNumber: string
  balance: number
  tier: 'STANDARD' | 'GOLD' | 'PLATINUM' | 'PRIVATE_WEALTH' | 'SOVEREIGN'
  notes?: string
}

export interface AdminDepositItem {
  id: string
  userId: string
  userEmail: string
  userName: string
  amount: number
  currency: string
  method: 'WIRE' | 'ACH' | 'CRYPTO_BTC' | 'CRYPTO_USDT' | 'CHECK'
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  reference: string
  receiptUrl?: string
  createdAt: string
  reviewNotes?: string
}

export interface AdminWithdrawalItem {
  id: string
  userId: string
  userEmail: string
  userName: string
  amount: number
  currency: string
  destination: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'HOLD'
  riskScore: number
  reference: string
  createdAt: string
  reviewNotes?: string
}

export interface AdminTransferRecord {
  id: string
  senderEmail: string
  senderAccount: string
  recipientEmail: string
  recipientAccount: string
  amount: number
  currency: string
  reference: string
  status: 'COMPLETED' | 'PENDING' | 'FLAGGED' | 'REVERSED'
  ledgerJournalId: string
  createdAt: string
}

export interface AdminKYCCase {
  id: string
  userId: string
  userEmail: string
  userName: string
  documentType: 'PASSPORT' | 'DRIVERS_LICENSE' | 'NATIONAL_ID'
  documentNumber: string
  country: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'RESUBMISSION_REQUESTED'
  submittedAt: string
  reviewedAt?: string
  reviewer?: string
  notes?: string
}

export interface AdminLead {
  id: string
  name: string
  email: string
  phone: string
  source: 'WEB_SIGNUP' | 'INSTITUTIONAL_REFERRAL' | 'PRIVATE_DESK' | 'CAMPAIGN'
  stage: 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'DILIGENCE' | 'CONVERTED' | 'DISQUALIFIED'
  assignedAgent: string
  notes: string
  createdAt: string
}

export interface AdminTask {
  id: string
  title: string
  description: string
  assignedTo: string
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'
  status: 'TODO' | 'IN_PROGRESS' | 'RESOLVED'
  dueDate: string
  createdAt: string
}

export interface AdminReferral {
  id: string
  referrerEmail: string
  refereeEmail: string
  code: string
  rewardAmount: number
  status: 'PAID' | 'PENDING' | 'LOCKED'
  date: string
}

export interface AdminCardItem {
  id: string
  userEmail: string
  holderName: string
  maskedPan: string
  type: 'VIRTUAL' | 'PHYSICAL'
  status: 'ACTIVE' | 'FROZEN' | 'TERMINATED'
  spendingLimitMonthly: number
  spentThisMonth: number
  dailyAtmLimit: number
  expiry: string
}

export interface AdminLoanApplication {
  id: string
  userEmail: string
  applicantName: string
  principal: number
  apr: number
  termMonths: number
  monthlyPayment: number
  status: 'PENDING' | 'UNDERWRITING' | 'APPROVED' | 'REJECTED' | 'DISBURSED'
  creditScore: number
  purpose: string
  createdAt: string
}

export interface AdminGrant {
  id: string
  title: string
  recipientEmail: string
  amount: number
  currency: string
  category: 'INNOVATION' | 'TREASURY_BONUS' | 'FOUNDER_CREDIT'
  status: 'ISSUED' | 'PENDING' | 'EXPIRED'
  issuedAt: string
}

export interface AdminPlan {
  id: string
  name: string
  description: string
  apyPercent: number
  termDays: number
  minDeposit: number
  maxDeposit: number
  activeSubscribers: number
  status: 'ACTIVE' | 'PAUSED'
}

export interface AdminCryptoAsset {
  symbol: string
  name: string
  network: string
  depositAddress: string
  hotWalletBalance: number
  coldWalletReserve: number
  status: 'ACTIVE' | 'MAINTENANCE'
}

export interface AdminSignal {
  id: string
  asset: string
  type: 'BUY' | 'SELL'
  entryPrice: number
  stopLoss: number
  targetPrice: number
  timeframe: string
  status: 'ACTIVE' | 'HIT_TARGET' | 'STOPPED_OUT'
  publishedAt: string
}

export interface AdminTicket {
  id: string
  ticketNumber: string
  userEmail: string
  subject: string
  category: 'ACCOUNTS' | 'TRANSFERS' | 'CARDS' | 'COMPLIANCE' | 'TECHNICAL'
  priority: 'HIGH' | 'MEDIUM' | 'LOW'
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED'
  assignedAgent: string
  createdAt: string
  lastUpdate: string
  messages: Array<{
    sender: string
    isStaff: boolean
    message: string
    timestamp: string
  }>
}

export interface AdminAgent {
  id: string
  name: string
  email: string
  role: string
  status: 'ACTIVE' | 'INACTIVE'
  lastActive: string
}

export interface AdminTestimonial {
  id: string
  author: string
  company: string
  role: string
  content: string
  rating: number
  published: boolean
  date: string
}

export interface AdminCurrency {
  code: string
  name: string
  symbol: string
  rateAgainstUSD: number
  enabled: boolean
  lastUpdated: string
}

// Initial Live Roster Snapshot as explicitly dictated by the PDF specification:
const INITIAL_USERS: AdminUserRecord[] = [
  {
    id: 'usr_101',
    email: 'paulogla61@gmail.com',
    name: 'Paulo Gla',
    phone: '+1 (555) 234-8901',
    status: 'ACTIVE',
    kycStatus: 'VERIFIED',
    joinedDate: '17/08/2026',
    accountNumber: '•••• 8912',
    routingNumber: '026009593',
    balance: 0,
    tier: 'PLATINUM',
  },
  {
    id: 'usr_102',
    email: 'mikev4469@gmail.com',
    name: 'Mike Vance',
    phone: '+1 (555) 345-9012',
    status: 'ACTIVE',
    kycStatus: 'VERIFIED',
    joinedDate: '17/08/2026',
    accountNumber: '•••• 4469',
    routingNumber: '026009593',
    balance: 0,
    tier: 'GOLD',
  },
  {
    id: 'usr_103',
    email: 'guruogle89@gmail.com',
    name: 'Guru Ogle',
    phone: '+1 (555) 456-0123',
    status: 'ACTIVE',
    kycStatus: 'VERIFIED',
    joinedDate: '10/08/2026',
    accountNumber: '•••• 7821',
    routingNumber: '026009593',
    balance: 0,
    tier: 'PRIVATE_WEALTH',
  },
  {
    id: 'usr_104',
    email: 'johntaylor@gmail.com',
    name: 'John Taylor',
    phone: '+1 (555) 567-1234',
    status: 'ACTIVE',
    kycStatus: 'VERIFIED',
    joinedDate: '07/08/2026',
    accountNumber: '•••• 1984',
    routingNumber: '026009593',
    balance: 0,
    tier: 'STANDARD',
  },
  {
    id: 'usr_105',
    email: 'europee20@yahoo.com',
    name: 'Europee S.',
    phone: '+44 20 7946 0912',
    status: 'ACTIVE',
    kycStatus: 'UNVERIFIED',
    joinedDate: '03/08/2026',
    accountNumber: '•••• 5520',
    routingNumber: '026009593',
    balance: 0,
    tier: 'STANDARD',
  },
  {
    id: 'usr_106',
    email: 'dn4387801@gmail.com',
    name: 'David Novak',
    phone: '+1 (555) 678-2345',
    status: 'ACTIVE',
    kycStatus: 'VERIFIED',
    joinedDate: '02/08/2026',
    accountNumber: '•••• 8780',
    routingNumber: '026009593',
    balance: 0,
    tier: 'GOLD',
  },
]

class AdminStoreClass {
  public users: AdminUserRecord[] = [...INITIAL_USERS]
  public deposits: AdminDepositItem[] = []
  public withdrawals: AdminWithdrawalItem[] = []
  public transfers: AdminTransferRecord[] = []
  public kycCases: AdminKYCCase[] = [
    {
      id: 'kyc_case_1',
      userId: 'usr_105',
      userEmail: 'europee20@yahoo.com',
      userName: 'Europee S.',
      documentType: 'PASSPORT',
      documentNumber: 'GB8920194A',
      country: 'United Kingdom',
      status: 'PENDING',
      submittedAt: '2026-08-28T14:22:00Z',
      notes: 'Proof of address utility bill verified. Passport MRZ scan pending compliance sign-off.',
    },
    {
      id: 'kyc_case_2',
      userId: 'usr_101',
      userEmail: 'paulogla61@gmail.com',
      userName: 'Paulo Gla',
      documentType: 'DRIVERS_LICENSE',
      documentNumber: 'DL-NY-9910283',
      country: 'United States',
      status: 'APPROVED',
      submittedAt: '2026-08-16T10:00:00Z',
      reviewedAt: '2026-08-17T09:15:00Z',
      reviewer: 'Compliance Officer Davis',
      notes: 'Identity confirmed via automated biometric liveness and DMV record verification.',
    },
  ]
  public leads: AdminLead[] = [
    {
      id: 'lead_1',
      name: 'Alexander Sterling',
      email: 'asterling@sterlingcapital.com',
      phone: '+1 (212) 555-8900',
      source: 'INSTITUTIONAL_REFERRAL',
      stage: 'QUALIFIED',
      assignedAgent: 'Marcus Vance',
      notes: 'Family office looking for $25M liquidity sweep and treasury yield account.',
      createdAt: '2026-08-29',
    },
    {
      id: 'lead_2',
      name: 'Elena Rostova',
      email: 'e.rostova@genevafunds.ch',
      phone: '+41 22 819 4000',
      source: 'PRIVATE_DESK',
      stage: 'DILIGENCE',
      assignedAgent: 'Sarah Chen',
      notes: 'Cross-border multi-currency trade financing inquiry.',
      createdAt: '2026-08-28',
    },
  ]
  public tasks: AdminTask[] = [
    {
      id: 'tsk_1',
      title: 'Quarterly Federal Reserve BSA/AML Audit Dossier',
      description: 'Compile high-value wire transfers > $50,000 for Q3 compliance filing.',
      assignedTo: 'Compliance Officer Davis',
      priority: 'CRITICAL',
      status: 'IN_PROGRESS',
      dueDate: '2026-09-05',
      createdAt: '2026-08-25',
    },
    {
      id: 'tsk_2',
      title: 'Review High-Yield Vault Smart Contract Reserves',
      description: 'Audit Fireblocks custody cold wallet balances vs ledger equity.',
      assignedTo: 'Institutional Operations',
      priority: 'HIGH',
      status: 'TODO',
      dueDate: '2026-09-02',
      createdAt: '2026-08-27',
    },
  ]
  public referrals: AdminReferral[] = [
    {
      id: 'ref_1',
      referrerEmail: 'guruogle89@gmail.com',
      refereeEmail: 'paulogla61@gmail.com',
      code: 'GURU-VIP',
      rewardAmount: 250,
      status: 'PAID',
      date: '17/08/2026',
    },
    {
      id: 'ref_2',
      referrerEmail: 'mikev4469@gmail.com',
      refereeEmail: 'europee20@yahoo.com',
      code: 'MIKE-CUST',
      rewardAmount: 100,
      status: 'PENDING',
      date: '03/08/2026',
    },
  ]
  public cards: AdminCardItem[] = [
    {
      id: 'crd_1',
      userEmail: 'paulogla61@gmail.com',
      holderName: 'Paulo Gla',
      maskedPan: '•••• •••• •••• 4018',
      type: 'PHYSICAL',
      status: 'ACTIVE',
      spendingLimitMonthly: 25000,
      spentThisMonth: 3420,
      dailyAtmLimit: 2500,
      expiry: '09/29',
    },
    {
      id: 'crd_2',
      userEmail: 'mikev4469@gmail.com',
      holderName: 'Mike Vance',
      maskedPan: '•••• •••• •••• 7192',
      type: 'VIRTUAL',
      status: 'ACTIVE',
      spendingLimitMonthly: 10000,
      spentThisMonth: 1250,
      dailyAtmLimit: 1000,
      expiry: '12/28',
    },
    {
      id: 'crd_3',
      userEmail: 'europee20@yahoo.com',
      holderName: 'Europee S.',
      maskedPan: '•••• •••• •••• 8812',
      type: 'VIRTUAL',
      status: 'FROZEN',
      spendingLimitMonthly: 5000,
      spentThisMonth: 0,
      dailyAtmLimit: 500,
      expiry: '04/27',
    },
  ]
  public loans: AdminLoanApplication[] = [
    {
      id: 'ln_1',
      userEmail: 'johntaylor@gmail.com',
      applicantName: 'John Taylor',
      principal: 75000,
      apr: 5.85,
      termMonths: 36,
      monthlyPayment: 2276.5,
      status: 'UNDERWRITING',
      creditScore: 785,
      purpose: 'Commercial Equipment Expansion',
      createdAt: '2026-08-26',
    },
    {
      id: 'ln_2',
      userEmail: 'dn4387801@gmail.com',
      applicantName: 'David Novak',
      principal: 150000,
      apr: 5.25,
      termMonths: 60,
      monthlyPayment: 2847.2,
      status: 'APPROVED',
      creditScore: 815,
      purpose: 'Real Estate Working Capital',
      createdAt: '2026-08-20',
    },
  ]
  public grants: AdminGrant[] = [
    {
      id: 'gr_1',
      title: 'Institutional FinTech Innovation Allocation',
      recipientEmail: 'guruogle89@gmail.com',
      amount: 0,
      currency: 'USD',
      category: 'INNOVATION',
      status: 'ISSUED',
      issuedAt: '2026-08-15',
    },
  ]
  public plans: AdminPlan[] = [
    {
      id: 'pln_1',
      name: 'High-Yield Liquidity Sweep (4.85% APY)',
      description: 'Daily compounding liquid deposit sweep with zero lockup period.',
      apyPercent: 4.85,
      termDays: 0,
      minDeposit: 1000,
      maxDeposit: 10000000,
      activeSubscribers: 142,
      status: 'ACTIVE',
    },
    {
      id: 'pln_2',
      name: 'Treasury 90-Day Fixed Term Note (5.40% APY)',
      description: 'Backed by short-duration US Treasuries with quarterly coupon redemption.',
      apyPercent: 5.4,
      termDays: 90,
      minDeposit: 25000,
      maxDeposit: 5000000,
      activeSubscribers: 64,
      status: 'ACTIVE',
    },
    {
      id: 'pln_3',
      name: 'Sovereign Arbitrage Vault (6.25% APY)',
      description: 'Delta-neutral cash-and-carry basis arbitrage with weekly liquidity.',
      apyPercent: 6.25,
      termDays: 180,
      minDeposit: 100000,
      maxDeposit: 25000000,
      activeSubscribers: 28,
      status: 'ACTIVE',
    },
  ]
  public cryptoAssets: AdminCryptoAsset[] = [
    {
      symbol: 'BTC',
      name: 'Bitcoin',
      network: 'Bitcoin Native',
      depositAddress: 'bc1q9crestline98institutionalledger9821',
      hotWalletBalance: 42.85,
      coldWalletReserve: 480.0,
      status: 'ACTIVE',
    },
    {
      symbol: 'ETH',
      name: 'Ethereum',
      network: 'ERC-20 Mainnet',
      depositAddress: '0x38bdf8CrestlineCapitalTreasuryVault01',
      hotWalletBalance: 610.4,
      coldWalletReserve: 5400.0,
      status: 'ACTIVE',
    },
    {
      symbol: 'USDT',
      name: 'Tether USD',
      network: 'TRC-20 & ERC-20',
      depositAddress: 'TXcrestlineTreasuryReserveInstitutional99',
      hotWalletBalance: 1250000,
      coldWalletReserve: 15000000,
      status: 'ACTIVE',
    },
  ]
  public signals: AdminSignal[] = [
    {
      id: 'sig_1',
      asset: 'BTC/USD',
      type: 'BUY',
      entryPrice: 64200,
      stopLoss: 62800,
      targetPrice: 68500,
      timeframe: '4H Swing',
      status: 'ACTIVE',
      publishedAt: '2026-08-30 08:30 UTC',
    },
    {
      id: 'sig_2',
      asset: 'EUR/USD',
      type: 'BUY',
      entryPrice: 1.092,
      stopLoss: 1.087,
      targetPrice: 1.105,
      timeframe: '1D Macro',
      status: 'ACTIVE',
      publishedAt: '2026-08-29 12:00 UTC',
    },
  ]
  public tickets: AdminTicket[] = [
    {
      id: 'tkt_101',
      ticketNumber: 'TK-8941',
      userEmail: 'europee20@yahoo.com',
      subject: 'Inquiry regarding UK wire routing & SWIFT turnaround',
      category: 'TRANSFERS',
      priority: 'MEDIUM',
      status: 'OPEN',
      assignedAgent: 'Marcus Vance',
      createdAt: '2026-08-29 16:40',
      lastUpdate: '2026-08-29 17:10',
      messages: [
        {
          sender: 'europee20@yahoo.com',
          isStaff: false,
          message: 'Hello, what is the expected settlement window for inbound GBP CHAPS/SWIFT wires into my Crestline Capital USD checking pool?',
          timestamp: '16:40',
        },
        {
          sender: 'Marcus Vance',
          isStaff: true,
          message: 'Good day. Standard SWIFT GPI transfers clear same business day before 14:00 UTC. We have flagged your account for priority queueing.',
          timestamp: '17:10',
        },
      ],
    },
    {
      id: 'tkt_102',
      ticketNumber: 'TK-8890',
      userEmail: 'mikev4469@gmail.com',
      subject: 'Commercial Visa Card Limit Elevation Request',
      category: 'CARDS',
      priority: 'HIGH',
      status: 'RESOLVED',
      assignedAgent: 'Sarah Chen',
      createdAt: '2026-08-27 11:20',
      lastUpdate: '2026-08-27 14:45',
      messages: [
        {
          sender: 'mikev4469@gmail.com',
          isStaff: false,
          message: 'Requesting temporary monthly spending limit expansion to $20,000 for travel reservations.',
          timestamp: '11:20',
        },
        {
          sender: 'Sarah Chen',
          isStaff: true,
          message: 'Approved and adjusted in issuer core. Limit active through next billing cycle.',
          timestamp: '14:45',
        },
      ],
    },
  ]
  public agents: AdminAgent[] = [
    {
      id: 'ag_super',
      name: 'Primary Administrator',
      email: 'admin@crestlinecapital.internal',
      role: 'SUPER_ADMIN',
      status: 'ACTIVE',
      lastActive: 'Online now',
    },
    {
      id: 'ag_1',
      name: 'Marcus Vance',
      email: 'm.vance@crestlinecapital.internal',
      role: 'BANK_ADMIN',
      status: 'ACTIVE',
      lastActive: 'Just now',
    },
    {
      id: 'ag_2',
      name: 'Sarah Chen',
      email: 's.chen@crestlinecapital.internal',
      role: 'COMPLIANCE_OFFICER',
      status: 'ACTIVE',
      lastActive: '12 mins ago',
    },
    {
      id: 'ag_3',
      name: 'Robert Davis',
      email: 'r.davis@crestlinecapital.internal',
      role: 'LOAN_OFFICER',
      status: 'ACTIVE',
      lastActive: '1 hour ago',
    },
    {
      id: 'ag_4',
      name: 'Elena Rostova',
      email: 'e.rostova@crestlinecapital.internal',
      role: 'AUDITOR',
      status: 'ACTIVE',
      lastActive: 'Yesterday',
    },
  ]
  public testimonials: AdminTestimonial[] = [
    {
      id: 'tstm_1',
      author: 'David Sterling',
      company: 'Apex Global Ventures',
      role: 'Managing Partner',
      content: 'Crestline Capital has transformed our institutional cash management. The double-entry transparency and 4.85% APY treasury sweeps are best-in-class.',
      rating: 5,
      published: true,
      date: '2026-08-18',
    },
    {
      id: 'tstm_2',
      author: 'Caroline Dupont',
      company: 'Geneva BioTech Capital',
      role: 'Chief Financial Officer',
      content: 'Seamless multi-currency settlement and instant Fedwire execution. Their compliance and support desks operate with surgical precision.',
      rating: 5,
      published: true,
      date: '2026-08-22',
    },
  ]
  public currencies: AdminCurrency[] = [
    { code: 'USD', name: 'US Dollar (Base)', symbol: '$', rateAgainstUSD: 1.0, enabled: true, lastUpdated: 'Real-Time' },
    { code: 'EUR', name: 'Euro', symbol: '€', rateAgainstUSD: 1.092, enabled: true, lastUpdated: '2026-08-30' },
    { code: 'GBP', name: 'British Pound', symbol: '£', rateAgainstUSD: 1.305, enabled: true, lastUpdated: '2026-08-30' },
    { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', rateAgainstUSD: 1.178, enabled: true, lastUpdated: '2026-08-30' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥', rateAgainstUSD: 0.0068, enabled: true, lastUpdated: '2026-08-30' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'CA$', rateAgainstUSD: 0.738, enabled: true, lastUpdated: '2026-08-30' },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'AU$', rateAgainstUSD: 0.672, enabled: true, lastUpdated: '2026-08-30' },
  ]

  // Master System Configuration State
  public siteSettings = {
    siteName: 'Crestline Capital',
    environment: 'Production Admin Console (v2.4)',
    systemDate: 'Sunday, August 30, 2026',
    maintenanceMode: false,
    mfaEnforced: true,
    sessionTimeoutMinutes: 480,
    maxLoginAttempts: 5,
    // SMTP Mail Service Provider & Delivery Transport
    smtpProvider: 'sendgrid' as 'custom' | 'sendgrid' | 'resend' | 'mailgun' | 'ses' | 'postmark' | 'gmail' | 'office365',
    smtpHost: 'smtp.sendgrid.net',
    smtpPort: 587,
    smtpEncryption: 'TLS' as 'TLS' | 'SSL' | 'STARTTLS' | 'NONE',
    smtpAuthEnabled: true,
    smtpUser: 'apikey',
    smtpPassword: '••••••••••••••••••••••••••••••••',
    smtpFrom: 'notifications@crestlinecapital.com',
    smtpFromName: 'Crestline Capital Security & Treasury',
    smtpReplyTo: 'compliance@crestlinecapital.com',
    smtpTimeoutSeconds: 15,
    // Automated Email Dispatch Matrix
    emailTriggers: {
      securityLoginAlerts: true,
      securityOtpVerification: true,
      passwordResetTokens: true,
      adminAuditEscalations: true,
      wireExecutionNotices: true,
      highValueDepositReceipts: true,
      kycStatusNotifications: true,
      cardAuthorizations: true,
    },
    corsOrigins: 'https://crestlinecapital.com',
    theme: {
      mode: 'dark' as 'dark' | 'light',
      accentColor: '#D71E28',
      density: 'comfortable' as 'compact' | 'comfortable' | 'spacious',
      borderRadius: 'rounded-xl',
    },
    irsCompliance: {
      withholdingTaxRatePercent: 24,
      requireW9BeforeWithdrawalAbove: 10000,
      fatcaReportingEnabled: true,
      tinValidationService: 'IRS TIN Matching Gateway (Connected)',
    },
  }

  // Double-Entry Ledger Backed Deposit Approval
  public approveDeposit(depositId: string, reviewer: string = 'Super Admin'): boolean {
    const deposit = this.deposits.find((d) => d.id === depositId)
    if (!deposit || deposit.status !== 'PENDING') return false

    // Commit double-entry ledger entry
    const amountCents = Math.round(deposit.amount * 100)
    const journal = ledgerEngine.commitTransaction({
      idempotencyKey: `adm_dep_appr_${depositId}`,
      reference: `DEP-APP-${deposit.reference}`,
      description: `Admin approved deposit: ${deposit.userEmail} via ${deposit.method}`,
      entries: [
        {
          accountCode: '1000-CASH', // Asset (Vault Cash / Clearing) increases via DEBIT
          type: 'DEBIT',
          amountCents,
          memo: `Clearing funds for ${deposit.userEmail}`,
        },
        {
          accountCode: '2000-DEP-CUST', // Liability (Customer Deposit Account) increases via CREDIT
          type: 'CREDIT',
          amountCents,
          memo: `Customer credited ${deposit.currency} ${deposit.amount}`,
        },
      ],
      metadata: { depositId, reviewer, userEmail: deposit.userEmail },
    })

    deposit.status = 'APPROVED'
    deposit.reviewNotes = `Approved by ${reviewer}. Ledger Journal: ${journal.id}`

    // Update user balance
    const user = this.users.find((u) => u.id === deposit.userId || u.email === deposit.userEmail)
    if (user) {
      user.balance += deposit.amount
    }

    auditLogger.log({
      actorId: reviewer,
      actorRole: 'SUPER_ADMIN',
      action: 'DEPOSIT_APPROVAL_LEDGER_COMMITTED',
      targetResource: 'DEPOSIT',
      targetId: depositId,
      status: 'SUCCESS',
      details: { amount: deposit.amount, currency: deposit.currency, journalId: journal.id },
    })

    return true
  }

  // Double-Entry Ledger Backed Withdrawal Approval
  public approveWithdrawal(withdrawalId: string, reviewer: string = 'Super Admin'): boolean {
    const withdrawal = this.withdrawals.find((w) => w.id === withdrawalId)
    if (!withdrawal || withdrawal.status !== 'PENDING') return false

    const amountCents = Math.round(withdrawal.amount * 100)
    const journal = ledgerEngine.commitTransaction({
      idempotencyKey: `adm_wth_appr_${withdrawalId}`,
      reference: `WTH-APP-${withdrawal.reference}`,
      description: `Admin approved payout: ${withdrawal.userEmail} to ${withdrawal.destination}`,
      entries: [
        {
          accountCode: '2000-DEP-CUST', // Liability decreases via DEBIT
          type: 'DEBIT',
          amountCents,
          memo: `Customer payout debit ${withdrawal.currency} ${withdrawal.amount}`,
        },
        {
          accountCode: '1000-CASH', // Asset decreases via CREDIT
          type: 'CREDIT',
          amountCents,
          memo: `Vault disbursement to ${withdrawal.destination}`,
        },
      ],
      metadata: { withdrawalId, reviewer, destination: withdrawal.destination },
    })

    withdrawal.status = 'APPROVED'
    withdrawal.reviewNotes = `Dispatched via wire/clearing. Ledger Journal: ${journal.id}`

    const user = this.users.find((u) => u.id === withdrawal.userId || u.email === withdrawal.userEmail)
    if (user) {
      user.balance = Math.max(0, user.balance - withdrawal.amount)
    }

    auditLogger.log({
      actorId: reviewer,
      actorRole: 'SUPER_ADMIN',
      action: 'WITHDRAWAL_APPROVAL_LEDGER_COMMITTED',
      targetResource: 'WITHDRAWAL',
      targetId: withdrawalId,
      status: 'SUCCESS',
      details: { amount: withdrawal.amount, destination: withdrawal.destination, journalId: journal.id },
    })

    return true
  }

  // Create or add a user
  public addUser(user: Omit<AdminUserRecord, 'id' | 'joinedDate'>): AdminUserRecord {
    const newUser: AdminUserRecord = {
      ...user,
      id: `usr_${Date.now()}`,
      joinedDate: '30/08/2026',
    }
    this.users.unshift(newUser)

    auditLogger.log({
      actorId: 'admin',
      actorRole: 'SUPER_ADMIN',
      action: 'USER_CREATED_BY_ADMIN',
      targetResource: 'USER',
      targetId: newUser.id,
      status: 'SUCCESS',
      details: { email: newUser.email, name: newUser.name },
    })

    return newUser
  }

  // Toggle user block/active
  public toggleUserBlock(userId: string): boolean {
    const user = this.users.find((u) => u.id === userId)
    if (!user) return false

    const oldStatus = user.status
    user.status = user.status === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE'

    auditLogger.log({
      actorId: 'admin',
      actorRole: 'SUPER_ADMIN',
      action: user.status === 'BLOCKED' ? 'USER_ACCOUNT_BLOCKED' : 'USER_ACCOUNT_UNBLOCKED',
      targetResource: 'USER',
      targetId: userId,
      status: 'SUCCESS',
      details: { previous: oldStatus, current: user.status, email: user.email },
    })

    return true
  }

  // Approve KYC
  public approveKYC(caseId: string, reviewer: string = 'Compliance Officer'): boolean {
    const c = this.kycCases.find((k) => k.id === caseId)
    if (!c) return false

    c.status = 'APPROVED'
    c.reviewedAt = new Date().toISOString()
    c.reviewer = reviewer

    const user = this.users.find((u) => u.id === c.userId || u.email === c.userEmail)
    if (user) {
      user.kycStatus = 'VERIFIED'
    }

    auditLogger.log({
      actorId: reviewer,
      actorRole: 'COMPLIANCE_OFFICER',
      action: 'KYC_CASE_APPROVED',
      targetResource: 'KYC_CASE',
      targetId: caseId,
      status: 'SUCCESS',
      details: { userEmail: c.userEmail, documentType: c.documentType },
    })

    return true
  }

  // Reject KYC
  public rejectKYC(caseId: string, reason: string, reviewer: string = 'Compliance Officer'): boolean {
    const c = this.kycCases.find((k) => k.id === caseId)
    if (!c) return false

    c.status = 'REJECTED'
    c.reviewedAt = new Date().toISOString()
    c.reviewer = reviewer
    c.notes = `Rejected: ${reason}`

    const user = this.users.find((u) => u.id === c.userId || u.email === c.userEmail)
    if (user) {
      user.kycStatus = 'REJECTED'
    }

    auditLogger.log({
      actorId: reviewer,
      actorRole: 'COMPLIANCE_OFFICER',
      action: 'KYC_CASE_REJECTED',
      targetResource: 'KYC_CASE',
      targetId: caseId,
      status: 'SUCCESS',
      details: { userEmail: c.userEmail, reason },
    })

    return true
  }

  // Issue Grant
  public issueGrant(title: string, recipientEmail: string, amount: number, category: any): boolean {
    const grant: AdminGrant = {
      id: `gr_${Date.now()}`,
      title,
      recipientEmail,
      amount,
      currency: 'USD',
      category,
      status: 'ISSUED',
      issuedAt: '30/08/2026',
    }
    this.grants.unshift(grant)

    // Ledger entry for grant
    const amountCents = Math.round(amount * 100)
    ledgerEngine.commitTransaction({
      idempotencyKey: `grant_${grant.id}`,
      reference: `GRANT-${grant.id}`,
      description: `Institutional Grant: ${title} to ${recipientEmail}`,
      entries: [
        {
          accountCode: '5000-OPERATING-EXP', // Operating expense debit
          type: 'DEBIT',
          amountCents,
          memo: `Institutional grant payout`,
        },
        {
          accountCode: '2000-DEP-CUST', // Customer account credit
          type: 'CREDIT',
          amountCents,
          memo: `Grant disbursement`,
        },
      ],
      metadata: { grantId: grant.id, recipientEmail },
    })

    const user = this.users.find((u) => u.email === recipientEmail)
    if (user) {
      user.balance += amount
    }

    auditLogger.log({
      actorId: 'admin',
      actorRole: 'SUPER_ADMIN',
      action: 'PROMOTIONAL_GRANT_ISSUED',
      targetResource: 'GRANT',
      targetId: grant.id,
      status: 'SUCCESS',
      details: { amount, recipientEmail },
    })

    return true
  }
}

// Global Singleton Store
export const adminStore = new AdminStoreClass()
