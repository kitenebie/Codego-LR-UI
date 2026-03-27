import * as React from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/src/lib/utils"

export type AccordionVariant = "default" | "bordered" | "separated" | "ghost"

export interface AccordionItem {
  value: string
  trigger: React.ReactNode
  content: React.ReactNode
  icon?: React.ReactNode
  disabled?: boolean
}

export interface AccordionProps {
  items: AccordionItem[]
  type?: "single" | "multiple"
  defaultValue?: string | string[]
  value?: string | string[]
  onChange?: (value: string | string[]) => void
  variant?: AccordionVariant
  className?: string
}

const VARIANT_WRAP: Record<AccordionVariant, string> = {
  default:   "divide-y divide-border rounded-xl border border-border overflow-hidden",
  bordered:  "space-y-2",
  separated: "space-y-2",
  ghost:     "space-y-1",
}

const VARIANT_ITEM: Record<AccordionVariant, string> = {
  default:   "",
  bordered:  "rounded-xl border border-border overflow-hidden",
  separated: "rounded-xl glass overflow-hidden",
  ghost:     "rounded-lg overflow-hidden",
}

const VARIANT_TRIGGER: Record<AccordionVariant, string> = {
  default:   "px-4 hover:bg-accent/50",
  bordered:  "px-4 hover:bg-accent/50",
  separated: "px-4 hover:bg-accent/30",
  ghost:     "px-3 hover:bg-accent/50",
}

export function Accordion({
  items,
  type = "single",
  defaultValue,
  value: controlledValue,
  onChange,
  variant = "default",
  className,
}: AccordionProps) {
  const init = defaultValue ?? (type === "multiple" ? [] : "")
  const [internal, setInternal] = React.useState<string | string[]>(init)
  const active = controlledValue ?? internal

  function toggle(val: string) {
    let next: string | string[]
    if (type === "multiple") {
      const arr = active as string[]
      next = arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val]
    } else {
      next = active === val ? "" : val
    }
    if (!controlledValue) setInternal(next)
    onChange?.(next)
  }

  function isOpen(val: string) {
    return type === "multiple" ? (active as string[]).includes(val) : active === val
  }

  return (
    <div className={cn(VARIANT_WRAP[variant], className)}>
      {items.map((item) => {
        const open = isOpen(item.value)
        return (
          <div key={item.value} className={VARIANT_ITEM[variant]}>
            <button
              type="button"
              disabled={item.disabled}
              onClick={() => toggle(item.value)}
              className={cn(
                "flex w-full items-center justify-between py-4 text-sm font-medium transition-colors",
                VARIANT_TRIGGER[variant],
                item.disabled && "opacity-40 cursor-not-allowed pointer-events-none",
                open && "text-primary"
              )}
            >
              <span className="flex items-center gap-2">
                {item.icon && <span className="shrink-0 text-muted-foreground">{item.icon}</span>}
                {item.trigger}
              </span>
              <ChevronDown
                className={cn("h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200", open && "rotate-180")}
              />
            </button>
            <div
              className={cn(
                "overflow-hidden transition-all duration-200",
                open ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
              )}
            >
              <div className={cn("pb-4 text-sm text-muted-foreground", variant === "ghost" ? "px-3" : "px-4")}>
                {item.content}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
