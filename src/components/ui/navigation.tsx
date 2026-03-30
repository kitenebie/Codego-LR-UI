import * as React from "react"
import { cn } from "@/src/lib/utils"
import { ChevronDown, ChevronRight } from "lucide-react"
import { PanelCollapsedContext } from "./panel"

// ─── LeftSidebar ────────────────────────────────────────────────────────────

export interface LeftSidebarProps {
  /** Width of the sidebar, default "w-64" */
  width?: string
  /** Header slot (logo, brand) */
  header?: React.ReactNode
  /** Footer slot (user profile, logout) */
  footer?: React.ReactNode
  children?: React.ReactNode
  className?: string
  /** Collapsed state — icon-only mode */
  collapsed?: boolean
}

export function LeftSidebar({
  width = "w-64",
  header,
  footer,
  children,
  className,
  collapsed = false,
}: LeftSidebarProps) {
  return (
    <aside
      className={cn(
        "flex flex-col h-full border-r glass transition-all duration-300 ease-in-out overflow-hidden",
        collapsed ? "w-16" : width,
        className
      )}
    >
      {header && (
        <div className={cn(
          "flex h-16 shrink-0 items-center border-b transition-all duration-300",
          collapsed ? "justify-center px-0" : "px-5"
        )}>
          {header}
        </div>
      )}
      <div className="flex-1 overflow-y-auto overflow-x-hidden py-2">{children}</div>
      {footer && (
        <div className={cn(
          "shrink-0 border-t transition-all duration-300",
          collapsed ? "flex justify-center p-2" : "p-4"
        )}>
          {footer}
        </div>
      )}
    </aside>
  )
}

// ─── RightSidebar ────────────────────────────────────────────────────────────

export interface RightSidebarProps {
  /** Width of the sidebar, default "w-72" */
  width?: string
  /** Header slot */
  header?: React.ReactNode
  /** Footer slot */
  footer?: React.ReactNode
  children?: React.ReactNode
  className?: string
  /** Stick the sidebar to the viewport — position: sticky, top-0, self-start */
  sticky?: boolean
  /** Max height when sticky, default "100vh" */
  stickyMaxHeight?: string
}

export function RightSidebar({
  width = "w-72",
  header,
  footer,
  children,
  className,
  sticky = false,
  stickyMaxHeight = "100vh",
}: RightSidebarProps) {
  return (
    <aside
      className={cn(
        "flex flex-col h-full border-l glass transition-all duration-200 overflow-hidden",
        width,
        className
      )}
    >
      {header && (
        <div className="flex h-16 shrink-0 items-center border-b px-4">
          {header}
        </div>
      )}
      <div className="flex-1 overflow-y-auto py-2">{children}</div>
      {footer && (
        <div className="shrink-0 border-t p-4">{footer}</div>
      )}
    </aside>
  )
}

// ─── Topbar ──────────────────────────────────────────────────────────────────

export interface TopbarProps {
  /** Left slot — logo, hamburger, breadcrumb */
  left?: React.ReactNode
  /** Center slot — search, title */
  center?: React.ReactNode
  /** Right slot — actions, avatar, notifications */
  right?: React.ReactNode
  /** Height class, default "h-16" */
  height?: string
  /** Sticky to top */
  sticky?: boolean
  className?: string
}

export function Topbar({
  left,
  center,
  right,
  height = "h-16",
  sticky = false,
  className,
}: TopbarProps) {
  return (
    <header
      className={cn(
        "flex shrink-0 items-center justify-between border-b glass px-4 sm:px-6",
        height,
        sticky && "sticky top-0 z-40",
        className
      )}
    >
      <div className="flex items-center gap-3">{left}</div>
      {center && <div className="flex items-center gap-3">{center}</div>}
      <div className="flex items-center gap-3">{right}</div>
    </header>
  )
}

// ─── Navigation ──────────────────────────────────────────────────────────────

export interface NavItem {
  label: string
  value: string
  icon?: React.ReactNode
  badge?: React.ReactNode
  disabled?: boolean
  href?: string
}

export interface NavigationProps {
  items: NavItem[]
  /** "vertical" | "horizontal", default "vertical" */
  orientation?: "vertical" | "horizontal"
  /** Active item value */
  value?: string
  onChange?: (value: string) => void
  className?: string
  /** Collapsed — show icons only (vertical) */
  collapsed?: boolean
}

export function Navigation({
  items,
  orientation = "vertical",
  value,
  onChange,
  className,
  collapsed = false,
}: NavigationProps) {
  const [active, setActive] = React.useState(value ?? items[0]?.value ?? "")

  const current = value ?? active

  function handleClick(item: NavItem) {
    if (item.disabled) return
    setActive(item.value)
    onChange?.(item.value)
  }

  return (
    <nav
      className={cn(
        orientation === "horizontal" ? "flex items-center gap-1" : "flex flex-col gap-1 px-3",
        className
      )}
    >
      {items.map((item) => (
        <button
          key={item.value}
          disabled={item.disabled}
          onClick={() => handleClick(item)}
          title={collapsed ? item.label : undefined}
          className={cn(
            "flex items-center rounded-md text-sm font-medium transition-colors",
            orientation === "horizontal" ? "px-3 py-2" : "w-full px-3 py-2",
            collapsed && "justify-center px-0 py-2 w-10 h-10 mx-auto",
            current === item.value
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-primary/20 hover:text-primary",
            item.disabled && "pointer-events-none opacity-40"
          )}
        >
          {item.icon && (
            <span className={cn("shrink-0", !collapsed && "mr-3")}>{item.icon}</span>
          )}
          {!collapsed && <span className="flex-1 text-left">{item.label}</span>}
          {!collapsed && item.badge && <span className="ml-auto">{item.badge}</span>}
        </button>
      ))}
    </nav>
  )
}

// ─── GroupNavigation ─────────────────────────────────────────────────────────

export interface NavGroup {
  label: string
  items: NavItem[]
  /** Collapsible group */
  collapsible?: boolean
  /** Default open state for collapsible groups */
  defaultOpen?: boolean
}

export interface GroupNavigationProps {
  groups: NavGroup[]
  value?: string
  onChange?: (value: string) => void
  className?: string
  collapsed?: boolean
}

export function GroupNavigation({
  groups,
  value,
  onChange,
  className,
  collapsed = false,
}: GroupNavigationProps) {
  const contextCollapsed = React.useContext(PanelCollapsedContext)
  const effectiveCollapsed = collapsed || contextCollapsed

  const [active, setActive] = React.useState(value ?? groups[0]?.items[0]?.value ?? "")
  const [openGroups, setOpenGroups] = React.useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {}
    groups.forEach((g) => { init[g.label] = g.defaultOpen !== false })
    return init
  })

  const current = value ?? active

  function handleClick(item: NavItem) {
    if (item.disabled) return
    setActive(item.value)
    onChange?.(item.value)
  }

  function toggleGroup(label: string) {
    setOpenGroups((prev) => ({ ...prev, [label]: !prev[label] }))
  }

  return (
    <div className={cn("space-y-1", className)}>
      {groups.map((group) => {
        const isOpen = openGroups[group.label] !== false
        return (
          <div key={group.label} className="py-2">
            {!effectiveCollapsed && (
              <button
                onClick={() => group.collapsible && toggleGroup(group.label)}
                className={cn(
                  "flex w-full items-center px-6 mb-1",
                  group.collapsible && "cursor-pointer hover:text-foreground"
                )}
              >
                <span className="flex-1 text-xs font-semibold uppercase tracking-wider text-primary/50 text-left">
                  {group.label}
                </span>
                {group.collapsible && (
                  isOpen
                    ? <ChevronDown className="h-3 w-3 text-muted-foreground" />
                    : <ChevronRight className="h-3 w-3 text-muted-foreground" />
                )}
              </button>
            )}
            {(!group.collapsible || isOpen) && (
              <nav className="space-y-1 px-3">
                {group.items.map((item) => (
                  <button
                    key={item.value}
                    disabled={item.disabled}
                    onClick={() => handleClick(item)}
                    title={effectiveCollapsed ? item.label : undefined}
                    className={cn(
                      "flex w-full items-center rounded-md text-sm font-medium transition-colors",
                      effectiveCollapsed ? "justify-center px-0 py-2 w-10 h-10 mx-auto" : "px-3 py-2",
                      current === item.value
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-primary/20 hover:text-primary",
                      item.disabled && "pointer-events-none opacity-40"
                    )}
                  >
                    {item.icon && (
                      <span className={cn("shrink-0", !effectiveCollapsed && "mr-3")}>{item.icon}</span>
                    )}
                    {!effectiveCollapsed && <span className="flex-1 text-left">{item.label}</span>}
                    {!effectiveCollapsed && item.badge && <span className="ml-auto">{item.badge}</span>}
                  </button>
                ))}
              </nav>
            )}
          </div>
        )
      })}
    </div>
  )
}
