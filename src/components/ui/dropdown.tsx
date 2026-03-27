import * as React from "react"
import { cn, getPortalPosition, FloatingPortal } from "@/src/lib/utils"

export interface DropdownProps {
  trigger: React.ReactNode
  children: React.ReactNode
  align?: "left" | "right" | "center"
  placement?: "bottom" | "top"
  width?: "sm" | "md" | "lg" | "auto"
  disabled?: boolean
  closeOnSelect?: boolean
  onOpenChange?: (open: boolean) => void
  className?: string
}

const widthMap = {
  sm: 160,
  md: 224,
  lg: 288,
  auto: undefined,
}

export function Dropdown({
  trigger,
  children,
  align = "left",
  placement = "bottom",
  width = "md",
  disabled = false,
  closeOnSelect = true,
  onOpenChange,
  className,
}: DropdownProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const triggerRef = React.useRef<HTMLDivElement>(null)
  const [dropStyle, setDropStyle] = React.useState<React.CSSProperties>({})

  const open = () => {
    if (disabled) return
    if (triggerRef.current) {
      const r = triggerRef.current.getBoundingClientRect()
      const pos = getPortalPosition(triggerRef.current, 320, placement)
      const w = widthMap[width]
      let left = r.left
      if (align === "right") left = r.right - (w ?? r.width)
      if (align === "center") left = r.left + r.width / 2 - (w ?? r.width) / 2
      setDropStyle({
        position: "fixed",
        top: pos.placement === "bottom" ? pos.top : undefined,
        bottom: pos.placement === "top" ? window.innerHeight - r.top + 4 : undefined,
        left,
        width: w,
        minWidth: w ? undefined : "10rem",
        zIndex: 9999,
      })
    }
    setIsOpen(true)
    onOpenChange?.(true)
  }

  const close = () => {
    setIsOpen(false)
    onOpenChange?.(false)
  }

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (triggerRef.current && !triggerRef.current.contains(e.target as Node)) close()
    }
    const handleKeyDown = (e: KeyboardEvent) => { if (e.key === "Escape") close() }
    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen])

  return (
    <div className="relative inline-block text-left" ref={triggerRef}>
      <div
        onClick={() => isOpen ? close() : open()}
        aria-expanded={isOpen}
        aria-haspopup="true"
        className={cn(disabled && "opacity-50 cursor-not-allowed pointer-events-none")}
      >
        {trigger}
      </div>

      {isOpen && (
        <FloatingPortal>
          <div
            className={cn(
              "rounded-xl border border-white/10 bg-background/90 backdrop-blur-2xl text-popover-foreground",
              "shadow-[0_8px_32px_rgba(0,0,0,0.35)] ring-1 ring-white/5",
              "animate-in fade-in-0 zoom-in-95 duration-150",
              className
            )}
            style={dropStyle}
          >
            <div className="py-1.5" onClick={closeOnSelect ? close : undefined}>
              {children}
            </div>
          </div>
        </FloatingPortal>
      )}
    </div>
  )
}

export function DropdownItem({
  children,
  onClick,
  icon,
  disabled = false,
  variant = "default",
  className,
}: {
  children: React.ReactNode
  onClick?: () => void
  icon?: React.ReactNode
  disabled?: boolean
  variant?: "default" | "danger"
  className?: string
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex w-full items-center gap-2.5 px-3.5 py-2 text-left text-sm rounded-lg mx-1 transition-colors duration-100",
        "w-[calc(100%-0.5rem)]",
        variant === "danger"
          ? "text-red-400 hover:bg-red-500/15 hover:text-red-300"
          : "hover:bg-white/8 hover:text-accent-foreground",
        disabled && "opacity-40 cursor-not-allowed pointer-events-none",
        className
      )}
    >
      {icon && <span className="shrink-0 opacity-70">{icon}</span>}
      {children}
    </button>
  )
}

export function DropdownSeparator({ className }: { className?: string }) {
  return <div className={cn("my-1.5 h-px bg-white/8", className)} />
}

export function DropdownLabel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn("px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground/60", className)}>
      {children}
    </p>
  )
}
