import * as React from "react"
import { cn } from "@/src/lib/utils"
import { Card, CardContent } from "./card"

export interface WidgetProps extends React.HTMLAttributes<HTMLDivElement> {
  // — Data
  title: string
  value: string | number
  previousValue?: string | number
  description?: string
  badge?: React.ReactNode
  footer?: React.ReactNode
  trendLabel?: string

  // — Icon
  icon?: React.ReactNode
  iconColor?: "primary" | "info" | "success" | "warning" | "danger" | "muted"

  // — Trend
  trend?: "up" | "down" | "neutral"
  trendValue?: string

  // — Progress
  progress?: number          // 0–100
  progressColor?: "primary" | "info" | "success" | "warning" | "danger"

  // — UI
  variant?: "default" | "glass" | "filled" | "outline"
  size?: "sm" | "md" | "lg"
  loading?: boolean

  // — Animation
  animate?: boolean          // count-up on value
  pulse?: boolean            // pulse ring on icon

  // — Interaction
  onClick?: () => void
}

const iconColorMap: Record<NonNullable<WidgetProps["iconColor"]>, string> = {
  primary: "bg-primary/10 text-primary",
  info:    "bg-info/10 text-info",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  danger:  "bg-danger/10 text-danger",
  muted:   "bg-muted text-muted-foreground",
}

const progressColorMap: Record<NonNullable<WidgetProps["progressColor"]>, string> = {
  primary: "bg-primary",
  info:    "bg-info",
  success: "bg-success",
  warning: "bg-warning",
  danger:  "bg-danger",
}

const sizeMap = {
  sm: { card: "p-4", value: "text-xl", icon: "h-9 w-9", iconSize: "h-4 w-4" },
  md: { card: "p-6", value: "text-2xl", icon: "h-12 w-12", iconSize: "h-6 w-6" },
  lg: { card: "p-8", value: "text-4xl", icon: "h-16 w-16", iconSize: "h-8 w-8" },
}

const variantMap: Record<NonNullable<WidgetProps["variant"]>, string> = {
  default: "",
  glass:   "glass",
  filled:  "bg-primary text-primary-foreground border-primary",
  outline: "bg-transparent border-2",
}

function useCountUp(target: number, enabled: boolean, duration = 1000) {
  const [display, setDisplay] = React.useState(enabled ? 0 : target)
  React.useEffect(() => {
    if (!enabled) { setDisplay(target); return }
    let start: number | null = null
    const step = (ts: number) => {
      if (!start) start = ts
      const progress = Math.min((ts - start) / duration, 1)
      setDisplay(Math.floor(progress * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [target, enabled, duration])
  return display
}

export function Widget({
  title,
  value,
  previousValue,
  description,
  badge,
  footer,
  trendLabel = "from last period",
  icon,
  iconColor = "primary",
  trend,
  trendValue,
  progress,
  progressColor = "primary",
  variant = "default",
  size = "md",
  loading = false,
  animate = false,
  pulse = false,
  onClick,
  className,
  ...props
}: WidgetProps) {
  const isNumeric = typeof value === "number"
  const counted = useCountUp(isNumeric ? (value as number) : 0, animate && isNumeric)
  const displayValue = animate && isNumeric ? counted : value

  const s = sizeMap[size]

  return (
    <Card
      className={cn(
        "overflow-hidden transition-all duration-200",
        variantMap[variant],
        onClick && "cursor-pointer hover:shadow-lg hover:-translate-y-0.5",
        className
      )}
      onClick={onClick}
      {...props}
    >
      <CardContent className={s.card}>
        {/* Header row */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium text-muted-foreground truncate">{title}</p>
              {badge && <span className="shrink-0">{badge}</span>}
            </div>

            {loading ? (
              <div className="h-8 w-24 animate-pulse rounded-md bg-muted" />
            ) : (
              <div className={cn("font-bold tabular-nums", s.value)}>{displayValue}</div>
            )}

            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
          </div>

          {icon && (
            <div className={cn(
              "relative flex shrink-0 items-center justify-center rounded-full",
              s.icon,
              iconColorMap[iconColor]
            )}>
              {pulse && (
                <span className="absolute inset-0 rounded-full animate-ping opacity-30 bg-current" />
              )}
              <span className={s.iconSize}>{icon}</span>
            </div>
          )}
        </div>

        {/* Trend */}
        {trendValue && !loading && (
          <div className="mt-3 flex items-center gap-1.5 text-sm">
            <span className={cn(
              "font-medium",
              trend === "up"      && "text-success",
              trend === "down"    && "text-danger",
              trend === "neutral" && "text-muted-foreground"
            )}>
              {trend === "up" && "↑ "}
              {trend === "down" && "↓ "}
              {trendValue}
            </span>
            {previousValue !== undefined && (
              <span className="text-muted-foreground">vs {previousValue}</span>
            )}
            <span className="text-muted-foreground">{trendLabel}</span>
          </div>
        )}

        {/* Progress bar */}
        {progress !== undefined && (
          <div className="mt-4 space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Progress</span>
              <span>{Math.min(100, Math.max(0, progress))}%</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
              <div
                className={cn("h-full rounded-full transition-all duration-700", progressColorMap[progressColor])}
                style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
              />
            </div>
          </div>
        )}

        {/* Footer */}
        {footer && <div className="mt-4 border-t pt-3 text-sm text-muted-foreground">{footer}</div>}
      </CardContent>
    </Card>
  )
}
