import * as React from "react"
import { cn } from "@/src/lib/utils"

export interface SliderProps {
  value?: number
  defaultValue?: number
  min?: number
  max?: number
  step?: number
  onChange?: (value: number) => void
  disabled?: boolean
  showTooltip?: boolean
  showMarks?: boolean
  marks?: { value: number; label?: string }[]
  label?: React.ReactNode
  showValue?: boolean
  className?: string
  required?: boolean
  error?: string
}

export interface RangeSliderProps {
  value?: [number, number]
  defaultValue?: [number, number]
  min?: number
  max?: number
  step?: number
  onChange?: (value: [number, number]) => void
  disabled?: boolean
  showTooltip?: boolean
  label?: React.ReactNode
  showValue?: boolean
  className?: string
  required?: boolean
  error?: string
}

function pct(val: number, min: number, max: number) {
  return ((val - min) / (max - min)) * 100
}

export function Slider({
  value: controlled,
  defaultValue = 0,
  min = 0,
  max = 100,
  step = 1,
  onChange,
  disabled = false,
  showTooltip = true,
  showMarks = false,
  marks,
  label,
  showValue = false,
  className,
  required,
  error,
}: SliderProps) {
  const [internal, setInternal] = React.useState(defaultValue)
  const [hovering, setHovering] = React.useState(false)
  const val = controlled ?? internal

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = Number(e.target.value)
    if (!controlled) setInternal(v)
    onChange?.(v)
  }

  const p = pct(val, min, max)

  return (
    <div className={cn("w-full space-y-2", className)} aria-required={required} aria-invalid={!!error}>
      {(label || showValue) && (
        <div className="flex items-center justify-between text-sm">
          {label && <span className="font-medium">{label}{required && <span className="text-destructive ml-1">*</span>}</span>}
          {showValue && <span className="text-muted-foreground tabular-nums">{val}</span>}
        </div>
      )}
      <div
        className="relative flex items-center h-5"
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
      >
        <div className="absolute w-full h-1.5 rounded-full bg-muted overflow-hidden">
          <div className="h-full rounded-full bg-primary" style={{ width: `${p}%` }} />
        </div>
        {showTooltip && hovering && !disabled && (
          <div
            className="absolute -top-8 -translate-x-1/2 bg-foreground text-background text-xs font-medium px-2 py-0.5 rounded-md pointer-events-none"
            style={{ left: `${p}%` }}
          >
            {val}
          </div>
        )}
        <input
          type="range"
          min={min} max={max} step={step}
          value={val}
          disabled={disabled}
          onChange={handleChange}
          required={required}
          aria-required={required}
          aria-invalid={!!error}
          className={cn(
            "absolute w-full h-full opacity-0 cursor-pointer",
            disabled && "cursor-not-allowed"
          )}
        />
        <div
          className={cn(
            "absolute h-4 w-4 rounded-full border-2 border-primary bg-background shadow-md transition-transform pointer-events-none",
            hovering && !disabled && "scale-110"
          )}
          style={{ left: `calc(${p}% - 8px)` }}
        />
      </div>
      {(showMarks || marks) && (
        <div className="relative w-full flex justify-between px-0">
          {(marks ?? [{ value: min }, { value: max }]).map((m) => (
            <div key={m.value} className="flex flex-col items-center gap-0.5" style={{ position: "absolute", left: `${pct(m.value, min, max)}%`, transform: "translateX(-50%)" }}>
              <span className="h-1 w-0.5 bg-border" />
              {m.label && <span className="text-[10px] text-muted-foreground">{m.label}</span>}
            </div>
          ))}
        </div>
      )}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}

export function RangeSlider({
  value: controlled,
  defaultValue = [20, 80],
  min = 0,
  max = 100,
  step = 1,
  onChange,
  disabled = false,
  showTooltip = true,
  label,
  showValue = false,
  className,
  required,
  error,
}: RangeSliderProps) {
  const [internal, setInternal] = React.useState<[number, number]>(defaultValue)
  const [active, setActive] = React.useState<0 | 1 | null>(null)
  const val = controlled ?? internal

  function handleChange(idx: 0 | 1, e: React.ChangeEvent<HTMLInputElement>) {
    const v = Number(e.target.value)
    const next: [number, number] = idx === 0
      ? [Math.min(v, val[1] - step), val[1]]
      : [val[0], Math.max(v, val[0] + step)]
    if (!controlled) setInternal(next)
    onChange?.(next)
  }

  const p0 = pct(val[0], min, max)
  const p1 = pct(val[1], min, max)

  return (
    <div className={cn("w-full space-y-2", className)} aria-required={required} aria-invalid={!!error}>
      {(label || showValue) && (
        <div className="flex items-center justify-between text-sm">
          {label && <span className="font-medium">{label}{required && <span className="text-destructive ml-1">*</span>}</span>}
          {showValue && <span className="text-muted-foreground tabular-nums">{val[0]} – {val[1]}</span>}
        </div>
      )}
      <div className="relative flex items-center h-5">
        <div className="absolute w-full h-1.5 rounded-full bg-muted">
          <div className="absolute h-full rounded-full bg-primary" style={{ left: `${p0}%`, width: `${p1 - p0}%` }} />
        </div>
        {[0, 1].map((idx) => {
          const p = idx === 0 ? p0 : p1
          return (
            <React.Fragment key={idx}>
              {showTooltip && active === idx && !disabled && (
                <div
                  className="absolute -top-8 -translate-x-1/2 bg-foreground text-background text-xs font-medium px-2 py-0.5 rounded-md pointer-events-none z-10"
                  style={{ left: `${p}%` }}
                >
                  {val[idx]}
                </div>
              )}
              <input
                type="range"
                min={min} max={max} step={step}
                value={val[idx]}
                disabled={disabled}
                onChange={(e) => handleChange(idx as 0 | 1, e)}
                onMouseDown={() => setActive(idx as 0 | 1)}
                onMouseUp={() => setActive(null)}
                required={required}
                aria-required={required}
                aria-invalid={!!error}
                className="absolute w-full h-full opacity-0 cursor-pointer"
                style={{ zIndex: idx === 1 ? 2 : 1 }}
              />
              <div
                className="absolute h-4 w-4 rounded-full border-2 border-primary bg-background shadow-md pointer-events-none"
                style={{ left: `calc(${p}% - 8px)`, zIndex: 3 }}
              />
            </React.Fragment>
          )
        })}
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
