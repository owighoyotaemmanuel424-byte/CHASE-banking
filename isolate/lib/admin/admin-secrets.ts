/**
 * Crestline Capital - Admin Server-Side Secrets
 *
 * ⚠️  SERVER-ONLY: This file must NEVER be imported from client components ('use client').
 * It contains credentials that must never reach the browser bundle.
 * Import this only from API route handlers and server components/layouts.
 *
 * All values are read from environment configuration. No default credentials ship
 * in source code. Set these in Settings → Environment (production) or .env.local:
 *
 *   ADMIN_MASTER_KEY               48-character hexadecimal master key
 *   ADMIN_DEFAULT_EMAIL            primary administrator email
 *   ADMIN_DEFAULT_PASSWORD         primary administrator password
 *   ADMIN_DEFAULT_NAME             primary administrator display name
 *   ADMIN_NOTIFICATION_EMAIL       where admin alerts are delivered
 */

export const ADMIN_MASTER_KEY = process.env.ADMIN_MASTER_KEY || ''

export const ADMIN_DEFAULT_CREDENTIALS = {
  email: (process.env.ADMIN_DEFAULT_EMAIL || '').trim().toLowerCase(),
  password: process.env.ADMIN_DEFAULT_PASSWORD || '',
  name: process.env.ADMIN_DEFAULT_NAME || 'Administrator',
  role: 'SUPER_ADMIN' as const,
}
