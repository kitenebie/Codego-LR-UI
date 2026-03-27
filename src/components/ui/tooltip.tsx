import * as React from "react"
import * as ReactDOM from "react-dom"
import { cn } from "@/src/lib/utils"

export interface TooltipProps {
  content: React.ReactNode
  children: React.ReactNode
  /** Side to show the tooltip, default "right" */
  side?: "right" | "left" | "top" | "bottom"
  className?: string
  /** Only render the tooltip when enabled */
  enabled?: boolean
}

export function Tooltip({
  content,
  children,
  side = "right",
  className,
  enabled = true,
}: TooltipProps) {
  const [visible, setVisible] = React.useState(false)
  const [coords, setCoords] = React.useState({ top: 0, left: 0 })
  const ref = React.useRef<HTMLDivElement>(null)

  if (!enabled) return <>{children}</>

  function calcCoords() {
    const r = ref.current?.getBoundingClientRect()
    if (!r) return
    const GAP = 8
    switch (side) {
      case "right":  setCoords({ top: r.top + r.height / 2, left: r.right + GAP }); break
      case "left":   setCoords({ top: r.top + r.height / 2, left: r.left - GAP }); break
      case "top":    setCoords({ top: r.top - GAP,          left: r.left + r.width / 2 }); break
      case "bottom": setCoords({ top: r.bottom + GAP,       left: r.left + r.width / 2 }); break
    }
  }

  const transformClass = {
    right:  "-translate-y-1/2",
    left:   "-translate-y-1/2 -translate-x-full",
    top:    "-translate-x-1/2 -translate-y-full",
    bottom: "-translate-x-1/2",
  }[side]

  return (
    <div
      ref={ref}
      className="relative inline-flex"
      onMouseEnter={() => { calcCoords(); setVisible(true) }}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => { calcCoords(); setVisible(true) }}
      onBlur={() => setVisible(false)}
    >
      {children}
      {visible && ReactDOM.createPortal(
        <div
          role="tooltip"
          style={{ top: coords.top, left: coords.left }}
          className={cn(
            "fixed z-[9999] whitespace-nowrap rounded-md bg-foreground px-2.5 py-1 text-xs font-medium text-background shadow-lg pointer-events-none",
            transformClass,
            className
          )}
        >
          {content}
        </div>,
        document.body
      )}
    </div>
  )
}
