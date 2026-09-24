"use client"

import type React from "react"
import Link from "next/link"
import { CreditCard, Lock, ShieldCheck, Zap } from "lucide-react"

/** The Crestline Capital mark, shared by both auth surfaces. */
export function CrestlineMark({ size = 40 }: { size?: number }) {
  return (
    <div
      className="flex items-center justify-center rounded-xl bg-gradient-to-br from-[#D71E28] to-[#818cf8] shadow-[0_8px_30px_rgba(215,30,40,0.35)]"
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <svg
        width={size * 0.55}
        height={size * 0.55}
        viewBox="0 0 24 24"
        fill="none"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 3v18h18" />
        <path d="M7 16l4-8 4 4 4-6" />
      </svg>
    </div>
  )
}

const HIGHLIGHTS = [
  {
    icon: ShieldCheck,
    title: "Bank-grade security",
    body: "End-to-end encryption, device checks and anomaly detection on every session.",
  },
  {
    icon: Zap,
    title: "Instant transfers",
    body: "Move money between your accounts and payees in seconds, any hour of the day.",
  },
  {
    icon: CreditCard,
    title: "Cards you control",
    body: "Freeze, unfreeze and set limits on every card the moment something looks off.",
  },
]

/**
 * Split-screen shell used by /login and /register.
 *
 * Left: the brand panel (product story on desktop). Right: the form card.
 */
export function AuthShell({
  eyebrow,
  title,
  subtitle,
  children,
  footer,
}: {
  eyebrow: string
  title: string
  subtitle: string
  children: React.ReactNode
  footer: React.ReactNode
}) {
  return (
    <div className="relative min-h-screen bg-white text-gray-900">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-32 h-[28rem] w-[28rem] rounded-full bg-[#D71E28]/10 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-[26rem] w-[26rem] rounded-full bg-[#818cf8]/10 blur-[120px]" />
        <div className="auth-grid absolute inset-0 opacity-[0.35]" />
      </div>

      <div className="relative mx-auto grid min-h-screen w-full max-w-7xl grid-cols-1 lg:grid-cols-[1.05fr_1fr]">
        {/* Brand panel */}
        <div className="hidden flex-col justify-between px-10 py-12 lg:flex xl:px-16">
          <Link href="/" className="flex items-center gap-3">
            <CrestlineMark />
            <span className="text-lg font-bold tracking-tight">Crestline Capital</span>
          </Link>

          <div className="max-w-lg">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#D71E28]">
              Digital banking
            </p>
            <h1 className="text-4xl font-bold leading-tight xl:text-5xl">
              Banking that keeps up with{" "}
              <span className="crest-text-gradient">every move you make</span>
            </h1>
            <p className="mt-5 text-base leading-relaxed text-gray-500">
              Checking, savings, cards and payments in one account — with the controls
              you would expect from a modern bank.
            </p>

            <ul className="mt-10 space-y-5">
              {HIGHLIGHTS.map(({ icon: Icon, title: heading, body }) => (
                <li key={heading} className="flex gap-4">
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-gray-100/80">
                    <Icon className="h-4 w-4 text-[#D71E28]" />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-gray-900">{heading}</span>
                    <span className="block text-sm text-gray-500">{body}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <p className="flex items-center gap-2 text-xs text-gray-400">
            <Lock className="h-3.5 w-3.5" />
            Secure environment — encrypted sessions protect your banking activity.
          </p>
        </div>

        {/* Form panel */}
        <div className="flex items-center justify-center px-5 py-10 sm:px-8 lg:px-10">
          <div className="w-full max-w-md">
            <Link href="/" className="mb-8 flex items-center gap-3 lg:hidden">
              <CrestlineMark size={36} />
              <span className="text-base font-bold tracking-tight">Crestline Capital</span>
            </Link>

            <div className="glass-card p-6 shadow-[0_24px_70px_rgba(2,6,23,0.55)] sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#D71E28]">
                {eyebrow}
              </p>
              <h2 className="mt-3 text-2xl font-bold tracking-tight">{title}</h2>
              <p className="mt-2 text-sm text-gray-500">{subtitle}</p>

              <div className="mt-7">{children}</div>
            </div>

            <div className="mt-6 text-center text-sm text-gray-500">{footer}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
