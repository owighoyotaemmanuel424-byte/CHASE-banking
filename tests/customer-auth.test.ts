/**
 * Targeted tests for customer authentication after the sandbox accounts were
 * removed from source.
 *
 * With no CUSTOMER_DEMO_EMAIL configured, the retired sandbox identities must not
 * exist, sign-in must only work for real self-registered accounts, and the signed
 * session token must still round-trip and reject tampering.
 */

import { describe, expect, test } from 'bun:test'

delete process.env.CUSTOMER_DEMO_EMAIL
delete process.env.CUSTOMER_DEMO_USERNAME
delete process.env.CUSTOMER_DEMO_PASSWORD_HASH

const customerSession = await import('@/lib/customer/session')

describe('retired sandbox identities', () => {
  test('cannot sign in when no demo account is configured', async () => {
    expect(await customerSession.verifyCustomer('alex.morgan@crestline.demo', 'Password1!')).toBeNull()
    expect(await customerSession.verifyCustomer('client@crestlinecapital.com', 'Password1!')).toBeNull()
    expect(await customerSession.verifyCustomer('treasury@crestlinecapital.com', 'Password1!')).toBeNull()
    expect(await customerSession.verifyCustomer('', '')).toBeNull()
  })
})

describe('self-registered customers', () => {
  const email = `member-${Date.now()}@crestline.test`
  const password = 'Crestline!2026'

  test('can register and sign in', async () => {
    const registration = await customerSession.registerCustomer({
      name: 'Test Member',
      email,
      password,
    })

    expect(registration.ok).toBe(true)

    const signedIn = await customerSession.verifyCustomer(email, password)
    expect(signedIn?.email).toBe(email)

    expect(await customerSession.verifyCustomer(email, 'not-the-password')).toBeNull()
  })

  test('never exposes the stored credential hash', async () => {
    const customer = await customerSession.verifyCustomer(email, password)
    expect(customer).not.toBeNull()

    const publicCustomer = customerSession.toPublicCustomer(customer!)
    expect('passwordHash' in publicCustomer).toBe(false)
  })

  test('issues a session token that round-trips and rejects tampering', async () => {
    const customer = await customerSession.verifyCustomer(email, password)
    const token = customerSession.issueCustomerSessionToken(customer!)

    const session = customerSession.readCustomerSessionToken(token)
    expect(session?.customerId).toBe(customer!.id)
    expect(session?.role).toBe('customer')

    expect(customerSession.readCustomerSessionToken(`${token}x`)).toBeNull()
    expect(customerSession.readCustomerSessionToken('not-a-token')).toBeNull()
    expect(customerSession.readCustomerSessionToken(undefined)).toBeNull()
  })
})
