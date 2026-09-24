// Account metadata for seeded reference accounts.
// No credentials are stored here — passwords are managed server-side only.

export const DEMO_CREDENTIALS = {
  firstName: "Alex",
  lastName: "Morgan",
  email: "alex.morgan@crestline.demo",
  username: "Alex Morgan",
}

export const DEMO_ACCOUNTS = [
  {
    accountType: "Checking",
    accountNumber: "****4501",
    balance: 0,
    currency: "USD",
  },
  {
    accountType: "Savings",
    accountNumber: "****4502",
    balance: 0,
    currency: "USD",
  },
  {
    accountType: "Business",
    accountNumber: "****4503",
    balance: 0,
    currency: "USD",
  },
]

export const DEMO_TRANSACTIONS = [
  {
    type: "transfer",
    amount: 0,
    description: "Transfer to Savings",
    timestamp: new Date(Date.now() - 86400000),
  },
  {
    type: "payment",
    amount: 0,
    description: "Utilities Bill Payment",
    timestamp: new Date(Date.now() - 172800000),
  },
  {
    type: "deposit",
    amount: 0,
    description: "Direct Deposit - Payroll",
    timestamp: new Date(Date.now() - 259200000),
  },
]
