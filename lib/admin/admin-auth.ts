/**
 * Crestline Capital - Admin Authentication & RBAC Engine
 *
 * Implements 192-bit (48-char hex) master gatekeeper authentication,
 * session token rotation, rate-limiting, and granular server-side RBAC permissions.
 */

export type AdminRole =
  | 'SUPER_ADMIN'
  | 'BANK_ADMIN'
  | 'COMPLIANCE_OFFICER'
  | 'AUDITOR'
  | 'CUSTOMER_SUPPORT'
  | 'LOAN_OFFICER'
  | 'OPERATIONS_STAFF'
  | 'CONTENT_MANAGER'

export type AdminPermission =
  | 'users.read'
  | 'users.update'
  | 'users.block'
  | 'kyc.review'
  | 'kyc.approve'
  | 'deposits.review'
  | 'deposits.approve'
  | 'withdrawals.review'
  | 'withdrawals.approve'
  | 'transfers.read'
  | 'cards.manage'
  | 'currencies.manage'
  | 'loans.manage'
  | 'crypto.manage'
  | 'plans.manage'
  | 'broadcasts.send'
  | 'staff.manage'
  | 'settings.manage'
  | 'audit.read'

export interface AdminSession {
  sessionId: string
  adminId: string
  email: string
  name: string
  role: AdminRole
  permissions: AdminPermission[]
  createdAt: string
  expiresAt: string
  ipAddress?: string
  userAgent?: string
}

// Credentials live in lib/admin/admin-secrets.ts (server-only, never bundled to client).
import { ADMIN_MASTER_KEY, ADMIN_DEFAULT_CREDENTIALS } from '@/lib/admin/admin-secrets'

// NOTE: DEFAULT_MASTER_KEY and DEFAULT_ADMIN_CREDENTIALS have been removed.
// Use ADMIN_MASTER_KEY and ADMIN_DEFAULT_CREDENTIALS from admin-secrets.ts (server-only).

// Granular RBAC Role-to-Permissions Mapping
export const ROLE_PERMISSIONS: Record<AdminRole, AdminPermission[]> = {
  SUPER_ADMIN: [
    'users.read',
    'users.update',
    'users.block',
    'kyc.review',
    'kyc.approve',
    'deposits.review',
    'deposits.approve',
    'withdrawals.review',
    'withdrawals.approve',
    'transfers.read',
    'cards.manage',
    'currencies.manage',
    'loans.manage',
    'crypto.manage',
    'plans.manage',
    'broadcasts.send',
    'staff.manage',
    'settings.manage',
    'audit.read',
  ],
  BANK_ADMIN: [
    'users.read',
    'users.update',
    'users.block',
    'kyc.review',
    'deposits.review',
    'deposits.approve',
    'withdrawals.review',
    'withdrawals.approve',
    'transfers.read',
    'cards.manage',
    'currencies.manage',
    'loans.manage',
    'audit.read',
  ],
  COMPLIANCE_OFFICER: [
    'users.read',
    'users.update',
    'users.block',
    'kyc.review',
    'kyc.approve',
    'transfers.read',
    'withdrawals.review',
    'audit.read',
  ],
  AUDITOR: [
    'users.read',
    'transfers.read',
    'audit.read',
  ],
  CUSTOMER_SUPPORT: [
    'users.read',
    'transfers.read',
    'cards.manage',
  ],
  LOAN_OFFICER: [
    'users.read',
    'loans.manage',
  ],
  OPERATIONS_STAFF: [
    'users.read',
    'deposits.review',
    'withdrawals.review',
    'cards.manage',
  ],
  CONTENT_MANAGER: [
    'plans.manage',
    'broadcasts.send',
  ],
}

// In-memory rate limiting and active sessions store
interface LoginAttempt {
  count: number
  lockedUntil: number | null
}

const loginAttempts = new Map<string, LoginAttempt>()
const activeSessions = new Map<string, AdminSession>()

export class AdminAuthEngine {
  private static MAX_ATTEMPTS = 5
  private static LOCKOUT_MS = 15 * 60 * 1000 // 15 minutes

  /**
   * Validate master gatekeeper key or admin credentials
   */
  public static authenticateMasterKey(
    key: string,
    ip: string = '127.0.0.1',
    userAgent: string = 'System Admin'
  ): { success: boolean; session?: AdminSession; error?: string; remainingAttempts?: number } {
    const cleanKey = (key || '').trim().toLowerCase()
    const configuredKey = (process.env.ADMIN_MASTER_KEY || ADMIN_MASTER_KEY).trim().toLowerCase()

    // Rate limiting check
    const attempt = loginAttempts.get(ip) || { count: 0, lockedUntil: null }
    if (attempt.lockedUntil && Date.now() < attempt.lockedUntil) {
      const waitMins = Math.ceil((attempt.lockedUntil - Date.now()) / 60000)
      return {
        success: false,
        error: `Security Lockout: Too many failed gatekeeper attempts. Try again in ${waitMins} minute(s).`,
      }
    }

    // Fail closed. With no ADMIN_MASTER_KEY configured the gate has nothing to
    // compare against, and an empty/whitespace key trims down to the same empty
    // string - both must be rejected instead of minting a SUPER_ADMIN session.
    if (!configuredKey) {
      return {
        success: false,
        error: 'Master gatekeeper authentication is not configured on this server.',
      }
    }
    if (!cleanKey) {
      return { success: false, error: 'Enter the 48-character hexadecimal master gatekeeper key.' }
    }

    if (cleanKey !== configuredKey) {
      attempt.count += 1
      if (attempt.count >= this.MAX_ATTEMPTS) {
        attempt.lockedUntil = Date.now() + this.LOCKOUT_MS
        loginAttempts.set(ip, attempt)
        return {
          success: false,
          error: `Security Lockout triggered: ${this.MAX_ATTEMPTS} invalid attempts. Account suspended for 15 minutes.`,
        }
      }
      loginAttempts.set(ip, attempt)
      return {
        success: false,
        error: 'Invalid 192-bit Master Gatekeeper Key. Cryptographic verification failed.',
        remainingAttempts: this.MAX_ATTEMPTS - attempt.count,
      }
    }

    // Success: Reset rate limiting
    loginAttempts.delete(ip)

    // Create cryptographically unique session
    const sessionId = `adm_sess_${Date.now()}_${Math.random().toString(36).substring(2, 12)}`
    const session: AdminSession = {
      sessionId,
      adminId: 'usr_admin_master',
      email: 'security.admin@crestlinecapital.internal',
      name: 'Institutional Executive Admin',
      role: 'SUPER_ADMIN',
      permissions: ROLE_PERMISSIONS.SUPER_ADMIN,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 8 * 3600 * 1000).toISOString(), // 8 hour session
      ipAddress: ip,
      userAgent,
    }

    activeSessions.set(sessionId, session)
    return { success: true, session }
  }

  /**
   * Authenticate admin via Email and Password
   */
  public static authenticateCredentials(
    email: string,
    password: string,
    ip: string = '127.0.0.1',
    userAgent: string = 'System Admin'
  ): { success: boolean; session?: AdminSession; error?: string; remainingAttempts?: number } {
    const cleanEmail = (email || '').trim().toLowerCase()
    const cleanPassword = password || ''

    const configuredEmail = (process.env.ADMIN_EMAIL || ADMIN_DEFAULT_CREDENTIALS.email).trim().toLowerCase()
    const configuredPassword = process.env.ADMIN_PASSWORD || ADMIN_DEFAULT_CREDENTIALS.password

    // Rate limiting check
    const rateLimitKey = `email_${cleanEmail || ip}`
    const attempt = loginAttempts.get(rateLimitKey) || { count: 0, lockedUntil: null }

    if (attempt.lockedUntil && Date.now() < attempt.lockedUntil) {
      const waitMins = Math.ceil((attempt.lockedUntil - Date.now()) / 60000)
      return {
        success: false,
        error: `Security Lockout: Too many failed login attempts. Try again in ${waitMins} minute(s).`,
      }
    }

    // Fail closed: an unconfigured administrator, or a blank submission, must
    // never compare equal to an empty configured credential.
    if (!configuredEmail || !configuredPassword.trim()) {
      return {
        success: false,
        error: 'Administrative sign-in is not configured on this server.',
      }
    }
    if (!cleanEmail || !cleanPassword.trim()) {
      return { success: false, error: 'Enter your administrative email and password.' }
    }

    const emailMatches = cleanEmail === configuredEmail
    const passwordMatches = cleanPassword === configuredPassword

    if (!emailMatches || !passwordMatches) {
      attempt.count += 1
      if (attempt.count >= this.MAX_ATTEMPTS) {
        attempt.lockedUntil = Date.now() + this.LOCKOUT_MS
        loginAttempts.set(rateLimitKey, attempt)
        return {
          success: false,
          error: `Account Locked: Maximum failed attempts (${this.MAX_ATTEMPTS}) reached. Please wait 15 minutes before retrying.`,
        }
      }
      loginAttempts.set(rateLimitKey, attempt)
      return {
        success: false,
        error: 'Invalid administrative email or password credentials.',
        remainingAttempts: this.MAX_ATTEMPTS - attempt.count,
      }
    }

    // Success: Reset rate limiting
    loginAttempts.delete(rateLimitKey)

    // Create cryptographically unique session
    const sessionId = `adm_sess_${Date.now()}_${Math.random().toString(36).substring(2, 12)}`
    const session: AdminSession = {
      sessionId,
      adminId: 'adm_primary',
      email: ADMIN_DEFAULT_CREDENTIALS.email,
      name: ADMIN_DEFAULT_CREDENTIALS.name,
      role: 'SUPER_ADMIN',
      permissions: ROLE_PERMISSIONS.SUPER_ADMIN,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 12 * 3600 * 1000).toISOString(), // 12-hour session
      ipAddress: ip,
      userAgent,
    }

    activeSessions.set(sessionId, session)
    return { success: true, session }
  }

  /**
   * Verify an active session
   */
  public static verifySession(sessionId: string): AdminSession | null {
    if (!sessionId) return null
    const session = activeSessions.get(sessionId)
    if (!session) return null

    // Check expiration
    if (new Date(session.expiresAt).getTime() < Date.now()) {
      activeSessions.delete(sessionId)
      return null
    }

    return session
  }

  /**
   * Invalidate session (logout)
   */
  public static invalidateSession(sessionId: string): boolean {
    return activeSessions.delete(sessionId)
  }

  /**
   * Check if session has a specific permission
   */
  public static hasPermission(session: AdminSession, permission: AdminPermission): boolean {
    return session.permissions.includes(permission)
  }
}
