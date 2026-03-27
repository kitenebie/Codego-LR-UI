import * as React from "react"
import { cn, FloatingPortal } from "@/src/lib/utils"

export type PopoverPlacement = "top" | "bottom" | "left" | "right" | "top-start" | "top-end" | "bottom-start" | "bottom-end"

export interface PopoverProps {
  trigger: React.ReactNode
  content: React.ReactNode
  placement?: PopoverPlacement
  triggerOn?: "click" | "hover"
  open?: boolean
  onOpenChange?: (open: boolean) => void
  className?: string
}

function calcStyle(triggerEl: HTMLElement, placement: PopoverPlacement): React.CSSProperties {
  const r = triggerEl.getBoundingClientRect()
  const GAP = 8
  switch (placement) {
    case "bottom":       return { top: r.bottom + GAP, left: r.left + r.width / 2, transform: "translateX(-50%)" }
    case "bottom-start": return { top: r.bottom + GAP, left: r.left }
    case "bottom-end":   return { top: r.bottom + GAP, left: r.right, transform: "translateX(-100%)" }
    case "top":          return { top: r.top - GAP, left: r.left + r.width / 2, transform: "translate(-50%, -100%)" }
    case "top-start":    return { top: r.top - GAP, left: r.left, transform: "translateY(-100%)" }
    case "top-end":      return { top: r.top - GAP, left: r.right, transform: "translate(-100%, -100%)" }
    case "left":         return { top: r.top + r.height / 2, left: r.left - GAP, transform: "translate(-100%, -50%)" }
    case "right":        return { top: r.top + r.height / 2, left: r.right + GAP, transform: "translateY(-50%)" }
  }
}

export function Popover({
  trigger,
  content,
  placement = "bottom-start",
  triggerOn = "click",
  open: controlled,
  onOpenChange,
  className,
}: PopoverProps) {
  const [internal, setInternal] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)
  const [popStyle, setPopStyle] = React.useState<React.CSSProperties>({})
  const open = controlled ?? internal

  function setOpen(v: boolean) {
    if (controlled === undefined) setInternal(v)
    onOpenChange?.(v)
  }

  function openPopover() {
    if (ref.current) {
      setPopStyle({ position: "fixed", zIndex: 9999, ...calcStyle(ref.current, placement) })
    }
    setOpen(true)
  }

  React.useEffect(() => {
    if (triggerOn !== "click") return
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [triggerOn])

  const hoverProps = triggerOn === "hover"
    ? { onMouseEnter: openPopover, onMouseLeave: () => setOpen(false) }
    : {}

  return (
    <div ref={ref} className="relative inline-block" {...hoverProps}>
      <div onClick={() => triggerOn === "click" && (open ? setOpen(false) : openPopover())}>
        {trigger}
      </div>
      {open && (
        <FloatingPortal>
          <div
            className={cn("min-w-max rounded-xl border border-border glass shadow-2xl", className)}
            style={popStyle}
          >
            {content}
          </div>
        </FloatingPortal>
      )}
    </div>
  )
}
