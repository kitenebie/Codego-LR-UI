import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/src/lib/utils"

export type DrawerSide = "left" | "right" | "top" | "bottom"

export interface DrawerProps {
  open: boolean
  onClose: () => void
  side?: DrawerSide
  size?: string
  title?: React.ReactNode
  description?: React.ReactNode
  footer?: React.ReactNode
  overlay?: boolean
  closeOnOverlay?: boolean
  children?: React.ReactNode
  className?: string
}

const SIDE_CLASSES: Record<DrawerSide, { panel: string; enter: string; exit: string }> = {
  left:   { panel: "inset-y-0 left-0 h-full",  enter: "translate-x-0",    exit: "-translate-x-full" },
  right:  { panel: "inset-y-0 right-0 h-full", enter: "translate-x-0",    exit: "translate-x-full" },
  top:    { panel: "inset-x-0 top-0 w-full",   enter: "translate-y-0",    exit: "-translate-y-full" },
  bottom: { panel: "inset-x-0 bottom-0 w-full",enter: "translate-y-0",    exit: "translate-y-full" },
}

const DEFAULT_SIZE: Record<DrawerSide, string> = {
  left:   "w-80",
  right:  "w-80",
  top:    "h-64",
  bottom: "h-64",
}

export function Drawer({
  open,
  onClose,
  side = "right",
  size,
  title,
  description,
  footer,
  overlay = true,
  closeOnOverlay = true,
  children,
  className,
}: DrawerProps) {
  const { panel, enter, exit } = SIDE_CLASSES[side]
  const sizeClass = size ?? DEFAULT_SIZE[side]

  // Trap scroll
  React.useEffect(() => {
    if (open) document.body.style.overflow = "hidden"
    else document.body.style.overflow = ""
    return () => { document.body.style.overflow = "" }
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Overlay */}
      {overlay && (
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={() => closeOnOverlay && onClose()}
        />
      )}

      {/* Panel */}
      <div
        className={cn(
          "absolute flex flex-col glass border-border shadow-2xl transition-transform duration-300",
          panel,
          sizeClass,
          open ? enter : exit,
          side === "left" && "border-r",
          side === "right" && "border-l",
          side === "top" && "border-b",
          side === "bottom" && "border-t",
          className
        )}
      >
        {/* Header */}
        {(title || description) && (
          <div className="flex items-start justify-between gap-4 border-b border-border px-6 py-4 shrink-0">
            <div>
              {title && <h2 className="text-base font-semibold">{title}</h2>}
              {description && <p className="text-sm text-muted-foreground mt-0.5">{description}</p>}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
        {!(title || description) && (
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors z-10"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="shrink-0 border-t border-border px-6 py-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}
