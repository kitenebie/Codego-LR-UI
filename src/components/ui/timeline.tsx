import * as React from "react"
import { CheckCircle, XCircle, AlertTriangle, Info, Circle } from "lucide-react"
import { cn } from "@/src/lib/utils"

export type TimelineVariant = "default" | "success" | "error" | "warning" | "info"

export interface TimelineItem {
  id?: string
  title: React.ReactNode
  description?: React.ReactNode
  time?: React.ReactNode
  icon?: React.ReactNode
  variant?: TimelineVariant
  content?: React.ReactNode
}

export interface TimelineProps {
  items: TimelineItem[]
  align?: "left" | "alternate"
  className?: string
}

const DOT_COLOR: Record<TimelineVariant, string> = {
  default: "bg-primary border-primary/30",
  success: "bg-success border-success/30",
  error:   "bg-danger border-danger/30",
  warning: "bg-warning border-warning/30",
  info:    "bg-info border-info/30",
}

const ICON_COLOR: Record<TimelineVariant, string> = {
  default: "text-primary",
  success: "text-success",
  error:   "text-danger",
  warning: "text-warning",
  info:    "text-info",
}

const DEFAULT_ICON: Record<TimelineVariant, React.ReactNode> = {
  default: <Circle className="h-3 w-3" />,
  success: <CheckCircle className="h-3.5 w-3.5" />,
  error:   <XCircle className="h-3.5 w-3.5" />,
  warning: <AlertTriangle className="h-3.5 w-3.5" />,
  info:    <Info className="h-3.5 w-3.5" />,
}

export function Timeline({ items, align = "left", className }: TimelineProps) {
  return (
    <div className={cn("relative", className)}>
      {items.map((item, i) => {
        const variant = item.variant ?? "default"
        const isLast = i === items.length - 1
        const isRight = align === "alternate" && i % 2 === 1

        return (
          <div key={item.id ?? i} className={cn("relative flex gap-4", align === "alternate" && "justify-center", isRight && "flex-row-reverse")}>
            {/* Line + dot column */}
            <div className="flex flex-col items-center">
              <div className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 z-10",
                item.icon ? "bg-background border-border" : DOT_COLOR[variant]
              )}>
                <span className={cn("shrink-0", item.icon ? ICON_COLOR[variant] : "text-white")}>
                  {item.icon ?? DEFAULT_ICON[variant]}
                </span>
              </div>
              {!isLast && <div className="w-0.5 flex-1 bg-border mt-1 mb-1 min-h-4" />}
            </div>

            {/* Content */}
            <div className={cn("flex-1 pb-6 min-w-0", isRight && "text-right")}>
              <div className={cn("flex items-start justify-between gap-2", isRight && "flex-row-reverse")}>
                <p className="text-sm font-semibold leading-tight">{item.title}</p>
                {item.time && <span className="shrink-0 text-xs text-muted-foreground whitespace-nowrap">{item.time}</span>}
              </div>
              {item.description && (
                <p className="mt-0.5 text-xs text-muted-foreground leading-snug">{item.description}</p>
              )}
              {item.content && <div className="mt-2">{item.content}</div>}
            </div>
          </div>
        )
      })}
    </div>
  )
}
