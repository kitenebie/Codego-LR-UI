import * as React from "react"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import { cn } from "@/src/lib/utils"
import { Animate, type AnimationType } from "./container"

export type StatTrend = "up" | "down" | "neutral"

export interface StatCardProps {
  title: React.ReactNode
  value: React.ReactNode
  change?: number
  changeLabel?: string
  trend?: StatTrend
  icon?: React.ReactNode
  sparkline?: number[]
  description?: string
  loading?: boolean
  animationType?: AnimationType
  animationDelay?: number
  className?: string
}

function Sparkline({ data, trend }: { data: number[]; trend?: StatTrend }) {
  if (data.length < 2) return null
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const w = 80
  const h = 32
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w
    const y = h - ((v - min) / range) * h
    return `${x},${y}`
  }).join(" ")

  const color = trend === "up" ? "stroke-success" : trend === "down" ? "stroke-danger" : "stroke-primary"

  return (
    <svg width={w} height={h} className="overflow-visible">
      <polyline
        points={pts}
        fill="none"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={color}
      />
    </svg>
  )
}

export function StatCard({
  title,
  value,
  change,
  changeLabel,
  trend,
  icon,
  sparkline,
  description,
  loading = false,
  animationType,
  animationDelay = 0,
  className,
}: StatCardProps) {
  const autoTrend: StatTrend = trend ?? (change === undefined ? "neutral" : change > 0 ? "up" : change < 0 ? "down" : "neutral")

  const TrendIcon = autoTrend === "up" ? TrendingUp : autoTrend === "down" ? TrendingDown : Minus
  const trendColor = autoTrend === "up" ? "text-success" : autoTrend === "down" ? "text-danger" : "text-muted-foreground"

  if (loading) {
    return (
      <div className={cn("rounded-xl glass p-5 space-y-3 animate-pulse", className)}>
        <div className="h-3 w-24 rounded bg-muted" />
        <div className="h-7 w-32 rounded bg-muted" />
        <div className="h-3 w-16 rounded bg-muted" />
      </div>
    )
  }

  const inner = (
    <div className={cn("rounded-xl glass p-5 space-y-3", className)}>
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm text-muted-foreground font-medium">{title}</p>
        {icon && (
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
            {icon}
          </span>
        )}
      </div>

      <div className="flex items-end justify-between gap-2">
        <p className="text-3xl font-bold tracking-tight">{value}</p>
        {sparkline && <Sparkline data={sparkline} trend={autoTrend} />}
      </div>

      <div className="flex items-center gap-1.5">
        {change !== undefined && (
          <span className={cn("flex items-center gap-0.5 text-xs font-semibold", trendColor)}>
            <TrendIcon className="h-3.5 w-3.5" />
            {change > 0 ? "+" : ""}{change}%
          </span>
        )}
        {changeLabel && <span className="text-xs text-muted-foreground">{changeLabel}</span>}
        {description && !changeLabel && <span className="text-xs text-muted-foreground">{description}</span>}
      </div>
    </div>
  )

  return animationType
    ? <Animate animationType={animationType} delay={animationDelay}>{inner}</Animate>
    : inner
}
