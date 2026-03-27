import * as React from "react"
import { ChevronRight, MoreHorizontal } from "lucide-react"
import { cn } from "@/src/lib/utils"

export interface BreadcrumbItem {
  label: React.ReactNode
  href?: string
  icon?: React.ReactNode
  onClick?: () => void
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[]
  separator?: React.ReactNode
  maxItems?: number
  className?: string
}

export function Breadcrumb({
  items,
  separator = <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60" />,
  maxItems,
  className,
}: BreadcrumbProps) {
  const [expanded, setExpanded] = React.useState(false)

  const shouldCollapse = !expanded && maxItems && items.length > maxItems
  let visible: BreadcrumbItem[]

  if (shouldCollapse) {
    visible = [items[0], { label: "...", onClick: () => setExpanded(true) }, ...items.slice(-(maxItems - 1))]
  } else {
    visible = items
  }

  return (
    <nav aria-label="breadcrumb" className={cn("flex items-center flex-wrap gap-1", className)}>
      {visible.map((item, i) => {
        const isLast = i === visible.length - 1
        const isEllipsis = item.label === "..."

        return (
          <React.Fragment key={i}>
            {i > 0 && <span className="flex items-center">{separator}</span>}
            {isEllipsis ? (
              <button
                type="button"
                onClick={item.onClick}
                className="flex items-center justify-center h-5 w-5 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Show more"
              >
                <MoreHorizontal className="h-3.5 w-3.5" />
              </button>
            ) : isLast ? (
              <span className="flex items-center gap-1 text-sm font-medium text-foreground">
                {item.icon && <span className="shrink-0">{item.icon}</span>}
                {item.label}
              </span>
            ) : (
              <a
                href={item.href ?? "#"}
                onClick={(e) => { if (!item.href) e.preventDefault(); item.onClick?.() }}
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.icon && <span className="shrink-0">{item.icon}</span>}
                {item.label}
              </a>
            )}
          </React.Fragment>
        )
      })}
    </nav>
  )
}
