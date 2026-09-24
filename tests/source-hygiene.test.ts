/**
 * Source-hygiene regression tests for the "remove demo content and embedded
 * login details" change set.
 *
 * These tests never touch the network or a database: they assert on the shipped
 * source tree, which is exactly what leaked before. Run with `bun test tests`.
 */

import { describe, expect, test } from 'bun:test'
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import path from 'node:path'

const ROOT = path.resolve(import.meta.dir, '..')
const SHIPPED_DIRS = ['app', 'components', 'lib', 'hooks', 'convex']
const SOURCE_EXTENSIONS = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs'])

/** Every real credential or demo persona that was committed to this repository. */
const FORBIDDEN_LITERALS = [
  'Owighoyota12345',
  'owighoyotaemmanuel424',
  'hungchun164',
  'linhuang011',
  'Chun2000',
  'CHUN HUNG',
  '4a8f9b2c3d4e5f60718293a4b5c6d7e8f90123456789abcd', // old 48-char admin master key
  '697-03-2642',
  '+1 (702) 886-4745',
  '+1 (212) 555-0199',
  '287450',
  '***-**-6789',
  'alex.morgan@crestline.demo',
  'Alex Morgan',
]

/** `salt.hash` credential material produced by lib/auth/password-utils. */
const PBKDF2_LITERAL = /[0-9a-f]{32}\.[0-9a-f]{64}/

function walk(dir: string): string[] {
  const files: string[] = []
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === '.next') continue
      files.push(...walk(full))
    } else if (SOURCE_EXTENSIONS.has(path.extname(entry.name))) {
      files.push(full)
    }
  }
  return files
}

const shippedFiles = SHIPPED_DIRS.filter((dir) => existsSync(path.join(ROOT, dir))).flatMap(
  (dir) => walk(path.join(ROOT, dir)),
)

function read(file: string): string {
  return readFileSync(file, 'utf8')
}

function relative(file: string): string {
  return path.relative(ROOT, file)
}

function isClientModule(source: string): boolean {
  return source.slice(0, 400).includes("'use client'") || source.slice(0, 400).includes('"use client"')
}

describe('shipped source hygiene', () => {
  test('scans the application source tree', () => {
    // Guards against the walker silently matching nothing and passing vacuously.
    expect(shippedFiles.length).toBeGreaterThan(100)
  })

  test('contains no embedded credential or demo persona', () => {
    const offenders: string[] = []

    for (const file of shippedFiles) {
      const source = read(file)
      for (const literal of FORBIDDEN_LITERALS) {
        if (source.includes(literal)) offenders.push(`${relative(file)} -> ${literal}`)
      }
    }

    expect(offenders).toEqual([])
  })

  test('never bakes an admin credential or master key into lib/admin', () => {
    const secrets = path.join(ROOT, 'lib/admin/admin-secrets.ts')
    expect(existsSync(secrets)).toBe(true)

    const source = read(secrets)
    expect(source).toContain('process.env.ADMIN_MASTER_KEY')
    expect(source).toContain('process.env.ADMIN_DEFAULT_PASSWORD')
    expect(source).not.toMatch(/ADMIN_MASTER_KEY\s*(?::\s*string)?\s*=\s*['"][^'"]+['"]/)
  })

  test('keeps the server-only admin secrets out of client components', () => {
    const offenders: string[] = []

    for (const file of shippedFiles) {
      if (file.endsWith('admin-secrets.ts')) continue
      const source = read(file)
      if (!isClientModule(source)) continue
      if (/from\s+['"][^'"]*admin-secrets['"]/.test(source)) offenders.push(relative(file))
    }

    expect(offenders).toEqual([])
  })
})

describe('customer demo identities', () => {
  test('ships no password hashes for the retired sandbox accounts', () => {
    const source = read(path.join(ROOT, 'lib/customer/session.ts'))
    const match = source.match(PBKDF2_LITERAL)

    expect(match?.[0] ?? null).toBeNull()
  })

  test('only ever reads the seeded credential from the environment', () => {
    const source = read(path.join(ROOT, 'lib/customer/session.ts'))

    expect(source).toContain('process.env.CUSTOMER_DEMO_PASSWORD_HASH')
    expect(source).toContain('process.env.CUSTOMER_DEMO_EMAIL')
  })
})

describe('default application state', () => {
  test('seeds no demo persona into the banking profile', () => {
    const source = read(path.join(ROOT, 'lib/banking-context.tsx'))

    for (const literal of [
      'Alex Morgan',
      'alex.morgan@crestline.demo',
      '+1 (212) 555-0199',
      '***-**-6789',
      '42580',
    ]) {
      expect(source).not.toContain(literal)
    }
  })

  test('renders no demo persona when the profile has not loaded', () => {
    // The dashboard, profile and cards pages must not fall back to a hardcoded
    // person when the signed-in profile is still empty.
    for (const page of ['app/dashboard/page.tsx', 'app/profile/page.tsx', 'app/cards/page.tsx']) {
      expect(read(path.join(ROOT, page))).not.toContain('Alex Morgan')
    }
  })
})
