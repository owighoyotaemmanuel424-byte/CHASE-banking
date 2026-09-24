/**
 * End-to-end test for the admin login route after the embedded credentials were
 * removed.
 *
 * The gate must reject a whitespace-only master key instead of trimming it down
 * to an empty string and matching an unset ADMIN_MASTER_KEY.
 */

import { describe, expect, test } from 'bun:test'
import { NextRequest } from 'next/server'

delete process.env.ADMIN_MASTER_KEY
delete process.env.ADMIN_EMAIL
delete process.env.ADMIN_PASSWORD
delete process.env.ADMIN_DEFAULT_EMAIL
delete process.env.ADMIN_DEFAULT_PASSWORD

const { POST } = await import('@/app/api/admin/auth/login/route')

function login(body: unknown): Promise<Response> {
  return POST(
    new NextRequest('http://localhost/api/admin/auth/login', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    }),
  )
}

describe('POST /api/admin/auth/login', () => {
  test('never issues an admin session for a whitespace-only master key', async () => {
    const response = await login({ masterKey: '   ' })

    expect(response.status).toBe(401)
    expect(response.cookies?.get('crestline_admin_session')).toBeUndefined()
  })

  test('never issues an admin session for an empty master key', async () => {
    const response = await login({ masterKey: '' })

    expect(response.status).toBe(400)
    expect(response.cookies?.get('crestline_admin_session')).toBeUndefined()
  })

  test('rejects a guess while no administrator is configured', async () => {
    const response = await login({ email: 'admin@crestlinecapital.com', password: 'guess' })

    expect(response.status).toBe(401)
  })

  test('rejects a request with no credential at all', async () => {
    const response = await login({})

    expect(response.status).toBe(400)
  })
})
