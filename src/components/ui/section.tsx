import * as React from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/src/lib/utils"
import { Animate, type AnimationType } from "./container"

export type SectionVariant = "default" | "card" | "bordered" | "ghost"

export interface SectionProps {
  title?: React.ReactNode
  description?: React.ReactNode
  icon?: React.ReactNode
  action?: React.ReactNode
  children: React.ReactNode
  variant?: SectionVariant
  collapsible?: boolean
  defaultOpen?: boolean
  divider?: boolean
  animationType?: AnimationType
  animationDelay?: number
  className?: string
  contentClassName?: string
}

const variantWrap: Record<SectionVariant, string> = {
  default:  "",
  card:     "rounded-xl glass shadow-lg overflow-hidden",
  bordered: "rounded-xl border border-border overflow-hidden",
  ghost:    "rounded-xl bg-muted/20 overflow-hidden",
}

const variantHeader: Record<SectionVariant, string> = {
  default:  "pb-3",
  card:     "px-6 pt-6 pb-4",
  bordered: "px-5 pt-5 pb-4",
  ghost:    "px-5 pt-5 pb-4",
}

const variantBody: Record<SectionVariant, string> = {
  default:  "",
  card:     "px-6 pb-6",
  bordered: "px-5 pb-5",
  ghost:    "px-5 pb-5",
}

export function SectionBlock({
  title,
  description,
  icon,
  action,
  children,
  variant = "default",
  collapsible = false,
  defaultOpen = true,
  divider = false,
  animationType,
  animationDelay = 0,
  className,
  contentClassName,
}: SectionProps) {
  const [open, setOpen] = React.useState(defaultOpen)

  if (animationType) {
    return (
      <Animate animationType={animationType} delay={animationDelay} className={cn(variantWrap[variant], className)}>
        <SectionBlock
          title={title} description={description} icon={icon} action={action}
          variant={variant} collapsible={collapsible} defaultOpen={defaultOpen}
          divider={divider} contentClassName={contentClassName}
          className=""
        >
          {children}
        </SectionBlock>
      </Animate>
    )
  }

  return (
    <div className={cn(variantWrap[variant], className)}>
      {(title || description || action) && (
        <div
          className={cn(
            "flex items-start justify-between gap-3",
            variantHeader[variant],
            collapsible && "cursor-pointer select-none",
            divider && "border-b border-border pb-4"
          )}
          onClick={collapsible ? () => setOpen((o) => !o) : undefined}
        >
          <div className="flex items-start gap-3 min-w-0">
            {icon && (
              <span className="mt-0.5 shrink-0 text-primary">{icon}</span>
            )}
            <div className="min-w-0">
              {title && (
                <h3 className="text-base font-semibold leading-tight">{title}</h3>
              )}
              {description && (
                <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
              )}
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {action && <div onClick={(e) => e.stopPropagation()}>{action}</div>}
            {collapsible && (
              <ChevronDown
                className={cn(
                  "h-4 w-4 text-muted-foreground transition-transform duration-200",
                  open && "rotate-180"
                )}
              />
            )}
          </div>
        </div>
      )}

      {(!collapsible || open) && (
        <div className={cn(variantBody[variant], contentClassName)}>
          {children}
        </div>
      )}
    </div>
  )
}
