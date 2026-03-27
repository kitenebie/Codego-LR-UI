import * as React from "react"
import { cn, getPortalPosition, FloatingPortal } from "@/src/lib/utils"

const SWATCHES = [
  "#ef4444","#f97316","#f59e0b","#22c55e","#14b8a6",
  "#3b82f6","#6366f1","#8b5cf6","#ec4899","#64748b",
  "#000000","#ffffff",
]

export interface ColorPickerProps {
  value?: string
  defaultValue?: string
  onChange?: (color: string) => void
  showOpacity?: boolean
  showSwatches?: boolean
  disabled?: boolean
  className?: string
  required?: boolean
  error?: string
}

function isValidHex(hex: string) {
  return /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(hex)
}

export function ColorPicker({
  value: controlled,
  defaultValue = "#6366f1",
  onChange,
  showOpacity = false,
  showSwatches = true,
  disabled = false,
  className,
  required,
  error,
}: ColorPickerProps) {
  const [internal, setInternal] = React.useState(defaultValue)
  const [open, setOpen] = React.useState(false)
  const [hex, setHex] = React.useState(defaultValue)
  const [opacity, setOpacity] = React.useState(100)
  const [recent, setRecent] = React.useState<string[]>([])
  const ref = React.useRef<HTMLDivElement>(null)
  const triggerRef = React.useRef<HTMLButtonElement>(null)
  const [dropStyle, setDropStyle] = React.useState<React.CSSProperties>({})

  const color = controlled ?? internal

  React.useEffect(() => { setHex(color) }, [color])

  React.useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  function openPicker() {
    if (triggerRef.current) {
      const pos = getPortalPosition(triggerRef.current, 280)
      setDropStyle({
        position: "fixed",
        top: pos.placement === "bottom" ? pos.top : undefined,
        bottom: pos.placement === "top" ? window.innerHeight - pos.top : undefined,
        left: pos.left,
        zIndex: 9999,
      })
    }
    setOpen(true)
  }

  function apply(c: string) {
    if (!controlled) setInternal(c)
    onChange?.(c)
    setRecent((prev) => [c, ...prev.filter((x) => x !== c)].slice(0, 8))
  }

  function handleHexInput(val: string) {
    const v = val.startsWith("#") ? val : `#${val}`
    setHex(v)
    if (isValidHex(v)) apply(v)
  }

  return (
    <div ref={ref} className={cn("relative inline-flex flex-col gap-1", className)}>
      <button
        ref={triggerRef}
        type="button"
        disabled={disabled}
        onClick={() => open ? setOpen(false) : openPicker()}
        aria-required={required}
        aria-invalid={!!error}
        className={cn(
          "flex items-center gap-2 h-9 px-3 rounded-xl border border-border bg-background text-sm transition-colors hover:border-primary/40 focus:outline-none focus:ring-2 focus:ring-ring",
          disabled && "opacity-50 cursor-not-allowed pointer-events-none",
          error && "border-destructive focus:ring-destructive"
        )}
      >
        <span className="h-5 w-5 rounded-md border border-border/60 shadow-sm shrink-0" style={{ backgroundColor: color }} />
        <span className="font-mono text-xs text-muted-foreground">{color.toUpperCase()}</span>
      </button>

      {open && (
        <FloatingPortal>
          <div className="w-56 rounded-xl border border-border glass shadow-2xl p-3 space-y-3" style={dropStyle}>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={isValidHex(color) ? color : "#000000"}
                onChange={(e) => { setHex(e.target.value); apply(e.target.value) }}
                className="h-8 w-8 rounded-lg border border-border cursor-pointer bg-transparent p-0.5"
              />
              <input
                value={hex}
                onChange={(e) => handleHexInput(e.target.value)}
                maxLength={7}
                className="flex-1 h-8 rounded-lg border border-border bg-background px-2 font-mono text-xs outline-none focus:ring-2 focus:ring-ring"
                placeholder="#000000"
              />
            </div>

            {showOpacity && (
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Opacity</span><span>{opacity}%</span>
                </div>
                <input type="range" min={0} max={100} value={opacity}
                  onChange={(e) => setOpacity(Number(e.target.value))}
                  className="w-full h-1.5 rounded-full accent-primary cursor-pointer"
                />
              </div>
            )}

            {showSwatches && (
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Swatches</p>
                <div className="grid grid-cols-6 gap-1.5">
                  {SWATCHES.map((s) => (
                    <button key={s} type="button" onClick={() => { apply(s); setHex(s) }}
                      className={cn("h-6 w-6 rounded-md border transition-transform hover:scale-110", color === s ? "border-primary ring-1 ring-primary" : "border-border/60")}
                      style={{ backgroundColor: s }} title={s} />
                  ))}
                </div>
              </div>
            )}

            {recent.length > 0 && (
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Recent</p>
                <div className="flex flex-wrap gap-1.5">
                  {recent.map((s) => (
                    <button key={s} type="button" onClick={() => { apply(s); setHex(s) }}
                      className="h-6 w-6 rounded-md border border-border/60 hover:scale-110 transition-transform"
                      style={{ backgroundColor: s }} title={s} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </FloatingPortal>
      )}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
