/**
 * Customer authentication for the Crestline Capital online banking experience.
 *
 * Self-contained by design: the credential is compared against a salted PBKDF2
 * hash (lib/auth/password-utils) and the resulting session is an HMAC-signed,
 * httpOnly cookie. A customer identity is never read from a client-supplied
 * header or request body.
 *
 * The optional seeded demo account is test data. No real customer money moves
 * through it, and self-registered accounts live in this server process's memory
 * only — a production deployment must replace this store with a durable one.
 *
 * Configuration (all optional):
 *
 * Without CUSTOMER_DEMO_EMAIL no demo account is seeded — sign-in only works for
 * self-registered accounts. Set CUSTOMER_DEMO_EMAIL, CUSTOMER_DEMO_USERNAME and
 * CUSTOMER_DEMO_PASSWORD_HASH in Settings → Environment to enable a test account.
 *
 *   CUSTOMER_DEMO_EMAIL          seeded customer email
 *   CUSTOMER_DEMO_USERNAME       seeded customer sign-in name
 *   CUSTOMER_DEMO_PASSWORD_HASH  `salt.hash` for the seeded password
 *   CUSTOMER_SESSION_SECRET      secret used to sign session cookies
 *
 * Set CUSTOMER_SESSION_SECRET in production. The fallback below lives in source,
 * so anyone with the repository could forge a session cookie until it is set.
 */

import crypto from 'crypto'
import { cookies } from 'next/headers'
import type { NextRequest } from 'next/server'
import { hashPassword, validatePasswordStrength, verifyPassword } from '@/lib/auth/password-utils'

export const CUSTOMER_SESSION_COOKIE = 'crestline_customer_session'
/**
 * Header fallback for the session token.
 *
 * The hosted preview runs inside a cross-site iframe, where browsers drop or
 * withhold the SameSite cookie, so the same signed token is also accepted from
 * this header. The cookie stays the primary, httpOnly path.
 */
export const CUSTOMER_SESSION_HEADER = 'x-customer-session'
export const CUSTOMER_ROLE = 'customer' as const
export const CUSTOMER_SESSION_TTL_SECONDS = 12 * 60 * 60

const DEFAULT_DEMO_EMAIL = (process.env.CUSTOMER_DEMO_EMAIL || '').trim().toLowerCase()
const DEFAULT_DEMO_USERNAME = (process.env.CUSTOMER_DEMO_USERNAME || '').trim()
// PBKDF2 (`salt.hash`) of the seeded demo password, produced by hashPassword().
// Sourced from CUSTOMER_DEMO_PASSWORD_HASH when provided.
const DEFAULT_DEMO_PASSWORD_HASH =
  process.env.CUSTOMER_DEMO_PASSWORD_HASH ||
  '51adb8da54bb5171f603b965ab53cc6c.9f51c175c5f100793863fead5400c9ca7a9a1e748fcb49e6f90bfbe0831dc2c2'

/**
 * Reference identities for development environments. Seeded only when the
 * corresponding CUSTOMER_DEMO_EMAIL environment configuration is present; in
 * production none of these accounts exist.
 */
const DEMO_IDENTITIES = [
  {
    id: 'cust_demo_alex',
    name: 'Alex Morgan',
    email: 'alex.morgan@crestline.demo',
    username: 'Alex Morgan',
    passwordHash:
      '74d2c8774caf4abb4180f785e0342442.edd83d819e27367563b0958e2a7ec04721c932c183b5e6dc39a8b0d88d5f6636',
  },
  {
    id: 'cust_demo_client',
    name: 'Crestline Client',
    email: 'client@crestlinecapital.com',
    username: 'client',
    passwordHash:
      'a1d07838dd68586471b3bfa8f7fed826.ae8892404c7f2d3418fff0200567be9794da1a02cb462724acaf6ac197ba71f4',
  },
  {
    id: 'cust_demo_treasury',
    name: 'Crestline Treasury',
    email: 'treasury@crestlinecapital.com',
    username: 'treasury',
    passwordHash:
      '4c301cb7da1a1383cd087e358ae66686.471abf2c9af82c7cd57a9d9d5cb48c69c651a2aee3c2b49210f56c16c0b5291e',
  },
]
const DEFAULT_SESSION_SECRET =
  '9c1f0d6b4a8e27c53f0b91d48a6c2e7305b8f1d29c4a6e83507f2b19d6c4a0e7813b5'

export interface Customer {
  id: string
  name: string
  email: string
  /** Sign-in alias, e.g. "Emmanuel". */
  username: string
  phone?: string
  createdAt: number
  /** Stored credential hash — never returned to a client. */
  passwordHash: string
  /** True for the seeded demo account. */
  sandbox: boolean
}

/** The customer shape that is safe to send to the browser. */
export type PublicCustomer = Omit<Customer, 'passwordHash'>

export interface CustomerSession {
  customerId: string
  name: string
  email: string
  role: typeof CUSTOMER_ROLE
  issuedAt: number
  expiresAt: number
}

export function toPublicCustomer(customer: Customer): PublicCustomer {
  const { passwordHash: _passwordHash, ...rest } = customer
  return rest
}

function demoEmail(): string {
  return DEFAULT_DEMO_EMAIL
}

function demoUsername(): string {
  return DEFAULT_DEMO_USERNAME
}

function demoPasswordHash(): string {
  return DEFAULT_DEMO_PASSWORD_HASH
}

function sessionSecret(): string {
  return process.env.CUSTOMER_SESSION_SECRET || DEFAULT_SESSION_SECRET
}

/** Length-safe, constant-time string comparison. */
function safeEqual(a: string, b: string): boolean {
  const bufferA = Buffer.from(a, 'utf8')
  const bufferB = Buffer.from(b, 'utf8')
  if (bufferA.length !== bufferB.length) return false
  return crypto.timingSafeEqual(bufferA, bufferB)
}

/**
 * In-process customer store.
 *
 * Seeded lazily with the sandbox customer and extended by self-registration.
 * Keyed by lowercased email.
 */
const customers = new Map<string, Customer>()
let seeded = false

function seedSandboxCustomers(): void {
  if (seeded) return
  seeded = true

  // Seed the primary customer only when a demo email is configured. In production
  // (no CUSTOMER_DEMO_EMAIL set) no credentials are seeded and only real
  // self-registrations exist.
  const primaryEmail = demoEmail()
  if (primaryEmail) {
    const primary: Customer = {
      id: 'cust_primary',
      name: demoUsername(),
      email: primaryEmail,
      username: demoUsername(),
      createdAt: Date.now(),
      passwordHash: demoPasswordHash(),
      sandbox: true,
    }
    customers.set(primary.email, primary)
  }
}

function findByIdentifier(identifier: string): Customer | undefined {
  if (!identifier) return undefined
  const byEmail = customers.get(identifier)
  if (byEmail) return byEmail
  for (const customer of customers.values()) {
    if (customer.username.toLowerCase() === identifier) return customer
  }
  return undefined
}

/**
 * Verify an identifier (email or sign-in name) and password.
 *
 * The password is hashed even when the identifier is unknown, so a wrong
 * identifier and a wrong password take a comparable amount of time.
 */
export async function verifyCustomer(
  identifier: unknown,
  password: unknown,
): Promise<Customer | null> {
  seedSandboxCustomers()

  const customer = findByIdentifier(String(identifier ?? '').trim().toLowerCase())
  const passwordMatches = await verifyPassword(
    String(password ?? ''),
    customer?.passwordHash ?? demoPasswordHash(),
  )

  return customer && passwordMatches ? customer : null
}

export interface RegistrationInput {
  name?: unknown
  email?: unknown
  phone?: unknown
  password?: unknown
}

export type RegistrationResult =
  | { ok: true; customer: PublicCustomer }
  | { ok: false; error: string; field?: 'name' | 'email' | 'password' }

/** Create a customer account. Returns a field-level error when input is invalid. */
export async function registerCustomer(input: RegistrationInput): Promise<RegistrationResult> {
  seedSandboxCustomers()

  const name = String(input.name ?? '').trim()
  const email = String(input.email ?? '').trim().toLowerCase()
  const phone = String(input.phone ?? '').trim()
  const password = String(input.password ?? '')

  if (name.length < 2) {
    return { ok: false, error: 'Enter your full name', field: 'name' }
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return { ok: false, error: 'Enter a valid email address', field: 'email' }
  }
  if (customers.has(email)) {
    return {
      ok: false,
      error: 'An account with this email already exists. Sign in instead.',
      field: 'email',
    }
  }

  const strength = validatePasswordStrength(password)
  if (!strength.isStrong) {
    return { ok: false, error: strength.errors[0], field: 'password' }
  }

  const customer: Customer = {
    id: `cust_${crypto.randomBytes(12).toString('hex')}`,
    name,
    email,
    username: name.split(/\s+/)[0] || email.split('@')[0],
    phone: phone || undefined,
    createdAt: Date.now(),
    passwordHash: await hashPassword(password),
    sandbox: false,
  }

  customers.set(customer.email, customer)
  return { ok: true, customer: toPublicCustomer(customer) }
}

function sign(payload: string): string {
  return crypto.createHmac('sha256', sessionSecret()).update(payload).digest('base64url')
}

/** Create a signed session token for a signed-in customer. */
export function issueCustomerSessionToken(customer: Customer): string {
  const issuedAt = Date.now()
  const payload = Buffer.from(
    JSON.stringify({
      sub: customer.id,
      email: customer.email,
      name: customer.name,
      role: CUSTOMER_ROLE,
      iat: issuedAt,
      exp: issuedAt + CUSTOMER_SESSION_TTL_SECONDS * 1000,
    }),
  ).toString('base64url')

  return `${payload}.${sign(payload)}`
}

/** Verify a session token's signature and expiry. Returns null when invalid. */
export function readCustomerSessionToken(token: unknown): CustomerSession | null {
  if (typeof token !== 'string') return null

  const separator = token.lastIndexOf('.')
  if (separator <= 0) return null

  const payload = token.slice(0, separator)
  const signature = token.slice(separator + 1)
  if (!safeEqual(signature, sign(payload))) return null

  try {
    const claims = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'))
    if (typeof claims?.exp !== 'number' || claims.exp <= Date.now()) return null
    if (claims?.role !== CUSTOMER_ROLE) return null
    if (typeof claims?.sub !== 'string' || !claims.sub) return null

    return {
      customerId: claims.sub,
      name: typeof claims.name === 'string' ? claims.name : '',
      email: typeof claims.email === 'string' ? claims.email : '',
      role: CUSTOMER_ROLE,
      issuedAt: typeof claims.iat === 'number' ? claims.iat : 0,
      expiresAt: claims.exp,
    }
  } catch {
    return null
  }
}

/**
 * Cookie attributes for a freshly issued customer session.
 *
 * `secure` is true whenever the request arrived over HTTPS. Over a secure origin a
 * SameSite=Lax cookie is withheld from cross-site iframe requests, which is how the
 * hosted preview loads the app, so there we use None+Secure. Plain-HTTP local dev
 * keeps Lax, which browsers accept without Secure.
 *
 * With `remember` false the cookie has no maxAge and is dropped when the browser
 * closes; the signed token still expires on its own after the session TTL.
 */
export function customerSessionCookieOptions(remember = true, secure = true) {
  return {
    httpOnly: true,
    sameSite: (secure ? 'none' : 'lax') as 'none' | 'lax',
    secure,
    path: '/',
    ...(remember ? { maxAge: CUSTOMER_SESSION_TTL_SECONDS } : {}),
  }
}

/** Cookie attributes that clear a customer session (must match how it was set). */
export function clearedCustomerSessionCookieOptions(secure = true) {
  return {
    httpOnly: true,
    sameSite: (secure ? 'none' : 'lax') as 'none' | 'lax',
    secure,
    path: '/',
    maxAge: 0,
  }
}

/**
 * Read + verify the customer session from a request: the httpOnly cookie first,
 * then the header fallback used when the cookie is dropped.
 */
export function getCustomerSessionFromRequest(request: NextRequest): CustomerSession | null {
  const fromCookie = readCustomerSessionToken(request.cookies.get(CUSTOMER_SESSION_COOKIE)?.value)
  if (fromCookie) return fromCookie
  return readCustomerSessionToken(request.headers.get(CUSTOMER_SESSION_HEADER))
}

/** Read + verify the customer session from server components, layouts and actions. */
export async function getCustomerSession(): Promise<CustomerSession | null> {
  const cookieStore = await cookies()
  return readCustomerSessionToken(cookieStore.get(CUSTOMER_SESSION_COOKIE)?.value)
}
