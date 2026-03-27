import * as React from "react"
import { cn } from "@/src/lib/utils"

export type RadioVariant = "default" | "card" | "button"
export type RadioSize = "sm" | "md" | "lg"

export interface RadioOption {
  value: string
  label: React.ReactNode
  description?: React.ReactNode
  icon?: React.ReactNode
  disabled?: boolean
}

export interface RadioGroupProps {
  options: RadioOption[]
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  variant?: RadioVariant
  size?: RadioSize
  orientation?: "horizontal" | "vertical"
  name?: string
  className?: string
  required?: boolean
  error?: string
}

const SIZE_RADIO: Record<RadioSize, string> = {
  sm: "h-3.5 w-3.5",
  md: "h-4 w-4",
  lg: "h-5 w-5",
}

const SIZE_TEXT: Record<RadioSize, string> = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
}

export function RadioGroup({
  options,
  value: controlledValue,
  defaultValue,
  onChange,
  variant = "default",
  size = "md",
  orientation = "vertical",
  name,
  className,
  required,
  error,
}: RadioGroupProps) {
  const [internal, setInternal] = React.useState(defaultValue ?? "")
  const active = controlledValue ?? internal

  function select(val: string) {
    if (!controlledValue) setInternal(val)
    onChange?.(val)
  }

  if (variant === "card") {
    return (
      <div className="flex flex-col gap-1">
        <div className={cn("grid gap-3", orientation === "horizontal" ? "grid-flow-col auto-cols-fr" : "grid-cols-1", className)}>
          {options.map((opt) => (
            <label
              key={opt.value}
              className={cn(
                "relative flex cursor-pointer rounded-xl border p-4 transition-all",
                opt.disabled && "opacity-40 cursor-not-allowed pointer-events-none",
                active === opt.value
                  ? "border-primary bg-primary/5 ring-1 ring-primary"
                  : "border-border hover:border-primary/40 hover:bg-accent/30"
              )}
            >
              <input
                type="radio"
                name={name}
                value={opt.value}
                checked={active === opt.value}
                disabled={opt.disabled}
                onChange={() => select(opt.value)}
                required={required}
                aria-required={required}
                aria-invalid={!!error}
                className="sr-only"
              />
              <div className="flex w-full gap-3">
                {opt.icon && <span className="shrink-0 mt-0.5 text-muted-foreground">{opt.icon}</span>}
                <div className="flex-1 min-w-0">
                  <p className={cn("font-medium", SIZE_TEXT[size], active === opt.value && "text-primary")}>{opt.label}</p>
                  {opt.description && <p className="text-xs text-muted-foreground mt-0.5">{opt.description}</p>}
                </div>
                <span className={cn(
                  "shrink-0 mt-0.5 rounded-full border-2 flex items-center justify-center transition-colors",
                  SIZE_RADIO[size],
                  active === opt.value ? "border-primary" : "border-muted-foreground/40"
                )}>
                  {active === opt.value && (
                    <span className={cn("rounded-full bg-primary", size === "sm" ? "h-1.5 w-1.5" : size === "lg" ? "h-2.5 w-2.5" : "h-2 w-2")} />
                  )}
                </span>
              </div>
            </label>
          ))}
        </div>
        {error && <p className="text-sm text-destructive mt-1">{error}</p>}
      </div>
    )
  }

  if (variant === "button") {
    return (
      <div className="flex flex-col gap-1">
        <div className={cn("flex flex-wrap gap-2", className)}>
          {options.map((opt) => (
            <label
              key={opt.value}
              className={cn(
                "inline-flex items-center gap-2 cursor-pointer rounded-lg border px-3 py-2 font-medium transition-all",
                SIZE_TEXT[size],
                opt.disabled && "opacity-40 cursor-not-allowed pointer-events-none",
                active === opt.value
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border hover:border-primary/40 hover:bg-accent/30 text-muted-foreground"
              )}
            >
              <input
                type="radio"
                name={name}
                value={opt.value}
                checked={active === opt.value}
                disabled={opt.disabled}
                onChange={() => select(opt.value)}
                required={required}
                aria-required={required}
                aria-invalid={!!error}
                className="sr-only"
              />
              {opt.icon && <span className="shrink-0">{opt.icon}</span>}
              {opt.label}
            </label>
          ))}
        </div>
        {error && <p className="text-sm text-destructive mt-1">{error}</p>}
      </div>
    )
  }

  // default list
  return (
    <div className="flex flex-col gap-1">
      <div className={cn("flex gap-3", orientation === "horizontal" ? "flex-row flex-wrap" : "flex-col", className)}>
        {options.map((opt) => (
          <label
            key={opt.value}
            className={cn(
              "flex items-start gap-3 cursor-pointer",
              opt.disabled && "opacity-40 cursor-not-allowed pointer-events-none"
            )}
          >
            <span className={cn(
              "mt-0.5 shrink-0 rounded-full border-2 flex items-center justify-center transition-colors",
              SIZE_RADIO[size],
              active === opt.value ? "border-primary" : "border-muted-foreground/40"
            )}>
              {active === opt.value && (
                <span className={cn("rounded-full bg-primary", size === "sm" ? "h-1.5 w-1.5" : size === "lg" ? "h-2.5 w-2.5" : "h-2 w-2")} />
              )}
            </span>
            <input
              type="radio"
              name={name}
              value={opt.value}
              checked={active === opt.value}
              disabled={opt.disabled}
              onChange={() => select(opt.value)}
              required={required}
              aria-required={required}
              aria-invalid={!!error}
              className="sr-only"
            />
            <div>
              <p className={cn("font-medium leading-tight", SIZE_TEXT[size])}>{opt.label}</p>
              {opt.description && <p className="text-xs text-muted-foreground mt-0.5">{opt.description}</p>}
            </div>
          </label>
        ))}
      </div>
      {error && <p className="text-sm text-destructive mt-1">{error}</p>}
    </div>
  )
}
