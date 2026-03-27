import * as React from "react"
import { cn } from "@/src/lib/utils"

export interface OtpInputProps {
  length?: number
  value?: string
  onChange?: (value: string) => void
  onComplete?: (value: string) => void
  mask?: boolean
  disabled?: boolean
  invalid?: boolean
  className?: string
  required?: boolean
  error?: string
}

export function OtpInput({
  length = 6,
  value: controlled,
  onChange,
  onComplete,
  mask = false,
  disabled = false,
  invalid = false,
  className,
  required,
  error,
}: OtpInputProps) {
  const [internal, setInternal] = React.useState("")
  const raw = controlled ?? internal
  const digits = raw.split("").slice(0, length)
  const refs = React.useRef<(HTMLInputElement | null)[]>([])

  function update(next: string) {
    if (!controlled) setInternal(next)
    onChange?.(next)
    if (next.length === length) onComplete?.(next)
  }

  function handleChange(idx: number, e: React.ChangeEvent<HTMLInputElement>) {
    const char = e.target.value.replace(/\D/g, "").slice(-1)
    const arr = digits.slice()
    arr[idx] = char
    const next = arr.join("").slice(0, length)
    update(next)
    if (char && idx < length - 1) refs.current[idx + 1]?.focus()
  }

  function handleKeyDown(idx: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace") {
      if (digits[idx]) {
        const arr = digits.slice()
        arr[idx] = ""
        update(arr.join(""))
      } else if (idx > 0) {
        refs.current[idx - 1]?.focus()
      }
    } else if (e.key === "ArrowLeft" && idx > 0) {
      refs.current[idx - 1]?.focus()
    } else if (e.key === "ArrowRight" && idx < length - 1) {
      refs.current[idx + 1]?.focus()
    }
  }

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault()
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length)
    update(pasted)
    const focusIdx = Math.min(pasted.length, length - 1)
    refs.current[focusIdx]?.focus()
  }

  return (
    <div className="flex flex-col gap-1">
      <div className={cn("flex items-center gap-2", className)}>
      {Array.from({ length }).map((_, i) => (
        <React.Fragment key={i}>
          <input
            ref={(el) => { refs.current[i] = el }}
            type={mask ? "password" : "text"}
            inputMode="numeric"
            maxLength={1}
            value={digits[i] ?? ""}
            disabled={disabled}
            onChange={(e) => handleChange(i, e)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onPaste={handlePaste}
            onFocus={(e) => e.target.select()}
            required={required}
            aria-required={required}
            aria-invalid={!!(error || invalid)}
            className={cn(
              "h-12 w-10 rounded-xl border-2 border-border text-center text-lg font-semibold bg-background transition-all outline-none dark:bg-gray-400/5 dark:hover:bg-gray-400/25 dark:focus:bg-gray-400/20",
              "focus:ring-2 focus:ring-ring focus:border-primary",
              invalid ? "border-danger focus:ring-danger" : "border-border",
              disabled && "opacity-50 cursor-not-allowed",
              digits[i] && "border-primary/60 bg-primary/5"
            )}
          />
          {i === Math.floor(length / 2) - 1 && length % 2 === 0 && (
            <span className="text-muted-foreground text-lg select-none">–</span>
          )}
        </React.Fragment>
      ))}
      </div>
      {error && <p className="text-sm text-destructive mt-1">{error}</p>}
    </div>
  )
}
