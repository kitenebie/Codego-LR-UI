import * as React from "react"
import { Check, X } from "lucide-react"
import { cn } from "@/src/lib/utils"

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  inline?: boolean
  label?: React.ReactNode
  accepted?: boolean
  acceptedColor?: string
  declined?: boolean
  declinedColor?: string
  height?: number | string
  width?: number | string
  required?: boolean
  error?: string
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, inline = false, label, accepted = false, acceptedColor, declined = false, declinedColor, height, width, id, required, error, ...props }, ref) => {
    const checkboxId = id ?? React.useId()
    const resolvedW = width  ? (typeof width  === "number" ? `${width}px`  : width)  : "1rem"
    const resolvedH = height ? (typeof height === "number" ? `${height}px` : height) : "1rem"
    const stateColor = accepted ? (acceptedColor ?? "#22c55e") : declined ? (declinedColor ?? "#ef4444") : undefined

    const box = (
      <div className="relative flex items-center shrink-0" style={{ width: resolvedW, height: resolvedH }}>
        <input
          type="checkbox"
          id={checkboxId}
          style={stateColor ? { backgroundColor: stateColor, borderColor: stateColor } : undefined}
          className={cn(
            "peer h-full w-full shrink-0 appearance-none rounded-sm border border-slate-400/50 bg-background/50 backdrop-blur-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 checked:bg-primary checked:border-primary transition-colors",
            error && "border-destructive",
            className
          )}
          ref={ref}
          required={required}
          aria-required={required}
          aria-invalid={!!error}
          {...props}
        />
        {declined ? (
          <X className="pointer-events-none absolute inset-0 m-auto h-3/4 w-3/4 text-white" />
        ) : (
          <Check className={cn(
            "pointer-events-none absolute inset-0 m-auto h-3/4 w-3/4 text-primary-foreground",
            accepted ? "block" : "hidden peer-checked:block"
          )} />
        )}
      </div>
    )

    if (inline && label) {
      return (
        <div className="flex flex-col gap-1">
          <label htmlFor={checkboxId} className="inline-flex items-center gap-2 cursor-pointer select-none">
            {box}
            <span className="text-sm">{label}{required && <span className="text-destructive ml-1">*</span>}</span>
          </label>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
      )
    }

    return box
  }
)
Checkbox.displayName = "Checkbox"

export { Checkbox }
