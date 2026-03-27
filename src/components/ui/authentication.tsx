import * as React from "react"
import axios from "axios"
import { cn } from "@/src/lib/utils"
import { Button } from "./button"
import { Input } from "./input"
import { Label } from "./label"

// ─── Types ────────────────────────────────────────────────────────────────────

export type AuthView = "login" | "register" | "resetPassword"

export interface AuthField {
  name: string
  label: string
  type?: "text" | "email" | "password" | "tel" | "url" | "numeric" | "integer"
  placeholder?: string
  required?: boolean
  disabled?: boolean
  error?: string
  revealable?: boolean
  render?: (value: string, onChange: (v: string) => void) => React.ReactNode
}

export type AuthVariant = "default" | "split" | "minimal" | "glass"

export interface AuthenticationProps {
  /** Which views are enabled */
  enableLogin?: boolean
  enableRegister?: boolean
  enableResetPassword?: boolean

  /** Initial view */
  defaultView?: AuthView

  /** Base URL for axios requests (e.g. "https://api.example.com") */
  baseURL?: string

  /** Extra axios headers */
  headers?: Record<string, string>

  /** Custom fields per view — replaces default fields when provided */
  loginFields?: AuthField[]
  registerFields?: AuthField[]
  resetPasswordFields?: AuthField[]

  /** Callbacks */
  onLoginSuccess?: (data: any) => void
  onRegisterSuccess?: (data: any) => void
  onResetSuccess?: (data: any) => void
  onError?: (view: AuthView, error: any) => void

  /** Branding */
  logo?: React.ReactNode
  title?: string

  /** UI variant */
  variant?: AuthVariant

  /** Split variant — custom left-panel content */
  splitPanel?: React.ReactNode

  className?: string
}

// ─── Default fields ───────────────────────────────────────────────────────────

const DEFAULT_LOGIN_FIELDS: AuthField[] = [
  { name: "email", label: "Email", type: "email", required: true },
  { name: "password", label: "Password", type: "password", required: true },
]

const DEFAULT_REGISTER_FIELDS: AuthField[] = [
  { name: "name", label: "Full Name", type: "text", required: true },
  { name: "email", label: "Email", type: "email", required: true },
  { name: "password", label: "Password", type: "password", required: true },
  { name: "password_confirmation", label: "Confirm Password", type: "password", required: true },
]

const DEFAULT_RESET_FIELDS: AuthField[] = [
  { name: "email", label: "Email", type: "email", required: true },
]

// ─── Component ────────────────────────────────────────────────────────────────

export function Authentication({
  enableLogin = true,
  enableRegister = true,
  enableResetPassword = true,
  defaultView = "login",
  baseURL = "",
  headers = {},
  loginFields,
  registerFields,
  resetPasswordFields,
  onLoginSuccess,
  onRegisterSuccess,
  onResetSuccess,
  onError,
  logo,
  title,
  variant = "default",
  splitPanel,
  className,
}: AuthenticationProps) {
  const [view, setView] = React.useState<AuthView>(defaultView)
  const [form, setForm] = React.useState<Record<string, string>>({})
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [success, setSuccess] = React.useState<string | null>(null)

  // Reset form state on view change
  React.useEffect(() => {
    setForm({})
    setError(null)
    setSuccess(null)
  }, [view])

  const http = axios.create({ baseURL, headers })

  const setField = (name: string, value: string) =>
    setForm((prev) => ({ ...prev, [name]: value }))

  const resolvedFields: AuthField[] =
    view === "login"
      ? loginFields ?? DEFAULT_LOGIN_FIELDS
      : view === "register"
      ? registerFields ?? DEFAULT_REGISTER_FIELDS
      : resetPasswordFields ?? DEFAULT_RESET_FIELDS

  const isPasswordField = (field: AuthField) =>
    field.type === "password" || field.name === "password" || field.name === "password_confirmation"

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    const routes: Record<AuthView, string> = {
      login: "user/login",
      register: "user/store",
      resetPassword: "user/reset/password",
    }

    try {
      const { data } = await http.post(routes[view], form)
      if (view === "login") onLoginSuccess?.(data)
      else if (view === "register") onRegisterSuccess?.(data)
      else onResetSuccess?.(data)
      if (view === "resetPassword") setSuccess("Password reset email sent.")
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ??
        err?.response?.data?.error ??
        "Something went wrong."
      setError(msg)
      onError?.(view, err)
    } finally {
      setLoading(false)
    }
  }

  const viewTitles: Record<AuthView, string> = {
    login: "Sign In",
    register: "Create Account",
    resetPassword: "Reset Password",
  }

  // Only show tabs when there are 2+ switchable views (excluding resetPassword)
  const tabViews = [
    enableLogin && "login",
    enableRegister && "register",
  ].filter(Boolean)
  const showTabs = tabViews.length > 1 && view !== "resetPassword"

  const formBody = (
    <>
      {/* Header */}
      <div className="space-y-1">
        {logo && <div className="flex justify-center mb-3">{logo}</div>}
        <h1 className={cn("font-bold text-foreground", variant === "minimal" ? "text-xl" : "text-2xl")}>
          {title ?? viewTitles[view]}
        </h1>
        {!title && (
          <p className="text-sm text-muted-foreground">
            {view === "login" && "Welcome back"}
            {view === "register" && "Fill in your details to get started"}
            {view === "resetPassword" && "Enter your email to receive a reset link"}
          </p>
        )}
      </div>

      {/* Tabs */}
      {showTabs && (
        <div className={cn(
          "flex overflow-hidden",
          variant === "minimal"
            ? "gap-4 border-b border-border"
            : "rounded-xl border border-border"
        )}>
          {enableLogin && (
            <button
              type="button"
              onClick={() => setView("login")}
              className={cn(
                "flex-1 py-2 text-sm font-medium transition-colors",
                variant === "minimal"
                  ? cn("pb-2 border-b-2 -mb-px", view === "login" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground")
                  : cn(view === "login" ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground hover:bg-accent")
              )}
            >
              Sign In
            </button>
          )}
          {enableRegister && (
            <button
              type="button"
              onClick={() => setView("register")}
              className={cn(
                "flex-1 py-2 text-sm font-medium transition-colors",
                variant === "minimal"
                  ? cn("pb-2 border-b-2 -mb-px", view === "register" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground")
                  : cn(view === "register" ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground hover:bg-accent")
              )}
            >
              Register
            </button>
          )}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {resolvedFields.map((field) => (
          <div key={field.name} className="space-y-1.5">
            <Label htmlFor={field.name}>
              {field.label}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </Label>
            {field.render ? (
              field.render(form[field.name] ?? "", (v) => setField(field.name, v))
            ) : (
              <Input
                id={field.name}
                inputType={isPasswordField(field) ? "password" : (field.type as any)}
                revealable={field.revealable ?? isPasswordField(field)}
                placeholder={field.placeholder ?? field.label}
                value={form[field.name] ?? ""}
                onChange={(e) => setField(field.name, e.target.value)}
                required={field.required}
                disabled={field.disabled}
                error={field.error}
              />
            )}
          </div>
        ))}

        {error && (
          <p className="text-sm text-danger bg-danger/10 border border-danger/20 rounded-lg px-3 py-2">
            {error}
          </p>
        )}
        {success && (
          <p className="text-sm text-success bg-success/10 border border-success/20 rounded-lg px-3 py-2">
            {success}
          </p>
        )}

        <Button type="submit" fullWidth loading={loading}>
          {viewTitles[view]}
        </Button>
      </form>

      {/* Footer links */}
      <div className="text-center text-sm text-muted-foreground space-y-1">
        {view === "login" && enableResetPassword && (
          <button
            type="button"
            onClick={() => setView("resetPassword")}
            className="text-primary hover:underline block w-full"
          >
            Forgot password?
          </button>
        )}
        {view === "resetPassword" && enableLogin && (
          <button
            type="button"
            onClick={() => setView("login")}
            className="text-primary hover:underline"
          >
            ← Back to Sign In
          </button>
        )}
      </div>
    </>
  )

  // ── glass variant ──────────────────────────────────────────────────────────
  if (variant === "glass") {
    return (
      <div className={cn(
        "min-h-screen flex items-center justify-center px-4 relative overflow-hidden",
        "bg-gradient-to-br from-primary/20 via-background to-info/20",
        className
      )}>
        {/* decorative blobs */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-primary/30 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-info/20 blur-3xl pointer-events-none" />
        <div className="relative w-full max-w-md glass rounded-3xl p-8 space-y-6 shadow-2xl">
          {formBody}
        </div>
      </div>
    )
  }

  // ── split variant ──────────────────────────────────────────────────────────
  if (variant === "split") {
    return (
      <div className={cn("min-h-screen flex", className)}>
        {/* Left panel */}
        <div className="hidden lg:flex flex-1 items-center justify-center bg-gradient-to-br from-primary to-info p-12">
          {splitPanel ?? (
            <div className="text-center text-white space-y-4 max-w-sm">
              <div className="text-5xl font-bold tracking-tight">Welcome</div>
              <p className="text-white/80 text-lg">Sign in to access your account and continue where you left off.</p>
            </div>
          )}
        </div>
        {/* Right panel */}
        <div className="flex flex-1 items-center justify-center bg-background px-8">
          <div className="w-full max-w-md space-y-6">
            {formBody}
          </div>
        </div>
      </div>
    )
  }

  // ── minimal variant ────────────────────────────────────────────────────────
  if (variant === "minimal") {
    return (
      <div className={cn(
        "min-h-screen flex items-center justify-center bg-background px-4",
        className
      )}>
        <div className="w-full max-w-sm space-y-6">
          {formBody}
        </div>
      </div>
    )
  }

  // ── default variant ────────────────────────────────────────────────────────
  return (
    <div className={cn(
      "min-h-screen flex items-center justify-center bg-background px-4",
      className
    )}>
      <div className="w-full max-w-md rounded-2xl border border-border bg-card shadow-xl p-8 space-y-6">
        {formBody}
      </div>
    </div>
  )
}
