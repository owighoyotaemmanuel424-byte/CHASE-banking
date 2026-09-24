/**
 * Targeted tests for the admin gatekeeper after the embedded demo credentials
 * were removed.
 *
 * The whole point of that change is that no built-in credential exists any more,
 * so the gate must fail closed: an empty key, an empty credential pair, or any
 * guess must never produce an admin session.
 */

import { describe, expect, test } from 'bun:test'

// Force the "nothing configured" state before the auth modules are imported.
delete process.env.ADMIN_MASTER_KEY
delete process.env.ADMIN_EMAIL
delete process.env.ADMIN_PASSWORD
delete process.env.ADMIN_DEFAULT_EMAIL
delete process.env.ADMIN_DEFAULT_PASSWORD

const { AdminAuthEngine } = await import('@/lib/admin/admin-auth')
const { ADMIN_MASTER_KEY, ADMIN_DEFAULT_CREDENTIALS } = await import('@/lib/admin/admin-secrets')

describe('admin credential configuration', () => {
  test('ships no default master key or administrator credential', () => {
    expect(ADMIN_MASTER_KEY).toBe('')
    expect(ADMIN_DEFAULT_CREDENTIALS.email).toBe('')
    expect(ADMIN_DEFAULT_CREDENTIALS.password).toBe('')
  })
})

describe('admin gatekeeper fails closed', () => {
  test('rejects an empty master key', () => {
    const result = AdminAuthEngine.authenticateMasterKey('', '10.0.0.1')

    expect(result.success).toBe(false)
    expect(result.session).toBeUndefined()
  })

  test('rejects an empty email and password pair', () => {
    const result = AdminAuthEngine.authenticateCredentials('', '', '10.0.0.2')

    expect(result.success).toBe(false)
    expect(result.session).toBeUndefined()
  })

  test('rejects a guess while no administrator is configured', () => {
    const result = AdminAuthEngine.authenticateCredentials(
      'admin@crestlinecapital.com',
      'Owighoyota12345',
      '10.0.0.3',
    )

    expect(result.success).toBe(false)
  })

  test('rejects a master key that is only whitespace', () => {
    const result = AdminAuthEngine.authenticateMasterKey('   ', '10.0.0.4')

    expect(result.success).toBe(false)
  })
})

describe('admin gatekeeper still works when it is configured', () => {
  const masterKey = 'b'.repeat(48)

  test('accepts the configured master key and issues a verifiable session', () => {
    process.env.ADMIN_MASTER_KEY = masterKey
    try {
      expect(AdminAuthEngine.authenticateMasterKey('nope', '10.0.0.5').success).toBe(false)

      const result = AdminAuthEngine.authenticateMasterKey(masterKey, '10.0.0.6')
      expect(result.success).toBe(true)

      const session = AdminAuthEngine.verifySession(result.session?.sessionId ?? '')
      expect(session?.role).toBe('SUPER_ADMIN')
      expect(AdminAuthEngine.hasPermission(session!, 'settings.manage')).toBe(true)

      expect(AdminAuthEngine.invalidateSession(result.session!.sessionId)).toBe(true)
      expect(AdminAuthEngine.verifySession(result.session!.sessionId)).toBeNull()
    } finally {
      delete process.env.ADMIN_MASTER_KEY
    }
  })

  test('accepts the configured email and password', () => {
    process.env.ADMIN_EMAIL = 'security@crestlinecapital.internal'
    process.env.ADMIN_PASSWORD = 'Correct-Horse-Battery-9!'
    try {
      expect(
        AdminAuthEngine.authenticateCredentials(
          'security@crestlinecapital.internal',
          'wrong-password',
          '10.0.0.7',
        ).success,
      ).toBe(false)

      const result = AdminAuthEngine.authenticateCredentials(
        'security@crestlinecapital.internal',
        'Correct-Horse-Battery-9!',
        '10.0.0.8',
      )

      expect(result.success).toBe(true)
      expect(result.session?.adminId).toBe('adm_primary')
    } finally {
      delete process.env.ADMIN_EMAIL
      delete process.env.ADMIN_PASSWORD
    }
  })

  test('locks out an identifier after five failed attempts', () => {
    process.env.ADMIN_EMAIL = 'security@crestlinecapital.internal'
    process.env.ADMIN_PASSWORD = 'Correct-Horse-Battery-9!'
    try {
      const identifier = `lockout-${Date.now()}@crestlinecapital.internal`
      const results = []

      for (let attempt = 0; attempt < 5; attempt += 1) {
        results.push(AdminAuthEngine.authenticateCredentials(identifier, 'guess', '10.0.0.9'))
      }

      expect(results.slice(0, 4).every((result) => result.remainingAttempts !== undefined)).toBe(true)
      expect(results[4].success).toBe(false)
      expect(results[4].error).toContain('Locked')
    } finally {
      delete process.env.ADMIN_EMAIL
      delete process.env.ADMIN_PASSWORD
    }
  })
})
