import * as React from "react"
import { cn } from "@/src/lib/utils"

export type TabVariant = "line" | "pill" | "boxed" | "lifted"
export type TabSize = "sm" | "md" | "lg"

export interface TabItem {
  value: string
  label: React.ReactNode
  icon?: React.ReactNode
  badge?: React.ReactNode
  disabled?: boolean
  content?: React.ReactNode
}

export interface TabsProps {
  items: TabItem[]
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  variant?: TabVariant
  size?: TabSize
  fullWidth?: boolean
  className?: string
}

const sizeMap: Record<TabSize, string> = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2 text-sm",
  lg: "px-5 py-2.5 text-base",
}

const variantTrack: Record<TabVariant, string> = {
  line:   "border-b border-border gap-0",
  pill:   "bg-muted/50 rounded-xl p-1 gap-1",
  boxed:  "border border-border rounded-xl p-1 gap-1",
  lifted: "gap-0",
}

function tabClass(variant: TabVariant, size: TabSize, active: boolean, disabled: boolean) {
  const base = cn(
    "inline-flex items-center gap-2 font-medium transition-all duration-150 select-none whitespace-nowrap",
    sizeMap[size],
    disabled && "opacity-40 cursor-not-allowed pointer-events-none"
  )
  if (variant === "line") return cn(base, "rounded-none border-b-2 -mb-px",
    active ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground hover:border-border")
  if (variant === "pill") return cn(base, "rounded-lg",
    active ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground hover:bg-background/60")
  if (variant === "boxed") return cn(base, "rounded-lg",
    active ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")
  if (variant === "lifted") return cn(base, "rounded-t-lg border border-b-0",
    active ? "border-border bg-background text-foreground -mb-px" : "border-transparent text-muted-foreground hover:text-foreground")
  return base
}

export function Tabs({
  items,
  value: controlledValue,
  defaultValue,
  onChange,
  variant = "line",
  size = "md",
  fullWidth = false,
  className,
}: TabsProps) {
  const [internal, setInternal] = React.useState(defaultValue ?? items[0]?.value ?? "")
  const active = controlledValue ?? internal

  const select = (v: string) => {
    if (!controlledValue) setInternal(v)
    onChange?.(v)
  }

  const activeItem = items.find((i) => i.value === active)

  return (
    <div className={cn("w-full", className)}>
      {/* Tab bar */}
      <div className={cn("flex", fullWidth && "w-full", variantTrack[variant])}>
        {items.map((item) => (
          <button
            key={item.value}
            type="button"
            disabled={item.disabled}
            onClick={() => select(item.value)}
            className={cn(
              tabClass(variant, size, active === item.value, !!item.disabled),
              fullWidth && "flex-1 justify-center"
            )}
          >
            {item.icon && <span className="shrink-0">{item.icon}</span>}
            {item.label}
            {item.badge && <span className="shrink-0">{item.badge}</span>}
          </button>
        ))}
      </div>

      {/* Panel */}
      {activeItem?.content && (
        <div className="mt-4">{activeItem.content}</div>
      )}
    </div>
  )
}
