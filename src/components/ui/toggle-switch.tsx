import * as React from "react"
import { cn } from "@/src/lib/utils"

export interface ToggleSwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  inline?: boolean
  label?: React.ReactNode
  accepted?: boolean
  acceptedColor?: string
  declined?: boolean
  declinedColor?: string
  width?: number | string
  height?: number | string
  required?: boolean
  error?: string
}

const ToggleSwitch = React.forwardRef<HTMLInputElement, ToggleSwitchProps>(
  ({
    className,
    inline = false,
    label,
    accepted = false,
    acceptedColor,
    declined = false,
    declinedColor,
    width,
    height,
    id,
    checked,
    defaultChecked,
    onChange,
    disabled,
    required,
    error,
    ...props
  }, ref) => {
    const toggleId = id ?? React.useId()

    const trackW = width  ? (typeof width  === "number" ? `${width}px`  : width)  : "2.75rem"
    const trackH = height ? (typeof height === "number" ? `${height}px` : height) : "1.5rem"

    const [internalChecked, setInternalChecked] = React.useState(defaultChecked ?? false)
    const isControlled = checked !== undefined
    const isOn = accepted ? true : declined ? false : (isControlled ? checked : internalChecked)

    const stateColor = accepted
      ? (acceptedColor ?? "#22c55e")
      : declined
      ? (declinedColor ?? "#ef4444")
      : isOn
      ? undefined  // falls back to primary via className
      : undefined

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (accepted || declined || disabled) return
      if (!isControlled) setInternalChecked(e.target.checked)
      onChange?.(e)
    }

    const toggle = (
      <label
        htmlFor={toggleId}
        className={cn("relative inline-flex items-center cursor-pointer", disabled && "opacity-50 cursor-not-allowed")}
      >
        <input
          type="checkbox"
          id={toggleId}
          className="sr-only peer"
          ref={ref}
          checked={isOn}
          disabled={disabled}
          onChange={handleChange}
          required={required}
          aria-required={required}
          aria-invalid={!!error}
          {...props}
        />
        {/* Track */}
        <div
          className={cn(
            "relative rounded-full border border-slate-300/50 backdrop-blur-sm transition-colors duration-200 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
            !stateColor && (isOn ? "bg-primary" : "bg-muted/50"),
            className
          )}
          style={{
            width: trackW,
            height: trackH,
            ...(stateColor ? { backgroundColor: stateColor } : {}),
          }}
        >
          {/* Thumb */}
          <span
            className={`absolute top-[1px] ${isOn ? "bg-slate-50/40":"bg-primary"} rounded-full border border-slate-300/50 shadow transition-transform duration-200`}
            style={{
              width:  `calc(${trackH} - 4px)`,
              height: `calc(${trackH} - 4px)`,
              left: "1px",
              transform: isOn ? `translateX(calc(${trackW} - ${trackH}))` : "translateX(0)",
            }}
          />
        </div>
      </label>
    )

    if (inline && label) {
      return (
        <div className="flex flex-col gap-1">
          <div className="inline-flex items-center gap-2 select-none">
            {toggle}
            <label htmlFor={toggleId} className={cn("text-sm cursor-pointer", disabled && "opacity-50 cursor-not-allowed")}>
              {label}{required && <span className="text-destructive ml-1">*</span>}
            </label>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
      )
    }

    return toggle
  }
)
ToggleSwitch.displayName = "ToggleSwitch"

export { ToggleSwitch }
