import * as React from "react"
import { cn } from "@/src/lib/utils"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./card"

// ─────────────────────────────────────────────
// Shared types
// ─────────────────────────────────────────────
export type TrendDir = "up" | "down" | "neutral"
export type SemanticColor = "primary" | "info" | "success" | "warning" | "danger" | "muted"

const semanticText: Record<SemanticColor, string> = {
  primary: "text-primary",
  info:    "text-info",
  success: "text-success",
  warning: "text-warning",
  danger:  "text-danger",
  muted:   "text-muted-foreground",
}
const semanticBg: Record<SemanticColor, string> = {
  primary: "bg-primary",
  info:    "bg-info",
  success: "bg-success",
  warning: "bg-warning",
  danger:  "bg-danger",
  muted:   "bg-muted-foreground",
}
const semanticFill: Record<SemanticColor, string> = {
  primary: "var(--color-primary)",
  info:    "var(--color-info)",
  success: "var(--color-success)",
  warning: "var(--color-warning)",
  danger:  "var(--color-danger)",
  muted:   "var(--color-muted-foreground)",
}

// ─────────────────────────────────────────────
// 1. StatsWidget  (enhanced stat card)
// ─────────────────────────────────────────────
export interface StatsWidgetProps {
  title: string
  value: string | number
  subtitle?: string
  icon?: React.ReactNode
  iconColor?: SemanticColor
  trend?: TrendDir
  trendValue?: string
  trendLabel?: string
  delta?: string | number          // absolute change shown separately
  sparkline?: number[]             // mini sparkline values
  sparklineColor?: SemanticColor
  progress?: number                // 0-100
  progressColor?: SemanticColor
  badge?: React.ReactNode
  footer?: React.ReactNode
  animate?: boolean
  loading?: boolean
  onClick?: () => void
  className?: string
}

function useTick(target: number, run: boolean) {
  const [v, setV] = React.useState(run ? 0 : target)
  React.useEffect(() => {
    if (!run) { setV(target); return }
    let start: number | null = null
    const tick = (ts: number) => {
      if (!start) start = ts
      const p = Math.min((ts - start) / 900, 1)
      setV(Math.round(p * target))
      if (p < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [target, run])
  return v
}

function Sparkline({ values, color = "primary" }: { values: number[]; color?: SemanticColor }) {
  if (values.length < 2) return null
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1
  const w = 80, h = 28
  const pts = values.map((v, i) => {
    const x = (i / (values.length - 1)) * w
    const y = h - ((v - min) / range) * h
    return `${x},${y}`
  }).join(" ")
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="overflow-visible">
      <polyline
        points={pts}
        fill="none"
        stroke={semanticFill[color]}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.8"
      />
      <polyline
        points={`0,${h} ${pts} ${w},${h}`}
        fill={semanticFill[color]}
        opacity="0.12"
      />
    </svg>
  )
}

export function StatsWidget({
  title, value, subtitle, icon, iconColor = "primary",
  trend, trendValue, trendLabel = "vs last period", delta,
  sparkline, sparklineColor = "primary",
  progress, progressColor = "primary",
  badge, footer, animate = false, loading = false,
  onClick, className,
}: StatsWidgetProps) {
  const isNum = typeof value === "number"
  const counted = useTick(isNum ? (value as number) : 0, animate && isNum && !loading)
  const display = animate && isNum ? counted : value

  return (
    <Card
      className={cn("overflow-hidden transition-all duration-200", onClick && "cursor-pointer hover:shadow-lg hover:-translate-y-0.5", className)}
      onClick={onClick}
    >
      <CardContent className="p-5">
        {/* Top row */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-medium text-muted-foreground truncate">{title}</span>
              {badge}
            </div>
            {loading
              ? <div className="h-8 w-28 animate-pulse rounded-md bg-muted" />
              : <div className="text-2xl font-bold tabular-nums">{display}</div>
            }
            {subtitle && <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>}
          </div>

          <div className="flex flex-col items-end gap-2 shrink-0">
            {icon && (
              <div className={cn("flex h-11 w-11 items-center justify-center rounded-xl", `bg-${iconColor}/10`, semanticText[iconColor])}>
                {icon}
              </div>
            )}
            {sparkline && <Sparkline values={sparkline} color={sparklineColor} />}
          </div>
        </div>

        {/* Trend + delta */}
        {(trendValue || delta !== undefined) && !loading && (
          <div className="mt-3 flex items-center gap-3 text-sm flex-wrap">
            {trendValue && (
              <span className={cn("inline-flex items-center gap-1 font-medium",
                trend === "up"      && "text-success",
                trend === "down"    && "text-danger",
                trend === "neutral" && "text-muted-foreground"
              )}>
                {trend === "up" && "↑"}{trend === "down" && "↓"} {trendValue}
                <span className="font-normal text-muted-foreground">{trendLabel}</span>
              </span>
            )}
            {delta !== undefined && (
              <span className="text-muted-foreground">Δ {delta}</span>
            )}
          </div>
        )}

        {/* Progress */}
        {progress !== undefined && !loading && (
          <div className="mt-3 space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Progress</span><span>{Math.min(100, Math.max(0, progress))}%</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
              <div
                className={cn("h-full rounded-full transition-all duration-700", semanticBg[progressColor])}
                style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
              />
            </div>
          </div>
        )}

        {footer && <div className="mt-3 border-t pt-3 text-xs text-muted-foreground">{footer}</div>}
      </CardContent>
    </Card>
  )
}

// ─────────────────────────────────────────────
// 2. ChartWidget  (bar / line / donut — pure SVG)
// ─────────────────────────────────────────────
export interface ChartDataPoint {
  label: string
  value: number
  color?: SemanticColor
}

export interface ChartWidgetProps {
  title: string
  description?: string
  data: ChartDataPoint[]
  type?: "bar" | "line" | "donut"
  color?: SemanticColor
  height?: number
  showLegend?: boolean
  showValues?: boolean
  showGrid?: boolean
  unit?: string
  action?: React.ReactNode
  footer?: React.ReactNode
  loading?: boolean
  className?: string
}

function BarChart({ data, color, height, showValues, showGrid, unit }: {
  data: ChartDataPoint[]; color: SemanticColor; height: number
  showValues?: boolean; showGrid?: boolean; unit?: string
}) {
  const max = Math.max(...data.map(d => d.value), 1)
  const W = 320, H = height, pad = { t: 8, b: 28, l: 4, r: 4 }
  const chartH = H - pad.t - pad.b
  const barW = Math.max(8, (W - pad.l - pad.r) / data.length - 6)

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height }}>
      {showGrid && [0.25, 0.5, 0.75, 1].map(f => {
        const y = pad.t + chartH * (1 - f)
        return <line key={f} x1={pad.l} x2={W - pad.r} y1={y} y2={y} stroke="currentColor" strokeOpacity="0.08" strokeWidth="1" />
      })}
      {data.map((d, i) => {
        const slotW = (W - pad.l - pad.r) / data.length
        const x = pad.l + i * slotW + (slotW - barW) / 2
        const barH = Math.max(2, (d.value / max) * chartH)
        const y = pad.t + chartH - barH
        const fill = semanticFill[d.color ?? color]
        return (
          <g key={i}>
            <rect x={x} y={y} width={barW} height={barH} rx="3" fill={fill} opacity="0.85" />
            {showValues && (
              <text x={x + barW / 2} y={y - 3} textAnchor="middle" fontSize="9" fill="currentColor" opacity="0.6">
                {d.value}{unit}
              </text>
            )}
            <text x={x + barW / 2} y={H - 6} textAnchor="middle" fontSize="9" fill="currentColor" opacity="0.5">
              {d.label}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

function LineChart({ data, color, height, showValues, showGrid, unit }: {
  data: ChartDataPoint[]; color: SemanticColor; height: number
  showValues?: boolean; showGrid?: boolean; unit?: string
}) {
  const max = Math.max(...data.map(d => d.value), 1)
  const W = 320, H = height, pad = { t: 12, b: 28, l: 8, r: 8 }
  const chartH = H - pad.t - pad.b
  const fill = semanticFill[color]

  const pts = data.map((d, i) => {
    const x = pad.l + (i / (data.length - 1)) * (W - pad.l - pad.r)
    const y = pad.t + chartH - (d.value / max) * chartH
    return { x, y, d }
  })
  const polyline = pts.map(p => `${p.x},${p.y}`).join(" ")
  const area = `${pts[0].x},${pad.t + chartH} ${polyline} ${pts[pts.length - 1].x},${pad.t + chartH}`

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height }}>
      {showGrid && [0.25, 0.5, 0.75, 1].map(f => {
        const y = pad.t + chartH * (1 - f)
        return <line key={f} x1={pad.l} x2={W - pad.r} y1={y} y2={y} stroke="currentColor" strokeOpacity="0.08" strokeWidth="1" />
      })}
      <polygon points={area} fill={fill} opacity="0.1" />
      <polyline points={polyline} fill="none" stroke={fill} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {pts.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="3.5" fill={fill} />
          {showValues && (
            <text x={p.x} y={p.y - 7} textAnchor="middle" fontSize="9" fill="currentColor" opacity="0.6">
              {p.d.value}{unit}
            </text>
          )}
          <text x={p.x} y={H - 6} textAnchor="middle" fontSize="9" fill="currentColor" opacity="0.5">
            {p.d.label}
          </text>
        </g>
      ))}
    </svg>
  )
}

function DonutChart({ data, color, height, showValues, unit }: {
  data: ChartDataPoint[]; color: SemanticColor; height: number
  showValues?: boolean; unit?: string
}) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1
  const cx = 80, cy = height / 2, r = Math.min(cx, cy) - 10, inner = r * 0.58
  let angle = -Math.PI / 2
  const defaultColors: SemanticColor[] = ["primary", "info", "success", "warning", "danger"]

  const slices = data.map((d, i) => {
    const sweep = (d.value / total) * 2 * Math.PI
    const start = angle
    angle += sweep
    const c = d.color ?? defaultColors[i % defaultColors.length]
    return { ...d, start, sweep, color: c }
  })

  const arc = (cx: number, cy: number, r: number, start: number, end: number) => {
    const x1 = cx + r * Math.cos(start), y1 = cy + r * Math.sin(start)
    const x2 = cx + r * Math.cos(end),   y2 = cy + r * Math.sin(end)
    const large = end - start > Math.PI ? 1 : 0
    return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`
  }

  return (
    <svg viewBox={`0 0 ${cx * 2 + 140} ${height}`} className="w-full" style={{ height }}>
      {slices.map((s, i) => (
        <path
          key={i}
          d={`${arc(cx, cy, r, s.start, s.start + s.sweep)} L ${cx + inner * Math.cos(s.start + s.sweep)} ${cy + inner * Math.sin(s.start + s.sweep)} A ${inner} ${inner} 0 ${s.sweep > Math.PI ? 1 : 0} 0 ${cx + inner * Math.cos(s.start)} ${cy + inner * Math.sin(s.start)} Z`}
          fill={semanticFill[s.color]}
          opacity="0.85"
        />
      ))}
      {/* center total */}
      <text x={cx} y={cy - 4} textAnchor="middle" fontSize="14" fontWeight="700" fill="currentColor">{total}{unit}</text>
      <text x={cx} y={cy + 12} textAnchor="middle" fontSize="9" fill="currentColor" opacity="0.5">total</text>
      {/* legend */}
      {slices.map((s, i) => (
        <g key={i} transform={`translate(${cx * 2 + 8}, ${i * 22 + 10})`}>
          <rect width="10" height="10" rx="2" fill={semanticFill[s.color]} opacity="0.85" />
          <text x="14" y="9" fontSize="10" fill="currentColor" opacity="0.7">
            {s.label} {showValues ? `— ${s.value}${unit ?? ""}` : `(${Math.round(s.value / total * 100)}%)`}
          </text>
        </g>
      ))}
    </svg>
  )
}

export function ChartWidget({
  title, description, data, type = "bar", color = "primary",
  height = 160, showLegend = false, showValues = false, showGrid = true,
  unit = "", action, footer, loading = false, className,
}: ChartWidgetProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div>
            <CardTitle className="text-base">{title}</CardTitle>
            {description && <CardDescription className="text-xs mt-0.5">{description}</CardDescription>}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      </CardHeader>
      <CardContent className="pt-0 pb-4 px-4">
        {loading ? (
          <div className="animate-pulse rounded-lg bg-muted" style={{ height }} />
        ) : type === "bar" ? (
          <BarChart data={data} color={color} height={height} showValues={showValues} showGrid={showGrid} unit={unit} />
        ) : type === "line" ? (
          <LineChart data={data} color={color} height={height} showValues={showValues} showGrid={showGrid} unit={unit} />
        ) : (
          <DonutChart data={data} color={color} height={height} showValues={showValues} unit={unit} />
        )}
        {footer && <div className="mt-3 border-t pt-3 text-xs text-muted-foreground">{footer}</div>}
      </CardContent>
    </Card>
  )
}

// ─────────────────────────────────────────────
// 3. TableWidget  (card-wrapped table with header controls)
// ─────────────────────────────────────────────
export interface TableWidgetProps {
  title: string
  description?: string
  action?: React.ReactNode
  footer?: React.ReactNode
  children: React.ReactNode   // pass <Table /> directly
  className?: string
}

export function TableWidget({ title, description, action, footer, children, className }: TableWidgetProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <CardTitle className="text-base">{title}</CardTitle>
            {description && <CardDescription className="text-xs mt-0.5">{description}</CardDescription>}
          </div>
          {action && <div className="shrink-0 flex items-center gap-2">{action}</div>}
        </div>
      </CardHeader>
      <CardContent className="pt-0 px-4 pb-4">
        {children}
        {footer && <div className="mt-3 border-t pt-3 text-xs text-muted-foreground">{footer}</div>}
      </CardContent>
    </Card>
  )
}

// ─────────────────────────────────────────────
// 4. ComposableWidget  (fully open slot-based widget)
// ─────────────────────────────────────────────
export interface ComposableWidgetProps {
  title?: string
  description?: string
  headerLeft?: React.ReactNode    // replaces title/description entirely
  headerRight?: React.ReactNode   // action area top-right
  toolbar?: React.ReactNode       // row below header, above body
  children: React.ReactNode       // body — anything goes
  footer?: React.ReactNode
  padding?: "none" | "sm" | "md"
  className?: string
}

export function ComposableWidget({
  title, description, headerLeft, headerRight,
  toolbar, children, footer,
  padding = "md", className,
}: ComposableWidgetProps) {
  const padMap = { none: "p-0", sm: "px-4 pb-4", md: "px-5 pb-5" }
  const hasHeader = title || description || headerLeft || headerRight

  return (
    <Card className={cn("overflow-hidden", className)}>
      {hasHeader && (
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            {headerLeft ?? (
              <div>
                {title && <CardTitle className="text-base">{title}</CardTitle>}
                {description && <CardDescription className="text-xs mt-0.5">{description}</CardDescription>}
              </div>
            )}
            {headerRight && <div className="shrink-0 flex items-center gap-2">{headerRight}</div>}
          </div>
        </CardHeader>
      )}
      {toolbar && (
        <div className="px-5 pb-3 flex items-center gap-2 flex-wrap border-b border-border/50">
          {toolbar}
        </div>
      )}
      <CardContent className={cn("pt-3", padMap[padding])}>
        {children}
        {footer && <div className="mt-4 border-t pt-3 text-xs text-muted-foreground">{footer}</div>}
      </CardContent>
    </Card>
  )
}

// ─────────────────────────────────────────────
// 5. MetricRow  (horizontal strip of mini stats)
// ─────────────────────────────────────────────
export interface MetricItem {
  label: string
  value: string | number
  trend?: TrendDir
  trendValue?: string
  color?: SemanticColor
}

export interface MetricRowProps {
  items: MetricItem[]
  divided?: boolean
  className?: string
}

export function MetricRow({ items, divided = true, className }: MetricRowProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-0">
        <div className={cn("grid", `grid-cols-${Math.min(items.length, 4)}`)}>
          {items.map((item, i) => (
            <div
              key={i}
              className={cn(
                "flex flex-col gap-1 px-5 py-4",
                divided && i > 0 && "border-l border-border"
              )}
            >
              <span className="text-xs font-medium text-muted-foreground">{item.label}</span>
              <span className={cn("text-xl font-bold tabular-nums", item.color && semanticText[item.color])}>
                {item.value}
              </span>
              {item.trendValue && (
                <span className={cn("text-xs font-medium",
                  item.trend === "up"      && "text-success",
                  item.trend === "down"    && "text-danger",
                  item.trend === "neutral" && "text-muted-foreground"
                )}>
                  {item.trend === "up" && "↑ "}{item.trend === "down" && "↓ "}{item.trendValue}
                </span>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
