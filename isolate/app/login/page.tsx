"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  AlertCircle,
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  ShieldCheck,
} from "lucide-react"
import { AuthShell } from "@/components/auth-shell"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useBanking } from "@/hooks/use-banking"
import { fetchCustomerSession, signIn } from "@/lib/customer/client"

/**
 * Only same-origin paths are honoured, so `?returnTo=` cannot redirect off-site.
 */
function safeReturnTo(): string {
  if (typeof window === "undefined") return "/"
  const requested = new URLSearchParams(window.location.search).get("returnTo")
  if (requested && requested.startsWith("/") && !requested.startsWith("//")) return requested
  return "/"
}

function FieldIcon({ children }: { children: React.ReactNode }) {
  return (
    <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
      {children}
    </span>
  )
}

export default function LoginPage() {
  const router = useRouter()
  const { updateUserProfile } = useBanking()

  const [identifier, setIdentifier] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  // Someone with a live session should never see the sign-in form.
  useEffect(() => {
    let cancelled = false
    void fetchCustomerSession().then((customer) => {
      if (!cancelled && customer) router.replace(safeReturnTo())
    })
    return () => {
      cancelled = true
    }
  }, [router])

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (isSubmitting) return

    setError("")

    if (!identifier.trim() || !password) {
      setError("Enter your email and password to continue.")
      return
    }

    setIsSubmitting(true)
    try {
      // signIn keeps the cookie path and records the token used when a browser
      // withholds the cookie, then caches the identity for the signed-in shell.
      const result = await signIn(identifier.trim(), password, remember)

      if (!result.ok) {
        setError(result.error)
        return
      }

      updateUserProfile({ name: result.customer.name, email: result.customer.email })
      router.replace(safeReturnTo())
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthShell
      eyebrow="Online banking"
      title="Sign in to your account"
      subtitle="Welcome back. Enter your details to reach your dashboard."
      footer={
        <>
          New to Crestline Capital?{" "}
          <Link href="/register" className="font-semibold text-[#D71E28] hover:text-[#E8464F]">
            Open an account
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        {error && (
          <div
            role="alert"
            aria-live="polite"
            className="flex items-start gap-3 rounded-lg border border-[#f43f5e]/30 bg-[#f43f5e]/10 px-4 py-3"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#f43f5e]" />
            <p className="text-sm text-[#fecdd3]">{error}</p>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="identifier" className="text-gray-600">
            Email or sign-in name
          </Label>
          <div className="relative">
            <FieldIcon>
              <Mail className="h-4 w-4" />
            </FieldIcon>
            <Input
              id="identifier"
              name="identifier"
              type="text"
              autoComplete="username"
              autoCapitalize="none"
              spellCheck={false}
              placeholder="you@example.com"
              value={identifier}
              onChange={(event) => setIdentifier(event.target.value)}
              className="h-11 border-gray-200 bg-gray-50/60 pl-10 text-gray-900 placeholder:text-gray-400 focus-visible:border-[#D71E28] focus-visible:ring-[#D71E28]/25"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-gray-600">
            Password
          </Label>
          <div className="relative">
            <FieldIcon>
              <Lock className="h-4 w-4" />
            </FieldIcon>
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="h-11 border-gray-200 bg-gray-50/60 pl-10 pr-11 text-gray-900 placeholder:text-gray-400 focus-visible:border-[#D71E28] focus-visible:ring-[#D71E28]/25"
            />
            <button
              type="button"
              onClick={() => setShowPassword((visible) => !visible)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-2 text-gray-400 transition-colors hover:text-[#D71E28] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D71E28]/40"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <label htmlFor="remember" className="flex cursor-pointer items-center gap-2.5">
            <Checkbox
              id="remember"
              checked={remember}
              onCheckedChange={(checked) => setRemember(checked === true)}
              className="border-gray-300 data-[state=checked]:border-[#D71E28] data-[state=checked]:bg-[#D71E28]"
            />
            <span className="text-sm text-gray-500">Keep me signed in</span>
          </label>
          <Link href="/contact" className="text-sm font-medium text-[#D71E28] hover:text-[#E8464F]">
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-11 w-full bg-[#D71E28] text-sm font-semibold text-gray-900 transition-all hover:bg-[#A31620] hover:shadow-[0_0_24px_rgba(215,30,40,0.35)] disabled:opacity-60"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in…
            </>
          ) : (
            <>
              Sign in securely
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>

        <p className="flex items-center justify-center gap-2 text-xs text-gray-400">
          <ShieldCheck className="h-3.5 w-3.5 text-[#10b981]" />
          Protected by encrypted sessions and sign-in rate limiting
        </p>
      </form>

    </AuthShell>
  )
}
