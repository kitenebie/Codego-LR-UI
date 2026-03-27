import * as React from "react"
import { cn } from "@/src/lib/utils"

export type ProgressVariant = "default" | "success" | "error" | "warning" | "info"
export type ProgressSize = "xs" | "sm" | "md" | "lg"

export interface ProgressProps {
  value?: number
  max?: number
  variant?: ProgressVariant
  size?: ProgressSize
  label?: React.ReactNode
  showValue?: boolean
  animated?: boolean
  striped?: boolean
  indeterminate?: boolean
  className?: string
}

export interface CircularProgressProps {
  value?: number
  max?: number
  variant?: ProgressVariant
  size?: number
  strokeWidth?: number
  label?: React.ReactNode
  showValue?: boolean
  indeterminate?: boolean
  className?: string
}

const BAR_COLOR: Record<ProgressVariant, string> = {
  default: "bg-primary",
  success: "bg-success",
  error:   "bg-danger",
  warning: "bg-warning",
  info:    "bg-info",
}

const STROKE_COLOR: Record<ProgressVariant, string> = {
  default: "stroke-primary",
  success: "stroke-success",
  error:   "stroke-danger",
  warning: "stroke-warning",
  info:    "stroke-info",
}

const HEIGHT: Record<ProgressSize, string> = {
  xs: "h-1",
  sm: "h-1.5",
  md: "h-2.5",
  lg: "h-4",
}

export function Progress({
  value = 0,
  max = 100,
  variant = "default",
  size = "md",
  label,
  showValue = false,
  animated = false,
  striped = false,
  indeterminate = false,
  className,
}: ProgressProps) {
  const pct = indeterminate ? 100 : Math.min(100, Math.max(0, (value / max) * 100))

  return (
    <div className={cn("w-full space-y-1.5", className)}>
      {(label || showValue) && (
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          {label && <span>{label}</span>}
          {showValue && !indeterminate && <span>{Math.round(pct)}%</span>}
        </div>
      )}
      <div className={cn("w-full overflow-hidden rounded-full bg-muted", HEIGHT[size])}>
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500",
            BAR_COLOR[variant],
            striped && "bg-[repeating-linear-gradient(45deg,transparent,transparent_6px,rgba(255,255,255,0.15)_6px,rgba(255,255,255,0.15)_12px)]",
            animated && !indeterminate && "transition-none animate-pulse",
            indeterminate && "animate-[indeterminate_1.5s_ease-in-out_infinite]",
          )}
          style={{ width: indeterminate ? "40%" : `${pct}%` }}
        />
      </div>
    </div>
  )
}

export function CircularProgress({
  value = 0,
  max = 100,
  variant = "default",
  size = 64,
  strokeWidth = 6,
  label,
  showValue = false,
  indeterminate = false,
  className,
}: CircularProgressProps) {
  const r = (size - strokeWidth) / 2
  const circ = 2 * Math.PI * r
  const pct = indeterminate ? 0.75 : Math.min(1, Math.max(0, value / max))
  const dash = pct * circ

  return (
    <div className={cn("inline-flex flex-col items-center gap-1", className)}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className={cn(indeterminate && "animate-spin")}>
          <circle
            cx={size / 2} cy={size / 2} r={r}
            fill="none"
            strokeWidth={strokeWidth}
            className="stroke-muted"
          />
          <circle
            cx={size / 2} cy={size / 2} r={r}
            fill="none"
            strokeWidth={strokeWidth}
            strokeDasharray={`${dash} ${circ}`}
            strokeLinecap="round"
            className={cn("transition-all duration-500", STROKE_COLOR[variant])}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </svg>
        {showValue && !indeterminate && (
          <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold">
            {Math.round(pct * 100)}%
          </span>
        )}
      </div>
      {label && <span className="text-xs text-muted-foreground">{label}</span>}
    </div>
  )
}
