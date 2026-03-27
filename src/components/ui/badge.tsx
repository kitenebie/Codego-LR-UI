import * as React from "react"
import { cn } from "@/src/lib/utils"

export type BadgeVariant = "default" | "success" | "error" | "warning" | "info" | "outline" | "ghost"
export type BadgeSize = "sm" | "md" | "lg"

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
  size?: BadgeSize
  dot?: boolean
  rounded?: "md" | "full"
  icon?: React.ReactNode
  removable?: boolean
  onRemove?: () => void
}

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  default: "bg-primary/15 text-primary border-primary/20",
  success: "bg-success/15 text-success border-success/20",
  error:   "bg-danger/15 text-danger border-danger/20",
  warning: "bg-warning/15 text-warning border-warning/20",
  info:    "bg-info/15 text-info border-info/20",
  outline: "bg-transparent text-foreground border-border",
  ghost:   "bg-muted text-muted-foreground border-transparent",
}

const DOT_CLASSES: Record<BadgeVariant, string> = {
  default: "bg-primary",
  success: "bg-success",
  error:   "bg-danger",
  warning: "bg-warning",
  info:    "bg-info",
  outline: "bg-foreground",
  ghost:   "bg-muted-foreground",
}

const SIZE_CLASSES: Record<BadgeSize, string> = {
  sm: "px-1.5 py-0.5 text-[10px] gap-1",
  md: "px-2 py-0.5 text-xs gap-1.5",
  lg: "px-2.5 py-1 text-sm gap-1.5",
}

export function Badge({
  variant = "default",
  size = "md",
  dot = false,
  rounded = "full",
  icon,
  removable = false,
  onRemove,
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center border font-medium leading-none",
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        rounded === "full" ? "rounded-full" : "rounded-md",
        className
      )}
      {...props}
    >
      {dot && (
        <span className={cn("shrink-0 rounded-full", DOT_CLASSES[variant], size === "sm" ? "h-1.5 w-1.5" : "h-2 w-2")} />
      )}
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
      {removable && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onRemove?.() }}
          className="shrink-0 ml-0.5 opacity-60 hover:opacity-100 transition-opacity leading-none"
          aria-label="Remove"
        >
          ×
        </button>
      )}
    </span>
  )
}
