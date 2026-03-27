import * as React from "react"
import { PanelLeftClose, PanelLeftOpen, Sun, Moon, Loader2 } from "lucide-react"
import { cn } from "@/src/lib/utils"
import { Tooltip } from "./tooltip"
import { useTheme } from "../theme-provider"

export interface PanelBrand {
  image?: string
  icon?: React.ReactNode
  title?: React.ReactNode
  trailing?: React.ReactNode
}

export interface PanelProfile {
  image?: string
  icon?: React.ReactNode
  content?: React.ReactNode
}

export interface PanelProps {
  sidebar?: React.ReactNode
  sidebarBrand?: PanelBrand
  sidebarProfile?: PanelProfile
  sidebarHeader?: React.ReactNode
  sidebarFooter?: React.ReactNode
  sidebarWidth?: string
  topbar?: React.ReactNode
  topbarTrailing?: React.ReactNode
  defaultCollapsed?: boolean
  collapsed?: boolean
  onCollapsedChange?: (collapsed: boolean) => void
  collapsible?: boolean
  showThemeToggle?: boolean
  defaultPage?: string
  currentPage?: string
  onPageChange?: (page: string) => void
  height?: string
  children?: React.ReactNode
  className?: string
  loading?: boolean
  emptyState?: React.ReactNode
  error?: string | null
  showGroupDividers?: boolean
  expandedGroups?: string[]
  onGroupToggle?: (groupTitle: string, expanded: boolean) => void
  theme?: "light" | "dark" | "auto"
  collapseIcon?: React.ReactNode
  expandIcon?: React.ReactNode
  meta?: Record<string, any>
  actions?: Record<string, () => void>
  keyboardNavigation?: boolean
  draggable?: boolean
  onSidebarReorder?: (items: React.ReactNode[]) => void
  animationDuration?: number
  animationEasing?: string
  sidebarTooltip?: (item: React.ReactNode) => React.ReactNode
  mobileBreakpoint?: number
  mobileCollapsed?: boolean
  onMobileCollapseChange?: (collapsed: boolean) => void
}

const PanelCollapsedContext = React.createContext(false)
const PanelGroupsContext = React.createContext<{
  expandedGroups: Set<string>
  onGroupToggle: (title: string, expanded: boolean) => void
}>({ expandedGroups: new Set(), onGroupToggle: () => {} })

function PanelThemeToggle() {
  const { theme, setTheme } = useTheme()
  return (
    <button
      type="button"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="text-muted-foreground hover:text-foreground transition-colors"
      aria-label="Toggle theme"
    >
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </button>
  )
}

export function Panel({
  sidebar,
  sidebarBrand,
  sidebarProfile,
  sidebarHeader,
  sidebarFooter,
  sidebarWidth = "w-56",
  topbar,
  topbarTrailing,
  defaultCollapsed = false,
  collapsed: controlledCollapsed,
  onCollapsedChange,
  collapsible = false,
  showThemeToggle = false,
  defaultPage,
  currentPage: controlledPage,
  onPageChange,
  height = "h-[520px]",
  children,
  className,
  loading = false,
  emptyState,
  error = null,
  showGroupDividers = false,
  expandedGroups: controlledExpandedGroups,
  onGroupToggle,
  theme: themeProp,
  collapseIcon,
  expandIcon,
  meta,
  actions,
  keyboardNavigation = false,
  draggable = false,
  onSidebarReorder,
  animationDuration = 200,
  animationEasing = "ease-in-out",
  sidebarTooltip,
  mobileBreakpoint = 768,
  mobileCollapsed: controlledMobileCollapsed,
  onMobileCollapseChange,
}: PanelProps) {
  const [internalCollapsed, setInternalCollapsed] = React.useState(defaultCollapsed)
  const [internalPage, setInternalPage] = React.useState(defaultPage || "")
  const [internalExpandedGroups, setInternalExpandedGroups] = React.useState<Set<string>>(
    new Set(controlledExpandedGroups)
  )
  const [isMobile, setIsMobile] = React.useState(false)
  const [internalMobileCollapsed, setInternalMobileCollapsed] = React.useState(true)

  const isCollapsed = controlledCollapsed !== undefined ? controlledCollapsed : internalCollapsed
  const currentPage = controlledPage !== undefined ? controlledPage : internalPage
  const expandedGroups = controlledExpandedGroups !== undefined ? new Set(controlledExpandedGroups) : internalExpandedGroups
  const mobileCollapsed = controlledMobileCollapsed !== undefined ? controlledMobileCollapsed : internalMobileCollapsed

  const handleCollapsedChange = (value: boolean) => {
    if (controlledCollapsed === undefined) setInternalCollapsed(value)
    onCollapsedChange?.(value)
  }

  const handlePageChange = (page: string) => {
    if (controlledPage === undefined) setInternalPage(page)
    onPageChange?.(page)
  }

  const handleGroupToggle = (title: string, expanded: boolean) => {
    if (controlledExpandedGroups === undefined) {
      setInternalExpandedGroups((prev) => {
        const next = new Set(prev)
        if (expanded) next.add(title)
        else next.delete(title)
        return next
      })
    }
    onGroupToggle?.(title, expanded)
  }

  const handleMobileCollapseChange = (value: boolean) => {
    if (controlledMobileCollapsed === undefined) setInternalMobileCollapsed(value)
    onMobileCollapseChange?.(value)
  }

  React.useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < mobileBreakpoint
      setIsMobile(mobile)
      if (mobile && !internalMobileCollapsed) {
        handleMobileCollapseChange(true)
      }
    }
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [mobileBreakpoint, internalMobileCollapsed])

  const handleKeyDown = React.useCallback(
    (e: KeyboardEvent) => {
      if (!keyboardNavigation) return
      if (e.key === "Escape" && !isCollapsed && collapsible) {
        handleCollapsedChange(true)
      }
      if (e.key === "Enter" && isCollapsed && collapsible) {
        handleCollapsedChange(false)
      }
    },
    [keyboardNavigation, isCollapsed, collapsible]
  )

  React.useEffect(() => {
    if (keyboardNavigation) {
      window.addEventListener("keydown", handleKeyDown)
      return () => window.removeEventListener("keydown", handleKeyDown)
    }
  }, [keyboardNavigation, handleKeyDown])

  const effectiveCollapsed = isMobile ? mobileCollapsed : isCollapsed
  const animStyle = {
    transitionDuration: `${animationDuration}ms`,
    transitionTimingFunction: animationEasing,
  }

  const hasContent = React.Children.count(children) > 0
  const showEmpty = !loading && !hasContent && emptyState

  return (
    <PanelCollapsedContext.Provider value={effectiveCollapsed}>
      <PanelGroupsContext.Provider value={{ expandedGroups, onGroupToggle: handleGroupToggle }}>
        <div
          className={cn(
            "relative flex overflow-hidden rounded-xl border border-border bg-background shadow-lg",
            height,
            className
          )}
          style={{ ...animStyle } as React.CSSProperties}
        >
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -top-[40%] -left-[20%] h-[80%] w-[60%] rounded-full bg-primary/10 blur-[120px]" />
            <div className="absolute -bottom-[40%] -right-[20%] h-[80%] w-[60%] rounded-full bg-info/10 blur-[120px]" />
          </div>

          {sidebar && (
            <aside
              className={cn(
                "relative z-10 flex flex-col shrink-0 border-r border-border transition-all",
                effectiveCollapsed ? "w-14" : sidebarWidth
              )}
              style={{ transitionDuration: `${animationDuration}ms`, transitionTimingFunction: animationEasing }}
            >
              {(sidebarBrand || sidebarHeader) && (
                <div
                  className={cn(
                    "shrink-0 border-b border-border",
                    effectiveCollapsed ? "flex items-center justify-center py-3" : "flex items-center gap-2 px-4 py-3"
                  )}
                >
                  {sidebarBrand ? (
                    effectiveCollapsed ? (
                      sidebarBrand.image ? (
                        <img src={sidebarBrand.image} alt="logo" className="h-7 w-7 rounded-md object-cover shrink-0" />
                      ) : (
                        <span className="shrink-0">{sidebarBrand.icon}</span>
                      )
                    ) : (
                      <>
                        {sidebarBrand.image ? (
                          <img src={sidebarBrand.image} alt="logo" className="h-7 w-7 rounded-md object-cover shrink-0" />
                        ) : (
                          sidebarBrand.icon && <span className="shrink-0">{sidebarBrand.icon}</span>
                        )}
                        {sidebarBrand.title && (
                          <span className="flex-1 truncate text-sm font-semibold">{sidebarBrand.title}</span>
                        )}
                        {sidebarBrand.trailing && <span className="shrink-0">{sidebarBrand.trailing}</span>}
                      </>
                    )
                  ) : (
                    !effectiveCollapsed && <div className="text-sm font-semibold">{sidebarHeader}</div>
                  )}
                </div>
              )}

              <div className="flex-1 overflow-y-auto py-2">{sidebar}</div>

              {(sidebarProfile || sidebarFooter) && (
                <div
                  className={cn(
                    "shrink-0 border-t border-border",
                    effectiveCollapsed ? "flex items-center justify-center py-3" : "px-4 py-3"
                  )}
                >
                  {sidebarProfile ? (
                    effectiveCollapsed ? (
                      sidebarProfile.image ? (
                        <img src={sidebarProfile.image} alt="profile" className="h-7 w-7 rounded-full object-cover shrink-0" />
                      ) : (
                        <span className="shrink-0">{sidebarProfile.icon}</span>
                      )
                    ) : (
                      sidebarProfile.content ?? (
                        <div className="flex items-center gap-2">
                          {sidebarProfile.image ? (
                            <img src={sidebarProfile.image} alt="profile" className="h-7 w-7 rounded-full object-cover shrink-0" />
                          ) : (
                            sidebarProfile.icon && <span className="shrink-0">{sidebarProfile.icon}</span>
                          )}
                        </div>
                      )
                    )
                  ) : (
                    !effectiveCollapsed && sidebarFooter
                  )}
                </div>
              )}
            </aside>
          )}

          <div className="relative z-10 flex flex-1 min-w-0 flex-col">
            <header className="flex h-14 shrink-0 items-center justify-between border-b border-b-slate-300/50 px-4 gap-2">
              <div className="flex items-center gap-2">
                {collapsible && sidebar && (
                  <Tooltip
                    content={effectiveCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                    side="bottom"
                  >
                    <button
                      type="button"
                      onClick={() => {
                        if (isMobile) {
                          handleMobileCollapseChange(!mobileCollapsed)
                        } else {
                          handleCollapsedChange(!isCollapsed)
                        }
                      }}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                      aria-label={effectiveCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                    >
                      {effectiveCollapsed ? (expandIcon || <PanelLeftOpen className="h-5 w-5" />) : (collapseIcon || <PanelLeftClose className="h-5 w-5" />)}
                    </button>
                  </Tooltip>
                )}
                {topbar && <div className="flex items-center gap-2">{topbar}</div>}
              </div>
              <div className="flex items-center gap-2">
                {topbarTrailing}
                {showThemeToggle && <PanelThemeToggle />}
              </div>
            </header>

            <main className="flex-1 overflow-y-auto p-4">
              {error && (
                <div className="mb-4 p-3 rounded-md bg-destructive/50 text-destructive text-sm">
                  {error}
                </div>
              )}
              {loading && (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              )}
              {showEmpty && <div className="flex items-center justify-center h-full text-muted-foreground">{emptyState}</div>}
              {!loading && !showEmpty && children}
            </main>
          </div>
        </div>
      </PanelGroupsContext.Provider>
    </PanelCollapsedContext.Provider>
  )
}

export function PanelSidebarItem({
  icon: Icon,
  label,
  active,
  onClick,
}: {
  icon?: React.ElementType
  label: string
  active?: boolean
  onClick?: () => void
}) {
  const collapsed = React.useContext(PanelCollapsedContext)

  return (
    <Tooltip content={label} side="right" enabled={collapsed}>
      <button
        type="button"
        onClick={onClick}
        className={cn(
          "flex w-full items-center rounded-md text-sm font-medium transition-colors",
          collapsed ? "justify-center h-9 w-9 mx-auto px-0" : "gap-2 px-3 py-2",
          active
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:bg-primary/20 hover:text-primary cursor-pointer"
        )}
      >
        {Icon && <Icon className="h-4 w-4 shrink-0" />}
        {!collapsed && <span className="truncate">{label}</span>}
      </button>
    </Tooltip>
  )
}

export function PanelSidebarGroup({
  title,
  children,
}: {
  title?: string
  children: React.ReactNode
}) {
  const collapsed = React.useContext(PanelCollapsedContext)
  const { expandedGroups, onGroupToggle } = React.useContext(PanelGroupsContext)
  const isExpanded = title ? expandedGroups.has(title) : true

  return (
    <div className="px-2 py-1">
      {title && !collapsed && (
        <button
          type="button"
          onClick={() => onGroupToggle(title, !isExpanded)}
          className="mb-1 px-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors w-full text-left"
        >
          {title}
        </button>
      )}
      {title && collapsed && <div className="mx-1 mb-1 h-px bg-border" />}
      {(!title || isExpanded) && <main className="space-y-0.5">{children}</main>}
    </div>
  )
}
