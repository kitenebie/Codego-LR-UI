import * as React from "react"
import { cn } from "@/src/lib/utils"

export interface ResizablePanelsProps {
  children: [React.ReactNode, React.ReactNode]
  orientation?: "horizontal" | "vertical"
  defaultSize?: number
  minSize?: number
  maxSize?: number
  handleClassName?: string
  className?: string
}

export function ResizablePanels({
  children,
  orientation = "horizontal",
  defaultSize = 50,
  minSize = 10,
  maxSize = 90,
  handleClassName,
  className,
}: ResizablePanelsProps) {
  const [size, setSize] = React.useState(defaultSize)
  const [dragging, setDragging] = React.useState(false)
  const containerRef = React.useRef<HTMLDivElement>(null)

  const isHorizontal = orientation === "horizontal"

  function onMouseDown(e: React.MouseEvent) {
    e.preventDefault()
    setDragging(true)
  }

  React.useEffect(() => {
    if (!dragging) return

    function onMove(e: MouseEvent) {
      const container = containerRef.current
      if (!container) return
      const rect = container.getBoundingClientRect()
      const pct = isHorizontal
        ? ((e.clientX - rect.left) / rect.width) * 100
        : ((e.clientY - rect.top) / rect.height) * 100
      setSize(Math.min(maxSize, Math.max(minSize, pct)))
    }

    function onUp() { setDragging(false) }

    document.addEventListener("mousemove", onMove)
    document.addEventListener("mouseup", onUp)
    return () => {
      document.removeEventListener("mousemove", onMove)
      document.removeEventListener("mouseup", onUp)
    }
  }, [dragging, isHorizontal, minSize, maxSize])

  return (
    <div
      ref={containerRef}
      className={cn(
        "flex overflow-hidden",
        isHorizontal ? "flex-row" : "flex-col",
        dragging && "select-none",
        className
      )}
    >
      {/* Panel A */}
      <div
        className="overflow-auto"
        style={isHorizontal ? { width: `${size}%` } : { height: `${size}%` }}
      >
        {children[0]}
      </div>

      {/* Handle */}
      <div
        onMouseDown={onMouseDown}
        className={cn(
          "shrink-0 flex items-center justify-center bg-border transition-colors hover:bg-primary/40 active:bg-primary/60",
          isHorizontal
            ? "w-1 cursor-col-resize hover:w-1.5"
            : "h-1 cursor-row-resize hover:h-1.5",
          dragging && (isHorizontal ? "w-1.5 bg-primary/60" : "h-1.5 bg-primary/60"),
          handleClassName
        )}
      >
        <div className={cn(
          "rounded-full bg-muted-foreground/40",
          isHorizontal ? "h-8 w-0.5" : "w-8 h-0.5"
        )} />
      </div>

      {/* Panel B */}
      <div
        className="flex-1 overflow-auto"
        style={isHorizontal ? { width: `${100 - size}%` } : { height: `${100 - size}%` }}
      >
        {children[1]}
      </div>
    </div>
  )
}
