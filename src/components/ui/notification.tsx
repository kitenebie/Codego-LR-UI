import * as React from "react"
import { X, CheckCircle, AlertTriangle, Info, XCircle, Bell, BellDot } from "lucide-react"
import { cn } from "@/src/lib/utils"

// ─── Types ────────────────────────────────────────────────────────────────────

export type ToastVariant = "default" | "success" | "error" | "warning" | "info"
export type ToastPosition =
  | "top-left" | "top-center" | "top-right"
  | "bottom-left" | "bottom-center" | "bottom-right"

export interface ToastItem {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  variant?: ToastVariant
  /** Duration in ms before auto-dismiss. 0 = no auto-dismiss */
  duration?: number
  /** Show a progress bar counting down the duration */
  showProgress?: boolean
  /** Custom icon — overrides the variant icon */
  icon?: React.ReactNode
  /** Action button */
  action?: { label: string; onClick: () => void }
  /** Whether the toast can be manually closed */
  closable?: boolean
  /** Override the provider's default position for this toast */
  position?: ToastPosition
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface ToastContextValue {
  toast: (item: Omit<ToastItem, "id">) => string
  dismiss: (id: string) => void
  dismissAll: () => void
}

const ToastContext = React.createContext<ToastContextValue>({
  toast: () => "",
  dismiss: () => {},
  dismissAll: () => {},
})

export function useToast() {
  return React.useContext(ToastContext)
}

// ─── Variant config ───────────────────────────────────────────────────────────

const VARIANT_CONFIG: Record<ToastVariant, { icon: React.ReactNode; bar: string; ring: string }> = {
  default: { icon: <Bell className="h-4 w-4" />,          bar: "bg-primary",  ring: "border-primary/30" },
  success: { icon: <CheckCircle className="h-4 w-4" />,   bar: "bg-success",  ring: "border-success/30" },
  error:   { icon: <XCircle className="h-4 w-4" />,       bar: "bg-danger",   ring: "border-danger/30" },
  warning: { icon: <AlertTriangle className="h-4 w-4" />, bar: "bg-warning",  ring: "border-warning/30" },
  info:    { icon: <Info className="h-4 w-4" />,          bar: "bg-info",     ring: "border-info/30" },
}

const VARIANT_ICON_COLOR: Record<ToastVariant, string> = {
  default: "text-primary",
  success: "text-success",
  error:   "text-danger",
  warning: "text-warning",
  info:    "text-info",
}

// ─── Single Toast ─────────────────────────────────────────────────────────────

function ToastCard({
  item,
  onDismiss,
  position = "bottom-right",
}: {
  item: ToastItem
  onDismiss: (id: string) => void
  position?: ToastPosition
}) {
  const {
    id, title, description, variant = "default",
    duration = 4000, showProgress = true,
    icon, action, closable = true,
  } = item

  const [progress, setProgress] = React.useState(100)
  const [visible, setVisible] = React.useState(false)

  // Entrance animation
  React.useEffect(() => {
    requestAnimationFrame(() => setVisible(true))
  }, [])

  // Progress + auto-dismiss
  React.useEffect(() => {
    if (!duration) return
    const start = Date.now()
    const tick = () => {
      const elapsed = Date.now() - start
      const pct = Math.max(0, 100 - (elapsed / duration) * 100)
      setProgress(pct)
      if (pct > 0) {
        raf = requestAnimationFrame(tick)
      } else {
        handleDismiss()
      }
    }
    let raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [duration])

  function handleDismiss() {
    setVisible(false)
    setTimeout(() => onDismiss(id), 200)
  }

  const cfg = VARIANT_CONFIG[variant]
  const iconEl = icon ?? cfg.icon

  return (
    <div
      className={cn(
        "relative flex w-full max-w-sm overflow-hidden rounded-xl border glass shadow-2xl transition-all duration-200",
        cfg.ring,
        visible ? "opacity-100 translate-y-0 scale-100" : position.startsWith("top") ? "opacity-0 -translate-y-2 scale-95" : "opacity-0 translate-y-2 scale-95"
      )}
    >
      {/* Left accent bar */}
      <div className={cn("w-1 shrink-0", cfg.bar)} />

      <div className="flex flex-1 gap-3 p-4">
        {/* Icon */}
        <span className={cn("mt-0.5 shrink-0", VARIANT_ICON_COLOR[variant])}>
          {iconEl}
        </span>

        {/* Content */}
        <div className="flex-1 min-w-0 space-y-1">
          {title && <p className="text-sm font-semibold leading-tight">{title}</p>}
          {description && <p className="text-xs text-muted-foreground leading-snug">{description}</p>}
          {action && (
            <button
              onClick={() => { action.onClick(); handleDismiss() }}
              className="mt-1 text-xs font-medium text-primary hover:underline"
            >
              {action.label}
            </button>
          )}
        </div>

        {/* Close */}
        {closable && (
          <button
            onClick={handleDismiss}
            className="shrink-0 mt-0.5 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Progress bar */}
      {showProgress && !!duration && (
        <div className="absolute bottom-0 left-1 right-0 h-0.5 bg-border">
          <div
            className={cn("h-full transition-none", cfg.bar, "opacity-60")}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  )
}

// ─── Position classes ─────────────────────────────────────────────────────────

const POSITION_CLASSES: Record<ToastPosition, string> = {
  "top-left":      "top-4 left-4 items-start",
  "top-center":    "top-4 left-1/2 -translate-x-1/2 items-center",
  "top-right":     "top-4 right-4 items-end",
  "bottom-left":   "bottom-4 left-4 items-start",
  "bottom-center": "bottom-4 left-1/2 -translate-x-1/2 items-center",
  "bottom-right":  "bottom-4 right-4 items-end",
}

// ─── ToastProvider ────────────────────────────────────────────────────────────

export interface ToastProviderProps {
  children: React.ReactNode
  /** Default position for all toasts */
  position?: ToastPosition
  /** Max toasts visible at once */
  maxToasts?: number
}

const ALL_POSITIONS: ToastPosition[] = [
  "top-left", "top-center", "top-right",
  "bottom-left", "bottom-center", "bottom-right",
]

export function ToastProvider({
  children,
  position = "bottom-right",
  maxToasts = 5,
}: ToastProviderProps) {
  const [toasts, setToasts] = React.useState<ToastItem[]>([])

  function toast(item: Omit<ToastItem, "id">) {
    const id = Math.random().toString(36).slice(2)
    setToasts((prev) => {
      const next = [{ ...item, id }, ...prev]
      return next.slice(0, maxToasts)
    })
    return id
  }

  function dismiss(id: string) {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  function dismissAll() {
    setToasts([])
  }

  return (
    <ToastContext.Provider value={{ toast, dismiss, dismissAll }}>
      {children}
      {ALL_POSITIONS.map((pos) => {
        const group = toasts.filter((t) => (t.position ?? position) === pos)
        if (!group.length) return null
        return (
          <div key={pos} className={cn("fixed z-[100] flex flex-col gap-2 pointer-events-none", POSITION_CLASSES[pos])}>
            {group.map((t) => (
              <div key={t.id} className="pointer-events-auto w-full">
                <ToastCard item={t} onDismiss={dismiss} position={pos} />
              </div>
            ))}
          </div>
        )
      })}
    </ToastContext.Provider>
  )
}

// ─── Notification ─────────────────────────────────────────────────────────────

export type NotificationVariant = "default" | "success" | "error" | "warning" | "info"

export interface NotificationItem {
  id: string
  title: React.ReactNode
  description?: React.ReactNode
  variant?: NotificationVariant
  /** Timestamp label e.g. "2m ago" */
  time?: string
  /** Avatar or icon node shown on the left */
  avatar?: React.ReactNode
  /** Whether the notification has been read */
  read?: boolean
  /** Click handler for the whole row */
  onClick?: () => void
  /** Action buttons */
  actions?: { label: string; onClick: () => void; variant?: "primary" | "ghost" }[]
}

export interface NotificationPanelProps {
  items: NotificationItem[]
  /** Header title */
  title?: string
  /** Show a badge with unread count on the bell icon trigger */
  showBadge?: boolean
  /** Called when "Mark all read" is clicked */
  onMarkAllRead?: () => void
  /** Called when "Clear all" is clicked */
  onClearAll?: () => void
  /** Called when a single item is dismissed */
  onDismiss?: (id: string) => void
  /** Empty state message */
  emptyMessage?: string
  className?: string
  /** Max height of the list */
  maxHeight?: string
}

const NOTIF_ICON: Record<NotificationVariant, React.ReactNode> = {
  default: <Bell className="h-4 w-4 text-primary" />,
  success: <CheckCircle className="h-4 w-4 text-success" />,
  error:   <XCircle className="h-4 w-4 text-danger" />,
  warning: <AlertTriangle className="h-4 w-4 text-warning" />,
  info:    <Info className="h-4 w-4 text-info" />,
}

const NOTIF_DOT: Record<NotificationVariant, string> = {
  default: "bg-primary",
  success: "bg-success",
  error:   "bg-danger",
  warning: "bg-warning",
  info:    "bg-info",
}

export function NotificationPanel({
  items,
  title = "Notifications",
  showBadge = true,
  onMarkAllRead,
  onClearAll,
  onDismiss,
  emptyMessage = "No notifications",
  className,
  maxHeight = "max-h-[480px]",
}: NotificationPanelProps) {
  const [open, setOpen] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)
  const unread = items.filter((i) => !i.read).length

  React.useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  return (
    <div ref={ref} className={cn("relative inline-block", className)}>
      {/* Trigger */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
      >
        {unread > 0 && showBadge
          ? <BellDot className="h-5 w-5" />
          : <Bell className="h-5 w-5" />
        }
        {unread > 0 && showBadge && (
          <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-danger text-[10px] font-bold text-white leading-none">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {/* Panel */}
      {open && (
        <div className={cn(
          "absolute right-0 top-11 z-50 w-80 rounded-xl border glass shadow-2xl overflow-hidden",
        )}>
          {/* Header */}
          <div className="flex items-center justify-between border-b px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm">{title}</span>
              {unread > 0 && (
                <span className="rounded-full bg-primary/15 text-primary text-[10px] font-bold px-1.5 py-0.5 leading-none">
                  {unread}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {onMarkAllRead && (
                <button
                  onClick={onMarkAllRead}
                  className="text-xs text-muted-foreground hover:text-primary transition-colors"
                >
                  Mark all read
                </button>
              )}
              {onClearAll && (
                <button
                  onClick={onClearAll}
                  className="text-xs text-muted-foreground hover:text-danger transition-colors"
                >
                  Clear all
                </button>
              )}
            </div>
          </div>

          {/* List */}
          <div className={cn("overflow-y-auto", maxHeight)}>
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground gap-2">
                <Bell className="h-8 w-8 opacity-30" />
                <p className="text-sm">{emptyMessage}</p>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  onClick={item.onClick}
                  className={cn(
                    "group relative flex gap-3 px-4 py-3 border-b last:border-0 transition-colors",
                    item.onClick && "cursor-pointer hover:bg-accent/50",
                    !item.read && "bg-primary/5"
                  )}
                >
                  {/* Unread dot */}
                  {!item.read && (
                    <span className={cn(
                      "absolute left-1.5 top-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full",
                      NOTIF_DOT[item.variant ?? "default"]
                    )} />
                  )}

                  {/* Avatar / icon */}
                  <div className="shrink-0 mt-0.5">
                    {item.avatar ?? (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent">
                        {NOTIF_ICON[item.variant ?? "default"]}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 space-y-0.5">
                    <div className="flex items-start justify-between gap-2">
                      <p className={cn("text-sm leading-tight", !item.read && "font-semibold")}>
                        {item.title}
                      </p>
                      {item.time && (
                        <span className="shrink-0 text-[10px] text-muted-foreground">{item.time}</span>
                      )}
                    </div>
                    {item.description && (
                      <p className="text-xs text-muted-foreground leading-snug line-clamp-2">
                        {item.description}
                      </p>
                    )}
                    {item.actions && item.actions.length > 0 && (
                      <div className="flex gap-2 pt-1">
                        {item.actions.map((a, i) => (
                          <button
                            key={i}
                            onClick={(e) => { e.stopPropagation(); a.onClick() }}
                            className={cn(
                              "text-xs font-medium rounded px-2 py-0.5 transition-colors",
                              a.variant === "ghost"
                                ? "text-muted-foreground hover:text-foreground"
                                : "text-primary hover:bg-primary/10"
                            )}
                          >
                            {a.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Dismiss */}
                  {onDismiss && (
                    <button
                      onClick={(e) => { e.stopPropagation(); onDismiss(item.id) }}
                      className="shrink-0 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-foreground transition-all mt-0.5"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Inline Notification Banner ───────────────────────────────────────────────

export interface NotificationBannerProps {
  variant?: NotificationVariant
  title?: React.ReactNode
  description?: React.ReactNode
  icon?: React.ReactNode
  closable?: boolean
  onClose?: () => void
  action?: { label: string; onClick: () => void }
  className?: string
}

const BANNER_STYLES: Record<NotificationVariant, string> = {
  default: "bg-primary/10 border-primary/20 text-primary",
  success: "bg-success/10 border-success/20 text-success",
  error:   "bg-danger/10 border-danger/20 text-danger",
  warning: "bg-warning/10 border-warning/20 text-warning",
  info:    "bg-info/10 border-info/20 text-info",
}

export function NotificationBanner({
  variant = "default",
  title,
  description,
  icon,
  closable = true,
  onClose,
  action,
  className,
}: NotificationBannerProps) {
  const [closed, setClosed] = React.useState(false)
  if (closed) return null

  const iconEl = icon ?? NOTIF_ICON[variant]

  function handleClose() {
    setClosed(true)
    onClose?.()
  }

  return (
    <div className={cn(
      "flex items-start gap-3 rounded-xl border px-4 py-3",
      BANNER_STYLES[variant],
      className
    )}>
      <span className="shrink-0 mt-0.5">{iconEl}</span>
      <div className="flex-1 min-w-0">
        {title && <p className="text-sm font-semibold">{title}</p>}
        {description && <p className="text-xs opacity-80 mt-0.5">{description}</p>}
        {action && (
          <button
            onClick={action.onClick}
            className="mt-1.5 text-xs font-semibold underline underline-offset-2 hover:opacity-80 transition-opacity"
          >
            {action.label}
          </button>
        )}
      </div>
      {closable && (
        <button onClick={handleClose} className="shrink-0 mt-0.5 opacity-60 hover:opacity-100 transition-opacity">
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  )
}
